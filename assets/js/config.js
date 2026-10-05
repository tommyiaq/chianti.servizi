/* ============================================================
   CHIANTI SERVIZI — config.js
   CONTENITORE DEI DATI COMUNI DEL SITO.
   Header, footer, menu mobile e form contatti leggono da qui:
   modificando questo file cambi il dato su TUTTE le pagine,
   in entrambe le lingue.

   ------------------------------------------------------------
   >>> DA COMPLETARE
       - company.vat          P.IVA mancante: obbligatoria sul sito di
                              un'azienda italiana. Finche e vuota la riga
                              non viene mostrata ne in footer ne nei contatti.
       - company.email        lucioiaq@hotmail.it e provvisoria: sostituire
                              con la casella aziendale quando esiste
       - company.hours        orari indicativi
       - company.founded      anno di fondazione (stimato dai 6 anni di attivita)
       - stats nelle pagine   (vedi README.md)
   Dati confermati dall'azienda:
       - indirizzo, localita, CAP, citta, provincia, cellulare
   ------------------------------------------------------------
   Nessuna dipendenza esterna: semplice oggetto globale.
   ============================================================ */

window.SITE = (function () {
  'use strict';

  /* ---------- 1. Dati aziendali ---------- */
  var company = {
    name:      'Chianti Servizi',
    legal:     'Chianti Servizi',
    street:    'Via Montebello, 205/A',
    locality:  'Località Cantone',
    zip:       '50052',
    city:      'Certaldo',
    province:  'FI',
    region:    'Toscana',
    country:   'Italia',
    vat:       '',                      /* DA INSERIRE: P.IVA (obbligatoria) */
    phone:     '+39 334 915 6404',
    phoneHref: '+393349156404',
    email:     'lucioiaq@hotmail.it',   /* provvisoria, in attesa della casella aziendale */
    founded:   2020,                    /* PLACEHOLDER */
    lat:       43.5925,
    lng:       11.0285,
    mapsUrl:   'https://www.openstreetmap.org/?mlat=43.5925&mlon=11.0285#map=16/43.5925/11.0285',
    mapEmbed:  'https://www.openstreetmap.org/export/embed.html?bbox=11.013%2C43.5835%2C11.044%2C43.6015&layer=mapnik&marker=43.5925%2C11.0285'
  };
  company.addressLine = company.street + ', ' + company.zip + ' ' + company.city + ' (' + company.province + ')';
  /* 'Localita Cantone' va fra via e CAP quando serve l'indirizzo completo */
  company.addressFull = company.street + ' - ' + company.locality + ', '
                      + company.zip + ' ' + company.city + ' (' + company.province + ')';

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
