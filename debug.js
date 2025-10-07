import { buildLocales } from './src/tasks/buildLocales.js';

console.log('Testing full build process...');

try {
  const locales = await buildLocales();
  console.log('\n=== Build completed successfully! ===');
  console.log('Locales generated:', Object.keys(locales));
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}