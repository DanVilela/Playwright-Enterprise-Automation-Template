import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { testUsers } from '../fixtures/testData.js';

/**
 * Login Tests
 * 
 * Test Strategy:
 * - No business logic in spec files
 * - All assertions use Playwright expect
 * - Page interactions delegated to Page Objects
 * - Xray Test Key in title for traceability
 * - Tagging for test categorization (@smoke, @regression, @critical)
 */

test.describe('Authentication', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('@smoke XRAY-1 Valid login', async ({ page }) => {
    // Given: I am on the login page
    await expect(loginPage.page.locator(loginPage.loginContainer)).toBeVisible();

    // When: I login with valid credentials
    const { username, password } = testUsers.validUser;
    await loginPage.login(username, password);

    // Then: I should be redirected to the products page
    const productsPage = new ProductsPage(page);
    await expect(productsPage.page.url()).toContain('/inventory.html');
    await expect(
      productsPage.page.locator(productsPage.inventoryContainer)
    ).toBeVisible();
  });

  test('@regression XRAY-3 Invalid login attempts', async ({ page }) => {
    // Given: I am on the login page
    await expect(loginPage.page.locator(loginPage.loginContainer)).toBeVisible();

    // When: I attempt login with invalid credentials
    const { username, password } = testUsers.invalidUser;
    await loginPage.login(username, password);

    // Then: I should see an error message
    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBe(true);

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });

  test('@critical XRAY-4 Locked user login', async ({ page }) => {
    // Given: I am on the login page
    await expect(loginPage.page.locator(loginPage.loginContainer)).toBeVisible();

    // When: I attempt login with locked user credentials
    const { username, password } = testUsers.lockedUser;
    await loginPage.login(username, password);

    // Then: I should see locked out error
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('locked out');
  });
});
