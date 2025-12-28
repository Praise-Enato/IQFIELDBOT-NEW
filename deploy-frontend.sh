#!/bin/bash

# Frontend deployment script for S3
# Make this file executable: chmod +x deploy-frontend.sh

set -e

echo "🚀 Deploying IQFieldBot Frontend to S3..."

# Check if bucket name is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide S3 bucket name"
    echo "Usage: ./deploy-frontend.sh your-bucket-name"
    exit 1
fi

BUCKET_NAME=$1
REGION=${2:-us-east-1}

echo "📦 Building frontend..."
npm run build

echo "☁️ Creating S3 bucket (if it doesn't exist)..."
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || echo "Bucket already exists"

echo "📤 Uploading files to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

echo "🔓 Setting bucket policy for public access..."
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

echo "✅ Deployment complete!"
echo "🌍 Your app is available at: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"