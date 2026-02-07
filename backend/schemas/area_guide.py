from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class AmenityItem(BaseModel):
    icon: str
    name: str
    count: str
    detail: str

class AreaGuideCreate(BaseModel):
    name: str
    tagline: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    image: Optional[str] = None
    rating: float = 4.0
    price_range: Optional[str] = None
    amenities: List[Dict[str, Any]] = []
    highlights: List[str] = []
    display_order: int = 0

class AreaGuideUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    image: Optional[str] = None
    rating: Optional[float] = None
    price_range: Optional[str] = None
    amenities: Optional[List[Dict[str, Any]]] = None
    highlights: Optional[List[str]] = None
    display_order: Optional[int] = None

class AreaGuideResponse(BaseModel):
    id: int
    name: str
    tagline: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    image: Optional[str] = None
    rating: float
    price_range: Optional[str] = None
    amenities: List[Dict[str, Any]] = []
    highlights: List[str] = []
    display_order: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AreaGuideListResponse(BaseModel):
    total: int
    areas: List[AreaGuideResponse]
