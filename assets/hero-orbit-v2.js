(function(){
  'use strict';

  var desk=document.querySelector('.hero .hero-desk');
  if(!desk)return;
  var cards=Array.prototype.slice.call(desk.querySelectorAll('[data-orbit-card]'));
  if(!cards.length)return;

  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  desk.classList.add('orbit-js');

  var start=performance.now();
  var duration=54000;
  var focusAngle=-Math.PI/2;
  var lastW=0;
  var radius=185;

  function wrap(a){
    while(a>Math.PI)a-=Math.PI*2;
    while(a<-Math.PI)a+=Math.PI*2;
    return a;
  }
  function smooth01(x){
    x=Math.max(0,Math.min(1,x));
    return x*x*(3-2*x);
  }
  function measure(){
    var w=desk.clientWidth;
    if(w===lastW)return;
    lastW=w;
    radius=w<=640?Math.min(120,Math.max(104,(w-116)/2-4)):Math.min(190,Math.max(150,(w-170)/2-8));
    desk.style.setProperty('--orbit-radius',radius+'px');
  }
  function paint(now){
    measure();
    var base=reduce?0:((now-start)%duration)/duration*Math.PI*2;
    cards.forEach(function(card,i){
      var phase=base+(i/cards.length)*Math.PI*2+focusAngle;
      /* Ease the angular speed near the top focus point without stopping the whole orbit. */
      var angle=phase-.23*Math.sin(phase-focusAngle);
      var d=Math.abs(wrap(angle-focusAngle));
      var focus=smooth01(1-Math.min(1,d/(Math.PI/5.2)));
      var x=Math.cos(angle)*radius;
      var y=Math.sin(angle)*radius;
      var jiggle=reduce?0:Math.sin(now/1050+i*1.73)*1.15;
      var float=reduce?0:Math.sin(now/1450+i*2.11)*1.6;
      var scale=1+focus*.20;
      card.style.transform='translate(-50%,-50%) translate3d('+x.toFixed(2)+'px,'+(y+float).toFixed(2)+'px,0) scale('+scale.toFixed(3)+') rotate('+jiggle.toFixed(2)+'deg)';
      card.style.zIndex=String(4+Math.round(focus*8));
      card.style.setProperty('--focus',focus.toFixed(3));
      var more=card.querySelector('.orbit-more');
      if(more){
        more.style.opacity=focus.toFixed(3);
        more.style.maxHeight=(focus*14).toFixed(1)+'px';
        more.style.marginTop=(focus*2).toFixed(1)+'px';
      }
      card.classList.toggle('is-focus',focus>.58);
    });
    if(!reduce)requestAnimationFrame(paint);
  }

  paint(start);
  window.addEventListener('resize',measure,{passive:true});
})();
