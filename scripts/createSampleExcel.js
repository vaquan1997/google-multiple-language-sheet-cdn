import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo dữ liệu mẫu
const data = [
  { locale: 'en', key: 'greeting', value: 'Hello' },
  { locale: 'en', key: 'farewell', value: 'Goodbye' },
  { locale: 'en', key: 'welcome', value: 'Welcome' },
  { locale: 'vi', key: 'greeting', value: 'Xin chào' },
  { locale: 'vi', key: 'farewell', value: 'Tạm biệt' },
  { locale: 'vi', key: 'welcome', value: 'Chào mừng' },
  { locale: 'ja', key: 'greeting', value: 'こんにちは' },
  { locale: 'ja', key: 'farewell', value: 'さようなら' },
  { locale: 'ja', key: 'welcome', value: 'いらっしゃいませ' }
];

// Tạo workbook
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(data);

// Thêm worksheet vào workbook
xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

// Lưu file
const outputPath = path.join(__dirname, '../data/sample/locales.xlsx');
xlsx.writeFile(wb, outputPath);

console.log('✅ Đã tạo file Excel mẫu:', outputPath);