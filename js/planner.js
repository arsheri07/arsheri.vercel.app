/* ---------- v7: meal planner, re-run checks, quick jump, back to top ---------- */
(function(){
  function $(s){return document.querySelector(s);}
  function $$(s){return [].slice.call(document.querySelectorAll(s));}
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // KitchenSense: allergies remove recipes (hard filter); preferences only reorder (soft rank)
  (function(){var list=$('#mealList');if(!list)return;
    var recipes=[
      {n:'Chicken stir-fry',a:[],veg:0,quick:1,spicy:1,base:5},
      {n:'Mac and cheese',a:['dairy','gluten'],veg:1,quick:1,spicy:0,base:6},
      {n:'Peanut noodles',a:['peanuts','gluten'],veg:1,quick:1,spicy:1,base:7},
      {n:'Black bean tacos',a:[],veg:1,quick:1,spicy:1,base:4},
      {n:'Salmon and rice',a:[],veg:0,quick:0,spicy:0,base:5},
      {n:'Veggie lasagna',a:['dairy','gluten'],veg:1,quick:0,spicy:0,base:3}];
    var out=$('#mealOut'),last=[];
    function on(sel){return $$(sel+' .vtog[aria-pressed="true"]').map(function(b){return b.dataset.a||b.dataset.p;});}
    function render(){var al=on('#allergyPick'),pr=on('#prefPick');
      var keep=[],gone=[];
      recipes.forEach(function(r){var hit=r.a.filter(function(x){return al.indexOf(x)>=0;});
        if(hit.length)gone.push({r:r,why:'contains '+hit.join(' + ')});
        else{var s=r.base;pr.forEach(function(p){if(r[p])s+=4;});keep.push({r:r,s:s});}});
      keep.sort(function(x,y){return y.s-x.s;});
      list.innerHTML='';
      keep.forEach(function(k,i){var li=document.createElement('li');
        var tags=[];if(k.r.veg)tags.push('veg');if(k.r.quick)tags.push('quick');if(k.r.spicy)tags.push('spicy');
        li.innerHTML='<span class="nm"></span><span class="tg"></span>';li.firstChild.textContent=k.r.n;li.lastChild.textContent=tags.join(' · ')||'—';
        if(last.length&&last.indexOf(k.r.n)!==i&&!reduce)li.classList.add('moved');list.appendChild(li);});
      gone.forEach(function(g){var li=document.createElement('li');li.className='out';
        li.innerHTML='<span class="nm"></span><span class="tg"></span>';li.firstChild.textContent=g.r.n;li.lastChild.textContent='removed · '+g.why;list.appendChild(li);});
      last=keep.map(function(k){return k.r.n;});
      out.textContent=keep.length+' of '+recipes.length+' recipes safe to cook'+(gone.length?' · '+gone.length+' removed by allergy filter':'')+(pr.length?' · ranked by your preferences':'');}
    $$('#allergyPick .vtog, #prefPick .vtog').forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');render();});});
    render();})();

  // re-run the Authentication-Results checks
  (function(){var b=$('#rerun');if(!b)return;
    b.addEventListener('click',function(){var vs=$$('[data-verdict]');
      vs.forEach(function(v){v.textContent='····';v.classList.add('pending');});
      vs.forEach(function(v,i){setTimeout(function(){v.textContent='pass';v.classList.remove('pending');},reduce?0:300+i*280);});});})();

  // back to top
  (function(){var b=$('#toTop');if(!b)return;
    window.addEventListener('scroll',function(){b.classList.toggle('show',window.scrollY>900);},{passive:true});
    b.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});});})();

  // quick jump: press "/" (or click "/ jump") to search sections, projects, and roles
  (function(){var box=$('#jump'),inp=$('#jumpInput'),ul=$('#jumpList');if(!box)return;
    var items=[];
    $$('section[id]').forEach(function(s){var l=s.querySelector('.sect-label');if(l)items.push({t:l.childNodes[0].textContent.trim(),k:'section',el:s});});
    $$('.project[id]').forEach(function(p){items.push({t:p.dataset.name||p.id,k:'project',el:p});});
    $$('.role[id]').forEach(function(r){var tt=r.querySelector('.role-title');items.push({t:(tt?tt.textContent:'').trim()+' · '+(r.dataset.name||''),k:'experience',el:r});});
    var shown=[],sel=0;
    function draw(){var q=inp.value.toLowerCase().trim();shown=items.filter(function(i){return !q||i.t.toLowerCase().indexOf(q)>=0||i.k.indexOf(q)===0;});
      sel=Math.min(sel,Math.max(0,shown.length-1));ul.innerHTML='';
      shown.forEach(function(i,n){var li=document.createElement('li');li.setAttribute('role','option');li.setAttribute('aria-selected',n===sel?'true':'false');
        li.textContent=i.t;var sp=document.createElement('span');sp.textContent=i.k;li.appendChild(sp);
        li.addEventListener('click',function(){go(i);});ul.appendChild(li);});
      if(!shown.length){var li=document.createElement('li');li.textContent='No matches';ul.appendChild(li);}}
    function go(i){close();var col=i.el.querySelector&&i.el.closest('.collapsible');
      i.el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});}
    function open(){box.classList.add('open');inp.value='';sel=0;draw();setTimeout(function(){inp.focus();},20);}
    function close(){box.classList.remove('open');}
    var jb=$('#jumpBtn');if(jb)jb.addEventListener('click',open);
    box.addEventListener('click',function(e){if(e.target===box)close();});
    inp.addEventListener('input',function(){sel=0;draw();});
    inp.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,shown.length-1);draw();}
      else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0);draw();}
      else if(e.key==='Enter'){e.preventDefault();if(shown[sel])go(shown[sel]);}
      else if(e.key==='Escape'){close();}});
    document.addEventListener('keydown',function(e){var typing=/input|textarea|select/i.test(e.target.tagName||'');
      if((e.metaKey||e.ctrlKey)&&(e.key==='k'||e.key==='K')){e.preventDefault();box.classList.contains('open')?close():open();}
      else if(!typing&&e.key==='/'&&!e.metaKey&&!e.ctrlKey){e.preventDefault();open();}
      else if(e.key==='Escape'&&box.classList.contains('open'))close();});})();
})();
