from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(200), nullable=False)
    area = Column(String(100), nullable=True)  # Chhend, Civil Township, etc.

    # Pricing
    price = Column(String(50), nullable=False)  # "1.25 Crore", "85 Lac"
    price_per_sqft = Column(String(50), nullable=True)

    # Size
    size = Column(String(50), nullable=False)  # "5,000" sq ft

    # Property Type
    property_type = Column(String(50), nullable=False)  # Residential, Commercial, Farm House

    # Images (stored as JSON array)
    images = Column(JSON, default=list)
    thumbnail = Column(String(500), nullable=True)

    # Features (stored as JSON array)
    features = Column(JSON, default=list)

    # Status & Badges
    status = Column(String(50), default="Available")  # Available, Sold, Reserved
    is_new = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)

    # Meta
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
