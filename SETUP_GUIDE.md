# 🌍 Multi-Language Tool Setup Guide

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
From your sheet URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
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
```env
GOOGLE_SHEET_ID=1nvtHj_wVAySqAXPIXqeM8_jkYDyRlyj59Eh4yarw8lk
GOOGLE_API_KEY=AIzaSyAw8jC-cE-OBvBwWmyo0E4bn9Oxt1oR4Mk
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key  
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## 🧪 Step 3: Test Your Setup

```bash
# Test Google Sheets connection
lang-tool test-sheets

# Test Cloudinary connection
lang-tool test-cloudinary

# Run full process (build + upload)
lang-tool sync

# Check your CDN status
lang-tool status
```

## 🎯 Expected Output

When everything works correctly, you'll see:

### Google Sheets Test:
```
[INFO] 🧪 Testing Google Sheets connection...
[INFO] 📥 Đang lấy dữ liệu từ Google Sheets...
[SUCCESS] ✅ Connected! Found X translation entries
[INFO] 📊 Sample data:
[INFO]    vi: greeting = "Xin chào"
[INFO]    en: greeting = "Hello"
```

### Sync Process:
```
[INFO] 🔄 Starting sync process...
[INFO] 📥 Đang lấy dữ liệu từ Google Sheets...
[INFO] ✅ Đã lấy X dòng dữ liệu
[INFO] 📦 Tìm thấy Y ngôn ngữ: vi, en
[INFO] ☁️  Đang upload lên Cloudinary...
[INFO] ✅ Đã upload vi.json: https://res.cloudinary.com/your-cloud/...
[INFO] ✅ Đã upload en.json: https://res.cloudinary.com/your-cloud/...
[SUCCESS] ✨ Sync completed!
```

### Status Check:
```
[INFO] 📊 Current CDN Status:
[INFO] 🕐 Last Updated: 10/8/2025, 12:27:26 AM
[INFO] 🌐 Available Languages:
[INFO]    VI: https://res.cloudinary.com/your-cloud/raw/upload/i18n/vi.json
[SUCCESS]    ✅ Active (X translations)
```

## ❌ Common Error Messages

### Missing Configuration:
```
[ERROR] ❌ Missing Google Sheets configuration:
[ERROR]    - GOOGLE_SHEET_ID
[ERROR]    - GOOGLE_API_KEY
[ERROR] 💡 Run "lang-tool init" to create .env template, then add your credentials.
```
**Solution**: Update your .env file with actual credentials.

### Sheet Not Accessible:
```
[ERROR] ❌ Google Sheets test failed: The caller does not have permission
```
**Solution**: Make sure your Google Sheet is shared publicly.

### Invalid Cloudinary Credentials:
```
[ERROR] ❌ Cloudinary test failed: Invalid authentication credentials
```
**Solution**: Check your Cloudinary API keys in .env file.

Your translations are now live on CDN! 🚀

## 🔄 Daily Workflow

1. Edit translations in your Google Sheet
2. Run `lang-tool sync` 
3. Use new CDN URLs in your app
4. Check status with `lang-tool status`
