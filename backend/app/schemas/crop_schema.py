from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# --- CACP Itemized Cost Breakdown Schema ---
class CostBreakdownItem(BaseModel):
    seed_cost: float = Field(..., description="बीज लागत (Seed cost in INR/acre)")
    fertilizer_cost: float = Field(..., description="खाद व उर्वरक (Fertilizer cost in INR/acre)")
    pesticide_cost: float = Field(..., description="कीटनाशक (Pesticide cost in INR/acre)")
    machinery_rental_cost: float = Field(..., description="जुताई व मशीनरी (Machinery cost in INR/acre)")
    labour_cost: float = Field(..., description="मजदूरी (Human labor cost in INR/acre)")
    irrigation_electricity_cost: float = Field(..., description="सिंचाई व बिजली (Irrigation cost in INR/acre)")
    operational_cost_a2_inr_per_acre: float = Field(..., description="कुल कार्यशील लागत A2 (Total direct cost)")
    family_labor_cost_per_acre: float = Field(..., description="पारिवारिक श्रम लागत FL (Imputed family labor)")
    total_cost_a2_fl_inr_per_acre: float = Field(..., description="कुल उत्पादन लागत A2+FL (Total comprehensive cost)")

# --- Recommendation Schemas ---
class RecommendCropRequest(BaseModel):
    farmer_id: Optional[str] = None
    total_land_acres: Optional[float] = 1.0
    soil_type: Optional[str] = "BLACK"
    water_source: Optional[str] = "WELL"
    water_capacity_level: Optional[str] = "MEDIUM"
    working_capital_inr: Optional[float] = 80000.0
    previous_season_crop: Optional[str] = "WHEAT"
    owns_tractor: Optional[bool] = False
    owns_sprayer: Optional[bool] = False
    planned_sowing_date: str = "2027-06-25"
    candidate_crops: Optional[List[str]] = None

class SowingWindowBadge(BaseModel):
    status: str  # "OPTIMAL", "MODERATE", "LATE", "CLOSED"
    badge_text: str
    badge_color: str  # "green", "yellow", "red"

class TopRecommendation(BaseModel):
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    crop_name_mr: Optional[str] = None
    crop_name_gu: Optional[str] = None
    crop_name_raj: Optional[str] = None
    suitability_pct: float
    duration_days: int
    expected_yield_qtl_per_acre: float
    yield_range_qtl: str
    total_cost_inr_per_acre: float
    cost_breakdown: Optional[CostBreakdownItem] = None
    forecasted_mandi_price_inr_per_qtl: float
    expected_net_profit_per_acre_inr: float
    net_profit_per_day_inr: float
    price_volatility: str
    rotation_benefit: Optional[str] = None
    why_recommended: List[str]

class ComparisonMatrixItem(BaseModel):
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    crop_name_mr: Optional[str] = None
    crop_name_gu: Optional[str] = None
    crop_name_raj: Optional[str] = None
    suitability_pct: float
    sowing_window_status: str
    total_cost_inr_per_acre: float
    cost_breakdown: Optional[CostBreakdownItem] = None
    expected_yield_qtl_per_acre: float
    forecasted_mandi_price_inr_per_qtl: float
    expected_net_profit_per_acre_inr: float
    duration_days: int
    net_profit_per_day_inr: float
    rotation_benefit: Optional[str] = None

class RecommendCropResponse(BaseModel):
    status: str = "success"
    current_season: Optional[str] = "KHARIF"
    season_display_name: Optional[str] = "खरीफ मौसम 2026-27"
    data_sources: Optional[Dict[str, str]] = None
    sowing_window: SowingWindowBadge
    top_recommendation: TopRecommendation
    comparison_matrix: List[ComparisonMatrixItem]

# --- What-If Simulation Schemas ---
class WhatIfSimulateRequest(BaseModel):
    farmer_id: Optional[str] = None
    sowing_delay_days: int = 0
    rainfall_deficit_pct: float = 0.0
    mandi_price_shock_pct: float = 0.0
    soil_type: Optional[str] = "BLACK"
    water_capacity_level: Optional[str] = "MEDIUM"
    working_capital_inr: Optional[float] = 80000.0
    candidate_crops: Optional[List[str]] = None

class SimulationResultDetails(BaseModel):
    alert_message: str
    updated_top_crop: str
    updated_profit_inr_per_acre: float
    resilience_rating: str
    simulation_matrix: Optional[List[ComparisonMatrixItem]] = None

class WhatIfSimulateResponse(BaseModel):
    status: str = "success"
    simulation_results: SimulationResultDetails

# --- Crop Milestone Calendar Schemas ---
class MilestoneItem(BaseModel):
    day_offset: int
    date: str
    title: str
    action_hi: str
    action_mr: Optional[str] = None

class CropCalendarResponse(BaseModel):
    status: str = "success"
    crop_name: str
    sowing_date: str
    milestones: List[MilestoneItem]

# --- Catalog & Location Schemas ---
class CropSearchItem(BaseModel):
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    crop_name_mr: str
    category: str
    duration_days: int

# --- Historical Analysis & Farmer Storage Schemas ---
class SaveAnalysisRequest(BaseModel):
    farmer_id: Optional[str] = "GUEST"
    planned_sowing_date: str = "2027-06-25"
    total_land_acres: float = 1.0
    soil_type: str = "BLACK"
    water_source: str = "WELL"
    top_recommended_crop: str = "SOYBEAN"
    crop_name_hi: str = "सोयाबीन"
    crop_name_mr: Optional[str] = "सोयाबीन"
    expected_yield_qtl_per_acre: float = 9.5
    total_cost_per_acre: float = 19412.0
    expected_profit_per_acre: float = 24500.0
    match_score: float = 94.0

class AnalysisHistoryItem(BaseModel):
    rec_id: int
    farmer_id: Optional[str]
    created_at: str
    planned_sowing_date: str
    total_land_acres: float
    soil_type: str
    water_source: str
    top_recommended_crop: str
    crop_name_hi: str
    crop_name_mr: str
    expected_yield_qtl_per_acre: float
    total_cost_per_acre: float
    expected_profit_per_acre: float
    match_score: float

class AnalysisHistoryResponse(BaseModel):
    status: str = "success"
    total_records: int
    history: List[AnalysisHistoryItem]

class LanguageOptionItem(BaseModel):
    code: str
    name: str
    nativeName: str

class DetectLanguageResponse(BaseModel):
    status: str = "success"
    detected_state: str
    detected_district: str
    suggested_languages: List[LanguageOptionItem]
