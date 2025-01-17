from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Metric
from pydantic import BaseModel
from datetime import date
import app.utils
from jose import jwt, JWTError

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class MetricCreate(BaseModel):
    steps: int
    water: float
    sleep: float
    date: date

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def decode_token(token: str):
    try:
        payload = jwt.decode(token, app.utils.SECRET_KEY, algorithms=[app.utils.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/metrics")
def create_metric(metric: MetricCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = decode_token(token) 

    db_metric = Metric(
        user_id=user_id,
        steps=metric.steps,
        water=metric.water,
        sleep=metric.sleep,
        date=metric.date,
    )

    db.add(db_metric)
    db.commit()

    db.refresh(db_metric)

    return {"message": "Metric logged successfully", "metric_id": db_metric.id}

@router.get("/metrics")
def read_metrics(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = decode_token(token)
    return db.query(Metric).filter(Metric.user_id == user_id).all()
