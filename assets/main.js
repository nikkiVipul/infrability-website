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
      var tick = function(){
        s += step;
        if(s >= end){ el.textContent = pre + end + suf; }
        else{ el.textContent = pre + Math.floor(s) + suf; requestAnimationFrame(tick); }
      };
      tick();
    };
    if(reduce || !('IntersectionObserver' in window)){
      counters.forEach(function(el){ el.textContent = (el.dataset.prefix||'') + el.dataset.count + (el.dataset.suffix||''); });
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
