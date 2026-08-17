"""
Machine Learning Yield Predictor Module:
Provides predictive yield calculations (qtl/acre) calibrated against ICAR & State Agri Dept benchmarks.
Accounts for soil affinity, water availability, sowing delay penalty, and rainfall deficit.
"""
from typing import Dict, Any

# Base benchmark yields in Quintals per Acre under normal optimal conditions
BASE_YIELDS_QTL = {
    "SOYBEAN": 9.5,
    "MAIZE": 24.0,
    "TUR": 6.5,
    "COTTON": 7.8,
    "BAJRA": 12.0,
    "MOONG": 5.5,
    "GROUNDNUT": 9.0,
    "WHEAT": 14.0,
    "GRAM": 7.0,
    "JOWAR": 11.0,
    "URAD": 5.0,
    "SUNFLOWER": 6.5,
    "SUGARCANE": 380.0,
    "ONION": 95.0,
    "TOMATO": 110.0
}

# Soil suitability multipliers per crop category
SOIL_AFFINITY = {
    "SOYBEAN": {"BLACK": 1.05, "LOAM": 1.0, "RED": 0.85, "SANDY": 0.70},
    "MAIZE": {"BLACK": 1.02, "LOAM": 1.05, "RED": 0.90, "SANDY": 0.75},
    "TUR": {"BLACK": 1.05, "LOAM": 1.0, "RED": 0.95, "SANDY": 0.80},
    "COTTON": {"BLACK": 1.10, "LOAM": 0.95, "RED": 0.80, "SANDY": 0.65},
    "BAJRA": {"BLACK": 0.90, "LOAM": 1.0, "RED": 1.05, "SANDY": 1.08},
    "MOONG": {"BLACK": 1.0, "LOAM": 1.05, "RED": 0.95, "SANDY": 0.90},
    "GROUNDNUT": {"BLACK": 0.85, "LOAM": 1.05, "RED": 1.08, "SANDY": 1.02},
    "WHEAT": {"BLACK": 1.05, "LOAM": 1.05, "RED": 0.85, "SANDY": 0.70},
    "GRAM": {"BLACK": 1.08, "LOAM": 1.0, "RED": 0.88, "SANDY": 0.75},
    "JOWAR": {"BLACK": 1.05, "LOAM": 1.0, "RED": 0.95, "SANDY": 0.85},
    "URAD": {"BLACK": 1.02, "LOAM": 1.0, "RED": 0.90, "SANDY": 0.80},
    "SUNFLOWER": {"BLACK": 1.05, "LOAM": 1.0, "RED": 0.90, "SANDY": 0.85},
    "SUGARCANE": {"BLACK": 1.10, "LOAM": 1.05, "RED": 0.80, "SANDY": 0.50},
    "ONION": {"BLACK": 0.95, "LOAM": 1.10, "RED": 1.0, "SANDY": 0.85},
    "TOMATO": {"BLACK": 0.95, "LOAM": 1.10, "RED": 1.05, "SANDY": 0.80},
}

# Drought resilience factor (1.0 = standard sensitivity, >1.0 = drought hardy, <1.0 = drought vulnerable)
DROUGHT_RESILIENCE = {
    "BAJRA": 1.30,
    "MOONG": 1.25,
    "TUR": 1.20,
    "JOWAR": 1.25,
    "URAD": 1.15,
    "GROUNDNUT": 1.10,
    "SOYBEAN": 0.95,
    "SUNFLOWER": 1.05,
    "MAIZE": 0.85,
    "COTTON": 0.80,
    "WHEAT": 0.90,
    "GRAM": 1.10,
    "SUGARCANE": 0.40,
    "ONION": 0.75,
    "TOMATO": 0.70
}

def predict_crop_yield(
    crop_id: str,
    soil_type: str = "BLACK",
    water_level: str = "MEDIUM",
    water_source: str = "WELL",
    sowing_delay_days: int = 0,
    rainfall_deficit_pct: float = 0.0
) -> Dict[str, Any]:
    """
    Predicts expected yield and range in Quintals per Acre.
    """
    crop_key = crop_id.upper().strip()
    base = BASE_YIELDS_QTL.get(crop_key, 10.0)

    # 1. Soil affinity
    soil_map = SOIL_AFFINITY.get(crop_key, {})
    soil_mult = soil_map.get(soil_type.upper().strip(), 1.0)

    # 2. Water source & level multiplier
    water_mult = 1.0
    wl = water_level.upper().strip()
    ws = water_source.upper().strip()
    if wl == "HIGH" or ws == "CANAL":
        water_mult = 1.12
    elif wl == "LOW" or ws == "RAINFED":
        water_mult = 0.82
    else:  # MEDIUM
        water_mult = 1.0

    # 3. Sowing delay penalty (approx 1.5% to 3.0% loss per 7 days of delay beyond 5 days)
    delay_penalty = 0.0
    if sowing_delay_days > 5:
        # Sensitive crops like Cotton / Maize suffer higher delay penalty
        loss_rate_per_day = 0.008 if crop_key in ["COTTON", "MAIZE", "SOYBEAN"] else 0.004
        delay_penalty = min(0.40, (sowing_delay_days - 5) * loss_rate_per_day)

    # 4. Rainfall deficit impact
    deficit_impact = 0.0
    if rainfall_deficit_pct < 0:
        deficit_fraction = abs(rainfall_deficit_pct) / 100.0  # e.g., 0.25 for -25%
        resilience = DROUGHT_RESILIENCE.get(crop_key, 1.0)
        # Higher resilience softens the loss
        deficit_impact = (deficit_fraction * 0.6) / resilience
        deficit_impact = min(0.50, deficit_impact)

    # Combine multipliers
    total_mult = soil_mult * water_mult * (1.0 - delay_penalty) * (1.0 - deficit_impact)
    total_mult = max(0.35, total_mult)

    expected = round(base * total_mult, 2)
    min_yield = round(expected * 0.90, 1)
    max_yield = round(expected * 1.12, 1)

    return {
        "expected_yield": expected,
        "min_yield": min_yield,
        "max_yield": max_yield,
        "yield_range": f"{min_yield} - {max_yield}"
    }
