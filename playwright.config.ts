import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    headless: false, // Running in headed mode to visualize the browser tests
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
