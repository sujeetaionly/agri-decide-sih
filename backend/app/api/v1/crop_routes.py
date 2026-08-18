from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.farmer import Farmer, Farm
from backend.app.models.crop import Crop, RecommendationLog
from backend.app.schemas.crop_schema import (
    RecommendCropRequest,
    RecommendCropResponse,
    WhatIfSimulateRequest,
    WhatIfSimulateResponse,
    SimulationResultDetails,
    CropCalendarResponse,
    MilestoneItem,
    CropSearchItem
)
from backend.app.services.recommendation_service import (
    recommend_crops_engine,
    CROP_NAMES
)

router = APIRouter(tags=["Crops & Recommendations"])

# Comprehensive crop milestone stages database
CROP_MILESTONES_DB = {
    "BAJRA": [
        {"day_offset": 0, "title": "Sowing & Seed Treatment", "action_hi": "बीज उपचार (थायराम 3g/kg) व बुवाई"},
        {"day_offset": 20, "title": "First Thinning & Weeding", "action_hi": "पहली निराई-गुड़ाई व पौधों की छंटाई"},
        {"day_offset": 45, "title": "Earing / Flowering Stage", "action_hi": "सिट्टे बनने की अवस्था - सिंचाई व यूरिया टॉप ड्रेसिंग"},
        {"day_offset": 85, "title": "Harvest Stage", "action_hi": "फसल कटाई व गहाई का समय"}
    ],
    "SOYBEAN": [
        {"day_offset": 0, "title": "Sowing & Rhizobium Inoculation", "action_hi": "राइजोबियम व पीएसबी कल्चर से बीज उपचार व बुवाई"},
        {"day_offset": 21, "title": "First Weeding & Hoeing", "action_hi": "पहली निराई-गुड़ाई व खरपतवार नियंत्रण"},
        {"day_offset": 45, "title": "Flowering & Pod Initiation", "action_hi": "फूल आने व फलियां बनने की अवस्था - जल प्रबंधन"},
        {"day_offset": 75, "title": "Pod Filling Stage", "action_hi": "दाना भराव अवस्था - कीटनाशक निगरानी"},
        {"day_offset": 95, "title": "Maturity & Harvesting", "action_hi": "फसल परिपक्वता व कटाई"}
    ],
    "MOONG": [
        {"day_offset": 0, "title": "Seed Treatment & Sowing", "action_hi": "ट्राइकोडर्मा से बीज उपचार व कतारों में बुवाई"},
        {"day_offset": 18, "title": "First Weeding & Thinning", "action_hi": "पहली निराई व खरपतवार नियंत्रण"},
        {"day_offset": 40, "title": "Pod Formation Stage", "action_hi": "फलियां बनने की अवस्था - हल्की सिंचाई"},
        {"day_offset": 70, "title": "Pod Picking / Harvesting", "action_hi": "फलियों की तुड़ाई व कटाई"}
    ],
    "MAIZE": [
        {"day_offset": 0, "title": "Sowing & Basal Fertilizer", "action_hi": "एनपीके खाद के साथ बुवाई"},
        {"day_offset": 25, "title": "Knee-High Stage Top Dressing", "action_hi": "घुटने तक ऊंचाई पर यूरिया खाद व मिट्टी चढ़ाना"},
        {"day_offset": 55, "title": "Tasseling & Silking Stage", "action_hi": "नर व मादा फूल आने की संवेदनशील अवस्था - सिंचाई"},
        {"day_offset": 85, "title": "Grain Filling Stage", "action_hi": "दाना भराव अवस्था"},
        {"day_offset": 105, "title": "Harvesting & Cob Shelling", "action_hi": "भुट्टों की तुड़ाई व कटाई"}
    ],
    "TUR": [
        {"day_offset": 0, "title": "Sowing & Line Sowing", "action_hi": "चौड़ी क्यारियों में बुवाई व बीज उपचार"},
        {"day_offset": 30, "title": "First Weeding & Nipping", "action_hi": "निराई-गुड़ाई व शाखाओं के फैलाव हेतु अग्र भाग काटना"},
        {"day_offset": 75, "title": "Branching & Vegetative Care", "action_hi": "शाखा वृद्धि प्रबंधन"},
        {"day_offset": 120, "title": "Flowering & Pod Borer Watch", "action_hi": "फूल आने पर फली छेदक कीट नियंत्रण"},
        {"day_offset": 180, "title": "Maturity & Harvesting", "action_hi": "फसल कटाई व गहाई"}
    ],
    "COTTON": [
        {"day_offset": 0, "title": "Sowing & Furrow Irrigation", "action_hi": "मेड़ों पर बुवाई व प्रारंभिक नमी प्रबंधन"},
        {"day_offset": 30, "title": "Thinning & Inter-cultivation", "action_hi": "छंटाई व कोल्पा चलाना"},
        {"day_offset": 60, "title": "Square Formation & Pink Bollworm", "action_hi": "गुलाबी सुंडी निगरानी व फेरोमोन ट्रैप लगाना"},
        {"day_offset": 110, "title": "First Boll Bursting & Picking", "action_hi": "पहला कपास चुनाई"},
        {"day_offset": 160, "title": "Final Picking & Field Clean", "action_hi": "अंतिम चुनाई व डंठल कटाई"}
    ],
    "GROUNDNUT": [
        {"day_offset": 0, "title": "Sowing & Gypsum Basal Dose", "action_hi": "जिप्सम व बीज उपचार के साथ बुवाई"},
        {"day_offset": 25, "title": "Weeding & Light Earthing", "action_hi": "खरपतवार नियंत्रण व मिट्टी चढ़ाना"},
        {"day_offset": 50, "title": "Pegging Stage (Critical)", "action_hi": "सुइयां (Pegs) जमीन में जाने की अवस्था - सिंचाई"},
        {"day_offset": 90, "title": "Pod Maturation", "action_hi": "फलियां पकने की जांच"},
        {"day_offset": 120, "title": "Harvesting & Pod Stripping", "action_hi": "पौधे उखाड़ना व फलियां अलग करना"}
    ]
}

@router.post("/crop/recommend", response_model=RecommendCropResponse)
def recommend_crops(payload: RecommendCropRequest, db: Session = Depends(get_db)):
    """
    Endpoint 3: Run AI Crop Recommendation & 4-Crop Comparison Matrix.
    """
    # If farmer_id is provided, retrieve farmer profile from DB
    soil = payload.soil_type or "BLACK"
    water_source = payload.water_source or "WELL"
    water_capacity = payload.water_capacity_level or "MEDIUM"
    capital = payload.working_capital_inr or 80000.0
    previous_crop = payload.previous_season_crop or "WHEAT"
    owns_tractor = payload.owns_tractor or False
    owns_sprayer = payload.owns_sprayer or False

    if payload.farmer_id:
        farmer = db.query(Farmer).filter(Farmer.farmer_id == payload.farmer_id).first()
        if farmer and farmer.farms:
            farm = farmer.farms[0]
            soil = farm.soil_type
            water_source = farm.water_source
            water_capacity = farm.water_capacity_level
            capital = farm.working_capital_inr
            previous_crop = farm.previous_season_crop
            owns_tractor = farm.owns_tractor
            owns_sprayer = farm.owns_sprayer

    result = recommend_crops_engine(
        soil_type=soil,
        water_source=water_source,
        water_capacity_level=water_capacity,
        working_capital_inr=capital,
        previous_season_crop=previous_crop,
        owns_tractor=owns_tractor,
        owns_sprayer=owns_sprayer,
        planned_sowing_date=payload.planned_sowing_date,
        candidate_crops=payload.candidate_crops,
        db=db
    )

    # Log recommendation
    try:
        rec_log = RecommendationLog(
            farmer_id=payload.farmer_id,
            planned_sowing_date=payload.planned_sowing_date,
            top_recommended_crop=result["top_recommendation"]["crop_id"],
            expected_profit_per_acre=result["top_recommendation"]["expected_net_profit_per_acre_inr"]
        )
        db.add(rec_log)
        db.commit()
    except Exception:
        db.rollback()

    return RecommendCropResponse(
        status="success",
        sowing_window=result["sowing_window"],
        top_recommendation=result["top_recommendation"],
        comparison_matrix=result["comparison_matrix"]
    )

@router.post("/crop/what-if-simulate", response_model=WhatIfSimulateResponse)
def what_if_simulate(payload: WhatIfSimulateRequest, db: Session = Depends(get_db)):
    """
    Endpoint 4: Real-Time What-If Sensitivity Simulator for Evaluators & Farmers.
    Simulates sowing delay, rainfall deficit, and mandi wholesale price shocks.
    """
    soil = payload.soil_type or "BLACK"
    water_capacity = payload.water_capacity_level or "MEDIUM"
    capital = payload.working_capital_inr or 80000.0

    if payload.farmer_id:
        farmer = db.query(Farmer).filter(Farmer.farmer_id == payload.farmer_id).first()
        if farmer and farmer.farms:
            farm = farmer.farms[0]
            soil = farm.soil_type
            water_capacity = farm.water_capacity_level
            capital = farm.working_capital_inr

    # Re-run recommendation engine with shock parameters
    sim_result = recommend_crops_engine(
        soil_type=soil,
        water_capacity_level=water_capacity,
        working_capital_inr=capital,
        sowing_delay_override=payload.sowing_delay_days,
        rainfall_deficit_pct=payload.rainfall_deficit_pct,
        price_shock_pct=payload.mandi_price_shock_pct,
        candidate_crops=payload.candidate_crops,
        db=db
    )

    top_crop = sim_result["top_recommendation"]
    top_id = top_crop["crop_id"]

    # Dynamic localized alert message
    delay_msg = f"{payload.sowing_delay_days} दिन की देरी" if payload.sowing_delay_days > 0 else "सामान्य बुवाई"
    rain_msg = f"{abs(int(payload.rainfall_deficit_pct))}% कम बारिश" if payload.rainfall_deficit_pct < 0 else "सामान्य वर्षा"
    
    alert_msg = f"{delay_msg} और {rain_msg} में {top_crop['crop_name_hi'].split(' (')[0]} सबसे सुरक्षित और लाभदायी फसल है।"

    resilience = "उच्च प्रतिरोधक क्षमता (High Resilience)" if top_id in ["MOONG", "BAJRA", "TUR", "JOWAR"] else "मध्यम संवेदनशीलता (Moderate Sensitivity)"

    return WhatIfSimulateResponse(
        status="success",
        simulation_results=SimulationResultDetails(
            alert_message=alert_msg,
            updated_top_crop=top_id,
            updated_profit_inr_per_acre=top_crop["expected_net_profit_per_acre_inr"],
            resilience_rating=resilience,
            simulation_matrix=sim_result["comparison_matrix"]
        )
    )

@router.get("/crop/crop-calendar", response_model=CropCalendarResponse)
def get_crop_calendar(
    crop_id: str = Query("BAJRA", description="Crop Identifier e.g. BAJRA, SOYBEAN, MAIZE"),
    sowing_date: str = Query("2027-06-25", description="Planned sowing date (YYYY-MM-DD)")
):
    """
    Endpoint 5: Fetch 120-Day Action Milestone Timeline.
    """
    crop_key = crop_id.upper().strip()
    raw_milestones = CROP_MILESTONES_DB.get(crop_key, CROP_MILESTONES_DB["SOYBEAN"])
    crop_info = CROP_NAMES.get(crop_key, {"en": crop_key})

    try:
        base_dt = datetime.strptime(sowing_date, "%Y-%m-%d")
    except Exception:
        base_dt = datetime(2027, 6, 25)

    milestones_output = []
    for item in raw_milestones:
        m_date = base_dt + timedelta(days=item["day_offset"])
        milestones_output.append(MilestoneItem(
            day_offset=item["day_offset"],
            date=m_date.strftime("%Y-%m-%d"),
            title=item["title"],
            action_hi=item["action_hi"]
        ))

    return CropCalendarResponse(
        status="success",
        crop_name=crop_info["en"].split(" (")[0],
        sowing_date=sowing_date,
        milestones=milestones_output
    )

@router.get("/crop/search", response_model=List[CropSearchItem])
def search_crops(q: Optional[str] = Query(None, description="Search term for crop")):
    """
    Auxiliary: Search and filter regional candidate crops for Screen 3 dropdown / search bar.
    """
    results = []
    query_str = (q or "").lower().strip()

    for crop_id, info in CROP_NAMES.items():
        name_en = info["en"]
        name_hi = info["hi"]
        name_mr = info["hi"]  # Marathi/Hindi representation
        
        if not query_str or query_str in name_en.lower() or query_str in name_hi.lower() or query_str in crop_id.lower():
            results.append(CropSearchItem(
                crop_id=crop_id,
                crop_name_en=name_en,
                crop_name_hi=name_hi,
                crop_name_mr=name_mr,
                category=info["category"],
                duration_days=info["duration"]
            ))

    return results

@router.get("/geo/locations")
def get_geo_locations():
    """
    Auxiliary: Returns state, district, and taluka hierarchy for Screen 1 dropdowns.
    """
    return {
        "status": "success",
        "states": [
            {
                "state_name": "Maharashtra",
                "districts": [
                    {"name": "Pune", "talukas": ["Baramati", "Haveli", "Shirur", "Indapur", "Daund"]},
                    {"name": "Nashik", "talukas": ["Niphad", "Dindori", "Sinnar", "Yeola", "Malegaon"]},
                    {"name": "Jalgaon", "talukas": ["Raver", "Chopda", "Yawal", "Bhusawal", "Jamner"]}
                ]
            },
            {
                "state_name": "Rajasthan",
                "districts": [
                    {"name": "Jaipur", "talukas": ["Sanganer", "Chaksu", "Basssi", "Amber", "Kotputli"]},
                    {"name": "Jodhpur", "talukas": ["Osian", "Bilara", "Phalodi", "Luni", "Bhopalgarh"]},
                    {"name": "Kota", "talukas": ["Ladpura", "Digod", "Sangod", "Ramganj Mandi"]}
                ]
            }
        ]
    }
