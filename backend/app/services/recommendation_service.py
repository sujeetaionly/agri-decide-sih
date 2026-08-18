"""
Recommendation Service:
Orchestrates multi-crop evaluation, suitability scoring, CACP economics,
sowing window analysis, explainable reasoning generation, and comparison matrices.
"""
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

# Fallback CACP Costs per Acre if DB records are not yet seeded
DEFAULT_CACP_COSTS = {
    "SOYBEAN": 28800.0,
    "MAIZE": 26300.0,
    "TUR": 24300.0,
    "COTTON": 40300.0,
    "BAJRA": 18800.0,
    "MOONG": 20300.0,
    "GROUNDNUT": 32300.0,
    "WHEAT": 24500.0,
    "GRAM": 19500.0,
    "JOWAR": 21000.0,
    "URAD": 20000.0,
    "SUNFLOWER": 25000.0,
    "SUGARCANE": 68000.0,
    "ONION": 45000.0,
    "TOMATO": 52000.0
}

CROP_NAMES = {
    "SOYBEAN": {"en": "Soybean (JS-335)", "hi": "सोयाबीन (जेएस-335)", "duration": 95, "category": "OILSEED"},
    "MAIZE": {"en": "Maize (Hybrid HQPM-1)", "hi": "मक्का (एचक्यूपीएम-1)", "duration": 105, "category": "CEREAL"},
    "TUR": {"en": "Tur / Arhar (BDN-711)", "hi": "अरहर / तुअर (बीडीएन-711)", "duration": 180, "category": "PULSE"},
    "COTTON": {"en": "Cotton (Bt Hybrid)", "hi": "कपास (बीटी हाइब्रिड)", "duration": 160, "category": "FIBRE"},
    "BAJRA": {"en": "Bajra (Pearl Millet - HHB 67)", "hi": "बाजरा (एचएचबी 67)", "duration": 85, "category": "CEREAL"},
    "MOONG": {"en": "Moong (Green Gram - IPM 205-7)", "hi": "मूंग (ग्रीन ग्राम - विराट)", "duration": 70, "category": "PULSE"},
    "GROUNDNUT": {"en": "Groundnut (TG-37A)", "hi": "मूंगफली (टीजी-37ए)", "duration": 120, "category": "OILSEED"},
    "WHEAT": {"en": "Wheat (HD-2967)", "hi": "गेहूं (एचडी-2967)", "duration": 125, "category": "CEREAL"},
    "GRAM": {"en": "Gram / Chana (Digvijay)", "hi": "चना (दिग्विजय)", "duration": 110, "category": "PULSE"},
    "JOWAR": {"en": "Jowar / Sorghum (CSH-16)", "hi": "ज्वार (सीएसएच-16)", "duration": 100, "category": "CEREAL"},
    "URAD": {"en": "Urad (Black Gram - TAU-1)", "hi": "उड़द (टीएयू-1)", "duration": 75, "category": "PULSE"},
    "SUNFLOWER": {"en": "Sunflower (KBSH-53)", "hi": "सूरजमुखी (केबीएसएच-53)", "duration": 90, "category": "OILSEED"},
    "SUGARCANE": {"en": "Sugarcane (Co-86032)", "hi": "गन्ना (को-86032)", "duration": 360, "category": "COMMERCIAL"},
    "ONION": {"en": "Onion (Bhima Super)", "hi": "प्याज (भीमा सुपर)", "duration": 120, "category": "HORTICULTURE"},
    "TOMATO": {"en": "Tomato (Abhinav)", "hi": "टमाटर (अभिनव)", "duration": 130, "category": "HORTICULTURE"},
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
    Generates explainable, localized rationale bullets for why this crop ranks #1.
    """
    crop_info = CROP_NAMES.get(crop_id, {"en": crop_id, "hi": crop_id, "duration": 90, "category": "CEREAL"})
    bullets = []

    # 1. Soil Match Bullet
    soil_names = {
        "BLACK": "काली मिट्टी (Black Soil)",
        "LOAM": "दोमट मिट्टी (Loam Soil)",
        "RED": "लाल मिट्टी (Red Soil)",
        "SANDY": "बलुई मिट्टी (Sandy Soil)"
    }
    soil_desc = soil_names.get(soil_type.upper(), "दोमट मिट्टी")
    bullets.append(f"{soil_desc} और खरीफ जलवायु के साथ {round(suitability_pct)}% सर्वोत्तम कृषि अनुकूलता।")

    # 2. Duration and Water
    water_desc = "पर्याप्त" if water_capacity.upper() in ["MEDIUM", "HIGH"] else "सीमित"
    bullets.append(f"{crop_info['duration']} दिनों की अवधि और {water_source} से {water_desc} पानी में सुरक्षित पैदावार।")

    # 3. Budget Fit
    if working_capital >= adjusted_cost:
        bullets.append(f"कम लागत (₹{int(adjusted_cost):,}/एकड़) आपके ₹{int(working_capital):,} के बजट में पूर्णतः अनुकूल।")
    else:
        bullets.append(f"लागत ₹{int(adjusted_cost):,}/एकड़ के साथ अधिकतम लाभ अनुपात।")

    # 4. Crop rotation
    if previous_crop and previous_crop.upper() in ["WHEAT", "RICE", "MAIZE"] and crop_info["category"] in ["PULSE", "OILSEED"]:
        bullets.append(f"{previous_crop.title()} के बाद दलहन/तिलहन फसल चक्र (Crop Rotation) से भूमि उर्वरता में वृद्धि।")
    else:
        bullets.append("क्षेत्रीय मंडी में सुलभ मांग और न्यूनतम मूल्य जोखिम।")

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
    Core Recommendation Engine.
    Evaluates candidate crops, calculates CACP economics, yields, and ranks them.
    """
    # 1. Resolve candidate crop list
    if not candidate_crops or len(candidate_crops) == 0:
        if soil_type.upper() in ["SANDY", "RED"]:
            active_candidates = ["BAJRA", "MOONG", "GROUNDNUT", "SOYBEAN"]
        else:
            active_candidates = ["SOYBEAN", "MAIZE", "TUR", "COTTON", "MOONG", "GROUNDNUT", "BAJRA"]
    else:
        active_candidates = [c.upper().strip() for c in candidate_crops]

    # Clean list of available crops
    valid_candidates = [c for c in active_candidates if c in CROP_NAMES]
    if not valid_candidates:
        valid_candidates = ["SOYBEAN", "MAIZE", "TUR", "COTTON"]

    # 2. Evaluate Sowing Window for first candidate / district general
    overall_sowing_eval = evaluate_sowing_window(planned_sowing_date)
    effective_sowing_delay = overall_sowing_eval["sowing_delay_days"] + sowing_delay_override

    evaluated_crops = []

    for crop_id in valid_candidates:
        crop_info = CROP_NAMES[crop_id]
        
        # 3. Sowing window evaluation for specific crop
        sowing_eval = evaluate_sowing_window(planned_sowing_date)
        sowing_status_text = "Optimal" if effective_sowing_delay <= 0 else ("Moderate" if effective_sowing_delay <= 15 else "Late")

        # 4. CACP Cost
        base_cacp = DEFAULT_CACP_COSTS.get(crop_id, 25000.0)
        if db:
            cost_rec = db.query(CropCostCACP).filter(CropCostCACP.crop_id == crop_id).first()
            if cost_rec:
                base_cacp = cost_rec.total_cost_per_acre

        adj_cost = calculate_adjusted_cost(base_cacp, owns_tractor, owns_sprayer)

        # 5. ML Yield Prediction
        yield_pred = predict_crop_yield(
            crop_id=crop_id,
            soil_type=soil_type,
            water_level=water_capacity_level,
            water_source=water_source,
            sowing_delay_days=effective_sowing_delay,
            rainfall_deficit_pct=rainfall_deficit_pct
        )
        exp_yield = yield_pred["expected_yield"]

        # 6. Price Forecast
        price_info = get_harvest_mandi_price(
            crop_id=crop_id,
            harvest_month=10,
            price_shock_pct=price_shock_pct
        )
        fc_price = price_info["forecasted_price_per_qtl"]

        # 7. Economics
        gross_rev = calculate_gross_revenue(exp_yield, fc_price)
        net_profit = calculate_net_profit(gross_rev, adj_cost)
        profit_per_day = calculate_net_profit_per_day(net_profit, crop_info["duration"])

        # 8. Suitability % Calculation
        score = 80.0
        # Soil fit
        if soil_type.upper() == "BLACK" and crop_id in ["SOYBEAN", "COTTON", "TUR", "MAIZE"]:
            score += 10.0
        elif soil_type.upper() in ["SANDY", "RED"] and crop_id in ["BAJRA", "MOONG", "GROUNDNUT"]:
            score += 12.0
        elif soil_type.upper() == "SANDY" and crop_id in ["COTTON", "SOYBEAN"]:
            score -= 15.0

        # Water fit
        if water_capacity_level.upper() == "LOW" and crop_id in ["BAJRA", "MOONG", "TUR"]:
            score += 8.0
        elif water_capacity_level.upper() == "LOW" and crop_id in ["COTTON", "SUGARCANE"]:
            score -= 20.0

        # Sowing delay penalty
        if effective_sowing_delay > 10:
            if crop_id in ["MOONG", "BAJRA"]:
                score += 5.0  # short duration advantage
            else:
                score -= min(25.0, effective_sowing_delay * 0.8)

        # Crop rotation bonus
        if previous_season_crop and previous_season_crop.upper() in ["WHEAT", "RICE", "MAIZE"] and crop_info["category"] in ["PULSE", "OILSEED"]:
            score += 6.0

        suitability_pct = min(98.0, max(50.0, round(score, 1)))

        evaluated_crops.append({
            "crop_id": crop_id,
            "crop_name_en": crop_info["en"],
            "crop_name_hi": crop_info["hi"],
            "suitability_pct": suitability_pct,
            "duration_days": crop_info["duration"],
            "expected_yield_qtl_per_acre": exp_yield,
            "yield_range_qtl": yield_pred["yield_range"],
            "total_cost_inr_per_acre": adj_cost,
            "forecasted_mandi_price_inr_per_qtl": fc_price,
            "expected_net_profit_per_acre_inr": net_profit,
            "net_profit_per_day_inr": profit_per_day,
            "price_volatility": price_info["price_volatility"],
            "sowing_window_status": sowing_status_text,
            "sort_score": (suitability_pct * 0.5) + (profit_per_day * 0.5)
        })

    # Sort crops by composite sort score descending
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
        "suitability_pct": top_crop["suitability_pct"],
        "duration_days": top_crop["duration_days"],
        "expected_yield_qtl_per_acre": top_crop["expected_yield_qtl_per_acre"],
        "yield_range_qtl": top_crop["yield_range_qtl"],
        "total_cost_inr_per_acre": top_crop["total_cost_inr_per_acre"],
        "forecasted_mandi_price_inr_per_qtl": top_crop["forecasted_mandi_price_inr_per_qtl"],
        "expected_net_profit_per_acre_inr": top_crop["expected_net_profit_per_acre_inr"],
        "net_profit_per_day_inr": top_crop["net_profit_per_day_inr"],
        "price_volatility": top_crop["price_volatility"],
        "why_recommended": why_bullets
    }

    # Format Comparison Matrix (Top 4 candidate crops)
    comparison_matrix = []
    for item in evaluated_crops[:4]:
        comparison_matrix.append({
            "crop_id": item["crop_id"],
            "crop_name_en": item["crop_name_en"].split(" (")[0],
            "crop_name_hi": item["crop_name_hi"].split(" (")[0],
            "suitability_pct": item["suitability_pct"],
            "sowing_window_status": item["sowing_window_status"],
            "total_cost_inr_per_acre": item["total_cost_inr_per_acre"],
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
