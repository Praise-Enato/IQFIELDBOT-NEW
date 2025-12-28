# IQFieldBot - Local Setup & AWS Deployment Guide

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.9+** - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)
- **AWS Account** - [Sign up here](https://aws.amazon.com/)
- **OpenAI API Key** (optional) - [Get one here](https://platform.openai.com/api-keys)

## 🚀 Local Development Setup

### Step 1: Clone/Download the Project

```bash
# Clone the repository.
git clone <repository-url>
cd IQFIELDBOT1
```

### Step 2: Install Frontend Dependencies

```bash
# Install Node.js dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### Step 3: Setup Backend

Open a new terminal window/tab:

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

### Step 4: Configure Environment Variables

Edit the `.env` file in the `backend` folder:

```bash
# Required
API_SECRET=your-secret-key-here-change-this

# Optional (for AI question generation)
OPENAI_API_KEY=your-openai-key-here

# AWS (for deployment later)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Database tables (for deployment)
DYNAMODB_TABLE_USERS=iqfieldbot-users
DYNAMODB_TABLE_SESSIONS=iqfieldbot-sessions
DYNAMODB_TABLE_QUESTIONS=iqfieldbot-questions

# JWT
JWT_SECRET_KEY=your-jwt-secret-here

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Step 5: Start Backend Server

```bash
# Make sure you're in the backend directory with venv activated
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Step 6: Test the Application

1. Open `http://localhost:5173` in your browser
2. Create an account (use any email/password - it's demo mode)
3. Select a field and start testing!

## ☁️ AWS Deployment

### Option 1: AWS Lambda + SAM (Recommended - Almost Free)

#### Prerequisites for AWS Deployment

1. **Install AWS CLI**:
   ```bash
   # Windows (using pip)
   pip install awscli
   
   # macOS (using Homebrew)
   brew install awscli
   
   # Or download from: https://aws.amazon.com/cli/
   ```

2. **Install SAM CLI**:
   ```bash
   # Windows/macOS/Linux
   pip install aws-sam-cli
   
   # Or follow: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
   ```

3. **Configure AWS Credentials**:
   ```bash
   aws configure
   ```
   Enter your:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., us-east-1)
   - Default output format (json)

#### Deploy Backend to AWS Lambda

```bash
# Navigate to backend directory
cd backend

# Build the SAM application
sam build

# Deploy (first time - guided)
sam deploy --guided

# Follow the prompts:
# - Stack Name: iqfieldbot-api
# - AWS Region: us-east-1
# - Parameter OpenAIApiKey: [your-openai-key or leave empty]
# - Confirm changes before deploy: Y
# - Allow SAM CLI IAM role creation: Y
# - Save parameters to samconfig.toml: Y
```

After deployment, you'll get an API Gateway URL like:
`https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev`

#### Deploy Frontend to S3 + CloudFront

1. **Update Frontend Configuration**:
   
   Edit `vite.config.ts`:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/', // Add this for S3 deployment
     build: {
       outDir: 'dist',
       assetsDir: 'assets',
     },
     server: {
       proxy: {
         '/api': {
           target: 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev',
           changeOrigin: true,
         },
       },
     },
   })
   ```

2. **Build Frontend**:
   ```bash
   # From project root
   npm run build
   ```

3. **Create S3 Bucket and Deploy**:
   ```bash
   # Create unique bucket name
   aws s3 mb s3://iqfieldbot-frontend-your-name-$(date +%s)

   # Upload built files
   aws s3 sync dist/ s3://your-bucket-name --delete

   # Enable static website hosting
   aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html

   # Make bucket public (for static hosting)
   aws s3api put-bucket-policy --bucket your-bucket-name --policy '{
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }'
   ```

Your app will be available at: `http://your-bucket-name.s3-website-us-east-1.amazonaws.com`

### Option 2: EC2 Deployment (Alternative)

1. **Launch EC2 Instance**:
   - Go to AWS Console → EC2
   - Launch Instance (t2.micro for free tier)
   - Choose Ubuntu 22.04 LTS
   - Create/use existing key pair
   - Allow HTTP (port 80) and HTTPS (port 443) in security group

2. **Connect and Setup**:
   ```bash
   # SSH into your instance
   ssh -i your-key.pem ubuntu@your-ec2-ip

   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install Python
   sudo apt install python3 python3-pip python3-venv -y

   # Install Nginx
   sudo apt install nginx -y

   # Clone your project
   git clone your-repo-url
   cd IQFIELDBOT1
   ```

3. **Setup Application**:
   ```bash
   # Install frontend dependencies
   npm install
   npm run build

   # Setup backend
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

   # Configure environment
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Configure Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/iqfieldbot
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com your-ec2-ip;

       # Frontend
       location / {
           root /home/ubuntu/iqfieldbot/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/iqfieldbot /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Start Services**:
   ```bash
   # Start backend (use screen or tmux for persistence)
   screen -S backend
   cd /home/ubuntu/iqfieldbot/backend
   source venv/bin/activate
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   # Press Ctrl+A, then D to detach
   ```

Your app will be available at: `http://your-ec2-ip`

## 🔧 Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   # Kill process on port 8000
   lsof -ti:8000 | xargs kill -9
   ```

2. **Python virtual environment issues**:
   ```bash
   # Recreate venv
   rm -rf venv
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. **CORS errors**:
   - Make sure your frontend URL is in the CORS_ORIGINS environment variable
   - Check that the API proxy in vite.config.ts points to the correct backend URL

4. **AWS deployment fails**:
   - Verify AWS credentials: `aws sts get-caller-identity`
   - Check IAM permissions for Lambda, API Gateway, and DynamoDB
   - Ensure unique S3 bucket names

## 📱 Sharing with Classmates

Once deployed, share these URLs:

- **Lambda + S3**: `http://your-bucket-name.s3-website-us-east-1.amazonaws.com`
- **EC2**: `http://your-ec2-ip`

## 💰 Cost Estimation

### AWS Lambda + S3 (Recommended):
- **Lambda**: Free tier includes 1M requests/month
- **API Gateway**: Free tier includes 1M API calls/month
- **DynamoDB**: Free tier includes 25GB storage
- **S3**: ~$0.50/month for hosting
- **Total**: ~$0-2/month for moderate usage

### EC2:
- **t2.micro**: Free for 12 months, then ~$8.50/month
- **Data transfer**: Usually free for moderate usage

## 🎯 Next Steps

1. **Test locally first** - Make sure everything works
2. **Choose deployment method** - Lambda+S3 recommended for cost
3. **Deploy backend** - Follow SAM deployment steps
4. **Deploy frontend** - Upload to S3
5. **Test deployed version** - Verify all features work
6. **Share URL** - Give classmates the final URL

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Ensure environment variables are set correctly
4. Check AWS credentials and permissions

Good luck with your deployment! 🚀