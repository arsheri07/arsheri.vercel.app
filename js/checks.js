// Headshot: drop the frame if the image can't load (was an inline onerror, removed for the CSP).
(function(){var img=document.getElementById('headshot');if(!img)return;
  function gone(){var f=img.closest('figure');if(f)f.remove();}
  if(img.complete&&img.naturalWidth===0)gone();else img.addEventListener('error',gone);})();
// Resolve the Authentication-Results block on load: each check flips
// from pending to pass in sequence. Mirrors how a real verifier reports.
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rows = document.querySelectorAll('[data-verdict]');
  if (reduce) {
    rows.forEach(function(r){ r.textContent = 'pass'; r.classList.remove('pending'); });
    return;
  }
  rows.forEach(function(r, i){
    setTimeout(function(){
      r.textContent = 'pass';
      r.classList.remove('pending');
    }, 420 + i * 260);
  });
})();


// ---------- document lightbox ----------
(function(){
  const lb = document.getElementById('lb');
  if (!lb) return;
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  let lastFocus = null;

  function open(src, caption, trigger){
    lastFocus = trigger;
    img.src = src;
    img.alt = caption;
    cap.textContent = caption;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  }
  function close(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.doc').forEach(function(b){
    b.addEventListener('click', function(){
      open(b.dataset.src, b.dataset.caption, b);
    });
  });

  document.getElementById('lbClose').addEventListener('click', close);
  // clicking the backdrop closes; clicking the image itself does not
  lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();

// A missing document file shouldn't leave a broken image icon on the page -
// hide the whole card instead, so the section degrades cleanly.
document.querySelectorAll('.doc img').forEach(function(im){
  im.addEventListener('error', function(){
    const card = im.closest('.doc');
    if (card) card.style.display = 'none';
  });
});

// ================= interactive layer =================
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(id){var t=document.getElementById(id);if(!t)return;
    t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
    t.classList.remove('spot');void t.offsetWidth;t.classList.add('spot');}

  // 1) reading progress + active nav link
  var bar=document.getElementById('progressBar');
  var links=[].slice.call(document.querySelectorAll('.navlinks a[href^="#"]'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function onScroll(){
    var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
    if(bar)bar.style.width=(max>0?h.scrollTop/max*100:0)+'%';
    var cur=-1;secs.forEach(function(sec,i){if(sec&&sec.getBoundingClientRect().top<140)cur=i;});
    links.forEach(function(a,i){a.classList.toggle('active',i===cur);});
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // 2) hero rows jump to their section
  var map={education:'credentials',shipped:'work',experience:'experience',credentials:'credentials'};
  document.querySelectorAll('.auth-row').forEach(function(r){
    var k=(r.querySelector('.auth-key')||{}).textContent||'';k=k.split('=')[0].trim();
    if(!map[k])return;
    r.classList.add('is-link');r.tabIndex=0;r.setAttribute('role','link');
    r.setAttribute('aria-label','Go to '+map[k]);
    r.addEventListener('click',function(){go(map[k]);});
    r.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go(map[k]);}});
  });

  // 3) project filters
  var projects=[].slice.call(document.querySelectorAll('.project[data-tags]'));
  var workLabel=document.querySelector('#work .sect-label');
  if(projects.length&&workLabel){
    var opts=[['all','All'],['security','Security'],['fullstack','Full-stack'],['ai','AI']];
    var bar2=document.createElement('div');bar2.className='filters';bar2.setAttribute('role','group');bar2.setAttribute('aria-label','Filter projects');
    opts.forEach(function(o){
      var n=o[0]==='all'?projects.length:projects.filter(function(p){return p.dataset.tags.split(' ').indexOf(o[0])>-1;}).length;
      var b=document.createElement('button');b.type='button';b.className='fbtn';b.dataset.f=o[0];
      b.setAttribute('aria-pressed',o[0]==='all'?'true':'false');b.innerHTML=o[1]+'<span class="n">'+n+'</span>';
      b.addEventListener('click',function(){
        bar2.querySelectorAll('.fbtn').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
        projects.forEach(function(p){
          var show=o[0]==='all'||p.dataset.tags.split(' ').indexOf(o[0])>-1;
          var was=!p.classList.contains('filtered-out');
          p.classList.toggle('filtered-out',!show);
          if(show&&!was){p.classList.remove('fade-in');void p.offsetWidth;p.classList.add('fade-in');}
        });
      });
      bar2.appendChild(b);
    });
    workLabel.insertAdjacentElement('afterend',bar2);
  }

  // 4) project write-ups: decision stays visible, the long write-up + walkthrough fold away
  projects.forEach(function(p,idx){
    var w=p.querySelector('.writeup'),d=p.querySelector('.decision'),demo=p.querySelector('.demo');
    if(!w)return;
    if(d)w.parentNode.insertBefore(d,w);
    var wrap=document.createElement('div');wrap.className='collapsible';wrap.id='more-'+p.id;
    var inner=document.createElement('div');wrap.appendChild(inner);
    w.parentNode.insertBefore(wrap,w);inner.appendChild(w);if(demo)inner.appendChild(demo);
    var btn=document.createElement('button');btn.type='button';btn.className='more-btn';
    btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls',wrap.id);
    var label=demo?'Read the full write-up + walkthrough':'Read the full write-up';
    btn.innerHTML='<span class="t">'+label+'</span><span class="chev">↓</span>';
    wrap.parentNode.insertBefore(btn,wrap);
    btn.addEventListener('click',function(){
      var open=wrap.classList.toggle('open');btn.setAttribute('aria-expanded',open);
      btn.querySelector('.t').textContent=open?'Show less':label;
    });
  });

  // 5) experience: first two bullets visible, rest on demand
  var roles=[].slice.call(document.querySelectorAll('#experience .role'));
  var toggles=[];
  roles.forEach(function(r){
    var lis=r.querySelectorAll('ul li');if(lis.length<=3)return;
    for(var i=2;i<lis.length;i++)lis[i].classList.add('extra');
    var b=document.createElement('button');b.type='button';b.className='more-btn';b.setAttribute('aria-expanded','false');
    var more='+'+(lis.length-2)+' more';
    b.innerHTML='<span class="t">'+more+'</span><span class="chev">↓</span>';
    r.querySelector('ul').insertAdjacentElement('afterend',b);
    function set(open){r.classList.toggle('expanded',open);b.setAttribute('aria-expanded',open);b.querySelector('.t').textContent=open?'Show less':more;}
    b.addEventListener('click',function(){set(!r.classList.contains('expanded'));});
    toggles.push(set);
  });
  var expLabel=document.querySelector('#experience .sect-label span');
  if(expLabel&&toggles.length){
    var all=document.createElement('button');all.type='button';all.className='mini-btn';all.textContent='expand all';
    var on=false;all.addEventListener('click',function(){on=!on;toggles.forEach(function(t){t(on);});all.textContent=on?'collapse all':'expand all';});
    expLabel.textContent='';expLabel.appendChild(all);
  }

  // 6) skills: click one to see where it was used
  var used={
    'Python':['credential-leak-scanner','canary','phishing-risk-analyzer','aa-role'],'JavaScript':['kitchensense'],'TypeScript':['kitchensense'],'SQL':['kitchensense'],'Linux':['canary','kitchensense'],
    'Pandas':['aa-role'],'NumPy':['aa-role'],'time-series forecasting':['aa-role'],'regression':['aa-role'],
    'Node.js':['kitchensense'],'Flask':['phishing-risk-analyzer'],'PostgreSQL':['kitchensense'],'REST APIs':['kitchensense'],'Zerops':['kitchensense'],
    'Cryptography':['canary','phishing-risk-analyzer'],'Regex':['credential-leak-scanner'],'SPF/DKIM/DMARC':['phishing-risk-analyzer'],
    'Claude API':['kitchensense'],'Claude Code':['kitchensense'],'Git':['credential-leak-scanner','kitchensense','canary'],'Salesforce':['hhs']
  };
  var techCol=[].slice.call(document.querySelectorAll('.cred-col')).filter(function(c){var h=c.querySelector('h3');return h&&/Technical/.test(h.textContent);})[0];
  if(techCol){
    var hint=document.createElement('p');hint.className='cred-hint';hint.textContent='Click a skill to see where I used it';
    techCol.querySelector('h3').insertAdjacentElement('afterend',hint);
    var active=null;
    techCol.querySelectorAll('li').forEach(function(li){
      var kv=li.querySelector('.kv');if(!kv)return;
      var panel=document.createElement('div');panel.className='used-in';panel.setAttribute('aria-live','polite');
      var parts=kv.textContent.split(' · ');kv.textContent='';
      parts.forEach(function(p,i){
        if(i)kv.appendChild(document.createTextNode(' · '));
        var ids=used[p.trim()];
        if(!ids){kv.appendChild(document.createTextNode(p));return;}
        var b=document.createElement('button');b.type='button';b.className='skill-btn';b.textContent=p;b.setAttribute('aria-pressed','false');
        b.addEventListener('click',function(){
          var same=active===b;
          if(active){active.setAttribute('aria-pressed','false');active._panel.classList.remove('show');}
          if(same){active=null;return;}
          active=b;b._panel=panel;b.setAttribute('aria-pressed','true');
          panel.innerHTML='Used in: ';
          ids.forEach(function(id){var t=document.getElementById(id);if(!t)return;
            var a=document.createElement('a');a.href='#'+id;a.textContent=(t.dataset.name||id)+' →';
            a.addEventListener('click',function(e){e.preventDefault();
              if(t.classList.contains('filtered-out')){var allBtn=document.querySelector('.fbtn[data-f="all"]');if(allBtn)allBtn.click();}
              go(id);});
            panel.appendChild(a);});
          panel.classList.add('show');
        });
        kv.appendChild(b);
      });
      li.appendChild(panel);
    });
  }
})();

// Scroll reveal
(function(){
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(e){ e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: .08 });
  els.forEach(function(e){ io.observe(e); });
})();
