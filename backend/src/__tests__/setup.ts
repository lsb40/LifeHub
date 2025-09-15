import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lifehub_test',
    },
  },
});

beforeAll(async () => {
  // Clean up database before tests
  await prisma.$executeRaw`TRUNCATE TABLE "users", "foods", "goals", "nutrition_logs", "water_logs", "mood_logs", "step_logs", "exercise_logs" RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
