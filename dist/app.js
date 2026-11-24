const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const projects=[
{id:'commercial',type:'video',category:'commercial',tag:'TVC',title:'品牌广告 / TVC',en:'COMMERCIAL',sub:'IDEAS THAT CONNECT',style:'commercial',description:'以品牌表达和产品卖点为核心，展示创意策划与广告影像。'},
{id:'film',type:'video',category:'film',tag:'剧集',title:'短剧与剧集',en:'STORY & FILM',sub:'EVERY FRAME TELLS A STORY',style:'film',description:'通过连续镜头、人物与场景，呈现完整的剧情表达。'},
{id:'branding',type:'design',category:'branding',tag:'PDF',title:'品牌全案',en:'BRAND SYSTEM',sub:'A CONSISTENT VISUAL LANGUAGE',style:'brand-art',description:'以完整PDF为基础，展示品牌概念、标志、视觉规范与应用延展。'},
{id:'short',type:'video',category:'short',tag:'短片',title:'创意短片',en:'BEYOND REAL',sub:'A SPACE FOR IMAGINATION',style:'short',description:'探索视觉风格、概念表达和不同形式的影像创作。'},
{id:'ads',type:'video',category:'commercial',tag:'种草 · 信息流',title:'种草与信息流广告',en:'PRODUCT STORIES',sub:'MADE TO BE SEEN',style:'ads',description:'围绕使用场景与卖点，展示面向传播的产品内容。'},
{id:'ecommerce',type:'design',category:'ecommerce',tag:'PDF',title:'电商全案',en:'PRODUCT & DESIGN',sub:'FROM PRODUCT TO EXPERIENCE',style:'ecommerce',description:'以完整PDF为基础，展示主图、详情页与营销物料的系列设计。'},
{id:'graphic',type:'design',category:'graphic',tag:'画廊',title:'精选设计',en:'VISUAL NOTES',sub:'TYPE / POSTER / ICON',style:'short',description:'字体、海报、图标等独立设计，以精选画廊形式展示。'}];
const filters=[['all','全部精选'],['video','视频作品'],['design','设计作品']];
function art(p){return `<div class="project-art ${p.style}"><div class="project-top"><span>${p.tag}</span><span>LAYOUT PREVIEW</span></div><div class="art-mark"></div><div class="art-title">${p.en.replace(' ','<br>')}<small class="art-sub">${p.sub}</small></div></div>`}
function renderGrid(id,type='all',cat='all'){const arr=projects.filter(p=>(id!=='home-grid'||p.id!=='graphic')&&(type==='all'||p.type===type)&&(cat==='all'||p.category===cat));$('#'+id).innerHTML=arr.map(p=>`<button class="project-card" data-project="${p.id}" aria-label="查看${p.title}版式预览">${art(p)}<div class="project-info"><div><h3>${p.title}</h3><p>${p.type==='video'?'AI VIDEO':'VISUAL DESIGN'} · ${p.tag}</p></div><span class="preview-tag">作品待添加</span></div></button>`).join('')||'<p class="empty">该分类暂未添加作品。</p>';}
function filterbar(container,id){container.innerHTML=filters.map(([v,t])=>`<button data-filter="${v}" aria-pressed="${v==='all'}" class="${v==='all'?'active':''}">${t}</button>`).join('');container.onclick=e=>{const b=e.target.closest('button');if(!b)return;container.querySelectorAll('button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});renderGrid(id,b.dataset.filter);if(id==='all-grid')secondary(b.dataset.filter);};}
filterbar($('.filterbar'),'home-grid');renderGrid('home-grid');
function secondary(type){const list=type==='design'?[['all','全部设计'],['branding','品牌全案'],['ecommerce','电商全案'],['graphic','精选设计']]:type==='video'?[['all','全部视频'],['commercial','商业广告'],['short','创意短片'],['film','短剧与剧集']]:[['all','全部分类'],['commercial','商业广告'],['short','创意短片'],['film','短剧与剧集'],['branding','品牌全案'],['ecommerce','电商全案'],['graphic','精选设计']];$('#secondary').innerHTML=list.map(([k,v])=>`<button data-cat="${k}" class="${k==='all'?'active':''}">${v}</button>`).join('');$('#secondary').onclick=e=>{const b=e.target.closest('button');if(!b)return;$('#secondary').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderGrid('all-grid',type,b.dataset.cat)}}
const profile=window.peiProfile;
const experienceHtml=profile.experience.map(e=>`<article class="career-entry"><div class="career-date">${e.date}</div><h3>${e.company}</h3><p class="career-role">${e.title}</p><p class="career-note">${e.note}</p><p>${e.summary}</p><ul>${e.items.map(([t,v])=>`<li><strong>${t}：</strong>${v}</li>`).join('')}</ul><p class="career-result"><strong>成果与积累</strong>${e.result}</p></article>`).join('');
function profilePage(isContact){return `<span class="chip">${isContact?'LET’S WORK TOGETHER':'ABOUT THE CREATOR'} / PEI</span><h1 class="page-title">裴继豪 <small class="profile-english">${profile.pinyin}</small></h1><p class="page-intro profile-position">${profile.role}</p><p class="profile-summary">${profile.intro}</p><div class="profile-resume-layout"><aside class="profile-identity"><div class="profile-portrait"><img src="assets/profile/jack-portrait.webp" alt="裴继豪 PEI 个人写真" width="1000" height="1500"></div><div class="identity-copy"><span class="eyebrow">EDUCATION / 教育背景</span>${profile.education.map(e=>`<div class="education-entry"><h3>${e.school}</h3><p>${e.major}</p><small>${e.date}</small></div>`).join('')}<p class="identity-location">北京 · 朝阳区</p><div class="project-actions"><button class="button dark" type="button" data-contact-open aria-haspopup="dialog">获取联系方式</button><a class="button profile-outline" href="assets/profile/pei-jihao-resume.pdf" download="裴继豪_AIGC简历.pdf">下载简历</a></div></div></aside><section class="profile-career" aria-labelledby="career-title"><div class="career-heading"><span class="eyebrow">EXPERIENCE / 工作履历</span><h2 id="career-title">从现场执行，到视觉统筹。</h2></div>${experienceHtml}<section class="career-method"><span class="eyebrow">METHOD / 工作方法</span><h2>把问题，变成可执行的步骤。</h2><p>${profile.method}</p><div class="skill-tags">${profile.skills.map(s=>`<span>${s}</span>`).join('')}</div></section><div class="career-cta"><h2>让下一个创意，成为完整的作品。</h2><p>欢迎交流编导、AIGC创意生成与视觉设计的工作机会。</p><button class="button dark" type="button" data-contact-open aria-haspopup="dialog">联系我</button><a class="text-link" href="#/works">浏览作品集</a></div></section></div>`;}
const about=profilePage(false);
const contact=profilePage(true);
function route(){let r=location.hash.replace('#/','')||'home';if(r==='works-home')return;const isHome=r==='home';$('#home-page').hidden=!isHome;$('#inner-page').hidden=isHome;$$('nav a').forEach(a=>a.classList.toggle('active',a.dataset.route===r));$('header').classList.remove('menu-open');$('.menu').setAttribute('aria-expanded','false');if(!isHome){if(r==='works'){$('#inner-page').innerHTML=`<span class="chip">WORK INDEX</span><h1 class="page-title">创意的不同切面。</h1><p class="page-intro">视频与设计，构成完整的创意表达。<br>当前为分类与版式预览，实际作品将在后续添加。</p><div class="filterbar" id="all-filters"></div><div class="secondary-filters" id="secondary"></div><div class="project-grid" id="all-grid"></div>`;filterbar($('#all-filters'),'all-grid');secondary('all');renderGrid('all-grid')}else $('#inner-page').innerHTML=r==='about'?about:r==='contact'?contact:'<h1>页面未找到</h1><a href="#/">返回首页</a>';}window.scrollTo({top:0,behavior:'instant'});$('header').classList.toggle('solid',!isHome)}
window.addEventListener('hashchange',()=>{if(location.hash==='#works-home'||location.hash==='#island-map'){location.hash='#/';requestAnimationFrame(()=>window.goToIslandMap?.());return}route()});route();$('.menu').onclick=()=>{const open=$('header').classList.toggle('menu-open');$('.menu').setAttribute('aria-expanded',open)};
const descriptions=['从项目需求出发，组织核心创意、脚本与分镜，确定内容方向。','建立人物、场景与产品的视觉语言，保持风格与资产一致。','根据分镜组织AI生成与镜头衔接，让视觉服务于内容表达。','通过剪辑、声音与画面调整，将各环节整合为完整成品。'];$$('[data-cap]').forEach(b=>b.onclick=()=>{$$('[data-cap]').forEach(x=>x.setAttribute('aria-expanded',x===b&&b.getAttribute('aria-expanded')!=='true'));$('#cap-description').textContent=descriptions[+b.dataset.cap]});
const dialog=$('#project-dialog');document.addEventListener('click',e=>{const card=e.target.closest('[data-project]');if(!card)return;const p=projects.find(x=>x.id===card.dataset.project);$('#dialog-content').innerHTML=`<span class="chip">${p.type==='video'?'VIDEO PROJECT':'DESIGN PROJECT'} / 页面结构预览</span><h2>${p.title}</h2><p>${p.description}</p><div class="dialog-art">${p.type==='video'?'完整成片播放位置':'设计主视觉与PDF阅读位置'} · 素材待添加</div><div class="detail-grid"><section><h3>项目概况</h3><p>项目需求、类型与个人职责。<br>此处将在选片后填写真实内容。</p></section><section><h3>核心创意</h3><p>简洁说明创意方向与视觉思路，让招聘方快速理解项目。</p></section><section><h3>关键制作过程</h3><p>精选分镜、资产或前后对比，展示具体制作方法。</p></section><section><h3>最终交付</h3><p>${p.type==='video'?'完整视频与相关版本。':'系列设计与完整PDF阅读、下载。'}素材添加后启用。</p></section></div>`;dialog.showModal()});$('.close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
// Decode short reference clip once; scrub cached images with scroll rather than seeking on every event.
const video=$('#fly'),canvas=$('#scene'),ctx=canvas.getContext('2d');let frames=[],want=0,shown=-1,busy=false,nf=121,sp=0,mx=0,my=0,sx=0,sy=0,last=0;
const clamp=n=>Math.max(0,Math.min(1,n)),seg=(p,a,b)=>clamp((p-a)/(b-a)),ease=t=>t<.5?4*t*t*t:1-(-2*t+2)**3/2;
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const d=Math.min(devicePixelRatio,1.3),cw=Math.round(w*d),ch=Math.round(h*d);if(canvas.width===cw&&canvas.height===ch)return;canvas.width=cw;canvas.height=ch;shown=-1;drawWant()}window.addEventListener('resize',resize);new ResizeObserver(resize).observe(canvas);resize();
function nearest(){for(let i=0;i<nf;i++){if(frames[want-i])return want-i;if(frames[want+i])return want+i}return -1}
function drawWant(){
 if(!ctx||(!frames[0]&&want===0))return;
 const n=nearest();if(n<0||n===shown||(shown>=0&&Math.abs(n-want)>2))return;
 const img=frames[n],k=Math.max(canvas.width/(img.naturalWidth||img.width),canvas.height/(img.naturalHeight||img.height));
 const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;ctx.drawImage(img,(canvas.width-iw*k)/2,(canvas.height-ih*k)/2,iw*k,ih*k);shown=n;canvas.dataset.frame=String(n);
}
// Pre-extracted original camera move: independent of autoplay and video seeking.
nf=61;frames=new Array(nf);
// Keep only the first frame and a small window around the requested camera frame.
const loadingFrames=new Set(),failedFrames=new Set();let frameTargets=new Set([0]),lastFrameTarget=-1;
function requestFrameWindow(index){
 if(index!==lastFrameTarget){lastFrameTarget=index;frameTargets=new Set([0]);if(index>0)for(let i=Math.max(0,index-6);i<=Math.min(nf-1,index+6);i++)frameTargets.add(i);
  for(let i=0;i<nf;i++)if(frames[i]&&!frameTargets.has(i)){frames[i].close?.();frames[i]=undefined;}
 }
 canvas.dataset.cachedFrames=String(frames.filter(Boolean).length);pumpFrames();
}
function pumpFrames(){
 if($('#home-page').hidden||document.hidden)return;
 const queue=[...frameTargets].filter(i=>!frames[i]&&!loadingFrames.has(i)&&!failedFrames.has(i)).sort((a,b)=>Math.abs(a-want)-Math.abs(b-want));
 while(loadingFrames.size<2&&queue.length){
  const index=queue.shift();loadingFrames.add(index);const img=new Image();img.decoding='async';
  img.onload=async()=>{
   let frame=img;
   try{if(window.createImageBitmap)frame=await createImageBitmap(img,{resizeWidth:960,resizeHeight:542,resizeQuality:'high'});}catch{}
   if(frameTargets.has(index)){frames[index]=frame;drawWant();document.documentElement.classList.add('island-ready');}else frame.close?.();
   loadingFrames.delete(index);pumpFrames();
  };
  img.onerror=()=>{failedFrames.add(index);loadingFrames.delete(index);pumpFrames();};
  img.src='assets/island-frames/frame-'+String(index+1).padStart(3,'0')+'.webp';
 }
}
requestFrameWindow(0);
window.addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function visibility(el,k,transform){el.style.opacity=k;el.style.visibility=k>.005?'visible':'hidden';el.style.pointerEvents=k>.2?'auto':'none';if(transform)el.style.transform=transform}
function animate(now){requestAnimationFrame(animate);const dt=Math.min(64,now-last||16.7);last=now;if(!$('#home-page').hidden){const r=$('#story').getBoundingClientRect();let p=clamp(-r.top/($('#story').offsetHeight-innerHeight));sp+=(p-sp)*(reduced?1:1-Math.pow(.86,dt/16.7));sx+=(mx-sx)*.06;sy+=(my-sy)*.06;let vp=ease(seg(sp,.05,.69));const ambient=(reduced?0:1)*(1-seg(sp,.04,.16));want=Math.round(vp*(nf-1));requestFrameWindow(want);drawWant();canvas.dataset.motion=sp>.02?"scroll":"opening";const floatX=Math.sin(now/1700)*10*ambient,floatY=Math.sin(now/1250)*14*ambient;const transform=`translate3d(${-sx*18+floatX}px,${-sy*12+(1-vp)*innerHeight*.06+floatY}px,0) scale(${shown<0?1+vp*.65:1+.02*(1-vp)})`;$$('.camera').forEach(x=>x.style.transform=transform);let ho=shown<0?0:shown===0?seg(sp,.06,.105):1;$('.plate').style.opacity=1-ho;$('.front').style.opacity=1-ho;let h=seg(sp,.02,.12);$$('.opening').forEach(x=>{visibility(x,1-h);if(!x.classList.contains('scroll-hint'))x.style.filter=`blur(${h*12}px)`});$('.hero-copy').style.transform=`translateY(${-h*80}px) scale(${1+h*.06})`;const v=seg(sp,.17,.27)*(1-seg(sp,.35,.43));visibility($('.vision'),v,`translate(-50%,${-50-(1-v)*12}%)`);$('.vision').style.filter=`blur(${(1-v)*10}px)`;const cap=seg(sp,.43,.53);visibility($('.capabilities'),cap);window.updateIslandNavigation?.(sp);let end=0;visibility($('.closing'),end,`translateY(${(1-end)*45}px)`);$('.story-progress span').style.transform=`scaleX(${sp})`;$('header').classList.toggle('solid',scrollY>innerHeight*.65);$('.skip').style.opacity=1-seg(sp,.43,.53)}}requestAnimationFrame(animate);


