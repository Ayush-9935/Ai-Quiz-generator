from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional, List
from app.services.quiz_service import QuizService
from app.services.auth_service import get_current_user
from app.models.user import User
from app.models.quiz_result import QuizResultCreate

router = APIRouter()
quiz_service = QuizService()

@router.post("/generate")
async def generate_quiz(
    file: Optional[UploadFile] = File(None),
    text_content: Optional[str] = Form(None),
    num_questions: int = Form(5),
    difficulty: str = Form("medium"),
    current_user: User = Depends(get_current_user)
):
    if not file and not text_content:
        raise HTTPException(status_code=400, detail="Missing source for quiz generation")
    
    try:
        quiz = await quiz_service.generate_quiz(
            file=file,
            text_content=text_content,
            num_questions=num_questions,
            difficulty=difficulty,
            user_id=current_user.id
        )
        return quiz
    except Exception as e:
        error_msg = str(e)
        print(f"CRITICAL 500 ERROR IN /generate: {error_msg}")
        # Write to log file for tracking
        with open("error_trace.log", "a") as f:
            f.write(f"ERROR: {error_msg}\n")
            
        error_msg_lower = error_msg.lower()
        if any(keyword in error_msg_lower for keyword in ["quota", "api", "groq", "limit", "rate limit", "429"]):
            raise HTTPException(status_code=429, detail="API Rate Limit Reached. The AI provider is temporarily busy. Please wait 1-2 minutes and try again.")
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/history")
async def get_quiz_history(current_user: User = Depends(get_current_user)):
    return await quiz_service.get_user_quizzes(current_user.id)

@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str, current_user: User = Depends(get_current_user)):
    return await quiz_service.get_quiz_by_id(quiz_id, current_user.id)

@router.post("/submit-result")
async def submit_quiz_result(
    result_data: QuizResultCreate,
    current_user: User = Depends(get_current_user)
):
    return await quiz_service.save_quiz_result(
        user_id=current_user.id,
        quiz_id=result_data.quiz_id,
        score=result_data.score,
        total_questions=result_data.total_questions
    )
