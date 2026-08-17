from pydantic import BaseModel, Field
from typing import List, Optional

# --- Recommendation Schemas ---
class RecommendCropRequest(BaseModel):
    farmer_id: Optional[str] = None
    # If farmer_id not provided, can pass inline farm parameters
    total_land_acres: Optional[float] = 5.0
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
    suitability_pct: float
    duration_days: int
    expected_yield_qtl_per_acre: float
    yield_range_qtl: str
    total_cost_inr_per_acre: float
    forecasted_mandi_price_inr_per_qtl: float
    expected_net_profit_per_acre_inr: float
    net_profit_per_day_inr: float
    price_volatility: str
    why_recommended: List[str]

class ComparisonMatrixItem(BaseModel):
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    suitability_pct: float
    sowing_window_status: str
    total_cost_inr_per_acre: float
    expected_yield_qtl_per_acre: float
    forecasted_mandi_price_inr_per_qtl: float
    expected_net_profit_per_acre_inr: float
    duration_days: int
    net_profit_per_day_inr: float

class RecommendCropResponse(BaseModel):
    status: str = "success"
    sowing_window: SowingWindowBadge
    top_recommendation: TopRecommendation
    comparison_matrix: List[ComparisonMatrixItem]

# --- What-If Simulation Schemas ---
class WhatIfSimulateRequest(BaseModel):
    farmer_id: Optional[str] = None
    sowing_delay_days: int = 0
    rainfall_deficit_pct: float = 0.0
    mandi_price_shock_pct: float = 0.0
    # Inline farm overrides if farmer_id not found
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
