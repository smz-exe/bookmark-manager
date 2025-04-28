import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    headless: !!process.env.CI,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      args: process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : [],
    },
  },
});
