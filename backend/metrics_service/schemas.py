from pydantic import BaseModel
from datetime import date

class MetricBase(BaseModel):
    steps: int
    water: float
    sleep: float
    date: date

class MetricCreate(MetricBase):
    pass

class MetricResponse(MetricBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True