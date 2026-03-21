"""
Seed script: Add plots into MongoDB.
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
