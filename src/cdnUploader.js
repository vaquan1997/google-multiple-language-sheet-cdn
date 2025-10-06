const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

class CDNUploader {
  constructor() {
    cloudinary.config({
      cloud_name: config.cdn.cloudName,
      api_key: config.cdn.apiKey,
      api_secret: config.cdn.apiSecret
    });
  }

  async uploadLanguageFiles(languageData) {
    const uploadedUrls = {};

    try {
      // Tạo file JSON cho mỗi ngôn ngữ
      for (const [lang, translations] of Object.entries(languageData)) {
        const fileName = `${lang}.json`;
        const filePath = path.join(config.output.folder, fileName);

        // Tạo thư mục nếu chưa có
        await fs.mkdir(config.output.folder, { recursive: true });

        // Ghi file JSON
        await fs.writeFile(filePath, JSON.stringify(translations, null, 2));

        // Upload lên CDN
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: 'raw',
          public_id: `languages/${lang}`,
          overwrite: true,
          type: 'upload'
        });

        uploadedUrls[lang] = result.secure_url;
        console.log(`✅ Đã upload ${lang}.json: ${result.secure_url}`);
      }

      // Tạo file index chứa tất cả URLs
      const indexPath = path.join(config.output.folder, 'index.json');
      await fs.writeFile(indexPath, JSON.stringify({
        languages: Object.keys(languageData),
        urls: uploadedUrls,
        lastUpdated: new Date().toISOString()
      }, null, 2));

      const indexResult = await cloudinary.uploader.upload(indexPath, {
        resource_type: 'raw',
        public_id: 'languages/index',
        overwrite: true,
        type: 'upload'
      });

      console.log(`✅ Đã upload index.json: ${indexResult.secure_url}`);

      return {
        urls: uploadedUrls,
        indexUrl: indexResult.secure_url
      };
    } catch (error) {
      console.error('❌ Lỗi khi upload lên CDN:', error);
      throw error;
    }
  }
}

module.exports = new CDNUploader();