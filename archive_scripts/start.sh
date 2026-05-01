#!/bin/bash

echo "🚀 Starting StyleGenie Application..."
echo

echo "📦 Installing dependencies..."
npm install

echo
echo "🐍 Starting backend server..."
cd src/chatbot
python flask_api.py &
BACKEND_PID=$!
cd ../..

echo
echo "⏳ Waiting for backend to start..."
sleep 3

echo
echo "⚛️ Starting frontend application..."
npm start &
FRONTEND_PID=$!

echo
echo "✅ StyleGenie is running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait