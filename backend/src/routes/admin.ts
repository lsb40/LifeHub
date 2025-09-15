import { Router } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Admin-only routes
router.get('/metrics', authenticate, authorize('ADMIN'), asyncHandler(async (req: AuthRequest, res) => {
  res.json({ success: true, message: 'Admin metrics endpoint - to be implemented' });
}));

router.get('/users', authenticate, authorize('ADMIN'), asyncHandler(async (req: AuthRequest, res) => {
  res.json({ success: true, message: 'Admin users endpoint - to be implemented' });
}));

export default router;
