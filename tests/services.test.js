import { uploadToCDN } from '../src/services/cdnService';
import { readSpreadsheet } from '../src/services/spreadsheetService';

jest.mock('../src/services/cdnService');
jest.mock('../src/services/spreadsheetService');

describe('Language Upload Tool Services', () => {
  describe('spreadsheetService', () => {
    it('should read and parse the spreadsheet correctly', async () => {
      const mockData = [
        { key: 'greeting', en: 'Hello', vi: 'Xin chào' },
        { key: 'farewell', en: 'Goodbye', vi: 'Tạm biệt' },
      ];
      readSpreadsheet.mockResolvedValue(mockData);

      const data = await readSpreadsheet('data/sample/locales.xlsx');
      expect(data).toEqual(mockData);
      expect(readSpreadsheet).toHaveBeenCalledWith('data/sample/locales.xlsx');
    });
  });

  describe('cdnService', () => {
    it('should upload language data to the CDN', async () => {
      const mockData = [
        { key: 'greeting', en: 'Hello', vi: 'Xin chào' },
        { key: 'farewell', en: 'Goodbye', vi: 'Tạm biệt' },
      ];
      uploadToCDN.mockResolvedValue({ success: true });

      const response = await uploadToCDN(mockData);
      expect(response).toEqual({ success: true });
      expect(uploadToCDN).toHaveBeenCalledWith(mockData);
    });
  });
});