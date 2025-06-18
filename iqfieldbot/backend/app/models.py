from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: str
    preferred_fields: List[str] = []
    total_score: int = 0
    tests_completed: int = 0
    created_at: datetime = datetime.now()

class QuestionBase(BaseModel):
    field: str
    difficulty: str
    question: str
    type: str
    correct_answer: str
    explanation: Optional[str] = None

class Question(QuestionBase):
    id: str
    options: Optional[List[str]] = None

class AnswerSubmission(BaseModel):
    question_id: str
    answer: str

class TestSessionBase(BaseModel):
    user_id: str
    field: str

class TestSession(TestSessionBase):
    id: str
    score: int = 0
    questions_answered: int = 0
    correct_answers: int = 0
    current_difficulty: str = "easy"
    consecutive_correct: int = 0
    start_time: datetime
    end_time: Optional[datetime] = None

class ApiResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[dict] = None