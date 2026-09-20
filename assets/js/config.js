/* ============================================================
   CHIANTI SERVIZI — config.js
   CONTENITORE DEI DATI COMUNI DEL SITO.
   Header, footer, menu mobile e form contatti leggono da qui:
   modificando questo file cambi il dato su TUTTE le pagine,
   in entrambe le lingue.

   ------------------------------------------------------------
   >>> DA VERIFICARE / SOSTITUIRE (placeholder)
       - company.phone        numero inventato (000)
       - company.email        casella da confermare
       - company.hours        orari indicativi
       - company.founded      anno di fondazione
       - stats nelle pagine   (vedi README.md)
   Dati reperiti pubblicamente e gia corretti:
       - ragione sociale, indirizzo, CAP/citta, P.IVA
   ------------------------------------------------------------
   Nessuna dipendenza esterna: semplice oggetto globale.
   ============================================================ */

window.SITE = (function () {
  'use strict';

  /* ---------- 1. Dati aziendali ---------- */
  var company = {
    name:      'Chianti Servizi',
    legal:     'Chianti Servizi',
    street:    'Via Rossini, 2',
    zip:       '53036',
    city:      'Poggibonsi',
    province:  'SI',
    region:    'Toscana',
    country:   'Italia',
    vat:       '01415280526',
    phone:     '+39 0577 000 000',      /* PLACEHOLDER */
    phoneHref: '+390577000000',         /* PLACEHOLDER */
    email:     'info@chiantiservizi.it',/* PLACEHOLDER */
    founded:   1998,                    /* PLACEHOLDER */
    lat:       43.4686,
    lng:       11.1474,
    mapsUrl:   'https://www.openstreetmap.org/?mlat=43.4686&mlon=11.1474#map=16/43.4686/11.1474',
    mapEmbed:  'https://www.openstreetmap.org/export/embed.html?bbox=11.132%2C43.460%2C11.163%2C43.478&layer=mapnik&marker=43.4686%2C11.1474'
  };
  company.addressLine = company.street + ', ' + company.zip + ' ' + company.city + ' (' + company.province + ')';

  /* ---------- 2. Mappa delle pagine (percorsi relativi alla root) ---------- */
  var pages = {
    home:      { it: 'index.html',     en: 'en/index.html' },
    about:     { it: 'chi-siamo.html', en: 'en/about.html' },
    services:  { it: 'servizi.html',   en: 'en/services.html' },
    portfolio: { it: 'portfolio.html', en: 'en/portfolio.html' },
    contact:   { it: 'contatti.html',  en: 'en/contact.html' }
  };
  var navOrder = ['home', 'about', 'services', 'portfolio', 'contact'];

  /* ---------- 3. Stringhe di interfaccia ---------- */
  var strings = {
    it: {
      nav: { home: 'Home', about: 'Chi Siamo', services: 'Servizi', portfolio: 'Portfolio', contact: 'Contatti' },
      skip: 'Vai al contenuto principale',
      menuOpen: 'Apri il menu', menuClose: 'Chiudi il menu',
      toTop: 'Torna su',
      footerTag: 'Confezionamento conto terzi per cosmetica e alimentare, nel cuore della Toscana.',
      fNav: 'Naviga', fContacts: 'Contatti', fServices: 'Cosa facciamo',
      fServicesList: [
        { label: 'Confezionamento cosmetica', page: 'services', hash: '#cosmetica' },
        { label: 'Confezionamento alimentare', page: 'services', hash: '#alimentare' },
        { label: 'Astucciatura e kit', page: 'services', hash: '#lavorazioni' },
        { label: 'Confezioni regalo', page: 'services', hash: '#lavorazioni' }
      ],
      rights: 'Tutti i diritti riservati.',
      vatLabel: 'P.IVA',
      privacy: 'Privacy & Cookie',
      credits: 'Sito realizzato con cura in Valdelsa',
      writeUs: 'Scrivici',
      callUs: 'Chiamaci'
    },
    en: {
      nav: { home: 'Home', about: 'About', services: 'Services', portfolio: 'Portfolio', contact: 'Contact' },
      skip: 'Skip to main content',
      menuOpen: 'Open menu', menuClose: 'Close menu',
      toTop: 'Back to top',
      footerTag: 'Contract packaging for cosmetics and fine food, in the heart of Tuscany.',
      fNav: 'Navigate', fContacts: 'Contact', fServices: 'What we do',
      fServicesList: [
        { label: 'Cosmetics packaging', page: 'services', hash: '#cosmetics' },
        { label: 'Food packaging', page: 'services', hash: '#food' },
        { label: 'Cartoning and kits', page: 'services', hash: '#operations' },
        { label: 'Gift packaging', page: 'services', hash: '#operations' }
      ],
      rights: 'All rights reserved.',
      vatLabel: 'VAT',
      privacy: 'Privacy & Cookies',
      credits: 'Crafted with care in Valdelsa, Tuscany',
      writeUs: 'Write to us',
      callUs: 'Call us'
    }
  };

  /* ---------- 4. Helper ---------- */
  var body = document.body;
  var lang = (body && body.dataset.lang) || 'it';
  var base = (body && body.dataset.base) || './';

  /** Percorso assoluto-relativo verso una pagina, nella lingua indicata. */
  function url(key, toLang) {
    var p = pages[key];
    if (!p) return base;
    return base + p[toLang || lang];
  }

  /** Stringhe della lingua corrente. */
  function t() { return strings[lang] || strings.it; }

  return {
    company: company,
    pages: pages,
    navOrder: navOrder,
    strings: strings,
    lang: lang,
    base: base,
    url: url,
    t: t
  };
})();
