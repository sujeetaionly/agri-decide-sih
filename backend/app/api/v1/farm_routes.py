import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
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
from backend.app.schemas.crop_schema import DetectLanguageResponse, LanguageOptionItem

router = APIRouter(tags=["Farm & Farmer"])

# District Soil and Climate Benchmarks
DISTRICT_AGRO_PROFILES = {
    "PUNE": {
        "taluka": "Baramati",
        "soil": {"texture_class": "मध्यम काली मिट्टी", "ph": 7.4, "organic_carbon_pct": 0.58},
        "climate": {"annual_rainfall_mm": 560.0, "current_season": "खरीफ 2027", "optimal_sowing_window": "15 जून - 05 जुलाई"}
    },
    "JAIPUR": {
        "taluka": "Sanganer",
        "soil": {"texture_class": "बलुई दोमट मिट्टी", "ph": 7.8, "organic_carbon_pct": 0.42},
        "climate": {"annual_rainfall_mm": 520.0, "current_season": "खरीफ 2027", "optimal_sowing_window": "25 जून - 10 जुलाई"}
    },
    "NASHIK": {
        "taluka": "Niphad",
        "soil": {"texture_class": "गहरी काली मिट्टी", "ph": 7.6, "organic_carbon_pct": 0.65},
        "climate": {"annual_rainfall_mm": 680.0, "current_season": "खरीफ 2027", "optimal_sowing_window": "10 जून - 30 जून"}
    },
    "JALGAON": {
        "taluka": "Raver",
        "soil": {"texture_class": "काली दोमट मिट्टी", "ph": 7.9, "organic_carbon_pct": 0.52},
        "climate": {"annual_rainfall_mm": 710.0, "current_season": "खरीफ 2027", "optimal_sowing_window": "15 जून - 05 जुलाई"}
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

@router.get("/geo/detect-language", response_model=DetectLanguageResponse)
def detect_language(
    lat: Optional[float] = Query(None, description="GPS Latitude"),
    lon: Optional[float] = Query(None, description="GPS Longitude")
):
    """
    Endpoint: Automatically detects state/district from GPS and suggests regional languages.
    """
    # Maharashtra coordinates roughly 15.6 - 22.0 N, 72.6 - 80.9 E
    # Defaulting to Maharashtra (Pune) if lat/lon in Maharashtra or unspecified
    is_maharashtra = True
    state = "Maharashtra"
    district = "Pune"

    if lat is not None and lon is not None:
        if 23.5 <= lat <= 30.5 and 69.5 <= lon <= 78.5:
            # Rajasthan
            state = "Rajasthan"
            district = "Jaipur"
            return DetectLanguageResponse(
                status="success",
                detected_state=state,
                detected_district=district,
                suggested_languages=[
                    LanguageOptionItem(code="raj", name="Rajasthani", nativeName="राजस्थानी"),
                    LanguageOptionItem(code="hi", name="Hindi", nativeName="हिंदी"),
                    LanguageOptionItem(code="en", name="English", nativeName="English")
                ]
            )
        elif 20.0 <= lat <= 24.5 and 68.0 <= lon <= 74.5:
            # Gujarat
            state = "Gujarat"
            district = "Ahmedabad"
            return DetectLanguageResponse(
                status="success",
                detected_state=state,
                detected_district=district,
                suggested_languages=[
                    LanguageOptionItem(code="gu", name="Gujarati", nativeName="ગુજરાતી"),
                    LanguageOptionItem(code="hi", name="Hindi", nativeName="हिंदी"),
                    LanguageOptionItem(code="en", name="English", nativeName="English")
                ]
            )
        elif 29.5 <= lat <= 32.5 and 73.5 <= lon <= 77.0:
            # Punjab
            state = "Punjab"
            district = "Ludhiana"
            return DetectLanguageResponse(
                status="success",
                detected_state=state,
                detected_district=district,
                suggested_languages=[
                    LanguageOptionItem(code="pa", name="Punjabi", nativeName="ਪੰਜਾਬੀ"),
                    LanguageOptionItem(code="hi", name="Hindi", nativeName="हिंदी"),
                    LanguageOptionItem(code="en", name="English", nativeName="English")
                ]
            )

    # Default Maharashtra
    return DetectLanguageResponse(
        status="success",
        detected_state=state,
        detected_district=district,
        suggested_languages=[
            LanguageOptionItem(code="mr", name="Marathi", nativeName="मराठी"),
            LanguageOptionItem(code="hi", name="Hindi", nativeName="हिंदी"),
            LanguageOptionItem(code="en", name="English", nativeName="English")
        ]
    )

@router.get("/geo/locations")
def get_geo_locations():
    """
    Endpoint: Fetch list of supported states, districts, and talukas.
    """
    return {
        "status": "success",
        "states": [
            {
                "state_name": "Maharashtra",
                "state_code": "MH",
                "districts": [
                    {"district_name": "Pune", "talukas": ["Baramati", "Haveli", "Daund", "Shirur", "Indapur", "Khed"]},
                    {"district_name": "Nashik", "talukas": ["Niphad", "Dindori", "Sinnar", "Malegaon", "Yeola"]},
                    {"district_name": "Jalgaon", "talukas": ["Raver", "Yawal", "Chopda", "Bhusawal", "Jamner"]}
                ]
            },
            {
                "state_name": "Rajasthan",
                "state_code": "RJ",
                "districts": [
                    {"district_name": "Jaipur", "talukas": ["Sanganer", "Chaksu", "Amber", "Bassi", "Kotputli"]},
                    {"district_name": "Nagaur", "talukas": ["Merta", "Degana", "Didwana", "Jayal", "Ladnun"]}
                ]
            }
        ]
    }

