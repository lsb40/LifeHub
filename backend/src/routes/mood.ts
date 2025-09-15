import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// In-memory storage for demo (replace with database in production)
let moodLogs: any[] = [];

// POST /api/v1/mood/log - Log mood
router.post('/log', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { mood, notes, energy, stress } = req.body;
  
  if (!mood) {
    return res.status(400).json({
      success: false,
      message: 'Mood is required'
    });
  }
  
  const newLog = {
    id: Date.now(),
    userId: req.user?.id,
    mood,
    notes: notes || '',
    energy: parseInt(energy) || 5, // 1-10 scale
    stress: parseInt(stress) || 5, // 1-10 scale
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    timestamp: new Date().toISOString()
  };
  
  moodLogs.push(newLog);
  
  logger.info(`User ${req.user?.id} logged mood: ${mood}`);
  
  res.status(201).json({
    success: true,
    message: 'Mood logged successfully',
    data: newLog
  });
}));

// GET /api/v1/mood/logs - Get user's mood logs
router.get('/logs', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { date, limit = 50 } = req.query;
  
  let userLogs = moodLogs.filter(log => log.userId === req.user?.id);
  
  if (date) {
    userLogs = userLogs.filter(log => log.date === date);
  }
  
  // Sort by timestamp descending
  userLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Apply limit
  userLogs = userLogs.slice(0, parseInt(limit as string));
  
  logger.info(`Retrieved ${userLogs.length} mood logs for user ${req.user?.id}`);
  
  res.status(200).json({
    success: true,
    message: 'Mood logs retrieved successfully',
    data: userLogs
  });
}));

// DELETE /api/v1/mood/logs/:id - Delete a mood log
router.delete('/logs/:id', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const logIndex = moodLogs.findIndex(log => 
    log.id === parseInt(id) && log.userId === req.user?.id
  );
  
  if (logIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Mood log not found'
    });
  }
  
  const deletedLog = moodLogs.splice(logIndex, 1)[0];
  
  logger.info(`User ${req.user?.id} deleted mood log: ${deletedLog.mood}`);
  
  res.status(200).json({
    success: true,
    message: 'Mood log deleted successfully',
    data: deletedLog
  });
}));

// GET /api/v1/mood/stats - Get mood statistics
router.get('/stats', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { date, days = 7 } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  // Get logs for the specified number of days
  const endDate = new Date(targetDate);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - parseInt(days as string));
  
  const userLogs = moodLogs.filter(log => {
    if (log.userId !== req.user?.id) return false;
    const logDate = new Date(log.date);
    return logDate >= startDate && logDate <= endDate;
  });
  
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
    dateRange: {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    }
  };
  
  res.status(200).json({
    success: true,
    message: 'Mood statistics retrieved successfully',
    data: stats
  });
}));

export default router;
