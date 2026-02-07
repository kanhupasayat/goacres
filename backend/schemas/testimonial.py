from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TestimonialCreate(BaseModel):
    name: str
    location: str
    avatar_url: Optional[str] = None
    text: str
    rating: int = 5
    display_order: int = 0
    is_active: bool = True

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    text: Optional[str] = None
    rating: Optional[int] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class TestimonialResponse(BaseModel):
    id: int
    name: str
    location: str
    avatar_url: Optional[str] = None
    text: str
    rating: int
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TestimonialListResponse(BaseModel):
    total: int
    testimonials: List[TestimonialResponse]
