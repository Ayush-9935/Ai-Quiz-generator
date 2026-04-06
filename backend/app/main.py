from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, quiz
from app.core.config import settings

from app.core.db import connect_to_mongo, close_mongo_connection

app = FastAPI(title="AI Quiz Generator API")

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://genap-quiz-ai.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["quiz"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Quiz Generator API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
