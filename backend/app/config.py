import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Configuration
    API_SECRET = os.getenv("API_SECRET", "demo-secret-key-change-in-production")
    
    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    
    # Database Configuration
    DYNAMODB_REGION = os.getenv("AWS_REGION", "us-east-1")
    DYNAMODB_TABLE_USERS = os.getenv("DYNAMODB_TABLE_USERS", "iqfieldbot-users")
    DYNAMODB_TABLE_SESSIONS = os.getenv("DYNAMODB_TABLE_SESSIONS", "iqfieldbot-sessions")
    DYNAMODB_TABLE_QUESTIONS = os.getenv("DYNAMODB_TABLE_QUESTIONS", "iqfieldbot-questions")
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key")
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRATION_HOURS = 24
    
    # Application Settings
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    
    # Question Generation
    MAX_TEMPLATE_QUESTIONS = 60  # 20 easy, 20 medium, 20 hard per field
    DIFFICULTY_INCREASE_THRESHOLD = 2  # Consecutive correct answers needed

settings = Settings()