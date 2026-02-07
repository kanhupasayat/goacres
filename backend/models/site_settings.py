from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class SiteSettings(Base):
    """Site-wide settings including Hero section"""
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)

    # Hero Section
    hero_title = Column(String(255), default="Land Deals, Made Easy.")
    hero_subtitle = Column(String(255), default="GOACRES: Your Trust, Our Land.")
    hero_image = Column(String(500), default="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000")
    hero_cta_text = Column(String(100), default="Explore Plots")
    hero_cta_link = Column(String(100), default="#listings")

    # Search Options (JSON arrays)
    locations = Column(JSON, default=["Rourkela", "Civil Township", "Chhend Colony", "Koel Nagar", "Vedvyas", "Lathikata"])
    budgets = Column(JSON, default=["Under 50 Lac", "50 Lac - 1 Crore", "1 - 2 Crore", "2 - 5 Crore", "Above 5 Crore"])
    sizes = Column(JSON, default=["Under 1,000 Sq. Ft.", "1,000 - 2,000 Sq. Ft.", "2,000 - 5,000 Sq. Ft.", "5,000 - 10,000 Sq. Ft.", "Above 10,000 Sq. Ft."])

    # About Section
    about_title = Column(String(255), default="Why Choose GOACRES?")
    about_subtitle = Column(String(255), default="Building long-term relationships through honest and transparent dealings")
    about_description = Column(Text, default="At GOACRES, we believe that buying land is more than just a transaction—it's a step towards building your future.")

    # Contact Info
    company_name = Column(String(100), default="GOACRES")
    company_tagline = Column(String(255), default="Premium Land Investments")
    contact_email = Column(String(100), default="info@goacres.com")
    contact_phone = Column(String(50), default="+91 9876543210")
    contact_address = Column(Text, default="Rourkela, Odisha, India")
    whatsapp_number = Column(String(50), default="919876543210")

    # Social Links
    facebook_url = Column(String(255), nullable=True)
    instagram_url = Column(String(255), nullable=True)
    twitter_url = Column(String(255), nullable=True)
    youtube_url = Column(String(255), nullable=True)

    # Meta
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
