# PPT1.md — Content & Change Spec for index.html

> **For:** Another AI to edit `C:\Users\Sandeep Bade\Downloads\index.html`
> **Core principle:** Lead with REAL farmer pain. Prove with NUMBERS. Cut everything else.

---

## THE ACTUAL ISSUES WE NEED TO HAMMER

Faculty scanning 80 PDFs will see dozens of "AI crop recommendation" pitches. What makes ours different is that we address **real, specific, documented farmer problems** — not vague "helps farmers." Every slide should make the evaluator think: *"These people actually understand the problem."*

### The 4 real issues our app solves (anchor ALL content around these):

| Real Issue | Why It Matters | Our Specific Solution | Proof It Works |
|:---|:---|:---|:---|
| **86.2% farmers have no soil health card** | Can't get crop advice without lab test → 3-4 week wait → miss sowing window | GPS auto-fetches ISRIC SoilGrids 250m data (pH, clay%, organic carbon) — zero lab needed | SoilGrids data matches 100% to geo-coordinates |
| **Farmers don't know their true profit** | They chase gross yield, not net profit. A high-yield crop with high input cost = debt trap | CACP A₂+FL itemized cost model shows true ₹/Acre net profit, deducts owned machinery | 100% CACP fidelity, Wardha case: ₹14,352 → ₹24,722 |
| **Monoculture destroys soil** | Same crop every season → nitrogen depletion → rising fertilizer costs → declining yields | Rotation engine: −15% monoculture penalty, +12% cereal→legume, +15% cotton→legume | ICAR/ICRISAT validated rotation multipliers |
| **Late sowing = invisible yield loss** | Farmer delays 2 weeks → loses ~7% yield without realizing | Sowing delay decay model: −0.5%/day calibrated from ICAR-CRIDA field trials | 100% ICAR fidelity on delay curves |

**Every slide should tie back to at least one of these.** If a bullet point doesn't connect to a real farmer problem, cut it.

---

## GLOBAL CHANGES

### G1. Text size floor
Nothing below 11px. Key changes:
- `10.8px` → `13.5px`, `11px` → `13px`, `9px` → `11px`, `9.5px` → `11.5px`
- SVG text inside architecture: route labels `8px` → `10px`, node titles `12.5px` → `14px`

### G2. Team name: `Almost AC` → `Fasal Disha` everywhere (ovals, title)

### G3. Don't touch: theme toggle JS, zoom/nav, print CSS, overall layout system

---

## SLIDE 1: TITLE PAGE
- Title: `ALMOST AC` → `FASAL-DISHA (फसल-दिशा)`
- Team Name value: `Almost AC` → `Fasal Disha (AGRI-DECIDE)`
- Everything else stays

---

## SLIDE 2: PROPOSED SOLUTION — Content refocus

### What the current version does wrong
It lists 13 features across 3 boxes. Faculty can't find the POINT. The content reads like a feature dump, not a problem-solution narrative.

### What it should do instead
**Lead with the pain. Then show the fix.** The index.html already has the right PROBLEM→SOLUTION badge format — we just need to rewrite the content to focus on the 4 real issues.

### S2.1: Left column — 2 boxes instead of 3

**BOX 1: "IDEA / PROPOSED SOLUTION"**

Keep the green left-border description block but rewrite it:
```
"86.2% of Indian smallholders operate without soil health cards and 
choose crops by guesswork. Fasal-Disha replaces this with GPS-based 
soil analysis, government CACP cost data, and real mandi prices — 
delivering true Net Profit (₹/Acre) forecasts in under 90 seconds, 
entirely via voice in the farmer's own language."
```

Then 4 bullets, each tied to a REAL ISSUE:
```
❖ Zero-Lab Soil Intelligence: GPS auto-fetches SoilGrids 250m satellite data 
  (pH, clay%, organic carbon) — eliminates the 3-4 week lab test barrier that 
  blocks 86.2% of farmers from getting any crop advice.

❖ True Net Profit, Not Gross Yield: Uses official CACP A₂+FL cost norms to 
  show real pocket profit per acre — deducts tractor (−₹3,500), sprayer (−₹800), 
  pump (−₹600) if farmer owns them. Prevents the debt trap of high-yield but 
  high-cost crops.

❖ Crop Rotation Intelligence: Penalizes monoculture (−15% yield adjustment) 
  and rewards legume rotation (+12% nitrogen fixation bonus) — directly 
  addressing soil degradation from repeated same-crop planting.

❖ Sowing Window Protection: ICAR-calibrated delay decay (−0.5%/day) warns 
  farmers about invisible yield loss from late planting and auto-suggests 
  short-duration contingency crops.
```

**BOX 2: "WHAT MAKES IT UNIQUE" (merge current Problem Resolution + UVP)**
```
❖ Head-to-Head Crop Comparison: Farmer picks the crop they're thinking 
  of growing → system shows exact ₹/Acre profit difference vs AI pick. 
  No black box — farmer sees WHY in their own language.

❖ "What-If" Risk Sandbox: Before spending money on seeds, farmer can 
  stress-test with sliders: "What if rainfall drops 35%?" or "What if 
  mandi prices crash 25%?" — live profit recalculation.

❖ BHASHINI Voice Narration: MeitY Digital India speech synthesis for 
  full audio playback — a farmer who can't read can still get complete 
  crop advice via voice.

❖ Printable Offline Advisory: 1-Click A4 PDF slip with complete crop 
  plan — printable at any CSC/Kisan Kendra. WhatsApp sharing built in. 
  Works even without internet after generation.
```

**WHY this is better:** Every bullet now starts with a PROBLEM or a USER NEED, not a feature name. "Zero-Lab Soil Intelligence" explains WHY (86.2% barrier). "True Net Profit" explains WHY (debt trap). Faculty reads the WHY, not just the WHAT.

### S2.2: Right column SVG user flow
- Change `7-QUESTION FARM PROFILE` → `5-CARD FARM PROFILE`
- Remove Q6 (Equipment) and Q7 (Intended Crops) — keep Q1-Q5 only
- Keep everything else in the SVG

### S2.3: Tagline under title
Shorten to: `हर खेत को मिले सही दिशा — AI-Powered Net Profit (₹/Acre) Crop Decision Platform`

---

## SLIDE 3: TECHNICAL APPROACH — Swap out GitHub card for proof

### What's currently great (DON'T TOUCH):
- SVG architecture diagram on right — best visual in the entire deck
- Card 1: Tech stack with tech pills — looks professional
- Card 2: ML models list — good content

### S3.1: Fix Bhashini accuracy
In Card 1, Indic Voice AI tier:
- `MeitY Indic Speech ASR / TTS` → `MeitY Indic Speech TTS Engine`
- Remove "ASR" claim. Our speech recognition is browser Web Speech API, not Bhashini.

### S3.2: Replace Card 3 (GitHub links) with "ACCURACY BENCHMARKS"

Card 3 currently shows GitHub + YouTube links. This duplicates Slide 6 and wastes the most valuable real estate on the Technical Approach slide.

**Replace with a card that PROVES the tech works:**

```
Title: "GROUND-TRUTH ACCURACY BENCHMARKS :"
(Same card styling — border-top: 4px solid theme-primary)

Bullets:
• Yield Prediction: XGBoost vs MoA DES Census actual — 95.9% district yield match
• Price Forecasting: Model vs Agmarknet APMC actuals — 98.6% mandi rate accuracy
• Cost Calculation: 100% CACP A₂+FL fidelity (with verified tractor adjustment −₹3,200)
• Sowing Decay: −5.0%/week matches ICAR-CRIDA field trials — 100% ICAR calibration
• Real Proof: Wardha farmer, Cotton→Soybean = +₹10,370/acre (+72.3% net profit gain)
```

**Why this matters more than GitHub links here:** Faculty evaluating "Technical Approach" wants to know: *does the tech actually work?* Accuracy numbers answer that. GitHub links belong on Slide 6.

### S3.3: SVG architecture text sizes
Increase all SVG text by ~1.5-2px (node titles, descriptions, route labels, tier headers). Apply the global minimum of 10px for the smallest labels.

---

## SLIDE 4: FEASIBILITY AND VIABILITY — Nuclear restructure

### What's currently wrong
6 sections (Feasibility, Viability, Challenges, Use Cases, Business Potential, Supporting Facts) fighting for attention. The SIH template asks for 3 things: feasibility analysis, challenges, mitigation strategies. The current slide answers 6 questions nobody asked.

### S4.1: New left column (55%) — 2 focused sections

**Section 1: "Feasibility & Viability" (merge current 2 sections into 1)**
```
⚖️ Feasibility & Viability :

1. Technical Readiness: Production stack deployed — FastAPI + React 18 + 
   XGBoost (R²=0.9907) + BHASHINI TTS. 16 REST endpoints tested.

2. Zero-Lab Removes #1 Barrier: 86.2% of Indian farmers lack soil lab 
   access. GPS-based SoilGrids profiling eliminates the wait entirely.

3. Ultra-Low Cost: <₹0.02 per query. 100% open-source. Offline SQLite 
   fallback for zero-connectivity areas.

4. Deployment Ready: Open REST APIs integrable with PM-Kisan, KVK 
   extension services, and AgriStack national DPI.
```

**Section 2: "Challenges & Solutions" — 3 rows only (keep red→green grid)**
```
🌧️ Extreme Weather Uncertainty    →    🎛️ What-If Sandbox: stress-test 
                                         rainfall (−35%) and price shock 
                                         (−25%) before investing in seeds

📵 Rural 2G/3G Connectivity       →    📄 Offline PWA + 1-Click printable 
                                         A4 advisory slip for field use

👨‍🌾 Low Literacy & Language       →    🎤 BHASHINI voice narration in 
                                         regional language — zero reading
```

### S4.2: New right column (45%) — GROUND TRUTH VALIDATION TABLE

**This is the single most important addition to the entire deck.**

Build as HTML table with existing `.sih-table` class:

```
Header row: What We Predict | Govt Source | Match %

Row 1: District Yield (qtl/ac) | MoA DES Census | 95.9%
Row 2: Cultivation Cost (₹/ac) | CACP A₂+FL | 100% Fidelity
Row 3: Mandi Wholesale Rate | Agmarknet APMC | 98.6%
Row 4: Sowing Delay Loss | ICAR-CRIDA Trials | 100% ICAR
Row 5: Soil Texture | SoilGrids 250m GIS | 100% Geofenced
```

"Match" column cells use `.adv-cell` class (green background, bold).

**Below the table — Wardha proof callout:**
```
★ Real Field Proof ★
Wardha (Maharashtra) • 3.5-acre clay loam • Borewell • Owned tractor
Cotton (repeat monoculture) → Soybean (AI recommendation)
₹14,352/ac → ₹24,722/ac = +₹10,370/ac (+72.3% profit gain)
```

### S4.3: DELETE these sections entirely
- ❌ Use Cases (4 bullets) — not what Slide 4 asks for
- ❌ Business Potential (4 bullets) — this isn't a pitch deck
- ❌ Supporting Facts box — replaced by the validation table which is stronger

**Why this restructure wins:** Current Slide 4 tries to answer every possible question. The new version answers exactly what the SIH template asks: *Is it feasible? What are the risks? How do you mitigate them?* And then PROVES it with government-validated accuracy numbers. No other team will have this.

---

## SLIDE 5: IMPACT AND BENEFITS — Minor polish only

### What's great (don't touch):
- Before/After red/green comparison (right column) — excellent
- 3 metric badges (120M+, +72.3%, 100%) — scannable
- Impact bullets — well-written

### S5.1: Tighten 2 bullets
```
Before: "Equips India's most vulnerable demographic with institutional-grade 
         agro-economic intelligence."
After:  "Equips 120M+ smallholders (<2 Ha) with institutional-grade ₹/Acre 
         crop economics — zero lab tests, zero fees."

Before: "Not just 'grow wheat' — complete economics, risk simulation, 
         120-day milestone calendar, and printable advisory slip."  
After:  "Not just 'grow wheat' — full economics + risk simulator + 
         120-day milestone calendar + printable advisory slip."
```

### S5.2: Third metric badge label
`100% Real Govt Data` → `100% Govt Data Fidelity`

### S5.3: Everything else stays. Before/after comparison is perfect.

---

## SLIDE 6: RESEARCH AND REFERENCES — 2 small additions

### S6.1: Add IMD row to data sources table
After ICAR-CRIDA row:
```
| IMD | India Meteorological Dept (imdpune.gov.in) | Gridded rainfall & 
monsoon deviation records for drought sensitivity modeling |
```

### S6.2: Add ICRISAT research reference
Below the XGBoost Chen & Guestrin line:
```
📚 ICRISAT: "Biological Nitrogen Fixation and Cropping Systems in Semi-Arid 
Tropics" — rotation multiplier calibration source.
```

### S6.3: Hero link box — perfect, no changes.

---

## WHAT TO ABSOLUTELY NOT TOUCH

| Element | Why |
|:---|:---|
| SVG architecture diagram (Slide 3 right) | Best technical visual in the deck |
| Before/After comparison (Slide 5 right) | Perfect emotional impact with Wardha numbers |
| Hero link box (Slide 6 bottom) | Clean, prominent, production-ready |
| Data sources table (Slide 6 top) | Well-structured with real govt portal links |
| Theme toggle / zoom / navigation JS | Interactive features work perfectly |
| Print CSS / page-break rules | Needed for PDF export |
| Slide 1 template background | Official SIH template compliance |

---

## PRIORITY ORDER FOR THE AI EDITOR

| # | Change | Why It's Critical |
|:---|:---|:---|
| 1 | Slide 2: Rewrite bullets to lead with farmer PROBLEMS not features | Content substance — this is the decision slide |
| 2 | Slide 4: Replace 6 sections with validation table + focused feasibility | Credibility — no other team has govt-validated accuracy |
| 3 | Slide 3: Swap GitHub card → Accuracy benchmarks card | Technical proof on the right slide |
| 4 | Global: Text size increase (floor 11px) | Readability — currently unreadable in PDF |
| 5 | Slide 2: 7-question → 5-card in SVG | Accuracy to actual code |
| 6 | Slide 3: Fix Bhashini ASR → TTS | Don't overstate what we have |
| 7 | Team name consistency | Polish |
| 8 | Slide 5/6 minor tweaks | Polish |
