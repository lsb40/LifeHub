#!/bin/bash

echo "🚀 Starting LifeHub Locally"
echo "=========================="

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "nodemon\|react-scripts" 2>/dev/null || true

# Wait a moment
sleep 2

# Start backend in background
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend in background
echo "Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 LifeHub is starting up!"
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Demo credentials:"
echo "  Admin: admin@lifehub.com / admin123"
echo "  User: user@lifehub.com / user123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
