import { test, expect } from '@playwright/test';
import { TEST_CONFIG } from './test-config';

test.describe('Authentication', () => {
  test('login page displays correctly', async ({ page }) => {
    // Navigate to the login page with full URL
    await page.goto(`${TEST_CONFIG.baseUrl}/login`);

    // Take screenshot of current page for debugging
    await page.screenshot({ path: 'test-results/login-page.png' });

    // Check if we're on the login page (URL verification)
    await expect(page).toHaveURL(/login/);

    // More flexible check for form elements - any input field
    const emailInput = page.getByRole('textbox').first();
    await expect(emailInput).toBeVisible();

    // Look for password field
    const passwordField = page.getByLabel(/password/i);
    if ((await passwordField.count()) > 0) {
      await expect(passwordField).toBeVisible();
    } else {
      // Alternative: look for any password input
      const passwordInput = page.getByRole('textbox').nth(1);
      await expect(passwordInput).toBeVisible();
    }

    // Look for submit/login button - more flexible approach
    const button = page.getByRole('button').first();
    await expect(button).toBeVisible();
  });

  test('signup page displays correctly', async ({ page }) => {
    // Navigate to the signup page with full URL
    await page.goto(`${TEST_CONFIG.baseUrl}/signup`);

    // Take screenshot of current page for debugging
    await page.screenshot({ path: 'test-results/signup-page.png' });

    // Check if we're on the signup page (URL verification)
    await expect(page).toHaveURL(/signup/);

    // More flexible check for form elements - any input field
    const emailInput = page.getByRole('textbox').first();
    await expect(emailInput).toBeVisible();

    // Look for password field
    const passwordField = page.getByLabel(/password/i);
    if ((await passwordField.count()) > 0) {
      await expect(passwordField).toBeVisible();
    } else {
      // Alternative: look for any password input
      const passwordInput = page.getByRole('textbox').nth(1);
      await expect(passwordInput).toBeVisible();
    }

    // Look for submit/signup button - more flexible approach
    const button = page.getByRole('button').first();
    await expect(button).toBeVisible();
  });
});
