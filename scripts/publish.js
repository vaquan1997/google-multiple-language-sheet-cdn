const { buildLocales } = require('../src/tasks/buildLocales');
const { uploadLocales } = require('../src/tasks/uploadLocales');
const logger = require('../src/utils/logger');

async function publish() {
  try {
    logger.info('Starting the build process for language data...');
    await buildLocales();
    logger.info('Build process completed successfully.');

    logger.info('Starting the upload process to the CDN...');
    await uploadLocales();
    logger.info('Upload process completed successfully.');
  } catch (error) {
    logger.error('An error occurred during the publish process:', error);
  }
}

publish();