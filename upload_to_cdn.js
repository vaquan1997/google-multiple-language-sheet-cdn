import axios from 'axios';
import config from '../config';
import { logError, logInfo } from '../utils/logger';

export const uploadToCDN = async () => {
  try {
    if (!config.vercelDeployHookUrl) {
      throw new Error('Missing VERCEL_DEPLOY_HOOK_URL');
    }

    const response = await axios.post(config.vercelDeployHookUrl);
    logInfo('Vercel deploy hook triggered successfully.');
    return response.data;
  } catch (error) {
    logError('Failed to trigger Vercel deploy hook:', error);
    throw error;
  }
};

export const getLocaleUrl = (locale) => {
  if (!config.vercelBaseUrl) {
    throw new Error('Missing VERCEL_BASE_URL');
  }
  return `${config.vercelBaseUrl}/locales/${locale}.json`;
};