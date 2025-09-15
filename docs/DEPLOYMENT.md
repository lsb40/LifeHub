# LifeHub Deployment Guide

## Overview

This guide covers deploying LifeHub to various environments, from local development to production Kubernetes clusters.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Kubernetes cluster (for production)

## Local Development

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LifeHub
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend npm run db:migrate
   ```

5. **Seed the database**
   ```bash
   docker-compose exec backend npm run db:seed
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Manual Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp env.example .env
   npm start
   ```

## Docker Deployment

### Build Images

```bash
# Build backend image
docker build -t lifehub-backend ./backend

# Build frontend image
docker build -t lifehub-frontend ./frontend
```

### Run with Docker Compose

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://lifehub:lifehub123@postgres:5432/lifehub

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server
PORT=8000
NODE_ENV=production

# Frontend
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (v1.20+)
- kubectl configured
- Helm (optional)

### Deploy to Kubernetes

1. **Create namespace**
   ```bash
   kubectl apply -f infra/k8s/namespace.yaml
   ```

2. **Deploy database**
   ```bash
   kubectl apply -f infra/k8s/postgres.yaml
   kubectl apply -f infra/k8s/redis.yaml
   ```

3. **Deploy backend**
   ```bash
   kubectl apply -f infra/k8s/backend.yaml
   ```

4. **Deploy frontend**
   ```bash
   kubectl apply -f infra/k8s/frontend.yaml
   ```

5. **Deploy ingress**
   ```bash
   kubectl apply -f infra/k8s/ingress.yaml
   ```

### Using Helm (Alternative)

```bash
# Create Helm chart
helm create lifehub

# Install with values
helm install lifehub ./lifehub -f values.yaml
```

## Production Considerations

### Security

1. **Environment Variables**
   - Use Kubernetes secrets or external secret management
   - Rotate JWT secrets regularly
   - Use strong database passwords

2. **Network Security**
   - Enable TLS/SSL
   - Configure firewall rules
   - Use private networks for database access

3. **Authentication**
   - Implement rate limiting
   - Use secure session management
   - Enable CORS properly

### Performance

1. **Database Optimization**
   - Configure connection pooling
   - Set up read replicas
   - Implement database indexing

2. **Caching**
   - Use Redis for session storage
   - Implement API response caching
   - Cache static assets

3. **Load Balancing**
   - Use multiple backend replicas
   - Configure health checks
   - Implement graceful shutdowns

### Monitoring

1. **Logging**
   - Centralized logging with ELK stack
   - Structured logging format
   - Log rotation and retention

2. **Metrics**
   - Prometheus metrics collection
   - Grafana dashboards
   - Alert manager configuration

3. **Health Checks**
   - Liveness and readiness probes
   - Database connectivity checks
   - External service monitoring

## CI/CD Pipeline

### GitHub Actions

The project includes a comprehensive CI/CD pipeline:

1. **Testing**
   - Backend unit and integration tests
   - Frontend component tests
   - End-to-end tests with Playwright

2. **Security**
   - Dependency vulnerability scanning
   - Container image scanning
   - Code quality checks

3. **Deployment**
   - Automated staging deployment
   - Production deployment with approval
   - Rollback capabilities

### Manual Deployment

```bash
# Build and push images
docker build -t registry/lifehub-backend:latest ./backend
docker build -t registry/lifehub-frontend:latest ./frontend

docker push registry/lifehub-backend:latest
docker push registry/lifehub-frontend:latest

# Deploy to Kubernetes
kubectl set image deployment/backend backend=registry/lifehub-backend:latest
kubectl set image deployment/frontend frontend=registry/lifehub-frontend:latest
```

## Scaling

### Horizontal Scaling

```bash
# Scale backend replicas
kubectl scale deployment backend --replicas=3

# Scale frontend replicas
kubectl scale deployment frontend --replicas=2
```

### Database Scaling

1. **Read Replicas**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: postgres-read
   spec:
     replicas: 2
     # ... read replica configuration
   ```

2. **Connection Pooling**
   - Use PgBouncer for connection pooling
   - Configure connection limits
   - Monitor connection usage

## Backup and Recovery

### Database Backup

```bash
# Create backup
kubectl exec postgres-pod -- pg_dump -U lifehub lifehub > backup.sql

# Restore backup
kubectl exec -i postgres-pod -- psql -U lifehub lifehub < backup.sql
```

### Automated Backups

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command:
            - /bin/bash
            - -c
            - |
              pg_dump -h postgres -U lifehub lifehub > /backup/backup-$(date +%Y%m%d).sql
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database status
   kubectl get pods -l app=postgres
   
   # Check logs
   kubectl logs postgres-pod
   ```

2. **Backend Issues**
   ```bash
   # Check backend status
   kubectl get pods -l app=backend
   
   # Check logs
   kubectl logs backend-pod
   ```

3. **Frontend Issues**
   ```bash
   # Check frontend status
   kubectl get pods -l app=frontend
   
   # Check ingress
   kubectl get ingress
   ```

### Debug Commands

```bash
# Port forward for local access
kubectl port-forward svc/backend 8000:8000
kubectl port-forward svc/frontend 3000:3000

# Execute commands in pods
kubectl exec -it postgres-pod -- psql -U lifehub lifehub
kubectl exec -it backend-pod -- npm run db:migrate

# Check resource usage
kubectl top pods
kubectl top nodes
```

## Maintenance

### Regular Tasks

1. **Database Maintenance**
   - Vacuum and analyze tables
   - Update statistics
   - Clean up old logs

2. **Application Updates**
   - Update dependencies
   - Apply security patches
   - Deploy new features

3. **Infrastructure**
   - Update Kubernetes cluster
   - Scale resources as needed
   - Monitor costs

### Monitoring Checklist

- [ ] Application health checks passing
- [ ] Database performance metrics
- [ ] Error rates within acceptable limits
- [ ] Response times meeting SLA
- [ ] Resource utilization optimal
- [ ] Security scans clean
- [ ] Backup verification successful
