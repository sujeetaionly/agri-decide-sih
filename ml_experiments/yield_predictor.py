"""
yield_predictor.py — XGBoost Yield Inference API
==================================================
Project: AGRI-DECIDE (PS #24)

Loads the trained XGBoost model and label encoders from artifacts_model/
and provides a clean prediction interface for crop yield estimation.

Supports log-transformed models (auto-detected via encoder metadata).
"""

import os
import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from typing import Optional


class YieldPredictor:
    """
    Yield prediction engine using a trained XGBoost model.

    Usage:
        predictor = YieldPredictor()
        result = predictor.predict_crop_yield("SOYBEAN", "BLACK", 3, 0, 1)
    """

    def __init__(self, artifacts_dir: str = r"D:\Coding\AGRI-DECIDE\artifacts_model"):
        """
        Initialize the YieldPredictor by loading model and encoders.

        Args:
            artifacts_dir: Path to the directory containing model artifacts.
        """
        self.artifacts_dir = artifacts_dir
        self.model_path = os.path.join(artifacts_dir, 'xgboost_yield_model.json')
        self.encoders_path = os.path.join(artifacts_dir, 'label_encoders.pkl')

        self.model = None
        self.crop_encoder = None
        self.soil_encoder = None
        self.log_transform = False  # Whether model was trained on log-transformed target

        self._load_artifacts()

    def _load_artifacts(self):
        """Load trained model, encoders, and metadata."""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found: {self.model_path}")
        if not os.path.exists(self.encoders_path):
            raise FileNotFoundError(f"Encoders file not found: {self.encoders_path}")

        # Load XGBoost model
        self.model = xgb.XGBRegressor()
        self.model.load_model(self.model_path)

        # Load encoders and metadata
        encoders = joblib.load(self.encoders_path)
        self.crop_encoder = encoders.get('crop_encoder')
        self.soil_encoder = encoders.get('soil_encoder')
        self.log_transform = encoders.get('log_transform', False)

        if self.crop_encoder is None or self.soil_encoder is None:
            raise ValueError("Encoder file is malformed — missing crop_encoder or soil_encoder.")

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

        Args:
            crop_id: Crop identifier (e.g. 'SOYBEAN', 'MAIZE')
            soil_type: Soil type (BLACK, LOAM, RED, CLAY, SANDY)
            water_level: Water availability (1=Rainfed, 2=Moderate, 3=Irrigated)
            sowing_delay_days: Days of sowing delay beyond optimal window (0-30)
            prev_crop_match: Whether previous crop matches rotation (0 or 1)

        Returns:
            dict with expected_yield, yield_range, confidence, etc.
        """
        # Validate and encode crop_id
        crop_id = crop_id.upper()
        try:
            crop_id_encoded = self.crop_encoder.transform([crop_id])[0]
        except ValueError:
            raise ValueError(
                f"Unknown crop_id: '{crop_id}'. "
                f"Valid options: {list(self.crop_encoder.classes_)}"
            )

        # Validate and encode soil_type
        soil_type = soil_type.upper()
        try:
            soil_type_encoded = self.soil_encoder.transform([soil_type])[0]
        except ValueError:
            raise ValueError(
                f"Unknown soil_type: '{soil_type}'. "
                f"Valid options: {list(self.soil_encoder.classes_)}"
            )

        # Validate numeric inputs
        water_level = max(1, min(3, int(water_level)))
        sowing_delay_days = max(0, min(30, int(sowing_delay_days)))
        prev_crop_match = 1 if prev_crop_match else 0

        # Build feature vector
        features = pd.DataFrame([{
            'crop_id_encoded': crop_id_encoded,
            'soil_type_encoded': soil_type_encoded,
            'water_level': water_level,
            'sowing_delay_days': sowing_delay_days,
            'prev_crop_match': prev_crop_match,
        }])

        # Predict
        raw_pred = float(self.model.predict(features)[0])

        # Inverse-transform if model was trained on log(y)
        if self.log_transform:
            expected_yield = float(np.expm1(raw_pred))  # exp(pred) - 1
        else:
            expected_yield = raw_pred

        # Ensure non-negative
        expected_yield = max(0.01, expected_yield)

        # Yield range: ±10%
        yield_min = round(expected_yield * 0.9, 2)
        yield_max = round(expected_yield * 1.1, 2)

        # Confidence assessment
        high_soil = soil_type in ['BLACK', 'LOAM']
        good_water = water_level >= 2

        if high_soil and good_water:
            confidence = 'High'
        elif high_soil or good_water:
            confidence = 'Medium'
        else:
            confidence = 'Low'

        return {
            'crop_id': crop_id,
            'expected_yield': round(expected_yield, 2),
            'yield_range': f"{yield_min} - {yield_max}",
            'yield_min': yield_min,
            'yield_max': yield_max,
            'confidence': confidence,
            'unit': 'qtl/acre',
        }


# ──────────────────────────────────────────────────────────────
# Module-level convenience function (singleton pattern)
# ──────────────────────────────────────────────────────────────
_predictor: Optional[YieldPredictor] = None


def predict_crop_yield(
    crop_id: str,
    soil_type: str,
    water_level: int,
    sowing_delay_days: int,
    prev_crop_match: int = 1,
) -> dict:
    """Module-level convenience wrapper for predict_crop_yield."""
    global _predictor
    if _predictor is None:
        _predictor = YieldPredictor()
    return _predictor.predict_crop_yield(
        crop_id, soil_type, water_level, sowing_delay_days, prev_crop_match
    )


# ──────────────────────────────────────────────────────────────
# Demo / Self-Test
# ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("=" * 65)
    print("  AGRI-DECIDE — Yield Predictor Demo")
    print("=" * 65)

    try:
        predictor = YieldPredictor()
        print(f"  Model loaded. Log-transform: {predictor.log_transform}")
        print(f"  Supported crops: {list(predictor.crop_encoder.classes_)}")
        print(f"  Supported soils: {list(predictor.soil_encoder.classes_)}")

        sample_params = [
            ('SOYBEAN', 'BLACK', 3, 0, 1),
            ('SOYBEAN', 'BLACK', 2, 10, 0),
            ('MAIZE', 'LOAM', 3, 0, 1),
            ('MAIZE', 'SANDY', 1, 15, 1),
            ('WHEAT', 'BLACK', 3, 5, 0),
            ('TUR', 'RED', 2, 0, 1),
            ('COTTON', 'BLACK', 2, 7, 1),
            ('SUGARCANE', 'BLACK', 3, 0, 1),
            ('ONION', 'LOAM', 2, 5, 1),
            ('TOMATO', 'BLACK', 3, 0, 0),
        ]

        for params in sample_params:
            result = predictor.predict_crop_yield(*params)
            print(f"\n  {result['crop_id']:12s} | Soil={params[1]:6s} W={params[2]} "
                  f"Delay={params[3]:2d} Prev={params[4]} → "
                  f"{result['expected_yield']:8.2f} qtl/acre "
                  f"[{result['yield_range']}] ({result['confidence']})")

    except FileNotFoundError as e:
        print(f"\n  ❌ Cannot run demo: {e}")
        print("  Run train_yield_model.py first to train and save the model.")

    print("\n" + "=" * 65)
