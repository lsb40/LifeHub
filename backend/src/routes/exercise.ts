import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// In-memory storage for demo (replace with database in production)
let exerciseLogs: any[] = [];

// POST /api/v1/exercise/log - Log exercise
router.post('/log', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { exerciseType, duration, steps, caloriesBurned, notes } = req.body;
  
  if (!exerciseType || !duration) {
    return res.status(400).json({
      success: false,
      message: 'Exercise type and duration are required'
    });
  }
  
  const newLog = {
    id: Date.now(),
    userId: req.user?.id,
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
  
  logger.info(`User ${req.user?.id} logged exercise: ${exerciseType} for ${duration} minutes`);
  
  res.status(201).json({
    success: true,
    message: 'Exercise logged successfully',
    data: newLog
  });
}));

// GET /api/v1/exercise/logs - Get user's exercise logs
router.get('/logs', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { date, limit = 50 } = req.query;
  
  let userLogs = exerciseLogs.filter(log => log.userId === req.user?.id);
  
  if (date) {
    userLogs = userLogs.filter(log => log.date === date);
  }
  
  // Sort by timestamp descending
  userLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Apply limit
  userLogs = userLogs.slice(0, parseInt(limit as string));
  
  logger.info(`Retrieved ${userLogs.length} exercise logs for user ${req.user?.id}`);
  
  res.status(200).json({
    success: true,
    message: 'Exercise logs retrieved successfully',
    data: userLogs
  });
}));

// DELETE /api/v1/exercise/logs/:id - Delete an exercise log
router.delete('/logs/:id', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const logIndex = exerciseLogs.findIndex(log => 
    log.id === parseInt(id) && log.userId === req.user?.id
  );
  
  if (logIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Exercise log not found'
    });
  }
  
  const deletedLog = exerciseLogs.splice(logIndex, 1)[0];
  
  logger.info(`User ${req.user?.id} deleted exercise log: ${deletedLog.exerciseType}`);
  
  res.status(200).json({
    success: true,
    message: 'Exercise log deleted successfully',
    data: deletedLog
  });
}));

// GET /api/v1/exercise/stats - Get exercise statistics
router.get('/stats', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const userLogs = exerciseLogs.filter(log => 
    log.userId === req.user?.id && log.date === targetDate
  );
  
  const stats = {
    totalDuration: userLogs.reduce((sum, log) => sum + log.duration, 0),
    totalSteps: userLogs.reduce((sum, log) => sum + log.steps, 0),
    totalCaloriesBurned: userLogs.reduce((sum, log) => sum + log.caloriesBurned, 0),
    exerciseCount: userLogs.length,
    date: targetDate
  };
  
  res.status(200).json({
    success: true,
    message: 'Exercise statistics retrieved successfully',
    data: stats
  });
}));

export default router;
