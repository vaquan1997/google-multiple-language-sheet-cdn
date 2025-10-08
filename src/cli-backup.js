#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { uploadToCDN } from './services/cdnService.js';
import { parseLanguageData, readSpreadsheet } from './services/spreadsheetService.js';
import { buildLocales } from './tasks/buildLocales.js';
import { logError, logInfo, logSuccess } from './utils/logger.js';

program
  .version('1.0.0')
  .name('lang-tool')
  .description('🌍 Multi-Language Upload Tool - Build and upload translations to CDN');

program
  .command('build')
  .description('📦 Build language files from Google Sheets')
  .option('-o, --output <path>', 'Output directory', 'public/locales')
  .action(async (options) => {
    try {
      logInfo('🚀 Starting build process...');
      const locales = await buildLocales();
      logSuccess(`✅ Build completed! Generated files in ${options.output}`);
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
GOOGLE_SHEET_ID=1nvtHj_wVAySqAXPIXqeM8_jkYDyRlyj59Eh4yarw8lk
GOOGLE_API_KEY=AIzaSyAw8jC-cE-OBvBwWmyo0E4bn9Oxt1oR4Mk
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

## 📊 What You'll Get

After successful sync:
\`\`\`
your-project/
├── .env                    # Your credentials (keep private!)
├── cdn-urls.json          # CDN URLs for your app
├── public/locales/        # Local backup files
│   ├── en.json            # {"greeting": "Hello", "welcome": "Welcome"}
│   └── vi.json            # {"greeting": "Xin chào", "welcome": "Chào mừng"}
└── SETUP_GUIDE.md         # This guide
\`\`\`

## 🌐 Use in Your Application

### React.js + i18next
\`\`\`javascript
import i18next from 'i18next';
import cdnUrls from './cdn-urls.json';

// Load translations from CDN
const loadTranslations = async () => {
  const resources = {};
  
  for (const [locale, url] of Object.entries(cdnUrls.urls)) {
    const response = await fetch(url);
    const translations = await response.json();
    resources[locale] = { translation: translations };
  }
  
  await i18next.init({
    lng: 'vi',
    resources,
    interpolation: { escapeValue: false }
  });
};

// Usage
await loadTranslations();
console.log(i18next.t('greeting')); // "Xin chào"
\`\`\`

### Vue.js + vue-i18n
\`\`\`javascript
import { createI18n } from 'vue-i18n';
import cdnUrls from './cdn-urls.json';

const messages = {};
for (const [locale, url] of Object.entries(cdnUrls.urls)) {
  const response = await fetch(url);
  messages[locale] = await response.json();
}

const i18n = createI18n({
  locale: 'vi',
  fallbackLocale: 'en',
  messages
});

export default i18n;
\`\`\`

### Vanilla JavaScript
\`\`\`javascript
import cdnUrls from './cdn-urls.json';

class TranslationManager {
  constructor() {
    this.translations = {};
    this.currentLocale = 'vi';
  }
  
  async loadTranslations() {
    for (const [locale, url] of Object.entries(cdnUrls.urls)) {
      const response = await fetch(url);
      this.translations[locale] = await response.json();
    }
  }
  
  t(key, locale = this.currentLocale) {
    return this.translations[locale]?.[key] || key;
  }
  
  setLocale(locale) {
    this.currentLocale = locale;
  }
}

// Usage
const tm = new TranslationManager();
await tm.loadTranslations();
console.log(tm.t('greeting')); // "Xin chào"
\`\`\`

## 🎯 Available Commands

\`\`\`bash
lang-tool init              # Initialize project setup
lang-tool sync              # Build + Upload (recommended)
lang-tool build             # Build local files only
lang-tool upload            # Upload to CDN only  
lang-tool status            # Show current CDN URLs
lang-tool test-sheets       # Test Google Sheets connection
lang-tool test-cloudinary   # Test Cloudinary connection
lang-tool --help            # Show all commands
\`\`\`

## 🔄 Workflow

1. **Setup once**: \`lang-tool init\` + edit .env
2. **Daily workflow**: 
   - Edit translations in Google Sheets
   - Run \`lang-tool sync\` 
   - Use new CDN URLs in your app

## 🐛 Common Issues & Solutions

### "The caller does not have permission"
- Make sure Google Sheet is shared publicly
- Check GOOGLE_SHEET_ID is correct
- Verify API key has Google Sheets API enabled

### "Invalid authentication credentials"  
- Check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET
- Make sure there are no extra spaces in .env file
- Try regenerating Cloudinary API credentials

### "Cannot find module" 
- Run \`npm install\` in your project directory
- Make sure you're in the right directory

### "Network request failed"
- Check internet connection
- Verify Google Sheets URL is accessible
- Check Cloudinary service status

## 📞 Support

Need help? 
- 📖 Read this guide carefully
- 🐛 [Create an issue](https://github.com/vaquan1997/muti-language-tool-upload-to-cdn/issues)
- 💬 Check existing issues for solutions
- 📧 Contact: your-email@example.com

## 🎉 Success!

If you see this output, everything is working:
\`\`\`
📥 Đang lấy dữ liệu từ Google Sheets...
✅ Đã lấy X dòng dữ liệu  
📦 Tìm thấy Y ngôn ngữ: vi, en
☁️  Đang upload lên Cloudinary...
✅ Đã upload vi.json: https://res.cloudinary.com/your-cloud/raw/upload/i18n/vi.json
✅ Đã upload en.json: https://res.cloudinary.com/your-cloud/raw/upload/i18n/en.json
✨ Hoàn thành! Các URLs đã được lưu vào cdn-urls.json
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
  .command('test-sheets')
  .description('🧪 Test Google Sheets connection')
  .action(async () => {
    try {
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

program
  .command('sync')
  .description('🔄 Build and upload in one command')
  .option('-o, --output <path>', 'Output directory', 'public/locales')
  .action(async (options) => {
    try {
      logInfo('🚀 Starting sync process...');
      
      // Build
      const locales = await buildLocales();
      logInfo('📦 Build completed, starting upload...');
      
      // Upload
      const result = await uploadToCDN(locales);
      
      // Save URLs
      const urlsFile = path.join(process.cwd(), 'cdn-urls.json');
      await fs.writeFile(urlsFile, JSON.stringify({
        urls: result.urls,
        lastUpdated: new Date().toISOString()
      }, null, 2));
      
      logSuccess('✨ Sync completed! Files built and uploaded to CDN');
    } catch (error) {
      logError('❌ Sync failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('🛠️  Initialize configuration file')
  .action(async () => {
    try {
      const envContent = `# Google Sheets
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_API_KEY=your_google_api_key_here

# Cloudinary CDN
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
`;
      
      const envPath = path.join(process.cwd(), '.env');
      const exists = await fs.access(envPath).then(() => true).catch(() => false);
      
      if (exists) {
        logInfo('⚠️  .env file already exists, skipping...');
        return;
      }
      
      await fs.writeFile(envPath, envContent);
      logSuccess('✅ .env file created! Please fill in your credentials.');
      
      logInfo('📝 Next steps:');
      logInfo('1. Edit .env file with your Google Sheets and Cloudinary credentials');
      logInfo('2. Run "lang-tool sync" to build and upload translations');
    } catch (error) {
      logError('❌ Init failed:', error.message);
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