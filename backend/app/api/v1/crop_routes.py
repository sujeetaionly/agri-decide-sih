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
    CropSearchItem,
    SaveAnalysisRequest,
    AnalysisHistoryItem,
    AnalysisHistoryResponse,
    LocalCropsResponse
)
from backend.app.services.recommendation_service import (
    recommend_crops_engine,
    CROP_NAMES
)
from backend.app.services.local_crop_service import get_local_crops_for_district

router = APIRouter(tags=["Crops & Recommendations"])

# Comprehensive crop milestone stages database (in Pure Indic text)
CROP_MILESTONES_DB = {
    "BAJRA": [
        {"day_offset": 0, "title": "बुवाई एवं बीज उपचार", "action_hi": "बीज उपचार (थायराम 3g/kg) व बुवाई", "action_mr": "बीज प्रक्रिया (थायरम ३ ग्रॅम/किलो) व पेरणी"},
        {"day_offset": 20, "title": "पहली निराई-गुड़ाई व छंटाई", "action_hi": "पहली निराई-गुड़ाई व पौधों की छंटाई", "action_mr": "पहिली खुरपणी आणि रोपांची विरळणी"},
        {"day_offset": 45, "title": "सिट्टे बनने की अवस्था", "action_hi": "सिट्टे बनने की अवस्था - हल्की सिंचाई व यूरिया टॉप ड्रेसिंग", "action_mr": "कणीस भरण्याची अवस्था - खत व्यवस्थापन"},
        {"day_offset": 85, "title": "फसल कटाई व गहाई", "action_hi": "फसल कटाई व सुरक्षित गहाई", "action_mr": "पिकाची कापणी आणि मळणी"}
    ],
    "SOYBEAN": [
        {"day_offset": 0, "title": "बीज उपचार एवं बुवाई", "action_hi": "राइजोबियम व पीएसबी कल्चर से बीज उपचार व बुवाई", "action_mr": "रायझोबियम आणि पीएसबी कल्चरने बीजप्रक्रिया व पेरणी"},
        {"day_offset": 21, "title": "पहली निराई एवं खरपतवार नियंत्रण", "action_hi": "पहली निराई-गुड़ाई व खरपतवार नियंत्रण", "action_mr": "पहिली कोळपणी व खुरपणी"},
        {"day_offset": 45, "title": "फूल आने एवं फलियां बनने की अवस्था", "action_hi": "फूल आने व फलियां बनने की अवस्था - जल प्रबंधन", "action_mr": "फुलोरा आणि शेंगा लागण्याची संवेदनशील अवस्था"},
        {"day_offset": 75, "title": "दाना भराव अवस्था", "action_hi": "दाना भराव अवस्था - कीटनाशक निगरानी", "action_mr": "दाणे भरण्याची अवस्था - कीड नियंत्रण"},
        {"day_offset": 95, "title": "परिपक्वता एवं फसल कटाई", "action_hi": "फसल परिपक्वता व कटाई", "action_mr": "शेंगा पक्व झाल्यावर कापणी"}
    ],
    "MOONG": [
        {"day_offset": 0, "title": "बीज उपचार एवं बुवाई", "action_hi": "ट्राइकोडर्मा से बीज उपचार व कतारों में बुवाई", "action_mr": "ट्रायकोडर्माने बीजप्रक्रिया व पेरणी"},
        {"day_offset": 18, "title": "निराई-गुड़ाई एवं छंटाई", "action_hi": "पहली निराई व खरपतवार नियंत्रण", "action_mr": "पहिली खुरपणी"},
        {"day_offset": 40, "title": "फलियां बनने की अवस्था", "action_hi": "फलियां बनने की अवस्था - हल्की सिंचाई", "action_mr": "शेंगा लागण्याची अवस्था"},
        {"day_offset": 70, "title": "फलियों की तुड़ाई व कटाई", "action_hi": "फलियों की तुड़ाई व कटाई", "action_mr": "शेंगांची तोडणी व कापणी"}
    ],
    "MAIZE": [
        {"day_offset": 0, "title": "बुवाई एवं प्रारंभिक खाद", "action_hi": "एनपीके खाद के साथ कतारों में बुवाई", "action_mr": "खत व्यवस्थापनासह पेरणी"},
        {"day_offset": 25, "title": "घुटने तक ऊंचाई पर टॉप ड्रेसिंग", "action_hi": "घुटने तक ऊंचाई पर यूरिया खाद व मिट्टी चढ़ाना", "action_mr": "युरिया खत व मातीची भर"},
        {"day_offset": 55, "title": "नर व मादा फूल आने की अवस्था", "action_hi": "नर व मादा फूल आने की संवेदनशील अवस्था - सिंचाई", "action_mr": "तुरा आणि कणसे बाहेर पडण्याची अवस्था"},
        {"day_offset": 85, "title": "दाना भराव अवस्था", "action_hi": "दाना भराव अवस्था - कीट निगरानी", "action_mr": "दाणे भरण्याची अवस्था"},
        {"day_offset": 105, "title": "भुट्टों की तुड़ाई व कटाई", "action_hi": "भुट्टों की तुड़ाई व कटाई", "action_mr": "कणसांची तोडणी व कापणी"}
    ],
    "TUR": [
        {"day_offset": 0, "title": "बुवाई एवं कतार दूरी", "action_hi": "चौड़ी क्यारियों में बुवाई व बीज उपचार", "action_mr": "बीजप्रक्रिया व पट्टा पद्धतीने पेरणी"},
        {"day_offset": 30, "title": "निराई एवं अग्र भाग काटना (Nipping)", "action_hi": "निराई-गुड़ाई व शाखाओं के फैलाव हेतु अग्र भाग काटना", "action_mr": "खुरपणी व फांद्या वाढण्यासाठी शेंडा खुडणे"},
        {"day_offset": 75, "title": "शाखा वृद्धि प्रबंधन", "action_hi": "शाखा वृद्धि प्रबंधन व कीट रोकथाम", "action_mr": "वाढ व्यवस्थापन"},
        {"day_offset": 120, "title": "फूल आने पर फली छेदक कीट नियंत्रण", "action_hi": "फूल आने पर फली छेदक कीट नियंत्रण", "action_mr": "घाटे अळी नियंत्रण"},
        {"day_offset": 180, "title": "फसल कटाई व गहाई", "action_hi": "फसल कटाई व गहाई", "action_mr": "कापणी आणि मळणी"}
    ],
    "COTTON": [
        {"day_offset": 0, "title": "मेड़ों पर बुवाई एवं प्रारंभिक नमी", "action_hi": "मेड़ों पर बुवाई व प्रारंभिक नमी प्रबंधन", "action_mr": "वरंब्यावर लागवड व पाणी व्यवस्थापन"},
        {"day_offset": 30, "title": "छंटाई एवं कोल्पा चलाना", "action_hi": "छंटाई व कोल्पा चलाना", "action_mr": "विरळणी व कोळपणी"},
        {"day_offset": 60, "title": "फूल बनने की अवस्था व गुलाबी सुंडी निगरानी", "action_hi": "गुलाबी सुंडी निगरानी व फेरोमोन ट्रैप लगाना", "action_mr": "गुलाबी बोंडअळीसाठी कामगंध सापळे लावणे"},
        {"day_offset": 110, "title": "पहला कपास चुनाई", "action_hi": "पहला कपास चुनाई", "action_mr": "पहिली वेचणी"},
        {"day_offset": 160, "title": "अंतिम चुनाई व डंठल कटाई", "action_hi": "अंतिम चुनाई व डंठल कटाई", "action_mr": "शेवटची वेचणी"}
    ],
    "GROUNDNUT": [
        {"day_offset": 0, "title": "जिप्सम व बीज उपचार के साथ बुवाई", "action_hi": "जिप्सम व बीज उपचार के साथ बुवाई", "action_mr": "जिप्सम व बीजप्रक्रियेसह पेरणी"},
        {"day_offset": 25, "title": "खरपतवार नियंत्रण व मिट्टी चढ़ाना", "action_hi": "खरपतवार नियंत्रण व मिट्टी चढ़ाना", "action_mr": "खुरपणी व भर लावणे"},
        {"day_offset": 50, "title": "सुइयां जमीन में जाने की अवस्था (Pegging)", "action_hi": "सुइयां जमीन में जाने की अवस्था - सिंचाई", "action_mr": "आऱ्या जमिनीत शिरण्याची अवस्था - पाणी व्यवस्थापन"},
        {"day_offset": 90, "title": "फलियां पकने की जांच", "action_hi": "फलियां पकने की जांच", "action_mr": "शेंगा पक्वतेची तपासणी"},
        {"day_offset": 120, "title": "पौधे उखाड़ना व फलियां अलग करना", "action_hi": "पौधे उखाड़ना व फलियां अलग करना", "action_mr": "उपटणी आणि शेंगा तोडणी"}
    ]
}

@router.get("/crop/local-crops", response_model=LocalCropsResponse)
def get_local_crops_endpoint(
    district: str = Query("Pune", description="District name"),
    state: str = Query("Maharashtra", description="State name"),
    season: str = Query("KHARIF", description="Agricultural season (KHARIF, RABI, ZAID)"),
    lang: str = Query("hi", description="ISO language code (hi, mr, gu, raj, en, pa, kn, te, ta, bn)")
):
    """
    Endpoint: Discovers authentic local crops grown & traded in the specified District & Mandi.
    """
    return get_local_crops_for_district(
        district=district,
        state=state,
        season=season,
        lang=lang
    )

@router.post("/crop/recommend", response_model=RecommendCropResponse)
def recommend_crops(payload: RecommendCropRequest, db: Session = Depends(get_db)):
    """
    Endpoint: Run AI Crop Recommendation & Comparison Matrix with Itemized CACP Costs and Local Mandi crops.
    """
    soil = payload.soil_type or "BLACK"
    water_source = payload.water_source or "WELL"
    water_capacity = payload.water_capacity_level or "MEDIUM"
    capital = payload.working_capital_inr or 80000.0
    previous_crop = payload.previous_season_crop or "WHEAT"
    owns_tractor = payload.owns_tractor or False
    owns_sprayer = payload.owns_sprayer or False
    district = payload.district or "Pune"
    state = payload.state or "Maharashtra"
    lang = payload.lang or "hi"

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
            if farmer.district:
                district = farmer.district
            if farmer.state:
                state = farmer.state

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
        district=district,
        state=state,
        lang=lang,
        db=db
    )

    top_crop = result["top_recommendation"]

    # Log recommendation into database
    try:
        rec_log = RecommendationLog(
            farmer_id=payload.farmer_id,
            planned_sowing_date=payload.planned_sowing_date,
            top_recommended_crop=top_crop["crop_id"],
            total_land_acres=payload.total_land_acres or 1.0,
            soil_type=soil,
            water_source=water_source,
            expected_yield_qtl_per_acre=top_crop["expected_yield_qtl_per_acre"],
            total_cost_per_acre=top_crop["total_cost_inr_per_acre"],
            expected_profit_per_acre=top_crop["expected_net_profit_per_acre_inr"],
            match_score=top_crop["suitability_pct"]
        )
        db.add(rec_log)
        db.commit()
    except Exception as e:
        db.rollback()

    return RecommendCropResponse(
        status="success",
        current_season=result.get("current_season", "KHARIF"),
        season_display_name=result.get("season_display_name", "खरीफ मौसम 2026-27"),
        data_sources=result.get("data_sources"),
        sowing_window=result["sowing_window"],
        top_recommendation=top_crop,
        comparison_matrix=result["comparison_matrix"]
    )

@router.post("/crop/what-if-simulate", response_model=WhatIfSimulateResponse)
def what_if_simulate(payload: WhatIfSimulateRequest, db: Session = Depends(get_db)):
    """
    Endpoint: Real-Time What-If Sensitivity Simulator.
    """
    soil = payload.soil_type or "BLACK"
    water_capacity = payload.water_capacity_level or "MEDIUM"
    capital = payload.working_capital_inr or 80000.0
    district = payload.district or "Pune"
    state = payload.state or "Maharashtra"
    lang = payload.lang or "hi"

    if payload.farmer_id:
        farmer = db.query(Farmer).filter(Farmer.farmer_id == payload.farmer_id).first()
        if farmer and farmer.farms:
            farm = farmer.farms[0]
            soil = farm.soil_type
            water_capacity = farm.water_capacity_level
            capital = farm.working_capital_inr
            if farmer.district:
                district = farmer.district
            if farmer.state:
                state = farmer.state

    sim_result = recommend_crops_engine(
        soil_type=soil,
        water_capacity_level=water_capacity,
        working_capital_inr=capital,
        sowing_delay_override=payload.sowing_delay_days,
        rainfall_deficit_pct=payload.rainfall_deficit_pct,
        price_shock_pct=payload.mandi_price_shock_pct,
        candidate_crops=payload.candidate_crops,
        district=district,
        state=state,
        lang=lang,
        db=db
    )

    top_crop = sim_result["top_recommendation"]
    top_id = top_crop["crop_id"]

    delay_msg = f"{payload.sowing_delay_days} दिन की देरी" if payload.sowing_delay_days > 0 else "सामान्य बुवाई"
    rain_msg = f"{abs(int(payload.rainfall_deficit_pct))}% कम बारिश" if payload.rainfall_deficit_pct < 0 else "सामान्य वर्षा"
    
    alert_msg = f"{delay_msg} और {rain_msg} में {top_crop['crop_name']} सबसे सुरक्षित और लाभदायी फसल है।"
    resilience = "उच्च प्रतिरोधक क्षमता" if top_id in ["MOONG", "BAJRA", "TUR", "JOWAR"] else "मध्यम संवेदनशीलता"

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
    crop_id: str = Query("BAJRA", description="Crop Identifier"),
    sowing_date: str = Query("2027-06-25", description="Planned sowing date (YYYY-MM-DD)")
):
    """
    Endpoint: Fetch 120-Day Action Milestone Timeline.
    """
    crop_key = crop_id.upper().strip()
    raw_milestones = CROP_MILESTONES_DB.get(crop_key, CROP_MILESTONES_DB.get("SOYBEAN", []))
    crop_info = CROP_NAMES.get(crop_key, {"en": crop_key, "hi": crop_key})

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
            action_hi=item["action_hi"],
            action_mr=item.get("action_mr", item["action_hi"])
        ))

    return CropCalendarResponse(
        status="success",
        crop_name=crop_info["hi"],
        sowing_date=sowing_date,
        milestones=milestones_output
    )

@router.get("/crop/search", response_model=List[CropSearchItem])
def search_crops(q: Optional[str] = Query(None, description="Search term for crop")):
    results = []
    query_str = (q or "").lower().strip()

    for crop_id, info in CROP_NAMES.items():
        name_en = info["en"]
        name_hi = info["hi"]
        name_mr = info.get("mr", info["hi"])
        
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

# --- Farmer History & Saved Analyses Endpoints for "मेरी फसलें" ---

@router.get("/farmer/history", response_model=AnalysisHistoryResponse)
@router.get("/farmer/{farmer_id}/history", response_model=AnalysisHistoryResponse)
def get_farmer_history(farmer_id: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Endpoint: Returns previous analysis logs for the farmer to display in "मेरी फसलें".
    """
    query = db.query(RecommendationLog)
    if farmer_id:
        query = query.filter(RecommendationLog.farmer_id == farmer_id)
    
    logs = query.order_by(RecommendationLog.created_at.desc()).limit(20).all()

    output_items = []
    for l in logs:
        c_info = CROP_NAMES.get(l.top_recommended_crop, {"hi": l.top_recommended_crop, "mr": l.top_recommended_crop})
        output_items.append(AnalysisHistoryItem(
            rec_id=l.rec_id,
            farmer_id=l.farmer_id,
            created_at=l.created_at.strftime("%Y-%m-%d %H:%M") if l.created_at else "2027-06-25",
            planned_sowing_date=l.planned_sowing_date or "2027-06-25",
            total_land_acres=l.total_land_acres or 1.0,
            soil_type=l.soil_type or "BLACK",
            water_source=l.water_source or "WELL",
            top_recommended_crop=l.top_recommended_crop,
            crop_name_hi=c_info.get("hi", l.top_recommended_crop),
            crop_name_mr=c_info.get("mr", l.top_recommended_crop),
            expected_yield_qtl_per_acre=l.expected_yield_qtl_per_acre or 9.5,
            total_cost_per_acre=l.total_cost_per_acre or 19412.0,
            expected_profit_per_acre=l.expected_profit_per_acre,
            match_score=l.match_score or 90.0
        ))

    return AnalysisHistoryResponse(
        status="success",
        total_records=len(output_items),
        history=output_items
    )

@router.get("/farmer/recent-analysis", response_model=Optional[AnalysisHistoryItem])
def get_recent_analysis(farmer_id: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Endpoint: Returns the single latest analysis for the Home Screen summary card.
    """
    query = db.query(RecommendationLog)
    if farmer_id:
        query = query.filter(RecommendationLog.farmer_id == farmer_id)
    
    latest = query.order_by(RecommendationLog.created_at.desc()).first()
    if not latest:
        return None

    c_info = CROP_NAMES.get(latest.top_recommended_crop, {"hi": latest.top_recommended_crop, "mr": latest.top_recommended_crop})
    return AnalysisHistoryItem(
        rec_id=latest.rec_id,
        farmer_id=latest.farmer_id,
        created_at=latest.created_at.strftime("%Y-%m-%d %H:%M") if latest.created_at else "2027-06-25",
        planned_sowing_date=latest.planned_sowing_date or "2027-06-25",
        total_land_acres=latest.total_land_acres or 1.0,
        soil_type=latest.soil_type or "BLACK",
        water_source=latest.water_source or "WELL",
        top_recommended_crop=latest.top_recommended_crop,
        crop_name_hi=c_info.get("hi", latest.top_recommended_crop),
        crop_name_mr=c_info.get("mr", latest.top_recommended_crop),
        expected_yield_qtl_per_acre=latest.expected_yield_qtl_per_acre or 9.5,
        total_cost_per_acre=latest.total_cost_per_acre or 19412.0,
        expected_profit_per_acre=latest.expected_profit_per_acre,
        match_score=latest.match_score or 90.0
    )

@router.post("/farmer/save-analysis", status_code=201)
def save_analysis(payload: SaveAnalysisRequest, db: Session = Depends(get_db)):
    """
    Endpoint: Directly save/persist an analysis from frontend.
    """
    rec_log = RecommendationLog(
        farmer_id=payload.farmer_id,
        planned_sowing_date=payload.planned_sowing_date,
        top_recommended_crop=payload.top_recommended_crop.upper(),
        total_land_acres=payload.total_land_acres,
        soil_type=payload.soil_type.upper(),
        water_source=payload.water_source.upper(),
        expected_yield_qtl_per_acre=payload.expected_yield_qtl_per_acre,
        total_cost_per_acre=payload.total_cost_per_acre,
        expected_profit_per_acre=payload.expected_profit_per_acre,
        match_score=payload.match_score
    )
    db.add(rec_log)
    db.commit()
    db.refresh(rec_log)

    return {
        "status": "success",
        "rec_id": rec_log.rec_id,
        "message": "Analysis successfully saved to farmer history"
    }
