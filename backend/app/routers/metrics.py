from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Metric
from pydantic import BaseModel
from datetime import date
import app.config
from jose import jwt, JWTError
from app.schemas import MetricCreate, MetricBase, MetricResponse

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def decode_token(token: str):
    try:
        payload = jwt.decode(token, app.config.SECRET_KEY, algorithms=[app.config.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Add a new metric
@router.post("/metrics", response_model=MetricResponse)
def create_metric(metric: MetricCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = decode_token(token) 

    new_metric = Metric(
        user_id=user_id,
        steps=metric.steps,
        water=metric.water,
        sleep=metric.sleep,
        date=metric.date,
    )

    db.add(new_metric)
    db.commit()

    db.refresh(new_metric)

    # return {"message": "Metric logged successfully", "metric_id": db_metric.id}
    return new_metric

# Fetch metrics
@router.get("/metrics")
def fetch_metrics(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = decode_token(token)
    metrics = db.query(Metric).filter(Metric.user_id == user_id).all()
    if not metrics:
        raise HTTPException(status_code=404, detail="No metrics available")
    return metrics

# Delete a metric by ID
@router.delete("/metrics/{metric_id}")
def delete_metric(metric_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = decode_token(token)
    metric = db.query(Metric).filter(Metric.id == metric_id, Metric.user_id == user_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found or not authorized to delete")
    db.delete(metric)
    db.commit()
    return {"message": "Metric deleted successfully"}
