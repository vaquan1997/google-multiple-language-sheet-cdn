// __tests__/services/cdnService.test.js
import axios from 'axios';
import { deleteLanguageData, uploadLanguageData, uploadToCDN } from '../../src/services/cdnService.js';
import { logError, logInfo } from '../../src/utils/logger.js';

jest.mock('axios');
jest.mock('../../src/utils/logger.js');
jest.mock('../../src/config/index.js', () => ({
  cdn: {
    uploadUrl: 'https://api.cloudinary.com/v1_1/test-cloud',
    apiKey: 'test-api-key'
  }
}));

describe('cdnService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadToCDN', () => {
    it('should upload multiple language files successfully', async () => {
      const mockLanguageData = {
        en: { greeting: 'Hello', farewell: 'Goodbye' },
        vi: { greeting: 'Xin chào', farewell: 'Tạm biệt' }
      };

      const mockResponse = {
        data: { url: 'https://res.cloudinary.com/test-cloud/raw/upload/i18n/en.json' }
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await uploadToCDN(mockLanguageData);

      expect(logInfo).toHaveBeenCalledWith('☁️  Đang upload lên Cloudinary...');
      expect(logInfo).toHaveBeenCalledWith('📦 Tìm thấy 2 ngôn ngữ: en, vi');
      expect(logInfo).toHaveBeenCalledWith('✅ Đã upload en.json: https://res.cloudinary.com/test-cloud/raw/upload/i18n/en.json');
      expect(logInfo).toHaveBeenCalledWith('✨ Hoàn thành! Upload thành công tất cả ngôn ngữ');
      
      expect(result).toEqual({
        success: true,
        urls: {
          en: 'https://res.cloudinary.com/test-cloud/raw/upload/i18n/en.json',
          vi: 'https://res.cloudinary.com/test-cloud/raw/upload/i18n/en.json'
        }
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    it('should handle upload errors', async () => {
      const mockLanguageData = {
        en: { greeting: 'Hello' }
      };

      const error = new Error('Upload failed');
      axios.post.mockRejectedValue(error);

      await expect(uploadToCDN(mockLanguageData)).rejects.toThrow('Upload failed');
      expect(logError).toHaveBeenCalledWith('Failed to upload language data: Upload failed');
    });
  });

  describe('uploadLanguageData', () => {
    it('should upload single language data successfully', async () => {
      const mockResponse = {
        data: { url: 'https://res.cloudinary.com/test-cloud/raw/upload/i18n/en.json' }
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await uploadLanguageData('en', { greeting: 'Hello' });

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.cloudinary.com/v1_1/test-cloud/upload',
        {
          locale: 'en',
          data: { greeting: 'Hello' },
          apiKey: 'test-api-key'
        }
      );

      expect(logInfo).toHaveBeenCalledWith('Successfully uploaded language data for locale: en');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteLanguageData', () => {
    it('should delete language data successfully', async () => {
      const mockResponse = { data: { success: true } };
      axios.delete.mockResolvedValue(mockResponse);

      const result = await deleteLanguageData('en');

      expect(axios.delete).toHaveBeenCalledWith(
        'https://api.cloudinary.com/v1_1/test-cloud/delete/en',
        {
          headers: {
            'Authorization': 'Bearer test-api-key'
          }
        }
      );

      expect(logInfo).toHaveBeenCalledWith('Successfully deleted language data for locale: en');
      expect(result).toEqual(mockResponse.data);
    });
  });
});