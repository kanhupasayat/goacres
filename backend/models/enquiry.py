from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum

class EnquiryStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"

class EnquirySource(str, enum.Enum):
    WEBSITE = "website"
    WHATSAPP = "whatsapp"
    PHONE = "phone"
    WALK_IN = "walk_in"

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)

    # Customer Info
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=True)

    # Enquiry Details
    message = Column(Text, nullable=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)

    # Interest Details
    budget = Column(String(100), nullable=True)
    preferred_location = Column(String(200), nullable=True)
    preferred_size = Column(String(100), nullable=True)

    # Status & Source
    status = Column(String(20), default=EnquiryStatus.NEW.value)
    source = Column(String(20), default=EnquirySource.WEBSITE.value)

    # Notes (for admin)
    admin_notes = Column(Text, nullable=True)

    # Meta
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
