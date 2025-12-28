"""
AWS Lambda handler for IQFieldBot API
This file adapts the FastAPI app to work with AWS Lambda
"""

from mangum import Mangum
from app.main import app

# Create Lambda handler
lambda_handler = Mangum(app)