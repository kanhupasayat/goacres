from datetime import datetime, timezone
from pydantic import BaseModel, Field


class UserModel(BaseModel):
    email: str
    password_hash: str
    name: str = "Admin"
    is_admin: bool = True
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
