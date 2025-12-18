import { test, expect } from '@playwright/test';

test.describe('AI Features', () => {
  test('User can create a note and trigger AI summarize', async ({ page }) => {
    await page.goto('/');
    
    // Register and login
    await page.getByRole('button', { name: 'Get Started' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome Back' }).or(page.getByRole('heading', { name: 'Create Account' }))).toBeVisible();
    
    const createAccountHeading = page.getByRole('heading', { name: 'Create Account' });
    if (!(await createAccountHeading.isVisible())) {
      await page.getByRole('button', { name: /Don't have an account\? Sign up/i }).click();
    }
    
    const timestamp = Date.now();
    const uniqueEmail = `aiuser${timestamp}@example.com`;
    const uniqueUsername = `aiuser${timestamp}`;
    const password = 'TestPassword123!';
    
    await page.locator('input[name="username"]').fill(uniqueUsername);
    await page.locator('input[name="email"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Wait for main app
    await expect(page.getByRole('heading', { name: 'NeuraNotes' })).toBeVisible();
    
    // Create a note first
    await page.getByRole('button', { name: /New Note/i }).click();
    await expect(page.getByRole('heading', { name: 'Create New Note' })).toBeVisible();
    
    const noteTitle = `AI Test Note ${timestamp}`;
    const noteContent = 'This is a comprehensive note about artificial intelligence and machine learning. It covers various topics including neural networks, deep learning, and natural language processing.';
    
    await page.getByPlaceholder('Enter note title...').fill(noteTitle);
    
    const editor = page.locator('.ql-editor').first();
    await editor.click();
    await editor.type(noteContent, { delay: 50 });
    
    await page.getByRole('button', { name: 'Save Note' }).click();
    
    // Wait for note to be saved and appear in list
    await expect(page.getByText(noteTitle)).toBeVisible({ timeout: 10000 });
    
    // Find the note card containing the note title - look for the card that has both the title and the Summarize button
    const noteCard = page.locator('div.bg-white').filter({ hasText: noteTitle }).first();
    await expect(noteCard).toBeVisible();
    
    // Click the Summarize button within the note card
    const summarizeButton = noteCard.getByRole('button', { name: /Summarize/i });
    await expect(summarizeButton).toBeVisible();
    await summarizeButton.click();
    
    // Wait for AI summary to appear (it appears in a purple box with "AI Summary" heading)
    // The summary section has text "AI Summary" and is in a div with purple gradient background
    // Use getByText with exact match to avoid strict mode violation
    const aiSummaryHeading = noteCard.getByText('AI Summary', { exact: true });
    await expect(aiSummaryHeading).toBeVisible({ timeout: 30000 });
    
    // Verify AI summary container with purple background is visible
    // The container div has the purple gradient classes
    const summaryContainer = noteCard.locator('div.bg-gradient-to-r').filter({ hasText: 'AI Summary' }).first();
    await expect(summaryContainer).toBeVisible();
  });
});

