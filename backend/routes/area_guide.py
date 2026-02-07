from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.area_guide import AreaGuide
from models.user import User
from schemas.area_guide import AreaGuideCreate, AreaGuideUpdate, AreaGuideResponse, AreaGuideListResponse
from utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/areas", tags=["Area Guide"])

@router.get("", response_model=List[AreaGuideResponse])
async def get_all_areas(db: Session = Depends(get_db)):
    """Get all area guides (Public)"""
    areas = db.query(AreaGuide).order_by(AreaGuide.display_order, AreaGuide.name).all()
    return areas

@router.get("/{area_id}", response_model=AreaGuideResponse)
async def get_area_by_id(area_id: int, db: Session = Depends(get_db)):
    """Get area by ID"""
    area = db.query(AreaGuide).filter(AreaGuide.id == area_id).first()
    if not area:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Area not found"
        )
    return area

@router.get("/name/{area_name}", response_model=AreaGuideResponse)
async def get_area_by_name(area_name: str, db: Session = Depends(get_db)):
    """Get area by name"""
    area = db.query(AreaGuide).filter(AreaGuide.name.ilike(f"%{area_name}%")).first()
    if not area:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Area not found"
        )
    return area

@router.post("", response_model=AreaGuideResponse)
async def create_area(
    area_data: AreaGuideCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create new area guide (Admin only)"""
    # Check if area already exists
    existing = db.query(AreaGuide).filter(AreaGuide.name == area_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Area already exists. Use PUT to update."
        )

    new_area = AreaGuide(**area_data.model_dump())
    db.add(new_area)
    db.commit()
    db.refresh(new_area)
    return new_area

@router.put("/{area_id}", response_model=AreaGuideResponse)
async def update_area(
    area_id: int,
    area_data: AreaGuideUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update area guide (Admin only)"""
    area = db.query(AreaGuide).filter(AreaGuide.id == area_id).first()
    if not area:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Area not found"
        )

    # Update only provided fields
    update_data = area_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(area, key, value)

    db.commit()
    db.refresh(area)
    return area

@router.delete("/{area_id}")
async def delete_area(
    area_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete area guide (Admin only)"""
    area = db.query(AreaGuide).filter(AreaGuide.id == area_id).first()
    if not area:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Area not found"
        )

    db.delete(area)
    db.commit()
    return {"message": "Area deleted successfully"}
