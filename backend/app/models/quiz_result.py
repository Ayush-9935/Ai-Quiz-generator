from pydantic import BaseModel
from datetime import datetime

class QuizResultCreate(BaseModel):
    quiz_id: str
    score: int
    total_questions: int

class QuizResult(QuizResultCreate):
    id: str
    user_id: str
    completed_at: datetime

    class Config:
        from_attributes = True
