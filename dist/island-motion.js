(() => {
 'use strict';
 const home=document.getElementById('home-page'),story=document.getElementById('story'),canvas=document.getElementById('scene');
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const cameras=[...document.querySelectorAll('.camera')],openings=[...document.querySelectorAll('.opening')];
 const plate=document.querySelector('.plate'),front=document.querySelector('.front'),hero=document.querySelector('.hero-copy'),vision=document.querySelector('.vision'),capabilities=document.querySelector('.capabilities'),closing=document.querySelector('.closing'),progress=document.querySelector('.story-progress span'),header=document.querySelector('header'),skip=document.querySelector('.skip');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const compact=matchMedia('(max-width: 820px)').matches,cacheLimit=compact?8:12,ahead=compact?4:7,behind=compact?1:2;
 const frames=new Map(),loading=new Set(),failed=new Set(),styleCache=new WeakMap();
 const clamp=n=>Math.max(0,Math.min(1,n)),seg=(p,a,b)=>clamp((p-a)/(b-a)),ease=t=>t<.5?4*t*t*t:1-(-2*t+2)**3/2;
 let raf=0,active=false,last=0,sp=0,target=0,mx=0,my=0,sx=0,sy=0,want=0,shown=-1,direction=1,targets=[],targetKey='',viewportHeight=innerHeight,storyTop=0,scrollRange=1,layoutDirty=true,drawDirty=true,headerSolid,capInert,clock=0,warm=true;
 const stats={renders:0,draws:0,styleWrites:0,sourceWidth:0,sourceHeight:0};
 function style(el,key,value){let values=styleCache.get(el);if(!values){values={};styleCache.set(el,values);}if(values[key]===value)return;values[key]=value;el.style[key]=value;stats.styleWrites++;}
 function visible(el,value,transform){const k=Math.round(value*1000)/1000;style(el,'opacity',String(k));style(el,'visibility',k>.005?'visible':'hidden');style(el,'pointerEvents',k>.2?'auto':'none');if(transform)style(el,'transform',transform);}
 function readTarget(){target=clamp((scrollY-storyTop)/scrollRange);}
 function measure(){
  viewportHeight=innerHeight;storyTop=story.getBoundingClientRect().top+scrollY;scrollRange=Math.max(1,story.offsetHeight-viewportHeight);readTarget();
  const ratio=Math.min(devicePixelRatio,1.3),w=Math.round(canvas.clientWidth*ratio),h=Math.round(canvas.clientHeight*ratio);
  if(w&&h&&(canvas.width!==w||canvas.height!==h)){canvas.width=w;canvas.height=h;shown=-1;drawDirty=true;}
  layoutDirty=false;
 }
 function evict(){
  while(frames.size>cacheLimit){const candidates=[...frames.keys()].filter(i=>i!==0&&i!==shown&&i!==want);let victim=candidates.find(i=>!targets.includes(i));if(victim===undefined)victim=candidates[0];if(victim===undefined)break;frames.get(victim).close?.();frames.delete(victim);}
 }
 function setTargets(){
  const key=want+':'+direction+':'+warm;if(key===targetKey)return;targetKey=key;targets=[want];
  // A tiny opening window is ready before the user reaches the camera move.
  if(warm&&want===0)targets.push(1,2,3);
  else{for(let d=1;d<=ahead;d++)targets.push(want+d*direction);for(let d=1;d<=behind;d++)targets.push(want-d*direction);}
  targets=[...new Set([...targets,0].filter(i=>i>=0&&i<61))];evict();pump();
 }
 function pump(){
  if(!active||document.hidden||home.hidden)return;
  const queue=targets.filter(i=>!frames.has(i)&&!loading.has(i)&&!failed.has(i));
  while(loading.size<2&&queue.length){
   const index=queue.shift();loading.add(index);const image=new Image();image.decoding='async';
   image.onload=async()=>{
    let frame=image;
    // Preserve the full source resolution; do not resize the animation bitmap.
    try{if(window.createImageBitmap)frame=await createImageBitmap(image);}catch{}
    const previous=frames.get(index);previous?.close?.();frames.delete(index);frames.set(index,frame);loading.delete(index);
    stats.sourceWidth=frame.width||frame.naturalWidth;stats.sourceHeight=frame.height||frame.naturalHeight;
    evict();drawDirty=true;pump();wake();
   };
   image.onerror=()=>{loading.delete(index);failed.add(index);pump();};
   image.src='assets/island-frames/frame-'+String(index+1).padStart(3,'0')+'.webp';
  }
 }
 function draw(){
  if(!drawDirty)return;drawDirty=false;
  let n=-1,distance=Infinity;
  for(const i of frames.keys()){
   if((direction>0&&i>want)||(direction<0&&i<want))continue;
   // A late image must not move the camera against the current scroll direction.
   if(shown>=0&&((want>=shown&&i<shown)||(want<=shown&&i>shown)))continue;
   const d=Math.abs(i-want);if(d<distance){distance=d;n=i;}
  }
  if(n<0||n===shown)return;
  const image=frames.get(n),iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height,k=Math.max(canvas.width/iw,canvas.height/ih);
  ctx.drawImage(image,(canvas.width-iw*k)/2,(canvas.height-ih*k)/2,iw*k,ih*k);shown=n;stats.draws++;frames.delete(n);frames.set(n,image);canvas.dataset.frame=String(n);document.documentElement.classList.add('island-ready');evict();
 }
 function wake(){if(active&&!raf)raf=requestAnimationFrame(render);}
 function render(now){
  raf=0;if(!active||home.hidden||document.hidden)return;
  if(layoutDirty)measure();
  const dt=Math.min(64,last?now-last:16.7);last=now;clock+=dt;stats.renders++;
  sp+=(target-sp)*(reduced?1:1-Math.pow(.86,dt/16.7));if(Math.abs(target-sp)<.00002)sp=target;
  const pointerBlend=1-Math.pow(.94,dt/16.7);sx+=(mx-sx)*pointerBlend;sy+=(my-sy)*pointerBlend;
  if(Math.abs(mx-sx)<.0001)sx=mx;if(Math.abs(my-sy)<.0001)sy=my;
  const vp=ease(seg(sp,.05,.69)),next=Math.round(vp*60);if(next!==want){direction=next>want?1:-1;want=next;warm=false;drawDirty=true;}
  setTargets();draw();
  const ambient=(reduced?0:1)*(1-seg(sp,.04,.16)),floatX=Math.sin(clock/1700)*10*ambient,floatY=Math.sin(clock/1250)*14*ambient;
  // The transform is independent of resource readiness: loading cannot pop the island's scale.
  const transform=`translate3d(${(-sx*18+floatX).toFixed(2)}px,${(-sy*12+(1-vp)*viewportHeight*.06+floatY).toFixed(2)}px,0) scale(${(1+.02*(1-vp)).toFixed(5)})`;
  for(const camera of cameras)style(camera,'transform',transform);
  const ho=shown<0?0:shown===0?seg(sp,.06,.105):1;style(plate,'opacity',String(1-ho));style(front,'opacity',String(1-ho));
  const h=seg(sp,.02,.12);for(const opening of openings){visible(opening,1-h);if(!opening.classList.contains('scroll-hint'))style(opening,'filter',h>0&&h<1?`blur(${(h*12).toFixed(1)}px)`:'none');}
  style(hero,'transform',`translateY(${(-h*80).toFixed(2)}px) scale(${(1+h*.06).toFixed(5)})`);
  const v=seg(sp,.17,.27)*(1-seg(sp,.35,.43));visible(vision,v,`translate(-50%,${(-50-(1-v)*12).toFixed(2)}%)`);style(vision,'filter',v>0&&v<1?`blur(${((1-v)*10).toFixed(1)}px)`:'none');
  const cap=seg(sp,.43,.53);visible(capabilities,cap);const inert=cap<.2;if(inert!==capInert){capabilities.inert=inert;capInert=inert;}
  visible(closing,0,'translateY(45px)');style(progress,'transform',`scaleX(${sp.toFixed(5)})`);style(skip,'opacity',String(1-seg(sp,.43,.53)));
  const solid=scrollY>viewportHeight*.65;if(solid!==headerSolid){header.classList.toggle('solid',solid);headerSolid=solid;}
  const phase=sp>.02?'scroll':'opening';if(canvas.dataset.motion!==phase)canvas.dataset.motion=phase;
  const cached=String(frames.size);if(canvas.dataset.cachedFrames!==cached)canvas.dataset.cachedFrames=cached;
  if(ambient>0||sp!==target||sx!==mx||sy!==my)wake();
 }
 function sync(){
  const next=!home.hidden&&!document.hidden;if(next===active){if(next){layoutDirty=true;wake();}return;}
  active=next;last=0;
  if(!active){if(raf)cancelAnimationFrame(raf);raf=0;return;}
  measure();sp=target;drawDirty=true;setTargets();pump();wake();
 }
 window.addEventListener('scroll',()=>{readTarget();wake();},{passive:true});
 window.addEventListener('resize',()=>{layoutDirty=true;wake();},{passive:true});
 window.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;mx=event.clientX/innerWidth-.5;my=event.clientY/innerHeight-.5;wake();},{passive:true});
 window.addEventListener('hashchange',()=>queueMicrotask(sync));
 document.addEventListener('visibilitychange',sync);
 new MutationObserver(sync).observe(home,{attributes:true,attributeFilter:['hidden']});
 new ResizeObserver(()=>{layoutDirty=true;wake();}).observe(story);
 new ResizeObserver(()=>{layoutDirty=true;drawDirty=true;wake();}).observe(canvas);
 window.islandMotionStats=()=>({...stats,active,running:!!raf,desiredFrame:want,displayedFrame:shown,cachedFrames:frames.size,cacheLimit,loading:loading.size,failedFrames:[...failed],cachedPixelBytes:[...frames.values()].reduce((n,image)=>n+(image.width||image.naturalWidth)*(image.height||image.naturalHeight)*4,0)});
 sync();
})();
