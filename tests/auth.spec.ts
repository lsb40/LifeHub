import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/LifeHub/);
    await expect(page.locator('h2')).toContainText('Sign in to your account');
  });

  test('should login with demo credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in demo user credentials
    await page.fill('input[type="email"]', 'user@lifehub.com');
    await page.fill('input[type="password"]', 'user123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should login with admin credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in admin credentials
    await page.fill('input[type="email"]', 'admin@lifehub.com');
    await page.fill('input[type="password"]', 'admin123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user@lifehub.com');
    await page.fill('input[type="password"]', 'user123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await expect(page).toHaveURL('/dashboard');
    
    // Click profile menu and logout
    await page.click('button[aria-label="Open user menu"]');
    await page.click('text=Sign out');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});
