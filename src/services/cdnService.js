import axios from 'axios';
import { logger } from '../utils/logger';
import { CDN_URL, API_KEY } from '../config';

export const uploadLanguageData = async (locale, data) => {
  try {
    const response = await axios.post(`${CDN_URL}/upload`, {
      locale,
      data,
      apiKey: API_KEY,
    });
    logger.info(`Successfully uploaded language data for locale: ${locale}`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to upload language data for locale: ${locale}`, error);
    throw error;
  }
};

export const deleteLanguageData = async (locale) => {
  try {
    const response = await axios.delete(`${CDN_URL}/delete/${locale}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
    logger.info(`Successfully deleted language data for locale: ${locale}`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to delete language data for locale: ${locale}`, error);
    throw error;
  }
};