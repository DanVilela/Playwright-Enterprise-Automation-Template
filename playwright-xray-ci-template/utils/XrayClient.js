import axios from 'axios';

/**
 * XrayClient - Handles authentication and API communication with Xray Cloud
 * 
 * Responsibilities:
 * - Generate Bearer token using client credentials
 * - Upload JUnit results to Xray Cloud
 * - Handle authentication errors
 * 
 * Architecture:
 * - Uses environment variables for secrets (never hardcoded)
 * - Implements Bearer token authentication
 * - Provides error handling and logging
 */

export class XrayClient {
  constructor() {
    this.clientId = process.env.XRAY_CLIENT_ID;
    this.clientSecret = process.env.XRAY_CLIENT_SECRET;
    this.baseURL = 'https://xray.cloud.getxray.app/api/v2';
    this.token = null;

    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'XRAY_CLIENT_ID and XRAY_CLIENT_SECRET environment variables are required'
      );
    }
  }

  /**
   * Authenticate with Xray Cloud and get Bearer token
   * @returns {Promise<string>} Bearer token
   */
  async authenticate() {
    try {
      console.log('🔐 Authenticating with Xray Cloud...');
      
      const response = await axios.post(
        `${this.baseURL}/authenticate`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }
      );

      this.token = response.data.token;
      console.log('✅ Xray authentication successful');
      return this.token;
    } catch (error) {
      console.error('❌ Xray authentication failed:', error.message);
      throw new Error(`Xray authentication failed: ${error.message}`);
    }
  }

  /**
   * Upload JUnit results to Xray Cloud
   * @param {string} filePath - Path to results.xml file
   * @returns {Promise<Object>} Upload response
   */
  async uploadResults(filePath) {
    try {
      if (!this.token) {
        await this.authenticate();
      }

      console.log(`📤 Uploading results from ${filePath}...`);

      const fs = await import('fs').then(m => m.default);
      const resultsContent = fs.readFileSync(filePath, 'utf8');

      const response = await axios.post(
        `${this.baseURL}/import/execution/junit`,
        resultsContent,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/xml',
          },
        }
      );

      console.log('✅ Results uploaded successfully to Xray');
      console.log(`Execution ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to upload results:', error.message);
      throw new Error(`Upload to Xray failed: ${error.message}`);
    }
  }

  /**
   * Get Bearer token (authenticates if needed)
   * @returns {Promise<string>} Bearer token
   */
  async getToken() {
    if (!this.token) {
      await this.authenticate();
    }
    return this.token;
  }
}
