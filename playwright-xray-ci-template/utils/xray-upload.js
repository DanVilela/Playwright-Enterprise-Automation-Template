import dotenv from 'dotenv';
import { XrayClient } from './XrayClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    console.log('🚀 Starting Xray upload...');

    const resultsPath = path.join(__dirname, '../results.xml');

    if (!fs.existsSync(resultsPath)) {
      console.error('❌ results.xml not found at:', resultsPath);
      process.exit(1);
    }

    console.log('📂 Found results.xml');

    const client = new XrayClient();
    await client.uploadResults(resultsPath);

    console.log('🎉 Xray upload finished successfully');
  } catch (error) {
    console.error('\n❌ Upload failed');
    console.error(error);
    process.exit(1);
  }
}

main();