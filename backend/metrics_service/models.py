from sqlalchemy import Column, Integer, Float, Date, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    steps = Column(Integer, nullable=False)
    water = Column(Float, nullable=False)
    sleep = Column(Float, nullable=False)
    date = Column(Date, nullable=False)