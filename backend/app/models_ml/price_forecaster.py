"""
Price Forecaster Module:
Projects harvest-month wholesale mandi prices based on 5-year Agmarknet APMC benchmarks,
harvest arrival seasonal indices, and market price shock adjustments.
"""
from typing import Dict, Any

# 5-Year Historical Average Modal Wholesale Price (₹ per Quintal)
HISTORICAL_AVG_MANDI_PRICE = {
    "SOYBEAN": 4600.0,
    "MAIZE": 2150.0,
    "TUR": 7200.0,
    "COTTON": 6400.0,
    "BAJRA": 2500.0,
    "MOONG": 7500.0,
    "GROUNDNUT": 5800.0,
    "WHEAT": 2275.0,
    "GRAM": 5450.0,
    "JOWAR": 2900.0,
    "URAD": 7100.0,
    "SUNFLOWER": 6200.0,
    "SUGARCANE": 315.0,    # Per quintal FRP
    "ONION": 1350.0,
    "TOMATO": 1400.0
}

# Standard harvest arrival seasonal factors
HARVEST_SEASONAL_FACTORS = {
    "SOYBEAN": 1.04,
    "MAIZE": 1.02,
    "TUR": 1.03,
    "COTTON": 1.01,
    "BAJRA": 1.00,
    "MOONG": 1.05,
    "GROUNDNUT": 1.03,
    "WHEAT": 1.02,
    "GRAM": 1.04,
    "JOWAR": 1.01,
    "URAD": 1.03,
    "SUNFLOWER": 1.02,
    "SUGARCANE": 1.00,
    "ONION": 1.00,
    "TOMATO": 1.05
}

# Volatility categorization
PRICE_VOLATILITY_TAGS = {
    "SOYBEAN": "Low (MSP & Oilseed Demand)",
    "MAIZE": "Low (Poultry & Starch Demand)",
    "TUR": "Low (MSP & Pulse Buffer Stock)",
    "COTTON": "Moderate (Global Cotton Index)",
    "BAJRA": "Low (MSP Supported)",
    "MOONG": "Moderate (High Seasonal Demand)",
    "GROUNDNUT": "Low (MSP & Edible Oil Demand)",
    "WHEAT": "Low (MSP Supported)",
    "GRAM": "Low (MSP Supported)",
    "JOWAR": "Low (MSP Supported)",
    "URAD": "Moderate (Pulse Demand)",
    "SUNFLOWER": "Moderate (Edible Oil Demand)",
    "SUGARCANE": "Low (Govt FRP Assured)",
    "ONION": "High (Seasonal Glut / Weather Sensitive)",
    "TOMATO": "High (Perishable / Market Driven)"
}

def get_harvest_mandi_price(
    crop_id: str,
    harvest_month: int = 10,
    price_shock_pct: float = 0.0
) -> Dict[str, Any]:
    """
    Computes forecasted harvest mandi wholesale price (₹/qtl) including seasonal index and shock.
    """
    crop_key = crop_id.upper().strip()
    base_price = HISTORICAL_AVG_MANDI_PRICE.get(crop_key, 3000.0)
    seasonal_factor = HARVEST_SEASONAL_FACTORS.get(crop_key, 1.0)
    
    shock_mult = 1.0 + (price_shock_pct / 100.0)
    projected = round(base_price * seasonal_factor * shock_mult, 2)
    
    volatility = PRICE_VOLATILITY_TAGS.get(crop_key, "Moderate")

    return {
        "crop_id": crop_key,
        "base_mandi_price": base_price,
        "forecasted_price_per_qtl": projected,
        "price_volatility": volatility
    }
