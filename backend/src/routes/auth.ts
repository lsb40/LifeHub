import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler, CustomError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { email, password } = req.body;

  // Demo authentication - check against demo credentials
  if (email === 'admin@lifehub.com' && password === 'admin123') {
    const user = {
      id: 'admin-1',
      email: 'admin@lifehub.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    };

    const token = 'demo-admin-token-' + Date.now();

    logger.info(`Admin user logged in: ${user.email}`);

    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } else if (email === 'user@lifehub.com' && password === 'user123') {
    const user = {
      id: 'user-1',
      email: 'user@lifehub.com',
      username: 'demo_user',
      firstName: 'Demo',
      lastName: 'User',
      role: 'USER',
      createdAt: new Date().toISOString()
    };

    const token = 'demo-user-token-' + Date.now();

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } else {
    throw new CustomError('Invalid credentials', 401);
  }
}));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('username').isLength({ min: 3 }).trim(),
  body('firstName').optional().trim(),
  body('lastName').optional().trim()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { email, password, username, firstName, lastName } = req.body;

  // Demo registration - create a mock user
  const user = {
    id: 'user-' + Date.now(),
    email,
    username,
    firstName: firstName || '',
    lastName: lastName || '',
    role: 'USER',
    createdAt: new Date().toISOString()
  };

  const token = 'demo-token-' + Date.now();

  logger.info(`New user registered: ${user.email}`);

  res.status(201).json({
    success: true,
    data: {
      user,
      token
    }
  });
}));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', asyncHandler(async (req, res) => {
  // Demo user data
  const user = {
    id: 'user-1',
    email: 'user@lifehub.com',
    username: 'demo_user',
    firstName: 'Demo',
    lastName: 'User',
    role: 'USER',
    createdAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: { user }
  });
}));

export default router;