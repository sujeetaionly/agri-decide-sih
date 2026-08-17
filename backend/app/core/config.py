import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AGRI-DECIDE API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Default to SQLite for zero-friction local development; easily overridden by environment variable for PostgreSQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agri_decide.db")
    
    # CORS Origins
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()
