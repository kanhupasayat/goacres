from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class EnquiryCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    message: Optional[str] = None
    property_id: Optional[int] = None
    budget: Optional[str] = None
    preferred_location: Optional[str] = None
    preferred_size: Optional[str] = None
    source: str = "website"

class EnquiryUpdate(BaseModel):
    status: Optional[str] = None
    admin_notes: Optional[str] = None

class EnquiryResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    message: Optional[str] = None
    property_id: Optional[int] = None
    budget: Optional[str] = None
    preferred_location: Optional[str] = None
    preferred_size: Optional[str] = None
    status: str
    source: str
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class EnquiryListResponse(BaseModel):
    total: int
    enquiries: List[EnquiryResponse]
