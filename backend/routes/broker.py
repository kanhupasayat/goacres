import bcrypt
import json
from datetime import datetime, timezone
from fastapi import APIRouter, Request, UploadFile, File
from fastapi.responses import JSONResponse
from jose import jwt, JWTError

from config import settings
from database import get_db

router = APIRouter(tags=["Broker"])


def normalize_phone(phone: str) -> str:
    """Normalize phone: remove spaces, +, keep digits only."""
    return phone.strip().replace("+", "").replace(" ", "").replace("-", "")


def create_broker_token(phone: str) -> str:
    from routes.auth import create_access_token
    return create_access_token({"sub": phone, "role": "broker"})


async def get_current_broker(request: Request):
    """Get broker from Authorization header."""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth[7:]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("role") != "broker":
            return None
        phone = payload.get("sub")
        if not phone:
            return None
        db = get_db()
        broker = await db.brokers.find_one({"phone": phone, "is_active": True})
        return broker
    except JWTError:
        return None


@router.post("/api/broker/login")
async def broker_login(request: Request):
    """Broker login with phone + password."""
    try:
        data = await request.json()
        phone = normalize_phone(data.get("phone", ""))
        password = data.get("password", "")

        if not phone or not password:
            return JSONResponse({"error": "Phone aur password daalo"}, status_code=400)

        db = get_db()
        broker = await db.brokers.find_one({"phone": phone})

        if not broker:
            return JSONResponse({"error": "Phone number galat hai"}, status_code=401)

        if not broker.get("is_active"):
            return JSONResponse({"error": "Aapka account band hai. Admin se baat karo"}, status_code=401)

        if not bcrypt.checkpw(password.encode("utf-8"), broker["password_hash"].encode("utf-8")):
            return JSONResponse({"error": "Password galat hai"}, status_code=401)

        token = create_broker_token(phone)
        return {
            "token": token,
            "broker": {
                "name": broker["name"],
                "phone": broker["phone"],
            }
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@router.post("/api/broker/submit-plot")
async def submit_plot(request: Request):
    """Broker submits a plot for admin review."""
    broker = await get_current_broker(request)
    if not broker:
        return JSONResponse({"error": "Login karo pehle"}, status_code=401)

    try:
        data = await request.json()

        # Validate required fields
        title = data.get("title", "").strip()
        location = data.get("location", "").strip()
        plot_type = data.get("type", "").strip()

        if not title or not location or not plot_type:
            return JSONResponse({"error": "Plot ka naam, location aur type daalna zaroori hai"}, status_code=400)

        db = get_db()
        doc = {
            "title": title,
            "location": location,
            "type": plot_type,
            "highlight": data.get("highlight", "").strip(),
            "sqft": int(data.get("sqft", 0) or 0),
            "decimal": float(data.get("decimal", 0) or 0),
            "dimensions": data.get("dimensions", "").strip(),
            "price_per_decimal": {
                "min": int(data.get("price_min", 0) or 0),
                "max": int(data.get("price_max", 0) or 0),
            },
            "road_width": data.get("road_width", "").strip(),
            "road_type": data.get("road_type", "").strip(),
            "facing": data.get("facing", "").strip(),
            "corner_plot": data.get("corner_plot", False),
            "boundary_wall": data.get("boundary_wall", False),
            "water": data.get("water", "true"),
            "electricity": data.get("electricity", True),
            "landmark": data.get("landmark", "").strip(),
            "distance_main_road": data.get("distance_main_road", "").strip(),
            "photos": data.get("photos", []),
            "video": data.get("video", "").strip() or None,
            "extra_notes": data.get("extra_notes", "").strip(),
            "broker_id": str(broker["_id"]),
            "broker_name": broker["name"],
            "broker_phone": broker["phone"],
            "status": "pending",
            "submitted_at": datetime.now(timezone.utc),
        }

        await db.pending_plots.insert_one(doc)
        return {"message": "Plot submit ho gaya! Admin approve karega toh site pe dikhega."}

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@router.get("/api/broker/my-submissions")
async def my_submissions(request: Request):
    """Get broker's submitted plots."""
    broker = await get_current_broker(request)
    if not broker:
        return JSONResponse({"error": "Login karo pehle"}, status_code=401)

    db = get_db()
    plots = await db.pending_plots.find(
        {"broker_phone": broker["phone"]}
    ).sort("submitted_at", -1).to_list(length=50)

    result = []
    for p in plots:
        result.append({
            "id": str(p["_id"]),
            "title": p.get("title", ""),
            "location": p.get("location", ""),
            "type": p.get("type", ""),
            "status": p.get("status", "pending"),
            "photo": p["photos"][0] if p.get("photos") else None,
            "submitted_at": p.get("submitted_at", "").isoformat() if p.get("submitted_at") else "",
        })

    return {"submissions": result}


@router.post("/api/broker/upload")
async def broker_upload(request: Request, file: UploadFile = File(...)):
    """Upload photo/video for broker plot submission."""
    broker = await get_current_broker(request)
    if not broker:
        return JSONResponse({"error": "Login karo pehle"}, status_code=401)

    if not file.content_type.startswith(("image/", "video/")):
        return JSONResponse({"error": "Sirf photo ya video upload karo"}, status_code=400)

    # 15MB limit
    contents = await file.read()
    if len(contents) > 15 * 1024 * 1024:
        return JSONResponse({"error": "File 15MB se badi hai"}, status_code=400)

    from services.cloudinary_service import upload_image
    try:
        url = await upload_image(contents, file.filename or "broker_photo.jpg")
        return {"url": url}
    except Exception as e:
        return JSONResponse({"error": f"Upload fail: {str(e)}"}, status_code=500)
