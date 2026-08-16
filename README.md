# 🌾 AGRI-DECIDE
### *AI-Based Crop Recommendation Engine (Smart India Hackathon - PS #24)*

> **AGRI-DECIDE** is an intelligent, farmer-centric decision support system that recommends the most suitable, profitable, and climate-resilient crops based on real agro-climatic conditions, water availability, planned sowing windows, working capital, and farmer-owned machinery.

---

## 📁 Project Architecture & Team Guides

* **[`01_ideation.md`](./01_ideation.md):** Core Philosophy, Problem Deconstruction & Technology Stack.
* **[`02_user_flow.md`](./02_user_flow.md):** 6-Screen User Flow from Onboarding to Recommendation Scorecard.
* **[`03_api_contracts.md`](./03_api_contracts.md):** Strict REST API Schemas & `PERMITTED_ACTIONS` allowlist.
* **[`04_team_orchestration.md`](./04_team_orchestration.md):** 6-Member Team Division & 7-Day Sprint Roadmap.
* **[`05_frontend_and_pitch_guide.md`](./05_frontend_and_pitch_guide.md):** Team A Guide (Frontend PWA & 6-Slide Pitch PPT).
* **[`06_backend_and_database_guide.md`](./06_backend_and_database_guide.md):** Lead Orchestrator Guide (PostgreSQL DDL & FastAPI Backend).
* **[`07_aiml_and_data_engine_guide.md`](./07_aiml_and_data_engine_guide.md):** Team B Guide (Data Curation, XGBoost ML & Price Forecaster).
* **[`08_git_collaboration_guide.md`](./08_git_collaboration_guide.md):** Complete Git Branching & Collaboration Guide.

---

## 🚀 Quick Setup for Development

### 1. Backend Setup (FastAPI & Python 3.11):
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js / React):
```bash
cd frontend
npm install
npm run dev  # Starts development server on http://localhost:3000
```

---

## 👥 Team & Repository Information
* **Repository:** [https://github.com/sujeetaionly/agri-decide-sih](https://github.com/sujeetaionly/agri-decide-sih)
* **Lead Orchestrator & Backend:** Lead (Architecture, DB, Integrations)
* **Frontend & Pitch Team:** Team A (2 Members)
* **AI/ML & Data Team:** Team B (3 Members)
