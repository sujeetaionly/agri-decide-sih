# 🌾 AGRI-DECIDE (PS #24) — Master Data Engineering Handover Document
**Target District**: Pune / Baramati Belt, Maharashtra  
**Author**: Data Engineering Team (Team B)  
**Live GitHub Repository**: `https://github.com/sujeetaionly/agri-decide-sih`  
**Target Branch**: `feature/ml-data`  

---

## 📌 Executive Summary for ML Engineer
All data in this directory is **100% authentic, verified, and extracted from official Government of India & ICAR research databases**. Zero synthetic/fabricated data was used. All legacy synthetic placeholder files have been completely purged from the repository.

The data is structured into **3 core pillars** to feed directly into:
1. `train_yield_xgboost.py` (XGBoost Yield Regressor predicting output in **Quintals / Acre**).
2. `price_forecaster.py` (Harvest-window wholesale modal price projections from 5-year Agmarknet distributions).
3. `economics_service.py` (Cash budget constraint using CACP $A_2$, Economic profitability using $A_2+FL$, and Net Profit per Day).

---

## 📂 Master Directory Structure (`/data/official_real_data/`)

```
data/
└── official_real_data/
    ├── agmarknet_mandi_prices_pune_2021_2025.csv   <-- ⭐ MASTER Pillar 3: 14,786 daily mandi rows (2021-2025)
    ├── cacp_costs_official_maharashtra.csv         <-- ⭐ MASTER Pillar 2: Official CACP CoC A2 & A2+FL (₹/ha & ₹/acre)
    ├── cacp_itemized_costs_pune.csv                <-- ⭐ MASTER Pillar 2 (Task 4): Seeds, Fertilizer, Labor, Machinery breakdown
    ├── district_sowing_windows.csv                 <-- ⭐ MASTER Pillar 3: Agronomic sowing windows & MPKV varieties
    ├── raw_upag_pune_foodgrains_2024_25.csv        <-- ⭐ MASTER Pillar 1: Official UPAg 2024-25 Pune advance yields
    ├── historical_icrisat_pune_2008_2017.csv       <-- ⭐ MASTER Pillar 1: 10-year ICRISAT Pune yield time series
    ├── raw_agmarknet_cereals_pune_2021_2025.csv    <-- Raw Agmarknet Cereals (5,823 rows)
    ├── raw_agmarknet_pulses_pune_2021_2025.csv     <-- Raw Agmarknet Pulses (4,239 rows)
    ├── raw_agmarknet_vegetables_pune_2021_2025.csv <-- Raw Agmarknet Vegetables (3,596 rows)
    ├── raw_agmarknet_oilseeds_pune_2021_2025.csv   <-- Raw Agmarknet Oilseeds (1,052 rows)
    └── raw_agmarknet_fibre_pune_2021_2025.csv      <-- Raw Agmarknet Cotton (76 rows)
```

---

## ⚡ Quick Start for ML Engineer (Python Data Loaders)

```python
import pandas as pd

# 1. Master Agmarknet Mandi Prices (14,786 daily transactions)
df_prices = pd.read_csv("data/official_real_data/agmarknet_mandi_prices_pune_2021_2025.csv")

# 2. Master CACP Cost of Cultivation & Itemized Costs (Task 4)
df_costs = pd.read_csv("data/official_real_data/cacp_costs_official_maharashtra.csv")
df_itemized_costs = pd.read_csv("data/official_real_data/cacp_itemized_costs_pune.csv")

# 3. Master Sowing Windows & Agronomy (Duration, water need, MPKV varieties)
df_calendar = pd.read_csv("data/official_real_data/district_sowing_windows.csv")

# 4. Master Yield Datasets
df_upag_yields = pd.read_csv("data/official_real_data/raw_upag_pune_foodgrains_2024_25.csv")
df_icrisat_yields = pd.read_csv("data/official_real_data/historical_icrisat_pune_2008_2017.csv")
```

---

## 1. 🌾 Pillar 1: Crop Yield Benchmarks (Pune District)

### A. Data Sources
1. **UPAg Portal (Unified Portal for Agricultural Statistics - GOI / Ministry of Agriculture)**:
   - File: `raw_upag_pune_foodgrains_2024_25.csv`
   - Covers latest official 2024–25 advance estimates for Pune District.
2. **ICRISAT District Level Database (DLD) for Pune (District Code 103)**:
   - File: `historical_icrisat_pune_2008_2017.csv`
   - Covers 10-year historical district yield trajectory.

### B. Standard Unit Conversion Formula
Government portals report yield in $\text{kg/hectare}$. The system requires **$\text{Quintals/Acre}$**.
$$\text{Yield (qtl/acre)} = \frac{\text{Yield (kg/ha)}}{100 \times 2.47105} = \frac{\text{Yield (kg/ha)}}{247.105}$$

### C. Pune District Baseline Yields Table

| Crop Name | Category | Season | Pune Benchmark (kg/ha) | Converted Yield (qtl/acre) |
| :--- | :--- | :--- | :--- | :--- |
| **Soybean** | Oilseed | Kharif | 1,450 – 1,850 kg/ha | **5.87 – 7.49 qtl/acre** |
| **Bajra** | Cereal | Kharif | 1,073 – 1,629 kg/ha | **4.34 – 6.59 qtl/acre** |
| **Maize** | Cereal | Kharif / Rabi | 2,539 – 3,698 kg/ha | **10.27 – 14.96 qtl/acre** |
| **Wheat** | Cereal | Rabi | 2,200 – 2,447 kg/ha | **8.90 – 9.90 qtl/acre** |
| **Jowar (Rabi)** | Cereal | Rabi | 772 – 1,142 kg/ha | **3.12 – 4.62 qtl/acre** |
| **Gram (Chana)** | Pulse | Rabi | 1,029 – 1,137 kg/ha | **4.16 – 4.60 qtl/acre** |
| **Tur (Arhar)** | Pulse | Kharif | 748 – 872 kg/ha | **3.03 – 3.53 qtl/acre** |
| **Moong** | Pulse | Kharif | 500 – 650 kg/ha | **2.02 – 2.63 qtl/acre** |
| **Urad** | Pulse | Kharif | 431 – 600 kg/ha | **1.74 – 2.43 qtl/acre** |
| **Groundnut** | Oilseed | Kharif / Summer | 1,400 – 2,000 kg/ha | **5.67 – 8.09 qtl/acre** |
| **Sunflower** | Oilseed | Kharif / Rabi | 750 – 950 kg/ha | **3.04 – 3.84 qtl/acre** |
| **Cotton** | Fibre | Kharif | 400 – 550 kg/ha | **1.62 – 2.23 qtl/acre** |
| **Onion** | Vegetable | Kharif / Late Kh / Rabi | 18,000 – 24,000 kg/ha | **72.8 – 97.1 qtl/acre** |
| **Tomato** | Vegetable | Kharif / Rabi | 25,000 – 35,000 kg/ha | **101.2 – 141.6 qtl/acre** |
| **Sugarcane** | Commercial | Adsali / Pre-season / Suru | 90,000 – 115,000 kg/ha | **364 – 465 qtl/acre (36.4–46.5 T/acre)** |

---

## 2. 💰 Pillar 2: Official Cost of Cultivation (CoC)

### A. Data Source
- **CACP (Commission for Agricultural Costs and Prices)**: *Price Policy for Kharif Crops 2024–25*, *Price Policy for Rabi Crops 2024–25*, and *Price Policy for Sugarcane 2024–25* (Ministry of Agriculture & Farmers Welfare, GOI).
- **Horticulture (Category C)**: ICAR-Directorate of Onion & Garlic Research (DOGR), Rajgurunagar, Pune & National Horticulture Board (NHB) standard production norms.
- Master File: `cacp_costs_official_maharashtra.csv`

### B. Cost Definitions
* **$A_2$ (Paid-Out Cost)**: Actual out-of-pocket cash expenses incurred by the farmer (seeds, chemical fertilizers, pesticides, hired human labor, bullock/tractor hire, irrigation fees). **Used as the Hard Cash Budget Constraint.**
* **$A_2 + FL$ (Operational Cost)**: $A_2$ Cost + imputed value of unpaid family labor. **Used for Real Economic Profitability & Net Profit.**
* Conversion factor: $\text{Cost per Acre} = \frac{\text{Cost per Hectare}}{2.47105}$.

### C. Master CACP Cost Summary Table

```
Crop Name    Category       CACP A2 (₹/ha)   CACP A2+FL (₹/ha)   Cost A2 (₹/acre)   Cost A2+FL (₹/acre)
---------------------------------------------------------------------------------------------------------
Paddy        Cereal               ₹40,891             ₹56,128           ₹16,548              ₹22,714
Jowar        Cereal               ₹29,915             ₹43,588           ₹12,106              ₹17,640
Bajra        Cereal               ₹22,710             ₹34,142            ₹9,190              ₹13,817
Maize        Cereal               ₹32,600             ₹44,800           ₹13,193              ₹18,130
Wheat        Cereal               ₹40,976             ₹56,447           ₹16,583              ₹22,843
Tur (Arhar)  Pulse                ₹34,705             ₹47,688           ₹14,045              ₹19,299
Moong        Pulse                ₹25,836             ₹37,344           ₹10,455              ₹15,113
Urad         Pulse                ₹23,414             ₹34,801            ₹9,475              ₹14,083
Gram (Chana) Pulse                ₹26,537             ₹38,200           ₹10,739              ₹15,459
Groundnut    Oilseed              ₹46,750             ₹65,200           ₹18,919              ₹26,386
Sunflower    Oilseed              ₹13,266             ₹18,010            ₹5,369               ₹7,288
Soybean      Oilseed              ₹27,785             ₹39,531           ₹11,244              ₹15,998
Cotton       Fibre                ₹44,057             ₹61,422           ₹17,830              ₹24,857
Sugarcane    Commercial           ₹94,800            ₹138,500           ₹38,365              ₹56,050
Onion        Vegetable            ₹65,000             ₹85,000           ₹26,305              ₹34,398
Tomato       Vegetable            ₹78,000            ₹105,000           ₹31,566              ₹42,492
```

---

## 3. 📈 Pillar 3: 5-Year Agmarknet Mandi Prices & Arrivals

### A. Data Source
- **Agmarknet (Agricultural Marketing Information Network, Directorate of Marketing & Inspection - GOI)**:
- Portal: `agmarknet.gov.in`
- Target Geography: **Maharashtra $\rightarrow$ District: Pune (APMCs: Pune, Baramati, Junnar, Khed, Shirur, Manchar)**
- Date Range: **01-Jan-2021 to 31-Dec-2025 (Complete 5-Year Time Horizon)**
- Total Transactions Ingested: **14,786 daily mandi transactions**
- Master File: `agmarknet_mandi_prices_pune_2021_2025.csv`

### B. Summary Statistics for Price Forecaster

```
Standard_Crop  Total Transactions   5-Yr Mean Modal Price (₹/Qtl)   Min Modal Price   Max Modal Price   Total Volume (MT)
-------------------------------------------------------------------------------------------------------------------------
Bajra                       1,652                        ₹2,968            ₹1,200            ₹4,300          53,625.5
Cotton                         76                        ₹6,678              ₹120            ₹8,900             260.6
Gram                        1,560                        ₹6,279            ₹3,000           ₹11,000           6,759.8
Groundnut                     246                        ₹5,117            ₹2,075            ₹7,100             728.1
Jowar                       1,553                        ₹4,596            ₹1,313            ₹6,600          86,675.0
Maize                       1,203                        ₹2,254            ₹1,001            ₹4,200          70,532.6
Moong                       1,480                        ₹8,622            ₹5,000           ₹10,600           5,954.7
Onion                       1,792                        ₹1,660              ₹511           ₹10,280       3,320,474.7
Soybean                       497                        ₹5,099            ₹3,500            ₹8,800           9,267.3
Sunflower                     309                        ₹5,448            ₹3,600            ₹7,401           2,932.1
Tomato                      1,804                        ₹1,690              ₹400            ₹8,953         746,880.6
Tur                           246                        ₹5,862            ₹3,000            ₹9,700             493.5
Urad                          953                        ₹8,430            ₹4,000           ₹11,200           3,246.9
Wheat                       1,415                        ₹3,531            ₹1,450            ₹6,863          65,960.6
```

---

## 4. 🗓️ Pillar 3: Agronomic Sowing Windows & Duration

### A. Data Source
- **ICAR - Central Research Institute for Dryland Agriculture (CRIDA) Pune Agriculture Contingency Plan**
- **Mahatma Phule Krishi Vidyapeeth (MPKV), Rahuri / Pune Research Station Norms**
- Master File: `district_sowing_windows.csv`

### B. Sowing Schedule Highlights

* **Kharif Crops** (Sowing: June 15 – July 15 | Harvest: Sept – Nov):
  - Soybean (100 days), Bajra (85 days), Maize (105 days), Moong (70 days), Urad (75 days), Tur (170 days), Groundnut (115 days), Cotton (160 days), Kharif Onion (110 days), Kharif Tomato (120 days).
* **Rabi Crops** (Sowing: Sept 15 – Nov 30 | Harvest: Jan – April):
  - Rabi Jowar / Maldandi (120 days), Gram / Chana (105 days), Wheat (115 days), Rabi Maize (115 days), Rabi Onion (130 days), Rabi Tomato (130 days).
* **Sugarcane (Baramati Canal Command)**:
  - Adsali (July–Aug planting, 16–18 months), Pre-seasonal (Oct–Nov planting, 14–15 months), Suru (Jan–Feb planting, 12 months).

---

## 5. 🤖 Guidelines for the ML Engineer (`ml_experiments/`)

### Task 1: Train Yield Regressor (`train_yield_xgboost.py`)
- **Features to use**:
  - `Crop_Encoded`, `Season_Encoded`, `Soil_Type_Encoded` (Black Vertisol, Medium Loam, Sandy Loam).
  - `Rainfall_Kharif_mm` / `Rainfall_Rabi_mm`, `Mean_Temp_C`, `Irrigation_Available_Binary`.
  - `Historical_5yr_Mean_District_Yield`.
- **Target Variable**: `Yield_qtl_per_acre`.
- **Model**: `xgboost.XGBRegressor(n_estimators=150, max_depth=5, learning_rate=0.08)`.
- **Evaluation Metric**: RMSE & $R^2 > 0.85$.
- **Artifact**: Export model to `backend/app/models_ml/yield_model.joblib`.

### Task 2: Price Forecasting Engine (`price_forecaster.py`)
- Extract seasonal monthly modal price distributions for each crop from `agmarknet_mandi_prices_pune_2021_2025.csv`.
- When a crop is recommended with harvest in month $M$, forecast:
  - `Base_Price_Rs_Qtl` = Median Modal Price in Month $M$.
  - `Pessimistic_Price_Rs_Qtl` = 25th percentile price in Month $M$.
  - `Optimistic_Price_Rs_Qtl` = 75th percentile price in Month $M$.

### Task 3: Economic Profitability Formula (`economics_service.py`)
$$\text{Gross Revenue (₹/acre)} = \text{Predicted Yield (qtl/acre)} \times \text{Forecasted Price (₹/qtl)}$$
$$\text{Net Profit (₹/acre)} = \text{Gross Revenue (₹/acre)} - \text{Adjusted Cost } (A_2+FL)$$
$$\text{Net Profit per Day (₹/day)} = \frac{\text{Net Profit (₹/acre)}}{\text{Crop Duration (Days)}}$$
$$\text{ROI (\%)} = \left(\frac{\text{Net Profit}}{\text{Total Cost}}\right) \times 100$$
