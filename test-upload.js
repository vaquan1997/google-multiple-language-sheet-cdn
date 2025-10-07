import { uploadLanguageData } from './src/services/cdnService.js';

console.log('Testing Cloudinary upload...');

const testData = {
  "greeting": "Hello World",
  "farewell": "Goodbye",
  "welcome": "Welcome to our app"
};

try {
  const result = await uploadLanguageData('en', testData);
  console.log('✅ Upload successful!');
  console.log('URL:', result.url);
  console.log('Public ID:', result.public_id);
  
  // Test accessing the uploaded file
  console.log('\n🔗 You can access your JSON file at:');
  console.log(result.url);
  
} catch (error) {
  console.error('❌ Upload failed:', error.message);
  console.error('Stack:', error.stack);
}