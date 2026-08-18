@echo off
echo ==============================================
echo  Starting AGRI-DECIDE FastAPI Backend Server
echo ==============================================
cd /d %~dp0
if not exist "backend\.venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv backend\.venv
    call backend\.venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
) else (
    call backend\.venv\Scripts\activate.bat
)

echo Seeding database with 15 crops & CACP cost data...
python -m backend.app.seed

echo Starting Uvicorn server on port 8000...
uvicorn backend.app.main:app --reload --port 8000
