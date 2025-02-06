from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from models import Metric
import database, services
from schemas import MetricCreate, MetricResponse

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Add a new metric
@router.post("/api/metrics", response_model=MetricResponse)
def create_metric(metric: MetricCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    user_id = services.decode_token(token) 

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
@router.get("/api/metrics")
def fetch_metrics(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    user_id = services.decode_token(token)
    metrics = db.query(Metric).filter(Metric.user_id == user_id).all()
    if not metrics:
        raise HTTPException(status_code=404, detail="No metrics available")
    return metrics

# Delete a metric by ID
@router.delete("/api/metrics/{metric_id}")
def delete_metric(metric_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    user_id = services.decode_token(token)
    metric = db.query(Metric).filter(Metric.id == metric_id, Metric.user_id == user_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found or not authorized to delete")
    db.delete(metric)
    db.commit()
    return {"message": "Metric deleted successfully"}
