import { program } from 'commander';
import { buildLocales } from './tasks/buildLocales';
import { uploadLocales } from './tasks/uploadLocales';
import { logger } from './utils/logger';

program
  .version('1.0.0')
  .description('Language Upload Tool CLI');

program
  .command('build')
  .description('Build language data from the spreadsheet')
  .action(async () => {
    try {
      await buildLocales();
      logger.info('Language data built successfully.');
    } catch (error) {
      logger.error('Error building language data:', error);
    }
  });

program
  .command('upload')
  .description('Upload language data to the CDN')
  .action(async () => {
    try {
      await uploadLocales();
      logger.info('Language data uploaded successfully.');
    } catch (error) {
      logger.error('Error uploading language data:', error);
    }
  });

program.parse(process.argv);