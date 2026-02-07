from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from database import engine, Base, SessionLocal
from models import User, Property, Enquiry, PriceIndex, AreaGuide, SiteSettings, Feature, Stat, Testimonial, Benefit
from utils.auth import get_password_hash
from routes import (
    auth_router,
    properties_router,
    enquiries_router,
    price_index_router,
    area_guide_router,
    calculator_router,
    site_settings_router,
    features_router,
    stats_router,
    testimonials_router,
    benefits_router
)

# Seed data function
def seed_database():
    """Seed initial data into database"""
    db = SessionLocal()

    try:
        # Check if admin user exists
        admin_exists = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin_exists:
            # Create admin user
            admin = User(
                email=settings.ADMIN_EMAIL,
                password_hash=get_password_hash(settings.ADMIN_PASSWORD),
                name="Admin",
                is_admin=True,
                is_active=True
            )
            db.add(admin)
            print(f"Admin user created: {settings.ADMIN_EMAIL}")

        # Seed Price Index data
        if db.query(PriceIndex).count() == 0:
            price_data = [
                {"area_name": "Civil Township", "description": "Premium locality near Steel Plant", "rate": 4500, "trend": "up", "change_percent": "+8%", "is_highlighted": True, "display_order": 1},
                {"area_name": "Chhend Colony", "description": "Family-friendly residential hub", "rate": 2200, "trend": "stable", "change_percent": "0%", "is_highlighted": False, "display_order": 2},
                {"area_name": "Koel Nagar", "description": "Emerging commercial zone", "rate": 2800, "trend": "up", "change_percent": "+5%", "is_highlighted": False, "display_order": 3},
                {"area_name": "Vedvyas", "description": "Religious & peaceful area", "rate": 850, "trend": "up", "change_percent": "+12%", "is_highlighted": False, "display_order": 4},
                {"area_name": "Lathikata", "description": "High growth potential area", "rate": 550, "trend": "new", "change_percent": "New", "is_highlighted": True, "display_order": 5},
                {"area_name": "Sector 19", "description": "Well-planned residential sector", "rate": 3200, "trend": "up", "change_percent": "+6%", "is_highlighted": False, "display_order": 6},
            ]
            for data in price_data:
                db.add(PriceIndex(**data))
            print("Price Index data seeded")

        # Seed Area Guide data
        if db.query(AreaGuide).count() == 0:
            area_data = [
                {
                    "name": "Chhend Colony",
                    "tagline": "The Family Paradise",
                    "short_description": "Best residential hub with top schools and parks for families.",
                    "full_description": "Chhend Colony stands as Rourkela's most sought-after residential destination, offering the perfect blend of urban convenience and peaceful living. Known for its tree-lined streets and well-maintained infrastructure, this locality is ideal for families seeking quality education and green spaces.",
                    "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
                    "rating": 4.8,
                    "price_range": "₹2,000 - ₹2,500 /sq.ft",
                    "amenities": [
                        {"icon": "school", "name": "Schools", "count": "8+ Schools", "detail": "DAV, DPS, St. Paul's nearby"},
                        {"icon": "hospital", "name": "Hospitals", "count": "3 Hospitals", "detail": "IGH, Apollo within 2km"},
                        {"icon": "tree", "name": "Parks", "count": "5+ Parks", "detail": "Chhend Park, Children's Garden"},
                        {"icon": "shopping", "name": "Markets", "count": "2 Markets", "detail": "Main Market, Daily Bazaar"}
                    ],
                    "highlights": ["Family-friendly environment", "Well-connected roads", "Low crime rate", "24/7 water supply"],
                    "display_order": 1
                },
                {
                    "name": "Civil Township",
                    "tagline": "Premium Living Zone",
                    "short_description": "Premium locality with Steel Plant proximity and modern amenities.",
                    "full_description": "Civil Township represents the pinnacle of residential living in Rourkela. Developed primarily for Steel Plant employees, this area boasts excellent infrastructure, wide roads, and a strong community feel. Property values here have shown consistent appreciation over the years.",
                    "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                    "rating": 4.9,
                    "price_range": "₹4,000 - ₹5,000 /sq.ft",
                    "amenities": [
                        {"icon": "school", "name": "Schools", "count": "10+ Schools", "detail": "RSP Schools, Kendriya Vidyalaya"},
                        {"icon": "hospital", "name": "Hospitals", "count": "4 Hospitals", "detail": "ISP Hospital, SAIL Hospital"},
                        {"icon": "tree", "name": "Parks", "count": "8+ Parks", "detail": "Ispat Stadium, Sector Parks"},
                        {"icon": "road", "name": "Connectivity", "count": "Excellent", "detail": "Direct NH connection"}
                    ],
                    "highlights": ["Premium infrastructure", "Steel Plant proximity", "High appreciation rate", "Elite neighborhood"],
                    "display_order": 2
                },
                {
                    "name": "Koel Nagar",
                    "tagline": "Commercial Hub",
                    "short_description": "Emerging commercial zone with excellent business potential.",
                    "full_description": "Koel Nagar is rapidly transforming into Rourkela's commercial powerhouse. With new shopping complexes, office spaces, and residential apartments, this area offers excellent investment opportunities. Its strategic location makes it perfect for businesses and working professionals.",
                    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
                    "rating": 4.5,
                    "price_range": "₹2,500 - ₹3,200 /sq.ft",
                    "amenities": [
                        {"icon": "shopping", "name": "Shopping", "count": "5+ Malls", "detail": "City Centre, Pantaloons"},
                        {"icon": "hospital", "name": "Hospitals", "count": "2 Hospitals", "detail": "Private clinics, nursing homes"},
                        {"icon": "transport", "name": "Transport", "count": "Bus Stand", "detail": "Auto, Bus connectivity"},
                        {"icon": "school", "name": "Colleges", "count": "3 Colleges", "detail": "NIT Rourkela nearby"}
                    ],
                    "highlights": ["Business opportunities", "Growing infrastructure", "Investment hotspot", "Youth-friendly area"],
                    "display_order": 3
                },
                {
                    "name": "Vedvyas",
                    "tagline": "Spiritual & Peaceful",
                    "short_description": "Religious significance with nature and peaceful surroundings.",
                    "full_description": "Vedvyas offers a unique blend of spiritual significance and natural beauty. Home to the famous Vedvyas Temple, this area attracts both devotees and nature lovers. With the Brahmani and Koel rivers meeting here, it's perfect for those seeking a peaceful lifestyle away from city hustle.",
                    "image": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
                    "rating": 4.3,
                    "price_range": "₹700 - ₹1,000 /sq.ft",
                    "amenities": [
                        {"icon": "tree", "name": "Nature", "count": "River Front", "detail": "Brahmani-Koel Sangam"},
                        {"icon": "heart", "name": "Temples", "count": "5+ Temples", "detail": "Vedvyas Mandir, Hanuman Temple"},
                        {"icon": "school", "name": "Schools", "count": "3 Schools", "detail": "Local schools available"},
                        {"icon": "road", "name": "Connectivity", "count": "Good", "detail": "NH-143 accessible"}
                    ],
                    "highlights": ["Spiritual environment", "Natural beauty", "Budget-friendly plots", "Future development planned"],
                    "display_order": 4
                },
                {
                    "name": "Lathikata",
                    "tagline": "Investment Goldmine",
                    "short_description": "High growth potential area with lowest entry prices.",
                    "full_description": "Lathikata is the emerging star of Rourkela's real estate market. With planned industrial development and upcoming infrastructure projects, this area offers the lowest entry point with the highest growth potential. Smart investors are already acquiring land here for future gains.",
                    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
                    "rating": 4.0,
                    "price_range": "₹450 - ₹650 /sq.ft",
                    "amenities": [
                        {"icon": "industry", "name": "Industry", "count": "Upcoming", "detail": "Industrial corridor planned"},
                        {"icon": "road", "name": "Roads", "count": "Developing", "detail": "NH expansion underway"},
                        {"icon": "school", "name": "Schools", "count": "2 Schools", "detail": "Govt. schools available"},
                        {"icon": "tree", "name": "Land", "count": "Agricultural", "detail": "Large plots available"}
                    ],
                    "highlights": ["Lowest prices", "Highest ROI potential", "Large plot availability", "Industrial development"],
                    "display_order": 5
                },
                {
                    "name": "Sector 19",
                    "tagline": "Planned Living",
                    "short_description": "Well-planned residential sector with modern infrastructure.",
                    "full_description": "Sector 19 exemplifies planned urban development in Rourkela. With organized plots, wide roads, and proper drainage systems, this sector offers hassle-free living. The area is well-connected to main city areas while maintaining a calm residential atmosphere.",
                    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
                    "rating": 4.6,
                    "price_range": "₹3,000 - ₹3,500 /sq.ft",
                    "amenities": [
                        {"icon": "school", "name": "Schools", "count": "6+ Schools", "detail": "CBSE & ICSE schools"},
                        {"icon": "hospital", "name": "Hospitals", "count": "2 Hospitals", "detail": "Multi-specialty nearby"},
                        {"icon": "tree", "name": "Parks", "count": "4 Parks", "detail": "Sector parks, playgrounds"},
                        {"icon": "road", "name": "Roads", "count": "Wide Roads", "detail": "40-60 ft main roads"}
                    ],
                    "highlights": ["Planned layout", "Modern infrastructure", "Good resale value", "Family-oriented"],
                    "display_order": 6
                }
            ]
            for data in area_data:
                db.add(AreaGuide(**data))
            print("Area Guide data seeded")

        # Seed sample properties
        if db.query(Property).count() == 0:
            property_data = [
                {
                    "title": "Premium Corner Plot",
                    "description": "Prime corner plot in the heart of Civil Township. Perfect for building your dream home with excellent surroundings and 24/7 security.",
                    "location": "Civil Township, Rourkela",
                    "area": "Civil Township",
                    "price": "1.25 Crore",
                    "price_per_sqft": "2,500",
                    "size": "5,000",
                    "property_type": "Residential",
                    "images": [
                        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
                        "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=1200"
                    ],
                    "thumbnail": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
                    "features": ["Corner Plot", "Park Facing", "40ft Wide Road", "All Utilities Available"],
                    "status": "Available",
                    "is_new": True,
                    "is_featured": True
                },
                {
                    "title": "Commercial Plot",
                    "description": "Excellent commercial plot on main boulevard. Ideal for plaza, shopping center, or corporate office building.",
                    "location": "Koel Nagar, Rourkela",
                    "area": "Koel Nagar",
                    "price": "2.50 Crore",
                    "price_per_sqft": "3,125",
                    "size": "8,000",
                    "property_type": "Commercial",
                    "images": [
                        "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=1200",
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
                    ],
                    "thumbnail": "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800",
                    "features": ["Main Boulevard", "Commercial Zone", "High Foot Traffic", "Near Main Gate"],
                    "status": "Available",
                    "is_new": True,
                    "is_featured": False
                },
                {
                    "title": "Residential Plot",
                    "description": "Beautiful residential plot in prime Chhend location. Walking distance to markets, schools, and hospitals.",
                    "location": "Chhend Colony, Rourkela",
                    "area": "Chhend Colony",
                    "price": "55 Lac",
                    "price_per_sqft": "2,200",
                    "size": "2,500",
                    "property_type": "Residential",
                    "images": [
                        "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=1200",
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"
                    ],
                    "thumbnail": "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800",
                    "features": ["Prime Location", "Near Market", "Schools Nearby", "Peaceful Area"],
                    "status": "Available",
                    "is_new": False,
                    "is_featured": True
                },
                {
                    "title": "Farm House Land",
                    "description": "Spacious farm house land with scenic views. Perfect for weekend retreat or agriculture investment.",
                    "location": "Vedvyas, Rourkela",
                    "area": "Vedvyas",
                    "price": "42 Lac",
                    "price_per_sqft": "850",
                    "size": "5,000",
                    "property_type": "Farm House",
                    "images": [
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
                        "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200"
                    ],
                    "thumbnail": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
                    "features": ["Scenic Views", "Water Available", "Boundary Wall", "Green Belt"],
                    "status": "Available",
                    "is_new": True,
                    "is_featured": False
                }
            ]
            for data in property_data:
                db.add(Property(**data))
            print("Properties data seeded")

        # Seed Site Settings
        if db.query(SiteSettings).count() == 0:
            site_settings = SiteSettings(
                hero_title="Land Deals, Made Easy.",
                hero_subtitle="GOACRES: Your Trust, Our Land.",
                hero_image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920",
                hero_cta_text="Explore Plots",
                locations=["Civil Township", "Chhend Colony", "Koel Nagar", "Vedvyas", "Lathikata", "Sector 19"],
                budgets=["Under 25 Lac", "25-50 Lac", "50 Lac - 1 Cr", "Above 1 Cr"],
                contact_phone="+91 98765 43210",
                contact_email="info@goacres.com",
                contact_address="Rourkela, Odisha, India",
                facebook_url="https://facebook.com/goacres",
                instagram_url="https://instagram.com/goacres",
                youtube_url="https://youtube.com/goacres",
                whatsapp_number="+919876543210"
            )
            db.add(site_settings)
            print("Site Settings seeded")

        # Seed Features (5 Pillars of Trust)
        if db.query(Feature).count() == 0:
            features_data = [
                {"icon": "shield", "title": "Verified Listings", "description": "Every property is legally verified and documented for your peace of mind.", "display_order": 1},
                {"icon": "map", "title": "Prime Locations", "description": "Strategically located plots in Rourkela's most promising areas.", "display_order": 2},
                {"icon": "file-text", "title": "Clear Documentation", "description": "Complete paperwork assistance from agreement to registration.", "display_order": 3},
                {"icon": "users", "title": "Expert Guidance", "description": "Dedicated relationship managers to guide you throughout.", "display_order": 4},
                {"icon": "trending-up", "title": "Best Value", "description": "Competitive pricing with high appreciation potential.", "display_order": 5}
            ]
            for data in features_data:
                db.add(Feature(**data))
            print("Features seeded")

        # Seed Stats
        if db.query(Stat).count() == 0:
            stats_data = [
                {"number": "500+", "label": "Happy Families", "display_order": 1},
                {"number": "50+", "label": "Premium Locations", "display_order": 2},
                {"number": "15+", "label": "Years Experience", "display_order": 3},
                {"number": "100%", "label": "Legal Verified", "display_order": 4}
            ]
            for data in stats_data:
                db.add(Stat(**data))
            print("Stats seeded")

        # Seed Testimonials
        if db.query(Testimonial).count() == 0:
            testimonials_data = [
                {"name": "Rajesh Kumar", "location": "Civil Township", "text": "Excellent service! Found my dream plot within budget. The team was very professional and helped with all paperwork.", "rating": 5, "display_order": 1},
                {"name": "Priya Sharma", "location": "Chhend Colony", "text": "Very trustworthy and transparent. They showed us multiple options and helped us make the right decision for our family.", "rating": 5, "display_order": 2},
                {"name": "Amit Patel", "location": "Koel Nagar", "text": "Best real estate experience in Rourkela. Their knowledge of local areas and pricing is unmatched.", "rating": 5, "display_order": 3}
            ]
            for data in testimonials_data:
                db.add(Testimonial(**data))
            print("Testimonials seeded")

        # Seed Benefits
        if db.query(Benefit).count() == 0:
            benefits_data = [
                {"text": "100% Legal & Verified Properties", "display_order": 1},
                {"text": "Transparent Pricing - No Hidden Costs", "display_order": 2},
                {"text": "End-to-End Documentation Support", "display_order": 3},
                {"text": "Site Visits Arranged Anytime", "display_order": 4},
                {"text": "15+ Years of Local Expertise", "display_order": 5},
                {"text": "Post-Sale Support & Assistance", "display_order": 6}
            ]
            for data in benefits_data:
                db.add(Benefit(**data))
            print("Benefits seeded")

        db.commit()
        print("Database seeding completed!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed data
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield
    # Shutdown: cleanup if needed
    pass

# Create FastAPI app
app = FastAPI(
    title="GOACRES API",
    version=settings.APP_VERSION,
    description="Backend API for GOACRES - Premium Real Estate Platform",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(properties_router)
app.include_router(enquiries_router)
app.include_router(price_index_router)
app.include_router(area_guide_router)
app.include_router(calculator_router)
app.include_router(site_settings_router)
app.include_router(features_router)
app.include_router(stats_router)
app.include_router(testimonials_router)
app.include_router(benefits_router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to M² Properties API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
