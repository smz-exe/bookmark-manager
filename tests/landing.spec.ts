import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('landing page loads correctly', async ({ page }) => {
    // Navigate to the homepage with full URL
    await page.goto('http://localhost:3001/');

    // Check if the page has loaded by verifying some content
    await expect(page).toHaveTitle(/Bookmark Manager/);

    // Verify that important elements are visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/landing-page.png' });
  });

  test('navigation works correctly', async ({ page }) => {
    // Navigate to the homepage with full URL
    await page.goto('http://localhost:3001/');

    // Click on login button if it exists
    const loginButton = page.getByRole('link', { name: /login/i });
    if (await loginButton.isVisible()) {
      await loginButton.click();

      // Verify we're on the login page
      await expect(page.url()).toContain('/login');

      // Go back to home
      await page.goto('http://localhost:3001/');
    }

    // Check signup navigation if it exists
    const signupButton = page.getByRole('link', { name: /sign up/i });
    if (await signupButton.isVisible()) {
      await signupButton.click();

      // Verify we're on the signup page
      await expect(page.url()).toContain('/signup');
    }
  });
});
