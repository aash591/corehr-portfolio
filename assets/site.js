(function(){
'use strict';
document.documentElement.classList.remove('no-js');

// Settings live in assets/config.js (window.COREHR_CONFIG).
var SETTINGS=window.COREHR_CONFIG||{},CONTACT=SETTINGS.contact||{},FORM=SETTINGS.form||{};
var CONFIG={phone:CONTACT.phone||'',whatsapp:CONTACT.whatsapp,whatsappMessage:CONTACT.whatsappMessage||'',email:CONTACT.email||'',formProvider:FORM.provider||'',web3formsKey:FORM.web3formsKey||'',formspreeId:FORM.formspreeId||'',formEndpoint:FORM.endpoint||'',formExtra:FORM.extraFields||{},fromName:FORM.fromName||'Core HR Management — website'};
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

// Apply contact settings to the page links; the HTML values stay as the no-JS fallback.
$$('a[href^="tel:"]').forEach(function(a){if(!CONFIG.phone)return;a.href='tel:'+CONFIG.phone.replace(/[^\d+]/g,'');var b=a.querySelector('b');if(b)b.textContent=CONFIG.phone});
$$('a[href^="mailto:"]').forEach(function(a){if(!CONFIG.email)return;a.href='mailto:'+CONFIG.email;var b=a.querySelector('b');if(b)b.textContent=CONFIG.email});
if(!CONFIG.email){var m=$('a[href^="mailto:"]');if(m)CONFIG.email=m.getAttribute('href').slice(7).split('?')[0]}
$$('a[href^="https://wa.me/"]').forEach(function(a){
  if(CONFIG.whatsapp===undefined)return;
  var n=String(CONFIG.whatsapp).replace(/\D/g,'');
  if(!n){a.remove();return}
  a.href='https://wa.me/'+n+(CONFIG.whatsappMessage?'?text='+encodeURIComponent(CONFIG.whatsappMessage):'');
});

var year=$('#year');
if(year)year.textContent=new Date().getFullYear();

var nav=$('#nav'),menuBtn=$('#menuBtn');
if(nav&&menuBtn){
  menuBtn.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',open?'true':'false');
  });
  $$('.links a').forEach(function(a){
    a.addEventListener('click',function(){
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('click',function(e){
    if(nav.classList.contains('open')&&!nav.contains(e.target)){
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
    }
  });
}

var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var revealEls=$$('.reveal');

/* Progressive reveal: CSS stays visible by default. JavaScript opts elements into
   animation only after this file has successfully loaded, so a JS failure can
   never leave the page blank. */
if(!reduced&&'IntersectionObserver' in window){
  revealEls.forEach(function(el){
    el.style.setProperty('opacity','0','important');
    el.style.setProperty('transform','translateY(18px)','important');
  });
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        e.target.style.setProperty('opacity','1','important');
        e.target.style.setProperty('transform','none','important');
        io.unobserve(e.target);
      }
    });
  },{rootMargin:'0px 0px -35px 0px',threshold:.08});
  revealEls.forEach(function(el){io.observe(el)});

  /* Initial viewport safety pass for browsers that delay IntersectionObserver. */
  requestAnimationFrame(function(){
    revealEls.forEach(function(el){
      var r=el.getBoundingClientRect();
      if(r.top<(window.innerHeight||document.documentElement.clientHeight)*.96&&r.bottom>0){
        el.classList.add('in');
        el.style.setProperty('opacity','1','important');
        el.style.setProperty('transform','none','important');
        io.unobserve(el);
      }
    });
  });
}else{
  revealEls.forEach(function(el){el.classList.add('in')});
}

var journey=$('#journey'),journeySteps=$$('.journey-step');
function updateJourney(){
  if(!journey)return;
  var r=journey.getBoundingClientRect(),vh=window.innerHeight||document.documentElement.clientHeight;
  var start=vh*.78,end=vh*.22;
  var p=(start-r.top)/(r.height+start-end);
  p=Math.max(0,Math.min(1,p));
  journey.style.setProperty('--journey-progress',p.toFixed(3));
  journeySteps.forEach(function(step,i){
    var threshold=i/(Math.max(1,journeySteps.length-1));
    step.classList.toggle('is-active',p>=threshold-.05);
  });
}
if(journey){
  if(reduced){
    journey.style.setProperty('--journey-progress','1');
    journeySteps.forEach(function(s){s.classList.add('is-active')});
  }else{
    updateJourney();
    window.addEventListener('scroll',updateJourney,{passive:true});
    window.addEventListener('resize',updateJourney,{passive:true});
  }
}

$$('.faq-q').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=btn.closest('.faq-item'),open=item.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.lastElementChild.textContent=open?'−':'+';
  });
});

$$('[data-service]').forEach(function(a){
  a.addEventListener('click',function(){
    var v=a.getAttribute('data-service'),box=document.querySelector('input[name="service"][value="'+v+'"]');
    if(box)box.checked=true;
  });
});

function subject(d){return'Website enquiry — '+(d.service||'General')+(d.company?' — '+d.company:'')}
function mailto(d){return'mailto:'+CONFIG.email+'?subject='+encodeURIComponent(subject(d))+'&body='+encodeURIComponent('Name: '+d.name+'\nCompany: '+d.company+'\nPhone: '+d.phone+'\nEmail: '+d.email+'\nEmployees: '+d.employees+'\nNeeds: '+d.service+'\n\nMessage:\n'+d.message)}
function request(d){
  var p={},provider=String(CONFIG.formProvider||'').toLowerCase();
  Object.keys(d).forEach(function(k){p[k]=d[k]});
  Object.keys(CONFIG.formExtra||{}).forEach(function(k){p[k]=CONFIG.formExtra[k]});
  p.subject=subject(d);p.page=location.href;
  if(provider==='web3forms'&&CONFIG.web3formsKey){
    p.access_key=CONFIG.web3formsKey;p.from_name=CONFIG.fromName;p.replyto=d.email||'';p.botcheck='';
    return{url:'https://api.web3forms.com/submit',payload:p};
  }
  if(provider==='formsubmit'&&CONFIG.email){p._subject=p.subject;p._template='table';p._captcha='false';return{url:'https://formsubmit.co/ajax/'+encodeURIComponent(CONFIG.email),payload:p}}
  if(provider==='formspree'&&CONFIG.formspreeId){p._subject=p.subject;return{url:'https://formspree.io/f/'+CONFIG.formspreeId,payload:p}}
  if(provider==='custom'&&CONFIG.formEndpoint)return{url:CONFIG.formEndpoint,payload:p};
  return null;
}

var form=$('#contactForm'),status=$('#formStatus'),submit=$('#submitBtn'),success=$('#formSuccess');
if(form&&status&&submit&&success){
  form.addEventListener('submit',async function(e){
    e.preventDefault();status.textContent='';
    var gotcha=form.querySelector('[name="_gotcha"]');if(gotcha&&gotcha.value)return;
    var selected=$$('input[name="service"]:checked').map(function(x){return x.value});
    if(!form.checkValidity()){form.reportValidity();return}
    if(!selected.length){status.textContent='Please choose at least one service.';return}
    var d={name:$('#name').value.trim(),company:$('#company').value.trim(),phone:$('#phone').value.trim(),email:$('#email').value.trim(),employees:$('#employees').value,service:selected.join(', '),message:$('#message').value.trim()};
    var r=request(d);submit.disabled=true;submit.textContent='Sending…';
    try{
      if(!r)throw new Error('No provider');
      var res=await fetch(r.url,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(r.payload)});
      if(!res.ok)throw new Error('Submit failed');
      form.hidden=true;success.hidden=false;
    }catch(err){
      status.innerHTML='Could not send automatically. <a href="'+mailto(d)+'">Send this enquiry by email instead →</a>';
    }finally{
      submit.disabled=false;submit.innerHTML='Send enquiry <span>→</span>';
    }
  });
  var again=$('#againBtn');
  if(again)again.addEventListener('click',function(){success.hidden=true;form.hidden=false;form.reset();status.textContent=''});
}
})();