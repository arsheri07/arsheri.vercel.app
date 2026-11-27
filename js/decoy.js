/* ---------- v8: Canary decoy demo, stat counters ---------- */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s){return document.querySelector(s);}

  // Canary decoys: a folder walker encrypts files in name order. With decoys
  // planted, it reaches a "!_" file first; one encrypted decoy scores 50+25
  // (CRITICAL) by itself, the same rule as detect.py signal 7. Without them,
  // only the entropy signal fires (3+ files: 25 points, SUSPICIOUS) and every
  // file is gone before anything looks critical.
  (function(){var ul=$('#decoyFiles');if(!ul)return;
    var tog=$('#decoyToggle'),run=$('#decoyRun'),rst=$('#decoyReset'),sc=$('#decoyScore'),vd=$('#decoyVerdict'),note=$('#decoyNote');
    var real=['budget.txt','essay_draft.txt','lease.txt','notes.txt','recipes.txt','resume.txt','taxes_2025.txt'];
    var decoys=['!_Bank_statements_2026.txt','!_Passwords_backup.txt'];
    var timer=null,files=[];
    function label(n){return n>=70?'critical':n>=40?'high':n>=20?'suspicious':'normal';}
    function build(){clearTimeout(timer);timer=null;run.disabled=false;
      var planted=tog.getAttribute('aria-pressed')==='true';
      tog.textContent=planted?'decoys planted':'no decoys';
      files=(planted?decoys:[]).concat(real).sort().map(function(n){return {n:n,decoy:n.indexOf('!_')===0,enc:false};});
      ul.innerHTML='';files.forEach(function(f){var li=document.createElement('li');li.className=f.decoy?'decoy':'';
        li.innerHTML='<span class="nm"></span><span class="st"></span>';li.firstChild.textContent=f.n;li.firstChild.title=f.n;li.lastChild.textContent=f.decoy?'decoy':'ok';f.el=li;ul.appendChild(li);});
      show(0,planted?'two decoys sort first, before your real files':'only real files: Canary has to wait for the damage to add up');}
    function show(n,msg){sc.textContent=n;var l=label(n);vd.textContent=l;vd.classList.toggle('bad',n>=20);note.textContent=msg?'— '+msg:'';}
    function score(){var encReal=files.filter(function(f){return f.enc&&!f.decoy;}).length,n=0;
      if(encReal>=10)n+=40;else if(encReal>=3)n+=25;
      if(files.some(function(f){return f.enc&&f.decoy;}))n+=75;return Math.min(100,n);}
    function step(i){
      if(i>=files.length){var n=score();show(n,'all '+real.length+' real files encrypted; too few for the volume signals to say CRITICAL');run.disabled=false;return;}
      var f=files[i];f.enc=true;f.el.classList.add('enc');f.el.lastChild.textContent='encrypted';
      var n=score();
      if(n>=70){f.el.classList.add('trip');
        var safe=files.filter(function(x){return !x.enc&&!x.decoy;}).length;
        show(n,'decoy touched after '+(i+1)+' file. '+safe+' of '+real.length+' real files untouched (demo checks after every file; the CLI checks every --interval)');
        run.disabled=false;return;}
      show(n,'encrypting '+f.n+'…');
      timer=setTimeout(function(){step(i+1);},reduce?0:420);}
    run.addEventListener('click',function(){build();run.disabled=true;step(0);});
    rst.addEventListener('click',build);
    tog.addEventListener('click',function(){tog.setAttribute('aria-pressed',tog.getAttribute('aria-pressed')==='true'?'false':'true');build();});
    build();})();

  // stat tiles count up once when they scroll into view
  (function(){var els=[].slice.call(document.querySelectorAll('.stat b[data-count]'));
    if(reduce||!els.length||!('IntersectionObserver' in window))return;
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;io.unobserve(en.target);
      var b=en.target,to=+b.dataset.count,t0=performance.now();
      (function tick(t){var p=Math.min(1,(t-t0)/900);b.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);})(t0);});},{threshold:.6});
    els.forEach(function(b){io.observe(b);});})();
})();
