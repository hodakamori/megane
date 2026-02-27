#!/bin/bash
# Deploy megane demo to AWS App Runner via ECR.
#
# Prerequisites:
#   - AWS CLI configured with appropriate permissions
#   - Docker installed and running
#
# Usage:
#   ./deploy/deploy-aws.sh
#
# Environment variables:
#   AWS_REGION  - AWS region (default: ap-northeast-1)

set -euo pipefail

REGION="${AWS_REGION:-ap-northeast-1}"
REPO_NAME="megane"
SERVICE_NAME="megane-demo"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}"

echo "==> AWS Account: ${ACCOUNT_ID}"
echo "==> Region: ${REGION}"
echo "==> ECR URI: ${ECR_URI}"
echo ""

# 1. Create ECR repo (idempotent)
echo "==> Ensuring ECR repository exists..."
aws ecr describe-repositories --repository-names "$REPO_NAME" --region "$REGION" 2>/dev/null || \
  aws ecr create-repository --repository-name "$REPO_NAME" --region "$REGION"

# 2. Docker login to ECR
echo "==> Logging in to ECR..."
aws ecr get-login-password --region "$REGION" | \
  docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

# 3. Build + push
echo "==> Building Docker image..."
docker build -t "$REPO_NAME" .

echo "==> Tagging and pushing..."
docker tag "${REPO_NAME}:latest" "${ECR_URI}:latest"
docker push "${ECR_URI}:latest"

echo ""
echo "========================================="
echo "Image pushed to: ${ECR_URI}:latest"
echo "========================================="
echo ""
echo "Next: Create App Runner service in AWS Console:"
echo "  1. Go to https://console.aws.amazon.com/apprunner"
echo "  2. Create service -> Container registry -> Amazon ECR"
echo "  3. Image URI: ${ECR_URI}:latest"
echo "  4. Port: 8080"
echo "  5. CPU: 1 vCPU, Memory: 2 GB"
echo "  6. Min instances: 1 (for always-on demo)"
echo "  7. Enable auto-deployment from ECR"
