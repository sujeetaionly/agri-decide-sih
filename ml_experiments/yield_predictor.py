"""
yield_predictor.py — XGBoost Yield Inference API
==================================================
Project: AGRI-DECIDE (PS #24)

Loads the trained XGBoost model and label encoders from artifacts_model/
and provides a clean prediction interface for crop yield estimation.
Supports log-transformed models and benchmark fallback calibration.
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Optional

try:
    import xgboost as xgb
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

# Benchmark calibrated yields (qtl/acre) from ICRISAT + UPAg Pune District Data
FALLBACK_BASE_YIELDS = {
    "SOYBEAN": 9.5, "MAIZE": 24.0, "TUR": 6.5, "COTTON": 7.8, "BAJRA": 12.0,
    "MOONG": 5.5, "GROUNDNUT": 9.0, "WHEAT": 14.0, "GRAM": 7.0, "JOWAR": 11.0,
    "URAD": 5.0, "SUNFLOWER": 6.5, "SUGARCANE": 380.0, "ONION": 95.0, "TOMATO": 110.0
}
SOIL_AFFINITY_MAP = {
    "BLACK": 1.05, "LOAM": 1.0, "RED": 0.88, "SANDY": 0.75, "CLAY": 0.95
}


class YieldPredictor:
    """
    Yield prediction engine using trained XGBoost model or calibrated real ICRISAT engine.
    """

    def __init__(self, artifacts_dir: Optional[str] = None):
        if artifacts_dir is None:
            artifacts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'artifacts_model')
        self.artifacts_dir = artifacts_dir
        self.model_path = os.path.join(artifacts_dir, 'xgboost_yield_model.json')
        self.encoders_path = os.path.join(artifacts_dir, 'label_encoders.pkl')

        self.model = None
        self.crop_encoder = None
        self.soil_encoder = None
        self.log_transform = False

        self._load_artifacts()

    def _load_artifacts(self):
        """Load trained model, encoders, and metadata."""
        if not HAS_XGB or not os.path.exists(self.model_path) or not os.path.exists(self.encoders_path):
            self.model = None
            return

        try:
            self.model = xgb.XGBRegressor()
            self.model.load_model(self.model_path)

            encoders = joblib.load(self.encoders_path)
            self.crop_encoder = encoders.get('crop_encoder')
            self.soil_encoder = encoders.get('soil_encoder')
            self.log_transform = encoders.get('log_transform', False)
        except Exception:
            self.model = None

    def predict_crop_yield(
        self,
        crop_id: str,
        soil_type: str,
        water_level: int,
        sowing_delay_days: int,
        prev_crop_match: int = 1,
    ) -> dict:
        """
        Predicts expected crop yield for given agricultural parameters.
        """
        crop_id = crop_id.upper().strip()
        soil_type = soil_type.upper().strip()

        # If XGBoost model is loaded
        if self.model is not None and self.crop_encoder is not None and self.soil_encoder is not None:
            try:
                crop_id_encoded = self.crop_encoder.transform([crop_id])[0]
                soil_type_encoded = self.soil_encoder.transform([soil_type])[0]
                features = pd.DataFrame([{
                    'crop_id_encoded': crop_id_encoded,
                    'soil_type_encoded': soil_type_encoded,
                    'water_level': water_level,
                    'sowing_delay_days': sowing_delay_days,
                    'prev_crop_match': prev_crop_match,
                }])
                raw_pred = float(self.model.predict(features)[0])
                pred = float(np.expm1(raw_pred) if self.log_transform else raw_pred)
                expected_yield = max(0.5, round(pred, 2))
                min_yield = round(expected_yield * 0.88, 1)
                max_yield = round(expected_yield * 1.12, 1)
                confidence = "High" if soil_type in ["BLACK", "LOAM"] and water_level >= 2 else "Medium"
                return {
                    "crop_id": crop_id,
                    "expected_yield": expected_yield,
                    "min_yield": min_yield,
                    "max_yield": max_yield,
                    "yield_range": f"{min_yield} - {max_yield}",
                    "confidence": confidence,
                    "unit": "qtl/acre"
                }
            except Exception:
                pass

        # Fallback calibrated ICRISAT / UPAg model
        base = FALLBACK_BASE_YIELDS.get(crop_id, 10.0)
        soil_mult = SOIL_AFFINITY_MAP.get(soil_type, 1.0)
        water_mult = 0.82 if water_level == 1 else (1.12 if water_level == 3 else 1.0)
        delay_penalty = max(0.0, min(0.35, (sowing_delay_days - 5) * 0.006)) if sowing_delay_days > 5 else 0.0
        expected = round(base * soil_mult * water_mult * (1.0 - delay_penalty), 2)
        min_yield = round(expected * 0.90, 1)
        max_yield = round(expected * 1.12, 1)
        confidence = "High" if soil_type in ["BLACK", "LOAM"] and water_level >= 2 else "Medium"

        return {
            "crop_id": crop_id,
            "expected_yield": expected,
            "min_yield": min_yield,
            "max_yield": max_yield,
            "yield_range": f"{min_yield} - {max_yield}",
            "confidence": confidence,
            "unit": "qtl/acre"
        }


# Module-level convenience wrapper
_predictor: Optional[YieldPredictor] = None


def predict_crop_yield(
    crop_id: str,
    soil_type: str,
    water_level: int,
    sowing_delay_days: int,
    prev_crop_match: int = 1,
) -> dict:
    global _predictor
    if _predictor is None:
        _predictor = YieldPredictor()
    return _predictor.predict_crop_yield(
        crop_id, soil_type, water_level, sowing_delay_days, prev_crop_match
    )
