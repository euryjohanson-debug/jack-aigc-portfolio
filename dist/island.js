(() => {
 const videoGroups=[['all','全部 AI 视频'],['film','剧集'],['commercial','广告'],['tvc','TVC'],['seeding','种草推广'],['feed','信息流'],['game','游戏类'],['short','创意短片']];
 const designGroups=[['all','全部设计'],['ecommerce','电商全案'],['branding','品牌全案'],['campaign','线上活动类全案'],['graphic','其他设计'],['banner','Banner / 海报 / H5'],['identity','海报 / KV / VI'],['type','字体设计'],['illustration','插画']];
 const destinations=[
  {selector:'.h1',title:'剧集',en:'STORY & SERIES',url:'#/works?type=video&category=film'},
  {selector:'.h2',title:'设计作品',en:'VISUAL DESIGN',url:'#/works?type=design'},
  {selector:'.h3',title:'创意短片',en:'CREATIVE FILMS',url:'#/works?type=video&category=short'},
  {selector:'.h4',title:'广告作品',en:'TVC / PRODUCT / FEED',url:'#/works?type=video&category=commercial'}
 ];
 for(const item of destinations){
  const hotspot=document.querySelector('.capabilities '+item.selector);
  hotspot.innerHTML='<a class="hotspot-link" href="'+item.url+'" aria-label="浏览'+item.title+'"><b aria-hidden="true">＋</b><span>'+item.title+'<small>'+item.en+'</small></span></a>';
 }
 document.getElementById('cap-description').textContent='点击岛上的分类热点，进入对应作品。';
 window.updateIslandNavigation=()=>{document.querySelector('.capabilities').inert=Number(document.querySelector('.capabilities').style.opacity)<.2;};
 const baseRoute=route;
 route=()=>{
  const [name,query='']=location.hash.replace('#/','').split('?');
  if(name!=='works'&&name!=='about'){baseRoute();return;}
  const params=new URLSearchParams(query);
  document.getElementById('home-page').hidden=true;document.getElementById('inner-page').hidden=false;
  document.querySelector('header').classList.remove('menu-open');document.querySelector('header').classList.add('solid');document.querySelector('.menu').setAttribute('aria-expanded','false');
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.route===name));
  if(name==='about'){
   document.getElementById('inner-page').innerHTML=about;
   const targets={photo:document.querySelector('.portrait-placeholder'),evaluation:document.querySelector('.about-block'),experience:document.querySelectorAll('.about-block')[2]};
   window.scrollTo({top:0,behavior:'instant'});if(targets[params.get('section')])requestAnimationFrame(()=>targets[params.get('section')].scrollIntoView());return;
  }
  const type=['video','design'].includes(params.get('type'))?params.get('type'):'all';
  const cats=type==='design'?designGroups:type==='video'?videoGroups:[['all','全部作品']];
  const cat=cats.some(c=>c[0]===params.get('category'))?params.get('category'):'all';
  const label=cats.find(c=>c[0]===cat)[1];
  document.getElementById('inner-page').innerHTML=`<span class="chip">EXPLORE / ${type==='design'?'DESIGN':type==='video'?'AI VIDEO':'PORTFOLIO'}</span><h1 class="page-title">${type==='all'?'作品的不同切面。':label}</h1><p class="page-intro">${type==='design'?'以品牌为线索，浏览完整的视觉设计与应用。':'从成片到制作过程，走近每一个创意。'}</p>${type==='design'?'<a class="design-archive-link" href="assets/design/complete-portfolio.pdf" target="_blank" rel="noopener">阅读完整作品集 · 94 页</a>':''}<div class="island-type-nav"><a href="#/works" ${type==='all'?'aria-current="page"':''}>全部作品</a><a href="#/works?type=video" ${type==='video'?'aria-current="page"':''}>AI 视频</a><a href="#/works?type=design" ${type==='design'?'aria-current="page"':''}>设计作品</a></div><div class="island-category-nav">${cats.map(([key,title])=>`<a href="#/works?type=${type}&category=${key}" ${cat===key?'aria-current="page"':''}>${title}</a>`).join('')}</div><div class="project-grid" id="all-grid"></div><a class="back-to-island" href="#/">回到浮岛</a>`;
  renderGrid('all-grid',type,cat);window.scrollTo({top:0,behavior:'instant'});
 };
 route();
})();


