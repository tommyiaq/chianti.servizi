/* ============================================================
   CHIANTI SERVIZI — layout.js
   Costruisce header, menu mobile, footer e bottone "torna su"
   a partire da assets/js/config.js.

   Ogni pagina espone due segnaposto:
     <div data-slot="header"></div>  ... <div data-slot="footer"></div>
   e sul <body> dichiara:
     data-lang="it|en"  data-base="./|../"  data-page="home|about|..."
     data-header="over|solid"
   ============================================================ */

(function () {
  'use strict';

  var S = window.SITE;
  if (!S) return;

  var t = S.t();
  var co = S.company;
  var page = document.body.dataset.page || '';
  var headerMode = document.body.dataset.header || 'solid';

  /* ---------- Logo ----------
     Due varianti dello stesso marchio: lettering scuro per i fondi chiari,
     lettering crema per i fondi scuri. Il CSS decide quale mostrare in base
     al contesto (header trasparente, header compatto, footer).
     Il testo alternativo lo fornisce il contenitore, non le immagini. */
  function logoMark() {
    var dir = S.base + 'assets/img/';
    return '' +
      '<img class="logo__img logo__img--on-light" src="' + dir + 'logo-on-light.png" ' +
           'alt="" aria-hidden="true" width="520" height="172">' +
      '<img class="logo__img logo__img--on-dark" src="' + dir + 'logo-on-dark.png" ' +
           'alt="" aria-hidden="true" width="520" height="172">';
  }

  /* ---------- Link di navigazione ---------- */
  function navLinks(cls) {
    var out = '';
    for (var i = 0; i < S.navOrder.length; i++) {
      var key = S.navOrder[i];
      var cur = key === page ? ' is-current' : '';
      var aria = key === page ? ' aria-current="page"' : '';
      out += '<a class="' + cls + cur + '" href="' + S.url(key) + '"' + aria + '>' +
             t.nav[key] + '</a>';
    }
    return out;
  }

  /* ---------- Switcher lingua ---------- */
  function langSwitch() {
    var other = S.lang === 'it' ? 'en' : 'it';
    var current = S.lang;
    var target = S.url(page || 'home', other);
    var items = {
      it: '<span class="lang__item is-active">IT</span>',
      en: '<span class="lang__item is-active">EN</span>'
    };
    items[other] = '<a class="lang__item" href="' + target + '" hreflang="' + other + '" ' +
                   'lang="' + other + '">' + other.toUpperCase() + '</a>';
    return '<div class="lang">' + items.it +
           '<span class="lang__sep" aria-hidden="true">/</span>' + items.en + '</div>';
  }

  /* ---------- Header + menu mobile ---------- */
  function buildHeader() {
    var slot = document.querySelector('[data-slot="header"]');
    if (!slot) return;

    var over = headerMode === 'over';
    var html = '' +
      '<a class="skip-link" href="#main">' + t.skip + '</a>' +
      '<header class="site-header ' + (over ? 'site-header--over' : 'site-header--solid') + '" id="siteHeader">' +
        '<div class="site-header__inner">' +
          '<a class="logo" href="' + S.url('home') + '" aria-label="' + co.name + ' — home">' +
            logoMark() +
          '</a>' +
          '<nav class="nav" aria-label="' + t.nav.home + '">' + navLinks('nav__link') + langSwitch() + '</nav>' +
          '<button class="burger" id="burger" type="button" aria-expanded="false" ' +
                  'aria-controls="mobileMenu" aria-label="' + t.menuOpen + '">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</header>' +
      '<div class="mobile-menu" id="mobileMenu" hidden>' +
        '<nav class="mobile-menu__list" aria-label="Menu">' + navLinks('mobile-menu__link') + '</nav>' +
        '<div class="mobile-menu__foot">' +
          '<a href="tel:' + co.phoneHref + '">' + co.phone + '</a>' +
          '<a href="mailto:' + co.email + '">' + co.email + '</a>' +
          langSwitch() +
        '</div>' +
      '</div>';

    slot.outerHTML = html;
  }

  /* ---------- Footer ---------- */
  var ICO = {
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>',
    tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2-8 5-8-5V6l8 5 8-5v2.2z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.6V6h-2v7.4l5.2 3.1 1-1.7-4.2-2.2z"/></svg>'
  };

  function buildFooter() {
    var slot = document.querySelector('[data-slot="footer"]');
    if (!slot) return;

    var navItems = '';
    for (var i = 0; i < S.navOrder.length; i++) {
      var k = S.navOrder[i];
      navItems += '<li><a href="' + S.url(k) + '">' + t.nav[k] + '</a></li>';
    }

    var servItems = '';
    for (var j = 0; j < t.fServicesList.length; j++) {
      var s = t.fServicesList[j];
      servItems += '<li><a href="' + S.url(s.page) + s.hash + '">' + s.label + '</a></li>';
    }

    var year = new Date().getFullYear();

    slot.outerHTML = '' +
      '<footer class="site-footer">' +
        '<div class="wrap">' +
          '<div class="footer-grid">' +
            '<div class="footer-col">' +
              '<div class="logo"><span class="sr-only">' + co.name + '</span>' + logoMark() + '</div>' +
              '<p class="footer-note">' + t.footerTag + '</p>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h4>' + t.fNav + '</h4><ul>' + navItems + '</ul>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h4>' + t.fServices + '</h4><ul>' + servItems + '</ul>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h4>' + t.fContacts + '</h4>' +
              '<ul class="footer-contact">' +
                '<li>' + ICO.pin + '<span>' + co.street + '<br>' + co.zip + ' ' + co.city +
                  ' (' + co.province + ') — ' + co.country + '</span></li>' +
                '<li>' + ICO.tel + '<a href="tel:' + co.phoneHref + '">' + co.phone + '</a></li>' +
                '<li>' + ICO.mail + '<a href="mailto:' + co.email + '">' + co.email + '</a></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bar">' +
            '<p>&copy; ' + year + ' ' + co.legal + ' — ' + t.rights + ' ' +
              t.vatLabel + ' ' + co.vat + '</p>' +
            '<div class="footer-bar__links">' +
              '<a href="' + S.url('contact') + '">' + t.fContacts + '</a>' +
              '<span>' + t.credits + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</footer>' +
      '<button class="to-top" id="toTop" type="button" aria-label="' + t.toTop + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l7 7-1.4 1.4L13 8.8V20h-2V8.8l-4.6 4.6L5 12z"/></svg>' +
      '</button>';
  }

  /* ---------- Comportamenti ---------- */
  function initHeader() {
    var header = document.getElementById('siteHeader');
    var toTop = document.getElementById('toTop');
    if (!header) return;

    var threshold = headerMode === 'over' ? 80 : 10;
    var ticking = false;

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (headerMode === 'over') header.classList.toggle('is-stuck', y > threshold);
      if (toTop) toTop.classList.toggle('is-visible', y > 600);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function initMenu() {
    var burger = document.getElementById('burger');
    var menu = document.getElementById('mobileMenu');
    if (!burger || !menu) return;

    var links = menu.querySelectorAll('.mobile-menu__link');

    function setOpen(open) {
      menu.hidden = false;
      document.documentElement.classList.toggle('is-menu-open', open);
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? t.menuClose : t.menuOpen);
      document.body.style.overflow = open ? 'hidden' : '';
      for (var i = 0; i < links.length; i++) {
        links[i].style.transitionDelay = open ? (90 + i * 70) + 'ms' : '0ms';
      }
      if (open) { setTimeout(function () { links[0] && links[0].focus(); }, 320); }
    }

    burger.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setOpen(false); burger.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && menu.classList.contains('is-open')) setOpen(false);
    });
    menu.hidden = false;
  }

  /* ---------- Avvio ----------
     L'header viene costruito subito (lo script e incluso dopo il suo
     segnaposto, cosi non c'e sfarfallio). Footer e comportamenti
     aspettano che il resto del documento sia stato letto. */
  buildHeader();

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  ready(function () {
    buildFooter();
    initHeader();
    initMenu();
  });
})();
