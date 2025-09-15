import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// In-memory storage for demo (replace with database in production)
let waterLogs: any[] = [];

// POST /api/v1/water/log - Log water intake
router.post('/log', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid water amount is required'
    });
  }
  
  const newLog = {
    id: Date.now(),
    userId: req.user?.id,
    amount: parseInt(amount),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    timestamp: new Date().toISOString()
  };
  
  waterLogs.push(newLog);
  
  logger.info(`User ${req.user?.id} logged water: ${amount}ml`);
  
  res.status(201).json({
    success: true,
    message: 'Water intake logged successfully',
    data: newLog
  });
}));

// GET /api/v1/water/logs - Get user's water logs
router.get('/logs', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { date, limit = 50 } = req.query;
  
  let userLogs = waterLogs.filter(log => log.userId === req.user?.id);
  
  if (date) {
    userLogs = userLogs.filter(log => log.date === date);
  }
  
  // Sort by timestamp descending
  userLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Apply limit
  userLogs = userLogs.slice(0, parseInt(limit as string));
  
  logger.info(`Retrieved ${userLogs.length} water logs for user ${req.user?.id}`);
  
  res.status(200).json({
    success: true,
    message: 'Water logs retrieved successfully',
    data: userLogs
  });
}));

// DELETE /api/v1/water/logs/:id - Delete a water log
router.delete('/logs/:id', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;
  const logIndex = waterLogs.findIndex(log => 
    log.id === parseInt(id) && log.userId === req.user?.id
  );
  
  if (logIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Water log not found'
    });
  }
  
  const deletedLog = waterLogs.splice(logIndex, 1)[0];
  
  logger.info(`User ${req.user?.id} deleted water log: ${deletedLog.amount}ml`);
  
  res.status(200).json({
    success: true,
    message: 'Water log deleted successfully',
    data: deletedLog
  });
}));

// GET /api/v1/water/stats - Get water statistics
router.get('/stats', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const userLogs = waterLogs.filter(log => 
    log.userId === req.user?.id && log.date === targetDate
  );
  
  const totalAmount = userLogs.reduce((sum, log) => sum + log.amount, 0);
  const glasses = Math.round(totalAmount / 250); // Assuming 250ml per glass
  
  const stats = {
    totalAmount,
    glasses,
    entries: userLogs.length,
    date: targetDate
  };
  
  res.status(200).json({
    success: true,
    message: 'Water statistics retrieved successfully',
    data: stats
  });
}));

export default router;
