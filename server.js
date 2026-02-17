const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const DIR = __dirname;

const server = http.createServer((req, res) => {
  // تجاهل طلبات favicon و غيرها
  if (req.url === '/favicon.ico') {
    res.writeHead(404);
    res.end();
    return;
  }

  // حدد الملف المطلوب
  let filePath;
  if (req.url === '/') {
    filePath = path.join(DIR, 'raya-trade-manual-complete.html');
  } else {
    filePath = path.join(DIR, req.url);
  }

  // للأمان - تأكد من أن الملف ضمن المجلد فقط
  if (!filePath.startsWith(DIR)) {
    res.writeHead(403);
    res.end('الوصول مرفوض');
    return;
  }

  // اقرأ الملف
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`❌ خطأ قراءة الملف: ${filePath}`, err.message);
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - الملف غير موجود</h1><p>الملف المطلوب: ' + filePath + '</p>');
      return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ الموقع يعمل على: http://localhost:${PORT}`);
  console.log(`📂 مسار المجلد: ${DIR}`);
  console.log(`🌐 افتح المتصفح واكتب: http://localhost:${PORT}`);
});
