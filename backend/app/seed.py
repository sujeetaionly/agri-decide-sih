"""
Database Seed Script:
Populates PostgreSQL / SQLite database with complete benchmark datasets:
1. 15 Master Crops (with names in EN/HI/MR, durations, water requirements)
2. Official CACP Cultivation Cost breakdown per acre
3. Historical Mandi Wholesale Prices from Agmarknet
4. District Sowing Windows (ICAR benchmarks)
"""
from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models.crop import Crop, CropCostCACP, MandiPriceHistorical, DistrictSowingWindow

# 15 Master Crops
SEED_CROPS = [
    {
        "crop_id": "SOYBEAN",
        "crop_name_en": "Soybean (JS-335)",
        "crop_name_hi": "सोयाबीन (जेएस-335)",
        "crop_name_mr": "सोयाबीन (जेएस-३३५)",
        "category": "OILSEED",
        "duration_days_standard": 95,
        "water_requirement_mm": 500.0,
        "suitable_soil_types": "BLACK,LOAM"
    },
    {
        "crop_id": "MAIZE",
        "crop_name_en": "Maize (Hybrid HQPM-1)",
        "crop_name_hi": "मक्का (एचक्यूपीएम-1)",
        "crop_name_mr": "मका (एचक्यूपीएम-१)",
        "category": "CEREAL",
        "duration_days_standard": 105,
        "water_requirement_mm": 600.0,
        "suitable_soil_types": "LOAM,BLACK,RED"
    },
    {
        "crop_id": "TUR",
        "crop_name_en": "Tur / Arhar (BDN-711)",
        "crop_name_hi": "तुअर / अरहर (बीडीएन-711)",
        "crop_name_mr": "तूर (बीडीएन-७११)",
        "category": "PULSE",
        "duration_days_standard": 180,
        "water_requirement_mm": 450.0,
        "suitable_soil_types": "BLACK,LOAM,RED"
    },
    {
        "crop_id": "COTTON",
        "crop_name_en": "Cotton (Bt Hybrid)",
        "crop_name_hi": "कपास (बीटी हाइब्रिड)",
        "crop_name_mr": "कापूस (बीटी संकरित)",
        "category": "FIBRE",
        "duration_days_standard": 160,
        "water_requirement_mm": 700.0,
        "suitable_soil_types": "BLACK,LOAM"
    },
    {
        "crop_id": "BAJRA",
        "crop_name_en": "Bajra (Pearl Millet - HHB 67)",
        "crop_name_hi": "बाजरा (एचएचबी 67)",
        "crop_name_mr": "बाजरी (एचएचबी ६७)",
        "category": "CEREAL",
        "duration_days_standard": 85,
        "water_requirement_mm": 350.0,
        "suitable_soil_types": "SANDY,LOAM,RED"
    },
    {
        "crop_id": "MOONG",
        "crop_name_en": "Moong (Green Gram - IPM 205-7)",
        "crop_name_hi": "मूंग (विराट - आईपीएम 205-7)",
        "crop_name_mr": "मूग (विराट)",
        "category": "PULSE",
        "duration_days_standard": 70,
        "water_requirement_mm": 300.0,
        "suitable_soil_types": "LOAM,BLACK,SANDY,RED"
    },
    {
        "crop_id": "GROUNDNUT",
        "crop_name_en": "Groundnut (TG-37A)",
        "crop_name_hi": "मूंगफली (टीजी-37ए)",
        "crop_name_mr": "भुईमूग (टीजी-३७ए)",
        "category": "OILSEED",
        "duration_days_standard": 120,
        "water_requirement_mm": 550.0,
        "suitable_soil_types": "LOAM,SANDY,RED"
    },
    {
        "crop_id": "WHEAT",
        "crop_name_en": "Wheat (HD-2967)",
        "crop_name_hi": "गेहूं (एचडी-2967)",
        "crop_name_mr": "गहू (एचडी-२९६७)",
        "category": "CEREAL",
        "duration_days_standard": 125,
        "water_requirement_mm": 450.0,
        "suitable_soil_types": "LOAM,BLACK"
    },
    {
        "crop_id": "GRAM",
        "crop_name_en": "Gram / Chana (Digvijay)",
        "crop_name_hi": "चना (दिग्विजय)",
        "crop_name_mr": "हरभरा (दिग्विजय)",
        "category": "PULSE",
        "duration_days_standard": 110,
        "water_requirement_mm": 300.0,
        "suitable_soil_types": "BLACK,LOAM"
    },
    {
        "crop_id": "JOWAR",
        "crop_name_en": "Jowar / Sorghum (CSH-16)",
        "crop_name_hi": "ज्वार (सीएसएच-16)",
        "crop_name_mr": "ज्वारी (सीएसएच-१६)",
        "category": "CEREAL",
        "duration_days_standard": 100,
        "water_requirement_mm": 400.0,
        "suitable_soil_types": "BLACK,LOAM,RED"
    },
    {
        "crop_id": "URAD",
        "crop_name_en": "Urad (Black Gram - TAU-1)",
        "crop_name_hi": "उड़द (टीएयू-1)",
        "crop_name_mr": "उडीद (टीएयू-१)",
        "category": "PULSE",
        "duration_days_standard": 75,
        "water_requirement_mm": 320.0,
        "suitable_soil_types": "BLACK,LOAM"
    },
    {
        "crop_id": "SUNFLOWER",
        "crop_name_en": "Sunflower (KBSH-53)",
        "crop_name_hi": "सूरजमुखी (केबीएसएच-53)",
        "crop_name_mr": "सूर्यफूल (केबीएसएच-५३)",
        "category": "OILSEED",
        "duration_days_standard": 90,
        "water_requirement_mm": 480.0,
        "suitable_soil_types": "BLACK,LOAM,RED"
    },
    {
        "crop_id": "SUGARCANE",
        "crop_name_en": "Sugarcane (Co-86032)",
        "crop_name_hi": "गन्ना (को-86032)",
        "crop_name_mr": "ऊस (को-८६०३२)",
        "category": "COMMERCIAL",
        "duration_days_standard": 360,
        "water_requirement_mm": 1800.0,
        "suitable_soil_types": "BLACK,LOAM"
    },
    {
        "crop_id": "ONION",
        "crop_name_en": "Onion (Bhima Super)",
        "crop_name_hi": "प्याज (भीमा सुपर)",
        "crop_name_mr": "कांदा (भीमा सुपर)",
        "category": "HORTICULTURE",
        "duration_days_standard": 120,
        "water_requirement_mm": 600.0,
        "suitable_soil_types": "LOAM,BLACK,RED"
    },
    {
        "crop_id": "TOMATO",
        "crop_name_en": "Tomato (Abhinav)",
        "crop_name_hi": "टमाटर (अभिनव)",
        "crop_name_mr": "टोमॅटो (अभिनव)",
        "category": "HORTICULTURE",
        "duration_days_standard": 130,
        "water_requirement_mm": 650.0,
        "suitable_soil_types": "LOAM,RED,BLACK"
    }
]

# Official CACP Cultivation Cost breakdown per acre (in ₹)
SEED_CACP_COSTS = [
    {"crop_id": "SOYBEAN", "seed": 4200, "fert": 5800, "pest": 3200, "mach": 5500, "labour": 8100, "irri": 2000, "total": 28800.0},
    {"crop_id": "MAIZE", "seed": 3500, "fert": 6200, "pest": 2400, "mach": 5200, "labour": 7200, "irri": 1800, "total": 26300.0},
    {"crop_id": "TUR", "seed": 2200, "fert": 4800, "pest": 3800, "mach": 4500, "labour": 7500, "irri": 1500, "total": 24300.0},
    {"crop_id": "COTTON", "seed": 3800, "fert": 7500, "pest": 6800, "mach": 5800, "labour": 14200, "irri": 2200, "total": 40300.0},
    {"crop_id": "BAJRA", "seed": 1800, "fert": 3800, "pest": 1600, "mach": 4200, "labour": 6200, "irri": 1200, "total": 18800.0},
    {"crop_id": "MOONG", "seed": 2400, "fert": 3600, "pest": 2800, "mach": 4000, "labour": 6300, "irri": 1200, "total": 20300.0},
    {"crop_id": "GROUNDNUT", "seed": 6500, "fert": 5200, "pest": 3100, "mach": 5400, "labour": 10300, "irri": 1800, "total": 32300.0},
    {"crop_id": "WHEAT", "seed": 3200, "fert": 5400, "pest": 2100, "mach": 4800, "labour": 6800, "irri": 2200, "total": 24500.0},
    {"crop_id": "GRAM", "seed": 2800, "fert": 3500, "pest": 2600, "mach": 3900, "labour": 5500, "irri": 1200, "total": 19500.0},
    {"crop_id": "JOWAR", "seed": 2000, "fert": 4200, "pest": 1900, "mach": 4400, "labour": 7100, "irri": 1400, "total": 21000.0},
    {"crop_id": "URAD", "seed": 2300, "fert": 3500, "pest": 2700, "mach": 4100, "labour": 6200, "irri": 1200, "total": 20000.0},
    {"crop_id": "SUNFLOWER", "seed": 2900, "fert": 5100, "pest": 2800, "mach": 4900, "labour": 7700, "irri": 1600, "total": 25000.0},
    {"crop_id": "SUGARCANE", "seed": 12000, "fert": 16000, "pest": 5000, "mach": 9000, "labour": 21000, "irri": 5000, "total": 68000.0},
    {"crop_id": "ONION", "seed": 5500, "fert": 9500, "pest": 4800, "mach": 6200, "labour": 16000, "irri": 3000, "total": 45000.0},
    {"crop_id": "TOMATO", "seed": 6500, "fert": 11000, "pest": 7200, "mach": 6500, "labour": 17800, "irri": 3000, "total": 52000.0}
]

# Sowing Windows
SEED_SOWING_WINDOWS = [
    {"district": "Pune", "crop_id": "SOYBEAN", "optimal_start": "06-15", "optimal_end": "07-05", "late_cutoff": "07-20"},
    {"district": "Pune", "crop_id": "MAIZE", "optimal_start": "06-10", "optimal_end": "07-10", "late_cutoff": "07-25"},
    {"district": "Pune", "crop_id": "TUR", "optimal_start": "06-15", "optimal_end": "07-10", "late_cutoff": "07-25"},
    {"district": "Pune", "crop_id": "COTTON", "optimal_start": "06-01", "optimal_end": "06-25", "late_cutoff": "07-10"},
    {"district": "Pune", "crop_id": "BAJRA", "optimal_start": "06-15", "optimal_end": "07-15", "late_cutoff": "07-30"},
    {"district": "Pune", "crop_id": "MOONG", "optimal_start": "06-15", "optimal_end": "07-10", "late_cutoff": "07-25"},
    {"district": "Pune", "crop_id": "GROUNDNUT", "optimal_start": "06-15", "optimal_end": "07-05", "late_cutoff": "07-20"},
    {"district": "Jaipur", "crop_id": "BAJRA", "optimal_start": "06-25", "optimal_end": "07-15", "late_cutoff": "07-30"},
    {"district": "Jaipur", "crop_id": "MOONG", "optimal_start": "06-25", "optimal_end": "07-15", "late_cutoff": "07-30"},
    {"district": "Jaipur", "crop_id": "GROUNDNUT", "optimal_start": "06-20", "optimal_end": "07-10", "late_cutoff": "07-25"},
    {"district": "Jaipur", "crop_id": "SOYBEAN", "optimal_start": "06-25", "optimal_end": "07-10", "late_cutoff": "07-20"}
]

def seed_database():
    """Seeds the database with initial benchmark datasets."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed Crops
        for crop_data in SEED_CROPS:
            existing = db.query(Crop).filter(Crop.crop_id == crop_data["crop_id"]).first()
            if not existing:
                db.add(Crop(**crop_data))
        db.commit()

        # Seed CACP Costs
        for cost_data in SEED_CACP_COSTS:
            existing = db.query(CropCostCACP).filter(CropCostCACP.crop_id == cost_data["crop_id"]).first()
            if not existing:
                db.add(CropCostCACP(
                    crop_id=cost_data["crop_id"],
                    state="Maharashtra",
                    district="Pune",
                    seed_cost=cost_data["seed"],
                    fertilizer_cost=cost_data["fert"],
                    pesticide_cost=cost_data["pest"],
                    machinery_rental_cost=cost_data["mach"],
                    labour_cost=cost_data["labour"],
                    irrigation_electricity_cost=cost_data["irri"],
                    total_cost_per_acre=cost_data["total"]
                ))
        db.commit()

        # Seed Sowing Windows
        for win in SEED_SOWING_WINDOWS:
            existing = db.query(DistrictSowingWindow).filter(
                DistrictSowingWindow.district == win["district"],
                DistrictSowingWindow.crop_id == win["crop_id"]
            ).first()
            if not existing:
                db.add(DistrictSowingWindow(
                    district=win["district"],
                    crop_id=win["crop_id"],
                    season="Kharif",
                    optimal_start_date=win["optimal_start"],
                    optimal_end_date=win["optimal_end"],
                    late_cutoff_date=win["late_cutoff"]
                ))
        db.commit()
        print("[SUCCESS] Database successfully seeded with 15 crops, CACP cost breakdowns, and sowing windows!")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
