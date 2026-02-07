from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.testimonial import Testimonial
from models.user import User
from schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/testimonials", tags=["Testimonials"])

@router.get("", response_model=List[TestimonialResponse])
async def get_all_testimonials(db: Session = Depends(get_db)):
    """Get all testimonials (Public)"""
    testimonials = db.query(Testimonial).filter(Testimonial.is_active == True).order_by(Testimonial.display_order).all()
    return testimonials

@router.get("/all", response_model=List[TestimonialResponse])
async def get_all_testimonials_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all testimonials including inactive (Admin only)"""
    testimonials = db.query(Testimonial).order_by(Testimonial.display_order).all()
    return testimonials

@router.get("/{testimonial_id}", response_model=TestimonialResponse)
async def get_testimonial_by_id(testimonial_id: int, db: Session = Depends(get_db)):
    """Get testimonial by ID"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    return testimonial

@router.post("", response_model=TestimonialResponse)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create new testimonial (Admin only)"""
    new_testimonial = Testimonial(**testimonial_data.model_dump())
    db.add(new_testimonial)
    db.commit()
    db.refresh(new_testimonial)
    return new_testimonial

@router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: int,
    testimonial_data: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update testimonial (Admin only)"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")

    update_data = testimonial_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(testimonial, key, value)

    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.delete("/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete testimonial (Admin only)"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")

    db.delete(testimonial)
    db.commit()
    return {"message": "Testimonial deleted successfully"}
