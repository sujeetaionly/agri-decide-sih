# 🔄 AGRI-DECIDE — Improvements for Code Implementation

> **For AI coding agents.** These are the features to implement/improve in the codebase.
> Scope has been finalized — dropped features are listed at the bottom with rationale.

---

## FINAL FEATURE SCOPE

| # | Feature | Priority | Effort |
|:---|:---|:---|:---|
| 1 | GPS-adaptive language detection | 🔴 Must | Low |
| 2 | Hyper-local taluka/district data visibility | 🔴 Must | Low |
| 3 | Season awareness (auto-detect Kharif/Rabi/Zaid) | 🔴 Must | Low-Medium |
| 4 | Previous crop rotation intelligence | 🟡 Should | Medium |
| 5 | Candidate crop selection card | 🔴 Must | Medium |
| 6 | Explainable crop-climate reasoning | 🟡 Should | Medium |

---

## 1. 🌐 GPS-Based Dynamic Language Detection

### What to Change
The language picker currently shows all 5 languages statically. Change it to:
1. On app open, detect GPS → determine state/district via `/api/v1/geo/detect-language`
2. Filter the language picker to show only: **English + Hindi + local language(s)** for that region
3. For border districts with multiple languages, show all relevant ones

### Backend
- `/api/v1/geo/detect-language` already exists and returns language suggestions
- No backend changes needed

### Frontend
- `LanguageSelectionPage.tsx` — filter the displayed language options based on the GPS detection result
- If GPS is unavailable, fall back to showing all languages

### Language Mapping
| State/Region | Languages to Show |
|:---|:---|
| Maharashtra | English, Hindi, Marathi |
| Rajasthan | English, Hindi, Rajasthani |
| Gujarat | English, Hindi, Gujarati |
| Border districts (e.g., Belgaum) | English, Hindi, Kannada, Marathi |
| Border districts (e.g., Ganganagar) | English, Hindi, Punjabi, Rajasthani |

---

## 2. 📍 Hyper-Local Data Visibility in UI

### What to Change
The app already uses district-level data internally. Make this **visible** in the UI so farmers and evaluators can see the locality.

### Frontend Changes
- On the recommendation results screen, add a header showing:
  > **"📍 Data from: Pune District | Baramati APMC | Kharif 2025"**
- On the scorecard, show which mandi's prices are being used
- On the soil card, show "SoilGrids data for: [lat, long]" or "Your location: [taluka name]"

### Backend Changes
- Include `data_source_labels` in the `/crop/recommend` response:
  ```json
  {
    "data_sources": {
      "mandi": "Baramati APMC, Pune District",
      "soil": "SoilGrids [18.15°N, 74.58°E]",
      "sowing_windows": "ICAR-CRIDA Pune District Calendar",
      "yield_model": "ICRISAT Pune District 10yr Panel"
    }
  }
  ```

---

## 3. 📅 Season Awareness (Auto-Detect Kharif/Rabi/Zaid)

### What to Change
The app should automatically know which crop season it is based on the current date, and only show season-appropriate crops.

### Season Definitions
| Season | Months | Sowing Period | Crops |
|:---|:---|:---|:---|
| **Kharif** | June – October | June–July sowing | Soybean, Maize, Bajra, Cotton, Tur, Moong, Groundnut, Jowar, Sugarcane |
| **Rabi** | October – March | Oct–Nov sowing | Wheat, Gram (Chana), Mustard, Sunflower |
| **Zaid** | March – June | March–April sowing | Moong (summer), Watermelon, Cucumber |

### Backend Changes
- Add a utility function `get_current_season(date)` that returns `KHARIF`, `RABI`, or `ZAID`
- Filter candidate crops in `/crop/recommend` based on current season
- The `district_sowing_windows.csv` already has season data — use it
- Add `current_season` field to recommendation response

### Frontend Changes
- Show current season badge on home screen: **"🌧️ Kharif Season 2025"**
- Candidate crop selection card only shows crops for the current/upcoming season
- Sowing date picker should default to the current season's sowing window

---

## 4. 🔄 Previous Crop Rotation Intelligence

### What to Change
Use the `previous_season_crop` field (already captured) to intelligently adjust recommendations.

### Rotation Logic
| Previous Crop Category | Current Recommendation Adjustment |
|:---|:---|
| Cereal (Wheat, Maize, Bajra, Jowar) | **Bonus** to legumes (Moong, Gram, Tur, Groundnut) — nitrogen fixation improves soil |
| Legume (Moong, Gram, Tur, Groundnut) | **Bonus** to cereals — nitrogen-enriched soil boosts cereal yield |
| Same crop as previous season | **Penalty** — monoculture degrades soil, increases pest risk |
| Cotton (heavy feeder) | **Strong bonus** to legumes — soil needs nitrogen replenishment |

### Backend Changes
- In the recommendation scoring logic, add a `rotation_adjustment` factor:
  - Same crop → multiply match score by 0.85 (15% penalty)
  - Cereal→Legume or Legume→Cereal → multiply by 1.10 (10% bonus)
  - Cotton→Legume → multiply by 1.15 (15% bonus)
- Add rotation reasoning to `why_recommended` field:
  > *"पिछले सीजन में गेहूं (अनाज) उगाने के बाद, मूंग (दलहन) मिट्टी में नाइट्रोजन बढ़ाकर उपज सुधारती है"*
  > ("After growing wheat (cereal) last season, moong (legume) improves yield by adding nitrogen to soil")

### Frontend Changes
- Show a rotation badge on recommended crops:
  > **🔄 Rotation Benefit** — good follow-up to your previous wheat crop

---

## 5. 🌾 Candidate Crop Selection Card (NEW Wizard Card)

### What to Change
Add a new wizard card where the farmer selects which crops they're CONSIDERING planting.

### UX Design
- Appears after the soil/water cards, before the sowing date card
- Shows a grid of crops filtered by:
  1. Current season (Kharif/Rabi/Zaid)
  2. Crops historically grown in the farmer's district (from ICRISAT data)
- Farmer taps 2-4 crops they're considering
- 🎤 Voice input: farmer says crop names in Hindi/local language
- System compares selected candidates + may suggest 1 alternative they didn't pick

### Backend Changes
- `/crop/recommend` already accepts `candidate_crops` parameter — no change needed
- Add a new endpoint: `GET /api/v1/crop/local-crops?district=Pune&season=KHARIF`
  - Returns crops grown in that district for the current season
  - Source: ICRISAT district crop database filtered by season

### Frontend Changes
- New component: `CandidateCropCard.tsx`
- Grid layout with crop icons/images
- Multi-select (2-4 crops)
- Voice recognition integration (reuse existing speech.ts)
- Selected crops flow into the recommendation request

---

## 6. 🌱 Explainable Crop-Climate Reasoning

### What to Change
Improve the `why_recommended` field to reference the farmer's ACTUAL local conditions, not generic crop facts.

### Current State
Generic: *"Soybean is a high-yield oilseed crop suitable for Kharif season"*

### Target State
Specific: *"सोयाबीन आपकी काली मिट्टी में अच्छी नमी धारण करती है, और पुणे जिले की 800mm औसत बारिश इसके लिए पर्याप्त है। बोरवेल सिंचाई से फूल आने के समय पानी की कमी नहीं होगी।"*
("Soybean retains good moisture in your black soil, and Pune district's 800mm average rainfall is sufficient. Borewell irrigation ensures no water shortage during flowering.")

### Implementation
- Build a reasoning template system that slots in actual values:
  ```python
  reasons = []
  if farmer.soil_type == "BLACK":
      reasons.append(f"{crop.name_hi} को काली मिट्टी में अधिक नमी मिलती है")
  if farmer.water_source == "BOREWELL":
      reasons.append(f"बोरवेल सिंचाई से {crop.critical_stage_hi} में पानी उपलब्ध रहेगा")
  if crop.drought_tolerance > 0.7:
      reasons.append(f"यह फसल सूखा-प्रतिरोधी है — कम बारिश में भी {int(crop.drought_yield_pct)}% उपज संभव")
  if rotation_bonus:
      reasons.append(f"पिछली {prev_crop} के बाद यह फसल मिट्टी को पोषण देगी")
  ```

---

## ❌ DROPPED FEATURES (With Rationale)

### Government Crop Promotion Scheme Tags — DROPPED
**Why:** No reliable, structured, district-level dataset of "which crops are being promoted where right now." Changes every season. Can't back it up if asked. The system already includes ALL viable crops for the region, which implicitly supports diversification.

### Multi-Crop Land Allocation Optimizer — DROPPED
**Why:**
- Can't predict combined yield-cost-profit for crop pairs without compounding ML uncertainty
- UX for showing "50% soybean + 30% bajra + 20% moong" is confusing for smallholders on 2-acre plots
- Can't validate — no ground truth for "optimal splits"
- Previous-crop rotation intelligence achieves the diversification goal more simply and honestly
