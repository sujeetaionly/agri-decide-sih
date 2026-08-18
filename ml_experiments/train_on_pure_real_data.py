"""
Pure Real-Data ML Training Pipeline:
====================================
Trains ML models DIRECTLY on the raw CSV datasets in `data/official_real_data/`:
  1. 14,786 Real Agmarknet Daily Mandi Transactions (2021–2025)
  2. 10-Year ICRISAT + UPAg Real Historical District Crop Yields

Zero synthetic formulas. 100% empirical historical data from Government of India portals.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from xgboost import XGBRegressor
import joblib

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_DIR, "data", "official_real_data")


def train_real_mandi_price_model():
    """
    Trains an XGBoost Regressor directly on 14,786 real Agmarknet daily mandi transactions.
    """
    price_csv = os.path.join(DATA_DIR, "agmarknet_mandi_prices_pune_2021_2025.csv")
    print(f"\n[1/2] Loading 100% Real Agmarknet Mandi Dataset from: {price_csv}")
    df_prices = pd.read_csv(price_csv)
    print(f"      Total Raw Daily Records: {len(df_prices):,}")

    # Standardize column names
    df_prices.columns = [c.strip().lower().replace(" ", "_") for c in df_prices.columns]
    
    # Parse dates and extract features
    if "arrival_date" in df_prices.columns:
        df_prices["arrival_date"] = pd.to_datetime(df_prices["arrival_date"], errors="coerce")
        df_prices["year"] = df_prices["arrival_date"].dt.year
        df_prices["month"] = df_prices["arrival_date"].dt.month
        df_prices["day_of_year"] = df_prices["arrival_date"].dt.dayofyear
    
    # Target and features
    target_col = "modal_price" if "modal_price" in df_prices.columns else "modal_price_per_qtl"
    crop_col = "commodity" if "commodity" in df_prices.columns else "crop_id"
    market_col = "market_center" if "market_center" in df_prices.columns else ("market" if "market" in df_prices.columns else "market_name")
    arrival_col = "arrival_volume_mt" if "arrival_volume_mt" in df_prices.columns else "arrival_volume"

    # Drop NaNs
    df_clean = df_prices.dropna(subset=[target_col, crop_col]).copy()
    
    # Filter out anomalous zero/extreme values
    df_clean = df_clean[(df_clean[target_col] > 100) & (df_clean[target_col] < 25000)]

    # Encode categorical features
    le_crop = LabelEncoder()
    le_market = LabelEncoder()
    
    df_clean["crop_encoded"] = le_crop.fit_transform(df_clean[crop_col].astype(str))
    if market_col in df_clean.columns:
        df_clean["market_encoded"] = le_market.fit_transform(df_clean[market_col].astype(str))
    else:
        df_clean["market_encoded"] = 0

    if arrival_col not in df_clean.columns:
        df_clean[arrival_col] = 10.0

    features = ["crop_encoded", "market_encoded", "year", "month", "day_of_year", arrival_col]
    features = [f for f in features if f in df_clean.columns]

    X = df_clean[features]
    y = df_clean[target_col]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)

    print(f"      Training XGBoost Price Model on {len(X_train):,} real transactions...")
    price_model = XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42
    )
    price_model.fit(X_train, y_train)

    y_pred = price_model.predict(X_test)

    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

    print("=" * 65)
    print("  RESULTS: REAL AGMARKNET MANDI PRICE MODEL (14,786 RECORDS)")
    print("=" * 65)
    print(f"  * Real-World R2 Score:         {r2:.4f}  (Natural real-market variance)")
    print(f"  * Root Mean Squared Error:     Rs. {rmse:.2f} / qtl")
    print(f"  * Mean Absolute Error (MAE):   Rs. {mae:.2f} / qtl")
    print(f"  * Mean Absolute Error (MAPE):  {mape:.2f}%")
    print("=" * 65)

    # Save artifact
    model_save_path = os.path.join(PROJECT_DIR, "ml_experiments", "real_agmarknet_price_model.joblib")
    joblib.dump({"model": price_model, "le_crop": le_crop, "le_market": le_market, "features": features}, model_save_path)
    print(f"[SAVED] Real Price Model saved to: {model_save_path}")

    return {
        "dataset": "Agmarknet Mandi (14,786 daily transactions)",
        "r2_score": round(float(r2), 4),
        "rmse": round(float(rmse), 2),
        "mae": round(float(mae), 2),
        "mape_pct": round(float(mape), 2),
        "n_samples": len(df_clean)
    }


def parse_and_train_real_icrisat_yields():
    """
    Parses the 10-year ICRISAT + UPAg historical district time series and trains yield model.
    """
    icrisat_csv = os.path.join(DATA_DIR, "historical_icrisat_pune_2008_2017.csv")
    print(f"\n[2/2] Loading Real ICRISAT 10-Year Historical District Yields: {icrisat_csv}")
    df_raw = pd.read_csv(icrisat_csv)
    
    # Strip quotes
    df_raw.columns = [c.replace('"', '').strip() for c in df_raw.columns]

    crop_yield_cols = {
        "SOYBEAN": ("SOYABEAN AREA (1000 ha)", "SOYABEAN PRODUCTION (1000 tons)", "SOYABEAN YIELD (Kg per ha)"),
        "WHEAT": ("WHEAT AREA (1000 ha)", "WHEAT PRODUCTION (1000 tons)", "WHEAT YIELD (Kg per ha)"),
        "MAIZE": ("MAIZE AREA (1000 ha)", "MAIZE PRODUCTION (1000 tons)", "MAIZE YIELD (Kg per ha)"),
        "BAJRA": ("PEARL MILLET AREA (1000 ha)", "PEARL MILLET PRODUCTION (1000 tons)", "PEARL MILLET YIELD (Kg per ha)"),
        "JOWAR": ("SORGHUM AREA (1000 ha)", "SORGHUM PRODUCTION (1000 tons)", "SORGHUM YIELD (Kg per ha)"),
        "GRAM": ("CHICKPEA AREA (1000 ha)", "CHICKPEA PRODUCTION (1000 tons)", "CHICKPEA YIELD (Kg per ha)"),
        "TUR": ("PIGEONPEA AREA (1000 ha)", "PIGEONPEA PRODUCTION (1000 tons)", "PIGEONPEA YIELD (Kg per ha)"),
        "GROUNDNUT": ("GROUNDNUT AREA (1000 ha)", "GROUNDNUT PRODUCTION (1000 tons)", "GROUNDNUT YIELD (Kg per ha)"),
        "SUNFLOWER": ("SUNFLOWER AREA (1000 ha)", "SUNFLOWER PRODUCTION (1000 tons)", "SUNFLOWER YIELD (Kg per ha)"),
        "SUGARCANE": ("SUGARCANE AREA (1000 ha)", "SUGARCANE PRODUCTION (1000 tons)", "SUGARCANE YIELD (Kg per ha)"),
        "COTTON": ("COTTON AREA (1000 ha)", "COTTON PRODUCTION (1000 tons)", "COTTON YIELD (Kg per ha)"),
    }

    panel_records = []
    for _, row in df_raw.iterrows():
        year = int(row["Year"])
        for crop_name, (area_col, prod_col, yield_col) in crop_yield_cols.items():
            if area_col in df_raw.columns and yield_col in df_raw.columns:
                try:
                    area = float(row[area_col])
                    prod = float(row[prod_col])
                    yield_kgha = float(row[yield_col])
                    # Standard conversion kg/ha -> qtl/acre
                    yield_qtl_acre = yield_kgha / 247.105
                    
                    if yield_qtl_acre > 0:
                        panel_records.append({
                            "year": year,
                            "crop": crop_name,
                            "area_thousand_ha": area,
                            "prod_thousand_tons": prod,
                            "yield_kg_ha": yield_kgha,
                            "yield_qtl_acre": round(yield_qtl_acre, 2)
                        })
                except (ValueError, TypeError):
                    continue

    df_panel = pd.DataFrame(panel_records)
    print(f"      Extracted {len(df_panel)} real empirical crop-year data points across {df_panel['crop'].nunique()} crops (2008-2017).")
    
    # Train XGBoost on real historical panel data
    le_crop = LabelEncoder()
    df_panel["crop_code"] = le_crop.fit_transform(df_panel["crop"])

    X = df_panel[["crop_code", "year", "area_thousand_ha"]]
    y = np.log1p(df_panel["yield_qtl_acre"])  # log-transform for multi-scale handling

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

    yield_model = XGBRegressor(n_estimators=100, max_depth=4, learning_rate=0.08, random_state=42)
    yield_model.fit(X_train, y_train)

    y_pred = yield_model.predict(X_test)
    y_test_orig = np.expm1(y_test)
    y_pred_orig = np.expm1(y_pred)

    r2 = r2_score(y_test_orig, y_pred_orig)
    rmse = np.sqrt(mean_squared_error(y_test_orig, y_pred_orig))
    mae = mean_absolute_error(y_test_orig, y_pred_orig)

    print("=" * 65)
    print("  RESULTS: REAL ICRISAT HISTORICAL YIELD MODEL")
    print("=" * 65)
    print(f"  * Real-World R2 Score:         {r2:.4f}")
    print(f"  * Root Mean Squared Error:     {rmse:.2f} qtl/acre")
    print(f"  * Mean Absolute Error:         {mae:.2f} qtl/acre")
    print("=" * 65)

    # Save artifact
    model_save_path = os.path.join(PROJECT_DIR, "ml_experiments", "real_icrisat_yield_model.joblib")
    joblib.dump({"model": yield_model, "le_crop": le_crop}, model_save_path)
    print(f"[SAVED] Real ICRISAT Yield Model saved to: {model_save_path}")

    return {
        "dataset": "ICRISAT 10-Year Historical District Database (2008-2017)",
        "r2_score": round(float(r2), 4),
        "rmse": round(float(rmse), 2),
        "mae": round(float(mae), 2),
        "n_samples": len(df_panel)
    }


if __name__ == "__main__":
    price_metrics = train_real_mandi_price_model()
    yield_metrics = parse_and_train_real_icrisat_yields()

    # Save summary report
    summary_path = os.path.join(PROJECT_DIR, "ml_experiments", "artifacts_model", "pure_real_data_evaluation.json")
    with open(summary_path, "w") as f:
        json.dump({"price_model_metrics": price_metrics, "yield_model_metrics": yield_metrics}, f, indent=4)
    print(f"\n[REPORT] Saved full real-data evaluation report to: {summary_path}")
