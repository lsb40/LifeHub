import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user@lifehub.com');
    await page.fill('input[type="password"]', 'user123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display dashboard with stats', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check for stat cards
    await expect(page.locator('text=Calories Today')).toBeVisible();
    await expect(page.locator('text=Water Intake')).toBeVisible();
    await expect(page.locator('text=Steps Today')).toBeVisible();
    await expect(page.locator('text=Mood Score')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('text=Logged breakfast')).toBeVisible();
  });

  test('should display quick actions', async ({ page }) => {
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    await expect(page.locator('text=Log Food')).toBeVisible();
    await expect(page.locator('text=Add Water')).toBeVisible();
    await expect(page.locator('text=Log Mood')).toBeVisible();
    await expect(page.locator('text=Add Exercise')).toBeVisible();
  });

  test('should navigate to different pages from sidebar', async ({ page }) => {
    // Test navigation to Foods page
    await page.click('text=Foods');
    await expect(page).toHaveURL('/foods');
    await expect(page.locator('h1')).toContainText('Food Database');
    
    // Test navigation to Nutrition page
    await page.click('text=Nutrition');
    await expect(page).toHaveURL('/nutrition');
    await expect(page.locator('h1')).toContainText('Nutrition Tracking');
    
    // Test navigation back to Dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/dashboard');
  });
});
