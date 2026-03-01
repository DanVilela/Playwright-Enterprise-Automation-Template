import axios from 'axios';
import fs from 'fs';

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

  async authenticate() {
    console.log('🔐 Authenticating with Xray Cloud...');

    const response = await axios.post(
      `${this.baseURL}/authenticate`,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }
    );

    this.token = response.data;
    console.log('✅ Xray authentication successful');
  }

  async uploadResults(filePath) {
    if (!this.token) {
      await this.authenticate();
    }

    console.log(`📤 Reading results from ${filePath}...`);

    const xml = fs.readFileSync(filePath, 'utf8');

    const tests = [];

    // Divide o XML por blocos de testcase
    const testcaseParts = xml.split('<testcase');

    for (let part of testcaseParts) {
      if (!part.includes('name="')) continue;

      const nameMatch = part.match(/name="([^"]+)"/);
      if (!nameMatch) continue;

      const name = nameMatch[1];

      const keyMatch = name.match(/\[([A-Z]+-\d+)\]/);
      if (!keyMatch) continue;

      const testKey = keyMatch[1];

      // Se o bloco do teste contém <failure>, é FAILED
      const status = part.includes('<failure') ? 'FAILED' : 'PASSED';

      tests.push({ testKey, status });
    }

    if (tests.length === 0) {
      throw new Error('No valid test keys found in results.xml');
    }

    const payload = {
      testExecutionKey: 'XRAY-2', // 🔁 Ajuste se necessário
      tests,
    };

    console.log('📦 Sending JSON to Xray:');
    console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(
        `${this.baseURL}/import/execution`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Upload successful!');
      return response.data;
    } catch (error) {
      console.error('❌ XRAY ERROR RESPONSE:');
      console.error(error.response?.data || error.message);
      throw error;
    }
  }
}