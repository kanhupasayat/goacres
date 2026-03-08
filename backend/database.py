from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import certifi
import ssl

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    # Try with certifi CA bundle first, fallback to no cert check
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000,
        )
        await client.admin.command("ping")
    except Exception:
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=10000,
        )
    db = client[settings.MONGODB_DB_NAME]
    # Create indexes
    await db.plots.create_index("slug", unique=True)
    await db.plots.create_index("is_active")
    await db.plots.create_index("is_featured")
    await db.users.create_index("email", unique=True)
    await db.push_subscribers.create_index("endpoint", unique=True)
    await db.push_subscribers.create_index("is_active")
    await db.analytics.create_index("type")
    await db.analytics.create_index("timestamp")


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return db
