#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { uploadToCDN } from './services/cdnService.js';
import { parseLanguageData, readSpreadsheet } from './services/spreadsheetService.js';
import { buildLocales } from './tasks/buildLocales.js';
import { logError, logInfo, logSuccess } from './utils/logger.js';

// Load environment variables from .env file
dotenv.config();

const program = new Command();

// Helper function to validate environment variables
function validateEnvForGoogleSheets() {
  const required = ['GOOGLE_SHEET_ID', 'GOOGLE_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    logError('❌ Missing Google Sheets configuration:');
    missing.forEach(key => logError(`   - ${key}`));
    logError('💡 Run "lang-tool init" to create .env template, then add your credentials.');
    logError('📖 See SETUP_GUIDE.md for detailed instructions.');
    process.exit(1);
  }
}

function validateEnvForCloudinary() {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    logError('❌ Missing Cloudinary configuration:');
    missing.forEach(key => logError(`   - ${key}`));
    logError('💡 Run "lang-tool init" to create .env template, then add your credentials.');
    logError('📖 See SETUP_GUIDE.md for detailed instructions.');
    process.exit(1);
  }
}

program
  .name('lang-tool')
  .description('🌍 Multi-Language Upload Tool - Build and upload translations to CDN');

program
  .command('init')
  .description('🛠️  Initialize project with setup guide and templates')
  .action(async () => {
    try {
      logInfo('🚀 Initializing project...');

      // Create .env template
      const envPath = path.join(process.cwd(), '.env');
      const exists = await fs.access(envPath).then(() => true).catch(() => false);
      
      if (!exists) {
        const envContent = `# Google Sheets Configuration
# Get these from: https://console.cloud.google.com/
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_API_KEY=your_google_api_key_here

# Cloudinary CDN Configuration  
# Get these from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Vercel Integration
VERCEL_DEPLOY_HOOK_URL=your_vercel_deploy_hook
VERCEL_BASE_URL=your_vercel_app_url
`;
        await fs.writeFile(envPath, envContent);
        logSuccess('✅ .env template created!');
      } else {
        logInfo('⚠️  .env file already exists, skipping...');
      }

      // Create comprehensive setup guide
      const setupGuide = `# 🌍 Multi-Language Tool Setup Guide

## 📋 Prerequisites
- Node.js 14+ installed
- Google account with Google Sheets access
- Cloudinary account (free tier available)

## 🔧 Step 1: Google Sheets Setup

### 1.1 Create Google Sheets API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable "Google Sheets API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API Key and update your .env file

### 1.2 Prepare Your Google Sheet
Create a Google Sheet with this exact structure:

| (empty) | key          | English     | TV          |
|---------|--------------|-------------|-------------|
| 1       | greeting     | Hello       | Xin chào    |
| 2       | welcome      | Welcome     | Chào mừng   |
| 3       | goodbye      | Goodbye     | Tạm biệt    |
| 4       | thank_you    | Thank you   | Cảm ơn      |

**Important Notes:**
- Column A: Leave empty or use for numbering  
- Column B: Translation keys (use underscore, no spaces)
- Column C: English translations
- Column D: Vietnamese translations (labeled "TV")
- Make your sheet PUBLIC: Share → "Anyone with the link can view"

### 1.3 Get Google Sheet ID
From your sheet URL: \`https://docs.google.com/spreadsheets/d/SHEET_ID/edit\`
Copy the SHEET_ID part to your .env file.

## ☁️ Step 2: Cloudinary Setup

### 2.1 Create Cloudinary Account
1. Sign up at [Cloudinary.com](https://cloudinary.com/) (free tier: 25GB storage)
2. Verify your email and log in
3. Go to your Dashboard
4. Copy these credentials:
   - **Cloud Name** (shown at the top)
   - **API Key** 
   - **API Secret** (click "Reveal" to see it)

### 2.2 Update .env File
Replace the placeholder values in your .env file:
\`\`\`env
GOOGLE_SHEET_ID=your_actual_sheet_id
GOOGLE_API_KEY=your_actual_api_key
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key  
CLOUDINARY_API_SECRET=your_actual_api_secret
\`\`\`

## 🧪 Step 3: Test Your Setup

\`\`\`bash
# Test Google Sheets connection
lang-tool test-sheets

# Test Cloudinary connection
lang-tool test-cloudinary

# Run full process
lang-tool sync
\`\`\`

Your translations are now live on CDN! 🚀
`;

      await fs.writeFile(path.join(process.cwd(), 'SETUP_GUIDE.md'), setupGuide);
      logSuccess('✅ Setup guide created: SETUP_GUIDE.md');

      logInfo('');
      logInfo('🎯 Next Steps:');
      logInfo('1. 📖 Read SETUP_GUIDE.md for detailed instructions');
      logInfo('2. 🔑 Get Google Sheets API key: https://console.cloud.google.com/');
      logInfo('3. ☁️  Get Cloudinary credentials: https://cloudinary.com/console');
      logInfo('4. ✏️  Update .env file with your actual credentials');
      logInfo('5. 🧪 Test connections: "lang-tool test-sheets" & "lang-tool test-cloudinary"');
      logInfo('6. 🚀 Run: "lang-tool sync" to build and upload');
      logInfo('');
      logInfo('💡 Tip: Keep your .env file private and never commit it to git!');

    } catch (error) {
      logError('❌ Init failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('📦 Build language files from Google Sheets')
  .option('-o, --output <path>', 'Output directory', 'public/locales')
  .action(async (options) => {
    try {
      validateEnvForGoogleSheets();
      logInfo('📦 Building language files...');
      await buildLocales(options.output);
      logSuccess('✅ Build completed!');
    } catch (error) {
      logError('❌ Build failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('upload')
  .description('☁️  Upload language files to Cloudinary CDN')
  .action(async () => {
    try {
      validateEnvForGoogleSheets();
      validateEnvForCloudinary();
      logInfo('🚀 Starting upload process...');
      
      // Read and parse data
      const rows = await readSpreadsheet();
      const locales = parseLanguageData(rows);
      
      // Upload to CDN
      const result = await uploadToCDN(locales);
      
      // Save URLs
      const urlsFile = path.join(process.cwd(), 'cdn-urls.json');
      await fs.writeFile(urlsFile, JSON.stringify({
        urls: result.urls,
        lastUpdated: new Date().toISOString()
      }, null, 2));
      
      logSuccess('✅ Upload completed! CDN URLs saved to cdn-urls.json');
    } catch (error) {
      logError('❌ Upload failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('sync')
  .description('🔄 Build and upload in one command')
  .option('-o, --output <path>', 'Output directory', 'public/locales')
  .action(async (options) => {
    try {
      validateEnvForGoogleSheets();
      validateEnvForCloudinary();
      logInfo('🔄 Starting sync process...');
      await buildLocales(options.output);
      logSuccess('✨ Sync completed!');
    } catch (error) {
      logError('❌ Sync failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('📊 Show current CDN URLs and status')
  .action(async () => {
    try {
      const urlsFile = path.join(process.cwd(), 'cdn-urls.json');
      const exists = await fs.access(urlsFile).then(() => true).catch(() => false);
      
      if (!exists) {
        logError('❌ No CDN URLs found. Run "lang-tool sync" first.');
        return;
      }

      const content = await fs.readFile(urlsFile, 'utf-8');
      const data = JSON.parse(content);
      
      logInfo('📊 Current CDN Status:');
      logInfo(`🕐 Last Updated: ${new Date(data.lastUpdated).toLocaleString()}`);
      logInfo('');
      logInfo('🌐 Available Languages:');
      
      for (const [locale, url] of Object.entries(data.urls)) {
        logInfo(`   ${locale.toUpperCase()}: ${url}`);
        
        // Test if URL is accessible
        try {
          const response = await fetch(url);
          if (response.ok) {
            const content = await response.json();
            const keyCount = Object.keys(content).length;
            logSuccess(`   ✅ Active (${keyCount} translations)`);
          } else {
            logError(`   ❌ Not accessible (${response.status})`);
          }
        } catch (error) {
          logError(`   ❌ Connection failed`);
        }
      }
      
      logInfo('');
      logInfo('💡 Use these URLs in your application to load translations from CDN');
      
    } catch (error) {
      logError('❌ Status check failed:', error.message);
    }
  });

program
  .command('test-sheets')
  .description('🧪 Test Google Sheets connection')
  .action(async () => {
    try {
      validateEnvForGoogleSheets();
      logInfo('🧪 Testing Google Sheets connection...');
      const rows = await readSpreadsheet();
      if (rows && rows.length > 0) {
        logSuccess(`✅ Connected! Found ${rows.length} translation entries`);
        logInfo('📊 Sample data:');
        rows.slice(0, 3).forEach(row => {
          logInfo(`   ${row.locale}: ${row.key} = "${row.value}"`);
        });
      } else {
        logError('❌ No data found. Check your sheet structure and permissions.');
      }
    } catch (error) {
      logError('❌ Google Sheets test failed:', error.message);
      logError('💡 Check your GOOGLE_SHEET_ID and GOOGLE_API_KEY in .env file');
    }
  });

program
  .command('test-cloudinary')
  .description('🧪 Test Cloudinary connection')  
  .action(async () => {
    try {
      validateEnvForCloudinary();
      logInfo('🧪 Testing Cloudinary connection...');
      
      // Test upload with a small JSON
      const testData = { test: 'Hello from Multi-Language Tool' };
      const { uploadLanguageData } = await import('./services/cdnService.js');
      
      const result = await uploadLanguageData('test', testData);
      
      if (result && result.url) {
        logSuccess('✅ Cloudinary connection successful!');
        logInfo(`🔗 Test file uploaded: ${result.url}`);
        
        // Test if file is accessible
        const response = await fetch(result.url);
        if (response.ok) {
          logSuccess('✅ CDN file is publicly accessible');
        } else {
          logError('❌ CDN file upload succeeded but not accessible');
        }
      }
    } catch (error) {
      logError('❌ Cloudinary test failed:', error.message);
      logError('💡 Check your Cloudinary credentials in .env file');
    }
  });

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);