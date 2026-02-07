from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.sql import func
from database import Base

class AreaGuide(Base):
    __tablename__ = "area_guides"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Info
    name = Column(String(100), nullable=False, unique=True)
    tagline = Column(String(100), nullable=True)
    short_description = Column(String(255), nullable=True)
    full_description = Column(Text, nullable=True)

    # Image
    image = Column(String(500), nullable=True)

    # Rating & Price
    rating = Column(Float, default=4.0)
    price_range = Column(String(100), nullable=True)  # "₹2,000 - ₹2,500 /sq.ft"

    # Amenities (stored as JSON array)
    # Format: [{"icon": "school", "name": "Schools", "count": "8+ Schools", "detail": "DAV, DPS nearby"}]
    amenities = Column(JSON, default=list)

    # Highlights (stored as JSON array)
    # Format: ["Family-friendly", "Well-connected", "Low crime rate"]
    highlights = Column(JSON, default=list)

    # Display Order
    display_order = Column(Integer, default=0)

    # Meta
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
