import { BasePage } from './BasePage.js';

/**
 * ProductsPage - Page Object for Sauce Demo products/inventory page
 * 
 * Responsibilities:
 * - Manage product selection and cart operations
 * - No assertions - only UI interactions
 */

export class ProductsPage extends BasePage {
  // Selectors
  inventoryContainer = '.inventory_container';
  productItem = '.inventory_item';
  addToCartButton = 'button[data-test*="add-to-cart"]';
  removeFromCartButton = 'button[data-test*="remove"]';
  cartBadge = '.shopping_cart_badge';
  cartLink = 'a.shopping_cart_link';
  sortDropdown = '[data-test="product_sort_container"]';

  /**
   * Check if products page is loaded
   * @returns {Promise<boolean>} Products page visibility state
   */
  async isProductPageLoaded() {
    return await this.isElementVisible(this.inventoryContainer);
  }

  /**
   * Get number of products on page
   * @returns {Promise<number>} Count of products
   */
  async getProductCount() {
    const items = await this.page.locator(this.productItem).count();
    return items;
  }

  /**
   * Add first product to cart by index
   * @param {number} index - Product index (0-based)
   */
  async addProductToCart(index = 0) {
    const addButtons = this.page.locator(this.addToCartButton);
    await addButtons.nth(index).click();
    // Wait for cart to update
    await this.page.waitForTimeout(500);
  }

  /**
   * Get cart badge count
   * @returns {Promise<string>} Cart item count
   */
  async getCartCount() {
    return await this.getText(this.cartBadge);
  }

  /**
   * Check if cart badge is visible
   * @returns {Promise<boolean>} Cart badge visibility
   */
  async isCartBadgeVisible() {
    return await this.isElementVisible(this.cartBadge);
  }

  /**
   * Navigate to cart
   */
  async goToCart() {
    await this.click(this.cartLink);
    await this.waitForNavigation();
  }
}
