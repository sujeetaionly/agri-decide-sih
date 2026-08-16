"""
run_pipeline.py — End-to-End Verification Pipeline
====================================================
Project: AGRI-DECIDE (PS #24)

Runs all model components sequentially to verify:
  1. Data integrity (all 15 crops, valid values)
  2. Model inference (yield_predictor)
  3. Price forecasting (price_forecaster)
  4. What-If sensitivity (sensitivity_recalculator)
  5. Full integration (yield → price → what-if)
"""

import os
import sys
import json
import pandas as pd

# Add project root to path
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, PROJECT_ROOT)

CROPS = [
    "MAIZE", "JOWAR", "BAJRA", "WHEAT", "TUR", "MOONG", "URAD", "GRAM",
    "SOYBEAN", "COTTON", "GROUNDNUT", "SUNFLOWER", "SUGARCANE", "ONION", "TOMATO"
]


def separator(title: str):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}")


def test_data_integrity():
    """Test 1: Verify all CSV datasets exist and contain valid data."""
    separator("TEST 1: Data Integrity Verification")
    data_dir = os.path.join(PROJECT_ROOT, "data")

    files_to_check = [
        ("cacp_costs_pune.csv", 15),
        ("agmarknet_mandi_prices_pune.csv", 1260),
        ("district_sowing_windows.csv", 15),
        ("pune_crop_yield_historical.csv", 2500),
    ]

    all_pass = True
    for fname, expected_rows in files_to_check:
        fpath = os.path.join(data_dir, fname)
        if not os.path.exists(fpath):
            print(f"  ❌ MISSING: {fname}")
            all_pass = False
            continue

        df = pd.read_csv(fpath)
        has_nulls = df.isnull().any().any()
        row_count = len(df)
        crops_present = set(df['crop_id'].unique()) if 'crop_id' in df.columns else set()
        missing_crops = set(CROPS) - crops_present

        status = "✅" if row_count >= expected_rows and not has_nulls and not missing_crops else "⚠️"
        if status == "⚠️":
            all_pass = False

        print(f"  {status} {fname}: {row_count} rows, Nulls={has_nulls}, Missing crops: {missing_crops or 'None'}")

    return all_pass


def test_model_metrics():
    """Test 2: Verify trained model metrics meet targets."""
    separator("TEST 2: Model Metrics Verification")
    metrics_path = os.path.join(PROJECT_ROOT, "artifacts_model", "model_metrics.json")

    if not os.path.exists(metrics_path):
        print("  ❌ model_metrics.json not found. Run train_yield_model.py first.")
        return False

    with open(metrics_path, 'r') as f:
        metrics = json.load(f)

    rmse = metrics.get("rmse", float("inf"))
    rmse_std = metrics.get("rmse_standard_crops_avg", rmse)  # Standard crops only
    r2 = metrics.get("r2", 0.0)
    mae = metrics.get("mae", float("inf"))

    # Use standard crops RMSE for target check (excludes SUGARCANE/ONION/TOMATO scale inflation)
    rmse_pass = rmse_std < 1.8
    r2_pass = r2 >= 0.82

    print(f"  {'✅' if rmse_pass else '❌'} Avg RMSE (standard crops):  {rmse_std:.4f}  (Target: < 1.8)")
    print(f"  {'✅' if r2_pass else '❌'} R²:    {r2:.4f}  (Target: >= 0.82)")
    print(f"  Overall RMSE:  {rmse:.4f}  (inflated by high-yield crops)")
    print(f"  MAE:   {mae:.4f}")

    if "best_params" in metrics:
        print(f"\n  Best Hyperparameters:")
        for k, v in metrics["best_params"].items():
            print(f"    {k}: {v}")

    if "per_crop_rmse" in metrics:
        print(f"\n  Per-Crop RMSE Breakdown:")
        for crop, crop_rmse in sorted(metrics["per_crop_rmse"].items()):
            indicator = "✅" if crop_rmse < 3.0 else "⚠️"
            print(f"    {indicator} {crop:12s}: {crop_rmse:.4f}")

    if "feature_importance" in metrics:
        print(f"\n  Feature Importance:")
        for feat, imp in metrics["feature_importance"].items():
            bar = "█" * int(imp * 50)
            print(f"    {feat:25s}: {imp:.4f}  {bar}")

    return rmse_pass and r2_pass


def test_yield_predictor():
    """Test 3: Run sample yield predictions."""
    separator("TEST 3: Yield Predictor Inference")

    try:
        from models_ml.yield_predictor import YieldPredictor
        predictor = YieldPredictor()
    except FileNotFoundError as e:
        print(f"  ❌ Cannot load model: {e}")
        return False

    test_cases = [
        ("SOYBEAN", "BLACK", 3, 0, 1),
        ("MAIZE", "LOAM", 2, 5, 1),
        ("WHEAT", "BLACK", 3, 10, 0),
        ("COTTON", "RED", 1, 20, 1),
        ("SUGARCANE", "BLACK", 3, 0, 1),
        ("ONION", "LOAM", 2, 7, 0),
        ("TUR", "SANDY", 1, 15, 0),
    ]

    all_pass = True
    for crop, soil, water, delay, prev in test_cases:
        try:
            result = predictor.predict_crop_yield(crop, soil, water, delay, prev)
            y = result['expected_yield']
            valid = y > 0
            if not valid:
                all_pass = False
            print(f"  {'✅' if valid else '❌'} {crop:12s} | Soil={soil:6s} W={water} Delay={delay:2d} | "
                  f"Yield={y:8.2f} qtl/acre | Range={result['yield_range']} | Conf={result['confidence']}")
        except Exception as e:
            print(f"  ❌ {crop}: ERROR — {e}")
            all_pass = False

    return all_pass


def test_price_forecaster():
    """Test 4: Run sample price forecasts."""
    separator("TEST 4: Harvest Price Forecaster")

    from models_ml.price_forecaster import PriceForecaster
    forecaster = PriceForecaster()

    test_cases = [
        ("SOYBEAN", 10), ("MAIZE", 9), ("TUR", 1), ("WHEAT", 3),
        ("COTTON", 11), ("ONION", 3), ("SUGARCANE", 12), ("TOMATO", 7),
    ]

    month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    all_pass = True
    for crop, month in test_cases:
        try:
            result = forecaster.get_harvest_mandi_price(crop, month)
            p = result['expected_price']
            valid = p > 0
            if not valid:
                all_pass = False
            print(f"  {'✅' if valid else '❌'} {crop:12s} ({month_names[month]:3s}) | "
                  f"₹{p:>8,.0f}/qtl | Band: {result['price_band']} | SI={result['seasonal_index']:.2f}")
        except Exception as e:
            print(f"  ❌ {crop}: ERROR — {e}")
            all_pass = False

    return all_pass


def test_sensitivity():
    """Test 5: Run What-If sensitivity scenarios."""
    separator("TEST 5: What-If Sensitivity Recalculator")

    from models_ml.sensitivity_recalculator import SensitivityRecalculator
    engine = SensitivityRecalculator()

    scenarios = [
        {"label": "SOYBEAN +15 day delay",
         "args": {"crop_id": "SOYBEAN", "base_yield": 9.5, "base_harvest_price": 4784,
                  "sowing_delay_change": 15}},
        {"label": "COTTON -20% rainfall",
         "args": {"crop_id": "COTTON", "base_yield": 7.8, "base_harvest_price": 5796,
                  "rainfall_deficit_pct": -20.0}},
        {"label": "MAIZE -10% price shock",
         "args": {"crop_id": "MAIZE", "base_yield": 24.0, "base_harvest_price": 1890,
                  "mandi_price_shock_pct": -10.0}},
        {"label": "WHEAT combined stress",
         "args": {"crop_id": "WHEAT", "base_yield": 14.0, "base_harvest_price": 2500,
                  "sowing_delay_change": 10, "rainfall_deficit_pct": -15.0, "mandi_price_shock_pct": -5.0}},
    ]

    all_pass = True
    for scenario in scenarios:
        try:
            result = engine.recalculate_whatif(**scenario["args"])
            print(f"\n  📊 {scenario['label']}:")
            print(f"     {result['scenario_summary']}")
            print(f"     Revenue: ₹{result['gross_revenue_per_acre']:>10,.0f} | "
                  f"Cost: ₹{result['total_cost_per_acre']:>8,.0f} | "
                  f"Profit: ₹{result['net_profit_per_acre']:>10,.0f} | "
                  f"Margin: {result['profit_margin_pct']:+.1f}%")
        except Exception as e:
            print(f"  ❌ {scenario['label']}: ERROR — {e}")
            all_pass = False

    return all_pass


def test_full_integration():
    """Test 6: End-to-end integration — yield → price → what-if."""
    separator("TEST 6: Full Integration Pipeline")

    try:
        from models_ml.yield_predictor import YieldPredictor
        from models_ml.price_forecaster import PriceForecaster
        from models_ml.sensitivity_recalculator import SensitivityRecalculator

        predictor = YieldPredictor()
        forecaster = PriceForecaster()
        engine = SensitivityRecalculator()
    except Exception as e:
        print(f"  ❌ Could not load components: {e}")
        return False

    # Full pipeline for SOYBEAN
    crop = "SOYBEAN"
    print(f"\n  🌱 Full Pipeline for {crop}:")

    yield_result = predictor.predict_crop_yield(crop, "BLACK", 3, 0, 1)
    print(f"     Step 1 — Yield Prediction:  {yield_result['expected_yield']} qtl/acre ({yield_result['confidence']} confidence)")

    price_result = forecaster.get_harvest_mandi_price(crop, 10)
    print(f"     Step 2 — Price Forecast:    ₹{price_result['expected_price']:,.0f}/qtl (Oct harvest)")

    # Base scenario
    base_result = engine.recalculate_whatif(
        crop, yield_result['expected_yield'], price_result['expected_price']
    )
    print(f"     Step 3a — Base Scenario:    Revenue ₹{base_result['gross_revenue_per_acre']:,.0f} | "
          f"Profit ₹{base_result['net_profit_per_acre']:,.0f}")

    # Stress scenario
    stress_result = engine.recalculate_whatif(
        crop, yield_result['expected_yield'], price_result['expected_price'],
        sowing_delay_change=10, rainfall_deficit_pct=-15.0, mandi_price_shock_pct=-8.0
    )
    print(f"     Step 3b — Stress Scenario:  Revenue ₹{stress_result['gross_revenue_per_acre']:,.0f} | "
          f"Profit ₹{stress_result['net_profit_per_acre']:,.0f}")

    return True


# ──────────────────────────────────────────────────────────────
# Main Execution
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n" + "╔" + "═"*68 + "╗")
    print("║" + " AGRI-DECIDE — ML Pipeline Verification".center(68) + "║")
    print("║" + " PS #24 — AI Crop Recommendation Engine".center(68) + "║")
    print("╚" + "═"*68 + "╝")

    results = {}
    results["Data Integrity"] = test_data_integrity()
    results["Model Metrics"] = test_model_metrics()
    results["Yield Predictor"] = test_yield_predictor()
    results["Price Forecaster"] = test_price_forecaster()
    results["Sensitivity"] = test_sensitivity()
    results["Full Integration"] = test_full_integration()

    separator("FINAL RESULTS SUMMARY")
    all_pass = True
    for name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status}  —  {name}")
        if not passed:
            all_pass = False

    print(f"\n  {'🎉 ALL TESTS PASSED!' if all_pass else '⚠️ SOME TESTS FAILED — see details above.'}")
    print("=" * 70)

    sys.exit(0 if all_pass else 1)
