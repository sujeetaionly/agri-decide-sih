"""
Local Crop Discovery & APMC Mandi Commercial Viability Service.
Determines which crops are actively grown, commercially traded, and agronomically viable
in a specific District & APMC Mandi for the current agricultural season.
"""
from typing import List, Dict, Any, Optional
from backend.app.core.i18n import resolve_localized_crop_name, get_all_crop_translations

# District-to-Mandi Agronomic & Commercial Crop Database
# Sourced from:
# 1. Agmarknet APMC Mandi Daily/Monthly Commodity Arrival Reports
# 2. ICAR-CRIDA District Agriculture Contingency Plans
# 3. ICRISAT District-Level Crop Panel Statistics
DISTRICT_LOCAL_CROP_REGISTRY: Dict[str, Dict[str, Any]] = {
    "PUNE": {
        "state": "Maharashtra",
        "primary_mandi": "Baramati APMC / Pune APMC",
        "agro_climatic_zone": "Western Maharashtra Plain Zone (Scarcity to Assured Rainfall)",
        "seasons": {
            "KHARIF": ["SOYBEAN", "MAIZE", "BAJRA", "TUR", "GROUNDNUT", "MOONG", "URAD", "COTTON"],
            "RABI": ["WHEAT", "GRAM", "JOWAR", "SUNFLOWER", "MAIZE"],
            "ZAID": ["GROUNDNUT", "MOONG", "URAD"]
        }
    },
    "NASHIK": {
        "state": "Maharashtra",
        "primary_mandi": "Lasalgaon APMC / Niphad APMC",
        "agro_climatic_zone": "North Maharashtra Ghat & Transition Zone",
        "seasons": {
            "KHARIF": ["SOYBEAN", "MAIZE", "BAJRA", "GROUNDNUT", "COTTON", "TUR"],
            "RABI": ["WHEAT", "GRAM", "MAIZE", "SUNFLOWER"],
            "ZAID": ["MOONG", "GROUNDNUT"]
        }
    },
    "JALGAON": {
        "state": "Maharashtra",
        "primary_mandi": "Jalgaon APMC / Raver Mandi",
        "agro_climatic_zone": "Khandesh Tapi Basin Zone",
        "seasons": {
            "KHARIF": ["COTTON", "SOYBEAN", "MAIZE", "JOWAR", "TUR", "GROUNDNUT"],
            "RABI": ["WHEAT", "GRAM", "JOWAR", "MAIZE"],
            "ZAID": ["MOONG", "GROUNDNUT"]
        }
    },
    "JAIPUR": {
        "state": "Rajasthan",
        "primary_mandi": "Jaipur (Surajpole) / Chomu APMC",
        "agro_climatic_zone": "Semi-Arid Eastern Plain Zone (IIIa)",
        "seasons": {
            "KHARIF": ["BAJRA", "MOONG", "GROUNDNUT", "MAIZE", "GUAR", "URAD"],
            "RABI": ["MUSTARD", "WHEAT", "GRAM"],
            "ZAID": ["MOONG", "GROUNDNUT"]
        }
    },
    "NAGAUR": {
        "state": "Rajasthan",
        "primary_mandi": "Merta City APMC / Nagaur Mandi",
        "agro_climatic_zone": "Transitional Plain of Inland Drainage (IIa)",
        "seasons": {
            "KHARIF": ["BAJRA", "MOONG", "GUAR", "GROUNDNUT"],
            "RABI": ["MUSTARD", "GRAM", "CUMIN", "WHEAT"],
            "ZAID": ["MOONG"]
        }
    },
    "KOTA": {
        "state": "Rajasthan",
        "primary_mandi": "Bhamashah Mandi, Kota",
        "agro_climatic_zone": "Humid South Eastern Plain (V)",
        "seasons": {
            "KHARIF": ["SOYBEAN", "MAIZE", "URAD", "TUR"],
            "RABI": ["MUSTARD", "WHEAT", "GRAM"],
            "ZAID": ["MOONG"]
        }
    },
    "AHMEDABAD": {
        "state": "Gujarat",
        "primary_mandi": "Ahmedabad APMC / Sanand Mandi",
        "agro_climatic_zone": "Middle Gujarat Agroclimatic Zone",
        "seasons": {
            "KHARIF": ["COTTON", "GROUNDNUT", "SOYBEAN", "BAJRA", "MAIZE"],
            "RABI": ["WHEAT", "GRAM", "MUSTARD", "CUMIN"],
            "ZAID": ["GROUNDNUT", "MOONG"]
        }
    },
    "LUDHIANA": {
        "state": "Punjab",
        "primary_mandi": "Khanna APMC / Ludhiana Grain Market",
        "agro_climatic_zone": "Central Plain Agroclimatic Zone",
        "seasons": {
            "KHARIF": ["MAIZE", "COTTON", "BAJRA"],
            "RABI": ["WHEAT", "MUSTARD", "GRAM"],
            "ZAID": ["MOONG"]
        }
    }
}

def get_local_crops_for_district(
    district: Optional[str] = "Pune",
    state: Optional[str] = "Maharashtra",
    season: str = "KHARIF",
    lang: str = "hi"
) -> Dict[str, Any]:
    """
    Returns authentic local crops grown & traded in the specified district for the given season.
    Falls back gracefully to the closest benchmark zone (Pune/Maharashtra) if district is unmapped.
    """
    dist_key = (district or "Pune").upper().strip()
    season_key = (season or "KHARIF").upper().strip()

    is_fallback = False
    reg_data = DISTRICT_LOCAL_CROP_REGISTRY.get(dist_key)
    if not reg_data:
        # Fallback to Pune benchmark dataset
        reg_data = DISTRICT_LOCAL_CROP_REGISTRY["PUNE"]
        is_fallback = True

    season_crops = reg_data["seasons"].get(season_key, reg_data["seasons"]["KHARIF"])

    formatted_crops = []
    for cid in season_crops:
        formatted_crops.append({
            "crop_id": cid,
            "crop_name": resolve_localized_crop_name(cid, lang),
            "localized_names": get_all_crop_translations(cid)
        })

    return {
        "district": dist_key if not is_fallback else f"{dist_key} (Routed to {reg_data['state']} Benchmark)",
        "state": reg_data["state"],
        "season": season_key,
        "mandi_source": reg_data["primary_mandi"],
        "agro_climatic_zone": reg_data["agro_climatic_zone"],
        "is_benchmark_route": is_fallback,
        "local_crops": formatted_crops,
        "raw_crop_ids": season_crops
    }
