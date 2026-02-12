import json
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
        is_active=form_data.get("is_active") == "on",
        is_featured=form_data.get("is_featured") == "on",
    )
    plot.generate_slug()

    doc = plot.model_dump()
    # Convert PricePerDecimal to plain dict for MongoDB
    doc["price_per_decimal"] = {"min": doc["price_per_decimal"]["min"], "max": doc["price_per_decimal"]["max"]}
    return doc


@router.get("/admin/", response_class=HTMLResponse)
async def dashboard(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    plots = await db.plots.find().sort("created_at", -1).to_list(length=200)
    total = len(plots)
    active = sum(1 for p in plots if p.get("is_active"))
    site_settings = await get_site_settings()

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "plots": plots,
        "total": total,
        "active": active,
        "admin": admin,
        "site_settings": site_settings,
    })


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
    })


@router.post("/admin/plots/add")
async def add_plot(request: Request):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    form = await request.form()
    form_data = {key: form.get(key) for key in form}
    print("FORM DATA:", {k: v for k, v in form_data.items() if 'price' in k or 'title' in k})
    doc = build_plot_doc(form_data)
    print("DOC PRICE:", doc.get("price_per_decimal"))
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)

    db = get_db()

    # Ensure unique slug
    existing = await db.plots.find_one({"slug": doc["slug"]})
    if existing:
        doc["slug"] = doc["slug"] + "-" + str(int(datetime.now(timezone.utc).timestamp()))

    await db.plots.insert_one(doc)
    return RedirectResponse("/admin/", status_code=302)


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
    return RedirectResponse("/admin/", status_code=302)


@router.post("/admin/plots/{plot_id}/delete")
async def delete_plot(request: Request, plot_id: str):
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    await db.plots.delete_one({"_id": ObjectId(plot_id)})
    return RedirectResponse("/admin/", status_code=302)
