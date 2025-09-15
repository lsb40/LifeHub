import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler, CustomError } from '../middleware/errorHandler';
import { prisma } from '../index';
import { cache } from '../utils/redis';

const router = Router();

/**
 * @swagger
 * /foods/search:
 *   get:
 *     summary: Search for foods
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Foods found successfully
 */
router.get('/search', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  
  if (!q || typeof q !== 'string') {
    throw new CustomError('Search query is required', 400);
  }

  const skip = (Number(page) - 1) * Number(limit);
  
  // Check cache first
  const cacheKey = `food_search:${q}:${page}:${limit}`;
  const cached = await cache.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const foods = await prisma.food.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    },
    skip,
    take: Number(limit),
    orderBy: { name: 'asc' }
  });

  const total = await prisma.food.count({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    }
  });

  const result = {
    success: true,
    data: {
      foods,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  };

  // Cache for 5 minutes
  await cache.set(cacheKey, JSON.stringify(result), 300);

  res.json(result);
}));

/**
 * @swagger
 * /foods/{id}:
 *   get:
 *     summary: Get food by ID
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food retrieved successfully
 *       404:
 *         description: Food not found
 */
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  const food = await prisma.food.findUnique({
    where: { id }
  });

  if (!food) {
    throw new CustomError('Food not found', 404);
  }

  res.json({
    success: true,
    data: { food }
  });
}));

export default router;
