import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// In-memory storage for demo (replace with database in production)
let nutritionLogs: any[] = [];

// POST /api/v1/nutrition/log - Log a meal
router.post('/log', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { foodName, calories, protein, carbs, fat, mealType } = req.body;
  
  if (!foodName || !calories) {
    return res.status(400).json({
      success: false,
      message: 'Food name and calories are required'
    });
  }
  
  const newLog = {
    id: Date.now(),
    userId: req.user?.id,
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
  
  logger.info(`User ${req.user?.id} logged meal: ${foodName} (${calories} calories)`);
  
  res.status(201).json({
    success: true,
    message: 'Meal logged successfully',
    data: newLog
  });
}));

// GET /api/v1/nutrition/logs - Get user's nutrition logs
router.get('/logs', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { date, limit = 50 } = req.query;
  
  let userLogs = nutritionLogs.filter(log => log.userId === req.user?.id);
  
  if (date) {
    userLogs = userLogs.filter(log => log.date === date);
  }
  
  // Sort by timestamp descending
  userLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Apply limit
  userLogs = userLogs.slice(0, parseInt(limit as string));
  
  logger.info(`Retrieved ${userLogs.length} nutrition logs for user ${req.user?.id}`);
  
  res.status(200).json({
    success: true,
    message: 'Nutrition logs retrieved successfully',
    data: userLogs
  });
}));

// DELETE /api/v1/nutrition/logs/:id - Delete a nutrition log
router.delete('/logs/:id', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const logIndex = nutritionLogs.findIndex(log => 
    log.id === parseInt(id) && log.userId === req.user?.id
  );
  
  if (logIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Nutrition log not found'
    });
  }
  
  const deletedLog = nutritionLogs.splice(logIndex, 1)[0];
  
  logger.info(`User ${req.user?.id} deleted nutrition log: ${deletedLog.foodName}`);
  
  res.status(200).json({
    success: true,
    message: 'Nutrition log deleted successfully',
    data: deletedLog
  });
}));

// GET /api/v1/nutrition/stats - Get nutrition statistics
router.get('/stats', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const userLogs = nutritionLogs.filter(log => 
    log.userId === req.user?.id && log.date === targetDate
  );
  
  const stats = {
    totalCalories: userLogs.reduce((sum, log) => sum + log.calories, 0),
    totalProtein: userLogs.reduce((sum, log) => sum + log.protein, 0),
    totalCarbs: userLogs.reduce((sum, log) => sum + log.carbs, 0),
    totalFat: userLogs.reduce((sum, log) => sum + log.fat, 0),
    mealCount: userLogs.length,
    date: targetDate
  };
  
  res.status(200).json({
    success: true,
    message: 'Nutrition statistics retrieved successfully',
    data: stats
  });
}));

export default router;
