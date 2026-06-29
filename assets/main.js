/* =========================================================
   Infrability AI Solutions — shared interactions
   Minimal, accessible, reduced-motion aware
   ========================================================= */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme toggle (default light, persisted, visitor-controlled) ---------- */
  (function(){
    var root = document.documentElement;
    var meta = document.querySelector('meta[name="theme-color"]');
    var apply = function(theme){
      if(theme === 'dark'){ root.setAttribute('data-theme','dark'); }
      else { root.removeAttribute('data-theme'); theme = 'light'; }
      if(meta){ meta.setAttribute('content', theme === 'dark' ? '#05070d' : '#f4f6fa'); }
      if(btn){ btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
               btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false'); }
    };
    // build the toggle button and place it in the nav, just before the CTA button
    var nav = document.getElementById('nav');
    var btn = null;
    if(nav){
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-toggle';
      btn.innerHTML =
        '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/>'+
        '<path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/></svg>'+
        '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.5A8.5 8.5 0 1 1 11.5 3a6.5 6.5 0 0 0 9.5 9.5z"/></svg>';
      var cta = nav.querySelector('a.btn');
      if(cta){ nav.insertBefore(btn, cta); } else { nav.appendChild(btn); }
      btn.addEventListener('click', function(){
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try{ localStorage.setItem('theme', next); }catch(e){}
      });
    }
    // sync button state/label with whatever the no-flash head script already applied
    apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  })();

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.rv');
  if(revealEls.length){
    if(reduce || !('IntersectionObserver' in window)){
      revealEls.forEach(function(el){ el.classList.add('in'); });
    }else{
      // stagger by position among reveal siblings sharing a parent
      revealEls.forEach(function(el){
        var sibs = el.parentElement ? el.parentElement.querySelectorAll(':scope > .rv') : [el];
        var idx = Array.prototype.indexOf.call(sibs, el);
        el.style.transitionDelay = Math.min(idx, 7) * 75 + 'ms';
      });
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
        });
      },{threshold:.14});
      revealEls.forEach(function(el){ io.observe(el); });
    }
  }

  /* ---------- card cursor spotlight ---------- */
  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    var run = function(el){
      var end = parseFloat(el.dataset.count),
          pre = el.dataset.prefix || '',
          suf = el.dataset.suffix || '',
          s = 0, step = end / 40;
      var fmt = function(n){ return n.toLocaleString('en-US'); };
      var tick = function(){
        s += step;
        if(s >= end){ el.textContent = pre + fmt(end) + suf; }
        else{ el.textContent = pre + fmt(Math.floor(s)) + suf; requestAnimationFrame(tick); }
      };
      tick();
    };
    if(reduce || !('IntersectionObserver' in window)){
      counters.forEach(function(el){ el.textContent = (el.dataset.prefix||'') + parseFloat(el.dataset.count).toLocaleString('en-US') + (el.dataset.suffix||''); });
    }else{
      var cio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ run(e.target); cio.unobserve(e.target); } });
      },{threshold:.5});
      counters.forEach(function(el){ cio.observe(el); });
    }
  }

  /* ---------- hero curiosity hook (teaser chips) ---------- */
  (function(){
    var hook = document.querySelector('.hook');
    if(!hook) return;
    var chips = hook.querySelectorAll('.hook-chip');
    var answerText = hook.querySelector('.hook-answer-text');
    var answerLink = hook.querySelector('.hook-answer-link');
    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        chips.forEach(function(c){ c.classList.remove('is-active'); c.setAttribute('aria-pressed','false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed','true');
        answerText.textContent = chip.dataset.answer;
        answerLink.textContent = chip.dataset.linkLabel + ' →';
        answerLink.setAttribute('href', chip.dataset.link);
        // intentionally no auto-scroll — selecting a chip only updates the preview
        // and the "Meet …" link; the visitor navigates by clicking that link.
      });
    });
  })();

  /* ---------- contact form (Formspree + mailto fallback) ---------- */
  (function(){
    var form = document.getElementById('contactForm');
    if(!form) return;
    var status = form.querySelector('.cf-status');
    var btn = form.querySelector('button[type="submit"]');
    function setStatus(msg, cls){ status.textContent = msg; status.className = 'cf-status' + (cls ? ' ' + cls : ''); }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(form.querySelector('[name="_gotcha"]').value) return; // bot trap
      var ok = true;
      form.querySelectorAll('[required]').forEach(function(f){
        var valid = !!f.value.trim();
        if(valid && f.type === 'email') valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value);
        if(valid && f.type === 'tel') valid = /^[+]?[\d\s().-]{7,}$/.test(f.value);
        f.closest('.field').classList.toggle('error', !valid);
        if(!valid) ok = false;
      });
      if(!ok){ setStatus('Please complete the required fields with a valid email and phone number.', 'err'); return; }
      var data = new FormData(form);
      var action = form.getAttribute('action');
      if(action.indexOf('YOUR_FORM_ID') !== -1){
        // form service not configured yet — fall back to email
        var body = 'Name: ' + data.get('name') + '\nEmail: ' + data.get('email') +
          '\nPhone: ' + (data.get('phone') || '—') +
          '\nCompany: ' + (data.get('company') || '—') + '\nTopic: ' + (data.get('topic') || '—') +
          '\n\n' + (data.get('message') || '');
        window.location.href = 'mailto:info@infrability.com?subject=' +
          encodeURIComponent('Enquiry — ' + (data.get('company') || data.get('name'))) +
          '&body=' + encodeURIComponent(body);
        setStatus('Opening your email app — or write to info@infrability.com.', 'ok');
        return;
      }
      btn.disabled = true; setStatus('Sending…', '');
      fetch(action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function(r){
          if(r.ok){ form.reset(); setStatus('Thanks — we’ll be in touch shortly.', 'ok'); }
          else { return r.json().then(function(d){ setStatus(d && d.errors ? d.errors.map(function(x){return x.message;}).join(', ') : 'Something went wrong — please email info@infrability.com.', 'err'); }); }
        })
        .catch(function(){ setStatus('Network error — please email info@infrability.com.', 'err'); })
        .then(function(){ btn.disabled = false; });
    });
  })();

  /* ---------- mobile nav ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if(menuBtn && nav){
    menuBtn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); });
    });
  }
})();
