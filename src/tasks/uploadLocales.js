import { uploadToCDN } from '../services/cdnService';
import { logError, logInfo } from '../utils/logger';

export async function uploadLocales() {
  try {
    const response = await uploadToCDN();
    logInfo('Triggered Vercel deploy hook to publish locale files.');
    return response;
  } catch (error) {
    logError('Failed to trigger Vercel deploy hook:', error);
    throw error;
  }
}