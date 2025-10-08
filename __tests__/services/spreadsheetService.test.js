import { google } from 'googleapis';
import { parseLanguageData, readSpreadsheet } from '../../src/services/spreadsheetService.js';
import { logError, logInfo } from '../../src/utils/logger.js';

jest.mock('googleapis');
jest.mock('../../src/utils/logger.js');
jest.mock('../../src/config/index.js', () => ({
  default: {
    googleSheets: {
      spreadsheetId: 'test-sheet-id',
      apiKey: 'test-api-key',
      range: 'Sheet1!A1:Z1000'
    }
  }
}));

describe('spreadsheetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readSpreadsheet', () => {
    it('should read spreadsheet data successfully', async () => {
      const mockSheets = {
        spreadsheets: {
          values: {
            get: jest.fn().mockResolvedValue({
              data: {
                values: [
                  [' ', 'key', 'English', 'TV'],
                  ['1', 'greeting', 'Hello', 'Xin chào'],
                  ['2', 'farewell', 'Goodbye', 'Tạm biệt']
                ]
              }
            })
          }
        }
      };

      google.sheets.mockReturnValue(mockSheets);

      const result = await readSpreadsheet();

      expect(logInfo).toHaveBeenCalledWith('📥 Đang lấy dữ liệu từ Google Sheets...');
      expect(logInfo).toHaveBeenCalledWith('✅ Đã lấy 4 dòng dữ liệu');
      expect(result).toEqual([
        { locale: 'en', key: 'greeting', value: 'Hello' },
        { locale: 'vi', key: 'greeting', value: 'Xin chào' },
        { locale: 'en', key: 'farewell', value: 'Goodbye' },
        { locale: 'vi', key: 'farewell', value: 'Tạm biệt' }
      ]);
    });

    it('should handle spreadsheet reading errors', async () => {
      const error = new Error('API Error');
      const mockSheets = {
        spreadsheets: {
          values: {
            get: jest.fn().mockRejectedValue(error)
          }
        }
      };

      google.sheets.mockReturnValue(mockSheets);

      await expect(readSpreadsheet()).rejects.toThrow('API Error');
      expect(logError).toHaveBeenCalledWith('Error reading Google Sheets: API Error');
    });
  });

  describe('parseLanguageData', () => {
    it('should parse language data correctly', () => {
      const mockData = [
        { locale: 'en', key: 'greeting', value: 'Hello' },
        { locale: 'en', key: 'farewell', value: 'Goodbye' },
        { locale: 'vi', key: 'greeting', value: 'Xin chào' },
        { locale: 'vi', key: 'farewell', value: 'Tạm biệt' }
      ];

      const result = parseLanguageData(mockData);

      expect(logInfo).toHaveBeenCalledWith('📦 Tìm thấy 2 ngôn ngữ: en, vi');
      expect(result).toEqual({
        en: {
          greeting: 'Hello',
          farewell: 'Goodbye'
        },
        vi: {
          greeting: 'Xin chào',
          farewell: 'Tạm biệt'
        }
      });
    });
  });
});