// __tests__/config/index.test.js
import config from '../../src/config/index.js';

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    GOOGLE_SHEET_ID: 'test-sheet-id',
    GOOGLE_API_KEY: 'test-api-key',
    CDN_PROVIDER: 'cloudinary',
    CLOUDINARY_CLOUD_NAME: 'test-cloud',
    CLOUDINARY_API_KEY: 'test-cloudinary-key',
    CLOUDINARY_API_SECRET: 'test-cloudinary-secret',
    VERCEL_DEPLOY_HOOK_URL: 'https://api.vercel.com/deploy-hook',
    VERCEL_BASE_URL: 'https://myapp.vercel.app'
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('config', () => {
  it('should load configuration from environment variables', () => {
    expect(config.googleSheets.spreadsheetId).toBe('test-sheet-id');
    expect(config.googleSheets.apiKey).toBe('test-api-key');
    expect(config.cdn.cloudName).toBe('test-cloud');
    expect(config.cdn.uploadUrl).toBe('https://api.cloudinary.com/v1_1/test-cloud');
    expect(config.vercelDeployHookUrl).toBe('https://api.vercel.com/deploy-hook');
  });

  it('should use default values when environment variables are not set', () => {
    process.env.CDN_PROVIDER = undefined;
    
    // Re-import config to get updated values
    jest.resetModules();
    const freshConfig = require('../../src/config/index.js').default;
    
    expect(freshConfig.cdn.provider).toBe('cloudinary');
  });
});