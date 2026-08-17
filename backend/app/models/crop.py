from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class Crop(Base):
    __tablename__ = "crops"

    crop_id = Column(String(30), primary_key=True, index=True)  # 'SOYBEAN', 'MAIZE', 'TUR', 'COTTON', 'BAJRA', etc.
    crop_name_en = Column(String(100), nullable=False)
    crop_name_hi = Column(String(100), nullable=False)
    crop_name_mr = Column(String(100), nullable=False)
    category = Column(String(30), nullable=False)  # 'OILSEED', 'CEREAL', 'PULSE', 'FIBRE', 'HORTICULTURE'
    duration_days_standard = Column(Integer, nullable=False)
    water_requirement_mm = Column(Float, nullable=False)
    suitable_soil_types = Column(String(200), nullable=False)  # Stored as comma-separated string e.g. "BLACK,LOAM"
    description_en = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)

    costs = relationship("CropCostCACP", back_populates="crop", cascade="all, delete-orphan")
    mandi_prices = relationship("MandiPriceHistorical", back_populates="crop", cascade="all, delete-orphan")
    sowing_windows = relationship("DistrictSowingWindow", back_populates="crop", cascade="all, delete-orphan")

class CropCostCACP(Base):
    __tablename__ = "crop_costs_cacp"

    cost_id = Column(Integer, primary_key=True, autoincrement=True)
    crop_id = Column(String(30), ForeignKey("crops.crop_id", ondelete="CASCADE"), nullable=False)
    state = Column(String(50), nullable=False)  # e.g., 'Maharashtra', 'Rajasthan'
    district = Column(String(50), nullable=True)
    seed_cost = Column(Float, nullable=False)
    fertilizer_cost = Column(Float, nullable=False)
    pesticide_cost = Column(Float, nullable=False)
    machinery_rental_cost = Column(Float, nullable=False)
    labour_cost = Column(Float, nullable=False)
    irrigation_electricity_cost = Column(Float, nullable=False)
    total_cost_per_acre = Column(Float, nullable=False)

    crop = relationship("Crop", back_populates="costs")

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
    farmer_id = Column(String(50), ForeignKey("farmers.farmer_id"), nullable=True)
    planned_sowing_date = Column(String(20), nullable=False)
    top_recommended_crop = Column(String(30), nullable=False)
    expected_profit_per_acre = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="recommendations")
