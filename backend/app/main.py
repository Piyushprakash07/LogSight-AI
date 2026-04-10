from app.auth import auth_routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import logs

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs.router)
app.include_router(auth_routes.router)

@app.get("/")
def root():
    return {"message": "Hello World"}