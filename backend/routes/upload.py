from fastapi import APIRouter, Request, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from routes.auth import get_current_admin
from services.cloudinary_service import upload_image

router = APIRouter(tags=["Upload"])


@router.post("/admin/upload")
async def upload_photo(request: Request, file: UploadFile = File(...)):
    """Upload an image to Cloudinary. Returns the URL."""
    admin = await get_current_admin(request)
    if not admin:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    url = await upload_image(contents, file.filename or "plot-image")
    return JSONResponse({"url": url})
