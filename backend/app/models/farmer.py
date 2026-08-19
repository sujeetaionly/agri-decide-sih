from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import JSONB, ARRAY, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from backend.app.core.database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    farmer_id = Column(String(50), primary_key=True, index=True)
    farmer_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, index=True)
    name = Column(String(100), nullable=False)
    mobile = Column(String(15), nullable=False, unique=True, index=True)
    language_preference = Column(String(10), default="hi")
    preferred_languages = Column(ARRAY(String(10)), default=lambda: ["hi", "mr"])
    state = Column(String(50), default="Maharashtra")
    district = Column(String(50), nullable=False, index=True)
    taluka = Column(String(50), nullable=False)
    
    # PostgreSQL JSONB for custom farmer preferences, notification settings, and telemetry
    preferences = Column(JSONB, nullable=True, default=dict)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    farms = relationship("Farm", back_populates="farmer", cascade="all, delete-orphan")
    recommendations = relationship("RecommendationLog", back_populates="farmer")

    __table_args__ = (
        Index('ix_farmer_preferences_gin', preferences, postgresql_using='gin'),
    )

class Farm(Base):
    __tablename__ = "farms"

    farm_id = Column(Integer, primary_key=True, autoincrement=True)
    farmer_id = Column(String(50), ForeignKey("farmers.farmer_id", ondelete="CASCADE"), nullable=False, index=True)
    total_area_acres = Column(Float, nullable=False)
    soil_type = Column(String(30), nullable=False)  # 'BLACK', 'LOAM', 'RED', 'SANDY'
    water_source = Column(String(30), nullable=False)  # 'WELL', 'BOREWELL', 'CANAL', 'RAINFED'
    water_capacity_level = Column(String(20), nullable=False)  # 'LOW', 'MEDIUM', 'HIGH'
    working_capital_inr = Column(Float, nullable=False)
    
    # PostgreSQL ARRAY for multi-crop previous rotation history
    previous_crops_history = Column(ARRAY(String(50)), nullable=True, default=list)
    previous_season_crop = Column(String(50), nullable=True)
    
    # PostgreSQL JSONB for precision farm equipment & irrigation sensor telemetry
    farm_equipment = Column(JSONB, nullable=True, default=dict)
    
    owns_tractor = Column(Boolean, default=False)
    owns_sprayer = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="farms")

