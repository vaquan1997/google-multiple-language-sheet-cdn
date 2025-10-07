# Multi-Language Tool - Upload to CDN

🌍 Công cụ tự động hóa việc quản lý và phân phối file ngôn ngữ (i18n) từ Google Sheets lên Cloudinary CDN.

## 📋 Tính năng

- ✅ **Đọc dữ liệu từ Google Sheets** - Tự động sync dữ liệu translation từ Google Sheets
- ✅ **Tạo file JSON chuẩn i18n** - Format `{ "key": "value" }` cho các framework như React, Vue, Angular
- ✅ **Upload lên Cloudinary CDN** - Tự động upload và tạo public URLs
- ✅ **Hiển thị trạng thái real-time** - Theo dõi quá trình upload với emoji và màu sắc
- ✅ **Lưu trữ URLs** - Tự động lưu CDN URLs vào file JSON để sử dụng

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/vaquan1997/muti-language-tool-upload-to-cdn.git
cd muti-language-tool-upload-to-cdn
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường

Tạo file `.env` trong thư mục gốc:

```env
# Google Sheets API
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_API_KEY=your_google_api_key_here

# Cloudinary CDN
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Vercel Integration
VERCEL_DEPLOY_HOOK_URL=your_vercel_deploy_hook
VERCEL_BASE_URL=your_vercel_app_url
```

## ⚙️ Cấu hình Google Sheets

### 1. Chuẩn bị Google Sheet

Tạo Google Sheet với cấu trúc như sau:

| (empty) | key | English | TV |
|---------|-----|---------|-----|
| 1 | greeting | Hello | Xin chào |
| 2 | farewell | Goodbye | Tạm biệt |
| 3 | welcome | Welcome | Chào mừng |

**Lưu ý:**
- Cột 1: Để trống hoặc đánh số thứ tự
- Cột 2: `key` - Chứa các translation keys
- Cột 3+: Tên ngôn ngữ (English, TV, JP, etc.)

### 2. Lấy Google Sheets API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable Google Sheets API
4. Tạo API Key trong phần Credentials
5. Sao chép API Key vào file `.env`

### 3. Lấy Google Sheet ID

Từ URL Google Sheet: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

Sao chép `{SHEET_ID}` vào file `.env`

## ☁️ Cấu hình Cloudinary

### 1. Tạo tài khoản Cloudinary

1. Đăng ký tại [Cloudinary.com](https://cloudinary.com/)
2. Vào Dashboard để lấy thông tin:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

### 2. Cấu hình trong .env

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📖 Cách sử dụng

### 1. Build và Upload

```bash
npm run build
```

Lệnh này sẽ:
- 📥 Đọc dữ liệu từ Google Sheets
- 📦 Parse thành format JSON chuẩn i18n
- 💾 Tạo file local trong `public/locales/`
- ☁️ Upload lên Cloudinary CDN
- 💾 Lưu URLs vào `cdn-urls.json`

### 2. Chỉ Upload (không tạo file local)

```bash
npm run upload
```

### 3. Test Upload

```bash
node test-upload.js
```

## 📂 Cấu trúc thư mục

```
muti-language-tool-upload-to-cdn/
├── src/
│   ├── config/
│   │   └── index.js           # Cấu hình ứng dụng
│   ├── services/
│   │   ├── cdnService.js      # Cloudinary upload service
│   │   └── spreadsheetService.js # Google Sheets service
│   ├── tasks/
│   │   ├── buildLocales.js    # Task build và upload
│   │   └── uploadLocales.js   # Task chỉ upload
│   └── utils/
│       └── logger.js          # Logging với màu sắc
├── public/locales/            # File JSON được tạo
├── data/sample/               # File mẫu
├── cdn-urls.json             # URLs từ CDN
├── .env                      # Biến môi trường
└── package.json
```

## 📊 Output Example

Khi chạy `npm run build`, bạn sẽ thấy:

```
📥 Đang lấy dữ liệu từ Google Sheets...
✅ Đã lấy 15 dòng dữ liệu
📦 Tìm thấy 3 ngôn ngữ: vi, en, ja
☁️  Đang upload lên Cloudinary...
✅ Đã upload vi.json: https://res.cloudinary.com/your-cloud/raw/upload/v123/i18n/vi.json
✅ Đã upload en.json: https://res.cloudinary.com/your-cloud/raw/upload/v123/i18n/en.json
✅ Đã upload ja.json: https://res.cloudinary.com/your-cloud/raw/upload/v123/i18n/ja.json
✨ Hoàn thành! Các URLs đã được lưu vào cdn-urls.json
```

## 📄 File JSON được tạo

**vi.json:**
```json
{
  "greeting": "Xin chào",
  "farewell": "Tạm biệt",
  "welcome": "Chào mừng"
}
```

**en.json:**
```json
{
  "greeting": "Hello",
  "farewell": "Goodbye", 
  "welcome": "Welcome"
}
```

**cdn-urls.json:**
```json
{
  "urls": {
    "vi": "https://res.cloudinary.com/your-cloud/raw/upload/v123/i18n/vi.json",
    "en": "https://res.cloudinary.com/your-cloud/raw/upload/v123/i18n/en.json"
  },
  "lastUpdated": "2025-10-07T11:34:10.199Z"
}
```

## 🔧 Scripts có sẵn

```bash
# Build locale files và upload lên CDN
npm run build

# Chỉ upload lên CDN (cần có file local)
npm run upload

# Chạy tests
npm test

# Tạo file Excel mẫu
node scripts/createSampleExcel.js

# Test debug
node debug.js
```

## 🌐 Sử dụng trong ứng dụng

### React.js với react-i18next

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import URLs từ cdn-urls.json
import cdnUrls from './cdn-urls.json';

const resources = {};

// Load translations từ CDN
Object.entries(cdnUrls.urls).forEach(async ([locale, url]) => {
  const response = await fetch(url);
  const translations = await response.json();
  resources[locale] = { translation: translations };
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
```

### Vue.js với vue-i18n

```javascript
import { createI18n } from 'vue-i18n';
import cdnUrls from './cdn-urls.json';

const messages = {};

// Load từ CDN
Object.entries(cdnUrls.urls).forEach(async ([locale, url]) => {
  const response = await fetch(url);
  messages[locale] = await response.json();
});

const i18n = createI18n({
  locale: 'vi',
  fallbackLocale: 'en',
  messages
});
```

## 🐛 Troubleshooting

### Lỗi Google Sheets API

```
Error: The caller does not have permission
```

**Giải pháp:** Đảm bảo Google Sheet được set public hoặc share với API key

### Lỗi Cloudinary Upload

```
Error: Invalid API key
```

**Giải pháp:** Kiểm tra lại CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET

### File không được tạo

```
Error: Cannot find path 'public/locales'
```

**Giải pháp:** Chạy `npm run build` thay vì `npm run upload`

## 📝 Customization

### Thay đổi mapping ngôn ngữ

Sửa file `src/services/spreadsheetService.js`:

```javascript
const localeMapping = {
  'English': 'en',
  'TV': 'vi',        // Tiếng Việt
  'Japanese': 'ja',  // Thêm ngôn ngữ mới
  'Korean': 'ko'
};
```

### Thay đổi thư mục output

Sửa file `src/config/index.js`:

```javascript
output: {
  folder: 'dist/i18n',    // Thay đổi từ 'dist/languages'
  fileName: 'locale.json'
}
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Author

**VaQuan** - [GitHub](https://github.com/vaquan1997)

---

📧 **Hỗ trợ:** Nếu gặp vấn đề, vui lòng tạo [Issue](https://github.com/vaquan1997/muti-language-tool-upload-to-cdn/issues) trên GitHub.