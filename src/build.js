const googleSheets = require('./googleSheets');
const cdnUploader = require('./cdnUploader');

async function build() {
  console.log('🚀 Bắt đầu build...');
  
  try {
    // 1. Lấy dữ liệu từ Google Sheets
    console.log('📥 Đang lấy dữ liệu từ Google Sheets...');
    const languageData = await googleSheets.fetchData();
    console.log(`✅ Đã lấy dữ liệu cho ${Object.keys(languageData).length} ngôn ngữ`);

    // 2. Upload lên CDN
    console.log('☁️  Đang upload lên CDN...');
    const result = await cdnUploader.uploadLanguageFiles(languageData);

    console.log('\n✨ Build thành công!');
    console.log('\n📦 CDN URLs:');
    console.log('Index:', result.indexUrl);
    Object.entries(result.urls).forEach(([lang, url]) => {
      console.log(`${lang}:`, url);
    });

  } catch (error) {
    console.error('❌ Build thất bại:', error);
    process.exit(1);
  }
}

build();