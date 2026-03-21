"""
Seed script: Migrate the 6 existing plots from plots.js into MongoDB.
Run: python seed.py
"""
import asyncio
import bcrypt
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

PLOTS = [
    {
        "slug": "premium-corner-plot-civil-township",
        "title": "Premium Corner Plot",
        "location": "Civil Township, Rourkela",
        "type": "Residential",
        "highlight": "Corner Plot",
        "size_range": "2,000 - 2,500",
        "price_per_decimal": {"min": 180000, "max": 250000},
        "sqft": 2178,
        "decimal": 5,
        "dimensions": "33ft \u00d7 66ft",
        "road_width": "30ft",
        "road_type": "Concrete",
        "facing": "East",
        "corner_plot": True,
        "boundary_wall": True,
        "water": True,
        "electricity": True,
        "landmark": "Near Ispat General Hospital",
        "distance_main_road": "100m from Main Road",
        "status": "Ready for Construction",
        "nearby": [
            {"type": "hospital", "name": "Ispat General Hospital", "distance": "1.2 km"},
            {"type": "school", "name": "DAV Public School", "distance": "800m"},
            {"type": "market", "name": "Civil Township Market", "distance": "500m"},
            {"type": "bank", "name": "SBI Branch", "distance": "400m"},
            {"type": "temple", "name": "Hanuman Vatika", "distance": "1.5 km"},
            {"type": "railway", "name": "Rourkela Railway Station", "distance": "4 km"},
            {"type": "petrol", "name": "HP Petrol Pump", "distance": "600m"},
            {"type": "highway", "name": "NH-143", "distance": "100m"},
        ],
        "photos": [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=900&q=80",
        ],
        "video": "https://www.youtube.com/embed/afH0OsePrAU",
        "video_type": "shorts",
        "is_active": True,
        "is_featured": True,
    },
    {
        "slug": "commercial-plot-sector-19",
        "title": "Commercial Plot - Main Road",
        "location": "Sector 19, Rourkela",
        "type": "Commercial",
        "highlight": "Main Road Facing",
        "size_range": "3,000 - 3,500",
        "price_per_decimal": {"min": 300000, "max": 400000},
        "sqft": 3267,
        "decimal": 7.5,
        "dimensions": "45ft \u00d7 72ft",
        "road_width": "40ft",
        "road_type": "Tar",
        "facing": "North",
        "corner_plot": False,
        "boundary_wall": False,
        "water": True,
        "electricity": True,
        "landmark": "Near Sector 19 Market",
        "distance_main_road": "On Main Road",
        "status": "Ready for Construction",
        "nearby": [
            {"type": "market", "name": "Sector 19 Market", "distance": "200m"},
            {"type": "bank", "name": "HDFC Bank", "distance": "300m"},
            {"type": "hospital", "name": "Hi-Tech Medical", "distance": "2 km"},
            {"type": "bus", "name": "Rourkela Bus Stand", "distance": "1.5 km"},
            {"type": "school", "name": "Kendriya Vidyalaya", "distance": "1 km"},
            {"type": "petrol", "name": "Indian Oil Pump", "distance": "400m"},
            {"type": "railway", "name": "Rourkela Railway Station", "distance": "3 km"},
            {"type": "highway", "name": "Ring Road", "distance": "500m"},
        ],
        "photos": [
            "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=900&q=80",
        ],
        "video": None,
        "video_type": None,
        "is_active": True,
        "is_featured": True,
    },
    {
        "slug": "residential-plot-koel-nagar",
        "title": "Residential Plot - Ready",
        "location": "Koel Nagar, Rourkela",
        "type": "Residential",
        "highlight": "Ready for Construction",
        "size_range": "1,400 - 1,800",
        "price_per_decimal": {"min": 150000, "max": 200000},
        "sqft": 1742,
        "decimal": 4,
        "dimensions": "30ft \u00d7 58ft",
        "road_width": "20ft",
        "road_type": "Concrete",
        "facing": "East",
        "corner_plot": False,
        "boundary_wall": True,
        "water": True,
        "electricity": True,
        "landmark": "Near DAV School",
        "distance_main_road": "200m from NH-143",
        "status": "Ready for Construction",
        "nearby": [
            {"type": "school", "name": "DAV Public School", "distance": "500m"},
            {"type": "hospital", "name": "Rourkela Govt Hospital", "distance": "2 km"},
            {"type": "market", "name": "Koel Nagar Market", "distance": "300m"},
            {"type": "bank", "name": "PNB Branch", "distance": "600m"},
            {"type": "temple", "name": "Jagannath Temple", "distance": "1 km"},
            {"type": "petrol", "name": "BP Petrol Pump", "distance": "700m"},
            {"type": "highway", "name": "NH-143", "distance": "200m"},
            {"type": "park", "name": "Nehru Park", "distance": "1.2 km"},
        ],
        "photos": [
            "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
        ],
        "video": None,
        "video_type": None,
        "is_active": True,
        "is_featured": True,
    },
    {
        "slug": "farm-house-land-vedvyas",
        "title": "Farm House Land",
        "location": "Vedvyas, Rourkela",
        "type": "Farm House",
        "highlight": "Scenic View",
        "size_range": "4,500 - 5,500",
        "price_per_decimal": {"min": 80000, "max": 120000},
        "sqft": 5227,
        "decimal": 12,
        "dimensions": "66ft \u00d7 79ft",
        "road_width": "20ft",
        "road_type": "Tar",
        "facing": "South",
        "corner_plot": False,
        "boundary_wall": False,
        "water": "Borewell",
        "electricity": True,
        "landmark": "Near Vedvyas Temple",
        "distance_main_road": "500m from Main Road",
        "status": "Under Development",
        "nearby": [
            {"type": "temple", "name": "Vedvyas Temple", "distance": "500m"},
            {"type": "river", "name": "Brahmani River", "distance": "1 km"},
            {"type": "market", "name": "Vedvyas Bazar", "distance": "800m"},
            {"type": "hospital", "name": "PHC Vedvyas", "distance": "1.5 km"},
            {"type": "school", "name": "Govt Primary School", "distance": "1 km"},
            {"type": "highway", "name": "Main Road", "distance": "500m"},
        ],
        "photos": [
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1473445730015-841f29a9490b?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?auto=format&fit=crop&w=900&q=80",
        ],
        "video": None,
        "video_type": None,
        "is_active": True,
        "is_featured": True,
    },
    {
        "slug": "budget-friendly-plot-chhend",
        "title": "Budget Friendly Plot",
        "location": "Chhend Colony, Rourkela",
        "type": "Residential",
        "highlight": "Budget Friendly",
        "size_range": "1,000 - 1,400",
        "price_per_decimal": {"min": 100000, "max": 150000},
        "sqft": 1307,
        "decimal": 3,
        "dimensions": "27ft \u00d7 48ft",
        "road_width": "20ft",
        "road_type": "Concrete",
        "facing": "North-East",
        "corner_plot": False,
        "boundary_wall": False,
        "water": True,
        "electricity": True,
        "landmark": "Near Chhend Colony Market",
        "distance_main_road": "300m from Ring Road",
        "status": "Ready for Construction",
        "nearby": [
            {"type": "market", "name": "Chhend Colony Market", "distance": "300m"},
            {"type": "school", "name": "PM High School", "distance": "500m"},
            {"type": "hospital", "name": "Chhend Dispensary", "distance": "800m"},
            {"type": "bank", "name": "SBI ATM", "distance": "200m"},
            {"type": "temple", "name": "Shiv Mandir", "distance": "400m"},
            {"type": "highway", "name": "Ring Road", "distance": "300m"},
            {"type": "bus", "name": "Chhend Bus Stop", "distance": "250m"},
        ],
        "photos": [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
        ],
        "video": None,
        "video_type": None,
        "is_active": True,
        "is_featured": True,
    },
    {
        "slug": "prime-commercial-main-road",
        "title": "Prime Commercial Space",
        "location": "Main Road, Rourkela",
        "type": "Commercial",
        "highlight": "High Footfall Area",
        "size_range": "4,000 - 5,000",
        "price_per_decimal": {"min": 350000, "max": 500000},
        "sqft": 4356,
        "decimal": 10,
        "dimensions": "55ft \u00d7 79ft",
        "road_width": "60ft",
        "road_type": "NH Tar Road",
        "facing": "West",
        "corner_plot": True,
        "boundary_wall": False,
        "water": True,
        "electricity": True,
        "landmark": "Near Rourkela Bus Stand",
        "distance_main_road": "On NH-143",
        "status": "Ready for Construction",
        "nearby": [
            {"type": "bus", "name": "Rourkela Bus Stand", "distance": "500m"},
            {"type": "railway", "name": "Rourkela Railway Station", "distance": "2 km"},
            {"type": "hospital", "name": "Ispat General Hospital", "distance": "3 km"},
            {"type": "bank", "name": "HDFC Bank", "distance": "200m"},
            {"type": "market", "name": "Main Road Market", "distance": "100m"},
            {"type": "petrol", "name": "Indian Oil Pump", "distance": "300m"},
            {"type": "school", "name": "St. Paul School", "distance": "1.5 km"},
            {"type": "highway", "name": "NH-143", "distance": "On Road"},
        ],
        "photos": [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=900&q=80",
        ],
        "video": None,
        "video_type": None,
        "is_active": True,
        "is_featured": True,
    },
    {
        "slug": "maa-janki-vihar-jhirpani",
        "title": "Maa Janki Vihar Colony",
        "location": "Jhirpani, Rourkela",
        "type": "Residential",
        "highlight": "Boundary Wall + Electric Pole FREE",
        "size_range": "1,742 - 4,356",
        "price_per_decimal": {"min": 450000, "max": 450000},
        "sqft": 1742,
        "decimal": 4,
        "dimensions": "Multiple sizes (4/5/6/10 Dismil)",
        "road_width": "20ft",
        "road_type": "Black Top",
        "facing": "East",
        "corner_plot": False,
        "boundary_wall": True,
        "water": True,
        "electricity": True,
        "landmark": "Near Jhirpani Bridge",
        "distance_main_road": "50m from Main Road",
        "status": "Only 4 Plots Left",
        "nearby": [
            {"type": "hospital", "name": "CWS Hospital", "distance": "6 km"},
            {"type": "market", "name": "Koelnagar Market", "distance": "6 km"},
            {"type": "bridge", "name": "Jhirpani Bridge", "distance": "3.5 km"},
            {"type": "highway", "name": "Main Road", "distance": "50m"},
            {"type": "railway", "name": "Jhirpani Railway Station", "distance": "2 km"},
            {"type": "school", "name": "Jhirpani School", "distance": "1 km"},
        ],
        "photos": [
            "https://goacres.in/plots/jhirpani/1.png",
            "https://goacres.in/plots/jhirpani/2.png",
            "https://goacres.in/plots/jhirpani/3.png",
            "https://goacres.in/plots/jhirpani/4.png",
            "https://goacres.in/plots/jhirpani/5.png",
        ],
        "video": None,
        "video_type": None,
        "advisor_name": "Vivek Modak (Shree Modak Developers)",
        "advisor_phone": "916372951141",
        "advisor_photo": None,
        "is_active": True,
        "is_featured": True,
    },
]


async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]

    # Create indexes
    await db.plots.create_index("slug", unique=True)
    await db.plots.create_index("is_active")
    await db.plots.create_index("is_featured")
    await db.users.create_index("email", unique=True)

    # Ensure admin user
    existing_admin = await db.users.find_one({"email": settings.ADMIN_EMAIL})
    if not existing_admin:
        await db.users.insert_one({
            "email": settings.ADMIN_EMAIL,
            "password_hash": hash_password(settings.ADMIN_PASSWORD),
            "name": "Admin",
            "is_admin": True,
            "is_active": True,
        })
        print(f"Admin created: {settings.ADMIN_EMAIL}")
    else:
        print("Admin already exists")

    # Seed plots
    now = datetime.now(timezone.utc)
    inserted = 0
    for plot in PLOTS:
        existing = await db.plots.find_one({"slug": plot["slug"]})
        if not existing:
            plot["created_at"] = now
            plot["updated_at"] = now
            await db.plots.insert_one(plot)
            inserted += 1
            print(f"  Inserted: {plot['title']}")
        else:
            print(f"  Skipped (exists): {plot['title']}")

    print(f"\nDone! {inserted} new plots inserted.")

    # Backfill: set is_featured on existing seed plots that don't have it
    seed_slugs = [p["slug"] for p in PLOTS]
    backfill_result = await db.plots.update_many(
        {"slug": {"$in": seed_slugs}, "is_featured": {"$exists": False}},
        {"$set": {"is_featured": True}},
    )
    if backfill_result.modified_count:
        print(f"Backfilled is_featured=True on {backfill_result.modified_count} existing plots")

    # Set is_featured=False on any plots missing the field
    await db.plots.update_many(
        {"is_featured": {"$exists": False}},
        {"$set": {"is_featured": False}},
    )

    total = await db.plots.count_documents({})
    print(f"Total plots in DB: {total}")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
