/* ============================================================
   CHIANTI SERVIZI — contact.js
   Form di contatto senza backend: valida i campi e apre il
   client di posta dell'utente con una mail gia compilata
   (scelta obbligata su GitHub Pages, che serve solo file statici).

   Per passare a un form "vero" con invio via email:
   registrare un endpoint su Formspree / Web3Forms e sostituire
   sendViaMailto() con una fetch POST verso quell'endpoint.
   ============================================================ */

(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form || !window.SITE) return;

  var S = window.SITE;
  var lang = S.lang;

  var L = {
    it: {
      required: 'Campo obbligatorio.',
      email: 'Inserisci un indirizzo email valido.',
      consent: 'Devi acconsentire al trattamento dei dati.',
      subject: 'Richiesta di preventivo dal sito',
      ok: 'Abbiamo aperto il tuo programma di posta con la richiesta gia compilata: controlla e premi invia. Se non si apre nulla, scrivici direttamente a ',
      labels: {
        name: 'Nome e cognome', company: 'Azienda', email: 'Email', phone: 'Telefono',
        sector: 'Settore', quantity: 'Quantita indicativa', message: 'Messaggio'
      }
    },
    en: {
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      consent: 'You must accept the privacy terms.',
      subject: 'Quote request from the website',
      ok: 'We opened your email client with the message ready: review it and hit send. If nothing opened, write to us directly at ',
      labels: {
        name: 'Full name', company: 'Company', email: 'Email', phone: 'Phone',
        sector: 'Sector', quantity: 'Estimated volume', message: 'Message'
      }
    }
  }[lang] || {};

  var status = document.getElementById('formStatus');

  function fieldOf(input) { return input.closest('.field') || input.closest('.form-consent'); }

  function setError(input, msg) {
    var f = fieldOf(input);
    if (!f) return;
    f.classList.add('field--error');
    var err = f.querySelector('.field__err');
    if (err) err.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    var f = fieldOf(input);
    if (!f) return;
    f.classList.remove('field--error');
    input.removeAttribute('aria-invalid');
  }

  function validate() {
    var ok = true, firstBad = null;
    var fields = form.querySelectorAll('input, textarea, select');

    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      clearError(el);
      if (el.type === 'checkbox') {
        if (el.required && !el.checked) { setError(el, L.consent); ok = false; firstBad = firstBad || el; }
        continue;
      }
      if (el.required && !el.value.trim()) {
        setError(el, L.required); ok = false; firstBad = firstBad || el; continue;
      }
      if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) {
        setError(el, L.email); ok = false; firstBad = firstBad || el;
      }
    }
    if (firstBad) firstBad.focus();
    return ok;
  }

  function sendViaMailto() {
    var d = {}, fields = form.querySelectorAll('input, textarea, select');
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      if (el.type === 'checkbox' || !el.name) continue;
      d[el.name] = el.value.trim();
    }

    var lines = [];
    var order = ['name', 'company', 'email', 'phone', 'sector', 'quantity'];
    for (var j = 0; j < order.length; j++) {
      var k = order[j];
      if (d[k]) lines.push(L.labels[k] + ': ' + d[k]);
    }
    lines.push('');
    lines.push(L.labels.message + ':');
    lines.push(d.message || '');
    lines.push('');
    lines.push('---');
    lines.push(S.company.name + ' — ' + (lang === 'it' ? 'richiesta inviata dal sito web' : 'request sent from the website'));

    var subject = L.subject + (d.company ? ' — ' + d.company : '');
    var href = 'mailto:' + S.company.email +
               '?subject=' + encodeURIComponent(subject) +
               '&body=' + encodeURIComponent(lines.join('\r\n'));

    window.location.href = href;

    if (status) {
      status.innerHTML = L.ok + '<a href="mailto:' + S.company.email + '">' + S.company.email + '</a>.';
      status.classList.add('is-shown');
      status.setAttribute('role', 'status');
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validate()) sendViaMailto();
  });

  form.addEventListener('input', function (e) {
    if (e.target.matches('input, textarea, select')) clearError(e.target);
  });
})();
