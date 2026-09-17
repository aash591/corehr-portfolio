(function(){
  'use strict';

  var desk=document.querySelector('.hero .hero-desk');
  if(!desk)return;
  var cards=Array.prototype.slice.call(desk.querySelectorAll('[data-orbit-card]'));
  if(!cards.length)return;

  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var icons=[
    '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h4"/><circle cx="17" cy="16" r="3"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h5"/><path d="M8 7h4"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6M9 18h4"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><circle cx="5" cy="9" r="2"/><circle cx="19" cy="9" r="2"/><path d="M7 20v-3c0-3 2-5 5-5s5 2 5 5v3M2 19v-2c0-2 1-4 3-4M22 19v-2c0-2-1-4-3-4"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3 9-8 11-5-2-8-6-8-11V5z"/><path d="M8.5 12l2.2 2.2 4.8-5"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M4 19V9M9 19V5M14 19v-8M19 19V3"/><path d="M2 19h20"/></svg>'
  ];

  cards.forEach(function(card,i){
    var text=card.querySelector(':scope > span');
    if(text&&!text.querySelector('.orbit-icon')){
      var icon=document.createElement('span');
      icon.className='orbit-icon';
      icon.setAttribute('aria-hidden','true');
      icon.innerHTML=icons[i]||icons[0];
      text.insertBefore(icon,text.firstChild);
    }
  });

  desk.classList.add('orbit-js');
  var start=performance.now();
  var duration=56000;
  var focusAngle=-0.20;
  var lastW=0;
  var radius=185;
  /* Keeps the initial arrangement identical to the reference: Payroll top, PF upper-right,
     PT lower-right, Compliance bottom, HR lower-left, Registrations upper-left. */
  var slots=[0,1,2,5,3,4];

  function wrap(a){while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a}
  function smooth01(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)}
  function measure(){
    var w=desk.clientWidth;
    if(w===lastW)return;
    lastW=w;
    radius=w<=640?Math.min(124,Math.max(108,(w-118)/2-3)):Math.min(194,Math.max(158,(w-180)/2-7));
    desk.style.setProperty('--orbit-radius',radius+'px');
    desk.style.setProperty('--orbit-diameter',(radius*2)+'px');
  }
  function paint(now){
    measure();
    var base=reduce?0:((now-start)%duration)/duration*Math.PI*2;
    cards.forEach(function(card,i){
      var slot=slots[i]===undefined?i:slots[i];
      var phase=base+(slot/cards.length)*Math.PI*2-Math.PI/2;
      var angle=phase-.18*Math.sin(phase-focusAngle);
      var d=Math.abs(wrap(angle-focusAngle));
      var focus=smooth01(1-Math.min(1,d/(Math.PI/5.5)));
      /* Card proportions continuously change with orbital position: compact on the left,
         broad and prominent as they move into the right-hand focus zone. */
      var side=smooth01((Math.cos(angle)+1)/2);
      var x=Math.cos(angle)*radius;
      var y=Math.sin(angle)*radius;
      var jiggle=reduce?0:Math.sin(now/1150+i*1.67)*0.9;
      var float=reduce?0:Math.sin(now/1550+i*2.03)*1.4;
      var scale=1+focus*.09;
      card.style.setProperty('--shape',side.toFixed(3));
      card.style.setProperty('--focus',focus.toFixed(3));
      card.style.transform='translate(-50%,-50%) translate3d('+x.toFixed(2)+'px,'+(y+float).toFixed(2)+'px,0) scale('+scale.toFixed(3)+') rotate('+jiggle.toFixed(2)+'deg)';
      card.style.zIndex=String(4+Math.round(focus*10));
      var more=card.querySelector('.orbit-more');
      if(more){
        more.style.opacity=focus.toFixed(3);
        more.style.maxHeight=(focus*16).toFixed(1)+'px';
        more.style.marginTop=(focus*2).toFixed(1)+'px';
      }
      card.classList.toggle('is-focus',focus>.48);
    });
    if(!reduce)requestAnimationFrame(paint);
  }

  paint(start);
  window.addEventListener('resize',function(){lastW=0;measure()},{passive:true});
})();
