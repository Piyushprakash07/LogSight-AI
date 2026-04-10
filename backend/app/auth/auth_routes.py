from fastapi import APIRouter, HTTPException
from app.auth.auth_model import UserRegister, UserLogin, TokenResponse
from app.auth.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(data: UserRegister):
    user = register_user(data.email, data.password)

    if not user:
        raise HTTPException(status_code=400, detail="User already exists")

    return {
        "message": "User registered successfully",
        "email": user["email"],
    }


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin):
    token = login_user(data.email, data.password)

    if not token:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return token