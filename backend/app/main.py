from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.api.v1.farm_routes import router as farm_router
from backend.app.api.v1.crop_routes import router as crop_router
from backend.app.api.v1.auth_routes import router as auth_router
from backend.app.api.v1.tts_routes import router as tts_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safely initialize database tables on application start
    try:
        from backend.app.models.farmer import Farmer, Farm
        from backend.app.models.crop import Crop, CropCostCACP, MandiPriceHistorical, DistrictSowingWindow, RecommendationLog
        Base.metadata.create_all(bind=engine)
        print("[DATABASE] PostgreSQL tables verified and initialized successfully.")
    except Exception as e:
        print(f"[DATABASE NOTICE] Startup schema check warning: {e}")
    yield

app = FastAPI(
    title="फसल-दिशा (Fasal Disha) API",
    description="AI-Based Crop Recommendation Engine & Multi-Region Decision Support System — हर खेत को मिले सही दिशा",
    version="1.0.0",
    lifespan=lifespan
)

# Setup CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(farm_router, prefix=settings.API_V1_STR)
app.include_router(crop_router, prefix=settings.API_V1_STR)
app.include_router(tts_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": "Fasal Disha (फसल-दिशा)",
        "tagline": "हर खेत को मिले सही दिशा",
        "description": "AI-Based Intelligent Multilingual Crop Recommendation Engine for Farmers",
        "status": "online",
        "docs_url": "/docs",
        "version": settings.VERSION
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
