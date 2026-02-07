from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.stat import Stat
from models.user import User
from schemas.stat import StatCreate, StatUpdate, StatResponse
from utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/stats", tags=["Stats"])

@router.get("", response_model=List[StatResponse])
async def get_all_stats(db: Session = Depends(get_db)):
    """Get all stats (Public)"""
    stats = db.query(Stat).filter(Stat.is_active == True).order_by(Stat.display_order).all()
    return stats

@router.get("/all", response_model=List[StatResponse])
async def get_all_stats_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all stats including inactive (Admin only)"""
    stats = db.query(Stat).order_by(Stat.display_order).all()
    return stats

@router.get("/{stat_id}", response_model=StatResponse)
async def get_stat_by_id(stat_id: int, db: Session = Depends(get_db)):
    """Get stat by ID"""
    stat = db.query(Stat).filter(Stat.id == stat_id).first()
    if not stat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stat not found")
    return stat

@router.post("", response_model=StatResponse)
async def create_stat(
    stat_data: StatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create new stat (Admin only)"""
    new_stat = Stat(**stat_data.model_dump())
    db.add(new_stat)
    db.commit()
    db.refresh(new_stat)
    return new_stat

@router.put("/{stat_id}", response_model=StatResponse)
async def update_stat(
    stat_id: int,
    stat_data: StatUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update stat (Admin only)"""
    stat = db.query(Stat).filter(Stat.id == stat_id).first()
    if not stat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stat not found")

    update_data = stat_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(stat, key, value)

    db.commit()
    db.refresh(stat)
    return stat

@router.delete("/{stat_id}")
async def delete_stat(
    stat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete stat (Admin only)"""
    stat = db.query(Stat).filter(Stat.id == stat_id).first()
    if not stat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stat not found")

    db.delete(stat)
    db.commit()
    return {"message": "Stat deleted successfully"}
