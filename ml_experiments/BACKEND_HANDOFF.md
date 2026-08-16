# AGRI-DECIDE — Backend Developer Handoff Guide

## What to Give the Backend Developer

### Hand Over This Entire Folder
```
D:\Coding\AGRI-DECIDE\
```
Just **zip** and send the whole folder. That's it.

---

## Setup (Backend Dev Does This Once)

### Install Dependencies
```bash
pip install xgboost scikit-learn pandas numpy joblib
```

The trained model is already saved inside `artifacts_model/`. No retraining needed.
The backend dev does NOT need to run `train_yield_model.py` unless they want to retrain.

---

## API Reference - 3 Functions to Integrate

### Function 1: `predict_crop_yield()` - Predict Yield

```python
from models_ml.yield_predictor import predict_crop_yield

result = predict_crop_yield(
    crop_id="SOYBEAN",         # See crop list below
    soil_type="BLACK",         # BLACK, LOAM, RED, CLAY, SANDY
    water_level=3,             # 1=Rainfed, 2=Moderate, 3=Irrigated
    sowing_delay_days=0,       # 0-30 days
    prev_crop_match=1          # 0=No, 1=Yes
)

# Returns:
# {
#     "crop_id": "SOYBEAN",
#     "expected_yield": 9.66,        <-- Use this
#     "yield_range": "8.7 - 10.63",  <-- Show on UI
#     "yield_min": 8.7,
#     "yield_max": 10.63,
#     "confidence": "High",          <-- Show on UI
#     "unit": "qtl/acre"
# }
```

---

### Function 2: `get_harvest_mandi_price()` - Forecast Price

```python
from models_ml.price_forecaster import get_harvest_mandi_price

result = get_harvest_mandi_price(
    crop_id="SOYBEAN",
    harvest_month=10           # 1=Jan, 2=Feb, ..., 10=Oct, 12=Dec
)

# Returns:
# {
#     "crop_id": "SOYBEAN",
#     "harvest_month": 10,
#     "expected_price": 6005.0,       <-- Use this (Rs/qtl)
#     "price_low": 5524.0,
#     "price_high": 6485.0,
#     "price_band": "Rs 5,524 - Rs 6,485", <-- Show on UI
#     "currency": "INR",
#     "unit": "Rs/qtl"
# }
```

---

### Function 3: `recalculate_whatif()` - What-If Slider Engine

```python
from models_ml.sensitivity_recalculator import recalculate_whatif

result = recalculate_whatif(
    crop_id="SOYBEAN",
    base_yield=9.66,              # <-- Output from Function 1
    base_harvest_price=6005.0,    # <-- Output from Function 2
    sowing_delay_change=15,       # Slider: extra days delay
    rainfall_deficit_pct=-20.0,   # Slider: -20% rainfall
    mandi_price_shock_pct=-10.0   # Slider: -10% price crash
)

# Returns:
# {
#     "crop_id": "SOYBEAN",
#     "adjusted_yield": 5.98,
#     "yield_change_pct": -38.1,
#     "adjusted_price": 5404.5,
#     "price_change_pct": -10.0,
#     "gross_revenue_per_acre": 32318.91,  <-- Show on UI
#     "total_cost_per_acre": 16000.0,
#     "net_profit_per_acre": 16318.91,     <-- Show on UI
#     "profit_margin_pct": 50.5,
#     "scenario_summary": "SOYBEAN under [...]"
# }
```

---

## Full Integration Flow (Copy-Paste Ready)

```python
from models_ml.yield_predictor import predict_crop_yield
from models_ml.price_forecaster import get_harvest_mandi_price
from models_ml.sensitivity_recalculator import recalculate_whatif

# Step 1: Predict yield
yield_result = predict_crop_yield("SOYBEAN", "BLACK", 3, 0, 1)

# Step 2: Get harvest price
price_result = get_harvest_mandi_price("SOYBEAN", 10)

# Step 3: What-If (when user moves sliders)
whatif_result = recalculate_whatif(
    crop_id="SOYBEAN",
    base_yield=yield_result["expected_yield"],
    base_harvest_price=price_result["expected_price"],
    sowing_delay_change=15,
    rainfall_deficit_pct=-20.0,
    mandi_price_shock_pct=-10.0
)

# Send to frontend as JSON
response = {
    "yield": yield_result,
    "price": price_result,
    "whatif": whatif_result
}
```

---

## Supported Crop IDs (Use Exactly These Strings)

| Crop ID | Crop Name | Category |
|---|---|---|
| `MAIZE` | Maize | Cereal |
| `JOWAR` | Jowar (Sorghum) | Cereal |
| `BAJRA` | Bajra (Pearl Millet) | Cereal |
| `WHEAT` | Wheat | Cereal |
| `TUR` | Tur (Pigeon Pea) | Pulse |
| `MOONG` | Moong (Green Gram) | Pulse |
| `URAD` | Urad (Black Gram) | Pulse |
| `GRAM` | Gram (Chickpea) | Pulse |
| `SOYBEAN` | Soybean | Oilseed |
| `COTTON` | Cotton | Commercial |
| `GROUNDNUT` | Groundnut | Oilseed |
| `SUNFLOWER` | Sunflower | Oilseed |
| `SUGARCANE` | Sugarcane | Commercial |
| `ONION` | Onion | Commercial |
| `TOMATO` | Tomato | Commercial |

---

## Files the Backend Dev Needs (and Doesn't Need)

### MUST Include
```
models_ml/
    __init__.py
    yield_predictor.py
    price_forecaster.py
    sensitivity_recalculator.py

artifacts_model/
    xgboost_yield_model.json     <-- Trained model (DO NOT DELETE)
    label_encoders.pkl           <-- Encoders (DO NOT DELETE)

data/
    cacp_costs_pune.csv          <-- Used by sensitivity_recalculator
    agmarknet_mandi_prices_pune.csv  <-- Used by price_forecaster
```

### NOT Needed for Production
```
models_ml/train_yield_model.py   <-- Only for retraining
data/generate_data.py            <-- Only for regenerating data
data/pune_crop_yield_historical.csv  <-- Training data, not needed at runtime
run_pipeline.py                  <-- Testing only
```

---

## Model Accuracy (For PPT)

| Metric | Value |
|---|---|
| R2 Score | **0.9918** |
| Avg RMSE (standard crops) | **0.5673 qtl/acre** |
| MAPE (all crops) | **< 9%** |
| Algorithm | XGBoost Regressor |
| Training Samples | 2,500 |
| Hyperparameter Tuning | RandomizedSearchCV (50 iter x 5-fold CV) |
