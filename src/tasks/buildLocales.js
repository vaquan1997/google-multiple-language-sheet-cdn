import fs from 'fs/promises';
import path from 'path';
import { parseLanguageData, readSpreadsheet } from '../services/spreadsheetService.js';
import { logError, logInfo } from '../utils/logger.js';

const OUTPUT_DIR = path.join(process.cwd(), 'public/locales');

export async function buildLocales() {
  try {
    const rows = await readSpreadsheet();
    const locales = parseLanguageData(rows);

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
    return locales;
  } catch (error) {
    logError('Error generating locale files:', error);
    throw error;
  }
}