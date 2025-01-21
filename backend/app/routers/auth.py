from fastapi import APIRouter, HTTPException, Depends, Response, Request
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from ..database import SessionLocal
from sqlalchemy.orm import Session
import app.config
from fastapi.security import OAuth2PasswordRequestForm
from ..models import User
from app.schemas import UserCreate, Token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, app.config.SECRET_KEY, algorithm=app.config.ALGORITHM)


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # Query the database for the user
    user = db.query(User).filter(User.username == form_data.username).first()

    # Validate user existence
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Verify the password
    if not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Generate the JWT token
    token_data = {"sub": str(user.id)}  # Use user ID in the token
    access_token = create_access_token(token_data)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True)

    return {"access_token": access_token, "token_type": "bearer"}