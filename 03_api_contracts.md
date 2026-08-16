# 🔌 03. Strict API Contracts & Structural Action Matrix
### System: **AGRI-DECIDE — AI Crop Recommendation Engine (PS #24)**

---

## 1. Structural Action Allowlist (`PERMITTED_ACTIONS`)

This list defines all valid interactive elements in the application. Every interactive button/action must bind strictly to these IDs:

```javascript
// src/constants/PERMITTED_ACTIONS.js
export const PERMITTED_ACTIONS = {
  // Screen 1: First-Time Language & Location
  "btn-select-language-en": {
    label: "English",
    endpoint: null, // Client-side language preference (sets 'en')
    description: "Sets application language to English."
  },
  "btn-select-language-hi": {
    label: "हिंदी (Hindi)",
    endpoint: null, // Client-side language preference (sets 'hi')
    description: "Sets application language to Hindi."
  },
  "btn-detect-gps": {
    label: "📍 Use My GPS Location",
    endpoint: "POST /api/v1/farm/assess-soil-weather",
    description: "Fetches district baseline soil and climate by coordinates."
  },
  "select-district-taluka": {
    label: "Select District & Taluka",
    endpoint: "GET /api/v1/geo/locations",
    description: "Populates state/district/taluka dropdowns."
  },

  // Screen 2: Farm Profile Submission
  "btn-submit-farm-profile": {
    label: "Save Farm Details & Continue",
    endpoint: "POST /api/v1/farmer/profile",
    description: "Saves land size, soil type, water source, budget, and past crop."
  },

  // Screen 3: Sowing Date, Crop Search/Dropdown & Voice
  "input-sowing-date": {
    label: "Planned Sowing Date",
    endpoint: null,
    description: "Captures planned sowing date from date picker."
  },
  "search-candidate-crops": {
    label: "Search & Select Crops",
    endpoint: "GET /api/v1/crop/search",
    description: "Filters regional crops by name in search bar / dropdown."
  },
  "btn-voice-input-crops": {
    label: "🎤 बोलकर फसलें बताएं (Speak Crop Names)",
    endpoint: null, // Web Speech API SpeechRecognition -> populates crop chips
    description: "Captures spoken crop names in Hindi/English and populates candidate crop selection."
  },
  "btn-run-recommendation": {
    label: "🌾 Run AI Crop Recommendation",
    endpoint: "POST /api/v1/crop/recommend",
    description: "Triggers the ML yield, cost, and suitability engine to rank crops."
  },

  // Screen 4: Recommendation & Comparison
  "btn-play-voice-advisory": {
    label: "🔊 सुनें / Listen to Advisory",
    endpoint: null, // Browser-native SpeechSynthesis in selected language
    description: "Plays audio summary of the recommendation."
  },
  "btn-view-comparison-table": {
    label: "📊 View Side-by-Side Comparison",
    endpoint: null, // UI tab toggle
    description: "Toggles between Top Recommendation Card and 4-Crop Matrix."
  },

  // Screen 5: What-If Sensitivity Simulator
  "slider-what-if-simulate": {
    label: "🎛️ Run What-If Simulation",
    endpoint: "POST /api/v1/crop/what-if-simulate",
    description: "Recalculates yield, profit, and rankings when sliders change."
  },

  // Screen 6: Crop Milestone Calendar
  "btn-view-crop-calendar": {
    label: "📅 View 120-Day Action Timeline",
    endpoint: "GET /api/v1/crop/crop-calendar",
    description: "Fetches milestone dates for the recommended crop."
  }
};
```

---

## 2. Detailed REST API Endpoints & Schemas

---

### Endpoint 1: Assess Soil & Weather by Geo-Location
* **Method & URL:** `POST /api/v1/farm/assess-soil-weather`

#### Request JSON:
```json
{
  "latitude": 26.9124,
  "longitude": 75.7873,
  "district": "Jaipur",
  "taluka": "Sanganer"
}
```

#### Response JSON (200 OK):
```json
{
  "status": "success",
  "data": {
    "district": "Jaipur",
    "taluka": "Sanganer",
    "soil_summary": {
      "texture_class": "Sandy Loam / बलुई दोमट",
      "ph": 7.8,
      "organic_carbon_pct": 0.42
    },
    "climate_summary": {
      "annual_rainfall_mm": 520.0,
      "current_season": "Kharif 2027",
      "optimal_sowing_window": "25 June - 10 July"
    }
  }
}
```

---

### Endpoint 2: Register Farmer & Farm Profile
* **Method & URL:** `POST /api/v1/farmer/profile`

#### Request JSON:
```json
{
  "farmer_name": "Ramesh Choudhary",
  "mobile": "9876543210",
  "language_preference": "hi",
  "district": "Jaipur",
  "taluka": "Sanganer",
  "total_land_acres": 5.0,
  "soil_type": "LOAM",
  "water_source": "BOREWELL",
  "water_capacity_level": "MEDIUM",
  "working_capital_inr": 80000.0,
  "previous_season_crop": "WHEAT",
  "owns_tractor": true,
  "owns_sprayer": true
}
```

#### Response JSON (201 Created):
```json
{
  "status": "success",
  "farmer_id": "FARMER-8401",
  "message": "Farm profile created successfully."
}
```

---

### Endpoint 3: Run AI Crop Recommendation & Comparison
* **Method & URL:** `POST /api/v1/crop/recommend`

#### Request JSON:
```json
{
  "farmer_id": "FARMER-8401",
  "planned_sowing_date": "2027-06-25",
  "candidate_crops": ["BAJRA", "MOONG", "GROUNDNUT", "SOYBEAN"]
}
```

#### Response JSON (200 OK):
```json
{
  "status": "success",
  "sowing_window": {
    "status": "OPTIMAL",
    "badge_text": "अनुकूल बुवाई समय (25 June - 10 July)",
    "badge_color": "green"
  },
  "top_recommendation": {
    "crop_id": "BAJRA",
    "crop_name_en": "Bajra (Pearl Millet - HHB 67)",
    "crop_name_hi": "बाजरा (एचएचबी 67)",
    "suitability_pct": 94.0,
    "duration_days": 85,
    "expected_yield_qtl_per_acre": 12.0,
    "yield_range_qtl": "11.0 - 13.5",
    "total_cost_inr_per_acre": 14500.0,
    "forecasted_mandi_price_inr_per_qtl": 2500.0,
    "expected_net_profit_per_acre_inr": 15500.0,
    "net_profit_per_day_inr": 182.0,
    "price_volatility": "Low (MSP Supported)",
    "why_recommended": [
      "बलुई दोमट मिट्टी और कम पानी की स्थिति में 94% सर्वोत्तम उत्पादन।",
      "85 दिनों की कम अवधि - सूखे के जोखिम से सुरक्षित।",
      "कम लागत (₹14,500/एकड़) आपके बजट में पूरी तरह अनुकूल।",
      "गेहूं के बाद दलहन/अनाज फसल चक्र के लिए उपयुक्त।"
    ]
  },
  "comparison_matrix": [
    {
      "crop_id": "BAJRA",
      "crop_name_en": "Bajra",
      "crop_name_hi": "बाजरा",
      "suitability_pct": 94.0,
      "sowing_window_status": "Optimal",
      "total_cost_inr_per_acre": 14500.0,
      "expected_yield_qtl_per_acre": 12.0,
      "forecasted_mandi_price_inr_per_qtl": 2500.0,
      "expected_net_profit_per_acre_inr": 15500.0,
      "duration_days": 85,
      "net_profit_per_day_inr": 182.0
    },
    {
      "crop_id": "MOONG",
      "crop_name_en": "Moong (Green Gram)",
      "crop_name_hi": "मूंग",
      "suitability_pct": 90.0,
      "sowing_window_status": "Optimal",
      "total_cost_inr_per_acre": 16000.0,
      "expected_yield_qtl_per_acre": 5.5,
      "forecasted_mandi_price_inr_per_qtl": 7500.0,
      "expected_net_profit_per_acre_inr": 25250.0,
      "duration_days": 70,
      "net_profit_per_day_inr": 360.0
    },
    {
      "crop_id": "GROUNDNUT",
      "crop_name_en": "Groundnut",
      "crop_name_hi": "मूंगफली",
      "suitability_pct": 82.0,
      "sowing_window_status": "Optimal",
      "total_cost_inr_per_acre": 28000.0,
      "expected_yield_qtl_per_acre": 9.0,
      "forecasted_mandi_price_inr_per_qtl": 5800.0,
      "expected_net_profit_per_acre_inr": 24200.0,
      "duration_days": 120,
      "net_profit_per_day_inr": 201.0
    },
    {
      "crop_id": "SOYBEAN",
      "crop_name_en": "Soybean",
      "crop_name_hi": "सोयाबीन",
      "suitability_pct": 74.0,
      "sowing_window_status": "Moderate",
      "total_cost_inr_per_acre": 22000.0,
      "expected_yield_qtl_per_acre": 7.5,
      "forecasted_mandi_price_inr_per_qtl": 4600.0,
      "expected_net_profit_per_acre_inr": 12500.0,
      "duration_days": 95,
      "net_profit_per_day_inr": 131.0
    }
  ]
}
```

---

### Endpoint 4: "What-If" Climate & Market Sensitivity Simulator
* **Method & URL:** `POST /api/v1/crop/what-if-simulate`

#### Request JSON:
```json
{
  "farmer_id": "FARMER-8401",
  "sowing_delay_days": 15,
  "rainfall_deficit_pct": -25.0,
  "mandi_price_shock_pct": -10.0
}
```

#### Response JSON (200 OK):
```json
{
  "status": "success",
  "simulation_results": {
    "alert_message": "15 दिन की देरी और 25% कम बारिश में मूंग और बाजरा सबसे सुरक्षित फसलें हैं।",
    "updated_top_crop": "MOONG",
    "updated_profit_inr_per_acre": 21800.0,
    "resilience_rating": "उच्च प्रतिरोधक क्षमता (High Resilience)"
  }
}
```

---

### Endpoint 5: Fetch 120-Day Crop Milestone Calendar
* **Method & URL:** `GET /api/v1/crop/crop-calendar?crop_id=BAJRA&sowing_date=2027-06-25`

#### Response JSON (200 OK):
```json
{
  "status": "success",
  "crop_name": "Bajra",
  "sowing_date": "2027-06-25",
  "milestones": [
    {
      "day_offset": 0,
      "date": "2027-06-25",
      "title": "Sowing & Seed Treatment",
      "action_hi": "बीज उपचार व बुवाई"
    },
    {
      "day_offset": 20,
      "date": "2027-07-15",
      "title": "First Thinning & Weeding",
      "action_hi": "पहली निराई व छंटाई"
    },
    {
      "day_offset": 45,
      "date": "2027-08-09",
      "title": "Earing / Flowering Stage",
      "action_hi": "सिट्टे बनने की अवस्था - सिंचाई प्रबंधन"
    },
    {
      "day_offset": 85,
      "date": "2027-09-18",
      "title": "Harvest Stage",
      "action_hi": "फसल कटाई का समय"
    }
  ]
}
```
