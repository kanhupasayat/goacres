from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "M² Properties API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./msquare.db"

    # JWT Settings
    SECRET_KEY: str = "msquare-super-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS Settings
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://goacres.com",
        "https://www.goacres.com"
    ]

    # Admin Default Credentials (for initial setup)
    ADMIN_EMAIL: str = "admin@msquare.pk"
    ADMIN_PASSWORD: str = "admin123"

    # WhatsApp Number
    WHATSAPP_NUMBER: str = "923001234567"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
