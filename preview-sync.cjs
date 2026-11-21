const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function version(root){
 const files=fs.readdirSync(root).filter(n=>/\.(html|css|js)$/.test(n)).sort();
 return crypto.createHash('sha256').update(files.map(n=>{const s=fs.statSync(path.join(root,n));return n+':'+s.mtimeMs+':'+s.size}).join('|')).digest('hex').slice(0,16);
}
function client(root){
 return `(()=>{const version=${JSON.stringify(version(root))};let checking=false;async function check(){if(checking||document.hidden)return;checking=true;try{const r=await fetch('./__preview/version',{cache:'no-store'});if(!r.ok)return;const data=await r.json();if(data.version!==version&&!document.querySelector('dialog[open]')&&!document.activeElement?.matches('input,textarea,[contenteditable="true"]'))location.reload();}catch{}finally{checking=false}}setInterval(check,2500);document.addEventListener('visibilitychange',check);window.addEventListener('focus',check)})();`;
}
module.exports={version,client};
