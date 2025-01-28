from fastapi import FastAPI
from routers import router
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

try:
    Base.metadata.create_all(bind=engine)
except OperationalError:
    print("Make sure the 'users' table exists before starting this service.")

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Allow frontend to communicate with backend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers (Authorization, Content-Type, etc.)
)

# Include metrics router
app.include_router(router, prefix="/api", tags=["Metrics"])

@app.get("/")
def home():
    return {"message": "Welcome to the Metrics Service"}
