/* ============================================================
   CHIANTI SERVIZI — ui.js
   Comportamenti di interfaccia comuni, attivati solo se nella
   pagina esistono gli elementi relativi:
     [data-reveal]        ingresso in scroll
     [data-count]         conteggio numerico animato
     [data-acc]           accordion / FAQ
     [data-gallery]       griglia filtrabile + lightbox
   ============================================================ */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Reveal in scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-visible');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el, idx) {
      var group = el.parentElement;
      if (!el.style.getPropertyValue('--reveal-delay') && group && group.dataset.revealStagger) {
        var n = Array.prototype.indexOf.call(group.children, el);
        el.style.setProperty('--reveal-delay', (n * 110) + 'ms');
      }
      io.observe(el);
    });
  }

  /* ---------- 2. Numeri animati ---------- */
  function initCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;

    var locale = document.documentElement.lang || 'it';

    function fmt(n, dec) {
      try {
        return n.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
      } catch (err) { return n.toFixed(dec); }
    }

    function run(el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var prefix = el.dataset.prefix || '';
      var dec = (el.dataset.decimals | 0);
      if (reduced) { el.textContent = prefix + fmt(target, dec) + suffix; return; }
      var dur = 1500, start = null;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + fmt(target * eased, dec) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) { nodes.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 3. Accordion ---------- */
  function initAccordion() {
    var groups = document.querySelectorAll('[data-acc]');
    if (!groups.length) return;

    groups.forEach(function (group) {
      var btns = group.querySelectorAll('.acc__btn');
      btns.forEach(function (btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;
        btn.addEventListener('click', function () {
          var open = btn.getAttribute('aria-expanded') === 'true';
          if (group.dataset.acc === 'single' && !open) {
            btns.forEach(function (other) {
              if (other === btn) return;
              var op = document.getElementById(other.getAttribute('aria-controls'));
              other.setAttribute('aria-expanded', 'false');
              if (op) op.style.height = '0px';
            });
          }
          btn.setAttribute('aria-expanded', String(!open));
          panel.style.height = open ? '0px' : panel.scrollHeight + 'px';
        });
        panel.style.height = '0px';
      });
    });

    window.addEventListener('resize', function () {
      document.querySelectorAll('.acc__btn[aria-expanded="true"]').forEach(function (b) {
        var p = document.getElementById(b.getAttribute('aria-controls'));
        if (p) p.style.height = p.scrollHeight + 'px';
      });
    });
  }

  /* ---------- 4. Galleria: filtri + lightbox ---------- */
  function initGallery() {
    var gallery = document.querySelector('[data-gallery]');
    if (!gallery) return;

    var items = Array.prototype.slice.call(gallery.querySelectorAll('[data-cat]'));
    var filters = document.querySelectorAll('[data-filter]');
    var visible = items.slice();

    /* --- filtri --- */
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.filter;
        filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        visible = [];
        items.forEach(function (it) {
          var show = cat === 'all' || it.dataset.cat === cat;
          it.hidden = !show;
          if (show) visible.push(it);
        });
      });
    });

    /* --- lightbox --- */
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.hidden = true;
    lb.innerHTML =
      '<button class="lb__btn lb__close" type="button" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg></button>' +
      '<button class="lb__btn lb__prev" type="button" aria-label="Previous">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z"/></svg></button>' +
      '<button class="lb__btn lb__next" type="button" aria-label="Next">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z"/></svg></button>' +
      '<figure class="lb__fig"><img alt="" id="lbImg"><figcaption class="lb__cap" id="lbCap"></figcaption></figure>';
    document.body.appendChild(lb);

    var img = lb.querySelector('#lbImg');
    var cap = lb.querySelector('#lbCap');
    var idx = 0;
    var lastFocus = null;

    function show(i) {
      if (!visible.length) return;
      idx = (i + visible.length) % visible.length;
      var el = visible[idx];
      var src = el.dataset.full || (el.querySelector('img') || {}).src;
      var title = el.dataset.title || '';
      var desc = el.dataset.desc || '';
      img.src = src;
      img.alt = title;
      cap.innerHTML = (title ? '<strong>' + title + '</strong>' : '') + desc;
    }
    function open(el) {
      lastFocus = document.activeElement;
      lb.hidden = false;
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
      show(visible.indexOf(el));
      lb.querySelector('.lb__close').focus();
    }
    function close() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () { lb.hidden = true; img.src = ''; }, 450);
      if (lastFocus) lastFocus.focus();
    }

    items.forEach(function (it) {
      it.addEventListener('click', function (e) { e.preventDefault(); open(it); });
      it.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(it); }
      });
    });
    lb.querySelector('.lb__close').addEventListener('click', close);
    lb.querySelector('.lb__prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb__next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- 5. Avvio ---------- */
  function boot() {
    initReveal();
    initCounters();
    initAccordion();
    initGallery();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
