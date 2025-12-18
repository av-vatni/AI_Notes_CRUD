import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('User can register a new account', async ({ page }) => {
    await page.goto('/');
    
    // Click "Get Started" button to open auth modal
    await page.getByRole('button', { name: 'Get Started' }).click();
    
    // Wait for auth modal to appear (could be login or register mode)
    await expect(
      page.getByRole('heading', { name: 'Welcome Back' }).or(
        page.getByRole('heading', { name: 'Create Account' })
      )
    ).toBeVisible();
    
    // Switch to register mode if not already
    const createAccountHeading = page.getByRole('heading', { name: 'Create Account' });
    if (!(await createAccountHeading.isVisible())) {
      await page.getByRole('button', { name: /Don't have an account\? Sign up/i }).click();
      await expect(createAccountHeading).toBeVisible();
    }
    
    // Generate unique email
    const timestamp = Date.now();
    const uniqueEmail = `testuser${timestamp}@example.com`;
    const uniqueUsername = `testuser${timestamp}`;
    const password = 'TestPassword123!';
    
    // Fill registration form
    await page.locator('input[name="username"]').fill(uniqueUsername);
    await page.locator('input[name="email"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    
    // Submit registration
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Wait for auth modal to close and main app to appear
    await expect(page.getByRole('heading', { name: 'NeuraNotes' })).toBeVisible();
    await expect(page.getByText(`Welcome, ${uniqueUsername}!`)).toBeVisible();
  });

  test('User can login with existing credentials', async ({ page }) => {
    await page.goto('/');
    
    // First, register a user
    await page.getByRole('button', { name: 'Get Started' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome Back' }).or(page.getByRole('heading', { name: 'Create Account' }))).toBeVisible();
    
    // Switch to register if needed
    const createAccountHeading = page.getByRole('heading', { name: 'Create Account' });
    if (!(await createAccountHeading.isVisible())) {
      await page.getByRole('button', { name: /Don't have an account\? Sign up/i }).click();
    }
    
    const timestamp = Date.now();
    const uniqueEmail = `loginuser${timestamp}@example.com`;
    const uniqueUsername = `loginuser${timestamp}`;
    const password = 'TestPassword123!';
    
    await page.locator('input[name="username"]').fill(uniqueUsername);
    await page.locator('input[name="email"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Wait for registration to complete
    await expect(page.getByRole('heading', { name: 'NeuraNotes' })).toBeVisible();
    
    // Logout
    await page.getByRole('button', { name: /Logout/i }).click();
    
    // Wait for page to reload and show landing page
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
    
    // Login
    await page.getByRole('button', { name: 'Get Started' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome Back' }).or(page.getByRole('heading', { name: 'Create Account' }))).toBeVisible();
    
    // Switch to login if needed
    const welcomeHeading = page.getByRole('heading', { name: 'Welcome Back' });
    if (!(await welcomeHeading.isVisible())) {
      await page.getByRole('button', { name: /Already have an account\? Sign in/i }).click();
    }
    
    await page.locator('input[name="email"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Verify successful login
    await expect(page.getByRole('heading', { name: 'NeuraNotes' })).toBeVisible();
    await expect(page.getByText(`Welcome, ${uniqueUsername}!`)).toBeVisible();
  });
});

