from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class StatCreate(BaseModel):
    number: str  # "500+", "10+", "1000+"
    label: str   # "Happy Families", "Years Experience"
    display_order: int = 0
    is_active: bool = True

class StatUpdate(BaseModel):
    number: Optional[str] = None
    label: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class StatResponse(BaseModel):
    id: int
    number: str
    label: str
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StatListResponse(BaseModel):
    total: int
    stats: List[StatResponse]
