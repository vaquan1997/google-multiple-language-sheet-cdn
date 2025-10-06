require('dotenv').config();

module.exports = {
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
  }
};