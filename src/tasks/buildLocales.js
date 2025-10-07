import fs from 'fs/promises';
import path from 'path';
import { uploadToCDN } from '../services/cdnService.js';
import { parseLanguageData, readSpreadsheet } from '../services/spreadsheetService.js';
import { logError, logInfo, logSuccess } from '../utils/logger.js';

const OUTPUT_DIR = path.join(process.cwd(), 'public/locales');
const CDN_URLS_FILE = path.join(process.cwd(), 'cdn-urls.json');

export async function buildLocales() {
  try {
    // 1. Read spreadsheet data
    const rows = await readSpreadsheet();
    const locales = parseLanguageData(rows);

    // 2. Create local files
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    await Promise.all(
      Object.entries(locales).map(([locale, messages]) =>
        fs.writeFile(
          path.join(OUTPUT_DIR, `${locale}.json`),
          JSON.stringify(messages, null, 2),
          'utf8',
        ),
      ),
    );

    logInfo(`Generated ${Object.keys(locales).length} locale files under ${OUTPUT_DIR}`);

    // 3. Upload to CDN
    const uploadResult = await uploadToCDN(locales);

    // 4. Save CDN URLs to file
    await fs.writeFile(CDN_URLS_FILE, JSON.stringify({
      urls: uploadResult.urls,
      lastUpdated: new Date().toISOString()
    }, null, 2));

    logSuccess('✨ Hoàn thành! Các URLs đã được lưu vào cdn-urls.json');
    
    return locales;
  } catch (error) {
    logError('Error generating locale files:', error);
    throw error;
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildLocales().catch(console.error);
}