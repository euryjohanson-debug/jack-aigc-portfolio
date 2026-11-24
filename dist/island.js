(() => {
 const videoGroups=[['all','全部 AI 视频'],['film','剧集'],['commercial','广告'],['tvc','TVC'],['seeding','种草推广'],['feed','信息流'],['game','游戏类'],['short','创意短片']];
 const designGroups=[['all','全部设计'],['ecommerce','电商全案'],['branding','品牌全案'],['campaign','线上活动类全案'],['graphic','其他设计'],['banner','Banner / 海报 / H5'],['identity','海报 / KV / VI'],['type','字体设计'],['illustration','插画']];
 const destinations=[
  {selector:'.h1',leaf:'plane',title:'剧集',en:'STORY & SERIES',url:'#/works?type=video&category=film'},
  {selector:'.h2',leaf:'maple',title:'设计作品',en:'VISUAL DESIGN',url:'#/works?type=design'},
  {selector:'.h3',leaf:'ginkgo',title:'创意短片',en:'CREATIVE FILMS',url:'#/works?type=video&category=short'},
  {selector:'.h4',leaf:'lotus',title:'广告作品',en:'TVC / PRODUCT / FEED',url:'#/works?type=video&category=commercial'}
 ];
 for(const item of destinations){
  const hotspot=document.querySelector('.capabilities '+item.selector);
  hotspot.innerHTML='<a class="hotspot-link leaf-'+item.leaf+'" href="'+item.url+'" aria-label="浏览'+item.title+'"><img class="island-leaf" src="assets/leaves/'+item.leaf+'.webp" alt="" aria-hidden="true" width="320" height="320"><span>'+item.title+'<small>'+item.en+'</small></span></a>';
 }
 document.getElementById('cap-description').textContent='选择一片叶子，走进对应的作品世界。';
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
   document.getElementById('inner-page').innerHTML='<span class="chip">CHOOSE YOUR WORLD</span><h1 class="page-title">选择一种表达。</h1><p class="page-intro">动态影像与静态设计，各自展开。</p><div class="portfolio-worlds"><a class="portfolio-world video-world" href="#/works?type=video"><video class="world-motion" src="assets/navigation/plant-growth.mp4" poster="assets/navigation/plant-growth.jpg" muted loop playsinline preload="none" aria-hidden="true"></video><div><span class="eyebrow">STORIES IN MOTION</span><h2>AI 视频</h2><p>剧集、创意短片与商业广告</p><span class="world-enter">进入动态作品</span></div></a><a class="portfolio-world design-world" href="#/works?type=design"><img src="assets/navigation/static-moss.webp" alt="苔藓与植物构成的绿色设计作品入口"><div><span class="eyebrow">VISUAL CREATIVE PORTFOLIO</span><h2>设计作品</h2><p>品牌、电商与视觉表达</p><span class="world-enter">进入静态作品</span></div></a></div><a class="back-to-island" href="#/">回到浮岛</a>';
   const motion=document.querySelector('.world-motion');if(motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.connection?.saveData){worldObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.play().catch(()=>{});else e.target.pause();}),{threshold:.1});worldObserver.observe(motion);}
   window.scrollTo({top:0,behavior:'instant'});return;
  }
  const cats=type==='design'?designGroups:type==='video'?videoGroups:[['all','全部作品']];
  const cat=cats.some(c=>c[0]===params.get('category'))?params.get('category'):'all';
  const label=cats.find(c=>c[0]===cat)[1];
  document.getElementById('inner-page').innerHTML=`${type==='design'&&cat==='all'?'<section class="design-portal" aria-label="AIGC视觉创意作品集封面"><img src="assets/navigation/static-moss.webp" alt="苔藓与植物构成的绿色设计作品集封面" fetchpriority="high"><div class="design-portal-caption"><span>VISUAL CREATIVE PORTFOLIO</span><span>裴继豪 / PEI · 2026</span></div></section>':''}<span class="chip">EXPLORE / ${type==='design'?'DESIGN':type==='video'?'AI VIDEO':'PORTFOLIO'}</span><h1 class="page-title">${type==='all'?'作品的不同切面。':label}</h1><p class="page-intro">${type==='design'?'以品牌为线索，浏览完整的视觉设计与应用。':'从成片到制作过程，走近每一个创意。'}</p>${type==='design'?'<a class="design-archive-link" href="assets/design/brand-collection-2026.pdf?v=20261124-final9" target="_blank" rel="noopener">阅读最新综合作品集 · 40 页（含目录）</a> <a class="design-archive-link" href="assets/design/complete-portfolio.pdf" target="_blank" rel="noopener">阅读原作品集 · 94 页</a>':''}<div class="island-type-nav"><a href="#/works" ${type==='all'?'aria-current="page"':''}>全部作品</a><a href="#/works?type=video" ${type==='video'?'aria-current="page"':''}>AI 视频</a><a href="#/works?type=design" ${type==='design'?'aria-current="page"':''}>设计作品</a></div><div class="island-category-nav">${cats.map(([key,title])=>`<a href="#/works?type=${type}&category=${key}" ${cat===key?'aria-current="page"':''}>${title}</a>`).join('')}</div><div class="project-grid" id="all-grid"></div><a class="back-to-island" href="#/">回到浮岛</a>`;
  renderGrid('all-grid',type,cat);window.scrollTo({top:0,behavior:'instant'});
 };
 route();
})();


