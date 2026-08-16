# ⚙️ 06. Backend Architecture & PostgreSQL Database Guide
### Assigned to: **Lead Orchestrator & Backend Lead (You)**
### Project: **AGRI-DECIDE — AI Crop Recommendation Engine (PS #24)**

---

## Part 1: PostgreSQL Database Schema (Complete DDL)

Execute this clean, relational SQL schema to initialize your PostgreSQL database:

```sql
-- 1. Farmers Profile Table
CREATE TABLE farmers (
    farmer_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    state VARCHAR(50) DEFAULT 'Maharashtra',
    district VARCHAR(50) NOT NULL,
    taluka VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Farms and Land Parcels Table
CREATE TABLE farms (
    farm_id SERIAL PRIMARY KEY,
    farmer_id VARCHAR(50) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    total_area_acres NUMERIC(5,2) NOT NULL,
    soil_type VARCHAR(30) NOT NULL, -- 'BLACK', 'LOAM', 'RED', 'SANDY'
    water_source VARCHAR(30) NOT NULL, -- 'WELL', 'BOREWELL', 'CANAL', 'RAINFED'
    water_capacity_level VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH'
    working_capital_inr NUMERIC(10,2) NOT NULL,
    previous_season_crop VARCHAR(50),
    owns_tractor BOOLEAN DEFAULT FALSE,
    owns_sprayer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Master Crops Table
CREATE TABLE crops (
    crop_id VARCHAR(30) PRIMARY KEY, -- 'SOYBEAN', 'MAIZE', 'TUR', 'COTTON'
    crop_name_en VARCHAR(100) NOT NULL,
    crop_name_mr VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL, -- 'OILSEED', 'CEREAL', 'PULSE', 'FIBRE'
    duration_days_standard INT NOT NULL,
    water_requirement_mm NUMERIC(6,2) NOT NULL,
    suitable_soil_types TEXT[] NOT NULL
);

-- 4. Official CACP Cultivation Cost Breakdown Table (Per Acre)
CREATE TABLE crop_costs_cacp (
    cost_id SERIAL PRIMARY KEY,
    crop_id VARCHAR(30) REFERENCES crops(crop_id),
    state VARCHAR(50) NOT NULL,
    seed_cost NUMERIC(8,2) NOT NULL,
    fertilizer_cost NUMERIC(8,2) NOT NULL,
    pesticide_cost NUMERIC(8,2) NOT NULL,
    machinery_rental_cost NUMERIC(8,2) NOT NULL,
    labour_cost NUMERIC(8,2) NOT NULL,
    irrigation_electricity_cost NUMERIC(8,2) NOT NULL,
    total_cost_per_acre NUMERIC(8,2) NOT NULL
);

-- 5. Historical Mandi Prices Table (From Agmarknet)
CREATE TABLE mandi_prices_historical (
    price_id SERIAL PRIMARY KEY,
    district VARCHAR(50) NOT NULL,
    crop_id VARCHAR(30) REFERENCES crops(crop_id),
    month_num INT NOT NULL, -- 1 to 12
    year INT NOT NULL,
    modal_price_qtl NUMERIC(8,2) NOT NULL
);

-- 6. District Sowing Windows Table
CREATE TABLE district_sowing_windows (
    window_id SERIAL PRIMARY KEY,
    district VARCHAR(50) NOT NULL,
    crop_id VARCHAR(30) REFERENCES crops(crop_id),
    season VARCHAR(20) DEFAULT 'Kharif',
    optimal_start_date VARCHAR(5) NOT NULL, -- '06-15'
    optimal_end_date VARCHAR(5) NOT NULL,   -- '06-30'
    late_cutoff_date VARCHAR(5) NOT NULL    -- '07-15'
);

-- 7. Recommendations Audit Table
CREATE TABLE recommendations_log (
    rec_id SERIAL PRIMARY KEY,
    farmer_id VARCHAR(50) REFERENCES farmers(farmer_id),
    planned_sowing_date DATE NOT NULL,
    top_recommended_crop VARCHAR(30) REFERENCES crops(crop_id),
    expected_profit_per_acre NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mandi_district_crop ON mandi_prices_historical(district, crop_id, month_num);
CREATE INDEX idx_sowing_district_crop ON district_sowing_windows(district, crop_id);
```

---

## Part 2: FastAPI Backend Structure

```
backend/
├── app/
│   ├── main.py                     # FastAPI entrypoint with CORS
│   ├── core/
│   │   ├── config.py               # Database URL & settings
│   │   └── database.py             # SQLAlchemy session manager
│   ├── models/                     # SQLAlchemy ORM models
│   │   ├── farmer.py
│   │   └── crop.py
│   ├── schemas/                    # Pydantic schemas (from 03_api_contracts.md)
│   │   ├── farmer_schema.py
│   │   └── crop_schema.py
│   ├── api/v1/                     # REST API Route Controllers
│   │   ├── farmer_routes.py        # /farmer/profile, /assess-soil-weather
│   │   └── crop_routes.py          # /crop/recommend, /what-if-simulate, /crop-calendar
│   ├── services/                   # Business logic calculations
│   │   ├── economics_service.py    # Cost adjustment for machinery & Net Profit/Day
│   │   └── sowing_window_service.py# Sowing date validation
│   └── models_ml/                  # Team B's ML Models
│       ├── yield_model.joblib      # Trained XGBoost yield model
│       └── price_forecaster.py     # Harvest-month price projection
├── data/
│   └── seed_district_data.sql      # Seed data for Pune/Baramati (15 crops)
├── requirements.txt
└── Dockerfile
```

---

## Part 3: Core Service Formulas (`economics_service.py`)

$$\text{Adjusted Cost/Acre} = \text{Total CACP Cost} - (\text{Tractor Deduction if Owned: ₹3,500}) - (\text{Sprayer Deduction if Owned: ₹800})$$

$$\text{Gross Revenue/Acre} = \text{Predicted Yield (qtl/acre)} \times \text{Forecasted Harvest Mandi Price (₹/qtl)}$$

$$\text{Net Profit/Acre} = \text{Gross Revenue/Acre} - \text{Adjusted Cost/Acre}$$

$$\text{Net Profit per Day} = \frac{\text{Net Profit/Acre}}{\text{Duration Days}}$$
