from app.auth.auth_utils import hash_password, verify_password, create_access_token

fake_users_db = {}


def register_user(email: str, password: str):
    if email in fake_users_db:
        return None

    hashed_pw = hash_password(password)

    fake_users_db[email] = {
        "email": email,
        "password": hashed_pw,
    }

    return fake_users_db[email]


def login_user(email: str, password: str):
    user = fake_users_db.get(email)

    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    token = create_access_token({"sub": email})

    return {
        "access_token": token,
        "token_type": "bearer",
    }