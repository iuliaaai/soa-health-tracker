from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import app.utils

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
users_db = {}  # Temporary in-memory database for simplicity

router = APIRouter()

class User(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=app.utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, app.utils.SECRET_KEY, algorithm=app.utils.ALGORITHM)

@router.post("/register")
def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = pwd_context.hash(user.password)
    users_db[user.username] = hashed_password
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
def login(user: User):
    hashed_password = users_db.get(user.username)
    if not hashed_password or not pwd_context.verify(user.password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}
