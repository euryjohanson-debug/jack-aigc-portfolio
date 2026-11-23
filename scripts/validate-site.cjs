const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../dist'),c={window:{}};vm.createContext(c);
for(const f of ['local-projects.js','design-projects.js','assets/projects/plumas/media.js','script-documents.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
function exists(relative){if(!relative||/^(?:[a-z]+:|\/)/i.test(relative)||!fs.existsSync(path.join(root,relative)))throw Error('Invalid site asset: '+relative)}
let count=0;for(const p of [...c.window.localProjects,...c.window.designProjects]){
 exists(p.cover);if(p.type==='video'){exists(p.video);const m=p.id==='plumas'?c.window.plumasMedia:p.media;if(!c.window.projectDocuments[p.documentKey]&&!p.missing?.includes('script'))throw Error('Missing script: '+p.title);for(const item of [...m.assets,...m.storyboard]){exists(item.src);count++}}
 else{if(p.page)exists(p.page+'index.html');else exists(p.pdf);let pages=0;for(const s of p.sections)for(const item of s.items){exists(item.src);pages++}if(pages!==p.pageCount)throw Error('Page count mismatch: '+p.title)}
}
for(let i=1;i<=61;i++)exists('assets/island-frames/frame-'+String(i).padStart(3,'0')+'.webp');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const ref=m[1].split('?')[0];if(!/^https?:/.test(ref))exists(ref)}
console.log(`Validated ${c.window.localProjects.length} videos, ${c.window.designProjects.length} design projects and ${count} production images.`);
