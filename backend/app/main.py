from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
import json
import random
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI(
    title="IQFieldBot API",
    description="Personalized IQ Testing Chatbot API by Praise Enato",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
API_SECRET = os.getenv("API_SECRET", "demo-secret-key")

# Models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    name: str
    preferred_fields: List[str] = []
    total_score: int = 0
    tests_completed: int = 0

class Question(BaseModel):
    id: str
    field: str
    difficulty: str
    question: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: Optional[str] = None
    type: str

class AnswerSubmission(BaseModel):
    question_id: str
    answer: str

class TestSession(BaseModel):
    id: str
    user_id: str
    field: str
    score: int = 0
    questions_answered: int = 0
    correct_answers: int = 0
    current_difficulty: str = "easy"
    consecutive_correct: int = 0
    start_time: datetime
    end_time: Optional[datetime] = None

# In-memory storage (replace with DynamoDB in production)
users_db = {}
sessions_db = {}
questions_db = {}

# Load question templates
def load_question_templates():
    """Load question templates from JSON files"""
    templates = {}
    fields = ['math', 'logic', 'programming', 'language', 'science', 'general']
    
    for field in fields:
        templates[field] = {
            'easy': generate_template_questions(field, 'easy', 20),
            'medium': generate_template_questions(field, 'medium', 20),
            'hard': generate_template_questions(field, 'hard', 20)
        }
    
    return templates

def generate_template_questions(field: str, difficulty: str, count: int) -> List[Question]:
    """Generate template questions for a specific field and difficulty"""
    questions = []
    
    templates = {
        'math': {
            'easy': [
                ("What is {a} + {b}?", "number", lambda a, b: str(a + b)),
                ("What is {a} × {b}?", "number", lambda a, b: str(a * b)),
                ("What is {a} - {b}?", "number", lambda a, b: str(a - b)),
            ],
            'medium': [
                ("Solve for x: {a}x + {b} = {c}", "number", lambda a, b, c: str((c - b) // a) if (c - b) % a == 0 else str((c - b) / a)),
                ("What is the square root of {a}?", "number", lambda a: str(int(a ** 0.5))),
            ],
            'hard': [
                ("If f(x) = {a}x² + {b}x + {c}, what is f({d})?", "number", lambda a, b, c, d: str(a * d * d + b * d + c)),
            ]
        },
        'logic': {
            'easy': [
                ("Complete the sequence: 2, 4, 6, 8, ?", "number", lambda: "10"),
                ("What comes next: A, B, C, D, ?", "multiple_choice", lambda: "E"),
            ],
            'medium': [
                ("If all roses are flowers and all flowers are plants, then all roses are plants. True or False?", "multiple_choice", lambda: "True"),
            ],
            'hard': [
                ("In a logic puzzle with 5 people, if A is taller than B, B is taller than C, C is taller than D, and D is taller than E, who is the shortest?", "text", lambda: "E"),
            ]
        }
    }
    
    field_templates = templates.get(field, templates['math'])
    difficulty_templates = field_templates.get(difficulty, field_templates['easy'])
    
    for i in range(count):
        template = random.choice(difficulty_templates)
        question_text = template[0]
        question_type = template[1]
        answer_func = template[2]
        
        # Generate random values
        if field == 'math':
            if difficulty == 'easy':
                a, b = random.randint(1, 50), random.randint(1, 50)
                if 'square root' in question_text:
                    perfect_squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]
                    a = random.choice(perfect_squares)
                    question_text = question_text.format(a=a)
                    correct_answer = answer_func(a)
                else:
                    question_text = question_text.format(a=a, b=b)
                    correct_answer = answer_func(a, b)
            elif difficulty == 'medium':
                a, b, c = random.randint(1, 10), random.randint(1, 20), random.randint(10, 50)
                question_text = question_text.format(a=a, b=b, c=c)
                correct_answer = answer_func(a, b, c)
            else:  # hard
                a, b, c, d = random.randint(1, 5), random.randint(1, 10), random.randint(1, 10), random.randint(1, 5)
                question_text = question_text.format(a=a, b=b, c=c, d=d)
                correct_answer = answer_func(a, b, c, d)
        else:
            question_text = template[0]
            correct_answer = answer_func()
        
        options = None
        if question_type == "multiple_choice" and field == 'logic':
            if "True or False" in question_text:
                options = ["True", "False"]
            elif "A, B, C, D" in question_text:
                options = ["E", "F", "G", "H"]
        
        question = Question(
            id=f"{field}_{difficulty}_{i+1}",
            field=field,
            difficulty=difficulty,
            question=question_text,
            options=options,
            correct_answer=correct_answer,
            type=question_type,
            explanation=f"This is a {difficulty} {field} question."
        )
        questions.append(question)
    
    return questions

# Load questions on startup
question_templates = load_question_templates()

# Helper functions
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify API token"""
    if credentials.credentials != API_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    return credentials

def get_user_by_email(email: str) -> Optional[User]:
    """Get user by email"""
    for user in users_db.values():
        if user.email == email:
            return user
    return None

# Routes
@app.get("/")
async def root():
    return {"message": "IQFieldBot API - Personalized IQ Testing by Praise Enato"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/auth/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    if get_user_by_email(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(len(users_db) + 1)
    user = User(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        preferred_fields=[],
        total_score=0,
        tests_completed=0
    )
    
    users_db[user_id] = user
    return {"success": True, "user": user, "token": API_SECRET}

@app.post("/api/auth/login")
async def login(login_data: UserLogin):
    """Login user"""
    user = get_user_by_email(login_data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"success": True, "user": user, "token": API_SECRET}

@app.get("/api/questions/{field}/{difficulty}")
async def get_question(field: str, difficulty: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get a random question for the specified field and difficulty"""
    verify_token(credentials)
    
    if field not in question_templates:
        raise HTTPException(status_code=400, detail="Invalid field")
    
    if difficulty not in ['easy', 'medium', 'hard']:
        raise HTTPException(status_code=400, detail="Invalid difficulty")
    
    questions = question_templates[field][difficulty]
    if not questions:
        # Generate question using OpenAI (mock implementation)
        question = await generate_ai_question(field, difficulty)
        return question
    
    # Return random template question
    question = random.choice(questions)
    return question

@app.post("/api/questions/submit")
async def submit_answer(submission: AnswerSubmission, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Submit an answer and get evaluation"""
    verify_token(credentials)
    
    # Find the question
    question = None
    for field_questions in question_templates.values():
        for difficulty_questions in field_questions.values():
            for q in difficulty_questions:
                if q.id == submission.question_id:
                    question = q
                    break
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Evaluate answer
    user_answer = submission.answer.strip().lower()
    correct_answer = question.correct_answer.strip().lower()
    is_correct = user_answer == correct_answer
    
    return {
        "is_correct": is_correct,
        "correct_answer": question.correct_answer,
        "explanation": question.explanation
    }

@app.post("/api/sessions")
async def create_session(session_data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Create a new test session"""
    verify_token(credentials)
    
    session_id = str(len(sessions_db) + 1)
    session = TestSession(
        id=session_id,
        user_id=session_data["user_id"],
        field=session_data["field"],
        start_time=datetime.now()
    )
    
    sessions_db[session_id] = session
    return {"success": True, "session": session}

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get session details"""
    verify_token(credentials)
    
    session = sessions_db.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session

@app.put("/api/sessions/{session_id}")
async def update_session(session_id: str, session_data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Update session"""
    verify_token(credentials)
    
    session = sessions_db.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Update session fields
    for key, value in session_data.items():
        if hasattr(session, key):
            setattr(session, key, value)
    
    sessions_db[session_id] = session
    return {"success": True, "session": session}

async def generate_ai_question(field: str, difficulty: str) -> Question:
    """Generate a question using OpenAI API (mock implementation)"""
    # This would integrate with OpenAI API in production
    # For now, return a mock generated question
    
    prompts = {
        'math': f"Generate a {difficulty} mathematics question",
        'logic': f"Generate a {difficulty} logic puzzle",
        'programming': f"Generate a {difficulty} programming question",
        'language': f"Generate a {difficulty} language arts question",
        'science': f"Generate a {difficulty} science question",
        'general': f"Generate a {difficulty} general knowledge question"
    }
    
    # Mock generated question
    question = Question(
        id=f"ai_generated_{random.randint(1000, 9999)}",
        field=field,
        difficulty=difficulty,
        question=f"AI Generated {difficulty} {field} question: What is 2 + 2?",
        type="number",
        correct_answer="4",
        explanation="This is a simple addition problem."
    )
    
    return question

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)