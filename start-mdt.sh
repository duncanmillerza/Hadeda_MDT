#!/bin/bash
# Startup script for HadedaHealth MDT App (Mac/Linux)

echo "🏥 Starting HadedaHealth MDT Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first-time setup)..."
    npm install
fi

# Check if database exists
if [ ! -f "data/mdt.db" ]; then
    echo "🗄️  Setting up database (first-time setup)..."
    npm run db:migrate -- --name init
    npm run db:seed

    echo ""
    echo "👤 Create your first user account:"
    npm run create-user
fi

# Start the application
echo ""
echo "🚀 Starting server..."
echo "📱 The app will open automatically in your browser at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Open browser after a short delay
(sleep 3 && open http://localhost:3000) &

# Start Next.js server
npm run dev
