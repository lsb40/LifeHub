// User types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  height?: number;
  weight?: number;
  activityLevel?: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';
  createdAt: string;
  updatedAt: string;
}

// Food types
export interface Food {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  description?: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  servingSize?: number;
  servingUnit?: string;
  category?: string;
  isVerified: boolean;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

// Nutrition log types
export interface NutritionLog {
  id: string;
  userId: string;
  foodId: string;
  quantity: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'OTHER';
  loggedAt: string;
  createdAt: string;
  updatedAt: string;
  food?: Food;
}

// Water log types
export interface WaterLog {
  id: string;
  userId: string;
  amount: number;
  loggedAt: string;
  createdAt: string;
}

// Mood log types
export interface MoodLog {
  id: string;
  userId: string;
  mood: 'VERY_HAPPY' | 'HAPPY' | 'NEUTRAL' | 'SAD' | 'VERY_SAD' | 'ANXIOUS' | 'STRESSED' | 'EXCITED' | 'TIRED' | 'ENERGETIC';
  energy: number;
  stress: number;
  sleep: number;
  notes?: string;
  loggedAt: string;
  createdAt: string;
}

// Step log types
export interface StepLog {
  id: string;
  userId: string;
  steps: number;
  distance?: number;
  calories?: number;
  loggedAt: string;
  createdAt: string;
}

// Exercise log types
export interface ExerciseLog {
  id: string;
  userId: string;
  name: string;
  type: 'CARDIO' | 'STRENGTH' | 'FLEXIBILITY' | 'SPORTS' | 'WALKING' | 'RUNNING' | 'CYCLING' | 'SWIMMING' | 'YOGA' | 'PILATES' | 'OTHER';
  duration: number;
  calories?: number;
  intensity?: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  notes?: string;
  loggedAt: string;
  createdAt: string;
}

// Goal types
export interface Goal {
  id: string;
  userId: string;
  type: 'CALORIES' | 'PROTEIN' | 'CARBOHYDRATES' | 'FAT' | 'WATER' | 'STEPS' | 'EXERCISE_MINUTES' | 'WEIGHT_LOSS' | 'WEIGHT_GAIN';
  target: number;
  unit: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  timestamp: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Dashboard types
export interface DashboardStats {
  todayCalories: number;
  todayWater: number;
  todaySteps: number;
  todayMood: number;
  weeklyCalories: number[];
  weeklyWater: number[];
  weeklySteps: number[];
  weeklyMood: number[];
  goals: Goal[];
  recentLogs: {
    nutrition: NutritionLog[];
    water: WaterLog[];
    mood: MoodLog[];
    steps: StepLog[];
    exercise: ExerciseLog[];
  };
}

// Analytics types
export interface AnalyticsData {
  period: 'week' | 'month' | 'year';
  calories: {
    consumed: number[];
    burned: number[];
    net: number[];
  };
  macros: {
    protein: number[];
    carbohydrates: number[];
    fat: number[];
  };
  hydration: number[];
  activity: {
    steps: number[];
    exercise: number[];
  };
  mood: {
    average: number[];
    energy: number[];
    stress: number[];
    sleep: number[];
  };
}

// Form types
export interface FoodSearchForm {
  query: string;
  page?: number;
  limit?: number;
}

export interface NutritionLogForm {
  foodId: string;
  quantity: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'OTHER';
  loggedAt?: string;
}

export interface WaterLogForm {
  amount: number;
  loggedAt?: string;
}

export interface MoodLogForm {
  mood: 'VERY_HAPPY' | 'HAPPY' | 'NEUTRAL' | 'SAD' | 'VERY_SAD' | 'ANXIOUS' | 'STRESSED' | 'EXCITED' | 'TIRED' | 'ENERGETIC';
  energy: number;
  stress: number;
  sleep: number;
  notes?: string;
  loggedAt?: string;
}

export interface StepLogForm {
  steps: number;
  distance?: number;
  calories?: number;
  loggedAt?: string;
}

export interface ExerciseLogForm {
  name: string;
  type: 'CARDIO' | 'STRENGTH' | 'FLEXIBILITY' | 'SPORTS' | 'WALKING' | 'RUNNING' | 'CYCLING' | 'SWIMMING' | 'YOGA' | 'PILATES' | 'OTHER';
  duration: number;
  calories?: number;
  intensity?: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  notes?: string;
  loggedAt?: string;
}

export interface GoalForm {
  type: 'CALORIES' | 'PROTEIN' | 'CARBOHYDRATES' | 'FAT' | 'WATER' | 'STEPS' | 'EXERCISE_MINUTES' | 'WEIGHT_LOSS' | 'WEIGHT_GAIN';
  target: number;
  unit: string;
  startDate: string;
  endDate?: string;
}

// Wearable types
export interface WearableConnection {
  id: string;
  userId: string;
  provider: 'APPLE_HEALTH' | 'GOOGLE_FIT' | 'FITBIT' | 'GARMIN' | 'SAMSUNG_HEALTH';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  isActive: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Export types
export interface DataExport {
  id: string;
  userId: string;
  type: 'FULL_DATA' | 'NUTRITION_ONLY' | 'FITNESS_ONLY' | 'MOOD_ONLY';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  filePath?: string;
  expiresAt?: string;
  createdAt: string;
  completedAt?: string;
}

// System metrics types
export interface SystemMetrics {
  id: string;
  totalUsers: number;
  activeUsers: number;
  totalLogs: number;
  averageMood?: number;
  totalCalories?: number;
  totalSteps?: number;
  systemUptime?: number;
  errorRate?: number;
  responseTime?: number;
  recordedAt: string;
}
