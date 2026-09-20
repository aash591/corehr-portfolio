(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

var grid=$('#kbGrid');
if(!grid)return;

var cards=$$('.kb-card',grid);
var input=$('#kbSearch');
var chips=$$('.kb-chip');
var count=$('#kbCount');
var empty=$('#kbEmpty');
var activeCategory='all';

function apply(){
  var q=(input&&input.value||'').trim().toLowerCase();
  var shown=0;
  cards.forEach(function(card){
    var cat=card.getAttribute('data-category')||'';
    var text=card.getAttribute('data-search')||'';
    var matchesCategory=activeCategory==='all'||cat===activeCategory;
    var matchesQuery=!q||text.indexOf(q)!==-1;
    var visible=matchesCategory&&matchesQuery;
    card.hidden=!visible;
    if(visible)shown++;
  });
  if(count)count.textContent=shown+(shown===1?' article':' articles');
  if(empty)empty.classList.toggle('is-visible',shown===0);
}

if(input)input.addEventListener('input',apply);

chips.forEach(function(chip){
  chip.addEventListener('click',function(){
    activeCategory=chip.getAttribute('data-filter')||'all';
    chips.forEach(function(c){c.classList.toggle('is-active',c===chip)});
    apply();
    if(history.replaceState)history.replaceState(null,'',activeCategory==='all'?location.pathname:'?category='+activeCategory);
  });
});

var params=new URLSearchParams(location.search);
var fromUrl=params.get('category');
if(fromUrl&&chips.some(function(c){return c.getAttribute('data-filter')===fromUrl})){
  activeCategory=fromUrl;
  chips.forEach(function(c){c.classList.toggle('is-active',c.getAttribute('data-filter')===fromUrl)});
}
apply();
})();
