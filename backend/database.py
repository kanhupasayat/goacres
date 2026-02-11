from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    # Create indexes
    await db.plots.create_index("slug", unique=True)
    await db.plots.create_index("is_active")
    await db.plots.create_index("is_featured")
    await db.users.create_index("email", unique=True)


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return db
