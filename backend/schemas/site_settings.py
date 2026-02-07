from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SiteSettingsUpdate(BaseModel):
    # Hero Section
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image: Optional[str] = None
    hero_cta_text: Optional[str] = None
    hero_cta_link: Optional[str] = None

    # Search Options
    locations: Optional[List[str]] = None
    budgets: Optional[List[str]] = None
    sizes: Optional[List[str]] = None

    # About Section
    about_title: Optional[str] = None
    about_subtitle: Optional[str] = None
    about_description: Optional[str] = None

    # Contact Info
    company_name: Optional[str] = None
    company_tagline: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_address: Optional[str] = None
    whatsapp_number: Optional[str] = None

    # Social Links
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    twitter_url: Optional[str] = None
    youtube_url: Optional[str] = None

class SiteSettingsResponse(BaseModel):
    id: int

    # Hero Section
    hero_title: str
    hero_subtitle: str
    hero_image: str
    hero_cta_text: str
    hero_cta_link: str

    # Search Options
    locations: List[str]
    budgets: List[str]
    sizes: List[str]

    # About Section
    about_title: str
    about_subtitle: str
    about_description: str

    # Contact Info
    company_name: str
    company_tagline: str
    contact_email: str
    contact_phone: str
    contact_address: str
    whatsapp_number: str

    # Social Links
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    twitter_url: Optional[str] = None
    youtube_url: Optional[str] = None

    updated_at: datetime

    class Config:
        from_attributes = True
