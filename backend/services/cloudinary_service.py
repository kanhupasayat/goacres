import cloudinary
import cloudinary.uploader
from config import settings


def configure_cloudinary():
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


async def upload_image(file_bytes: bytes, filename: str) -> str:
    """Upload image to Cloudinary and return the secure URL."""
    configure_cloudinary()
    result = cloudinary.uploader.upload(
        file_bytes,
        folder="goacres/plots",
        public_id=filename.rsplit(".", 1)[0],
        overwrite=True,
        resource_type="image",
        transformation=[
            {"width": 1200, "height": 800, "crop": "limit", "quality": "auto", "fetch_format": "auto"}
        ],
    )
    return result["secure_url"]
