from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BenefitCreate(BaseModel):
    text: str
    display_order: int = 0
    is_active: bool = True

class BenefitUpdate(BaseModel):
    text: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class BenefitResponse(BaseModel):
    id: int
    text: str
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BenefitListResponse(BaseModel):
    total: int
    benefits: List[BenefitResponse]
