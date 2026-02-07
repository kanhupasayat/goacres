from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from database import get_db
from models.property import Property
from models.user import User
from schemas.property import PropertyCreate, PropertyUpdate, PropertyResponse, PropertyListResponse
from utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/properties", tags=["Properties"])

@router.get("", response_model=PropertyListResponse)
async def get_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    property_type: Optional[str] = None,
    status: Optional[str] = None,
    location: Optional[str] = None,
    is_featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all properties with optional filters"""
    query = db.query(Property)

    # Apply filters
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if status:
        query = query.filter(Property.status == status)
    if location:
        query = query.filter(Property.location.ilike(f"%{location}%"))
    if is_featured is not None:
        query = query.filter(Property.is_featured == is_featured)

    # Get total count
    total = query.count()

    # Apply pagination and order
    properties = query.order_by(Property.created_at.desc()).offset(skip).limit(limit).all()

    return {"total": total, "properties": properties}

@router.get("/featured", response_model=List[PropertyResponse])
async def get_featured_properties(
    limit: int = Query(6, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get featured properties"""
    properties = db.query(Property).filter(
        Property.is_featured == True,
        Property.status == "Available"
    ).order_by(Property.created_at.desc()).limit(limit).all()

    return properties

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: int, db: Session = Depends(get_db)):
    """Get single property by ID"""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return property

@router.post("", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new property (Admin only)"""
    new_property = Property(**property_data.model_dump())
    db.add(new_property)
    db.commit()
    db.refresh(new_property)
    return new_property

@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a property (Admin only)"""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    # Update only provided fields
    update_data = property_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(property, key, value)

    db.commit()
    db.refresh(property)
    return property

@router.delete("/{property_id}")
async def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a property (Admin only)"""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    db.delete(property)
    db.commit()
    return {"message": "Property deleted successfully"}
