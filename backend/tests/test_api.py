import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.seed import seed_database

# Initialize database seed before running tests
seed_database()
client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Fasal Disha" in response.json()["project"]
    assert "हर खेत को मिले सही दिशा" in response.json()["tagline"]

def test_local_crops_discovery():
    response = client.get("/api/v1/crop/local-crops?district=Jaipur&season=KHARIF&lang=hi")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["district"] == "JAIPUR"
    assert len(data["local_crops"]) >= 3
    assert any(c["crop_id"] == "BAJRA" for c in data["local_crops"])

def test_endpoint_1_assess_soil_weather():
    payload = {
        "latitude": 26.9124,
        "longitude": 75.7873,
        "district": "Jaipur",
        "taluka": "Sanganer"
    }
    response = client.post("/api/v1/farm/assess-soil-weather", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["district"] == "Jaipur"
    assert "soil_summary" in data["data"]
    assert "climate_summary" in data["data"]

def test_endpoint_2_farmer_profile():
    payload = {
        "farmer_name": "Ramesh Choudhary",
        "mobile": "9911223344",
        "language_preference": "hi",
        "district": "Jaipur",
        "taluka": "Sanganer",
        "total_land_acres": 5.0,
        "soil_type": "LOAM",
        "water_source": "BOREWELL",
        "water_capacity_level": "MEDIUM",
        "working_capital_inr": 80000.0,
        "previous_season_crop": "WHEAT",
        "owns_tractor": True,
        "owns_sprayer": True
    }
    response = client.post("/api/v1/farmer/profile", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "success"
    assert "FARMER-" in data["farmer_id"]

def test_endpoint_3_crop_recommendation_with_cacp_costs():
    payload = {
        "planned_sowing_date": "2027-06-25",
        "candidate_crops": ["BAJRA", "MOONG", "GROUNDNUT", "SOYBEAN"],
        "soil_type": "LOAM",
        "water_source": "BOREWELL",
        "water_capacity_level": "MEDIUM",
        "working_capital_inr": 80000.0,
        "previous_season_crop": "WHEAT",
        "owns_tractor": True,
        "owns_sprayer": True
    }
    response = client.post("/api/v1/crop/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "sowing_window" in data
    assert "top_recommendation" in data
    assert "comparison_matrix" in data
    
    top = data["top_recommendation"]
    assert top["crop_id"] in ["BAJRA", "MOONG", "SOYBEAN", "GROUNDNUT"]
    assert top["expected_yield_qtl_per_acre"] > 0
    assert top["expected_net_profit_per_acre_inr"] > 0
    assert top["net_profit_per_day_inr"] > 0
    assert len(top["why_recommended"]) >= 2
    assert len(data["comparison_matrix"]) >= 2

    # Verify itemized CACP cost breakdown
    assert "cost_breakdown" in top
    assert top["cost_breakdown"] is not None
    cb = top["cost_breakdown"]
    assert cb["seed_cost"] > 0
    assert cb["fertilizer_cost"] > 0
    assert cb["labour_cost"] > 0
    assert cb["operational_cost_a2_inr_per_acre"] > 0

def test_endpoint_4_what_if_simulate():
    payload = {
        "sowing_delay_days": 15,
        "rainfall_deficit_pct": -25.0,
        "mandi_price_shock_pct": -10.0,
        "soil_type": "LOAM",
        "water_capacity_level": "MEDIUM",
        "working_capital_inr": 80000.0
    }
    response = client.post("/api/v1/crop/what-if-simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    sim = data["simulation_results"]
    assert "updated_top_crop" in sim
    assert "alert_message" in sim
    assert "resilience_rating" in sim
    assert sim["updated_profit_inr_per_acre"] > 0

def test_endpoint_5_crop_calendar():
    response = client.get("/api/v1/crop/crop-calendar?crop_id=BAJRA&sowing_date=2027-06-25")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "बाजरा" in data["crop_name"] or "Bajra" in data["crop_name"]
    assert len(data["milestones"]) >= 3
    assert data["milestones"][0]["day_offset"] == 0

def test_auxiliary_crop_search():
    response = client.get("/api/v1/crop/search?q=soy")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["crop_id"] == "SOYBEAN"

def test_auxiliary_geo_locations():
    response = client.get("/api/v1/geo/locations")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["states"]) >= 2

def test_geo_detect_language():
    # Maharashtra coordinates
    response = client.get("/api/v1/geo/detect-language?lat=18.5204&lon=73.8567")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["detected_state"] == "Maharashtra"
    assert any(lang["code"] == "mr" for lang in data["suggested_languages"])

def test_farmer_history_and_save():
    save_payload = {
        "farmer_id": "TEST-FARMER-1",
        "planned_sowing_date": "2027-06-25",
        "total_land_acres": 2.5,
        "soil_type": "BLACK",
        "water_source": "WELL",
        "top_recommended_crop": "SOYBEAN",
        "crop_name_hi": "सोयाबीन",
        "crop_name_mr": "सोयाबीन",
        "expected_yield_qtl_per_acre": 9.5,
        "total_cost_per_acre": 19412.0,
        "expected_profit_per_acre": 24500.0,
        "match_score": 94.0
    }
    save_resp = client.post("/api/v1/farmer/save-analysis", json=save_payload)
    assert save_resp.status_code == 201

    history_resp = client.get("/api/v1/farmer/TEST-FARMER-1/history")
    assert history_resp.status_code == 200
    hist_data = history_resp.json()
    assert hist_data["total_records"] >= 1
    assert hist_data["history"][0]["top_recommended_crop"] == "SOYBEAN"
    assert hist_data["history"][0]["expected_profit_per_acre"] == 24500.0
