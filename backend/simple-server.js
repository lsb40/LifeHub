const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// In-memory storage
let nutritionLogs = [];
let waterLogs = [];
let exerciseLogs = [];
let moodLogs = [];

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'LifeHub API is running' });
});

// Password hashing functions
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

// In-memory user storage
let users = [];

// Auth routes
app.post('/api/v1/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  // Create new user
  const newUser = {
    id: 'user-' + Date.now(),
    email: email,
    password: hashPassword(password), // Hash the password
    firstName: firstName,
    lastName: lastName,
    role: 'USER',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Return user data (without password)
  const { password: _, ...userData } = newUser;
  
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: userData,
      token: 'mock-jwt-token-' + Date.now()
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = users.find(u => u.email === email);
  
  if (user && verifyPassword(password, user.password)) {
    // Return user data (without password)
    const { password: _, ...userData } = user;
    
    res.json({
      success: true,
      data: {
        user: userData,
        token: 'mock-jwt-token-' + Date.now()
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Nutrition routes
app.post('/api/v1/nutrition/log', (req, res) => {
  const { foodName, calories, protein, carbs, fat, mealType } = req.body;
  
  const newLog = {
    id: Date.now(),
    userId: 'admin-user',
    foodName,
    calories: parseInt(calories),
    protein: parseInt(protein) || 0,
    carbs: parseInt(carbs) || 0,
    fat: parseInt(fat) || 0,
    mealType: mealType || 'snack',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    timestamp: new Date().toISOString()
  };
  
  nutritionLogs.push(newLog);
  
  res.status(201).json({
    success: true,
    message: 'Meal logged successfully',
    data: newLog
  });
});

app.get('/api/v1/nutrition/stats', (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const userLogs = nutritionLogs.filter(log => 
    log.userId === 'admin-user' && log.date === targetDate
  );
  
  const stats = {
    totalCalories: userLogs.reduce((sum, log) => sum + log.calories, 0),
    totalProtein: userLogs.reduce((sum, log) => sum + log.protein, 0),
    totalCarbs: userLogs.reduce((sum, log) => sum + log.carbs, 0),
    totalFat: userLogs.reduce((sum, log) => sum + log.fat, 0),
    mealCount: userLogs.length,
    date: targetDate
  };
  
  res.json({
    success: true,
    message: 'Nutrition statistics retrieved successfully',
    data: stats
  });
});

// Water routes
app.post('/api/v1/water/log', (req, res) => {
  const { amount } = req.body;
  
  const newLog = {
    id: Date.now(),
    userId: 'admin-user',
    amount: parseInt(amount),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    timestamp: new Date().toISOString()
  };
  
  waterLogs.push(newLog);
  
  res.status(201).json({
    success: true,
    message: 'Water intake logged successfully',
    data: newLog
  });
});

app.get('/api/v1/water/stats', (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const userLogs = waterLogs.filter(log => 
    log.userId === 'admin-user' && log.date === targetDate
  );
  
  const totalAmount = userLogs.reduce((sum, log) => sum + log.amount, 0);
  const glasses = Math.round(totalAmount / 250);
  
  const stats = {
    totalAmount,
    glasses,
    entries: userLogs.length,
    date: targetDate
  };
  
  res.json({
    success: true,
    message: 'Water statistics retrieved successfully',
    data: stats
  });
});

// Exercise routes
app.post('/api/v1/exercise/log', (req, res) => {
  const { exerciseType, duration, steps, caloriesBurned, notes } = req.body;
  
  const newLog = {
    id: Date.now(),
    userId: 'admin-user',
    exerciseType,
    duration: parseInt(duration),
    steps: parseInt(steps) || 0,
    caloriesBurned: parseInt(caloriesBurned) || 0,
    notes: notes || '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    timestamp: new Date().toISOString()
  };
  
  exerciseLogs.push(newLog);
  
  res.status(201).json({
    success: true,
    message: 'Exercise logged successfully',
    data: newLog
  });
});

app.get('/api/v1/exercise/stats', (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const userLogs = exerciseLogs.filter(log => 
    log.userId === 'admin-user' && log.date === targetDate
  );
  
  const stats = {
    totalDuration: userLogs.reduce((sum, log) => sum + log.duration, 0),
    totalSteps: userLogs.reduce((sum, log) => sum + log.steps, 0),
    totalCaloriesBurned: userLogs.reduce((sum, log) => sum + log.caloriesBurned, 0),
    exerciseCount: userLogs.length,
    date: targetDate
  };
  
  res.json({
    success: true,
    message: 'Exercise statistics retrieved successfully',
    data: stats
  });
});

// Mood routes
app.post('/api/v1/mood/log', (req, res) => {
  const { mood, notes, energy, stress } = req.body;
  
  const newLog = {
    id: Date.now(),
    userId: 'admin-user',
    mood,
    notes: notes || '',
    energy: parseInt(energy) || 5,
    stress: parseInt(stress) || 5,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    timestamp: new Date().toISOString()
  };
  
  moodLogs.push(newLog);
  
  res.status(201).json({
    success: true,
    message: 'Mood logged successfully',
    data: newLog
  });
});

app.get('/api/v1/mood/stats', (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const userLogs = moodLogs.filter(log => 
    log.userId === 'admin-user' && log.date === targetDate
  );
  
  const latestMood = userLogs.length > 0 ? userLogs[userLogs.length - 1].mood : '😐';
  const avgEnergy = userLogs.length > 0 ? 
    Math.round(userLogs.reduce((sum, log) => sum + log.energy, 0) / userLogs.length) : 5;
  const avgStress = userLogs.length > 0 ? 
    Math.round(userLogs.reduce((sum, log) => sum + log.stress, 0) / userLogs.length) : 5;
  
  const stats = {
    latestMood,
    avgEnergy,
    avgStress,
    totalEntries: userLogs.length,
    date: targetDate
  };
  
  res.json({
    success: true,
    message: 'Mood statistics retrieved successfully',
    data: stats
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LifeHub API server running on port ${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`);
});