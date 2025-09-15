import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lifehub.com' },
    update: {},
    create: {
      email: 'admin@lifehub.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true
    }
  });

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@lifehub.com' },
    update: {},
    create: {
      email: 'user@lifehub.com',
      username: 'demo_user',
      password: userPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'USER',
      isActive: true,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'OTHER',
      height: 170,
      weight: 70,
      activityLevel: 'MODERATELY_ACTIVE'
    }
  });

  console.log('✅ Users created:', { admin: admin.email, user: user.email });

  // Create sample foods
  const foods = [
    {
      name: 'Apple',
      brand: 'Generic',
      calories: 52,
      protein: 0.3,
      carbohydrates: 13.8,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10.4,
      sodium: 1,
      servingSize: 100,
      servingUnit: 'g',
      category: 'Fruits',
      isVerified: true,
      source: 'USDA'
    },
    {
      name: 'Banana',
      brand: 'Generic',
      calories: 89,
      protein: 1.1,
      carbohydrates: 22.8,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12.2,
      sodium: 1,
      servingSize: 100,
      servingUnit: 'g',
      category: 'Fruits',
      isVerified: true,
      source: 'USDA'
    },
    {
      name: 'Chicken Breast',
      brand: 'Generic',
      calories: 165,
      protein: 31,
      carbohydrates: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      servingSize: 100,
      servingUnit: 'g',
      category: 'Meat',
      isVerified: true,
      source: 'USDA'
    },
    {
      name: 'Brown Rice',
      brand: 'Generic',
      calories: 111,
      protein: 2.6,
      carbohydrates: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
      servingSize: 100,
      servingUnit: 'g',
      category: 'Grains',
      isVerified: true,
      source: 'USDA'
    },
    {
      name: 'Greek Yogurt',
      brand: 'Generic',
      calories: 59,
      protein: 10,
      carbohydrates: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.6,
      sodium: 36,
      servingSize: 100,
      servingUnit: 'g',
      category: 'Dairy',
      isVerified: true,
      source: 'USDA'
    }
  ];

  for (const foodData of foods) {
    await prisma.food.upsert({
      where: { name: foodData.name },
      update: {},
      create: foodData
    });
  }

  console.log('✅ Sample foods created');

  // Create sample goals for demo user
  const goals = [
    {
      userId: user.id,
      type: 'CALORIES',
      target: 2000,
      unit: 'kcal',
      startDate: new Date(),
      isActive: true
    },
    {
      userId: user.id,
      type: 'WATER',
      target: 2000,
      unit: 'ml',
      startDate: new Date(),
      isActive: true
    },
    {
      userId: user.id,
      type: 'STEPS',
      target: 10000,
      unit: 'steps',
      startDate: new Date(),
      isActive: true
    }
  ];

  for (const goalData of goals) {
    await prisma.goal.create({
      data: goalData
    });
  }

  console.log('✅ Sample goals created');

  // Create sample nutrition logs
  const apple = await prisma.food.findFirst({ where: { name: 'Apple' } });
  const chicken = await prisma.food.findFirst({ where: { name: 'Chicken Breast' } });
  const rice = await prisma.food.findFirst({ where: { name: 'Brown Rice' } });

  if (apple && chicken && rice) {
    const nutritionLogs = [
      {
        userId: user.id,
        foodId: apple.id,
        quantity: 150,
        mealType: 'BREAKFAST',
        loggedAt: new Date()
      },
      {
        userId: user.id,
        foodId: chicken.id,
        quantity: 200,
        mealType: 'LUNCH',
        loggedAt: new Date()
      },
      {
        userId: user.id,
        foodId: rice.id,
        quantity: 150,
        mealType: 'LUNCH',
        loggedAt: new Date()
      }
    ];

    for (const logData of nutritionLogs) {
      await prisma.nutritionLog.create({
        data: logData
      });
    }

    console.log('✅ Sample nutrition logs created');
  }

  // Create sample water logs
  const waterLogs = [
    { userId: user.id, amount: 250, loggedAt: new Date() },
    { userId: user.id, amount: 300, loggedAt: new Date() },
    { userId: user.id, amount: 200, loggedAt: new Date() }
  ];

  for (const logData of waterLogs) {
    await prisma.waterLog.create({
      data: logData
    });
  }

  console.log('✅ Sample water logs created');

  // Create sample mood logs
  const moodLogs = [
    {
      userId: user.id,
      mood: 'HAPPY',
      energy: 8,
      stress: 3,
      sleep: 7,
      notes: 'Feeling great today!',
      loggedAt: new Date()
    },
    {
      userId: user.id,
      mood: 'NEUTRAL',
      energy: 6,
      stress: 5,
      sleep: 6,
      notes: 'Average day',
      loggedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    }
  ];

  for (const logData of moodLogs) {
    await prisma.moodLog.create({
      data: logData
    });
  }

  console.log('✅ Sample mood logs created');

  // Create sample step logs
  const stepLogs = [
    { userId: user.id, steps: 8500, distance: 6.2, calories: 350, loggedAt: new Date() },
    { userId: user.id, steps: 12000, distance: 8.7, calories: 480, loggedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  ];

  for (const logData of stepLogs) {
    await prisma.stepLog.create({
      data: logData
    });
  }

  console.log('✅ Sample step logs created');

  // Create sample exercise logs
  const exerciseLogs = [
    {
      userId: user.id,
      name: 'Morning Run',
      type: 'RUNNING',
      duration: 30,
      calories: 300,
      intensity: 'MODERATE',
      notes: 'Great run in the park',
      loggedAt: new Date()
    },
    {
      userId: user.id,
      name: 'Weight Training',
      type: 'STRENGTH',
      duration: 45,
      calories: 200,
      intensity: 'HIGH',
      notes: 'Upper body workout',
      loggedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  for (const logData of exerciseLogs) {
    await prisma.exerciseLog.create({
      data: logData
    });
  }

  console.log('✅ Sample exercise logs created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('Admin: admin@lifehub.com / admin123');
  console.log('User: user@lifehub.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
