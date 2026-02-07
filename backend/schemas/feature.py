from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FeatureCreate(BaseModel):
    icon: str = "shield"  # shield, map-pin, dollar-sign, file-text, users
    title: str
    description: str
    display_order: int = 0
    is_active: bool = True

class FeatureUpdate(BaseModel):
    icon: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class FeatureResponse(BaseModel):
    id: int
    icon: str
    title: str
    description: str
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FeatureListResponse(BaseModel):
    total: int
    features: List[FeatureResponse]
