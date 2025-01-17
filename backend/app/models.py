from sqlalchemy import Column, Integer, Float, Date, String
from app.database import Base

class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True) 
    steps = Column(Integer)
    water = Column(Float)
    sleep = Column(Float)
    date = Column(Date)
