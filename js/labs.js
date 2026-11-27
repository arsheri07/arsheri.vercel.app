/* ---------- v5: dark mode, labs, copy email ---------- */
(function(){
  var root=document.documentElement;
  function $(s){return document.querySelector(s);}
  function toast(m){var t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(toast.k);toast.k=setTimeout(function(){t.classList.remove('show');},1800);}

  // dark mode
  var tb=$('#themeBtn');
  function sync(){var d=root.getAttribute('data-theme')==='dark';tb.textContent=d?'light':'dark';tb.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');}
  if(tb){sync();tb.addEventListener('click',function(){var d=root.getAttribute('data-theme')!=='dark';
    if(d)root.setAttribute('data-theme','dark');else root.removeAttribute('data-theme');
    try{localStorage.setItem('theme',d?'dark':'light');}catch(e){}sync();});}

  // Canary: Shannon entropy of the bytes, the same signal the tool uses
  (function(){var ta=$('#entText');if(!ta)return;
    var fill=document.querySelector('[data-lab="entropy"] .fill'),num=$('#entNum'),ver=$('#entVerdict'),note=$('#entNote'),orig=ta.value;
    function H(b){if(!b.length)return 0;var c=new Array(256).fill(0);for(var i=0;i<b.length;i++)c[b[i]]++;var h=0;for(var j=0;j<256;j++)if(c[j]){var p=c[j]/b.length;h-=p*Math.log2(p);}return h;}
    function show(h){var hot=h>=7.5;num.textContent=h.toFixed(2);fill.style.width=(h/8*100)+'%';fill.classList.toggle('hot',hot);
      ver.textContent=hot?'fail':'pass';ver.classList.toggle('bad',hot);
      note.textContent=hot?'— looks encrypted; Canary would alert':(h>=6?'— unusually random for a document':'— looks like normal data');}
    function fromText(){ta.readOnly=false;show(H(new TextEncoder().encode(ta.value)));}
    ta.addEventListener('input',fromText);
    $('#entEncrypt').addEventListener('click',function(){var n=Math.max(4096,ta.value.length);var c=new Uint8Array(n);crypto.getRandomValues(c);
      var s='';for(var i=0;i<96;i++)s+=c[i].toString(16).padStart(2,'0')+(i%2?' ':'');ta.value=s+'…';ta.readOnly=true;show(H(c));});
    $('#entReset').addEventListener('click',function(){ta.value=orig;fromText();});
    fromText();})();

  // Credential Leak Scanner: the same rules + entropy filter as the CLI, run in the browser
  (function(){var ta=$('#secText');if(!ta)return;
    var cnt=$('#secCount'),ver=$('#secVerdict'),note=$('#secNote'),list=$('#secList');
    function rnd(n,a){var c=new Uint32Array(n);crypto.getRandomValues(c);var s='';for(var i=0;i<n;i++)s+=a[c[i]%a.length];return s;}
    var AN='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',UP='ABCDEFGHIJKLMNOPQRSTUVWXYZ0234567';
    var base='DEBUG = True\nDATABASE_URL = os.environ["DATABASE_URL"]\nAPI_KEY = "your-api-key-here"\nTIMEOUT = 30';
    var leaks=[function(){return 'AWS_ACCESS_KEY_ID = "'+'AK'+'IA'+rnd(16,UP)+'"';},
               function(){return 'GITHUB_TOKEN = "'+'gh'+'p_'+rnd(36,AN)+'"';},
               function(){return 'STRIPE_KEY = "'+'sk'+'_live_'+rnd(24,AN)+'"';},
               function(){return 'DB = "postgres://admin:'+rnd(14,AN)+'@db.internal/app"';}],li=0; // credscan: ignore (demo generator)
    var rules=[['AWS access key ID','high',/\b((?:AKIA|ASIA)[0-9A-Z]{16})\b/g,3],
      ['GitHub token','high',/\b(gh[pousr]_[A-Za-z0-9]{36,255})\b/g,3.5],
      ['Slack token','high',/\b(xox[abposr]-[A-Za-z0-9-]{10,72})\b/g,3],
      ['Stripe secret key','high',/\b((?:sk|rk)_live_[A-Za-z0-9]{20,99})\b/g,3.5],
      ['Google API key','high',/\b(AIza[0-9A-Za-z_\-]{35})\b/g,3.5],
      ['Private key','high',/(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/g,0],
      ['Password in connection string','high',/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^:\s\/]+:([^@\s\/]{6,})@/g,3],
      ['Hard-coded secret','medium',/\b(?:password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret)\b\s*[:=]\s*['"]([^'"\s]{8,})['"]/gi,3.5]];
    var hints=['example','sample','dummy','placeholder','changeme','your_','your-','<','xxxx','${','{','environ','getenv'];
    function H(s){var m={},h=0;for(var i=0;i<s.length;i++)m[s[i]]=(m[s[i]]||0)+1;for(var k in m){var p=m[k]/s.length;h-=p*Math.log2(p);}return h;}
    function red(s){return s.length<=8?'*'.repeat(s.length):s.slice(0,4)+'*'.repeat(Math.min(s.length-8,24))+s.slice(-4);}
    function scan(){var out=[];ta.value.split('\n').forEach(function(line,n){var seen={};
        rules.forEach(function(r){r[2].lastIndex=0;var m;while((m=r[2].exec(line))){var s=m[1];if(seen[s])continue;var e=H(s);
          if(r[3]&&e<r[3])continue;if(r[0]!=='Private key'&&hints.some(function(h){return s.toLowerCase().indexOf(h)>=0;}))continue;
          seen[s]=1;out.push({d:r[0],sev:r[1],line:n+1,m:red(s),e:e});}});});
      cnt.textContent=out.length;var bad=out.length>0;ver.textContent=bad?'fail':'pass';ver.classList.toggle('bad',bad);
      note.textContent=bad?'— commit blocked (exit code 1)':'— placeholders and env vars are ignored';
      list.innerHTML='';out.forEach(function(f){var li=document.createElement('li');
        var bb=document.createElement('b');bb.textContent=f.sev.toUpperCase();var sp=document.createElement('span');sp.className='m';sp.textContent='match: '+f.m+'  entropy: '+f.e.toFixed(2);
        li.append(bb,' '+f.d+' · line '+f.line,document.createElement('br'),sp);list.appendChild(li);});}
    ta.addEventListener('input',scan);
    $('#secLeak').addEventListener('click',function(){ta.value=ta.value.replace(/\s*$/,'')+'\n'+leaks[li++%leaks.length]();scan();});
    $('#secPlace').addEventListener('click',function(){ta.value=ta.value.replace(/\s*$/,'')+'\nPASSWORD = "changeme123"';scan();});
    $('#secReset').addEventListener('click',function(){ta.value=base;li=0;scan();});
    ta.value=base;scan();})();

  // Phishing Risk Analyzer: flip a verdict, watch the risk score respond
  (function(){var box=document.querySelector('[data-lab="mail"]');if(!box)return;
    var score=$('#mailScore'),ver=$('#mailVerdict'),why=$('#mailWhy'),bar=$('#mailBar'),from=$('#mailFrom');
    var btns=[].slice.call(box.querySelectorAll('.vtog'));
    function on(k){return box.querySelector('[data-k="'+k+'"]').getAttribute('aria-pressed')==='true';}
    function render(){var s=0,r=[];
      if(!on('spf')){s+=25;r.push('SPF failed');}if(!on('dkim')){s+=30;r.push('DKIM failed');}if(!on('dmarc')){s+=25;r.push('DMARC failed');}
      var look=on('look');if(look){s+=35;r.push('the domain imitates a real bank');}
      var homo=on('homo');if(homo){s+=40;r.push('a Cyrillic \u043e is posing as an o, so the authentication checks pass for the fake domain');}
      var disp=on('disp');if(disp){s+=25;r.push('the display name says Northbank but the address is on another domain');}
      var att=on('att');if(att){s+=40;r.push('the attachment is a program dressed up as a PDF');}s=Math.min(100,s);
      btns.forEach(function(b){var k=b.dataset.k,p=b.getAttribute('aria-pressed')==='true';
        if(k==='look'||k==='homo'||k==='disp'||k==='att'){b.textContent=p?'yes':'no';b.classList.toggle('bad',p);}else{b.textContent=p?'pass':'fail';b.classList.toggle('bad',!p);}});
      var addr=look?'billing@n0rthbank-secure.com':(homo?'billing@n\u043erthbank.com':(disp?'alerts@nb-mailer77.net':'billing@northbank.com'));
      from.textContent=disp?'Northbank Billing <'+addr+'>':addr;
      var at=document.getElementById('mailAttach');if(at)at.textContent=att?'statement.pdf.exe':'statement.pdf';
      score.textContent=s;bar.style.width=s+'%';bar.classList.toggle('hot',s>=30);
      ver.textContent=s>=60?'high':(s>=30?'suspicious':'low');ver.classList.toggle('bad',s>=30);
      why.textContent=r.length?'— '+(r.length>1?r.slice(0,-1).join(', ')+' and '+r[r.length-1]:r[0]):'— every check passed';}
    btns.forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');render();});});
    render();})();

  // copy email
  var cb=$('#copyEmail');
  if(cb)cb.addEventListener('click',function(){var a='akshithreddysheri@gmail.com';
    function done(){toast('Email copied: '+a);}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(a).then(done,done);else done();});
})();
