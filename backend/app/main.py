from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import SessionLocal, Base, engine
from app.routers import auth
from app.routers import metrics
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend to communicate with backend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers (Authorization, Content-Type, etc.)
)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Create tables at app startup
@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root(db: Session = Depends(get_db)):
    return {"message": "Database connection successful!"}

app.include_router(auth.router, prefix="/auth")
app.include_router(metrics.router, prefix="/api")