import json
from datetime import datetime, timezone
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse, JSONResponse
from database import get_db
from routes.auth import get_current_admin
from config import settings

router = APIRouter(tags=["Push Notifications"])


@router.post("/api/push/subscribe")
async def push_subscribe(request: Request):
    """Save push subscription from browser."""
    try:
        data = await request.json()
        subscription = data.get("subscription")
        if not subscription or not subscription.get("endpoint"):
            return JSONResponse({"error": "Invalid subscription"}, status_code=400)

        db = get_db()

        # Check if already exists
        existing = await db.push_subscribers.find_one({"endpoint": subscription["endpoint"]})
        if existing:
            # Update keys and reactivate
            await db.push_subscribers.update_one(
                {"endpoint": subscription["endpoint"]},
                {"$set": {
                    "keys": subscription.get("keys", {}),
                    "is_active": True,
                    "updated_at": datetime.now(timezone.utc),
                }}
            )
            return {"message": "Subscription updated"}

        # Save new subscription
        doc = {
            "endpoint": subscription["endpoint"],
            "keys": subscription.get("keys", {}),
            "device": data.get("device", "Unknown"),
            "is_active": True,
            "subscribed_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        await db.push_subscribers.insert_one(doc)
        return {"message": "Subscribed successfully"}

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@router.post("/api/push/unsubscribe")
async def push_unsubscribe(request: Request):
    """Deactivate a push subscription."""
    try:
        data = await request.json()
        endpoint = data.get("endpoint")
        if not endpoint:
            return JSONResponse({"error": "No endpoint"}, status_code=400)

        db = get_db()
        await db.push_subscribers.update_one(
            {"endpoint": endpoint},
            {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc)}}
        )
        return {"message": "Unsubscribed"}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@router.get("/api/push/vapid-key")
async def get_vapid_key():
    """Return public VAPID key for frontend."""
    return {"publicKey": settings.VAPID_PUBLIC_KEY}


@router.post("/admin/push/send")
async def send_push_notification(request: Request):
    """Admin sends push notification to all subscribers."""
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    form = await request.form()
    title = form.get("push_title", "").strip()
    message = form.get("push_message", "").strip()
    url = form.get("push_url", "").strip() or "https://goacres.in"

    if not title or not message:
        return RedirectResponse("/admin/", status_code=302)

    db = get_db()
    subscribers = await db.push_subscribers.find({"is_active": True}).to_list(length=10000)

    if not subscribers:
        return RedirectResponse("/admin/", status_code=302)

    # Send notifications
    from pywebpush import webpush, WebPushException

    payload = json.dumps({
        "title": title,
        "body": message,
        "url": url,
        "icon": "https://goacres.in/logo.png",
    })

    sent = 0
    failed = 0
    for sub in subscribers:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub["endpoint"],
                    "keys": sub["keys"],
                },
                data=payload,
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims={"sub": f"mailto:{settings.VAPID_EMAIL}"},
            )
            sent += 1
        except WebPushException as e:
            failed += 1
            # If subscription expired/invalid, deactivate it
            if e.response and e.response.status_code in (404, 410):
                await db.push_subscribers.update_one(
                    {"_id": sub["_id"]},
                    {"$set": {"is_active": False}}
                )
        except Exception:
            failed += 1

    # Log the notification
    await db.push_logs.insert_one({
        "title": title,
        "message": message,
        "url": url,
        "sent": sent,
        "failed": failed,
        "total_subscribers": len(subscribers),
        "sent_at": datetime.now(timezone.utc),
        "sent_by": admin.get("email", "admin"),
    })

    return RedirectResponse("/admin/", status_code=302)


@router.post("/admin/push/test")
async def test_push(request: Request):
    """Test push - returns JSON with details instead of redirect."""
    admin = await get_current_admin(request)
    if not admin:
        return JSONResponse({"error": "Not authenticated"}, status_code=401)

    db = get_db()
    subscribers = await db.push_subscribers.find({"is_active": True}).to_list(length=100)

    if not subscribers:
        return JSONResponse({"error": "No subscribers", "count": 0})

    from pywebpush import webpush, WebPushException

    payload = json.dumps({
        "title": "Test Notification",
        "body": "Ye test hai - agar dikhe toh kaam kar raha hai!",
        "url": "https://goacres.in",
        "icon": "https://goacres.in/logo.png",
    })

    results = []
    for sub in subscribers:
        try:
            resp = webpush(
                subscription_info={
                    "endpoint": sub["endpoint"],
                    "keys": sub["keys"],
                },
                data=payload,
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims={"sub": f"mailto:{settings.VAPID_EMAIL}"},
            )
            results.append({
                "endpoint_short": sub["endpoint"][-30:],
                "device": sub.get("device", "?"),
                "status": resp.status_code,
                "response": resp.text[:200] if resp.text else "",
            })
        except WebPushException as e:
            status = e.response.status_code if e.response else 0
            body = e.response.text[:200] if e.response and e.response.text else str(e)[:200]
            results.append({
                "endpoint_short": sub["endpoint"][-30:],
                "device": sub.get("device", "?"),
                "status": status,
                "error": body,
            })
            if e.response and e.response.status_code in (404, 410):
                await db.push_subscribers.update_one(
                    {"_id": sub["_id"]}, {"$set": {"is_active": False}}
                )
        except Exception as e:
            results.append({
                "endpoint_short": sub["endpoint"][-30:],
                "error": str(e)[:200],
            })

    return JSONResponse({
        "total_subscribers": len(subscribers),
        "results": results,
    })


@router.post("/admin/push/clear-logs")
async def clear_push_logs(request: Request):
    """Clear all push notification logs."""
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    await db.push_logs.delete_many({})
    return RedirectResponse("/admin/", status_code=302)


@router.post("/admin/push/clear-subscribers")
async def clear_push_subscribers(request: Request):
    """Clear all push subscribers."""
    admin = await get_current_admin(request)
    if not admin:
        return RedirectResponse("/admin/login", status_code=302)

    db = get_db()
    await db.push_subscribers.delete_many({})
    return RedirectResponse("/admin/", status_code=302)
