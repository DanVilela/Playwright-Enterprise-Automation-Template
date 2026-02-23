// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for enterprise E2E automation
 * 
 * Architecture:
 * - Parallel execution enabled for CI/CD efficiency
 * - Retries = 1 to catch flaky tests without hiding real issues
 * - Screenshots and videos only on failure to reduce artifact size
 * - JUnit reporter for Xray Cloud integration
 */

export default defineConfig({
  testDir: './tests',
  
  /* Timeout settings */
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },

  /* Parallel execution configuration */
  fullyParallel: true,
  workers: process.env.CI ? 1 : 4,
  
  /* Retry strategy - catch flaky tests without masking real failures */
  retries: 1,

  /* Report settings */
  reporter: [
    ['junit', { outputFile: 'results.xml' }],
    ['html'],
    ['list'],
  ],

  /* Shared settings for all projects */
  use: {
    /* Base URL for relative URLs in tests */
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    
    /* Network and browser settings */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Request parameters */
    actionTimeout: 5 * 1000,
    navigationTimeout: 30 * 1000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
