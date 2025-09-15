import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Placeholder routes for wearable integration
router.post('/connect', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  res.json({ success: true, message: 'Connect wearable endpoint - to be implemented' });
}));

router.get('/sync', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  res.json({ success: true, message: 'Sync wearable data endpoint - to be implemented' });
}));

export default router;
