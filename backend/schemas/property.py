from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PropertyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    area: Optional[str] = None
    price: str
    price_per_sqft: Optional[str] = None
    size: str
    property_type: str
    images: List[str] = []
    thumbnail: Optional[str] = None
    features: List[str] = []
    status: str = "Available"
    is_new: bool = False
    is_featured: bool = False

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    area: Optional[str] = None
    price: Optional[str] = None
    price_per_sqft: Optional[str] = None
    size: Optional[str] = None
    property_type: Optional[str] = None
    images: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    features: Optional[List[str]] = None
    status: Optional[str] = None
    is_new: Optional[bool] = None
    is_featured: Optional[bool] = None

class PropertyResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    location: str
    area: Optional[str] = None
    price: str
    price_per_sqft: Optional[str] = None
    size: str
    property_type: str
    images: List[str] = []
    thumbnail: Optional[str] = None
    features: List[str] = []
    status: str
    is_new: bool
    is_featured: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PropertyListResponse(BaseModel):
    total: int
    properties: List[PropertyResponse]
