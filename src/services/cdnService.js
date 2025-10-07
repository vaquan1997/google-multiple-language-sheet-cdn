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
      
      // Upload as raw file to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:application/json;base64,${Buffer.from(jsonContent).toString('base64')}`,
        {
          public_id: `i18n/${locale}`,
          resource_type: 'raw',
          format: 'json',
          overwrite: true
        }
      );
      
      uploadedUrls[locale] = result.secure_url;
      logInfo(`✅ Đã upload ${locale}.json: ${result.secure_url}`);
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
        overwrite: true
      }
    );
    
    logInfo(`Successfully uploaded language data for locale: ${locale}`);
    return { url: result.secure_url, public_id: result.public_id };
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