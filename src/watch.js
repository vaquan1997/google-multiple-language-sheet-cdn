const cron = require('node-cron');
const { exec } = require('child_process');

console.log('👀 Đang theo dõi thay đổi...');
console.log('⏰ Sẽ kiểm tra mỗi 5 phút');

// Chạy build mỗi 5 phút
cron.schedule('*/5 * * * *', () => {
  console.log('\n🔄 Đang kiểm tra và build...');
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Lỗi: ${error}`);
      return;
    }
    console.log(stdout);
  });
});

// Hoặc có thể dùng webhook từ Google Sheets
// Xem: https://developers.google.com/sheets/api/guides/notifications