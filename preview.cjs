const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.pdf':'application/pdf'};
const port=Number(process.env.PORT||8080);
const sync=require('./preview-sync.cjs');
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/__preview/version'||url.pathname==='/__preview/client.js'){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type',url.pathname.endsWith('.js')?'text/javascript; charset=utf-8':'application/json');
  res.end(url.pathname.endsWith('.js')?sync.client(root):JSON.stringify({version:sync.version(root)}));return;
 }
 let file;try{file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname))}catch{res.writeHead(400).end();return}
 if(file===root)file=path.join(root,'index.html');if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 if(url.pathname.endsWith('/')&&path.extname(file)!=='.html')file=path.join(file,'index.html');
 fs.stat(file,(err,stat)=>{
  if(err||!stat.isFile()){res.writeHead(404).end();return}
  if(path.extname(file)==='.html'){
   fs.readFile(file,'utf8',(error,html)=>{if(error){res.writeHead(500).end();return}const body=html.replace('</body>','<script src="./__preview/client.js"></script></body>');res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Length':Buffer.byteLength(body)});res.end(req.method==='HEAD'?undefined:body)});return;
  }
  const size=stat.size;res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.setHeader('Accept-Ranges','bytes');
  let start=0,end=size-1,status=200;
  if(req.headers.range){
   const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   if(!m||!m[1]&&!m[2]){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return}
   if(!m[1]){start=Math.max(0,size-Number(m[2]))}else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]))}
   if(start> end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return}
   status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);
  }
  res.setHeader('Content-Length',end-start+1);res.writeHead(status);if(req.method==='HEAD'){res.end();return}
  const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
 });
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/#/`));
