#!/bin/bash

# LifeHub Setup Script
# This script sets up the complete LifeHub development environment

set -e

echo "🚀 Setting up LifeHub Development Environment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. You'll need Docker for the full setup."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed. You'll need Docker Compose for the full setup."
    fi
    
    print_success "Requirements check completed"
}

# Setup environment files
setup_env() {
    print_status "Setting up environment files..."
    
    if [ ! -f .env ]; then
        cp env.example .env
        print_success "Created .env file from template"
    else
        print_warning ".env file already exists, skipping..."
    fi
    
    if [ ! -f backend/.env ]; then
        cp backend/env.example backend/.env
        print_success "Created backend/.env file from template"
    else
        print_warning "backend/.env file already exists, skipping..."
    fi
    
    if [ ! -f frontend/.env ]; then
        cp frontend/.env.example frontend/.env 2>/dev/null || echo "REACT_APP_API_URL=http://localhost:8000/api/v1" > frontend/.env
        print_success "Created frontend/.env file"
    else
        print_warning "frontend/.env file already exists, skipping..."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Root dependencies
    npm install
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    # Test dependencies
    print_status "Installing test dependencies..."
    cd tests
    npm install
    cd ..
    
    print_success "All dependencies installed"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Starting database with Docker Compose..."
        docker-compose up -d postgres redis
        
        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10
        
        # Run migrations
        print_status "Running database migrations..."
        cd backend
        npm run db:migrate
        
        # Seed database
        print_status "Seeding database..."
        npm run db:seed
        cd ..
        
        print_success "Database setup completed"
    else
        print_warning "Docker not available. Please set up PostgreSQL and Redis manually."
        print_warning "Then run: cd backend && npm run db:migrate && npm run db:seed"
    fi
}

# Build applications
build_applications() {
    print_status "Building applications..."
    
    # Build backend
    print_status "Building backend..."
    cd backend
    npm run build
    cd ..
    
    # Build frontend
    print_status "Building frontend..."
    cd frontend
    npm run build
    cd ..
    
    print_success "Applications built successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Backend tests
    print_status "Running backend tests..."
    cd backend
    npm test -- --passWithNoTests
    cd ..
    
    # Frontend tests
    print_status "Running frontend tests..."
    cd frontend
    npm test -- --watchAll=false --passWithNoTests
    cd ..
    
    print_success "Tests completed"
}

# Main setup function
main() {
    echo ""
    print_status "Starting LifeHub setup..."
    echo ""
    
    check_requirements
    setup_env
    install_dependencies
    setup_database
    build_applications
    run_tests
    
    echo ""
    print_success "🎉 LifeHub setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the development servers:"
    echo "   npm run dev"
    echo ""
    echo "2. Or start with Docker Compose:"
    echo "   docker-compose up -d"
    echo ""
    echo "3. Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo ""
    echo "Demo credentials:"
    echo "   Admin: admin@lifehub.com / admin123"
    echo "   User: user@lifehub.com / user123"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main "$@"
