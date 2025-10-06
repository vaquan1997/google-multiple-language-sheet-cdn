const { google } = require('googleapis');
const config = require('./config');

class GoogleSheetsService {
  constructor() {
    this.sheets = google.sheets({ version: 'v4', auth: config.googleSheets.apiKey });
  }

  async fetchData() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: config.googleSheets.spreadsheetId,
        range: config.googleSheets.range,
      });

      return this.transformData(response.data.values);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ Google Sheets:', error);
      throw error;
    }
  }

  transformData(rows) {
    if (!rows || rows.length === 0) {
      return {};
    }

    // Row đầu tiên là header: ['key', 'vi', 'en', 'ja', ...]
    const headers = rows[0];
    const languages = headers.slice(1); // Bỏ cột 'key'
    
    const result = {};
    
    // Khởi tạo object cho mỗi ngôn ngữ
    languages.forEach(lang => {
      result[lang] = {};
    });

    // Xử lý từng row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const key = row[0];
      
      if (!key) continue;

      // Gán giá trị cho mỗi ngôn ngữ
      languages.forEach((lang, index) => {
        result[lang][key] = row[index + 1] || '';
      });
    }

    return result;
  }
}

module.exports = new GoogleSheetsService();