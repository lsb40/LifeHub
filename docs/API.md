# LifeHub API Documentation

## Overview

The LifeHub API is a RESTful service built with Node.js, Express, and TypeScript. It provides comprehensive health and wellness tracking capabilities with a focus on nutrition, fitness, mood, and goal management.

## Base URL

- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://api.lifehub.com/api/v1`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user profile (requires authentication).

### Foods

#### GET /foods/search
Search for foods in the database.

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

#### GET /foods/:id
Get food details by ID.

### Nutrition Logging

#### POST /nutrition/log
Log a food item with quantity and meal type.

**Request Body:**
```json
{
  "foodId": "food-id",
  "quantity": 150,
  "mealType": "BREAKFAST",
  "loggedAt": "2024-01-01T08:00:00.000Z"
}
```

#### GET /nutrition/logs
Get user's nutrition logs with optional date filtering.

### Water Intake

#### POST /water/log
Log water intake.

**Request Body:**
```json
{
  "amount": 250,
  "loggedAt": "2024-01-01T10:00:00.000Z"
}
```

#### GET /water/logs
Get user's water intake logs.

### Mood Tracking

#### POST /mood/log
Log mood and emotional state.

**Request Body:**
```json
{
  "mood": "HAPPY",
  "energy": 8,
  "stress": 3,
  "sleep": 7,
  "notes": "Feeling great today!",
  "loggedAt": "2024-01-01T20:00:00.000Z"
}
```

#### GET /mood/logs
Get user's mood logs.

### Step Tracking

#### POST /steps/log
Log daily steps.

**Request Body:**
```json
{
  "steps": 8500,
  "distance": 6.2,
  "calories": 350,
  "loggedAt": "2024-01-01T23:59:59.000Z"
}
```

#### GET /steps/logs
Get user's step logs.

### Exercise Logging

#### POST /exercise/log
Log exercise session.

**Request Body:**
```json
{
  "name": "Morning Run",
  "type": "RUNNING",
  "duration": 30,
  "calories": 300,
  "intensity": "MODERATE",
  "notes": "Great run in the park",
  "loggedAt": "2024-01-01T07:00:00.000Z"
}
```

#### GET /exercise/logs
Get user's exercise logs.

### Goals

#### GET /goals
Get user's active goals.

#### POST /goals
Create a new goal.

**Request Body:**
```json
{
  "type": "CALORIES",
  "target": 2000,
  "unit": "kcal",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z"
}
```

### Analytics

#### GET /analytics/dashboard
Get dashboard statistics and recent activity.

#### GET /analytics/trends
Get analytics data for charts and trends.

### Admin

#### GET /admin/metrics
Get system metrics (admin only).

#### GET /admin/users
Get user management data (admin only).

### Data Export

#### POST /export/request
Request data export.

#### GET /export/download/:id
Download exported data file.

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/endpoint"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per minute
- Rate limit headers are included in responses

## WebSocket Support

Real-time features are available via WebSocket connection:

```javascript
const socket = io('ws://localhost:8000');
socket.emit('join-user-room', userId);
```

## SDK and Libraries

### JavaScript/TypeScript

```bash
npm install axios
```

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Postman Collection

A Postman collection is available for testing the API endpoints. Import the collection from the `/docs` directory.

## OpenAPI Specification

The complete API specification is available at `/docs/api-spec.yaml` in OpenAPI 3.0 format.
