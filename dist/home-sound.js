(() => {
 const button=document.createElement('button');
 button.type='button';button.className='home-sound';button.setAttribute('aria-pressed','false');
 button.innerHTML='<span aria-hidden="true">♪</span> <span class="sound-label">Sound On</span>';
 const status=document.createElement('span');status.className='sound-status';status.setAttribute('role','status');
 document.body.append(button,status);
 let context,gain,buffer,loading,source,started=0,offset=0,wanted=false,pending=false,attempt=0;
 const home=()=>['','#/','#/home'].includes(location.hash);
 function update(){
  button.hidden=!home();status.hidden=!home();button.setAttribute('aria-pressed',String(!!source));button.setAttribute('aria-busy',String(pending));
  button.setAttribute('aria-label',source?'关闭首页背景音乐':'开启首页背景音乐');
  button.querySelector('.sound-label').textContent=pending?'Loading…':source?'Sound Off':'Sound On';
  button.dataset.state=source?'playing':pending?'loading':'paused';
 }
 async function load(){
  if(buffer)return buffer;
  if(!loading)loading=(async()=>{
   for(const url of ['assets/audio/home-loop.ogg','assets/audio/home-loop.mp3']){
    try{const r=await fetch(url);if(!r.ok)throw Error('Audio unavailable');const data=await context.decodeAudioData(await r.arrayBuffer());buffer=data;button.dataset.duration=data.duration;return data;}catch{}
   }
   loading=null;throw Error('Audio unavailable');
  })();
  return loading;
 }
 function stop(){
  wanted=false;pending=false;attempt++;
  if(source){
   offset=(offset+context.currentTime-started)%buffer.duration;
   const old=source;source=null;
   gain.gain.cancelScheduledValues(context.currentTime);gain.gain.setValueAtTime(gain.gain.value,context.currentTime);gain.gain.linearRampToValueAtTime(0,context.currentTime+.08);
   old.stop(context.currentTime+.09);old.onended=()=>{old.disconnect();if(!source&&!wanted)context.suspend();};
  }
  update();
 }
 button.addEventListener('click',async()=>{
  if(wanted||source){stop();return;}
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio){status.textContent='当前浏览器不支持背景音乐播放。';return;}
  const current=++attempt;wanted=true;pending=true;status.textContent='';
  try{
   if(!context){context=new Audio();gain=context.createGain();gain.gain.value=0;gain.connect(context.destination);button.dataset.gain='0.25';}
   // Resume directly from the click; never attempt audible autoplay on page load.
   await context.resume();update();const data=await load();
   if(current!==attempt||!wanted||!home()||document.hidden)return;
   await context.resume();if(current!==attempt||!wanted||!home()||document.hidden)return;
   source=context.createBufferSource();source.buffer=data;source.loop=true;source.connect(gain);
   gain.gain.cancelScheduledValues(context.currentTime);gain.gain.setValueAtTime(0,context.currentTime);gain.gain.linearRampToValueAtTime(.25,context.currentTime+.12);
   started=context.currentTime;source.start(started,offset%data.duration);
  }catch{if(current===attempt){wanted=false;status.textContent='音乐暂时无法加载，请再次点击重试。';}}
  finally{if(current===attempt){pending=false;update();}}
 });
 window.addEventListener('hashchange',()=>{if(!home())stop();update();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 update();
})();
