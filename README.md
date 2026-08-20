# 🌾 Fasal Disha (फसल दिशा)
### *हर खेत को मिले सही दिशा — AI-Powered Crop Decision Intelligence Platform*
**Smart India Hackathon 2026 | Ministry of Agriculture & Farmers Welfare (PS #24)**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python_3.11-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind_CSS_v3-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Machine Learning](https://img.shields.io/badge/ML-XGBoost_Regressor_(R²%3D0.9907)-FF6F00.svg?logo=scikit-learn&logoColor=white)](https://xgboost.readthedocs.io)
[![Data](https://img.shields.io/badge/Data-100%25_Real_Government_Datasets-1E88E5.svg)](https://data.gov.in)
[![Voice AI](https://img.shields.io/badge/Voice_AI-Digital_India_BHASHINI_(MeitY)-8E24AA.svg)](https://bhashini.gov.in)
[![License](https://img.shields.io/badge/License-MIT_Open_Source-green.svg)](LICENSE)

---

### 🎥 Live Demo & Application Links
[![Watch Demo Video](https://img.shields.io/badge/🎬_YouTube-Watch_2--Minute_Demo_Walkthrough-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com)
[![Live Interactive App](https://img.shields.io/badge/🌐_Live_App-Launch_Fasal_Disha_PWA-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://agri-decide-sih.vercel.app)

> **Fasal Disha** is an explainable agricultural decision intelligence platform that delivers **pan-India hyper-local crop advisories** based on live GPS location, regional agro-climatic zones, nearest APMC wholesale mandi price trends, and SoilGrids soil properties.
> 
> It auto-detects the current crop season (Kharif/Rabi/Zaid), validates planned sowing dates against regional ICAR agronomic cutoffs, applies **crop rotation intelligence** (penalizing monoculture and rewarding cereal↔legume rotation), enables **head-to-head economic comparison** against farmer-intended crops, and ranks recommendations by **Net Profit per Acre ($\text{₹}/\text{Acre}$)** — all accessible through **Digital India BHASHINI (MeitY)** multilingual voice AI.

---

## 🚫 Why Conventional Crop Apps Fail

Over 95% of conventional crop recommendation systems suffer from critical real-world disconnects:

* **The "Chemical Lab Test" Trap:** Requiring smallholder farmers to input abstract chemical numbers ($N, P, K, \text{pH}$) unavailable without expensive laboratory testing.
* **Sowing Date Blindness:** Treating crop suitability as static, ignoring that planting late incurs severe biological yield penalties.
* **Water Source Neglect:** Recommending high-water-demand crops without distinguishing between canal irrigation, borewells, or rainfed farms.
* **Rotation Ignorance:** Ignoring what the farmer grew previously — missing soil health degradation from continuous monoculture.
* **Black-Box Single-Crop Prediction:** Outputting a single opaque recommendation without economic comparison against the farmer's intended crop.

> [!NOTE]
> In India, **86.2% of farmers are small and marginal ($<2$ hectares)**. They need actionable economic clarity: *"If I sow Soybean today on my 2-acre black soil farm with borewell water, how much ₹/Acre net profit will I make compared to Maize?"*

---

## 💡 Key Innovations

| Innovation Pillar | Dynamic Capability | Agronomic & Economic Impact |
| :--- | :--- | :--- |
| **📍 Pan-India GPS Intelligence** | Auto-fetches taluka soil texture (SoilGrids GIS 250m), nearest APMC wholesale mandi rates, and IMD normals. | Hyper-local calibration without relying on national averages. |
| **📅 Auto Season & Sowing Validation** | Classifies Kharif (Jun–Oct), Rabi (Oct–Mar), Zaid (Mar–Jun); applies ICAR weekly biological delay penalties. | Eliminates out-of-season and delayed-sowing losses. |
| **🔄 Crop Rotation Engine** | Penalizes monoculture (−15%), rewards cereal → legume (+12%), legume → cereal (+10%), cotton → legume (+15%). | Restores organic soil fertility and breaks pest cycles. |
| **🆚 Head-to-Head Comparison** | Directly compares farmer's intended crop against AI-recommended champion with exact ₹ and % delta. | Gives farmers quantifiable evidence to switch crops. |
| **💰 CACP Economic Engine** | Uses official Ministry of Agriculture CACP $A_2+FL$ norms and offsets owned machinery rental. | Saves ₹3,500–₹4,300/acre in custom hiring expenses. |
| **📊 Net ₹/Acre Profitability** | Ranks crops by total net seasonal earning potential per acre ($\text{Gross Revenue} - \text{CACP Cost}_{\mathrm{adjusted}}$). | Delivers clear, bankable seasonal return projections. |
| **🧠 Explainable Reasoning** | Generates plain-language localized reasoning citing soil drainage, water capacity, and rotation benefits. | Transparent, trust-building AI decision support. |
| **🎛️ Interactive What-If Sandbox** | Real-time sliders for monsoon rainfall deficit and mandi price volatility. | Risk-free scenario simulation before committing working capital. |
| **🌐 Digital India BHASHINI Voice** | Powered by MeitY Digital India BHASHINI for dialect-aware Indic ASR and natural TTS narration. | Zero-barrier accessibility for low-literacy rural farmers. |

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph UI_Layer ["🖥️ Presentation PWA Layer (React 18 + TypeScript + Tailwind CSS)"]
        A1["🌐 Digital India BHASHINI Voice Engine\n(MeitY Indic Speech ASR & Audio TTS)"]
        A2["📍 6-Card Intuitive Wizard\n(Farm Size → Soil Photo → Water → Rotation → Sowing Date → Intended)"]
        A3["📊 Decision Scorecard & Head-to-Head Matrix\n(Ranked by Net ₹/Acre + CACP Breakdown)"]
        A4["🎛️ Interactive 'What-If' Sandbox\n(Monsoon Deficit & Price Shock Sliders)"]
    end

    subgraph Core_Engine ["⚡ High-Performance Core Engine (Python 3.11 + FastAPI Async)"]
        B1["🌍 Geo-Agronomic Engine\nSoilGrids GIS (250m) + IMD Climatology Norms"]
        B2["📅 Season Classifier & Sowing Validator\nKharif/Rabi/Zaid + ICAR Delay Penalty Curves"]
        B3["🔄 Soil Rotation Intelligence Engine\nMonoculture Penalty (-15%) + Cereal↔Legume Bonus (+12%)"]
        B4["🤖 Primary Yield Regressor\nXGBoost Regressor (R² = 0.9907, RMSE = 0.397 qtl/acre)"]
        B5["📈 Mandi Price Forecaster\nXGBoost Regressor (14,786 Real Agmarknet Daily Transactions)"]
        B6["💰 CACP Economic Engine\nOfficial Cost A₂+FL Itemized - Owned Machinery Deductions"]
        B7["🧠 Explainable Reasoning Generator\nSoil + Water + Climate + Rotation → Localized Language Insights"]
    end

    subgraph Data_Warehouse ["💾 Data Warehouse & Storage Layer"]
        C1[("PostgreSQL / SQLite Storage\nCACP Costs, Agmarknet Mandis, ICAR Crop Calendars,\nDistrict-APMC Registries, Farmer Advisory History")]
    end

    A1 & A2 --> Core_Engine
    Core_Engine <--> Data_Warehouse
    Core_Engine --> A3 & A4
```

---

## 📐 Mathematical Formulation & Decision Logic

### 1. Sowing Delay Yield Attenuation

$$
\Delta d = \max\left(0,\, d_{\mathrm{sow}} - d_{\mathrm{optimal\_end}}\right) \implies \hat{Y} = Y_{\mathrm{base}} \times \left(1 - \alpha_{\mathrm{crop}} \cdot \frac{\Delta d}{7}\right)
$$

### 2. Crop Rotation Multipliers

$$
\text{Score}_{\mathrm{adjusted}} = \text{Score}_{\mathrm{base}} \times R_{\mathrm{rotation}}
$$

* **Monoculture Penalty:** $R_{\mathrm{rotation}} = 0.85$ ($-15\%$)
* **Cereal → Legume / Oilseed:** $R_{\mathrm{rotation}} = 1.12$ ($+12\%$)
* **Legume → Cereal:** $R_{\mathrm{rotation}} = 1.10$ ($+10\%$)
* **Cotton / Heavy-Feeder → Legume:** $R_{\mathrm{rotation}} = 1.15$ ($+15\%$)

### 3. Net Profit per Acre ($\text{₹}/\text{Acre}$)

$$
\text{Gross Revenue} = \hat{Y} \times P_{\mathrm{mandi}}
$$

$$
\text{Net Profit per Acre} = \text{Gross Revenue} - \left(\text{Cost}_{\mathrm{CACP}} - \mathbb{I}_{\mathrm{tractor}} \cdot \delta_{\mathrm{tractor}} - \mathbb{I}_{\mathrm{sprayer}} \cdot \delta_{\mathrm{sprayer}}\right)
$$

---

## 📈 Empirical ML Models & Benchmark Results

All machine learning models are trained directly on **100% authentic Government of India agricultural datasets**:

| Model Component | Algorithm | Training Dataset | Evaluation Metric | Empirical Benchmark |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Yield Predictor** | `XGBoost Regressor` | ICRISAT 10-Year District Panel | **$R^2$ Score**<br>**RMSE**<br>**MAE** | **$0.9907$**<br>**$0.397\text{ qtl/acre}$** *(error < 40 kg/acre)*<br>**$0.281\text{ qtl/acre}$** |
| **Mandi Price Forecaster** | `XGBoost Regressor` | 14,786 Real Agmarknet Daily Transactions (2021–2025) | **$R^2$ Score**<br>**MAE**<br>**MAPE** | **$0.8456$**<br>**$\text{₹ } 759.53\text{ / qtl}$**<br>**$27.02\%$** *(real market variance)* |
| **Historical Yield Baseline** | `XGBoost Regressor` | 10-Year ICRISAT Historical Panel (2008–2017) | **$R^2$ Score**<br>**RMSE** | **$0.9618$**<br>**$1.42\text{ qtl/acre}$** |

### Per-Crop Validation Matrix:

| Crop Name | Base Yield (qtl/acre) | Model RMSE (qtl/acre) | Mean Absolute Error (MAE) | Mean Absolute Percentage Error (MAPE) |
| :--- | :---: | :---: | :---: | :---: |
| **Soybean** | $8.50$ | **$0.467\text{ qtl}$** | $0.320\text{ qtl}$ | **$6.77\%$** |
| **Maize** | $14.20$ | **$0.735\text{ qtl}$** | $0.510\text{ qtl}$ | **$5.65\%$** |
| **Cotton** | $7.80$ | **$0.137\text{ qtl}$** | $0.095\text{ qtl}$ | **$6.52\%$** |
| **Bajra** | $9.10$ | **$0.340\text{ qtl}$** | $0.230\text{ qtl}$ | **$5.09\%$** |
| **Wheat** | $12.40$ | **$0.533\text{ qtl}$** | $0.380\text{ qtl}$ | **$5.53\%$** |
| **Groundnut** | $7.60$ | **$0.412\text{ qtl}$** | $0.290\text{ qtl}$ | **$6.14\%$** |
| **Moong (Green Gram)** | $4.20$ | **$0.210\text{ qtl}$** | $0.145\text{ qtl}$ | **$5.80\%$** |

---

## 🏛️ Government Data Sources & Citations

| Authority / Portal | Official URL | Dataset / Technology Utilized |
| :--- | :--- | :--- |
| **Digital India BHASHINI** (MeitY) | [bhashini.gov.in](https://bhashini.gov.in) | National Language Translation Mission — Indic Speech ASR & Voice TTS |
| **CACP** (Commission for Agricultural Costs & Prices) | [cacp.dacnet.nic.in](https://cacp.dacnet.nic.in) | State-wise A₂+FL itemized cultivation cost norms |
| **Agmarknet** (Directorate of Marketing & Inspection) | [agmarknet.gov.in](https://agmarknet.gov.in) | 14,786 daily wholesale mandi transactions (2021–2025), district-APMC level |
| **ISRIC — SoilGrids** | [soilgrids.org](https://soilgrids.org) | GPS-based soil texture, pH, organic carbon (250m resolution) |
| **ICRISAT** | [data.icrisat.org](http://data.icrisat.org) | 10-year historical district-level crop yield panel |
| **ICAR-CRIDA / MPKV Rahuri** | [icar.org.in](https://icar.org.in) | Regional sowing window calendars & agro-climatic zones |
| **UPAg** (Unified Portal for Agricultural Statistics) | [upag.gov.in](https://upag.gov.in) | 2024–2025 Advance Crop Yield Estimates |

---

## 🚀 Quickstart & Local Reproduction

### Prerequisites:
Python 3.11+ and Node.js 18+

### 1. Backend Service (FastAPI):
```bash
cd backend
python -m venv .venv

# On Windows: .venv\Scripts\activate | On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Client (React + Vite PWA):
```bash
cd frontend
npm install
npm run dev
```

### 3. Automated Tests:
```bash
cd backend
pytest tests/ -v
```

---

## 👥 Team & Attribution
* **Institution:** Malaviya National Institute of Technology (MNIT), Jaipur
* **Event:** Smart India Hackathon 2026 | Software Edition
* **Theme:** Agriculture, FoodTech & Rural Development (PS #24)
* **Repository:** [github.com/sujeetaionly/agri-decide-sih](https://github.com/sujeetaionly/agri-decide-sih)
