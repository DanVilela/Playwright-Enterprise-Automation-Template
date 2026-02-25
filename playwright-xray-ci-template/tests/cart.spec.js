import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { testUsers, testProducts } from '../fixtures/testData.js';

/**
 * Shopping Cart Tests
 * 
 * Test Strategy:
 * - No business logic in spec files
 * - All assertions use Playwright expect
 * - Page interactions delegated to Page Objects
 * - Xray Test Key in title for traceability
 */

test.describe('Shopping Cart', () => {
  let loginPage;
  let productsPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    // Setup: Login to access products
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await loginPage.navigateToLogin();
    const { username, password } = testUsers.validUser;
    await loginPage.login(username, password);

    // Verify we're on products page
    await expect(
      productsPage.page.locator(productsPage.inventoryContainer)
    ).toBeVisible();
  });

  test('@regression [SCRUM-2] Add product to cart', async ({ page }) => {
    // Given: I am on the products page
    const initialCount = await productsPage.getProductCount();
    expect(initialCount).toBeGreaterThan(0);

    // When: I add the first product to cart
    await productsPage.addProductToCart(testProducts.backpackIndex);

    // Then: Cart badge should show 1 item
    await expect(
      page.locator(productsPage.cartBadge)
    ).toContainText('1');

    // And: The add to cart button should change to remove
    const cartBadgeText = await productsPage.getCartCount();
    expect(cartBadgeText).toBe('1');
  });

  test('@regression SCRUM-7 View cart and verify item', async ({ page }) => {
    // Given: I have added a product to cart
    await productsPage.addProductToCart(testProducts.backpackIndex);
    await expect(
      page.locator(productsPage.cartBadge)
    ).toContainText('1');

    // When: I navigate to the cart
    await productsPage.goToCart();

    // Then: I should see the item in the cart
    await expect(page.locator(cartPage.cartContainer)).toBeVisible();
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
  });

  test('@regression SCRUM-8 Remove product from cart', async ({ page }) => {
    // Given: I have a product in the cart
    await productsPage.addProductToCart(testProducts.backpackIndex);
    await productsPage.goToCart();

    // When: I click remove button
    const removeButton = page.locator(cartPage.cartItem).first().locator('button:has-text("Remove")');
    await removeButton.click();

    // Then: The cart should be empty
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);
  });
});
