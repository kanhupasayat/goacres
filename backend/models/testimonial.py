from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Testimonial(Base):
    """Customer testimonials"""
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)

    # Customer Info
    name = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    avatar_url = Column(String(500), nullable=True)  # Optional avatar image

    # Testimonial
    text = Column(Text, nullable=False)
    rating = Column(Integer, default=5)  # 1-5 stars

    # Display
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    # Meta
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
