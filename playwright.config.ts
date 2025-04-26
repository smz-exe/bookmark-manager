import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    headless: true, // Using headless mode to avoid system dependencies
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
