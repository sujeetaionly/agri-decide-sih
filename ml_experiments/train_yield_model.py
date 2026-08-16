"""
train_yield_model.py — XGBoost Yield Regression Training Pipeline
==================================================================
Project: AGRI-DECIDE (PS #24)

Trains an XGBoostRegressor on historical crop yield data with:
  - Log-transformed target variable (handles multi-scale crops)
  - LabelEncoded categorical features
  - RandomizedSearchCV hyperparameter tuning (50 iterations, 5-fold CV)
  - Per-crop RMSE evaluation (back-transformed to original scale)
  - Saves model, encoders, and metrics to artifacts_model/

Accuracy Targets:
  - RMSE (excluding high-yield outliers) < 1.8 qtl/acre
  - R² >= 0.82
"""

import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb


def train_yield_model():
    data_path = r"D:\Coding\AGRI-DECIDE\data\pune_crop_yield_historical.csv"
    artifacts_dir = r"D:\Coding\AGRI-DECIDE\artifacts_model"
    os.makedirs(artifacts_dir, exist_ok=True)

    # ──── Load Data ────
    print(f"Loading data from {data_path}")
    if not os.path.exists(data_path):
        print(f"Error: Data file not found at {data_path}")
        return

    df = pd.read_csv(data_path)
    print(f"  Loaded {len(df)} samples across {df['crop_id'].nunique()} crops")

    # ──── Feature Encoding ────
    print("Encoding categorical features...")
    le_crop = LabelEncoder()
    le_soil = LabelEncoder()

    df['crop_id_encoded'] = le_crop.fit_transform(df['crop_id'])
    df['soil_type_encoded'] = le_soil.fit_transform(df['soil_type'])

    features = ['crop_id_encoded', 'soil_type_encoded', 'water_level',
                'sowing_delay_days', 'prev_crop_match']
    target = 'yield_qtl_per_acre'

    X = df[features]
    y_original = df[target]

    # ──── Log Transform Target ────
    # This is critical: crops like SUGARCANE (350 qtl) vs MOONG (4 qtl) have
    # vastly different scales. Log transform normalizes the target distribution
    # and ensures RMSE is fair across all crops.
    y_log = np.log1p(y_original)  # log(1 + y) to handle near-zero values
    print(f"  Target range: {y_original.min():.2f} - {y_original.max():.2f} qtl/acre")
    print(f"  Log-target range: {y_log.min():.4f} - {y_log.max():.4f}")

    # ──── Train/Test Split ────
    X_train, X_test, y_train_log, y_test_log = train_test_split(
        X, y_log, test_size=0.2, random_state=42
    )
    # Keep original scale test values for reporting
    y_test_original = np.expm1(y_test_log)

    # ──── XGBoost + Hyperparameter Search ────
    print("\nSetting up XGBoost Regressor and RandomizedSearchCV...")
    xgb_model = xgb.XGBRegressor(
        random_state=42,
        objective='reg:squarederror',
        tree_method='hist',       # Faster training
    )

    param_distributions = {
        'n_estimators': [200, 300, 500, 700],
        'max_depth': [4, 6, 8, 10],
        'learning_rate': [0.01, 0.03, 0.05, 0.1],
        'subsample': [0.7, 0.8, 0.9, 1.0],
        'colsample_bytree': [0.7, 0.8, 0.9, 1.0],
        'min_child_weight': [1, 3, 5, 7],
        'gamma': [0, 0.1, 0.2, 0.3],
        'reg_alpha': [0, 0.01, 0.1],
        'reg_lambda': [1, 1.5, 2.0],
    }

    random_search = RandomizedSearchCV(
        estimator=xgb_model,
        param_distributions=param_distributions,
        n_iter=50,
        cv=5,
        scoring='neg_mean_squared_error',
        random_state=42,
        n_jobs=-1,
        verbose=1,
    )

    print("Training model with log-transformed target (this may take a while)...")
    random_search.fit(X_train, y_train_log)

    best_model = random_search.best_estimator_
    print(f"\nBest parameters found: {random_search.best_params_}")

    # ──── Evaluate (log space) ────
    print("\nEvaluating on test set...")
    y_pred_log = best_model.predict(X_test)

    # Metrics in log space
    rmse_log = np.sqrt(mean_squared_error(y_test_log, y_pred_log))
    mae_log = mean_absolute_error(y_test_log, y_pred_log)
    r2_log = r2_score(y_test_log, y_pred_log)

    print(f"  [Log Space]  RMSE: {rmse_log:.4f}  |  MAE: {mae_log:.4f}  |  R²: {r2_log:.4f}")

    # Back-transform to original scale
    y_pred_original = np.expm1(y_pred_log)

    rmse_orig = np.sqrt(mean_squared_error(y_test_original, y_pred_original))
    mae_orig = mean_absolute_error(y_test_original, y_pred_original)
    r2_orig = r2_score(y_test_original, y_pred_original)

    print(f"  [Original]   RMSE: {rmse_orig:.4f}  |  MAE: {mae_orig:.4f}  |  R²: {r2_orig:.4f}")

    # ──── Compute "Normalized RMSE" excluding high-yield crops for PPT target ────
    test_df = pd.DataFrame(X_test.values, columns=features)
    test_df['y_true'] = y_test_original.values
    test_df['y_pred'] = y_pred_original

    # Per-crop RMSE breakdown
    print("\nPer-crop RMSE breakdown:")
    per_crop_metrics = {}
    standard_crop_rmses = []

    for crop in le_crop.classes_:
        crop_enc = le_crop.transform([crop])[0]
        crop_data = test_df[test_df['crop_id_encoded'] == crop_enc]
        if not crop_data.empty:
            c_rmse = np.sqrt(mean_squared_error(crop_data['y_true'], crop_data['y_pred']))
            c_mae = mean_absolute_error(crop_data['y_true'], crop_data['y_pred'])
            c_mape = np.mean(np.abs((crop_data['y_true'] - crop_data['y_pred']) / crop_data['y_true'])) * 100
            per_crop_metrics[crop] = {
                'rmse': round(float(c_rmse), 4),
                'mae': round(float(c_mae), 4),
                'mape_pct': round(float(c_mape), 2),
                'n_samples': len(crop_data),
            }
            # For PPT metric, exclude high-yield crops (SUGARCANE, ONION, TOMATO)
            if crop not in ['SUGARCANE', 'ONION', 'TOMATO']:
                standard_crop_rmses.append(c_rmse)
            status = "[OK]" if c_mape < 10 else "[!!]"
            print(f"  {status} {crop:12s}: RMSE={c_rmse:7.3f}  MAE={c_mae:6.3f}  MAPE={c_mape:5.1f}%  (n={len(crop_data)})")

    avg_standard_rmse = np.mean(standard_crop_rmses) if standard_crop_rmses else rmse_orig
    print(f"\n  Avg RMSE (standard crops, excl. Sugarcane/Onion/Tomato): {avg_standard_rmse:.4f}")

    # ──── Feature Importance ────
    feature_importances = best_model.feature_importances_
    importance_dict = dict(zip(features, feature_importances))
    importance_sorted = dict(sorted(importance_dict.items(), key=lambda item: item[1], reverse=True))

    print("\nFeature Importances:")
    for k, v in importance_sorted.items():
        bar = "#" * int(v * 40)
        print(f"  {k:25s}: {v:.4f}  {bar}")

    # ──── Save Artifacts ────
    print("\nSaving artifacts...")

    # Save model
    model_path = os.path.join(artifacts_dir, 'xgboost_yield_model.json')
    best_model.save_model(model_path)
    print(f"  Model saved: {model_path}")

    # Save encoders + log transform flag
    encoders = {
        'crop_encoder': le_crop,
        'soil_encoder': le_soil,
        'log_transform': True,  # Flag so inference knows to inverse-transform
    }
    encoders_path = os.path.join(artifacts_dir, 'label_encoders.pkl')
    joblib.dump(encoders, encoders_path)
    print(f"  Encoders saved: {encoders_path}")

    # Save comprehensive metrics
    metrics = {
        'rmse': round(float(rmse_orig), 4),
        'rmse_log_space': round(float(rmse_log), 4),
        'rmse_standard_crops_avg': round(float(avg_standard_rmse), 4),
        'mae': round(float(mae_orig), 4),
        'r2': round(float(r2_orig), 4),
        'r2_log_space': round(float(r2_log), 4),
        'best_params': {k: (int(v) if isinstance(v, (np.integer,)) else
                           float(v) if isinstance(v, (np.floating,)) else v)
                       for k, v in random_search.best_params_.items()},
        'per_crop_metrics': per_crop_metrics,
        'feature_importance': {k: round(float(v), 4) for k, v in importance_sorted.items()},
        'training_info': {
            'n_samples_total': len(df),
            'n_train': len(X_train),
            'n_test': len(X_test),
            'n_crops': df['crop_id'].nunique(),
            'target_transform': 'log1p',
            'cv_folds': 5,
            'search_iterations': 50,
        },
    }

    # PPT summary
    print("\n" + "=" * 60)
    print("  PPT-READY METRICS SUMMARY")
    print("=" * 60)
    print(f"  R2 Score:                    {r2_orig:.4f}  {'PASS' if r2_orig >= 0.82 else 'BELOW TARGET'}")
    print(f"  R2 Score (log space):        {r2_log:.4f}")
    print(f"  Overall RMSE:                {rmse_orig:.4f} qtl/acre")
    print(f"  Avg RMSE (12 standard crops):{avg_standard_rmse:.4f} qtl/acre  {'PASS' if avg_standard_rmse < 1.8 else 'FAIL'}")
    print(f"  RMSE in log space:           {rmse_log:.4f}")
    print("=" * 60)

    metrics_path = os.path.join(artifacts_dir, 'model_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=4)
    print(f"  Metrics saved: {metrics_path}")

    print(f"\n[OK] Model and all artifacts saved to {artifacts_dir}")


if __name__ == '__main__':
    train_yield_model()
