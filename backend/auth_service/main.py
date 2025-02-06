from fastapi import FastAPI
import routers
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend to communicate with backend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers (Authorization, Content-Type, etc.)
)

# Include routers
app.include_router(routers.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
def read_root():
    return {"message": "Hello from auth_service"}