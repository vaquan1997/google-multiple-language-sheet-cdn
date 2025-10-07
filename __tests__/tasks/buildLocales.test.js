// __tests__/tasks/buildLocales.test.js
import fs from 'fs/promises';
import { uploadToCDN } from '../../src/services/cdnService.js';
import { parseLanguageData, readSpreadsheet } from '../../src/services/spreadsheetService.js';
import { buildLocales } from '../../src/tasks/buildLocales.js';
import { logError, logSuccess } from '../../src/utils/logger.js';

jest.mock('../../src/services/spreadsheetService.js');
jest.mock('../../src/services/cdnService.js');
jest.mock('fs/promises');
jest.mock('../../src/utils/logger.js');

describe('buildLocales', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build locales successfully', async () => {
    const mockRows = [
      { locale: 'en', key: 'greeting', value: 'Hello' },
      { locale: 'vi', key: 'greeting', value: 'Xin chào' }
    ];

    const mockLocales = {
      en: { greeting: 'Hello' },
      vi: { greeting: 'Xin chào' }
    };

    const mockUploadResult = {
      urls: {
        en: 'https://res.cloudinary.com/test-cloud/raw/upload/i18n/en.json',
        vi: 'https://res.cloudinary.com/test-cloud/raw/upload/i18n/vi.json'
      }
    };

    readSpreadsheet.mockResolvedValue(mockRows);
    parseLanguageData.mockReturnValue(mockLocales);
    uploadToCDN.mockResolvedValue(mockUploadResult);
    fs.mkdir.mockResolvedValue();
    fs.writeFile.mockResolvedValue();

    const result = await buildLocales();

    expect(readSpreadsheet).toHaveBeenCalled();
    expect(parseLanguageData).toHaveBeenCalledWith(mockRows);
    expect(fs.mkdir).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalledTimes(3); // 2 locale files + 1 cdn-urls.json
    expect(uploadToCDN).toHaveBeenCalledWith(mockLocales);
    expect(logSuccess).toHaveBeenCalledWith('✨ Hoàn thành! Các URLs đã được lưu vào cdn-urls.json');
    expect(result).toEqual(mockLocales);
  });

  it('should handle build errors', async () => {
    const error = new Error('Build failed');
    readSpreadsheet.mockRejectedValue(error);

    await expect(buildLocales()).rejects.toThrow('Build failed');
    expect(logError).toHaveBeenCalledWith('Error generating locale files:', error);
  });
});