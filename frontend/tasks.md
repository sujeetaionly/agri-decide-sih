# Frontend Implementation Tasks: Agri-Decide (Krishi-Wise AI)

## Phase 1: Translations, Data Models & Utilities
- [ ] **1.1** Create comprehensive Pure Indic translation dictionaries (`frontend/src/data/translations.ts`) for Hindi (`hi`), Marathi (`mr`), Gujarati (`gu`), and English (`en`) with zero mixed English text.
- [ ] **1.2** Create real photographic soil assets and metadata (`frontend/src/data/soilTypesData.ts`) with high-res WebP/SVG fallbacks for Black, Loam, Red, Sandy, and Clay soils.
- [ ] **1.3** Implement tactile haptics (`triggerHaptic`) and history state navigation helper in `frontend/src/lib/utils.ts`.

## Phase 2: Onboarding & Authentication Flow
- [ ] **2.1** Build Android-style Native GPS Permission Modal (`frontend/src/components/common/AndroidGpsPermissionModal.tsx`).
- [ ] **2.2** Refactor Language Selection Page (`frontend/src/pages/LanguageSelectionPage.tsx`) with auto-detected regional suggestions and above-the-fold CTA.
- [ ] **2.3** Build Language Confirmation Screen (`frontend/src/pages/LanguageConfirmPage.tsx`) in 100% selected native language.
- [ ] **2.4** Build Interactive Audio Guide Screen (`frontend/src/pages/AudioGuidePage.tsx`) with 1-2 line speaker tutorial and test button.
- [ ] **2.5** Refactor Login Page (`frontend/src/pages/LoginPage.tsx`) with pure single-language text, OTP, and guest bypass.

## Phase 3: Header, Home Screen & Persistent Navigation
- [ ] **3.1** Clean Top App Bar (`frontend/src/components/home/HomeTopAppBar.tsx`) — Single network status bar (`● नेटवर्क स्थिति: कनेक्टेड`), remove duplicate globe and duplicate connected pills.
- [ ] **3.2** Minimalist Home Screen (`frontend/src/pages/HomePage.tsx`) — Only 2 cards: Primary Recommendation CTA + Recent Analysis Card.
- [ ] **3.3** Persistent Bottom Navigation Bar (`frontend/src/components/home/HomeBottomNav.tsx`) visible across all screens (`Home`, `Wizard`, `My Crops`, `Mandi`).

## Phase 4: Single-Question Card Wizard
- [ ] **4.1** Restructure `DecisionWizardPage.tsx` into a 1-question-per-screen card container with animated transitions, hardware back gesture, and bottom spacer (`pb-36`).
- [ ] **4.2** Build Card 1: Land Area & Unit selection (`FarmSizeCard.tsx`).
- [ ] **4.3** Build Card 2: Soil Type with Real Photographic Images (`SoilTypeCard.tsx`).
- [ ] **4.4** Build Card 3: Water Availability & Irrigation Source (`WaterSourceCard.tsx`).
- [ ] **4.5** Build Card 4: Previous Season Crop Selection (`PreviousCropCard.tsx`).
- [ ] **4.6** Build Card 5: Sowing Season & Planned Date (`SowingSeasonCard.tsx`).

## Phase 5: Recommendation Results, Cost Transparency & What-If
- [ ] **5.1** Refactor Recommendations Step (`RecommendationsStep.tsx`) to display:
  - Estimated Cultivation Cost (लागत)
  - Expected Yield (पैदावार)
  - Net Profit (शुद्ध लाभ)
  - Itemized CACP Cost breakdown accordion (Seeds, Fert, Labor, Machinery, Water)
  - 4-Crop comparison tiles with local offline image fallbacks.
- [ ] **5.2** Update What-If Simulator Step (`WhatIfStep.tsx`) with single-button sticky bar and clean Indic sliders.
- [ ] **5.3** Update 120-Day Action Plan (`MilestoneCalendarStep.tsx`) with pure Hindi/Marathi task items, audio triggers, and 1-Tap WhatsApp share.

## Phase 6: Printable Krishi Advisory Slip & "मेरी फसलें" (My Crops)
- [ ] **6.1** Build Printable Krishi Advisory Slip modal & download generator (`frontend/src/components/wizard/PrintableAdvisorySlip.tsx`).
- [ ] **6.2** Build "मेरी फसलें" (My Crops) Historical Analysis Screen (`frontend/src/pages/MyCropsPage.tsx`) connecting to backend `/api/v1/farmer/history` and local storage.
- [ ] **6.3** Add PWA Manifest (`frontend/public/manifest.json`) and Android Safe Area viewport insets in `frontend/index.html`.

## Phase 7: Verification & Build
- [ ] **7.1** Run TypeScript compiler and Vite build (`npm run build`).
- [ ] **7.2** Launch Vite dev server and test all flows end-to-end via Puppeteer Android emulation.
