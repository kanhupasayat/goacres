from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.feature import Feature
from models.user import User
from schemas.feature import FeatureCreate, FeatureUpdate, FeatureResponse
from utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/features", tags=["Features"])

@router.get("", response_model=List[FeatureResponse])
async def get_all_features(db: Session = Depends(get_db)):
    """Get all features (Public)"""
    features = db.query(Feature).filter(Feature.is_active == True).order_by(Feature.display_order).all()
    return features

@router.get("/all", response_model=List[FeatureResponse])
async def get_all_features_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all features including inactive (Admin only)"""
    features = db.query(Feature).order_by(Feature.display_order).all()
    return features

@router.get("/{feature_id}", response_model=FeatureResponse)
async def get_feature_by_id(feature_id: int, db: Session = Depends(get_db)):
    """Get feature by ID"""
    feature = db.query(Feature).filter(Feature.id == feature_id).first()
    if not feature:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feature not found")
    return feature

@router.post("", response_model=FeatureResponse)
async def create_feature(
    feature_data: FeatureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create new feature (Admin only)"""
    new_feature = Feature(**feature_data.model_dump())
    db.add(new_feature)
    db.commit()
    db.refresh(new_feature)
    return new_feature

@router.put("/{feature_id}", response_model=FeatureResponse)
async def update_feature(
    feature_id: int,
    feature_data: FeatureUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update feature (Admin only)"""
    feature = db.query(Feature).filter(Feature.id == feature_id).first()
    if not feature:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feature not found")

    update_data = feature_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(feature, key, value)

    db.commit()
    db.refresh(feature)
    return feature

@router.delete("/{feature_id}")
async def delete_feature(
    feature_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete feature (Admin only)"""
    feature = db.query(Feature).filter(Feature.id == feature_id).first()
    if not feature:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feature not found")

    db.delete(feature)
    db.commit()
    return {"message": "Feature deleted successfully"}
