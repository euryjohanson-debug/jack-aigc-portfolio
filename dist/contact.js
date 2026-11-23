(() => {
 let modal;
 function createContactModal(){
  const el=document.createElement('dialog');
  el.className='contact-modal';el.setAttribute('aria-labelledby','contact-modal-title');
  el.innerHTML=`<button type="button" class="close" aria-label="关闭联系方式">×</button><span class="chip">LET’S CONNECT</span><h2 id="contact-modal-title">联系裴继豪 · PEI</h2><p class="contact-modal-intro">欢迎交流工作机会与创意项目。</p><div class="contact-row"><span>手机</span><a href="tel:+8613930105226">+86 13930105226</a></div><div class="contact-row"><span>电子邮箱</span><div class="contact-values"><a href="mailto:1650328357@qq.com">1650328357@qq.com</a><a href="mailto:peijihao2016@163.com">peijihao2016@163.com</a></div></div><div class="contact-row"><span>所在城市</span><span>北京 · 朝阳区</span></div><div class="contact-row"><span>作品平台</span><a href="https://space.bilibili.com/502161998" target="_blank" rel="noopener noreferrer">Bilibili 个人主页</a></div>`;
  el.querySelector('.close').onclick=()=>el.close();
  el.addEventListener('click',e=>{if(e.target===el){const r=el.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)el.close();}});
  document.body.append(el);return el;
 }
 document.addEventListener('click',e=>{if(!e.target.closest('[data-contact-open]'))return;modal??=createContactModal();if(!modal.open)modal.showModal();});
})();
