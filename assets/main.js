/* =========================================================
   Infrability AI Solutions — shared interactions
   Minimal, accessible, reduced-motion aware
   ========================================================= */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
