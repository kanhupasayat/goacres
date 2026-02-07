from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.benefit import Benefit
from models.user import User
from schemas.benefit import BenefitCreate, BenefitUpdate, BenefitResponse
from utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/benefits", tags=["Benefits"])

@router.get("", response_model=List[BenefitResponse])
async def get_all_benefits(db: Session = Depends(get_db)):
    """Get all benefits (Public)"""
    benefits = db.query(Benefit).filter(Benefit.is_active == True).order_by(Benefit.display_order).all()
    return benefits

@router.get("/all", response_model=List[BenefitResponse])
async def get_all_benefits_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all benefits including inactive (Admin only)"""
    benefits = db.query(Benefit).order_by(Benefit.display_order).all()
    return benefits

@router.get("/{benefit_id}", response_model=BenefitResponse)
async def get_benefit_by_id(benefit_id: int, db: Session = Depends(get_db)):
    """Get benefit by ID"""
    benefit = db.query(Benefit).filter(Benefit.id == benefit_id).first()
    if not benefit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Benefit not found")
    return benefit

@router.post("", response_model=BenefitResponse)
async def create_benefit(
    benefit_data: BenefitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create new benefit (Admin only)"""
    new_benefit = Benefit(**benefit_data.model_dump())
    db.add(new_benefit)
    db.commit()
    db.refresh(new_benefit)
    return new_benefit

@router.put("/{benefit_id}", response_model=BenefitResponse)
async def update_benefit(
    benefit_id: int,
    benefit_data: BenefitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update benefit (Admin only)"""
    benefit = db.query(Benefit).filter(Benefit.id == benefit_id).first()
    if not benefit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Benefit not found")

    update_data = benefit_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(benefit, key, value)

    db.commit()
    db.refresh(benefit)
    return benefit

@router.delete("/{benefit_id}")
async def delete_benefit(
    benefit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete benefit (Admin only)"""
    benefit = db.query(Benefit).filter(Benefit.id == benefit_id).first()
    if not benefit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Benefit not found")

    db.delete(benefit)
    db.commit()
    return {"message": "Benefit deleted successfully"}
