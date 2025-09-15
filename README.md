# LifeHub - Comprehensive Health & Wellness Tracking Platform

A modern, full-stack application for tracking nutrition, fitness, mood, and wellness metrics with advanced analytics and goal management.

## 🚀 Features

### Core Features
- **Food Search & Nutrition Tracking**: Search foods via external APIs, log meals with automatic macro/micronutrient calculation
- **Comprehensive Logging**: Track water intake, steps, mood, and exercise sessions
- **Analytics Dashboard**: Daily progress tracking with calories in/out, hydration, steps, and mood trends
- **Goal Management**: Set and track progress toward daily/weekly goals
- **Data Export**: Export all data in CSV/JSON formats
- **User Management**: Signup/login with role-based access (user/admin)
- **Admin Panel**: System metrics and user activity monitoring

### Stretch Features (Recruiter Impressive)
- **Wearable Integration**: Real-time sync with Apple Health/Google Fit (stub implementation)
- **AI-Powered Features**: Mood sentiment analysis and meal recommendations (ML stubs)
- **Data Privacy**: GDPR-compliant data controls and account deletion
- **Observability**: Metrics endpoints, structured logging, error tracking
- **Modern UX**: Responsive design, dark mode, smooth animations
- **Production Ready**: CI/CD pipeline, testing framework, deployment automation

## 🏗️ Architecture

```
LifeHub/
├── backend/          # Node.js/Express API server
├── frontend/         # React TypeScript application
├── infra/           # Infrastructure as Code (Docker, K8s)
├── docs/            # API documentation and guides
├── tests/           # End-to-end and integration tests
└── scripts/         # Development and deployment scripts
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **API**: RESTful with OpenAPI documentation
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Zustand + React Query
- **UI Library**: Tailwind CSS + Headless UI
- **Charts**: Recharts for analytics
- **Testing**: Vitest + React Testing Library

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes manifests
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana stubs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (or use Docker)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd LifeHub
npm run setup
```

### 2. Environment Configuration
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit the .env files with your configuration
```

### 3. Start Development Environment
```bash
# Start all services with Docker Compose
docker-compose up -d

# Or run locally
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:3000/admin

## 📊 Demo Data

The application comes with seed data for immediate testing:
- Sample users (user@demo.com, admin@demo.com)
- Food database with 1000+ items
- Mock nutrition logs and analytics data

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to Kubernetes
kubectl apply -f infra/k8s/
```

## 📈 API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **OpenAPI Spec**: `/docs/api-spec.yaml`

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Management
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and authorization
- [x] Food search and nutrition tracking
- [x] Meal logging with macro calculation
- [x] Dashboard with analytics
- [x] Goal setting and tracking

### Phase 2: Advanced Features 🚧
- [ ] Wearable device integration (Apple Health, Google Fit)
- [ ] AI-powered meal recommendations
- [ ] Mood sentiment analysis
- [ ] Push notifications
- [ ] Social features and challenges

### Phase 3: Enterprise Features 📋
- [ ] Multi-tenant support
- [ ] Advanced analytics and reporting
- [ ] Integration with healthcare systems
- [ ] Mobile applications (iOS/Android)
- [ ] White-label solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Nutrition data provided by USDA FoodData Central
- Icons by Heroicons
- UI components inspired by Tailwind UI

---

**Built with ❤️ for health and wellness tracking**
