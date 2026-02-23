import { BasePage } from './BasePage.js';

/**
 * LoginPage - Page Object for Sauce Demo login page
 * 
 * Selectors chosen by preference order:
 * 1. data-test attribute (most stable)
 * 2. role-based selectors
 * 3. stable CSS selectors
 * 
 * No assertions in this class - only UI interactions
 */

export class LoginPage extends BasePage {
  // Selectors
  usernameInput = '[data-test="username"]';
  passwordInput = '[data-test="password"]';
  loginButton = '[data-test="login-button"]';
  errorMessage = '[data-test="error"]';
  loginContainer = '.login_container';

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.goto('/');
  }

  /**
   * Perform login with credentials
   * @param {string} username - Username to login with
   * @param {string} password - Password to login with
   */
  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    // Wait for navigation after login
    await this.waitForNavigation();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is visible
   * @returns {Promise<boolean>} Error visibility state
   */
  async isErrorVisible() {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Check if login page is loaded
   * @returns {Promise<boolean>} Login page visibility state
   */
  async isLoginPageLoaded() {
    return await this.isElementVisible(this.loginContainer);
  }
}
