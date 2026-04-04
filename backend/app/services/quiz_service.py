import os
import json
import PyPDF2
from typing import Optional, List
from fastapi import UploadFile, HTTPException
from openai import OpenAI, OpenAIError, RateLimitError
from app.core.config import settings
from app.core.db import get_database
from datetime import datetime
from bson import ObjectId

class QuizService:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )

    async def extract_text_from_pdf(self, file: UploadFile) -> str:
        try:
            pdf_reader = PyPDF2.PdfReader(file.file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            if not text.strip():
                raise ValueError("Could not extract any text from the provided PDF file.")
            return text
        except Exception as e:
            raise Exception(f"PDF Extraction Error: {str(e)}")

    def _clean_quiz_data(self, raw_data: dict) -> dict:
        """Forcefully normalizes quiz data to match the expected frontend schema."""
        if not isinstance(raw_data, dict):
            return {"title": "Error Quiz", "questions": []}
            
        # 1. Normalize top-level keys to lowercase
        clean_data = {str(k).lower(): v for k, v in raw_data.items() if k}
        
        # 2. Extract and clean questions
        q_key = next((k for k in clean_data.keys() if k.lower() == "questions"), "questions")
        raw_questions = clean_data.get(q_key, [])
        if not isinstance(raw_questions, list):
            raw_questions = []
            
        clean_questions = []
        for q in raw_questions:
            if not isinstance(q, dict): continue
            
            # Normalize internal question keys
            q_norm = {str(k).lower(): v for k, v in q.items() if k}
            
            q_text = str(q_norm.get("question", "Question text missing"))
            ans = str(q_norm.get("answer", ""))
            opts = q_norm.get("options", [])
            
            # Ensure options is a list of at least 4 items
            if not isinstance(opts, list) or len(opts) < 2:
                if ans:
                    opts = [ans, "Option B", "Option C", "Option D"]
                else:
                    opts = ["A", "B", "C", "D"]
            
            # Ensure answer is in options and they are all strings
            opts = [str(o) for o in opts]
            ans = str(ans).strip()
            
            # Map "A", "B", "C", "D" to the actual option text if the LLM output a letter
            if ans and ans.upper() in ["A", "B", "C", "D"]:
                idx = ord(ans.upper()) - ord('A')
                if idx < len(opts):
                    ans = opts[idx]

            if ans and ans not in opts:
                opts[0] = ans
                
            # Pad to 4 options if needed
            while len(opts) < 4:
                opts.append(f"Additional Option {len(opts)+1}")

            clean_questions.append({
                "question": q_text,
                "options": opts[:4], # Keep exactly 4
                "answer": ans
            })
            
        return {
            "title": str(clean_data.get("title", "Generated Quiz")),
            "questions": clean_questions
        }

    async def generate_quiz(
        self, 
        file: Optional[UploadFile] = None, 
        text_content: Optional[str] = None,
        num_questions: int = 5,
        difficulty: str = "medium",
        user_id: str = None
    ) -> dict:
        if file:
            text = await self.extract_text_from_pdf(file)
        else:
            text = text_content

        prompt = f"""
        Generate a comprehensive quiz based on the provided text.
        Produce EXACTLY {num_questions} questions.
        
        CRITICAL RULES:
        1. Return ONLY a valid JSON object.
        2. Format: {{"title": "...", "questions": [{{"question": "...", "options": ["...", "...", "...", "..."], "answer": "..."}}]}}
        3. All 4 options must be present for every question.
        4. The 'answer' field MUST contain the EXACT full text of the correct option, NOT a letter (A/B/C/D).
        5. Do not exceed or provide fewer than {num_questions} questions.
        """

        try:
            response = self.client.chat.completions.create(
                model="llama-3.1-8b-instant", 
                messages=[
                    {"role": "system", "content": "You are a professional JSON data generator. You MUST return ONLY valid JSON and absolutely NO other text, conversational preamble, or markdown formatting."},
                    {"role": "user", "content": f"{prompt}\n\nText: {text[:5000]}"}
                ],
                max_tokens=2500 # SAFELY BELOW GROQ'S RATE LIMIT CEILING
            )
        except Exception as e:
            raise Exception(f"AI Generation Error: {str(e)}")

        try:
            content = response.choices[0].message.content
            # Smart JSON Extractor: Find the first and last curly braces
            start_idx = content.find('{')
            end_idx = content.rfind('}')
            
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx + 1]
                raw_quiz = json.loads(json_str)
            else:
                raw_quiz = json.loads(content) # Fallback
        except Exception as e:
            raise Exception(f"Failed to parse AI response. The content was malformed. Error: {str(e)}")
        quiz_data = self._clean_quiz_data(raw_quiz)
        
        # FINAL SAFETY SLICE: Ensure we strictly adhere to the requested count
        try:
            requested_count = int(num_questions)
            quiz_data["questions"] = quiz_data["questions"][:requested_count]
        except (ValueError, TypeError):
            pass
        
        quiz_data["user_id"] = user_id
        quiz_data["difficulty"] = difficulty
        quiz_data["created_at"] = datetime.utcnow()

        db = get_database()
        result = await db.quizzes.insert_one(quiz_data)
        quiz_data["id"] = str(result.inserted_id)
        
        if "_id" in quiz_data: del quiz_data["_id"]
        return quiz_data

    async def get_user_quizzes(self, user_id: str):
        db = get_database()
        cursor = db.quizzes.find({"user_id": user_id})
        quizzes = []
        async for quiz in cursor:
            # Clean and normalize on retrieval
            cleaned = self._clean_quiz_data(quiz)
            cleaned["id"] = str(quiz["_id"])
            quizzes.append(cleaned)
        return quizzes

    async def get_quiz_by_id(self, quiz_id: str, user_id: str):
        db = get_database()
        quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id), "user_id": user_id})
        if quiz:
            # Clean and normalize on retrieval
            cleaned = self._clean_quiz_data(quiz)
            cleaned["id"] = str(quiz["_id"])
            return cleaned
        return quiz

    async def save_quiz_result(self, user_id: str, quiz_id: str, score: int, total_questions: int):
        db = get_database()
        result_data = {
            "user_id": user_id,
            "quiz_id": quiz_id,
            "score": score,
            "total_questions": total_questions,
            "completed_at": datetime.utcnow()
        }
        await db.results.insert_one(result_data)
        return {"message": "Result saved successfully"}
