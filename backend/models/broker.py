from datetime import datetime, timezone
from pydantic import BaseModel, Field


class BrokerModel(BaseModel):
    name: str
    phone: str
    password_hash: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
