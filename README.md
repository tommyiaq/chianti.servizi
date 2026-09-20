# Chianti Servizi — sito statico

Sito vetrina per un'azienda di confezionamento conto terzi (cosmetica e alimentare),
in italiano e inglese. **HTML, CSS e JavaScript puri**: nessun build step, nessuna
dipendenza da installare. Si pubblica su GitHub Pages copiando i file così come sono.

---

## Come si pubblica su GitHub Pages

1. Push del repository su GitHub.
2. *Settings → Pages → Build and deployment*: sorgente **Deploy from a branch**,
   branch `main`, cartella `/ (root)`.
3. Il sito sarà su `https://<utente>.github.io/<repository>/`.

Tutti i percorsi interni sono **relativi**, quindi il sito funziona sia in una
sottocartella (project page) sia su un dominio personalizzato, senza modifiche.
Il file `.nojekyll` evita che GitHub applichi Jekyll ai file.

Per aprirlo in locale basta un doppio clic su `index.html`, oppure:

```bash
python -m http.server 8000
```

### Dominio personalizzato (facoltativo)

Creare un file `CNAME` nella root con dentro il solo dominio (`www.esempio.it`),
poi impostarlo in *Settings → Pages*. Dopodiché sostituire
`https://USERNAME.github.io/REPOSITORY/` in `robots.txt` e `sitemap.xml`.

---

## Struttura

```
index.html  chi-siamo.html  servizi.html  portfolio.html  contatti.html   pagine IT
en/         index · about · services · portfolio · contact                pagine EN
404.html                                     pagina di errore (stili propri, autonoma)
robots.txt  sitemap.xml  .nojekyll           file di servizio

assets/css/
  base.css          reset, colori, tipografia, spaziature (i "design token")
  layout.css        header, navigazione, menu mobile, footer, hero di pagina
  components.css    bottoni, card, elenchi, accordion, lightbox, form
  pages/*.css       stili specifici di una sola pagina

assets/js/
  config.js         >>> CONTENITORE DEI DATI COMUNI: indirizzo, telefono, email,
                        elenco pagine, testi di header e footer nelle due lingue
  layout.js         costruisce header, menu mobile e footer da config.js
  ui.js             animazioni in scroll, numeri animati, accordion, filtri, lightbox
  contact.js        validazione del form e composizione dell'email

assets/img/
  logo.png              logo originale fornito (master, non usato dalle pagine)
  logo-on-light.png     logo per fondi chiari  (lettering scuro)
  logo-on-dark.png      logo per fondi scuri   (lettering crema)
  favicon-32.png  apple-touch-icon.png
```

### Come sono organizzate le pagine

Ogni pagina contiene solo il proprio contenuto. Header e footer non sono duplicati:
sono generati da `layout.js` al posto di due segnaposto

```html
<div data-slot="header"></div>   ...   <div data-slot="footer"></div>
```

e il `<body>` dichiara il contesto:

```html
<body data-lang="it" data-base="./" data-page="home" data-header="over">
```

| attributo     | significato                                                              |
|---------------|--------------------------------------------------------------------------|
| `data-lang`   | `it` o `en` — sceglie i testi di interfaccia in `config.js`               |
| `data-base`   | `./` per le pagine IT, `../` per quelle in `en/`                          |
| `data-page`   | voce di menu attiva e pagina corrispondente nell'altra lingua            |
| `data-header` | `over` = header trasparente sopra un'immagine, `solid` = header compatto |

Aggiungere una pagina significa copiarne una esistente, cambiare questi attributi e,
se deve comparire nel menu, aggiungerla a `pages` e `navOrder` in `config.js`.

---

## Da completare prima di andare online

### 1. Dati aziendali — `assets/js/config.js`

Sono **segnaposto** e vanno confermati:

| dato | valore attuale | nota |
|------|----------------|------|
| telefono | `+39 0577 000 000` | inventato, da sostituire |
| email | `info@chiantiservizi.it` | da confermare |
| orari | Lun–Gio 8–17:30, Ven 8–15 | indicativi |
| anno di fondazione | 1998 | indicativo |

Ragione sociale, indirizzo (Via Rossini 2, 53036 Poggibonsi SI) e P.IVA `01415280526`
provengono da fonti pubbliche: **vanno comunque verificati**, perché l'attività
registrata a quell'indirizzo risulta operare nella manutenzione del verde e non nel
confezionamento.

Telefono ed email compaiono anche, in chiaro, in `contatti.html` e `en/contact.html`
(scheda recapiti e nota sotto il form) e nel blocco JSON-LD in testa alle home.

### 2. Numeri e certificazioni

Sono plausibili ma **non verificati**: 25+ anni, 3.500 m², 180+ marchi, 4 M pezzi/anno
(sezione "numeri" delle due home), HACCP / ISO 22716 / ISO 9001, lotti minimi e capacità
produttiva nella pagina Servizi. Da confermare o rimuovere.

### 3. Immagini

Sono foto **Unsplash** caricate dal loro CDN (uso libero, nessuna attribuzione
obbligatoria). Vanno sostituite con foto reali dello stabilimento e delle lavorazioni:
cercare `images.unsplash.com` nei file HTML e cambiare `src`, `alt` e le descrizioni.
Qualche scatto mostra marchi di terzi in piccolo, un motivo in più per sostituirli.

### 4. Informativa privacy

Il form richiede il consenso ma **manca la pagina dell'informativa**: va scritta e
collegata dal footer e dalla riga di consenso.

---

## Form contatti

GitHub Pages serve solo file statici, quindi il form **non invia email da solo**:
apre il client di posta dell'utente con il messaggio già compilato (`mailto:`).

Per passare a un invio reale, registrare un endpoint su
[Formspree](https://formspree.io) o [Web3Forms](https://web3forms.com) e sostituire
la funzione `sendViaMailto()` in `assets/js/contact.js` con una `fetch()` POST
verso quell'endpoint. Il resto (validazione, messaggi, stati di errore) resta valido.

---

## Note tecniche

- **Font**: Cinzel, Cormorant Garamond e Jost da Google Fonts.
- **Mappa**: iframe OpenStreetMap, nessuna chiave API né cookie di profilazione.
- **Senza JavaScript**: i contenuti restano leggibili e ogni pagina espone un menu
  di riserva in `<noscript>`; header, footer e lightbox non vengono costruiti.
- **Accessibilità**: skip link, `aria-*` su menu e accordion, focus visibile,
  rispetto di `prefers-reduced-motion`.
- **Lingue**: le due versioni sono collegate da `hreflang` e dallo switcher IT/EN,
  che porta alla pagina equivalente e non alla home.
