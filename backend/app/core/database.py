from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import QueuePool, StaticPool
from backend.app.core.config import settings

uri = settings.SQLALCHEMY_DATABASE_URI
if "sqlite" in uri:
    engine = create_engine(
        uri,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False
    )
else:
    try:
        engine = create_engine(
            uri,
            poolclass=QueuePool,
            pool_size=settings.DB_POOL_SIZE,
            max_overflow=settings.DB_MAX_OVERFLOW,
            pool_timeout=3,
            pool_recycle=settings.DB_POOL_RECYCLE,
            pool_pre_ping=True,
            echo=False
        )
        with engine.connect() as conn:
            pass
    except Exception:
        # Automatic fallback to local SQLite for seamless offline testing & development
        engine = create_engine(
            "sqlite:///./fasal_disha.db",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
            echo=False
        )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """FastAPI Dependency for database sessions with safe teardown."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

