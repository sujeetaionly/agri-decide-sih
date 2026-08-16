# 🐙 08. Git & GitHub Collaboration Guide
### Project: **AGRI-DECIDE — AI Crop Recommendation Engine (PS #24)**
### Repository: [`https://github.com/sujeetaionly/agri-decide-sih`](https://github.com/sujeetaionly/agri-decide-sih)

---

## 1. Monorepo Structure & Folder Ownership

To prevent merge conflicts, each sub-team has a **strictly dedicated folder**:

```
agri-decide-sih/
├── frontend/               <-- 🎨 TEAM A (2 members) works ONLY here
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── backend/                <-- 👨‍💻 LEAD ORCHESTRATOR (You) works here
│   ├── app/
│   ├── main.py
│   └── requirements.txt
│
├── data/                   <-- 🤖 TEAM B (3 members) pushes CSV datasets here
│   ├── cacp_costs_pune.csv
│   └── agmarknet_mandi_prices.csv
│
├── ml_experiments/         <-- 🤖 TEAM B trains models & writes scripts here
│   ├── train_yield_xgboost.py
│   └── price_forecaster.py
│
├── docs/                   <-- Architecture & Documentation specifications
│   ├── 01_ideation.md
│   ├── 02_user_flow.md
│   ├── 03_api_contracts.md
│   └── 08_git_collaboration_guide.md
│
└── presentation/           <-- 🎨 TEAM A stores 6-slide SIH PPT/PDF here
```

---

## 2. Step-by-Step Instructions for All Team Members

---

### Step 1: Clone the Repository
Open your terminal (PowerShell, Command Prompt, or Git Bash) and run:
```bash
git clone https://github.com/sujeetaionly/agri-decide-sih.git
cd agri-decide-sih
```

---

### Step 2: Checkout Your Assigned Feature Branch

#### 🎨 For Team A (Frontend & PPT — 2 Members):
```bash
# Create and switch to the frontend branch
git checkout -b feature/frontend
```

#### 🤖 For Team B (AI/ML & Data — 3 Members):
```bash
# Create and switch to the ML/data branch
git checkout -b feature/ml-data
```

#### 👨‍💻 For Lead Orchestrator (Backend & Integration):
```bash
# Work on backend branch or main
git checkout -b feature/backend
```

---

## 3. Daily Git Workflow (The 4-Step Routine)

Whenever you start or finish working on a feature, follow these 4 steps:

### 1. Pull latest changes before coding:
```bash
git checkout main
git pull origin main
git checkout feature/your-branch-name
git merge main
```

### 2. Make changes ONLY inside your assigned folder:
* Team A $\rightarrow$ Edit files only in `frontend/` and `presentation/`.
* Team B $\rightarrow$ Edit files only in `data/` and `ml_experiments/`.
* Lead $\rightarrow$ Edit files in `backend/` and `docs/`.

### 3. Commit your changes with clear messages:
```bash
git add .
git commit -m "feat(frontend): build step 2 question cards wizard"
```

### 4. Push your branch to GitHub:
```bash
git push -u origin feature/your-branch-name
```

---

## 4. What to Push vs. What NOT to Push

| ✅ ALWAYS PUSH | ❌ NEVER PUSH (Already in `.gitignore`) |
| :--- | :--- |
| • Clean source code (`.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.css`) | • `node_modules/` or `.next/` build folders |
| • Curated CSV datasets in `/data` | • Python virtual environments (`venv/`, `.venv/`) |
| • Lightweight trained model weights (`.joblib`, `<15MB`) | • Secret API keys or `.env` files |
| • Documentation markdown files (`.md`) | • Raw 2GB screen recording video files |
| • Final 6-slide presentation PDF in `/presentation` | • IDE temporary files (`.vscode/`, `.idea/`) |

---

## 5. How Merging into `main` Works (Lead Orchestrator)

1. When Team A or Team B completes a milestone, they push their branch and notify the Lead on WhatsApp: *"Pushed Screen 2 to `feature/frontend`"*.
2. The Lead Orchestrator reviews the code, tests it locally, and creates a **Pull Request (PR)** on GitHub from `feature/frontend` $\rightarrow$ `main`.
3. The Lead clicks **Merge Pull Request**.
4. Now `main` has the updated, fully integrated project.
