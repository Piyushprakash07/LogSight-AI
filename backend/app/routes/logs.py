from app.ml.anomaly_detector import detect_anomalies
from fastapi import APIRouter, Query, Depends
from app.models.log_model import LogCreate
from app.services.log_service import add_log, get_logs
from app.auth.auth_utils import get_current_user
from typing import List

router = APIRouter()

@router.get("/test")
def test_route():
    return {"message": "Logs route working"}

@router.post("/logs")
def create_log(log: LogCreate, current_user: str = Depends(get_current_user)):
    return add_log(log)

@router.post("/logs/bulk")
def create_bulk_logs(logs: List[LogCreate], current_user: str = Depends(get_current_user)):
    return [add_log(log) for log in logs]

@router.get("/logs")
def read_logs(
    level: str | None = Query(None),
    service: str | None = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: str = Depends(get_current_user)
):
    return get_logs(level=level, service=service, limit=limit, offset=offset)

@router.get("/logs/anomalies")
def get_log_anomalies(current_user: str = Depends(get_current_user)):
    logs = get_logs(limit=100, offset=0)
    return detect_anomalies(logs)