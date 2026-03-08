from datetime import datetime, timezone
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import get_db

router = APIRouter(tags=["Analytics"])


@router.post("/api/track")
async def track_event(request: Request):
    """Track user events — WhatsApp clicks, Call clicks, Plot views."""
    try:
        data = await request.json()
        event_type = data.get("type")  # whatsapp_click, call_click, plot_view
        if event_type not in ("whatsapp_click", "call_click", "plot_view"):
            return JSONResponse({"error": "Invalid event type"}, status_code=400)

        db = get_db()
        doc = {
            "type": event_type,
            "plot_title": data.get("plotTitle", ""),
            "plot_slug": data.get("plotSlug", ""),
            "page": data.get("page", ""),
            "device": data.get("device", "Unknown"),
            "timestamp": datetime.now(timezone.utc),
        }
        await db.analytics.insert_one(doc)
        return {"message": "Tracked"}
    except Exception:
        return JSONResponse({"error": "Failed"}, status_code=500)
