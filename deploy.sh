#!/bin/bash

# Zar Jewels deployment automation script for WHM/cPanel Linux VPS
# Exit on any error
set -e

echo "=================================================="
echo " Starting Zar Jewels Production Build & Deployment"
echo "=================================================="

# 1. Backend Install
echo "--> Installing backend dependencies..."
cd backend
npm install --omit=dev
cd ..


# 3. Admin Dashboard (Standalone Node.js Server) Build
echo "--> Building admin dashboard Next.js application..."
cd frontend/admin-dashboard
npm install
npm run build
cd ../..

# 4. Process Reload via PM2
if command -v pm2 &> /dev/null
then
    echo "--> Reloading application processes with PM2..."
    pm2 startOrReload ecosystem.config.js --env production
else
    echo "--> PM2 not found globally. Skipping process reload."
    echo "    Make sure to run: pm2 start ecosystem.config.js --env production"
fi

echo "=================================================="
echo " Production Build and Setup Completed Successfully!"
echo "=================================================="
