from sqlalchemy.orm import Session
from app.models.db_log import LogDB
from app.models.log_model import LogCreate
from app.config.database import SessionLocal

# Create DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def add_log(log: LogCreate):
    db = next(get_db())

    new_log = LogDB(
        level=log.level,
        service=log.service,
        message=log.message,
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return {
        "id": new_log.id,
        "timestamp": new_log.timestamp,
        "level": new_log.level,
        "service": new_log.service,
        "message": new_log.message,
    }


def get_logs(level=None, service=None, limit=10, offset=0):
    db = next(get_db())

    query = db.query(LogDB)

    if level:
        query = query.filter(LogDB.level == level)

    if service:
        query = query.filter(LogDB.service == service)

    logs = query.order_by(LogDB.timestamp.desc()).offset(offset).limit(limit).all()

    return logs

