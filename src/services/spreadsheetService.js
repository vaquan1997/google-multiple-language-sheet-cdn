import { google } from 'googleapis';
import config from '../config/index.js';
import { logError, logInfo } from '../utils/logger.js';

export const readSpreadsheet = async () => {
  try {
    logInfo('📥 Đang lấy dữ liệu từ Google Sheets...');
    
    const sheets = google.sheets({ version: 'v4', auth: config.googleSheets.apiKey });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.googleSheets.spreadsheetId,
      range: config.googleSheets.range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      logInfo('✅ Không có dữ liệu trong Google Sheets');
      return [];
    }

    // Transform Google Sheets data to expected format
    const headers = rows[0]; // [' ', 'key', 'English', 'TV']
    
    // Map column names to locale codes
    const localeMapping = {
      'English': 'en',
      'TV': 'vi'  // TV = Tiếng Việt
    };
    
    const transformedData = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const key = row[1]; // Key is in column 2 (index 1)
      
      if (!key || key === 'key') continue; // Skip empty keys or header row
      
      // Process each language column (starting from index 2)
      for (let j = 2; j < headers.length; j++) {
        const columnName = headers[j];
        const locale = localeMapping[columnName] || columnName.toLowerCase();
        const value = row[j] || '';
        
        if (value && value !== columnName) { // Skip header values
          transformedData.push({ locale, key, value });
        }
      }
    }

    logInfo(`✅ Đã lấy ${transformedData.length} dòng dữ liệu`);
    return transformedData;
  } catch (error) {
    logError(`Error reading Google Sheets: ${error.message}`);
    throw error;
  }
};

export const parseLanguageData = (data) => {
  const languages = {};

  data.forEach((row) => {
    const { locale, key, value } = row;
    if (!languages[locale]) {
      languages[locale] = {};
    }
    languages[locale][key] = value;
  });

  const languageKeys = Object.keys(languages);
  logInfo(`📦 Tìm thấy ${languageKeys.length} ngôn ngữ: ${languageKeys.join(', ')}`);

  return languages;
};