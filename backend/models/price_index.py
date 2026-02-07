from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class PriceIndex(Base):
    __tablename__ = "price_index"

    id = Column(Integer, primary_key=True, index=True)

    # Area Info
    area_name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255), nullable=True)

    # Pricing
    rate = Column(Integer, nullable=False)  # Rate per sq.ft

    # Trend Info
    trend = Column(String(20), default="stable")  # up, down, stable, new
    change_percent = Column(String(20), nullable=True)  # "+8%", "-5%", "0%"

    # Display
    is_highlighted = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)

    # Meta
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
