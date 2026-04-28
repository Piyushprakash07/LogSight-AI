from sqlalchemy.orm import Session
from app.auth.auth_utils import hash_password, verify_password, create_access_token
from app.models.db_user import UserDB

def register_user(db: Session, email: str, password: str):
    existing_user = db.query(UserDB).filter(UserDB.email == email).first()
    if existing_user:
        return None

    hashed_pw = hash_password(password)

    new_user = UserDB(email=email, password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"email": new_user.email}


def login_user(db: Session, email: str, password: str):
    user = db.query(UserDB).filter(UserDB.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    token = create_access_token({"sub": email})

    return {
        "access_token": token,
        "token_type": "bearer",
    }