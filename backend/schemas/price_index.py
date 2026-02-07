from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PriceIndexCreate(BaseModel):
    area_name: str
    description: Optional[str] = None
    rate: int
    trend: str = "stable"  # up, down, stable, new
    change_percent: Optional[str] = None
    is_highlighted: bool = False
    display_order: int = 0

class PriceIndexUpdate(BaseModel):
    area_name: Optional[str] = None
    description: Optional[str] = None
    rate: Optional[int] = None
    trend: Optional[str] = None
    change_percent: Optional[str] = None
    is_highlighted: Optional[bool] = None
    display_order: Optional[int] = None

class PriceIndexResponse(BaseModel):
    id: int
    area_name: str
    description: Optional[str] = None
    rate: int
    trend: str
    change_percent: Optional[str] = None
    is_highlighted: bool
    display_order: int
    updated_at: datetime

    class Config:
        from_attributes = True

class PriceIndexListResponse(BaseModel):
    total: int
    prices: List[PriceIndexResponse]
