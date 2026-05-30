/* ============================================================
   GLÉCIA GOMES — Landing Page interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- WhatsApp config ----------
     Troque NUMBER pelo número real (formato internacional, só dígitos):
     ex.: '5511999999999'. A mensagem já vai pré-preenchida. */
  var WHATSAPP = {
    link: 'https://w.app/nlj36k'  // link fixo de agendamento
  };
  function buildWhatsURL() {
    return WHATSAPP.link;
  }
  function applyWhats() {
    var url = buildWhatsURL();
    document.querySelectorAll('.js-whats').forEach(function (a) { a.setAttribute('href', url); });
  }

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hero lotus: scroll-scrubbed frame sequence ---------- */
  (function heroScrub() {
    var track = document.getElementById('heroTrack');
    var imgEl = document.getElementById('lotusFrame');
    var cue = document.getElementById('scrollCue');
    if (!track || !imgEl) return;
    var FRAMES = 120;
    function frameUrl(n) { return 'assets/frames/f' + String(n).padStart(3, '0') + '.jpg'; }
    // Preload every frame so scrubbing is instant (no decode stutter).
    var imgs = new Array(FRAMES);
    for (var i = 0; i < FRAMES; i++) { var im = new Image(); im.decoding = 'async'; im.src = frameUrl(i); imgs[i] = im; }
    var current = -1;
    function show(idx) {
      if (idx === current) return;
      current = idx;
      imgEl.src = imgs[idx].src; // served from cache
    }
    show(0);
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight || 800;
      var total = track.offsetHeight - vh;
      var top = track.getBoundingClientRect().top;
      var scrolled = Math.min(Math.max(-top, 0), Math.max(total, 1));
      var p = total > 0 ? scrolled / total : 0;
      var idx = Math.round(p * (FRAMES - 1));
      if (idx < 0) idx = 0; if (idx > FRAMES - 1) idx = FRAMES - 1;
      show(idx);
      if (cue) cue.style.opacity = p > 0.03 ? '0' : '1';
    }
    function onScrubScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScrubScroll, { passive: true });
    window.addEventListener('resize', onScrubScroll, { passive: true });
    window.addEventListener('load', update);
    update();
  })();

  /* ---------- Accordions ---------- */
  document.querySelectorAll('[data-accordion]').forEach(function (acc) {
    acc.querySelectorAll('.acc-item').forEach(function (item) {
      var q = item.querySelector('.acc-q');
      var a = item.querySelector('.acc-a');
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        acc.querySelectorAll('.acc-item.open').forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.acc-a').style.maxHeight = null;
          }
        });
        if (isOpen) {
          item.classList.remove('open');
          a.style.maxHeight = null;
        } else {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  });

  /* ---------- Reveal on scroll (with robust fallbacks) ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  function revealInView() {
    var vh = window.innerHeight || document.documentElement.clientHeight || 800;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.95 && r.bottom > -40) {
        el.classList.add('in');
        reveals.splice(i, 1);
      }
    }
  }
  // Progressive enhancement: IntersectionObserver if it actually fires.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
          var idx = reveals.indexOf(e.target);
          if (idx > -1) reveals.splice(idx, 1);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }
  revealInView();
  window.addEventListener('scroll', revealInView, { passive: true });
  window.addEventListener('resize', revealInView, { passive: true });
  window.addEventListener('load', revealInView);
  setTimeout(revealInView, 300);

  // Backstop: some embedded/preview environments throttle CSS animation
  // interpolation, freezing reveals at opacity 0. Detect that and force every
  // .reveal to its final, transition-free visible state so content is never lost.
  function forceRevealAll() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('in');
      el.style.animation = 'none';
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
  setTimeout(function () {
    var probe = document.querySelector('.reveal.in');
    var stuck = !probe || parseFloat(getComputedStyle(probe).opacity || '0') < 0.1;
    if (stuck) forceRevealAll();
  }, 750);

  /* ---------- Year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ============================================================
     TWEAKS — headline variant + accent color
     ============================================================ */
  var HEADLINES = {
    A: {
      label: 'A · Exaustão emocional',
      html: 'Você cuida de todo mundo.<br><em>Mas quando foi a última vez que cuidou de você?</em>',
      cta: 'Quero minha sessão de acolhimento'
    },
    B: {
      label: 'B · Reconexão',
      html: 'Pare de viver no automático.<br><em>Volte pra você mesma.</em>',
      cta: 'Quero voltar pra mim mesma'
    },
    C: {
      label: 'C · Transformação suave',
      html: 'Você não precisa ser mais forte.<br><em>Você precisa de um espaço só seu.</em>',
      cta: 'Quero meu espaço de acolhimento'
    }
  };
  var ACCENTS = {
    clay:  { label: 'Terracota', c: '#BC6F4E', d: '#A35C3E' },
    moss:  { label: 'Musgo',     c: '#6E8157', d: '#566744' },
    rose:  { label: 'Rosé',      c: '#C0796A', d: '#A86251' },
    ochre: { label: 'Ocre',      c: '#C28A3C', d: '#A2702C' }
  };

  var state = { headline: 'A', accent: 'clay' };
  try {
    var saved = JSON.parse(localStorage.getItem('glecia_tweaks') || '{}');
    if (saved.headline && HEADLINES[saved.headline]) state.headline = saved.headline;
    if (saved.accent && ACCENTS[saved.accent]) state.accent = saved.accent;
  } catch (e) {}

  function applyHeadline() {
    var h = HEADLINES[state.headline];
    var el = document.querySelector('[data-headline]');
    var cta = document.querySelector('[data-cta-label]');
    if (el) el.innerHTML = h.html;
    if (cta) cta.textContent = h.cta;
  }
  function applyAccent() {
    var a = ACCENTS[state.accent];
    document.documentElement.style.setProperty('--accent', a.c);
    document.documentElement.style.setProperty('--accent-deep', a.d);
  }
  function persist() {
    try { localStorage.setItem('glecia_tweaks', JSON.stringify(state)); } catch (e) {}
  }
  applyHeadline();
  applyAccent();

  /* ---------- Tweaks panel (host protocol) ---------- */
  var panel = null;
  function buildPanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'tweaks-panel';
    panel.style.cssText = [
      'position:fixed', 'top:20px', 'right:20px', 'z-index:200',
      'width:300px', 'max-width:calc(100vw - 32px)',
      'background:rgba(251,247,239,0.96)', 'backdrop-filter:blur(16px)',
      'border:1px solid rgba(42,37,32,0.14)', 'border-radius:18px',
      'box-shadow:0 30px 70px -30px rgba(42,37,32,0.6)',
      'font-family:var(--font-body)', 'color:var(--ink)',
      'padding:18px 18px 20px', 'display:none'
    ].join(';');

    var optBtns = function (obj, key) {
      return Object.keys(obj).map(function (k) {
        var sel = state[key] === k;
        var swatch = obj[k].c ? '<span style="width:12px;height:12px;border-radius:50%;background:' + obj[k].c + ';display:inline-block;margin-right:7px;vertical-align:-1px"></span>' : '';
        return '<button data-key="' + key + '" data-val="' + k + '" style="display:block;width:100%;text-align:left;cursor:pointer;margin:6px 0;padding:10px 12px;border-radius:11px;font-size:13px;line-height:1.3;border:1px solid ' + (sel ? 'var(--accent)' : 'rgba(42,37,32,0.14)') + ';background:' + (sel ? 'rgba(188,111,78,0.1)' : '#fff') + ';color:var(--ink);font-weight:' + (sel ? 600 : 500) + '">' + swatch + (obj[k].label) + '</button>';
      }).join('');
    };

    panel.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
        '<strong style="font-family:var(--font-display);font-size:20px;font-weight:600">Tweaks</strong>' +
        '<button id="tw-close" aria-label="Fechar" style="border:none;background:rgba(42,37,32,0.07);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;line-height:1;color:var(--stone)">×</button>' +
      '</div>' +
      '<div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--stone);font-weight:600;margin:4px 0 2px">Headline (teste A/B)</div>' +
      '<div id="tw-headline">' + optBtns(HEADLINES, 'headline') + '</div>' +
      '<div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--stone);font-weight:600;margin:16px 0 2px">Cor de destaque</div>' +
      '<div id="tw-accent">' + optBtns(ACCENTS, 'accent') + '</div>';

    document.body.appendChild(panel);

    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-key]');
      if (b) {
        var key = b.getAttribute('data-key');
        var val = b.getAttribute('data-val');
        state[key] = val;
        if (key === 'headline') applyHeadline();
        if (key === 'accent') applyAccent();
        persist();
        refreshPanel();
      }
    });
    panel.querySelector('#tw-close').addEventListener('click', function () {
      panel.style.display = 'none';
      window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    });
    return panel;
  }
  function refreshPanel() {
    if (!panel || panel.style.display === 'none') return;
    panel.querySelectorAll('button[data-key]').forEach(function (b) {
      var sel = state[b.getAttribute('data-key')] === b.getAttribute('data-val');
      b.style.borderColor = sel ? 'var(--accent)' : 'rgba(42,37,32,0.14)';
      b.style.background = sel ? 'rgba(188,111,78,0.1)' : '#fff';
      b.style.fontWeight = sel ? 600 : 500;
    });
  }

  window.addEventListener('message', function (e) {
    var t = e && e.data && e.data.type;
    if (t === '__activate_edit_mode') { buildPanel().style.display = 'block'; refreshPanel(); }
    else if (t === '__deactivate_edit_mode') { if (panel) panel.style.display = 'none'; }
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  applyWhats();
})();
