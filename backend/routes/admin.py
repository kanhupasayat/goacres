import json
import bcrypt
import re
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from database import get_db
from routes.auth import get_current_admin
from models.plot import PlotModel, PricePerDecimal
from routes.settings import get_site_settings

router = APIRouter(tags=["Admin"])
templates = Jinja2Templates(directory="templates")


def parse_water(value: str):
    """Parse water field from form: 'true', 'false', or 'Borewell'."""
    if value == "true":
        return True
    if value == "false":
        return False
    return value  # "Borewell"


def parse_nearby(nearby_json: str) -> list:
    """Parse nearby places JSON string from form."""
    if not nearby_json or nearby_json.strip() == "":
        return []
    try:
        items = json.loads(nearby_json)
        return [{"type": i["type"], "name": i["name"], "distance": i["distance"]} for i in items if i.get("name")]
    except (json.JSONDecodeError, KeyError):
        return []


def parse_photos(photos_json: str) -> list:
    """Parse photo URLs JSON string from form."""
    if not photos_json or photos_json.strip() == "":
        return []
    try:
        return json.loads(photos_json)
    except json.JSONDecodeError:
        return []


def build_plot_doc(form_data) -> dict:
    """Build a plot document dict from form data."""
    plot = PlotModel(
        title=form_data.get("title", ""),
        location=form_data.get("location", ""),
        type=form_data.get("type", "Residential"),
        highlight=form_data.get("highlight", ""),
        size_range=form_data.get("size_range", ""),
        price_per_decimal=PricePerDecimal(
            min=int(form_data.get("price_min", 0) or 0),
            max=int(form_data.get("price_max", 0) or 0),
        ),
        sqft=int(form_data.get("sqft", 0) or 0),
        decimal=float(form_data.get("decimal", 0) or 0),
        dimensions=form_data.get("dimensions", ""),
        road_width=form_data.get("road_width", ""),
        road_type=form_data.get("road_type", ""),
        facing=form_data.get("facing", ""),
        corner_plot=form_data.get("corner_plot") == "on",
        boundary_wall=form_data.get("boundary_wall") == "on",
        water=parse_water(form_data.get("water", "true")),
        electricity=form_data.get("electricity") == "on",
        landmark=form_data.get("landmark", ""),
        distance_main_road=form_data.get("distance_main_road", ""),
        status=form_data.get("status", "Ready for Construction"),
        nearby=parse_nearby(form_data.get("nearby_json", "")),
        photos=parse_photos(form_data.get("photos_json", "")),
        video=form_data.get("video", "").strip() or None,
        video_type=form_data.get("video_type", "").strip() or None,
        advisor_name=form_data.get("advisor_name", "").strip() or "GOACRES",
        advisor_phone=form_data.get("advisor_phone", "").strip() or "919187428518",
        advisor_photo=form_data.get("advisor_photo", "").strip() or None,
        is_active=form_data.get("is_active") == "on",
        is_featured=form_data.get("is_featured") == "on",
    )
    plot.generate_slug()

    doc = plot.model_dump()
    # Convert PricePerDecimal to plain dict for MongoDB
    doc["price_per_decimal"] = {"min": doc["price_per_decimal"]["min"], "max": doc["price_per_decimal"]["max"]}
    return doc


# ─── Dashboard (overview stats) ───

@router.get("/admin/", response_class=HTMLResponse)
async def dashboard(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    plots = await db.plots.find().to_list(length=200)
    total = len(plots)
    active = sum(1 for p in plots if p.get("is_active"))

    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    wa_today = await db.analytics.count_documents({"type": "whatsapp_click", "timestamp": {"$gte": today_start}})
    call_today = await db.analytics.count_documents({"type": "call_click", "timestamp": {"$gte": today_start}})
    views_today = await db.analytics.count_documents({"type": "plot_view", "timestamp": {"$gte": today_start}})
    wa_total = await db.analytics.count_documents({"type": "whatsapp_click"})
    call_total = await db.analytics.count_documents({"type": "call_click"})
    views_total = await db.analytics.count_documents({"type": "plot_view"})
    push_count = await db.push_subscribers.count_documents({"is_active": True})
    pending_count = await db.pending_plots.count_documents({"status": "pending"})
    broker_count = await db.brokers.count_documents({"is_active": True})

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "admin": admin,
        "active_page": "dashboard",
        "total": total,
        "active": active,
        "push_count": push_count,
        "pending_count": pending_count,
        "broker_count": broker_count,
        "wa_today": wa_today,
        "call_today": call_today,
        "views_today": views_today,
        "wa_total": wa_total,
        "call_total": call_total,
        "views_total": views_total,
    })


# ─── Plots List ───

@router.get("/admin/plots", response_class=HTMLResponse)
async def plots_list(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    plots = await db.plots.find().sort("created_at", -1).to_list(length=200)

    return templates.TemplateResponse("plots_list.html", {
        "request": request,
        "admin": admin,
        "active_page": "plots",
        "plots": plots,
    })


# ─── Notifications ───

@router.get("/admin/notifications", response_class=HTMLResponse)
async def notifications_page(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    plots = await db.plots.find({"is_active": True}).sort("created_at", -1).to_list(length=200)
    push_count = await db.push_subscribers.count_documents({"is_active": True})
    recent_subs = await db.push_subscribers.find({"is_active": True}).sort("subscribed_at", -1).to_list(length=10)
    recent_notifications = await db.push_logs.find().sort("sent_at", -1).to_list(length=10)

    return templates.TemplateResponse("notifications.html", {
        "request": request,
        "admin": admin,
        "active_page": "notifications",
        "plots": plots,
        "push_count": push_count,
        "recent_subs": recent_subs,
        "recent_notifications": recent_notifications,
    })


# ─── Analytics ───

@router.get("/admin/analytics", response_class=HTMLResponse)
async def analytics_page(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    wa_today = await db.analytics.count_documents({"type": "whatsapp_click", "timestamp": {"$gte": today_start}})
    call_today = await db.analytics.count_documents({"type": "call_click", "timestamp": {"$gte": today_start}})
    views_today = await db.analytics.count_documents({"type": "plot_view", "timestamp": {"$gte": today_start}})
    wa_total = await db.analytics.count_documents({"type": "whatsapp_click"})
    call_total = await db.analytics.count_documents({"type": "call_click"})
    views_total = await db.analytics.count_documents({"type": "plot_view"})
    push_count = await db.push_subscribers.count_documents({"is_active": True})
    recent_activity = await db.analytics.find().sort("timestamp", -1).to_list(length=30)

    pipeline = [
        {"$match": {"type": "plot_view", "plot_title": {"$ne": ""}}},
        {"$group": {"_id": "$plot_title", "views": {"$sum": 1}}},
        {"$sort": {"views": -1}},
        {"$limit": 5},
    ]
    popular_plots = await db.analytics.aggregate(pipeline).to_list(length=5)

    return templates.TemplateResponse("analytics_page.html", {
        "request": request,
        "admin": admin,
        "active_page": "analytics",
        "wa_today": wa_today,
        "call_today": call_today,
        "views_today": views_today,
        "wa_total": wa_total,
        "call_total": call_total,
        "views_total": views_total,
        "push_count": push_count,
        "recent_activity": recent_activity,
        "popular_plots": popular_plots,
    })


# ─── Settings ───

@router.get("/admin/settings-page", response_class=HTMLResponse)
async def settings_page(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    site_settings = await get_site_settings()

    return templates.TemplateResponse("settings_page.html", {
        "request": request,
        "admin": admin,
        "active_page": "settings",
        "site_settings": site_settings,
    })


# ─── Plot CRUD ───

@router.get("/admin/plots/add", response_class=HTMLResponse)
async def add_plot_form(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    return templates.TemplateResponse("plot_form.html", {
        "request": request,
        "plot": None,
        "edit_mode": False,
        "admin": admin,
        "active_page": "plots",
    })


@router.post("/admin/plots/add")
async def add_plot(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    form = await request.form()
    form_data = {key: form.get(key) for key in form}
    doc = build_plot_doc(form_data)
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)

    db = get_db()

    # Ensure unique slug
    existing = await db.plots.find_one({"slug": doc["slug"]})
    if existing:
        doc["slug"] = doc["slug"] + "-" + str(int(datetime.now(timezone.utc).timestamp()))

    await db.plots.insert_one(doc)
    return RedirectResponse("/admin/plots", status_code=302)


@router.get("/admin/plots/{plot_id}/edit", response_class=HTMLResponse)
async def edit_plot_form(request: Request, plot_id: str):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    plot = await db.plots.find_one({"_id": ObjectId(plot_id)})
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")

    return templates.TemplateResponse("plot_form.html", {
        "request": request,
        "plot": plot,
        "edit_mode": True,
        "admin": admin,
        "active_page": "plots",
    })


@router.post("/admin/plots/{plot_id}/edit")
async def edit_plot(request: Request, plot_id: str):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    form = await request.form()
    form_data = {key: form.get(key) for key in form}
    doc = build_plot_doc(form_data)
    doc["updated_at"] = datetime.now(timezone.utc)
    # Don't overwrite created_at
    doc.pop("created_at", None)

    db = get_db()
    await db.plots.update_one({"_id": ObjectId(plot_id)}, {"$set": doc})
    return RedirectResponse("/admin/plots", status_code=302)


@router.post("/admin/plots/{plot_id}/delete")
async def delete_plot(request: Request, plot_id: str):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    await db.plots.delete_one({"_id": ObjectId(plot_id)})
    return RedirectResponse("/admin/plots", status_code=302)


# ─── Broker Management ───

@router.get("/admin/brokers", response_class=HTMLResponse)
async def brokers_list(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    brokers = await db.brokers.find().sort("created_at", -1).to_list(length=100)

    return templates.TemplateResponse("brokers.html", {
        "request": request,
        "admin": admin,
        "active_page": "brokers",
        "brokers": brokers,
    })


@router.post("/admin/brokers/add")
async def add_broker(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    form = await request.form()
    name = form.get("name", "").strip()
    phone = form.get("phone", "").strip().replace("+", "").replace(" ", "").replace("-", "")
    password = form.get("password", "").strip()

    if not name or not phone or not password:
        return RedirectResponse("/admin/brokers", status_code=302)

    db = get_db()

    # Check if phone already exists
    existing = await db.brokers.find_one({"phone": phone})
    if existing:
        return RedirectResponse("/admin/brokers", status_code=302)

    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    await db.brokers.insert_one({
        "name": name,
        "phone": phone,
        "password": password,  # Store plain for admin to see/share
        "password_hash": password_hash,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
    })
    return RedirectResponse("/admin/brokers", status_code=302)


@router.post("/admin/brokers/{broker_id}/delete")
async def delete_broker(request: Request, broker_id: str):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    await db.brokers.delete_one({"_id": ObjectId(broker_id)})
    return RedirectResponse("/admin/brokers", status_code=302)


@router.post("/admin/brokers/{broker_id}/toggle")
async def toggle_broker(request: Request, broker_id: str):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    broker = await db.brokers.find_one({"_id": ObjectId(broker_id)})
    if broker:
        await db.brokers.update_one(
            {"_id": ObjectId(broker_id)},
            {"$set": {"is_active": not broker.get("is_active", True)}}
        )
    return RedirectResponse("/admin/brokers", status_code=302)


# ─── Pending Plots ───

@router.get("/admin/pending", response_class=HTMLResponse)
async def pending_plots(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    plots = await db.pending_plots.find({"status": "pending"}).sort("submitted_at", -1).to_list(length=100)

    return templates.TemplateResponse("pending_plots.html", {
        "request": request,
        "admin": admin,
        "active_page": "pending",
        "plots": plots,
    })


@router.post("/admin/pending/{plot_id}/approve")
async def approve_plot(request: Request, plot_id: str):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    pending = await db.pending_plots.find_one({"_id": ObjectId(plot_id)})
    if not pending:
        return RedirectResponse("/admin/pending", status_code=302)

    # Build plot document from pending data
    title = pending.get("title", "")
    location = pending.get("location", "")
    text = f"{title} {location.split(',')[0]}"
    slug = re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

    # Ensure unique slug
    existing = await db.plots.find_one({"slug": slug})
    if existing:
        slug = slug + "-" + str(int(datetime.now(timezone.utc).timestamp()))

    water_val = pending.get("water", "true")
    if water_val == "true":
        water_val = True
    elif water_val == "false":
        water_val = False

    plot_doc = {
        "slug": slug,
        "title": title,
        "location": location,
        "type": pending.get("type", "Residential"),
        "highlight": pending.get("highlight", ""),
        "size_range": "",
        "price_per_decimal": pending.get("price_per_decimal", {"min": 0, "max": 0}),
        "sqft": pending.get("sqft", 0),
        "decimal": pending.get("decimal", 0),
        "dimensions": pending.get("dimensions", ""),
        "road_width": pending.get("road_width", ""),
        "road_type": pending.get("road_type", ""),
        "facing": pending.get("facing", ""),
        "corner_plot": pending.get("corner_plot", False),
        "boundary_wall": pending.get("boundary_wall", False),
        "water": water_val,
        "electricity": pending.get("electricity", True),
        "landmark": pending.get("landmark", ""),
        "distance_main_road": pending.get("distance_main_road", ""),
        "status": "Ready for Construction",
        "nearby": [],
        "photos": pending.get("photos", []),
        "video": pending.get("video"),
        "video_type": None,
        "advisor_name": pending.get("broker_name", "GOACRES"),
        "advisor_phone": pending.get("broker_phone", "919187428518"),
        "advisor_photo": None,
        "is_active": True,
        "is_featured": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    await db.plots.insert_one(plot_doc)
    await db.pending_plots.update_one(
        {"_id": ObjectId(plot_id)},
        {"$set": {"status": "approved"}}
    )
    return RedirectResponse("/admin/pending", status_code=302)


@router.post("/admin/pending/{plot_id}/reject")
async def reject_plot(request: Request, plot_id: str):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    await db.pending_plots.update_one(
        {"_id": ObjectId(plot_id)},
        {"$set": {"status": "rejected"}}
    )
    return RedirectResponse("/admin/pending", status_code=302)
