"""
Recommendation Service:
Orchestrates multi-crop evaluation, suitability scoring, CACP economics,
sowing window analysis, explainable reasoning generation, and comparison matrices.
"""
import os
import pandas as pd
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.models.crop import Crop, CropCostCACP, DistrictSowingWindow
from backend.app.services.economics_service import (
    calculate_adjusted_cost,
    calculate_gross_revenue,
    calculate_net_profit,
    calculate_net_profit_per_day
)
from backend.app.services.sowing_window_service import evaluate_sowing_window
from backend.app.models_ml.yield_predictor import predict_crop_yield
from backend.app.models_ml.price_forecaster import get_harvest_mandi_price

# Load CACP Itemized Cost Breakdown from CSV
CACP_CSV_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "data", "official_real_data", "cacp_itemized_costs_pune.csv"
)

ITEMIZED_CACP_COSTS: Dict[str, Dict[str, float]] = {}

if os.path.exists(CACP_CSV_PATH):
    try:
        df_cacp = pd.read_csv(CACP_CSV_PATH)
        for _, row in df_cacp.iterrows():
            cid = str(row["crop_id"]).upper().strip()
            ITEMIZED_CACP_COSTS[cid] = {
                "seed_cost": float(row.get("seed_cost", 1500.0)),
                "fertilizer_cost": float(row.get("fertilizer_cost", 2500.0)),
                "pesticide_cost": float(row.get("pesticide_cost", 1000.0)),
                "machinery_rental_cost": float(row.get("machinery_rental_cost", 2500.0)),
                "labour_cost": float(row.get("labour_cost", 4000.0)),
                "irrigation_electricity_cost": float(row.get("irrigation_electricity_cost", 800.0)),
                "operational_cost_a2_inr_per_acre": float(row.get("operational_cost_a2_inr_per_acre", 15000.0)),
                "family_labor_cost_per_acre": float(row.get("family_labor_cost_per_acre", 3000.0)),
                "total_cost_a2_fl_inr_per_acre": float(row.get("total_cost_a2_fl_inr_per_acre", 18000.0)),
            }
    except Exception as e:
        print(f"[WARN] Error loading CACP itemized CSV: {e}")

# Fallback CACP Costs per Acre if CSV or DB records are not available
DEFAULT_CACP_COSTS = {
    "SOYBEAN": 19412.0,
    "MAIZE": 18211.0,
    "TUR": 24436.0,
    "COTTON": 26300.0,
    "BAJRA": 17264.0,
    "MOONG": 14015.0,
    "GROUNDNUT": 30351.0,
    "WHEAT": 16582.0,
    "GRAM": 13465.0,
    "JOWAR": 16000.0,
    "URAD": 12202.0,
    "SUNFLOWER": 13152.0,
    "SUGARCANE": 57053.0,
    "ONION": 41278.0,
    "TOMATO": 52002.0
}

# Clean Pure Indic Names (No Hybrid English Clutter)
CROP_NAMES = {
    "SOYBEAN": {"en": "Soybean", "hi": "सोयाबीन", "mr": "सोयाबीन", "duration": 95, "category": "OILSEED"},
    "MAIZE": {"en": "Maize", "hi": "मक्का", "mr": "मका", "duration": 105, "category": "CEREAL"},
    "TUR": {"en": "Tur", "hi": "अरहर", "mr": "तूर", "duration": 180, "category": "PULSE"},
    "COTTON": {"en": "Cotton", "hi": "कपास", "mr": "कापूस", "duration": 160, "category": "FIBRE"},
    "BAJRA": {"en": "Bajra", "hi": "बाजरा", "mr": "बाजरी", "duration": 85, "category": "CEREAL"},
    "MOONG": {"en": "Moong", "hi": "मूंग", "mr": "मूग", "duration": 70, "category": "PULSE"},
    "GROUNDNUT": {"en": "Groundnut", "hi": "मूंगफली", "mr": "भुईमूग", "duration": 120, "category": "OILSEED"},
    "WHEAT": {"en": "Wheat", "hi": "गेहूं", "mr": "गहू", "duration": 125, "category": "CEREAL"},
    "GRAM": {"en": "Gram", "hi": "चना", "mr": "हरभरा", "duration": 110, "category": "PULSE"},
    "JOWAR": {"en": "Jowar", "hi": "ज्वार", "mr": "ज्वारी", "duration": 100, "category": "CEREAL"},
    "URAD": {"en": "Urad", "hi": "उड़द", "mr": "उडीद", "duration": 75, "category": "PULSE"},
    "SUNFLOWER": {"en": "Sunflower", "hi": "सूरजमुखी", "mr": "सूर्यफूल", "duration": 90, "category": "OILSEED"},
    "SUGARCANE": {"en": "Sugarcane", "hi": "गन्ना", "mr": "ऊस", "duration": 360, "category": "COMMERCIAL"},
    "ONION": {"en": "Onion", "hi": "प्याज", "mr": "कांदा", "duration": 120, "category": "HORTICULTURE"},
    "TOMATO": {"en": "Tomato", "hi": "टमाटर", "mr": "टोमॅटो", "duration": 130, "category": "HORTICULTURE"},
}

def generate_why_recommended(
    crop_id: str,
    soil_type: str,
    water_source: str,
    water_capacity: str,
    working_capital: float,
    adjusted_cost: float,
    previous_crop: Optional[str],
    sowing_status: str,
    suitability_pct: float
) -> List[str]:
    """
    Generates explainable, localized rationale bullets in pure Indic language.
    """
    crop_info = CROP_NAMES.get(crop_id, {"en": crop_id, "hi": crop_id, "duration": 90, "category": "CEREAL"})
    bullets = []

    soil_names = {
        "BLACK": "काली मिट्टी",
        "LOAM": "दोमट मिट्टी",
        "RED": "लाल मिट्टी",
        "SANDY": "बलुई मिट्टी",
        "CLAY": "चिकनी मिट्टी"
    }
    soil_desc = soil_names.get(soil_type.upper(), "दोमट मिट्टी")
    bullets.append(f"{soil_desc} और स्थानीय मौसम के साथ {round(suitability_pct)}% सबसे उत्तम कृषि अनुकूलता।")

    water_desc = "पर्याप्त" if water_capacity.upper() in ["MEDIUM", "HIGH"] else "सीमित"
    bullets.append(f"{crop_info['duration']} दिनों की फसल अवधि में {water_source} से {water_desc} पानी में सुरक्षित पैदावार।")

    if working_capital >= adjusted_cost:
        bullets.append(f"अनुमानित लागत (₹{int(adjusted_cost):,}/एकड़) आपके ₹{int(working_capital):,} के बजट में पूर्णतः सुरक्षित।")
    else:
        bullets.append(f"लागत ₹{int(adjusted_cost):,}/एकड़ के साथ सर्वाधिक शुद्ध मुनाफा।")

    if previous_crop and previous_crop.upper() in ["WHEAT", "RICE", "MAIZE"] and crop_info["category"] in ["PULSE", "OILSEED"]:
        bullets.append(f"पिछली फसल के बाद दलहन/तिलहन फसल चक्र से खेत की उर्वरा शक्ति में वृद्धि।")
    else:
        bullets.append("क्षेत्रीय कृषि मंडी में सुलभ मांग और स्थिर भाव।")

    return bullets

def recommend_crops_engine(
    soil_type: str = "BLACK",
    water_source: str = "WELL",
    water_capacity_level: str = "MEDIUM",
    working_capital_inr: float = 80000.0,
    previous_season_crop: Optional[str] = "WHEAT",
    owns_tractor: bool = False,
    owns_sprayer: bool = False,
    planned_sowing_date: str = "2027-06-25",
    candidate_crops: Optional[List[str]] = None,
    sowing_delay_override: int = 0,
    rainfall_deficit_pct: float = 0.0,
    price_shock_pct: float = 0.0,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Core Recommendation Engine with itemized CACP cost breakdowns and pure Indic output.
    """
    # 1. Resolve candidate crop list
    if not candidate_crops or len(candidate_crops) == 0:
        if soil_type.upper() in ["SANDY", "RED"]:
            active_candidates = ["BAJRA", "MOONG", "GROUNDNUT", "SOYBEAN"]
        else:
            active_candidates = ["SOYBEAN", "MAIZE", "TUR", "COTTON", "MOONG", "GROUNDNUT", "BAJRA"]
    else:
        active_candidates = [c.upper().strip() for c in candidate_crops]

    valid_candidates = [c for c in active_candidates if c in CROP_NAMES]
    if not valid_candidates:
        valid_candidates = ["SOYBEAN", "MAIZE", "TUR", "COTTON"]

    # 2. Evaluate Sowing Window
    overall_sowing_eval = evaluate_sowing_window(planned_sowing_date)
    effective_sowing_delay = overall_sowing_eval["sowing_delay_days"] + sowing_delay_override

    evaluated_crops = []

    for crop_id in valid_candidates:
        crop_info = CROP_NAMES[crop_id]
        sowing_status_text = "Optimal" if effective_sowing_delay <= 0 else ("Moderate" if effective_sowing_delay <= 15 else "Late")

        # 3. Itemized CACP Cost Breakdown
        cost_breakdown_dict = ITEMIZED_CACP_COSTS.get(crop_id)
        if not cost_breakdown_dict:
            base_cost = DEFAULT_CACP_COSTS.get(crop_id, 20000.0)
            cost_breakdown_dict = {
                "seed_cost": round(base_cost * 0.10, 2),
                "fertilizer_cost": round(base_cost * 0.20, 2),
                "pesticide_cost": round(base_cost * 0.08, 2),
                "machinery_rental_cost": round(base_cost * 0.15, 2),
                "labour_cost": round(base_cost * 0.35, 2),
                "irrigation_electricity_cost": round(base_cost * 0.07, 2),
                "operational_cost_a2_inr_per_acre": base_cost,
                "family_labor_cost_per_acre": round(base_cost * 0.20, 2),
                "total_cost_a2_fl_inr_per_acre": round(base_cost * 1.20, 2),
            }

        base_cacp = cost_breakdown_dict["operational_cost_a2_inr_per_acre"]
        adj_cost = calculate_adjusted_cost(base_cacp, owns_tractor, owns_sprayer)

        # 4. ML Yield Prediction
        yield_pred = predict_crop_yield(
            crop_id=crop_id,
            soil_type=soil_type,
            water_level=water_capacity_level,
            water_source=water_source,
            sowing_delay_days=effective_sowing_delay,
            rainfall_deficit_pct=rainfall_deficit_pct
        )
        exp_yield = yield_pred["expected_yield"]

        # 5. Price Forecast
        price_info = get_harvest_mandi_price(
            crop_id=crop_id,
            harvest_month=10,
            price_shock_pct=price_shock_pct
        )
        fc_price = price_info["forecasted_price_per_qtl"]

        # 6. Economics
        gross_rev = calculate_gross_revenue(exp_yield, fc_price)
        net_profit = calculate_net_profit(gross_rev, adj_cost)
        profit_per_day = calculate_net_profit_per_day(net_profit, crop_info["duration"])

        # 7. Suitability % Calculation
        score = 80.0
        if soil_type.upper() == "BLACK" and crop_id in ["SOYBEAN", "COTTON", "TUR", "MAIZE"]:
            score += 10.0
        elif soil_type.upper() in ["SANDY", "RED"] and crop_id in ["BAJRA", "MOONG", "GROUNDNUT"]:
            score += 12.0
        elif soil_type.upper() == "SANDY" and crop_id in ["COTTON", "SOYBEAN"]:
            score -= 15.0

        if water_capacity_level.upper() == "LOW" and crop_id in ["BAJRA", "MOONG", "TUR"]:
            score += 8.0
        elif water_capacity_level.upper() == "LOW" and crop_id in ["COTTON", "SUGARCANE"]:
            score -= 20.0

        if effective_sowing_delay > 10:
            if crop_id in ["MOONG", "BAJRA"]:
                score += 5.0
            else:
                score -= min(25.0, effective_sowing_delay * 0.8)

        if previous_season_crop and previous_season_crop.upper() in ["WHEAT", "RICE", "MAIZE"] and crop_info["category"] in ["PULSE", "OILSEED"]:
            score += 6.0

        suitability_pct = min(98.0, max(50.0, round(score, 1)))

        evaluated_crops.append({
            "crop_id": crop_id,
            "crop_name_en": crop_info["en"],
            "crop_name_hi": crop_info["hi"],
            "crop_name_mr": crop_info.get("mr", crop_info["hi"]),
            "suitability_pct": suitability_pct,
            "duration_days": crop_info["duration"],
            "expected_yield_qtl_per_acre": exp_yield,
            "yield_range_qtl": yield_pred["yield_range"],
            "total_cost_inr_per_acre": adj_cost,
            "cost_breakdown": cost_breakdown_dict,
            "forecasted_mandi_price_inr_per_qtl": fc_price,
            "expected_net_profit_per_acre_inr": net_profit,
            "net_profit_per_day_inr": profit_per_day,
            "price_volatility": price_info["price_volatility"],
            "sowing_window_status": sowing_status_text,
            "sort_score": (suitability_pct * 0.5) + (profit_per_day * 0.5)
        })

    # Sort crops by composite score descending
    evaluated_crops.sort(key=lambda x: x["sort_score"], reverse=True)

    top_crop = evaluated_crops[0]
    why_bullets = generate_why_recommended(
        crop_id=top_crop["crop_id"],
        soil_type=soil_type,
        water_source=water_source,
        water_capacity=water_capacity_level,
        working_capital=working_capital_inr,
        adjusted_cost=top_crop["total_cost_inr_per_acre"],
        previous_crop=previous_season_crop,
        sowing_status=top_crop["sowing_window_status"],
        suitability_pct=top_crop["suitability_pct"]
    )

    top_recommendation = {
        "crop_id": top_crop["crop_id"],
        "crop_name_en": top_crop["crop_name_en"],
        "crop_name_hi": top_crop["crop_name_hi"],
        "crop_name_mr": top_crop["crop_name_mr"],
        "suitability_pct": top_crop["suitability_pct"],
        "duration_days": top_crop["duration_days"],
        "expected_yield_qtl_per_acre": top_crop["expected_yield_qtl_per_acre"],
        "yield_range_qtl": top_crop["yield_range_qtl"],
        "total_cost_inr_per_acre": top_crop["total_cost_inr_per_acre"],
        "cost_breakdown": top_crop["cost_breakdown"],
        "forecasted_mandi_price_inr_per_qtl": top_crop["forecasted_mandi_price_inr_per_qtl"],
        "expected_net_profit_per_acre_inr": top_crop["expected_net_profit_per_acre_inr"],
        "net_profit_per_day_inr": top_crop["net_profit_per_day_inr"],
        "price_volatility": top_crop["price_volatility"],
        "why_recommended": why_bullets
    }

    comparison_matrix = []
    for item in evaluated_crops[:4]:
        comparison_matrix.append({
            "crop_id": item["crop_id"],
            "crop_name_en": item["crop_name_en"],
            "crop_name_hi": item["crop_name_hi"],
            "crop_name_mr": item["crop_name_mr"],
            "suitability_pct": item["suitability_pct"],
            "sowing_window_status": item["sowing_window_status"],
            "total_cost_inr_per_acre": item["total_cost_inr_per_acre"],
            "cost_breakdown": item["cost_breakdown"],
            "expected_yield_qtl_per_acre": item["expected_yield_qtl_per_acre"],
            "forecasted_mandi_price_inr_per_qtl": item["forecasted_mandi_price_inr_per_qtl"],
            "expected_net_profit_per_acre_inr": item["expected_net_profit_per_acre_inr"],
            "duration_days": item["duration_days"],
            "net_profit_per_day_inr": item["net_profit_per_day_inr"]
        })

    return {
        "sowing_window": {
            "status": overall_sowing_eval["status"],
            "badge_text": overall_sowing_eval["badge_text"],
            "badge_color": overall_sowing_eval["badge_color"]
        },
        "top_recommendation": top_recommendation,
        "comparison_matrix": comparison_matrix
    }
