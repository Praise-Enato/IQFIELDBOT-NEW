# IQFieldBot - Personalized IQ Testing Chatbot

**Created by Praise Enato**

A sophisticated AI-powered chatbot that tests users' intelligence through personalized puzzles, quizzes, and challenges across multiple fields.

## 🎯 Features

- **Multi-Field Testing**: Math, Logic, Programming, Language Arts, Science, and General Knowledge
- **Adaptive Difficulty**: Dynamically adjusts question difficulty based on performance
- **Template Questions**: 60+ pre-built questions per field (20 easy, 20 medium, 20 hard)
- **AI Question Generation**: Uses OpenAI API when template questions are exhausted
- **User Authentication**: Secure sign-up/sign-in system
- **Performance Tracking**: Comprehensive scoring and progress analytics
- **Modern UI**: Responsive design with smooth animations and professional aesthetics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.9+
- OpenAI API Key (optional, for AI question generation)
- AWS Account (for deployment)

### Local Development

1. **Clone and setup frontend**:
```bash
npm install
npm run dev
```

2. **Setup backend**:
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python -m uvicorn app.main:app --reload
```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Authentication**: Login/signup with validation
- **Dashboard**: Field selection and user statistics
- **Test Interface**: Interactive question presentation with real-time feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend (FastAPI)
- **RESTful API**: Clean, documented endpoints
- **Question Management**: Template system with AI fallback
- **Session Management**: Track user progress and performance
- **Authentication**: Token-based security

### Deployment (AWS)
- **AWS Lambda**: Serverless API hosting
- **API Gateway**: HTTP endpoint management
- **DynamoDB**: User data and session storage
- **S3**: Static file hosting (optional)

## 🧠 How It Works

1. **User Registration**: Users create accounts and select preferred fields
2. **Field Selection**: Choose from 6 different testing domains
3. **Adaptive Testing**: 
   - Starts with easy questions
   - Difficulty increases after 2 consecutive correct answers
   - Uses template questions first, then AI-generated content
4. **Real-time Feedback**: Immediate answer evaluation with explanations
5. **Performance Analytics**: Track scores, completion rates, and improvement

## 📊 Question System

### Template Questions (60 per field)
- **Easy (20)**: Basic concepts and simple calculations
- **Medium (20)**: Intermediate problems requiring logical thinking
- **Hard (20)**: Advanced challenges for expert-level users

### AI Generation
- Seamlessly generates new questions when templates are exhausted
- Maintains difficulty consistency with field-specific prompts
- Uses OpenAI GPT models for natural question creation

## 🛠️ Configuration

### Environment Variables
```bash
# API Configuration
API_SECRET=your-api-secret-key-here

# OpenAI (Optional)
OPENAI_API_KEY=your-openai-api-key-here

# AWS (For deployment)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

## 🚀 Deployment

### AWS Lambda + SAM

1. **Install SAM CLI**:
```bash
pip install aws-sam-cli
```

2. **Deploy**:
```bash
cd backend
sam build
sam deploy --guided
```

3. **Update frontend API endpoint**:
```typescript
// Update vite.config.ts with your API Gateway URL
server: {
  proxy: {
    '/api': {
      target: 'https://your-api-gateway-url.amazonaws.com/dev',
      changeOrigin: true,
    },
  },
}
```

### Alternative: EC2 Deployment

1. **Launch EC2 instance** (t2.micro for free tier)
2. **Setup environment**:
```bash
sudo apt update
sudo apt install python3-pip nodejs npm
git clone your-repo
```

3. **Run services**:
```bash
# Backend
cd backend && pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend
npm install && npm run build
npx serve -s dist -l 3000
```

## 🔒 Security Features

- **API Authentication**: Bearer token validation
- **Input Validation**: Pydantic models for request/response validation
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Secure configuration management

## 📈 Performance Optimizations

- **Question Caching**: Template questions loaded at startup
- **Adaptive Loading**: Lazy load AI questions only when needed
- **Session Management**: Efficient in-memory storage with DynamoDB backup
- **Response Optimization**: Minimal data transfer with focused API responses

## 🎨 Design Philosophy

- **User-Centric**: Intuitive interface with clear visual feedback
- **Performance-Focused**: Fast loading times and smooth interactions
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile-First**: Responsive design for all device sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is created by **Praise Enato** for educational and demonstration purposes.

## 📞 Support

For questions or issues, please contact Praise Enato or create an issue in the repository.

---

**IQFieldBot** - Challenging minds, one question at a time! 🧠✨