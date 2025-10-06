# Multi-Language Tool Upload to CDN

Tool tự động đồng bộ dữ liệu đa ngôn ngữ từ Google Sheets lên CDN.

## Cài đặt

```bash
npm install
```

## Cấu hình

1. Tạo file `.env`:
```
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_API_KEY=your_api_key
CDN_PROVIDER=cloudinary|s3|etc
CDN_API_KEY=your_cdn_key
CDN_SECRET=your_cdn_secret
```

## Sử dụng

```bash
# Build và upload lên CDN
npm run build

# Theo dõi thay đổi và tự động upload
npm run watch
```