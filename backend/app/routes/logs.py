from app.ml.anomaly_detector import detect_anomalies
from fastapi import APIRouter, Query
from app.models.log_model import LogCreate
from app.services.log_service import add_log, get_logs
from typing import List

router = APIRouter()

@router.get("/test")
def test_route():
    return {"message": "Logs route working"}

@router.post("/logs")
def create_log(log: LogCreate):
    return add_log(log)

@router.post("/logs/bulk")
def create_bulk_logs(logs: List[LogCreate]):
    return [add_log(log) for log in logs]

@router.get("/logs")
def read_logs(
    level: str | None = Query(None),
    service: str | None = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    return get_logs(level=level, service=service, limit=limit, offset=offset)
@router.get("/logs/anomalies")
def get_log_anomalies():
    logs = get_logs(limit=100, offset=0)
    return detect_anomalies(logs)