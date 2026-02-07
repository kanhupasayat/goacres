from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.site_settings import SiteSettings
from models.user import User
from schemas.site_settings import SiteSettingsUpdate, SiteSettingsResponse
from utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/site-settings", tags=["Site Settings"])

def get_or_create_settings(db: Session) -> SiteSettings:
    """Get existing settings or create default"""
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.get("", response_model=SiteSettingsResponse)
async def get_site_settings(db: Session = Depends(get_db)):
    """Get site settings (Public)"""
    settings = get_or_create_settings(db)
    return settings

@router.put("", response_model=SiteSettingsResponse)
async def update_site_settings(
    settings_data: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update site settings (Admin only)"""
    settings = get_or_create_settings(db)

    # Update only provided fields
    update_data = settings_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)

    db.commit()
    db.refresh(settings)
    return settings
