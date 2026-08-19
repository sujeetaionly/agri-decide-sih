from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Index
from sqlalchemy.dialects.postgresql import JSONB, ARRAY, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from backend.app.core.database import Base

class Crop(Base):
    __tablename__ = "crops"

    crop_id = Column(String(30), primary_key=True, index=True)  # 'SOYBEAN', 'MAIZE', 'TUR', 'COTTON', 'BAJRA', etc.
    crop_name_en = Column(String(100), nullable=False)
    crop_name_hi = Column(String(100), nullable=False)
    crop_name_mr = Column(String(100), nullable=False)
    
    # PostgreSQL JSONB for complete regional Indic localization & aliases
    # Example: {"hi": "सोयाबीन", "mr": "सोयाबीन", "gu": "સોયાબીન", "raj": "सोयाबीन", "en": "Soybean"}
    localized_names = Column(JSONB, nullable=False, default=dict)
    
    category = Column(String(30), nullable=False)  # 'OILSEED', 'CEREAL', 'PULSE', 'FIBRE', 'HORTICULTURE'
    duration_days_standard = Column(Integer, nullable=False)
    water_requirement_mm = Column(Float, nullable=False)
    
    # PostgreSQL Native Array of Soil Types
    # Example: ['BLACK', 'LOAM', 'RED']
    suitable_soil_types = Column(ARRAY(String(50)), nullable=False, default=list)
    
    # PostgreSQL JSONB for structured advantages & agronomic risk factors
    why_recommended = Column(JSONB, nullable=True, default=list)
    cons = Column(JSONB, nullable=True, default=list)
    agronomic_milestones = Column(JSONB, nullable=True, default=list)
    
    description_en = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)

    costs = relationship("CropCostCACP", back_populates="crop", cascade="all, delete-orphan")
    mandi_prices = relationship("MandiPriceHistorical", back_populates="crop", cascade="all, delete-orphan")
    sowing_windows = relationship("DistrictSowingWindow", back_populates="crop", cascade="all, delete-orphan")

    __table_args__ = (
        Index('ix_crop_localized_names_gin', localized_names, postgresql_using='gin'),
        Index('ix_crop_soil_types_gin', suitable_soil_types, postgresql_using='gin'),
    )

class CropCostCACP(Base):
    __tablename__ = "crop_costs_cacp"

    cost_id = Column(Integer, primary_key=True, autoincrement=True)
    crop_id = Column(String(30), ForeignKey("crops.crop_id", ondelete="CASCADE"), nullable=False, index=True)
    state = Column(String(50), nullable=False, index=True)  # e.g., 'Maharashtra', 'Rajasthan'
    district = Column(String(50), nullable=True, index=True)
    
    seed_cost = Column(Float, nullable=False)
    fertilizer_cost = Column(Float, nullable=False)
    pesticide_cost = Column(Float, nullable=False)
    machinery_rental_cost = Column(Float, nullable=False)
    labour_cost = Column(Float, nullable=False)
    irrigation_electricity_cost = Column(Float, nullable=False)
    total_cost_per_acre = Column(Float, nullable=False)
    
    # PostgreSQL JSONB for complete CACP A2, FL, A2+FL itemized cost vector
    itemized_breakdown = Column(JSONB, nullable=True, default=dict)

    crop = relationship("Crop", back_populates="costs")

    __table_args__ = (
        Index('ix_cacp_breakdown_gin', itemized_breakdown, postgresql_using='gin'),
    )

class MandiPriceHistorical(Base):
    __tablename__ = "mandi_prices_historical"

    price_id = Column(Integer, primary_key=True, autoincrement=True)
    district = Column(String(50), nullable=False, index=True)
    crop_id = Column(String(30), ForeignKey("crops.crop_id", ondelete="CASCADE"), nullable=False, index=True)
    month_num = Column(Integer, nullable=False)  # 1 to 12
    year = Column(Integer, nullable=False)
    modal_price_qtl = Column(Float, nullable=False)

    crop = relationship("Crop", back_populates="mandi_prices")

class DistrictSowingWindow(Base):
    __tablename__ = "district_sowing_windows"

    window_id = Column(Integer, primary_key=True, autoincrement=True)
    district = Column(String(50), nullable=False, index=True)
    crop_id = Column(String(30), ForeignKey("crops.crop_id", ondelete="CASCADE"), nullable=False, index=True)
    season = Column(String(20), default="Kharif")
    optimal_start_date = Column(String(10), nullable=False)  # MM-DD e.g. '06-15'
    optimal_end_date = Column(String(10), nullable=False)    # MM-DD e.g. '07-10'
    late_cutoff_date = Column(String(10), nullable=False)    # MM-DD e.g. '07-25'

    crop = relationship("Crop", back_populates="sowing_windows")

class RecommendationLog(Base):
    __tablename__ = "recommendations_log"

    rec_id = Column(Integer, primary_key=True, autoincrement=True)
    rec_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, index=True)
    farmer_id = Column(String(50), ForeignKey("farmers.farmer_id"), nullable=True, index=True)
    planned_sowing_date = Column(String(20), nullable=False)
    top_recommended_crop = Column(String(30), nullable=False, index=True)
    total_land_acres = Column(Float, nullable=True, default=1.0)
    soil_type = Column(String(50), nullable=True, default="BLACK")
    water_source = Column(String(50), nullable=True, default="WELL")
    expected_yield_qtl_per_acre = Column(Float, nullable=True, default=9.5)
    total_cost_per_acre = Column(Float, nullable=True, default=19412.0)
    expected_profit_per_acre = Column(Float, nullable=False)
    match_score = Column(Float, nullable=True, default=90.0)
    
    # PostgreSQL ARRAY & JSONB for full comparison matrix and head-to-head snapshot
    candidate_crops = Column(ARRAY(String(50)), nullable=True, default=list)
    comparison_matrix = Column(JSONB, nullable=True, default=list)
    intended_vs_recommended = Column(JSONB, nullable=True, default=dict)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    farmer = relationship("Farmer", back_populates="recommendations")

    __table_args__ = (
        Index('ix_rec_matrix_gin', comparison_matrix, postgresql_using='gin'),
        Index('ix_rec_intended_gin', intended_vs_recommended, postgresql_using='gin'),
    )


