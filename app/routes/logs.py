from fastapi import APIRouter
from app.models.log_model import Log
from app.services.log_service import add_log, get_logs

router = APIRouter()

@router.post("/logs")
def create_log(log: Log):
    return add_log(log)

@router.get("/logs")
def read_logs():
    return get_logs()