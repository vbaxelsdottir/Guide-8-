import http from 'node:http';
import { readFile } from 'node:fs/promises';
const base = new URL(process.argv.includes('--production') ? '../dist/' : '../', import.meta.url);
const types = {'index.html':'text/html','styles.css':'text/css','app.js':'text/javascript','data.json':'application/json','favicon.svg':'image/svg+xml'};
http.createServer(async (req,res) => {
  const name = new URL(req.url,'http://localhost').pathname.slice(1) || 'index.html';
  if (!Object.hasOwn(types,name)) {res.writeHead(404);res.end('Not found');return;}
  try {res.writeHead(200,{'Content-Type':types[name]+'; charset=utf-8','Cache-Control':'no-store'});res.end(await readFile(new URL(name,base)));}
  catch {res.writeHead(500);res.end('File unavailable. Run npm run build before previewing production.');}
}).listen(4300,'127.0.0.1',()=>console.log('Comparison: http://127.0.0.1:4300/'));
