import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.farmer import Farmer, Farm
from backend.app.schemas.farmer_schema import (
    AssessSoilWeatherRequest,
    AssessSoilWeatherResponse,
    AssessSoilWeatherData,
    SoilSummary,
    ClimateSummary,
    FarmerProfileCreate,
    FarmerProfileResponse
)

router = APIRouter(tags=["Farm & Farmer"])

# District Soil and Climate Benchmarks (e.g. Pune/Baramati, Jaipur/Sanganer, Nashik, Malwa)
DISTRICT_AGRO_PROFILES = {
    "PUNE": {
        "taluka": "Baramati",
        "soil": {"texture_class": "Medium Black / मध्यम काली मिट्टी", "ph": 7.4, "organic_carbon_pct": 0.58},
        "climate": {"annual_rainfall_mm": 560.0, "current_season": "Kharif 2027", "optimal_sowing_window": "15 June - 05 July"}
    },
    "JAIPUR": {
        "taluka": "Sanganer",
        "soil": {"texture_class": "Sandy Loam / बलुई दोमट", "ph": 7.8, "organic_carbon_pct": 0.42},
        "climate": {"annual_rainfall_mm": 520.0, "current_season": "Kharif 2027", "optimal_sowing_window": "25 June - 10 July"}
    },
    "NASHIK": {
        "taluka": "Niphad",
        "soil": {"texture_class": "Deep Black Clay / गहरी काली मिट्टी", "ph": 7.6, "organic_carbon_pct": 0.65},
        "climate": {"annual_rainfall_mm": 680.0, "current_season": "Kharif 2027", "optimal_sowing_window": "10 June - 30 June"}
    },
    "JALGAON": {
        "taluka": "Raver",
        "soil": {"texture_class": "Heavy Black / काली दोमट", "ph": 7.9, "organic_carbon_pct": 0.52},
        "climate": {"annual_rainfall_mm": 710.0, "current_season": "Kharif 2027", "optimal_sowing_window": "15 June - 05 July"}
    }
}

@router.post("/farm/assess-soil-weather", response_model=AssessSoilWeatherResponse)
def assess_soil_weather(payload: AssessSoilWeatherRequest):
    """
    Endpoint 1: Geo-Agronomic baseline soil and climate assessment by coordinates or district/taluka.
    """
    dist_key = (payload.district or "Pune").upper().strip()
    profile = DISTRICT_AGRO_PROFILES.get(dist_key, DISTRICT_AGRO_PROFILES["PUNE"])

    taluka_name = payload.taluka or profile["taluka"]

    return AssessSoilWeatherResponse(
        status="success",
        data=AssessSoilWeatherData(
            district=payload.district or "Pune",
            taluka=taluka_name,
            soil_summary=SoilSummary(
                texture_class=profile["soil"]["texture_class"],
                ph=profile["soil"]["ph"],
                organic_carbon_pct=profile["soil"]["organic_carbon_pct"]
            ),
            climate_summary=ClimateSummary(
                annual_rainfall_mm=profile["climate"]["annual_rainfall_mm"],
                current_season=profile["climate"]["current_season"],
                optimal_sowing_window=profile["climate"]["optimal_sowing_window"]
            )
        )
    )

@router.post("/farmer/profile", response_model=FarmerProfileResponse, status_code=status.HTTP_201_CREATED)
def create_farmer_profile(profile: FarmerProfileCreate, db: Session = Depends(get_db)):
    """
    Endpoint 2: Register farmer and farm characteristics.
    """
    # Generate unique ID e.g., FARMER-8401 or FARMER-XXXX
    short_uuid = uuid.uuid4().hex[:4].upper()
    farmer_id = f"FARMER-{short_uuid}"

    db_farmer = Farmer(
        farmer_id=farmer_id,
        name=profile.farmer_name,
        mobile=profile.mobile,
        language_preference=profile.language_preference,
        state=profile.state,
        district=profile.district,
        taluka=profile.taluka
    )
    db.add(db_farmer)
    db.flush()

    db_farm = Farm(
        farmer_id=farmer_id,
        total_area_acres=profile.total_land_acres,
        soil_type=profile.soil_type.upper(),
        water_source=profile.water_source.upper(),
        water_capacity_level=profile.water_capacity_level.upper(),
        working_capital_inr=profile.working_capital_inr,
        previous_season_crop=profile.previous_season_crop,
        owns_tractor=profile.owns_tractor,
        owns_sprayer=profile.owns_sprayer
    )
    db.add(db_farm)
    db.commit()

    return FarmerProfileResponse(
        status="success",
        farmer_id=farmer_id,
        message="Farm profile created successfully."
    )
