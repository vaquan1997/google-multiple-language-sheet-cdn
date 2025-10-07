// __tests__/services/spreadsheetService.test.js
import xlsx from 'xlsx';
import { parseLanguageData, readSpreadsheet } from '../../src/services/spreadsheetService.js';
import { logError, logInfo } from '../../src/utils/logger.js';

jest.mock('xlsx');
jest.mock('../../src/utils/logger.js');

describe('spreadsheetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readSpreadsheet', () => {
    it('should read spreadsheet data successfully', () => {
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {}
        }
      };

      const mockData = [
        { locale: 'en', key: 'greeting', value: 'Hello' },
        { locale: 'vi', key: 'greeting', value: 'Xin chào' }
      ];

      xlsx.readFile.mockReturnValue(mockWorkbook);
      xlsx.utils.sheet_to_json.mockReturnValue(mockData);

      const result = readSpreadsheet();

      expect(logInfo).toHaveBeenCalledWith('📥 Đang lấy dữ liệu từ Google Sheets...');
      expect(logInfo).toHaveBeenCalledWith('✅ Đã lấy 2 dòng dữ liệu');
      expect(result).toEqual(mockData);
    });

    it('should handle spreadsheet reading errors', () => {
      const error = new Error('File not found');
      xlsx.readFile.mockImplementation(() => {
        throw error;
      });

      expect(() => readSpreadsheet()).toThrow('File not found');
      expect(logError).toHaveBeenCalledWith('Error reading spreadsheet: File not found');
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

    it('should handle empty data', () => {
      const result = parseLanguageData([]);

      expect(logInfo).toHaveBeenCalledWith('📦 Tìm thấy 0 ngôn ngữ: ');
      expect(result).toEqual({});
    });
  });
});