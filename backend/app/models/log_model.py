from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class LogCreate(BaseModel):
    level: str
    service: str
    message: str

class LogResponse(BaseModel):
    id: UUID
    timestamp: datetime
    level: str
    service: str
    message: str