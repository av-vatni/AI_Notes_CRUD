import { test, expect } from '@playwright/test';

test.describe('Notes Management', () => {
  test('User can create and view a new note', async ({ page }) => {
    await page.goto('/');
    
    // Register and login
    await page.getByRole('button', { name: 'Get Started' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome Back' }).or(page.getByRole('heading', { name: 'Create Account' }))).toBeVisible();
    
    const createAccountHeading = page.getByRole('heading', { name: 'Create Account' });
    if (!(await createAccountHeading.isVisible())) {
      await page.getByRole('button', { name: /Don't have an account\? Sign up/i }).click();
    }
    
    const timestamp = Date.now();
    const uniqueEmail = `notesuser${timestamp}@example.com`;
    const uniqueUsername = `notesuser${timestamp}`;
    const password = 'TestPassword123!';
    
    await page.locator('input[name="username"]').fill(uniqueUsername);
    await page.locator('input[name="email"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Wait for main app
    await expect(page.getByRole('heading', { name: 'NeuraNotes' })).toBeVisible();
    
    // Click "New Note" button to show note editor
    await page.getByRole('button', { name: /New Note/i }).click();
    
    // Wait for note editor to appear
    await expect(page.getByRole('heading', { name: 'Create New Note' })).toBeVisible();
    
    // Fill note form
    const noteTitle = `Test Note ${timestamp}`;
    const noteContent = 'This is a test note created by E2E test';
    
    await page.getByPlaceholder('Enter note title...').fill(noteTitle);
    
    // Fill ReactQuill editor content - click and type into the contenteditable div
    const editor = page.locator('.ql-editor').first();
    await editor.click();
    await editor.type(noteContent, { delay: 50 });
    
    // Save note
    await page.getByRole('button', { name: 'Save Note' }).click();
    
    // Wait for note editor to close (it closes after save)
    await expect(page.getByRole('heading', { name: 'Create New Note' })).not.toBeVisible({ timeout: 5000 });
    
    // Verify note appears in the notes list - look for the title in a note card
    await expect(page.getByText(noteTitle)).toBeVisible({ timeout: 10000 });
    // Verify note content is visible (may be truncated, so check for partial match)
    await expect(page.getByText(noteContent, { exact: false })).toBeVisible();
  });
});

