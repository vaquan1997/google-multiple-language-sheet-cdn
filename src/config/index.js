import dotenv from 'dotenv';

dotenv.config();

const config = {
  cdnUrl: process.env.CDN_URL || 'https://default-cdn-url.com',
  apiKey: process.env.CDN_API_KEY || 'your-default-api-key',
  spreadsheetId: process.env.SPREADSHEET_ID || 'your-default-spreadsheet-id',
  locales: ['en', 'vi'],
};

export default config;