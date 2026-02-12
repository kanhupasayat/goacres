from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from database import get_db
from routes.auth import get_current_admin

router = APIRouter(tags=["Settings"])

DEFAULTS = {
    "coming_soon": True,
    "launch_date": "2026-03-22",
    "launch_message": "200+ Premium Plots Launching Soon!",
}


async def get_site_settings():
    """Get site settings from DB, create with defaults if not exists."""
    db = get_db()
    settings = await db.site_settings.find_one({"_id": "site"})
    if not settings:
        settings = {"_id": "site", **DEFAULTS}
        await db.site_settings.insert_one(settings)
    return settings


@router.get("/api/settings")
async def public_settings():
    """Public endpoint — frontend checks coming_soon status."""
    settings = await get_site_settings()
    return {
        "comingSoon": settings.get("coming_soon", True),
        "launchDate": settings.get("launch_date", "2026-03-22"),
        "launchMessage": settings.get("launch_message", ""),
    }


@router.post("/admin/settings")
async def update_settings(request: Request):
    """Admin toggle coming soon mode."""
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    form = await request.form()
    coming_soon = form.get("coming_soon") == "on"
    launch_date = form.get("launch_date", "2026-03-22")
    launch_message = form.get("launch_message", "")

    db = get_db()
    await db.site_settings.update_one(
        {"_id": "site"},
        {"$set": {
            "coming_soon": coming_soon,
            "launch_date": launch_date,
            "launch_message": launch_message,
        }},
        upsert=True,
    )
    return RedirectResponse("/admin/", status_code=302)
