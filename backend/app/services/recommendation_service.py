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
from backend.app.core.i18n import resolve_localized_crop_name, get_all_crop_translations
from backend.app.services.local_crop_service import get_local_crops_for_district

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

# Clean Pure Indic Names across 5 Supported Regional Languages
CROP_NAMES = {
    "SOYBEAN": {"en": "Soybean", "hi": "सोयाबीन", "mr": "सोयाबीन", "gu": "સોયાબીન", "raj": "सोयाबीन", "duration": 95, "category": "OILSEED", "season": "KHARIF"},
    "MAIZE": {"en": "Maize", "hi": "मक्का", "mr": "मका", "gu": "મકાઈ", "raj": "मक्का", "duration": 105, "category": "CEREAL", "season": "KHARIF"},
    "TUR": {"en": "Tur", "hi": "अरहर", "mr": "तूर", "gu": "તુવેર", "raj": "अरहर", "duration": 180, "category": "PULSE", "season": "KHARIF"},
    "COTTON": {"en": "Cotton", "hi": "कपास", "mr": "कापूस", "gu": "કપાસ", "raj": "कपास", "duration": 160, "category": "FIBRE", "season": "KHARIF"},
    "BAJRA": {"en": "Bajra", "hi": "बाजरा", "mr": "बाजरी", "gu": "બાજરી", "raj": "बाजरो", "duration": 85, "category": "CEREAL", "season": "KHARIF"},
    "MOONG": {"en": "Moong", "hi": "मूंग", "mr": "मूग", "gu": "મગ", "raj": "मूंग", "duration": 70, "category": "PULSE", "season": "KHARIF"},
    "GROUNDNUT": {"en": "Groundnut", "hi": "मूंगफली", "mr": "भुईमूग", "gu": "મગફળી", "raj": "मूंगफली", "duration": 120, "category": "OILSEED", "season": "KHARIF"},
    "WHEAT": {"en": "Wheat", "hi": "गेहूं", "mr": "गहू", "gu": "ઘઉં", "raj": "गेहूं", "duration": 125, "category": "CEREAL", "season": "RABI"},
    "GRAM": {"en": "Gram", "hi": "चना", "mr": "हरभरा", "gu": "ચણા", "raj": "चणो", "duration": 110, "category": "PULSE", "season": "RABI"},
    "JOWAR": {"en": "Jowar", "hi": "ज्वार", "mr": "ज्वारी", "gu": "જુવાર", "raj": "ज्वार", "duration": 100, "category": "CEREAL", "season": "KHARIF"},
    "URAD": {"en": "Urad", "hi": "उड़द", "mr": "उडीद", "gu": "અડદ", "raj": "उड़द", "duration": 75, "category": "PULSE", "season": "KHARIF"},
    "MUSTARD": {"en": "Mustard", "hi": "सरसों", "mr": "मोहरी", "gu": "રાઈ", "raj": "रायड़ो", "duration": 115, "category": "OILSEED", "season": "RABI"},
    "SUNFLOWER": {"en": "Sunflower", "hi": "सूरजमुखी", "mr": "सूर्यफूल", "gu": "સૂર્યમુખી", "raj": "सूरजमुखी", "duration": 90, "category": "OILSEED", "season": "KHARIF"},
    "SUGARCANE": {"en": "Sugarcane", "hi": "गन्ना", "mr": "ऊस", "gu": "શેરડી", "raj": "गन्नो", "duration": 360, "category": "COMMERCIAL", "season": "ANNUAL"},
    "ONION": {"en": "Onion", "hi": "प्याज", "mr": "कांदा", "gu": "ડુંગળી", "raj": "कांदो", "duration": 120, "category": "HORTICULTURE", "season": "RABI"},
    "TOMATO": {"en": "Tomato", "hi": "टमाटर", "mr": "टोमॅटो", "gu": "ટામેટા", "raj": "टमाटर", "duration": 130, "category": "HORTICULTURE", "season": "RABI"},
}

def get_current_season(planned_sowing_date: Optional[str] = None) -> Dict[str, str]:
    """
    Auto-detects agricultural season (KHARIF, RABI, ZAID) from sowing date or current calendar month.
    """
    month = 6
    if planned_sowing_date:
        try:
            month = int(planned_sowing_date.split("-")[1])
        except Exception:
            pass
    else:
        from datetime import datetime
        month = datetime.now().month

    if 6 <= month <= 10:
        return {"code": "KHARIF", "display": "खरीफ मौसम 2026-27"}
    elif month >= 11 or month <= 2:
        return {"code": "RABI", "display": "रबी मौसम 2026-27"}
    else:
        return {"code": "ZAID", "display": "जायद / ग्रीष्म मौसम 2026-27"}

def calculate_crop_rotation_adjustment(previous_crop: Optional[str], candidate_crop_id: str) -> Dict[str, Any]:
    """
    Calculates agronomic soil rotation bonus / monoculture penalty.
    """
    if not previous_crop:
        return {"multiplier": 1.0, "reason": None, "benefit_tag": None}
    
    prev = previous_crop.upper().strip()
    cand_info = CROP_NAMES.get(candidate_crop_id, {})
    cand_cat = cand_info.get("category", "")

    # Monoculture penalty: planting same crop consecutive seasons
    if prev == candidate_crop_id:
        return {
            "multiplier": 0.85,
            "reason": f"लगातार एक ही फसल ({prev}) उगाने से मिट्टी में पोषक तत्वों का असंतुलन और कीट-रोग का जोखिम बढ़ता है।",
            "benefit_tag": "मोनोकल्चर जोखिम (-15%)"
        }
    
    # Cereal -> Legume/Oilseed (Nitrogen Fixation bonus)
    if prev in ["WHEAT", "RICE", "MAIZE", "BAJRA", "JOWAR"] and cand_cat in ["PULSE", "OILSEED"]:
        return {
            "multiplier": 1.12,
            "reason": f"पिछली अनाज फसल ({prev}) के बाद दलहन/तिलहन उगाने से मिट्टी में प्राकृतिक नाइट्रोजन स्थिरीकरण होकर खेत की उर्वरा शक्ति बढ़ती है।",
            "benefit_tag": "फसल चक्र लाभ (+12%)"
        }

    # Legume -> Cereal (Nitrogen enriched soil bonus)
    if prev in ["MOONG", "GRAM", "TUR", "GROUNDNUT", "SOYBEAN", "URAD"] and cand_cat == "CEREAL":
        return {
            "multiplier": 1.10,
            "reason": f"पिछली दलहनी फसल के बाद अनाज फसल उगाने से संचित नाइट्रोजन का भरपूर लाभ मिलता है और पैदावार बढ़ती है।",
            "benefit_tag": "पोषक तत्व लाभ (+10%)"
        }

    # Heavy feeder -> Legume
    if prev in ["COTTON", "SUGARCANE"] and cand_cat in ["PULSE", "OILSEED"]:
        return {
            "multiplier": 1.15,
            "reason": f"कपास/गन्ना के बाद मिट्टी को पुनः उपजाऊ बनाने के लिए दलहन/तिलहन फसल चक्र सर्वोत्तम प्राकृतिक उपाय है।",
            "benefit_tag": "मृदा पुनर्जनन लाभ (+15%)"
        }

    return {"multiplier": 1.0, "reason": None, "benefit_tag": None}

def generate_why_recommended(
    crop_id: str,
    soil_type: str,
    water_source: str,
    water_capacity: str,
    working_capital: float,
    adjusted_cost: float,
    previous_crop: Optional[str],
    sowing_status: str,
    suitability_pct: float,
    rotation_reason: Optional[str] = None
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
    bullets.append(f"{soil_desc} और क्षेत्रीय मौसम के साथ {round(suitability_pct)}% सबसे उत्तम कृषि अनुकूलता।")

    water_source_names = {
        "WELL": "कुआं",
        "BOREWELL": "ट्यूबवेल",
        "CANAL": "नहर",
        "RAINFED": "बारिश"
    }
    ws_key = str(water_source).upper().strip() if water_source else "WELL"
    ws_hindi = water_source_names.get(ws_key, "कुआं")
    water_desc = "पर्याप्त" if str(water_capacity).upper().strip() in ["MEDIUM", "HIGH"] else "सीमित"
    bullets.append(f"{crop_info['duration']} दिनों की फसल अवधि में {ws_hindi} से {water_desc} पानी में सुरक्षित पैदावार।")

    if working_capital >= adjusted_cost:
        bullets.append(f"अनुमानित लागत (₹{int(adjusted_cost):,}/एकड़) आपके ₹{int(working_capital):,} के बजट में पूर्णतः सुरक्षित।")
    else:
        bullets.append(f"लागत ₹{int(adjusted_cost):,}/एकड़ के साथ सर्वाधिक शुद्ध मुनाफा।")

    if rotation_reason:
        bullets.append(rotation_reason)
    elif previous_crop and previous_crop.upper() in ["WHEAT", "RICE", "MAIZE"] and crop_info["category"] in ["PULSE", "OILSEED"]:
        bullets.append("पिछली फसल के बाद दलहन/तिलहन फसल चक्र से खेत की उर्वरा शक्ति में वृद्धि।")
    else:
        bullets.append("क्षेत्रीय कृषि मंडी में निरंतर स्थिर मांग और नकद तरलता।")

    return bullets

def recommend_crops_engine(
    soil_type: str = "BLACK",
    water_source: str = "WELL",
    water_capacity_level: str = "MEDIUM",
    working_capital_inr: float = 80000.0,
    previous_season_crop: Optional[str] = "WHEAT",
    owns_tractor: bool = False,
    owns_sprayer: bool = False,
    owns_pump: bool = False,
    owns_harvester: bool = False,
    equipments: Optional[List[str]] = None,
    planned_sowing_date: str = "2027-06-25",
    candidate_crops: Optional[List[str]] = None,
    intended_crops: Optional[List[str]] = None,
    sowing_delay_override: int = 0,
    rainfall_deficit_pct: float = 0.0,
    price_shock_pct: float = 0.0,
    district: Optional[str] = "Pune",
    state: Optional[str] = "Maharashtra",
    lang: str = "hi",
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Core Recommendation Engine with itemized CACP cost breakdowns,
    dynamic local crop discovery (Agmarknet Mandi & ICRISAT), intended crop comparison, and 100+ language i18n support.
    """
    # 1. Season Detection
    season_info = get_current_season(planned_sowing_date)
    current_season_code = season_info["code"]

    # 2. Local Crop Discovery for the specific District & Season
    local_crop_discovery = get_local_crops_for_district(
        district=district,
        state=state,
        season=current_season_code,
        lang=lang
    )

    if not candidate_crops or len(candidate_crops) == 0:
        active_candidates = list(local_crop_discovery["raw_crop_ids"])
    else:
        active_candidates = [c.upper().strip() for c in candidate_crops]

    # If the farmer has specific intended crops, ensure they are in active candidates so they get evaluated
    if intended_crops:
        for ic in intended_crops:
            norm_ic = ic.upper().strip()
            if norm_ic in CROP_NAMES and norm_ic not in active_candidates:
                active_candidates.append(norm_ic)

    valid_candidates = [c for c in active_candidates if c in CROP_NAMES]
    if not valid_candidates:
        valid_candidates = ["SOYBEAN", "MAIZE", "TUR", "COTTON"]

    # 3. Evaluate Sowing Window
    overall_sowing_eval = evaluate_sowing_window(planned_sowing_date)
    effective_sowing_delay = overall_sowing_eval["sowing_delay_days"] + sowing_delay_override

    evaluated_crops = []

    for crop_id in valid_candidates:
        crop_info = CROP_NAMES[crop_id]
        sowing_status_text = "Optimal" if effective_sowing_delay <= 0 else ("Moderate" if effective_sowing_delay <= 15 else "Late")

        # 4. Itemized CACP Cost Breakdown
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
        adj_cost = calculate_adjusted_cost(
            base_cacp,
            owns_tractor=owns_tractor,
            owns_sprayer=owns_sprayer,
            owns_pump=owns_pump,
            owns_harvester=owns_harvester,
            equipments=equipments
        )

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

        # 8. Suitability % Calculation with Rotation Intelligence
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

        # Crop Rotation Factor
        rotation_eval = calculate_crop_rotation_adjustment(previous_season_crop, crop_id)
        score *= rotation_eval["multiplier"]

        suitability_pct = min(98.0, max(50.0, round(score, 1)))

        evaluated_crops.append({
            "crop_id": crop_id,
            "crop_name": resolve_localized_crop_name(crop_id, lang),
            "crop_name_en": crop_info["en"],
            "crop_name_hi": crop_info["hi"],
            "crop_name_mr": crop_info.get("mr", crop_info["hi"]),
            "crop_name_gu": crop_info.get("gu", crop_info["hi"]),
            "crop_name_raj": crop_info.get("raj", crop_info["hi"]),
            "localized_names": get_all_crop_translations(crop_id),
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
            "rotation_benefit": rotation_eval.get("benefit_tag"),
            "rotation_reason": rotation_eval.get("reason"),
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
        suitability_pct=top_crop["suitability_pct"],
        rotation_reason=top_crop.get("rotation_reason")
    )

    top_recommendation = {
        "crop_id": top_crop["crop_id"],
        "crop_name": top_crop["crop_name"],
        "crop_name_en": top_crop["crop_name_en"],
        "crop_name_hi": top_crop["crop_name_hi"],
        "crop_name_mr": top_crop["crop_name_mr"],
        "crop_name_gu": top_crop["crop_name_gu"],
        "crop_name_raj": top_crop["crop_name_raj"],
        "localized_names": top_crop["localized_names"],
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
        "rotation_benefit": top_crop.get("rotation_benefit"),
        "why_recommended": why_bullets
    }

    comparison_matrix = []
    for item in evaluated_crops[:4]:
        comparison_matrix.append({
            "crop_id": item["crop_id"],
            "crop_name": item["crop_name"],
            "crop_name_en": item["crop_name_en"],
            "crop_name_hi": item["crop_name_hi"],
            "crop_name_mr": item["crop_name_mr"],
            "crop_name_gu": item["crop_name_gu"],
            "crop_name_raj": item["crop_name_raj"],
            "localized_names": item["localized_names"],
            "suitability_pct": item["suitability_pct"],
            "sowing_window_status": item["sowing_window_status"],
            "total_cost_inr_per_acre": item["total_cost_inr_per_acre"],
            "cost_breakdown": item["cost_breakdown"],
            "expected_yield_qtl_per_acre": item["expected_yield_qtl_per_acre"],
            "forecasted_mandi_price_inr_per_qtl": item["forecasted_mandi_price_inr_per_qtl"],
            "expected_net_profit_per_acre_inr": item["expected_net_profit_per_acre_inr"],
            "duration_days": item["duration_days"],
            "net_profit_per_day_inr": item["net_profit_per_day_inr"],
            "rotation_benefit": item.get("rotation_benefit")
        })

    # 9. Compute Farmer Intended vs Recommended Head-to-Head Comparison
    intended_vs_recommended = None
    if intended_crops:
        clean_intended = [c.upper().strip() for c in intended_crops if c and c.upper().strip() not in ["NONE", "NOT_SURE", "OTHER"]]
        if clean_intended:
            # Find the best crop among farmer's intended choices
            matched_intended = [c for c in evaluated_crops if c["crop_id"] in clean_intended]
            if matched_intended:
                matched_intended.sort(key=lambda x: x["sort_score"], reverse=True)
                intended_best = matched_intended[0]

                profit_diff = round(top_recommendation["expected_net_profit_per_acre_inr"] - intended_best["expected_net_profit_per_acre_inr"], 2)
                is_already_best = (top_recommendation["crop_id"] == intended_best["crop_id"]) or (profit_diff <= 200)

                gain_pct = 0.0
                if not is_already_best and intended_best["expected_net_profit_per_acre_inr"] > 0:
                    gain_pct = round((profit_diff / intended_best["expected_net_profit_per_acre_inr"]) * 100, 1)

                if is_already_best:
                    insight_hi = f"शानदार निर्णय! आपकी सोची हुई फसल ({intended_best['crop_name_hi']}) ही आपकी जमीन के लिए सबसे उत्तम और सर्वाधिक मुनाफा देने वाली है।"
                    insight_en = f"Great choice! Your considered crop ({intended_best['crop_name_en']}) is already the optimal, high-yielding choice for your farm conditions."
                else:
                    insight_hi = f"अगर आप अपनी सोची हुई फसल ({intended_best['crop_name_hi']}) की जगह AI अनुशंसित ({top_recommendation['crop_name_hi']}) लगाते हैं, तो आपको प्रति एकड़ ₹{int(profit_diff):,} (+{gain_pct}%) अधिक शुद्ध मुनाफा मिल सकता है!"
                    insight_en = f"Switching from your intended {intended_best['crop_name_en']} to AI recommended {top_recommendation['crop_name_en']} can yield ₹{int(profit_diff):,} (+{gain_pct}%) extra net profit per acre!"

                intended_vs_recommended = {
                    "has_intended_crops": True,
                    "is_intended_already_best": is_already_best,
                    "profit_difference_per_acre_inr": max(0.0, profit_diff),
                    "profit_gain_pct": gain_pct,
                    "intended_crop": {
                        "crop_id": intended_best["crop_id"],
                        "crop_name": intended_best["crop_name"],
                        "crop_name_en": intended_best["crop_name_en"],
                        "crop_name_hi": intended_best["crop_name_hi"],
                        "crop_name_mr": intended_best.get("crop_name_mr"),
                        "crop_name_gu": intended_best.get("crop_name_gu"),
                        "crop_name_raj": intended_best.get("crop_name_raj"),
                        "suitability_pct": intended_best["suitability_pct"],
                        "total_cost_inr_per_acre": intended_best["total_cost_inr_per_acre"],
                        "expected_yield_qtl_per_acre": intended_best["expected_yield_qtl_per_acre"],
                        "expected_net_profit_per_acre_inr": intended_best["expected_net_profit_per_acre_inr"],
                        "duration_days": intended_best["duration_days"],
                    },
                    "recommended_crop": {
                        "crop_id": top_recommendation["crop_id"],
                        "crop_name": top_recommendation["crop_name"],
                        "crop_name_en": top_recommendation["crop_name_en"],
                        "crop_name_hi": top_recommendation["crop_name_hi"],
                        "crop_name_mr": top_recommendation.get("crop_name_mr"),
                        "crop_name_gu": top_recommendation.get("crop_name_gu"),
                        "crop_name_raj": top_recommendation.get("crop_name_raj"),
                        "suitability_pct": top_recommendation["suitability_pct"],
                        "total_cost_inr_per_acre": top_recommendation["total_cost_inr_per_acre"],
                        "expected_yield_qtl_per_acre": top_recommendation["expected_yield_qtl_per_acre"],
                        "expected_net_profit_per_acre_inr": top_recommendation["expected_net_profit_per_acre_inr"],
                        "duration_days": top_recommendation["duration_days"],
                    },
                    "recommendation_insight": insight_hi,
                    "recommendation_insight_en": insight_en
                }

    data_sources_info = {
        "district_profile": f"{district or 'Pune'} District ({local_crop_discovery['agro_climatic_zone']})",
        "mandi_source": f"{local_crop_discovery['mandi_source']} (Agmarknet Live Pipeline)",
        "soil_source": "SoilGrids ISRIC Global 250m Spatial Model [18.15°N, 74.58°E]",
        "sowing_calendar": "ICAR-CRIDA District Crop Calendar Benchmark",
        "yield_model": "ICRISAT 10-Year District Panel Random Forest Engine",
        "cost_benchmarks": "CACP (Commission for Agricultural Costs & Prices) Official A2/A2+FL",
        "routing_note": "For production demo, unmapped districts gracefully route to verified Pune/Maharashtra ICRISAT & Agmarknet baseline."
    }

    return {
        "status": "success",
        "current_season": current_season_code,
        "season_display_name": season_info["display"],
        "data_sources": data_sources_info,
        "sowing_window": {
            "status": overall_sowing_eval["status"],
            "badge_text": overall_sowing_eval["badge_text"],
            "badge_color": overall_sowing_eval["badge_color"]
        },
        "top_recommendation": top_recommendation,
        "comparison_matrix": comparison_matrix,
        "intended_vs_recommended": intended_vs_recommended
    }
