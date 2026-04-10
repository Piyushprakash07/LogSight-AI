from sqlalchemy import Column, String, DateTime
from datetime import datetime
from app.config.database import Base
import uuid

class LogDB(Base):
    __tablename__ = "logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, default=datetime.utcnow)
    level = Column(String)
    service = Column(String)
    message = Column(String)