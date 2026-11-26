const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../dist'),c={window:{}};vm.createContext(c);
for(const f of ['local-projects.js','design-projects.js','assets/projects/plumas/media.js','script-documents.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
function exists(relative){if(!relative||/^(?:[a-z]+:|\/)/i.test(relative)||!fs.existsSync(path.join(root,relative)))throw Error('Invalid site asset: '+relative)}
let count=0;for(const p of [...c.window.localProjects,...c.window.designProjects]){
 exists(p.cover);if(p.type==='video'){if(p.externalVideo){const u=new URL(p.externalVideo.url);if(u.protocol!=='https:'||u.hostname!=='pan.baidu.com'||u.searchParams.get('pwd')!==p.externalVideo.code)throw Error('Invalid external video: '+p.title)}exists(p.video);const m=p.id==='plumas'?c.window.plumasMedia:p.media;if(!c.window.projectDocuments[p.documentKey]&&!p.missing?.includes('script'))throw Error('Missing script: '+p.title);for(const item of [...m.assets,...m.storyboard]){exists(item.src);count++}}
 else{if(p.page)exists(p.page+'index.html');else exists(p.pdf);let pages=0;for(const s of p.sections)for(const item of s.items){exists(item.src);pages++}if(pages!==p.pageCount)throw Error('Page count mismatch: '+p.title)}
}
for(let i=1;i<=61;i++)exists('assets/island-frames/frame-'+String(i).padStart(3,'0')+'.webp');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const ref=m[1].split('?')[0];if(!/^https?:/.test(ref))exists(ref)}
console.log(`Validated ${c.window.localProjects.length} videos, ${c.window.designProjects.length} design projects and ${count} production images.`);

// The website's design selection is tied to the final PDF edition.
const manifestPath=path.join(root,'assets/design/portfolio-manifest.json');
if(fs.existsSync(manifestPath)){
 const crypto=require('node:crypto'),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
 if(hash(manifest.portfolioPdf)!==manifest.portfolioSha256)throw Error('Portfolio PDF changed: synchronize the website selection and manifest before publishing');
 if(JSON.stringify(c.window.designProjects.map(p=>p.id))!==JSON.stringify(manifest.projects.map(p=>p.id)))throw Error('Website design projects differ from the PDF edition');
 for(const expected of manifest.projects){const actual=c.window.designProjects.find(p=>p.id===expected.id);const items=actual.sections.flatMap(s=>s.items);if(actual.title!==expected.title||JSON.stringify(items.map(x=>[x.src,x.title]))!==JSON.stringify(expected.items.map(x=>[x.src,x.title])))throw Error('Design selection differs from PDF manifest: '+expected.id);for(const item of expected.items)if(hash(item.src)!==item.sha256)throw Error('Artwork changed: update PDF and website together: '+item.src);}
 console.log('Verified design selection and asset hashes against the final PDF edition.');
}

// Raster artwork is delivered as WebP; original JPG/PNG files stay outside dist.
function checkImageFormats(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())checkImageFormats(file);else if(/\.(?:png|jpe?g)$/i.test(item.name))throw Error('Unoptimized raster image in site: '+path.relative(root,file));}}
checkImageFormats(root);
for(const leaf of ['plane','maple','ginkgo','lotus'])exists('assets/leaves/'+leaf+'.webp');
console.log('Verified WebP-only raster images and all four leaf silhouette masks.');
