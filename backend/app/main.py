import os
from app.auth import auth_routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import logs
from app.config.database import engine, Base
from app.models.db_user import UserDB
from app.models.db_log import LogDB

app = FastAPI()

Base.metadata.create_all(bind=engine)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs.router)
app.include_router(auth_routes.router)

@app.get("/")
def root():
    return {"message": "Hello World"}