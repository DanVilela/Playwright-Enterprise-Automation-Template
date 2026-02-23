import { BasePage } from './BasePage.js';

/**
 * CartPage - Page Object for Sauce Demo shopping cart
 * 
 * Responsibilities:
 * - Manage cart operations (view, update, checkout)
 * - No assertions - only UI interactions
 */

export class CartPage extends BasePage {
  // Selectors
  cartContainer = 'div.cart_list';
  cartItem = '.cart_item';
  checkoutButton = '[data-test="checkout"]';
  continueShoppingButton = '[data-test="continue-shopping"]';
  cartQuantity = '.cart_quantity';
  cartPrice = '.inventory_item_price';

  /**
   * Check if cart page is loaded
   * @returns {Promise<boolean>} Cart page visibility state
   */
  async isCartPageLoaded() {
    return await this.isElementVisible(this.cartContainer);
  }

  /**
   * Get number of items in cart
   * @returns {Promise<number>} Count of cart items
   */
  async getCartItemCount() {
    const items = await this.page.locator(this.cartItem).count();
    return items;
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.click(this.checkoutButton);
    await this.waitForNavigation();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    await this.click(this.continueShoppingButton);
    await this.waitForNavigation();
  }
}
