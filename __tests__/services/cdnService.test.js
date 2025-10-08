import { v2 as cloudinary } from 'cloudinary';
import { uploadToCDN } from '../../src/services/cdnService.js';
import { logError, logInfo } from '../../src/utils/logger.js';

jest.mock('cloudinary');
jest.mock('../../src/utils/logger.js');
jest.mock('../../src/config/index.js', () => ({
  default: {
    cdn: {
      cloudName: 'test-cloud',
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret'
    }
  }
}));

describe('cdnService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cloudinary.config = jest.fn();
    cloudinary.uploader = {
      upload: jest.fn(),
      destroy: jest.fn()
    };
  });

  describe('uploadToCDN', () => {
    it('should upload multiple language files successfully', async () => {
      const mockLanguageData = {
        en: { greeting: 'Hello', farewell: 'Goodbye' },
        vi: { greeting: 'Xin chào', farewell: 'Tạm biệt' }
      };

      const mockUploadResult = {
        secure_url: 'https://res.cloudinary.com/test-cloud/raw/upload/i18n/en.json',
        public_id: 'i18n/en'
      };

      cloudinary.uploader.upload.mockResolvedValue(mockUploadResult);

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

      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(2);
    });

    it('should handle upload errors', async () => {
      const mockLanguageData = {
        en: { greeting: 'Hello' }
      };

      const error = new Error('Upload failed');
      cloudinary.uploader.upload.mockRejectedValue(error);

      await expect(uploadToCDN(mockLanguageData)).rejects.toThrow('Upload failed');
      expect(logError).toHaveBeenCalledWith('Failed to upload language data: Upload failed');
    });
  });
});