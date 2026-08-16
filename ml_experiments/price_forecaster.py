"""
price_forecaster.py — Harvest-Month Price Forecasting Engine
=============================================================
Project: AGRI-DECIDE (PS #24)
Component: Mandi Price Projection for Pune/Baramati District

Forecasts wholesale mandi price at the harvest month using:
    P_harvest = Annual_Avg_Price × Seasonal_Index(harvest_month)

Supports all 15 target crops with CSV-backed data and hardcoded fallbacks.
"""

import os
import pandas as pd
from typing import Dict, Optional

# ──────────────────────────────────────────────────────────────
# Hardcoded Fallback Data (used when CSV is unavailable)
# ──────────────────────────────────────────────────────────────
HISTORICAL_AVG_PRICES: Dict[str, float] = {
    # Cereals (₹/qtl)
    "MAIZE": 2100.0,
    "JOWAR": 3200.0,
    "BAJRA": 2300.0,
    "WHEAT": 2500.0,
    # Pulses
    "TUR": 7200.0,
    "MOONG": 7200.0,
    "URAD": 6500.0,
    "GRAM": 5200.0,
    # Oilseeds & Commercial
    "SOYBEAN": 4600.0,
    "COTTON": 6300.0,
    "GROUNDNUT": 5500.0,
    "SUNFLOWER": 5800.0,
    "SUGARCANE": 310.0,
    "ONION": 2000.0,
    "TOMATO": 2200.0,
}

# Monthly seasonal index factors (month 1-12) — representative Pune Agmarknet patterns
# Values > 1.0 indicate price above annual average; < 1.0 indicates below average
SEASONAL_INDEX_TABLE: Dict[str, Dict[int, float]] = {
    "SOYBEAN":    {1: 1.06, 2: 1.08, 3: 1.10, 4: 1.12, 5: 1.14, 6: 1.10, 7: 1.05, 8: 0.98, 9: 0.92, 10: 0.88, 11: 0.90, 12: 0.97},
    "MAIZE":      {1: 1.04, 2: 1.06, 3: 1.08, 4: 1.10, 5: 1.12, 6: 1.08, 7: 1.02, 8: 0.96, 9: 0.90, 10: 0.88, 11: 0.92, 12: 0.98},
    "JOWAR":      {1: 1.05, 2: 1.07, 3: 1.10, 4: 1.12, 5: 1.10, 6: 1.06, 7: 1.00, 8: 0.95, 9: 0.90, 10: 0.88, 11: 0.92, 12: 0.99},
    "BAJRA":      {1: 1.04, 2: 1.06, 3: 1.08, 4: 1.10, 5: 1.08, 6: 1.04, 7: 1.00, 8: 0.96, 9: 0.92, 10: 0.90, 11: 0.94, 12: 1.00},
    "WHEAT":      {1: 1.08, 2: 1.10, 3: 0.92, 4: 0.88, 5: 0.90, 6: 0.94, 7: 0.98, 8: 1.02, 9: 1.04, 10: 1.06, 11: 1.08, 12: 1.10},
    "TUR":        {1: 0.96, 2: 1.00, 3: 1.04, 4: 1.08, 5: 1.12, 6: 1.14, 7: 1.10, 8: 1.06, 9: 1.02, 10: 0.98, 11: 0.94, 12: 0.92},
    "MOONG":      {1: 1.06, 2: 1.08, 3: 1.10, 4: 1.12, 5: 1.10, 6: 1.06, 7: 1.00, 8: 0.96, 9: 0.88, 10: 0.90, 11: 0.94, 12: 1.00},
    "URAD":       {1: 1.04, 2: 1.06, 3: 1.08, 4: 1.10, 5: 1.08, 6: 1.04, 7: 1.00, 8: 0.96, 9: 0.90, 10: 0.92, 11: 0.96, 12: 1.00},
    "GRAM":       {1: 1.06, 2: 0.94, 3: 0.90, 4: 0.92, 5: 0.96, 6: 1.00, 7: 1.04, 8: 1.06, 9: 1.08, 10: 1.10, 11: 1.08, 12: 1.06},
    "COTTON":     {1: 1.02, 2: 1.04, 3: 1.06, 4: 1.08, 5: 1.10, 6: 1.06, 7: 1.02, 8: 0.98, 9: 0.96, 10: 0.94, 11: 0.92, 12: 0.96},
    "GROUNDNUT":  {1: 1.04, 2: 1.06, 3: 1.08, 4: 1.10, 5: 1.08, 6: 1.04, 7: 1.00, 8: 0.96, 9: 0.92, 10: 0.90, 11: 0.94, 12: 1.00},
    "SUNFLOWER":  {1: 1.04, 2: 0.96, 3: 0.94, 4: 0.96, 5: 1.00, 6: 1.04, 7: 1.06, 8: 1.08, 9: 1.06, 10: 1.04, 11: 1.02, 12: 1.00},
    "SUGARCANE":  {1: 1.00, 2: 1.00, 3: 1.02, 4: 1.04, 5: 1.06, 6: 1.04, 7: 1.02, 8: 1.00, 9: 0.98, 10: 0.96, 11: 0.96, 12: 0.98},
    "ONION":      {1: 1.20, 2: 1.15, 3: 0.85, 4: 0.80, 5: 0.82, 6: 0.90, 7: 1.00, 8: 1.10, 9: 1.18, 10: 1.22, 11: 1.15, 12: 1.08},
    "TOMATO":     {1: 0.85, 2: 0.80, 3: 0.78, 4: 0.82, 5: 0.90, 6: 1.10, 7: 1.25, 8: 1.30, 9: 1.20, 10: 1.05, 11: 0.92, 12: 0.88},
}


class PriceForecaster:
    """
    Harvest-month price forecasting engine.
    
    Loads Agmarknet mandi price data from CSV (if available) and computes
    seasonal projections. Falls back to hardcoded historical averages.
    """

    def __init__(self, data_path: str = r"D:\Coding\AGRI-DECIDE\data\agmarknet_mandi_prices_pune.csv"):
        self.data_path = data_path
        self.avg_prices: Dict[str, float] = {}
        self.seasonal_indices: Dict[str, Dict[int, float]] = {}
        self._load_data()

    def _load_data(self):
        """Load CSV data and compute averages, or use fallback."""
        if os.path.exists(self.data_path):
            try:
                df = pd.read_csv(self.data_path)
                # Compute annual average from recent years (2024-2026)
                recent = df[df['year'] >= 2024]
                if recent.empty:
                    recent = df  # fallback to all data

                # Annual average price per crop
                self.avg_prices = recent.groupby('crop_id')['modal_price_per_qtl'].mean().to_dict()

                # Seasonal index per crop-month
                for crop_id in recent['crop_id'].unique():
                    crop_data = recent[recent['crop_id'] == crop_id]
                    monthly_avg = crop_data.groupby('month')['modal_price_per_qtl'].mean()
                    annual_avg = crop_data['modal_price_per_qtl'].mean()
                    if annual_avg > 0:
                        self.seasonal_indices[crop_id] = {
                            int(m): round(v / annual_avg, 4) for m, v in monthly_avg.items()
                        }

                print(f"[PriceForecaster] Loaded {len(df)} rows from CSV. {len(self.avg_prices)} crops available.")
                return
            except Exception as e:
                print(f"[PriceForecaster] Warning: CSV load failed ({e}). Using fallback data.")

        # Fallback to hardcoded data
        print("[PriceForecaster] Using hardcoded fallback prices.")
        self.avg_prices = HISTORICAL_AVG_PRICES.copy()
        self.seasonal_indices = {k: dict(v) for k, v in SEASONAL_INDEX_TABLE.items()}

    def get_harvest_mandi_price(self, crop_id: str, harvest_month: int) -> dict:
        """
        Returns forecasted wholesale price at the harvest month.
        
        Formula: P_harvest = Annual_Avg_Price × Seasonal_Index(harvest_month)

        Args:
            crop_id: Crop identifier (e.g. 'SOYBEAN', 'MAIZE')
            harvest_month: Month of harvest (1-12)

        Returns:
            dict with expected_price, price_low, price_high, price_band
        """
        crop_id = crop_id.upper()
        if harvest_month < 1 or harvest_month > 12:
            raise ValueError(f"harvest_month must be 1-12, got {harvest_month}")

        base_price = self.avg_prices.get(crop_id)
        if base_price is None:
            raise ValueError(
                f"Unknown crop_id: '{crop_id}'. "
                f"Valid crops: {sorted(self.avg_prices.keys())}"
            )

        # Get seasonal index for the harvest month
        crop_indices = self.seasonal_indices.get(crop_id, {})
        seasonal_factor = crop_indices.get(harvest_month, 1.0)

        expected_price = round(base_price * seasonal_factor, 2)
        price_low = round(expected_price * 0.92, 2)   # -8%
        price_high = round(expected_price * 1.08, 2)   # +8%

        return {
            "crop_id": crop_id,
            "harvest_month": harvest_month,
            "expected_price": expected_price,
            "price_low": price_low,
            "price_high": price_high,
            "price_band": f"₹{price_low:,.0f} - ₹{price_high:,.0f}",
            "annual_avg_price": round(base_price, 2),
            "seasonal_index": seasonal_factor,
            "currency": "INR",
            "unit": "₹/qtl",
        }


# ──────────────────────────────────────────────────────────────
# Module-level convenience function
# ──────────────────────────────────────────────────────────────
_forecaster: Optional[PriceForecaster] = None


def get_harvest_mandi_price(crop_id: str, harvest_month: int) -> dict:
    """Module-level convenience wrapper."""
    global _forecaster
    if _forecaster is None:
        _forecaster = PriceForecaster()
    return _forecaster.get_harvest_mandi_price(crop_id, harvest_month)


# ──────────────────────────────────────────────────────────────
# Demo / Self-Test
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 65)
    print("  AGRI-DECIDE — Harvest Price Forecaster Demo")
    print("=" * 65)

    forecaster = PriceForecaster()

    demo_cases = [
        ("SOYBEAN", 10),   # Oct harvest
        ("MAIZE", 9),      # Sep harvest
        ("TUR", 1),        # Jan harvest
        ("COTTON", 11),    # Nov harvest
        ("ONION", 3),      # Mar harvest (peak arrival, low price)
    ]

    for crop, month in demo_cases:
        result = forecaster.get_harvest_mandi_price(crop, month)
        month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        print(f"\n  {crop} → Harvest in {month_names[month]}:")
        print(f"    Annual Avg:      ₹{result['annual_avg_price']:,.0f}/qtl")
        print(f"    Seasonal Index:  {result['seasonal_index']:.2f}")
        print(f"    Expected Price:  ₹{result['expected_price']:,.0f}/qtl")
        print(f"    Price Band:      {result['price_band']}")

    print("\n" + "=" * 65)
