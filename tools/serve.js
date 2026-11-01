// Tiny static server for local tests: images on file:// pages taint the canvas, so tests load over http.
// Usage: const { serve } = require('./serve'); const { url, close } = await serve('.');
const http = require('http');
const fs = require('fs');
const path = require('path');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
exports.serve = root => new Promise(resolve => {
  const base = path.resolve(root);
  const server = http.createServer((req, res) => {
    const file = path.join(base, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  server.listen(0, '127.0.0.1', () => resolve({ url: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() }));
});
