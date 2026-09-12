const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../build');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.pdf':'application/pdf' };
http.createServer((req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let target = path.resolve(root,'.'+pathname);
    if (!target.startsWith(root+path.sep) && target !== root) { res.writeHead(403);res.end();return; }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target=path.join(target,'index.html');
    if (!fs.existsSync(target)) { res.writeHead(404);res.end();return; }
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});
    fs.createReadStream(target).pipe(res);
  } catch { res.writeHead(400);res.end(); }
}).listen(Number(process.argv[2]||4173),'127.0.0.1',()=>console.log('Build preview ready'));
