#!/bin/bash

# StackStudio Build Fix Script
# This script clears all caches and rebuilds the project

echo "🔧 StackStudio Build Fix Script"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -d "client" ] || [ ! -d "server" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Cleaning client build cache..."
cd client
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite
echo "✅ Client cache cleared"
echo ""

echo "📦 Step 2: Reinstalling client dependencies..."
npm install
echo "✅ Client dependencies installed"
echo ""

echo "🏗️  Step 3: Building client..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Client build successful"
else
    echo "❌ Client build failed"
    exit 1
fi
echo ""

echo "📦 Step 4: Checking server..."
cd ../server
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
    echo "✅ Server dependencies installed"
else
    echo "✅ Server dependencies already installed"
fi
echo ""

echo "🎉 Build fix complete!"
echo ""
echo "Next steps:"
echo "1. Start the backend: cd server && npm run dev"
echo "2. Start the frontend: cd client && npm run dev"
echo "3. Clear browser cache (Ctrl+Shift+Delete)"
echo "4. Hard refresh (Ctrl+Shift+R)"
echo ""
echo "✨ Your app should now work without errors!"
