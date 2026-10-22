/*! FrostBanner v0.4.0 — beautiful cookie banners */
(function (w, d) {
  'use strict';
  if (w.FrostBanner) return;

  // ---------- constants ----------
  var KEY = 'fb_consent';
  var EU = 'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO GB CH'.split(' ');
  // FrostBanner category -> Google Consent Mode v2 keys
  var GCM = {
    analytics: ['analytics_storage'],
    marketing: ['ad_storage', 'ad_user_data', 'ad_personalization'],
    functional: ['functionality_storage', 'personalization_storage']
  };
  var T = {
    en: {
      title: 'We value your privacy',
      text: 'We use cookies to run this site, measure traffic and personalise ads. You choose which ones we can use.',
      short: 'We use cookies to improve your experience.',
      accept: 'Accept all', reject: 'Reject all', prefs: 'Customise', save: 'Save choices',
      policy: 'Cookie policy', manage: 'Cookie settings', always: 'Always on',
      embed: 'This content from {site} uses {cat} cookies. It loads only with your consent.', embedBtn: 'Allow and show',
      c: {
        necessary: ['Strictly necessary', 'Needed for the site to work. Always on.'],
        analytics: ['Analytics', 'Helps us understand how visitors use the site.'],
        marketing: ['Marketing', 'Used to show relevant ads and measure campaigns.'],
        functional: ['Functional', 'Remembers choices like language and region.']
      }
    },
    pt: {
      title: 'A sua privacidade importa',
      text: 'Usamos cookies para o site funcionar, medir o tráfego e personalizar anúncios. Escolha quais podemos usar.',
      short: 'Usamos cookies para melhorar a sua experiência.',
      accept: 'Aceitar todos', reject: 'Rejeitar todos', prefs: 'Personalizar', save: 'Guardar escolhas',
      policy: 'Política de cookies', manage: 'Definições de cookies', always: 'Sempre ativos',
      embed: 'Este conteúdo de {site} usa cookies de {cat}. Só é carregado com o seu consentimento.', embedBtn: 'Permitir e mostrar',
      c: {
        necessary: ['Estritamente necessários', 'Indispensáveis para o site funcionar. Sempre ativos.'],
        analytics: ['Análise', 'Ajudam-nos a perceber como o site é utilizado.'],
        marketing: ['Marketing', 'Permitem mostrar anúncios relevantes e medir campanhas.'],
        functional: ['Funcionais', 'Guardam preferências como idioma e região.']
      }
    }
  };

  // ---------- templates (visual presets; any field can be overridden in config) ----------
  var TPL = {
    frost:     { layout: 'corner', theme: 'light', glass: true,  glow: false, icon: false, radius: 18, accent: '#2b64d9' },
    midnight:  { layout: 'corner', theme: 'dark',  glass: true,  glow: false, icon: false, radius: 18, accent: '#6e9bff' },
    aurora:    { layout: 'corner', theme: 'dark',  glass: true,  glow: true,  icon: true,  radius: 22, accent: '#8b6cff' },
    glacier:   { layout: 'bar',    theme: 'light', glass: true,  glow: false, icon: false, radius: 16, accent: '#2b64d9' },
    obsidian:  { layout: 'bar',    theme: 'dark',  glass: true,  glow: false, icon: true,  radius: 12, accent: '#e0a33a' },
    porthole:  { layout: 'center', theme: 'light', glass: true,  glow: false, icon: true,  radius: 24, accent: '#0f8b8d' },
    nightfall: { layout: 'center', theme: 'dark',  glass: true,  glow: true,  icon: false, radius: 20, accent: '#ff7a59' },
    pebble:    { layout: 'pill',   theme: 'light', glass: true,  glow: false, icon: false, radius: 16, accent: '#1d2433' },
    paper:     { layout: 'corner', theme: 'light', glass: false, glow: false, icon: false, radius: 6,  accent: '#1d2433' },
    mint:      { layout: 'corner', theme: 'tint',  glass: true,  glow: false, icon: true,  radius: 28, accent: '#1f9d7a' },
    bubble:    { layout: 'chat',   theme: 'light', glass: true,  glow: false, icon: false, radius: 20, accent: '#6a4cff' },
    whisper:   { layout: 'chat',   theme: 'dark',  glass: true,  glow: false, icon: false, radius: 20, accent: '#38bdf8' },
    biscuit:   { layout: 'split',  theme: 'light', glass: false, glow: false, icon: false, radius: 18, accent: '#c4682b' },
    cocoa:     { layout: 'split',  theme: 'dark',  glass: true,  glow: true,  icon: false, radius: 18, accent: '#e8a55c' }
  };

  // ---------- config ----------
  var user = w.frostBannerConfig || {};
  // <script src=".../v1/fb.js" data-site="SITE_ID">: site id and log endpoint come from the tag itself
  var me = d.currentScript, auto = {};
  if (me && me.src) {
    if (me.getAttribute('data-site')) auto.site = me.getAttribute('data-site');
    try { auto.endpoint = new URL('/v1/consent', me.src).href; } catch (e) {}
  }
  user = assign({}, auto, user);
  var DEF = {
    site: 'demo', version: 1, lang: null, template: 'frost',
    layout: 'corner',            // corner | bar | center | pill | chat | split
    theme: 'light',              // light | dark | tint
    glass: true, glow: false, icon: false,
    accent: '#2b64d9', radius: 18, blur: 18,
    categories: ['necessary', 'analytics', 'marketing', 'functional'],
    policyUrl: '#', geo: { mode: 'all', country: null }, // mode: all | eu
    endpoint: null, maxAgeDays: 180, branding: true,
    container: null,             // selector: render inside an element (editor preview)
    texts: {}
  };
  var cfg = assign({}, DEF, TPL[user.template] || TPL.frost, user);

  // Settings published in the dashboard replace the inline config entirely
  // (only site, endpoint and container are kept from the page).
  // The server always sends the owner's plan; Free limits apply to inline settings too.
  var FREE = ['frost', 'midnight', 'glacier'];
  var STYLE = ['layout', 'theme', 'glass', 'glow', 'icon', 'accent', 'radius', 'blur'];
  function useRemote(r) {
    if (!r || typeof r !== 'object') return;
    if (r.template) {
      cfg = assign({}, DEF, TPL[r.template] || TPL.frost, r,
        { site: cfg.site, endpoint: cfg.endpoint, container: cfg.container, texts: r.texts || {} });
      if (!cfg.policyUrl) cfg.policyUrl = '#';
    }
    cfg.geo = assign({}, cfg.geo || {}, { country: (r.geo && r.geo.country) || null });
    if (r.plan !== 'pro') {
      cfg.branding = true;
      var tp = FREE.indexOf(cfg.template) > -1 ? cfg.template : 'frost';
      for (var i = 0; i < STYLE.length; i++) cfg[STYLE[i]] = TPL[tp][STYLE[i]] !== undefined ? TPL[tp][STYLE[i]] : DEF[STYLE[i]];
      cfg.template = tp;
      cfg.geo = assign({}, cfg.geo, { mode: 'all' });
    }
  }

  var L = {}, mem = null, stored = null, state = null, draft = { necessary: true };
  var host, root, view = 'main', mode = null, typed = false;

  function assign(t) {
    for (var i = 1; i < arguments.length; i++) { var s = arguments[i]; for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k]; }
    return t;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function emit(n, p) {
    (L[n] || []).forEach(function (f) { try { f(p); } catch (e) {} });
    try { w.dispatchEvent(new CustomEvent('frostbanner:' + n, { detail: p })); } catch (e) {}
  }
  function uid() {
    try { return crypto.randomUUID(); } catch (e) { return 'fb-' + Math.random().toString(36).slice(2) + Date.now().toString(36); }
  }
  function each(fn) { cfg.categories.forEach(fn); }
  function pick(fn) { var o = {}; each(function (k) { o[k] = k === 'necessary' ? true : !!fn(k); }); return o; }

  // ---------- storage: cookie, then localStorage, then memory ----------
  function readStore() {
    var raw = null;
    try { var m = d.cookie.match(/(?:^|; )fb_consent=([^;]*)/); if (m) raw = decodeURIComponent(m[1]); } catch (e) {}
    if (!raw) { try { raw = w.localStorage.getItem(KEY); } catch (e) {} }
    if (!raw) raw = mem;
    try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function writeStore(o) {
    var s = JSON.stringify(o); mem = s;
    try {
      d.cookie = KEY + '=' + encodeURIComponent(s) + ';path=/;max-age=' + (cfg.maxAgeDays * 86400) +
        ';SameSite=Lax' + (location.protocol === 'https:' ? ';Secure' : '');
    } catch (e) {}
    try { w.localStorage.setItem(KEY, s); } catch (e) {}
  }
  function clearStore() {
    mem = null;
    try { d.cookie = KEY + '=;path=/;max-age=0'; } catch (e) {}
    try { w.localStorage.removeItem(KEY); } catch (e) {}
  }

  // ---------- Google Consent Mode v2 ----------
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== 'function') w.gtag = function () { w.dataLayer.push(arguments); };
  function gcm(kind, c) {
    var o = {};
    for (var k in GCM) GCM[k].forEach(function (x) { o[x] = c && c[k] ? 'granted' : 'denied'; });
    if (kind === 'default') { o.security_storage = 'granted'; o.wait_for_update = 500; }
    w.gtag('consent', kind, o);
    emit('consentmode', { kind: kind, state: o });
  }

  // ---------- script blocking: <script type="text/plain" data-category="analytics"> ----------
  function unblock(c) {
    var n = d.querySelectorAll('script[type="text/plain"][data-category]');
    for (var i = 0; i < n.length; i++) {
      var o = n[i], cat = o.getAttribute('data-category');
      if (!c[cat] || o.hasAttribute('data-fb-run')) continue;
      o.setAttribute('data-fb-run', '');
      var s = d.createElement('script');
      for (var j = 0; j < o.attributes.length; j++) {
        var a = o.attributes[j];
        if (!/^(type|data-category|data-fb-run)$/.test(a.name)) s.setAttribute(a.name, a.value);
      }
      s.type = o.getAttribute('data-type') || 'text/javascript';
      s.setAttribute('data-fb-clone', '');
      if (!o.src) s.text = o.text;
      o.parentNode.insertBefore(s, o.nextSibling);
      emit('script', { category: cat, name: o.getAttribute('data-name') || o.src || 'inline script' });
    }
  }

  // ---------- embeds: <iframe data-src="https://www.youtube.com/embed/..." data-category="marketing"> ----------
  // Until the visitor accepts that category the iframe has no src (nothing loads, no third-party
  // cookies) and a placeholder with an "Allow and show" button is shown in its place.
  function hostOf(u) { try { return new URL(u, location.href).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }
  function size(v, unit) { return /^\d+(\.\d+)?$/.test(v || '') ? v + unit : /^\d+(\.\d+)?(px|%|rem|em|vh|vw)$/.test(v || '') ? v : ''; }
  function embeds(c) {
    var n = d.querySelectorAll('iframe[data-src][data-category]');
    for (var i = 0; i < n.length; i++) {
      var f = n[i], cat = f.getAttribute('data-category'), ph = f.previousElementSibling;
      var has = ph && ph.hasAttribute && ph.hasAttribute('data-fb-ph');
      if (c && c[cat]) {
        if (f.getAttribute('src') !== f.getAttribute('data-src')) {
          f.setAttribute('src', f.getAttribute('data-src'));
          emit('embed', { category: cat, src: f.getAttribute('data-src') });
        }
        if (f.hasAttribute('data-fb-disp')) { f.style.display = f.getAttribute('data-fb-disp'); f.removeAttribute('data-fb-disp'); }
        if (has) ph.parentNode.removeChild(ph);
        continue;
      }
      if (f.hasAttribute('src')) f.removeAttribute('src');          // consent withdrawn: unload
      if (has) continue;
      var t = tx(), name = (t.c && t.c[cat] ? t.c[cat][0] : cat).toLowerCase();
      var acc = /^#[0-9a-fA-F]{3,8}$/.test(cfg.accent || '') ? cfg.accent : '#2b64d9';
      var p = d.createElement('div');
      p.setAttribute('data-fb-ph', ''); p.setAttribute('role', 'note');
      p.style.cssText = 'box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;' +
        'text-align:center;padding:20px;max-width:100%;background:#eef1f5;color:#1d2433;border:1px solid #d6dde6;border-radius:10px;' +
        'font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
        'width:' + (f.style.width || size(f.getAttribute('width'), 'px') || '100%') + ';' +
        'min-height:' + (f.style.height || (/%$/.test(f.getAttribute('height') || '') ? '' : size(f.getAttribute('height'), 'px')) || '220px') + ';';
      var m = d.createElement('p');
      m.style.cssText = 'margin:0;max-width:34em';
      m.textContent = t.embed.replace('{site}', hostOf(f.getAttribute('data-src')) || '?').replace('{cat}', name);
      var b = d.createElement('button');
      b.type = 'button'; b.textContent = t.embedBtn;
      b.style.cssText = 'cursor:pointer;border:0;border-radius:8px;padding:10px 18px;font:600 14px/1.2 system-ui,-apple-system,sans-serif;color:#fff;background:' + acc;
      b.addEventListener('click', (function (k) {
        return function () { var cc = assign({}, state || pick(function () { return false; })); cc[k] = true; draft = assign({}, cc); decide(cc, 'custom'); };
      })(cat));
      p.appendChild(m); p.appendChild(b);
      f.setAttribute('data-fb-disp', f.style.display || '');
      f.style.display = 'none';
      f.parentNode.insertBefore(p, f);
    }
  }

  // ---------- cookies of refused categories are removed (consent withdrawn = data stops) ----------
  var PURGE = {
    analytics: [/^_ga/, /^_gid$/, /^_gat/, /^_clck$/, /^_clsk$/, /^_hj/],
    marketing: [/^_fbp$/, /^_fbc$/, /^_gcl_/, /^_uet/, /^_ttp$/]
  };
  function purge(c) {
    var names = [], parts = location.hostname.split('.'), doms = [''];
    try { d.cookie.split(/;\s*/).forEach(function (x) { if (x) names.push(x.split('=')[0]); }); } catch (e) { return; }
    for (var i = 0; i < parts.length - 1; i++) doms.push(';domain=.' + parts.slice(i).join('.'));
    for (var cat in PURGE) {
      if (c[cat]) continue;
      names.forEach(function (n) {
        if (!PURGE[cat].some(function (re) { return re.test(n); })) return;
        doms.forEach(function (dm) { try { d.cookie = n + '=;path=/;max-age=0' + dm; } catch (e) {} });
      });
    }
  }

  // ---------- decisions ----------
  function apply(c, source) { state = c; gcm('update', c); purge(c); unblock(c); embeds(c); emit('change', { choices: c, source: source }); }
  // Ask again only when the set of categories changes, not on every text/colour edit.
  function catKey() { return cfg.categories.slice().sort().join(','); }
  function decide(c, action) {
    stored = { v: cfg.version, k: catKey(), id: (stored && stored.id) || uid(), ts: Date.now(), c: c };
    writeStore(stored);
    apply(c, action);
    log(stored, action);
    showFab();
  }
  function log(rec, action) {
    var p = { site: cfg.site, consent_id: rec.id, config_version: rec.v, choices: rec.c, action: action, ts: rec.ts, url: location.href.split(/[?#]/)[0] };
    emit('log', p);
    if (!cfg.endpoint) return;
    try {
      var b = JSON.stringify(p);
      if (!(navigator.sendBeacon && navigator.sendBeacon(cfg.endpoint, b))) {
        fetch(cfg.endpoint, { method: 'POST', body: b, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(function () {});
      }
    } catch (e) {}
  }
  function act(a) {
    if (a === 'accept') decide(pick(function () { return true; }), 'accept_all');
    else if (a === 'reject') decide(pick(function () { return false; }), 'reject_all');
    else if (a === 'save') decide(pick(function (k) { return draft[k]; }), 'custom');
    else if (a === 'prefs') render('prefs');
    else if (a === 'fab') render('prefs');
  }

  // ---------- UI (Shadow DOM, no global styles) ----------
  function tx() {
    var l = String(cfg.lang || navigator.language || 'en').slice(0, 2).toLowerCase();
    return assign({}, T[l] || T.en, cfg.texts[l] || {});
  }
  function css() {
    return ':host{all:initial}' +
      '.w{--a:' + cfg.accent + ';--r:' + (+cfg.radius) + 'px;--b:' + (+cfg.blur) + 'px;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fg);-webkit-font-smoothing:antialiased}' +
      '.light{--fg:#141a24;--mut:#465062;--bg:rgba(255,255,255,.56);--ln:rgba(255,255,255,.72);--sw:rgba(20,26,36,.14);--sh:0 20px 50px -12px rgba(16,28,56,.35)}' +
      '.dark{--fg:#eef2f8;--mut:#b3bccb;--bg:rgba(18,22,30,.5);--ln:rgba(255,255,255,.16);--sw:rgba(255,255,255,.18);--sh:0 20px 50px -12px rgba(0,0,0,.6)}' +
      '.tint{--fg:#10261f;--mut:#3b574e;--bg:color-mix(in srgb,var(--a) 16%,rgba(255,255,255,.62));--ln:rgba(255,255,255,.8);--sw:rgba(16,38,31,.14);--sh:0 20px 50px -14px color-mix(in srgb,var(--a) 45%,transparent)}' +
      '.light.solid{--bg:#fff;--ln:#dfe3ea}.dark.solid{--bg:#161b24;--ln:#2a3240}.tint.solid{--bg:color-mix(in srgb,var(--a) 10%,#fff)}' +
      '.solid .card,.solid .fab{-webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:0 12px 32px -12px rgba(16,24,40,.28)}' +
      '.glow .card{box-shadow:var(--sh),0 0 0 1px color-mix(in srgb,var(--a) 60%,transparent),0 0 42px -6px color-mix(in srgb,var(--a) 55%,transparent)}' +
      '.hd{display:flex;gap:12px;align-items:center;margin-bottom:6px}.hd h2{margin:0}' +
      '.ico{flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:var(--a);background:color-mix(in srgb,var(--a) 16%,transparent);border:1px solid color-mix(in srgb,var(--a) 30%,transparent)}' +
      '.pill{position:fixed;z-index:2147483000;left:50%;bottom:16px;transform:translateX(-50%);width:min(760px,calc(100% - 32px))}' +
      '.in-c .pill{position:absolute}.pill .m{display:flex;align-items:center;gap:10px 14px;border-radius:999px;padding:8px 8px 8px 20px}' +
      '.pill .m p{flex:1 1 auto;color:var(--fg)}.pill .m .btns{margin:0;flex-wrap:nowrap}.pill .m button{padding:8px 14px;border-radius:999px}.pill .m .pri{flex:0 0 auto}' +
      '.corner,.bar,.center{position:fixed;z-index:2147483000}.in-c .corner,.in-c .bar,.in-c .center,.in-c .fab{position:absolute}' +
      '.corner{left:16px;bottom:16px;width:min(400px,calc(100% - 32px))}.bar{left:16px;right:16px;bottom:16px}' +
      '.center{inset:0;display:grid;place-items:center;padding:16px;background:rgba(8,12,20,.28)}.center .card{width:min(460px,100%)}' +
      '.card,.fab{background:var(--bg);-webkit-backdrop-filter:blur(var(--b)) saturate(170%);backdrop-filter:blur(var(--b)) saturate(170%);border:1px solid var(--ln);box-shadow:var(--sh),inset 0 1px 0 var(--ln)}' +
      '.card{border-radius:var(--r);padding:20px;box-sizing:border-box}' +
      '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.light .card,.light .fab{background:#fff}.dark .card,.dark .fab{background:#161b24}}' +
      '.bar .card.m{display:flex;gap:16px 24px;align-items:center;flex-wrap:wrap}.bar .txt{flex:1 1 380px}.bar .m .btns{margin-top:0}' +
      'h2{margin:0 0 6px;font-size:16px;font-weight:650;letter-spacing:-.01em;line-height:1.3}p{margin:0;color:var(--mut)}' +
      'a{color:inherit;text-decoration:underline;text-underline-offset:2px}' +
      '.btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}' +
      'button{font:inherit;font-weight:600;cursor:pointer;border-radius:calc(var(--r)*.6);padding:10px 16px;border:1px solid transparent;transition:transform .12s,filter .12s}' +
      'button:active{transform:scale(.97)}button:focus-visible,.sw:focus-visible{outline:2px solid var(--a);outline-offset:2px}' +
      '.pri{flex:1 1 0;background:var(--a);color:#fff;white-space:nowrap}.pri:hover{filter:brightness(1.08)}' +
      '.lnk{background:none;color:var(--fg);padding:10px 6px;text-decoration:underline;text-underline-offset:3px;font-weight:500}' +
      '.cats{margin-top:12px}.cat{display:flex;gap:14px;align-items:flex-start;padding:11px 0;border-top:1px solid var(--sw);cursor:pointer}.cat:first-child{border-top:0}' +
      '.cat span{flex:1}.cat b{display:block;font-weight:600}.cat small{display:block;color:var(--mut);font-size:13px;line-height:1.4}' +
      '.sw{-webkit-appearance:none;appearance:none;flex:none;width:38px;height:22px;margin:2px 0 0;border-radius:11px;background:var(--sw);position:relative;cursor:pointer;transition:background .15s}' +
      '.sw::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.35);transition:transform .15s}' +
      '.sw:checked{background:var(--a)}.sw:checked::after{transform:translateX(16px)}.sw:disabled{opacity:.55;cursor:default}' +
      '.brand{margin-top:12px;font-size:11px;color:var(--mut);text-align:right}' +
      '.chat{position:fixed;z-index:2147483000;right:16px;bottom:16px;width:min(330px,calc(100% - 32px));display:flex;flex-direction:column;align-items:flex-end;gap:14px}' +
      '.chat .card{position:relative;width:100%;border-radius:var(--r) var(--r) 4px var(--r)}' +
      '.chat .card.m{padding:16px 16px 14px;font-size:13.5px}.chat .m p b{display:block;color:var(--fg);font-size:14.5px;margin-bottom:3px}' +
      '.chat .card.m::after{content:"";position:absolute;right:16px;bottom:-11px;width:16px;height:11px;background:var(--bg);-webkit-backdrop-filter:blur(var(--b));backdrop-filter:blur(var(--b));clip-path:polygon(0 0,100% 0,100% 100%)}' +
      '.chat .m .btns{margin-top:12px;gap:6px}.chat .m button{border-radius:999px;padding:7px 14px;font-size:13px}.chat .m .pri{flex:0 0 auto}.chat .m .lnk{padding:7px 4px}' +
      '.chat .m .brand{margin-top:8px}' +
      '.dots{display:none;gap:5px;padding:4px 2px}.dots i{width:7px;height:7px;border-radius:50%;background:var(--mut);opacity:.5;animation:fbdot 1s infinite}' +
      '.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}@keyframes fbdot{50%{opacity:1;transform:translateY(-3px)}}' +
      '.chat .typing{width:auto}.chat .typing>*{display:none}.chat .typing>.dots{display:flex}' +
      '.ava{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;padding:0;background:var(--a);color:#fff;border:0;box-shadow:var(--sh)}' +
      '.ava svg{width:26px;height:26px}' +
      '.split{position:fixed;z-index:2147483000;left:50%;bottom:16px;transform:translateX(-50%);width:min(640px,calc(100% - 32px))}' +
      '.split .card.m{display:flex;padding:0;overflow:hidden}.split .art{flex:0 0 150px;display:grid;place-items:center;color:var(--a);background:color-mix(in srgb,var(--a) 18%,transparent)}' +
      '.split .art svg{width:84px;height:84px}.split .body{flex:1;padding:20px 22px}' +
      '.in-c .chat,.in-c .split{position:absolute}' +
      '.fab{position:fixed;z-index:2147483000;left:16px;bottom:16px;width:44px;height:44px;border-radius:50%;padding:0;display:grid;place-items:center;color:var(--fg)}' +
      '.in{animation:fbin .38s cubic-bezier(.2,.8,.2,1)}@keyframes fbin{from{opacity:0;transform:translateY(14px)}}' +
      '@media (prefers-reduced-motion:reduce){.in{animation:none}button,.sw,.sw::after{transition:none}}' +
      '@media (max-width:480px){.corner,.bar{left:8px;right:8px;bottom:8px;width:auto}.pri{flex-basis:100%}' +
      '.chat{right:8px;bottom:8px;width:calc(100% - 16px)}.split{bottom:8px;width:calc(100% - 16px)}.split .card.m{flex-direction:column}.split .art{flex-basis:96px}.split .art svg{width:60px;height:60px}' +
      '.pill .m{flex-wrap:wrap;border-radius:var(--r);padding:14px}.pill .m .btns{flex-wrap:wrap;width:100%}.pill .m .pri{flex:1 1 0}}' +
      /* v0.3.3: phones — keep preferences reachable (scroll inside the card) and respect iPhone safe areas */
      '.card.p{max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;overscroll-behavior:contain}' +
      '@media (max-height:640px){.card.p .btns{position:sticky;bottom:-20px;z-index:1;margin:12px -20px -20px;padding:12px 20px 20px;border-radius:0 0 var(--r) var(--r);background:rgba(255,255,255,.95)}' +
      '.dark .card.p .btns{background:rgba(22,27,36,.96)}.tint .card.p .btns{background:color-mix(in srgb,var(--a) 12%,#fff)}.solid .card.p .btns{background:var(--bg)}}' +
      '.corner,.bar,.pill,.split,.fab{bottom:calc(16px + env(safe-area-inset-bottom,0px))}' +
      '.corner,.bar,.fab{left:calc(16px + env(safe-area-inset-left,0px))}.bar{right:calc(16px + env(safe-area-inset-right,0px))}' +
      '.chat{right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px))}' +
      '.center{padding:calc(16px + env(safe-area-inset-top,0px)) 16px calc(16px + env(safe-area-inset-bottom,0px))}' +
      '@media (max-width:480px){.corner,.bar{left:calc(8px + env(safe-area-inset-left,0px));right:calc(8px + env(safe-area-inset-right,0px));bottom:calc(8px + env(safe-area-inset-bottom,0px))}' +
      '.chat{right:8px}.chat,.split{bottom:calc(8px + env(safe-area-inset-bottom,0px))}.card.p{max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px)}}';
  }
  function mount() {
    if (host) return;
    host = d.createElement('div');
    host.id = 'frostbanner';
    root = host.attachShadow({ mode: 'open' });
    (cfg.container && d.querySelector(cfg.container) || d.body).appendChild(host);
    root.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-a]');
      if (b) act(b.getAttribute('data-a'));
    });
    root.addEventListener('change', function (e) {
      var k = e.target.getAttribute && e.target.getAttribute('data-c');
      if (k) draft[k] = e.target.checked;
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mode === 'banner' && view === 'prefs') { render(stored ? null : 'main'); }
    });
  }
  var COOKIE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 12.5A9 9 0 1 1 11.5 3a3 3 0 0 0 3.5 3.5 3 3 0 0 0 3 3 3 3 0 0 0 3 3z"/>' +
    '<circle cx="8.5" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="15.5" r="1" fill="currentColor"/><circle cx="16" cy="12.5" r=".8" fill="currentColor"/></svg>';
  var ART = '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M58 34A26 26 0 1 1 30 6a7 7 0 0 0 8 8 7 7 0 0 0 7 7 7 7 0 0 0 7 7 7 7 0 0 0 6 6z"/>' +
    '<g fill="#fff" fill-opacity=".85"><circle cx="21" cy="26" r="3.2"/><circle cx="30" cy="42" r="3.6"/><circle cx="42" cy="37" r="2.6"/><circle cx="19" cy="40" r="2.2"/><circle cx="32" cy="22" r="1.8"/></g></svg>';
  function wrap(inner, layout) {
    var th = /^(dark|tint)$/.test(cfg.theme) ? cfg.theme : 'light';
    return '<style>' + css() + '</style><div class="w ' + th + (cfg.glass === false ? ' solid' : '') + (cfg.glow ? ' glow' : '') +
      (cfg.container ? ' in-c' : '') + '">' + (layout ? '<div class="' + layout + '">' + inner + '</div>' : inner) + '</div>';
  }
  function render(v) {
    if (v === null) return showFab();
    mount(); mode = 'banner'; view = v;
    var t = tx(), lay = /^(corner|bar|center|pill|chat|split)$/.test(cfg.layout) ? cfg.layout : 'corner';
    var h = '<div class="card in ' + (v === 'main' ? 'm' : 'p') + '" role="dialog" aria-modal="' + (lay === 'center') + '" aria-labelledby="fbt" aria-describedby="fbd">';
    var pol = ' <a href="' + esc(cfg.policyUrl) + '" target="_blank" rel="noopener">' + esc(t.policy) + '</a>';
    var typing = false;
    var brand = cfg.branding ? '<div class="brand">Powered by FrostBanner</div>' : '', after = '', inner = false;
    if (v === 'main' && lay === 'chat') {
      var typing = !cfg.container && !typed && !(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (typing) h = h.replace('class="card in m"', 'class="card in m typing"');
      h += '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><p id="fbd"><b id="fbt">' + esc(t.title) + '</b>' + esc(t.text) + pol + '</p>' +
        '<div class="btns"><button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button>' +
        '<button class="lnk" data-a="prefs">' + esc(t.prefs) + '</button></div>' + brand;
      after = '<button class="ava in" data-a="prefs" aria-label="' + esc(t.manage) + '">' + COOKIE + '</button>';
      inner = true;
    } else if (v === 'main' && lay === 'split') {
      h += '<div class="art">' + ART + '</div><div class="body"><h2 id="fbt">' + esc(t.title) + '</h2><p id="fbd">' + esc(t.text) + pol + '</p>' +
        '<div class="btns"><button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button>' +
        '<button class="lnk" data-a="prefs">' + esc(t.prefs) + '</button></div>' + brand + '</div>';
      inner = true;
    } else if (v === 'main' && lay === 'pill') {
      h += '<p id="fbd"><span id="fbt">' + esc(t.short) + '</span>' + pol + '</p>' +
        '<div class="btns"><button class="lnk" data-a="prefs">' + esc(t.prefs) + '</button>' +
        '<button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button></div>';
    } else if (v === 'main') {
      h += '<div class="txt">' + (cfg.icon ? '<div class="hd"><span class="ico">' + COOKIE + '</span>' : '') +
        '<h2 id="fbt">' + esc(t.title) + '</h2>' + (cfg.icon ? '</div>' : '') + '<p id="fbd">' + esc(t.text) + pol + '</p></div>' +
        '<div class="btns"><button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button>' +
        '<button class="lnk" data-a="prefs">' + esc(t.prefs) + '</button></div>';
    } else {
      h += '<h2 id="fbt">' + esc(t.manage) + '</h2><p id="fbd">' + esc(t.text) + '</p><div class="cats">';
      each(function (k) {
        var c = t.c[k]; if (!c) return;
        var nec = k === 'necessary';
        h += '<label class="cat"><span><b>' + esc(c[0]) + '</b><small>' + esc(c[1]) + '</small></span>' +
          '<input type="checkbox" role="switch" class="sw" data-c="' + k + '"' +
          (nec || draft[k] ? ' checked' : '') + (nec ? ' disabled title="' + esc(t.always) + '"' : '') + '></label>';
      });
      h += '</div><div class="btns"><button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="save">' + esc(t.save) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button></div>';
    }
    if (!inner && !(v === 'main' && lay === 'pill')) h += brand;
    root.innerHTML = wrap(h + '</div>' + after, lay);
    if (typing) setTimeout(function () { typed = true; var c = root && root.querySelector('.typing'); if (c) c.classList.remove('typing'); }, 900);
    if (v === 'prefs' || lay === 'center') { var f = root.querySelector('.card button, .card input:not([disabled])'); if (f) f.focus({ preventScroll: true }); }
  }
  function showFab() {
    mount(); mode = 'fab';
    root.innerHTML = wrap('<button class="fab in" data-a="fab" aria-label="' + esc(tx().manage) + '" title="' + esc(tx().manage) + '">' +
      COOKIE + '</button>');
  }
  function rerender() { if (mode === 'banner') render(view); else if (mode === 'fab') showFab(); }

  // ---------- boot ----------
  function inRegion() {
    var g = cfg.geo || {};
    return g.mode !== 'eu' || !g.country || EU.indexOf(String(g.country).toUpperCase()) > -1;
  }
  function valid(s) {
    if (!s || !s.c) return false;
    return s.k ? s.k === catKey() : s.v === cfg.version;   // records before v0.3 have no k
  }
  function start() {
    stored = readStore();
    if (valid(stored)) {
      draft = assign({}, stored.c); apply(stored.c, 'restore'); showFab(); return;
    }
    stored = null; draft = { necessary: true };
    embeds({});
    if (!inRegion()) {
      apply(pick(function () { return true; }), 'outside_region');
      emit('skip', { country: cfg.geo.country });
      return;
    }
    render('main');
    emit('shown', { layout: cfg.layout });
  }

  gcm('default'); // must run before any Google tag loads

  // ---------- remote config: /v1/config/:site, cached in localStorage ----------
  // Fresh cache (< 10 min): used as is. Stale cache: used now, refreshed in the background.
  // No cache: wait for the server (max 2.5 s), then fall back to the inline config.
  var CK = 'fb_cfg_' + cfg.site, FRESH = 6e5;
  function cfgUrl() { try { return new URL('/v1/config/' + encodeURIComponent(cfg.site), cfg.endpoint).href; } catch (e) { return null; } }
  function readCache() { try { var o = JSON.parse(w.localStorage.getItem(CK)); return o && o.t ? o : null; } catch (e) { return null; } }
  function fetchRemote(done) {
    var url = cfgUrl(), fin = false;
    function end(r) { if (!fin) { fin = true; done(r); } }
    if (!url || typeof fetch !== 'function') return end(null);
    var tm = setTimeout(function () { end(undefined); }, 2500);
    fetch(url, { credentials: 'omit', cache: 'no-store' }).then(function (res) {
      return res.status === 404 ? { plan: 'free', published: false } : res.ok ? res.json() : null;   // unknown site = Free
    }).then(function (j) {
      clearTimeout(tm);
      if (j) { try { w.localStorage.setItem(CK, JSON.stringify({ t: Date.now(), c: j })); } catch (e) {} }
      end(j || undefined);
    }).catch(function () { clearTimeout(tm); end(undefined); });
  }
  function boot() {
    var remote = user.remote !== false && cfg.site !== 'demo' && cfg.endpoint && !cfg.container;
    if (!remote) return ready();
    var c = readCache();
    if (c && c.c) {
      useRemote(c.c);
      if (Date.now() - c.t > FRESH) fetchRemote(function () {});
      return ready();
    }
    fetchRemote(function (r) { if (r) useRemote(r); ready(); });
  }
  function ready() {
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
  }
  boot();

  // ---------- public API ----------
  w.FrostBanner = {
    version: '0.4.0',
    open: function () { render('prefs'); },
    getConsent: function () { return state ? assign({}, state) : null; },
    on: function (e, f) { (L[e] = L[e] || []).push(f); },
    templates: Object.keys(TPL),
    show: function () { render('main'); },
    configure: function (o) { o = o || {}; if (TPL[o.template]) assign(cfg, TPL[o.template]); assign(cfg, o); rerender(); },
    // New visitor simulation. On a real site, call this and reload the page:
    // scripts that already ran cannot be unloaded.
    reset: function () {
      clearStore(); stored = null; state = null;
      d.querySelectorAll('script[data-fb-clone]').forEach(function (s) { s.remove(); });
      d.querySelectorAll('script[data-fb-run]').forEach(function (s) { s.removeAttribute('data-fb-run'); });
      gcm('update', {});
      if (host) { host.remove(); host = root = null; mode = null; }
      start();
    }
  };
})(window, document);
