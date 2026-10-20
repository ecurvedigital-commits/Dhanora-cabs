#!/bin/bash
set -e

echo "🚀 Starting Dhanora Cab Service Deployment..."

# 1. Check Node.js and PNPM
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    sudo npm install -g pnpm pm2
fi

# 2. Install dependencies
echo "📦 Installing dependencies with pnpm..."
pnpm install

# 3. Build Next.js
echo "🏗️ Building Next.js production app..."
pnpm --filter @dehradun/web build

# 4. Start with PM2
echo "⚡ Starting app with PM2..."
pm2 delete dhanora-web 2>/dev/null || true
pm2 start "pnpm --filter @dehradun/web start" --name "dhanora-web"
pm2 save

echo "✅ Dhanora Cab Service is running on port 3000!"
echo "Check status anytime with: pm2 status"
