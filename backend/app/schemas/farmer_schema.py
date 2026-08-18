from pydantic import BaseModel, Field
from typing import Optional

class AssessSoilWeatherRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    district: Optional[str] = "Pune"
    taluka: Optional[str] = "Baramati"

class SoilSummary(BaseModel):
    texture_class: str
    ph: float
    organic_carbon_pct: float

class ClimateSummary(BaseModel):
    annual_rainfall_mm: float
    current_season: str
    optimal_sowing_window: str

class AssessSoilWeatherData(BaseModel):
    district: str
    taluka: str
    soil_summary: SoilSummary
    climate_summary: ClimateSummary

class AssessSoilWeatherResponse(BaseModel):
    status: str = "success"
    data: AssessSoilWeatherData

class FarmerProfileCreate(BaseModel):
    farmer_name: str
    mobile: str
    language_preference: str = "hi"
    state: str = "Maharashtra"
    district: str
    taluka: str
    total_land_acres: float
    soil_type: str = "BLACK"  # BLACK, LOAM, RED, SANDY
    water_source: str = "BOREWELL"  # BOREWELL, WELL, CANAL, RAINFED
    water_capacity_level: str = "MEDIUM"  # LOW, MEDIUM, HIGH
    working_capital_inr: float
    previous_season_crop: Optional[str] = None
    owns_tractor: bool = False
    owns_sprayer: bool = False

class FarmerProfileResponse(BaseModel):
    status: str = "success"
    farmer_id: str
    message: str = "Farm profile created successfully."
