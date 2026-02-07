from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Feature(Base):
    """Features section items (The 5 Pillars of Trust)"""
    __tablename__ = "features"

    id = Column(Integer, primary_key=True, index=True)

    # Feature Info
    icon = Column(String(50), default="shield")  # shield, map-pin, dollar-sign, file-text, users
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)

    # Display
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    # Meta
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
