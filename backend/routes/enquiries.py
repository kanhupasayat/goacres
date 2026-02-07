from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.enquiry import Enquiry
from models.user import User
from schemas.enquiry import EnquiryCreate, EnquiryUpdate, EnquiryResponse, EnquiryListResponse
from utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/enquiries", tags=["Enquiries"])

@router.post("", response_model=EnquiryResponse)
async def create_enquiry(
    enquiry_data: EnquiryCreate,
    db: Session = Depends(get_db)
):
    """Submit a new enquiry (Public)"""
    new_enquiry = Enquiry(**enquiry_data.model_dump())
    db.add(new_enquiry)
    db.commit()
    db.refresh(new_enquiry)
    return new_enquiry

@router.get("", response_model=EnquiryListResponse)
async def get_enquiries(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all enquiries (Admin only)"""
    query = db.query(Enquiry)

    # Apply filters
    if status:
        query = query.filter(Enquiry.status == status)
    if source:
        query = query.filter(Enquiry.source == source)

    # Get total count
    total = query.count()

    # Apply pagination and order
    enquiries = query.order_by(Enquiry.created_at.desc()).offset(skip).limit(limit).all()

    return {"total": total, "enquiries": enquiries}

@router.get("/stats")
async def get_enquiry_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get enquiry statistics (Admin only)"""
    total = db.query(Enquiry).count()
    new_count = db.query(Enquiry).filter(Enquiry.status == "new").count()
    contacted_count = db.query(Enquiry).filter(Enquiry.status == "contacted").count()
    in_progress_count = db.query(Enquiry).filter(Enquiry.status == "in_progress").count()
    closed_count = db.query(Enquiry).filter(Enquiry.status == "closed").count()

    return {
        "total": total,
        "new": new_count,
        "contacted": contacted_count,
        "in_progress": in_progress_count,
        "closed": closed_count
    }

@router.get("/{enquiry_id}", response_model=EnquiryResponse)
async def get_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get single enquiry (Admin only)"""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found"
        )
    return enquiry

@router.put("/{enquiry_id}", response_model=EnquiryResponse)
async def update_enquiry(
    enquiry_id: int,
    enquiry_data: EnquiryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update enquiry status/notes (Admin only)"""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found"
        )

    # Update only provided fields
    update_data = enquiry_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(enquiry, key, value)

    db.commit()
    db.refresh(enquiry)
    return enquiry

@router.delete("/{enquiry_id}")
async def delete_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete an enquiry (Admin only)"""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found"
        )

    db.delete(enquiry)
    db.commit()
    return {"message": "Enquiry deleted successfully"}
