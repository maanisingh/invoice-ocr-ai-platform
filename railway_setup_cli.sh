#!/bin/bash

# Railway CLI Setup Script for Invoice OCR Platform
# This script completes the deployment using Railway CLI

set -e

echo "=================================================="
echo "Invoice OCR Platform - Railway CLI Setup"
echo "=================================================="
echo ""

# Service IDs (from GraphQL API creation)
BACKEND_ID="50274168-36a0-4ea8-ab27-6b8621e20daa"
FRONTEND_ID="2d667153-49bb-479e-be01-0c7c049b65a8"
POSTGRES_ID="ccd3fa5a-c292-476e-9367-05d64985623c"
PROJECT_ID="d2f381ea-2e7e-4eaa-8d67-067a82d8d241"

export RAILWAY_TOKEN="de8b3fce-b70e-41fe-b89e-0954f6da218b"

echo "Step 1: Configuring Backend Service..."
cd backend

# Link to backend service
railway link $PROJECT_ID --service $BACKEND_ID

# Deploy backend
railway up

cd ..

echo ""
echo "Step 2: Configuring Frontend Service..."
cd frontend

# Link to frontend service
railway link $PROJECT_ID --service $FRONTEND_ID

# Deploy frontend
railway up

cd ..

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Check status at: https://railway.app/project/$PROJECT_ID"
echo ""
