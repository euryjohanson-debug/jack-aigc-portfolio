(() => {
 const videoGroups=[['all','全部 AI 视频'],['film','剧集'],['commercial','广告'],['tvc','TVC'],['seeding','种草推广'],['feed','信息流'],['game','游戏类'],['short','创意短片']];
 const designGroups=[['all','全部设计'],['poster','海报设计'],['banner','横幅设计'],['type','字体设计'],['branding','品牌全案']];
 const destinations=[
  {selector:'.h1',leaf:'plane',title:'剧集',en:'STORY & SERIES',url:'#/works?type=video&category=film'},
  {selector:'.h2',leaf:'maple',title:'设计作品',en:'VISUAL DESIGN',url:'#/works?type=design'},
  {selector:'.h3',leaf:'ginkgo',title:'创意短片',en:'CREATIVE FILMS',url:'#/works?type=video&category=short'},
  {selector:'.h4',leaf:'lotus',title:'广告作品',en:'TVC / PRODUCT / FEED',url:'#/works?type=video&category=commercial'}
 ];
 for(const item of destinations){
  const hotspot=document.querySelector('.capabilities '+item.selector);
  hotspot.innerHTML='<a class="hotspot-link entry-'+item.leaf+'" href="'+item.url+'" aria-label="浏览'+item.title+'"><i class="island-plus" aria-hidden="true"></i><span>'+item.title+'<small>'+item.en+'</small></span></a>';
 }
 document.getElementById('cap-description').textContent='点击「＋」，探索不同的创作方向。';
 window.goToIslandMap=()=>window.scrollTo({top:document.getElementById('story').offsetHeight-innerHeight,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 document.addEventListener('click',e=>{const a=e.target.closest('a[href="#island-map"]');if(!a)return;e.preventDefault();window.goToIslandMap();});
 window.updateIslandNavigation=()=>{document.querySelector('.capabilities').inert=Number(document.querySelector('.capabilities').style.opacity)<.2;};
 let worldObserver;
 const baseRoute=route;
 route=()=>{
  worldObserver?.disconnect();document.querySelectorAll('.world-motion').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});
  const [name,query='']=location.hash.replace('#/','').split('?');
  const isHome=!name||name==='home';
  document.body.classList.toggle('island-home',isHome);
  document.querySelector('nav a[data-route="works"]').setAttribute('href',isHome?'#island-map':'#/works');
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  document.body.classList.toggle('design-mode',name==='works'&&new URLSearchParams(query).get('type')==='design');
  if(name==='apps'){
   document.getElementById('home-page').hidden=true;
   const page=document.getElementById('inner-page');
   page.hidden=false;
   page.innerHTML=`<span class="chip">APP DESIGN & DEVELOPMENT</span><h1 class="page-title">让创意，成为可用的工具。</h1><p class="page-intro">从界面设计到交互实现，把实际需求做成手机里的应用。</p><article class="app-showcase"><a class="app-cover-link" href="tietiekan/" aria-label="进入贴贴看官网，下载安卓测试版"><img src="assets/apps/tietiekan-cover.webp" alt="贴贴看视觉设计展示，包含蓝白风格官网、叠纸图标与手机编辑界面" width="1672" height="941" fetchpriority="high"></a><div class="app-showcase-copy"><div class="app-showcase-title"><img src="tietiekan/icon.svg" alt=""><div><h2>贴贴看</h2><p>门贴效果预演 · Android 应用</p></div></div><a class="app-showcase-open" href="tietiekan/">进入官网 · 下载试用</a></div></article><p class="app-showcase-note">选择门面照片，添加海报，调整透视后保存效果图。手机端本地处理，免费导出，无水印。安卓 10 及以上可下载测试版；上方画面为视觉设计示意。</p><a class="text-link" href="#/works">返回作品集</a>`;
   document.querySelector('header').classList.remove('menu-open');
   document.querySelector('header').classList.add('solid');
   document.querySelector('.menu').setAttribute('aria-expanded','false');
   document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.route==='apps'));
   window.scrollTo({top:0,behavior:'instant'});
   return;
  }
  if(name!=='works'&&name!=='about'){baseRoute();return;}
  const params=new URLSearchParams(query);
  document.getElementById('home-page').hidden=true;document.getElementById('inner-page').hidden=false;
  document.querySelector('header').classList.remove('menu-open');document.querySelector('header').classList.add('solid');document.querySelector('.menu').setAttribute('aria-expanded','false');
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.route===name));
  if(name==='about'){
   document.getElementById('inner-page').innerHTML=about;
   const targets={photo:document.querySelector('.profile-portrait'),evaluation:document.querySelector('.about-block'),experience:document.querySelectorAll('.about-block')[2]};
   window.scrollTo({top:0,behavior:'instant'});if(targets[params.get('section')])requestAnimationFrame(()=>targets[params.get('section')].scrollIntoView());return;
  }
  const type=['video','design'].includes(params.get('type'))?params.get('type'):'all';
  if(type==='all'){
   document.getElementById('inner-page').innerHTML='<span class="chip">CHOOSE YOUR WORLD</span><h1 class="page-title">选择一种表达。</h1><p class="page-intro">动态影像与静态设计，各自展开。</p><div class="portfolio-worlds"><a class="portfolio-world video-world" href="#/works?type=video"><video class="world-motion" src="assets/navigation/plant-growth.mp4" poster="assets/navigation/plant-growth.webp" muted loop playsinline preload="none" aria-hidden="true"></video><div><span class="eyebrow">STORIES IN MOTION</span><h2>AI 视频</h2><p>剧集、创意短片与商业广告</p><span class="world-enter">进入动态作品</span></div></a><a class="portfolio-world design-world" href="#/works?type=design"><img src="assets/navigation/static-moss.webp" alt="苔藓与植物构成的绿色设计作品入口"><div><span class="eyebrow">VISUAL CREATIVE PORTFOLIO</span><h2>设计作品</h2><p>品牌、电商与视觉表达</p><span class="world-enter">进入静态作品</span></div></a></div><a class="back-to-island" href="#/">回到浮岛</a>';
   document.querySelector('.portfolio-worlds').insertAdjacentHTML('beforeend','<a class="portfolio-world apps-world" href="#/apps"><img src="tietiekan/storefront.webp" alt="玻璃门上的蓝白海报，贴贴看门贴效果示意" loading="lazy"><div><span class="eyebrow">APP DESIGN & DEVELOPMENT</span><h2>应用作品</h2><p>贴贴看 · 门贴效果预演</p><span class="world-enter">浏览应用作品</span></div></a>');
   const motion=document.querySelector('.world-motion');if(motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.connection?.saveData){worldObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.play().catch(()=>{});else e.target.pause();}),{threshold:.1});worldObserver.observe(motion);}
   window.scrollTo({top:0,behavior:'instant'});return;
  }
  const cats=type==='design'?designGroups:type==='video'?videoGroups:[['all','全部作品']];
  const cat=cats.some(c=>c[0]===params.get('category'))?params.get('category'):'all';
  const label=cats.find(c=>c[0]===cat)[1];
  document.getElementById('inner-page').innerHTML=`${type==='design'&&cat==='all'?'<section class="design-portal" aria-label="AIGC视觉创意作品集封面"><img src="assets/navigation/static-moss.webp" alt="苔藓与植物构成的绿色设计作品集封面" fetchpriority="high"><div class="design-portal-caption"><span>VISUAL CREATIVE PORTFOLIO</span><span>裴继豪 / PEI JIHAO · 2026</span></div></section>':''}<span class="chip">EXPLORE / ${type==='design'?'DESIGN':type==='video'?'AI VIDEO':'PORTFOLIO'}</span><h1 class="page-title">${type==='all'?'作品的不同切面。':label}</h1><p class="page-intro">${type==='design'?'海报、横幅、字体与品牌全案，展开不同形式的视觉表达。':'从成片到制作过程，走近每一个创意。'}</p>${type==='design'?'<a class="design-archive-link" href="assets/design/brand-collection-2026.pdf?v=20261125-qr11" target="_blank" rel="noopener">阅读最新综合作品集 · 40 页（含目录）</a>':''}<div class="island-type-nav"><a href="#/works" ${type==='all'?'aria-current="page"':''}>全部作品</a><a href="#/works?type=video" ${type==='video'?'aria-current="page"':''}>AI 视频</a><a href="#/works?type=design" ${type==='design'?'aria-current="page"':''}>设计作品</a></div><div class="island-category-nav">${cats.map(([key,title])=>`<a href="#/works?type=${type}&category=${key}" ${cat===key?'aria-current="page"':''}>${title}</a>`).join('')}</div><div class="project-grid" id="all-grid"></div><a class="back-to-island" href="#/">回到浮岛</a>`;
  renderGrid('all-grid',type,cat);window.scrollTo({top:0,behavior:'instant'});
 };
 route();
})();




