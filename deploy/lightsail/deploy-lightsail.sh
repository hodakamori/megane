#!/bin/bash
# Deploy megane demo to an AWS Lightsail instance.
#
# Prerequisites:
#   - SSH access to the Lightsail instance
#   - Docker and Docker Compose installed on the instance
#   - .env file configured at ~/megane/deploy/lightsail/.env
#
# Usage:
#   ./deploy/lightsail/deploy-lightsail.sh <host>
#
# Environment variables:
#   LIGHTSAIL_USER  - SSH user (default: ubuntu)

set -euo pipefail

HOST="${1:-}"
USER="${LIGHTSAIL_USER:-ubuntu}"

if [ -z "$HOST" ]; then
  echo "Usage: $0 <ip-or-hostname>"
  echo "   or: $0 user@hostname"
  exit 1
fi

# Allow user@host syntax
if [[ "$HOST" == *@* ]]; then
  USER="${HOST%%@*}"
  HOST="${HOST#*@}"
fi

echo "==> Deploying to ${USER}@${HOST}"
echo ""

ssh "${USER}@${HOST}" bash -s <<'REMOTE'
set -euo pipefail

cd ~/megane

echo "==> Pulling latest code..."
git pull --ff-only origin main

echo "==> Building and starting services..."
cd deploy/lightsail

if [ ! -f .env ]; then
  echo "ERROR: .env not found. Create it from .env.example first."
  exit 1
fi

docker compose build
docker compose up -d

echo "==> Checking health..."
sleep 5
docker compose ps
curl -sf http://localhost:8080/health && echo " (megane healthy)" || echo " (waiting for megane...)"

echo ""
echo "==> Deployment complete!"
REMOTE

echo ""
echo "========================================="
echo "Deployed to: https://${HOST}"
echo "========================================="
