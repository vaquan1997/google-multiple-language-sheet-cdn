import dotenv from 'dotenv';
dotenv.config();

const config = {
  googleSheets: {
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    apiKey: process.env.GOOGLE_API_KEY,
    range: 'Sheet1!A1:Z1000'
  },
  cdn: {
    provider: process.env.CDN_PROVIDER || 'cloudinary',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  output: {
    folder: 'dist/languages',
    fileName: 'translations.json'
  },
  vercelDeployHookUrl: process.env.VERCEL_DEPLOY_HOOK_URL,
  vercelBaseUrl: process.env.VERCEL_BASE_URL
};

export default config;