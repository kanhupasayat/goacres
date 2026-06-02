import bcrypt
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from database import connect_db, close_db, get_db
from routes import auth_router, plots_router, admin_router, upload_router, settings_router, push_router, analytics_router


async def ensure_admin():
    """Create admin user if not exists."""
    db = get_db()
    existing = await db.users.find_one({"email": settings.ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "email": settings.ADMIN_EMAIL,
            "password_hash": bcrypt.hashpw(settings.ADMIN_PASSWORD.encode("utf-8"), bcrypt.gensalt()).decode("utf-8"),
            "name": "Admin",
            "is_admin": True,
            "is_active": True,
        })
        print(f"Admin user created: {settings.ADMIN_EMAIL}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    await ensure_admin()
    print("GOACRES API started")
    yield
    await close_db()
    print("GOACRES API stopped")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for GOACRES - Premium Real Estate Platform",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Routes
app.include_router(auth_router)
app.include_router(plots_router)
app.include_router(admin_router)
app.include_router(upload_router)
app.include_router(settings_router)
app.include_router(push_router)
app.include_router(analytics_router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to GOACRES API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
