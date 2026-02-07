from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.price_index import PriceIndex
from models.user import User
from schemas.price_index import PriceIndexCreate, PriceIndexUpdate, PriceIndexResponse, PriceIndexListResponse
from utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/price-index", tags=["Price Index"])

@router.get("", response_model=List[PriceIndexResponse])
async def get_all_prices(db: Session = Depends(get_db)):
    """Get all area prices (Public)"""
    prices = db.query(PriceIndex).order_by(PriceIndex.display_order, PriceIndex.area_name).all()
    return prices

@router.get("/{area_id}", response_model=PriceIndexResponse)
async def get_price_by_id(area_id: int, db: Session = Depends(get_db)):
    """Get price by ID"""
    price = db.query(PriceIndex).filter(PriceIndex.id == area_id).first()
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Area not found"
        )
    return price

@router.post("", response_model=PriceIndexResponse)
async def create_price(
    price_data: PriceIndexCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create new price entry (Admin only)"""
    # Check if area already exists
    existing = db.query(PriceIndex).filter(PriceIndex.area_name == price_data.area_name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Area already exists. Use PUT to update."
        )

    new_price = PriceIndex(**price_data.model_dump())
    db.add(new_price)
    db.commit()
    db.refresh(new_price)
    return new_price

@router.put("/{area_id}", response_model=PriceIndexResponse)
async def update_price(
    area_id: int,
    price_data: PriceIndexUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update price entry (Admin only)"""
    price = db.query(PriceIndex).filter(PriceIndex.id == area_id).first()
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Area not found"
        )

    # Update only provided fields
    update_data = price_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(price, key, value)

    db.commit()
    db.refresh(price)
    return price

@router.delete("/{area_id}")
async def delete_price(
    area_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete price entry (Admin only)"""
    price = db.query(PriceIndex).filter(PriceIndex.id == area_id).first()
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Area not found"
        )

    db.delete(price)
    db.commit()
    return {"message": "Price entry deleted successfully"}

@router.post("/bulk", response_model=List[PriceIndexResponse])
async def bulk_update_prices(
    prices: List[PriceIndexCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Bulk create/update prices (Admin only)"""
    results = []
    for price_data in prices:
        existing = db.query(PriceIndex).filter(PriceIndex.area_name == price_data.area_name).first()
        if existing:
            # Update existing
            for key, value in price_data.model_dump().items():
                setattr(existing, key, value)
            db.commit()
            db.refresh(existing)
            results.append(existing)
        else:
            # Create new
            new_price = PriceIndex(**price_data.model_dump())
            db.add(new_price)
            db.commit()
            db.refresh(new_price)
            results.append(new_price)

    return results
