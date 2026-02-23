/**
 * BasePage - Base class for all page objects
 * 
 * Responsibilities:
 * - Centralize common navigation and utility methods
 * - Enforce Page Object Model standards (no assertions)
 * - Provide consistent wait strategies
 */

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   * @param {string} url - URL to navigate to (absolute or relative)
   */
  async goto(url = '/') {
    await this.page.goto(url);
  }

  /**
   * Wait for element to be visible
   * Uses Playwright auto-waiting (no static waits)
   * @param {string} selector - CSS selector
   */
  async waitForElement(selector) {
    await this.page.locator(selector).waitFor({ state: 'visible' });
  }

  /**
   * Click element
   * @param {string} selector - CSS selector
   */
  async click(selector) {
    await this.page.locator(selector).click();
  }

  /**
   * Fill input field
   * @param {string} selector - CSS selector
   * @param {string} text - Text to fill
   */
  async fill(selector, text) {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Get text from element
   * @param {string} selector - CSS selector
   * @returns {Promise<string>} Element text
   */
  async getText(selector) {
    return await this.page.locator(selector).textContent();
  }

  /**
   * Check if element is visible
   * @param {string} selector - CSS selector
   * @returns {Promise<boolean>} Visibility state
   */
  async isElementVisible(selector) {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Get current URL
   * @returns {string} Current URL
   */
  getCurrentURL() {
    return this.page.url();
  }

  /**
   * Wait for navigation to complete
   * @returns {Promise<Response|null>} Navigation response
   */
  async waitForNavigation() {
    return await this.page.waitForLoadState('networkidle');
  }
}
