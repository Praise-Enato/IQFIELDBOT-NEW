# 🚀 Quick Start Guide

## For Immediate Testing (5 minutes)

### 1. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
```

### 2. Start Both Servers
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
cd backend
python -m uvicorn app.main:app --reload
```

### 3. Open Browser
Go to: `http://localhost:5173`

## For AWS Deployment (30 minutes)

### 1. Install AWS Tools
```bash
pip install aws-sam-cli awscli
aws configure  # Enter your AWS credentials
```

### 2. Deploy Backend
```bash
cd backend
sam build
sam deploy --guided
```

### 3. Deploy Frontend
```bash
# Update API URL in vite.config.ts with your Lambda URL
npm run build
./deploy-frontend.sh your-unique-bucket-name
```

### 4. Share URL
Your app will be at: `http://your-bucket-name.s3-website-us-east-1.amazonaws.com`

**Total AWS Cost: ~$0-2/month** 💰