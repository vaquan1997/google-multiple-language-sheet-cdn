import { v2 as cloudinary } from 'cloudinary';
import config from '../config/index.js';
import { logError, logInfo } from '../utils/logger.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cdn.cloudName,
  api_key: config.cdn.apiKey,
  api_secret: config.cdn.apiSecret
});

export const uploadToCDN = async (languageData) => {
  try {
    logInfo('☁️  Đang upload lên Cloudinary...');
    
    const uploadedUrls = {};
    const languages = Object.keys(languageData);
    
    logInfo(`📦 Tìm thấy ${languages.length} ngôn ngữ: ${languages.join(', ')}`);

    // Upload each language file
    for (const [locale, data] of Object.entries(languageData)) {
      const jsonContent = JSON.stringify(data, null, 2);
      
      // Upload as raw file to Cloudinary with fixed version
      const result = await cloudinary.uploader.upload(
        `data:application/json;base64,${Buffer.from(jsonContent).toString('base64')}`,
        {
          public_id: `i18n/${locale}`,
          resource_type: 'raw',
          format: 'json',
          overwrite: true,
          invalidate: true,  // Thêm dòng này để invalidate cache
          version: false,     // Thêm dòng này để không tạo version number
          use_filename: false,
          unique_filename: false
        }
      );
      
      const fixedUrl = `https://res.cloudinary.com/${config.cdn.cloudName}/raw/upload/i18n/${locale}.json`;
      uploadedUrls[locale] = fixedUrl;
      logInfo(`✅ Đã upload ${locale}.json: ${fixedUrl}`);
    }

    logInfo('✨ Hoàn thành! Upload thành công tất cả ngôn ngữ');
    return { success: true, urls: uploadedUrls };
  } catch (error) {
    logError(`Failed to upload language data: ${error.message}`);
    throw error;
  }
};

export const uploadLanguageData = async (locale, data) => {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    
    const result = await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(jsonContent).toString('base64')}`,
      {
        public_id: `i18n/${locale}`,
        resource_type: 'raw',
        format: 'json',
        overwrite: true,
        invalidate: true,
        version: false,
        use_filename: false,
        unique_filename: false
      }
    );
    
    // Trả về URL cố định
    const fixedUrl = `https://res.cloudinary.com/${config.cdn.cloudName}/raw/upload/i18n/${locale}.json`;
    
    logInfo(`Successfully uploaded language data for locale: ${locale}`);
    return { url: fixedUrl, public_id: result.public_id };
  } catch (error) {
    logError(`Failed to upload language data for locale: ${locale}`, error);
    throw error;
  }
};

export const deleteLanguageData = async (locale) => {
  try {
    const result = await cloudinary.uploader.destroy(`i18n/${locale}`, {
      resource_type: 'raw'
    });
    
    logInfo(`Successfully deleted language data for locale: ${locale}`);
    return result;
  } catch (error) {
    logError(`Failed to delete language data for locale: ${locale}`, error);
    throw error;
  }
};