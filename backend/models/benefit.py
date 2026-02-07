from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Benefit(Base):
    """Benefits list items (Why Choose Us section)"""
    __tablename__ = "benefits"

    id = Column(Integer, primary_key=True, index=True)

    # Benefit Info
    text = Column(String(255), nullable=False)  # "Transparent pricing with no hidden charges"

    # Display
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    # Meta
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
