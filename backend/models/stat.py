from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Stat(Base):
    """Stats section items (500+ Happy Families, etc.)"""
    __tablename__ = "stats"

    id = Column(Integer, primary_key=True, index=True)

    # Stat Info
    number = Column(String(50), nullable=False)  # "500+", "10+", "1000+", "100%"
    label = Column(String(100), nullable=False)  # "Happy Families", "Years Experience"

    # Display
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    # Meta
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
