# 🐙 08. Git & AI Coding Agent (Vibe-Coding) Collaboration Guide
### Project: **AGRI-DECIDE — AI Crop Recommendation Engine (PS #24)**
### Live Repository: [`https://github.com/sujeetaionly/agri-decide-sih`](https://github.com/sujeetaionly/agri-decide-sih)

---

## 1. Quick Onboarding for Teammates & AI Coding Agents

> **For Teammates:** When opening this repository in your AI coding tool (Antigravity, Cursor, Claude Code, VS Code Copilot, etc.), **feed your AI agent the exact prompt for your assigned role below**.

```
agri-decide-sih/
├── frontend/               <-- 🎨 TEAM A (2 members + AI Agents) works ONLY here
├── backend/                <-- 👨‍💻 LEAD ORCHESTRATOR (+ AI Agents) works here
├── data/                   <-- 🤖 TEAM B (3 members + AI Agents) stores CSV datasets here
├── ml_experiments/         <-- 🤖 TEAM B (3 members + AI Agents) trains models & writes solvers here
├── docs/                   <-- Architecture, User Flows & API Contracts (Read-Only)
└── presentation/           <-- 🎨 TEAM A stores 6-slide SIH PPT/PDF here
```

---

## 2. Initial Setup Commands (Step 1 for Humans / AI)

Open your terminal and run the initial setup for your workspace:

### 1. Clone the repository:
```bash
git clone https://github.com/sujeetaionly/agri-decide-sih.git
cd agri-decide-sih
```

### 2. Switch to your feature branch:

#### 🎨 For Team A (Frontend & PPT):
```bash
git checkout -b feature/frontend
cd frontend
# Initialize or install dependencies
npm install
npm run dev
```

#### 🤖 For Team B (AI/ML & Data):
```bash
git checkout -b feature/ml-data
cd ml_experiments
# Setup Python virtual environment
python -m venv .venv
# On Windows: .venv\Scripts\activate | On Mac/Linux: source .venv/bin/activate
pip install scikit-learn xgboost pandas numpy joblib
```

#### 👨‍💻 For Lead Orchestrator (Backend):
```bash
git checkout -b feature/backend
cd backend
python -m venv .venv
# On Windows: .venv\Scripts\activate | On Mac/Linux: source .venv/bin/activate
pip install fastapi uvicorn pydantic psycopg2-binary sqlalchemy
```

---

## 3. Prompts to Feed Your AI Coding Agents (Copy & Paste)

---

### 🎨 Prompt for Team A's AI Coding Agent (Frontend & UI):
```
You are the Frontend AI Coding Agent for the AGRI-DECIDE project.
Your workspace is STRICTLY restricted to the `/frontend` directory.

Read and follow these specification files:
1. `05_frontend_and_pitch_guide.md` (Design principles, farmer usability, GIGW compliance)
2. `02_user_flow.md` (The exact 6-screen user flow)
3. `03_api_contracts.md` (Strict API request/response JSON shapes)

STRICT RULES:
- On initial launch, show the first-time language preference modal: [English] / [हिंदी (Hindi)].
- For now, support ONLY English and Hindi.
- Place the voice input button specifically on Screen 3 (for speaking candidate crop names), paired with a search bar and dropdown multi-select.
- All interactive buttons MUST strictly bind to the action IDs defined in PERMITTED_ACTIONS in `03_api_contracts.md`.
- NEVER invent non-existent backend endpoints.
```

---

### 🤖 Prompt for Team B's AI Coding Agent (AI/ML & Data):
```
You are the AI/ML & Data Engineering Agent for the AGRI-DECIDE project.
Your workspace is STRICTLY restricted to `/data` and `/ml_experiments`.

Read and follow these specification files:
1. `07_aiml_and_data_engine_guide.md` (Data schemas, XGBoost yield model, price forecasting)
2. `03_api_contracts.md` (API output schemas and field definitions)

STRICT RULES:
- Member 1: Curate `cacp_costs_pune.csv` and `agmarknet_mandi_prices_pune.csv` in `/data` for 15 target crops.
- Member 2: Build and train `train_yield_xgboost.py` to output a `.joblib` model predicting yield in quintals/acre with documented RMSE metrics.
- Member 3: Write `price_forecaster.py` projecting harvest-month wholesale prices and implementing the "What-If" sensitivity recalculator.
```

---

### 👨‍💻 Prompt for Lead Orchestrator's AI Agent (Backend & DB):
```
You are the Backend & Database Lead Agent for the AGRI-DECIDE project.
Your workspace is `/backend`.

Read and follow these specification files:
1. `06_backend_and_database_guide.md` (PostgreSQL DDL schema and service formulas)
2. `03_api_contracts.md` (Strict FastAPI route schemas and status codes)

STRICT RULES:
- Implement the 5 REST API endpoints matching the exact request/response JSON in `03_api_contracts.md`.
- Build `economics_service.py` to calculate Adjusted Cost (with machinery ownership deduction) and Net Profit per Day.
- Integrate Team B's ML models from `/backend/app/models_ml/`.
```

---

## 4. Daily Git Commands (Pushing Your Work)

Whenever you or your AI agent completes a screen or script:

```bash
# 1. Check modified files
git status

# 2. Stage your changes
git add .

# 3. Commit with a descriptive message
git commit -m "feat(frontend): implement screen 3 voice crop selector and dropdown"

# 4. Push to your feature branch on GitHub
git push -u origin feature/your-branch-name
```

---

## 5. How the Lead Merges Everything into `main`

1. Go to the GitHub repository: [`https://github.com/sujeetaionly/agri-decide-sih`](https://github.com/sujeetaionly/agri-decide-sih)
2. Click **Pull requests $\rightarrow$ New pull request**.
3. Select `base: main` $\leftarrow$ `compare: feature/frontend` (or `feature/ml-data`).
4. Click **Create pull request** $\rightarrow$ Review code $\rightarrow$ Click **Merge pull request**.
5. Both teams run `git checkout main && git pull origin main` to get the latest unified code.
