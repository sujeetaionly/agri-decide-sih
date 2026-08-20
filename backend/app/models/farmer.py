from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from backend.app.core.database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    farmer_id = Column(String(50), primary_key=True, index=True)
    farmer_uuid = Column(String(36), default=lambda: str(uuid.uuid4()), unique=True, index=True)
    name = Column(String(100), nullable=False)
    mobile = Column(String(15), nullable=False, unique=True, index=True)
    language_preference = Column(String(10), default="hi")
    preferred_languages = Column(JSON, default=lambda: ["hi", "mr"])
    state = Column(String(50), default="Maharashtra")
    district = Column(String(50), nullable=False, index=True)
    taluka = Column(String(50), nullable=False)
    
    preferences = Column(JSON, nullable=True, default=dict)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    farms = relationship("Farm", back_populates="farmer", cascade="all, delete-orphan")
    recommendations = relationship("RecommendationLog", back_populates="farmer")

class Farm(Base):
    __tablename__ = "farms"

    farm_id = Column(Integer, primary_key=True, autoincrement=True)
    farmer_id = Column(String(50), ForeignKey("farmers.farmer_id", ondelete="CASCADE"), nullable=False, index=True)
    total_area_acres = Column(Float, nullable=False)
    soil_type = Column(String(30), nullable=False)  # 'BLACK', 'LOAM', 'RED', 'SANDY'
    water_source = Column(String(30), nullable=False)  # 'WELL', 'BOREWELL', 'CANAL', 'RAINFED'
    water_capacity_level = Column(String(20), nullable=False)  # 'LOW', 'MEDIUM', 'HIGH'
    working_capital_inr = Column(Float, nullable=False)
    
    previous_crops_history = Column(JSON, nullable=True, default=list)
    previous_season_crop = Column(String(50), nullable=True)
    
    farm_equipment = Column(JSON, nullable=True, default=dict)
    
    owns_tractor = Column(Boolean, default=False)
    owns_sprayer = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="farms")


