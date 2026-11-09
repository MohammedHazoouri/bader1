/* ===== A LOVE LETTER — script ===== */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 820px)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var body = document.body, envelope = $('envelope'), welcome = $('welcome');
  var audio = $('audio'), musicBtn = $('music'), musicMsg = $('musicMsg');
  var START = 134;                       // 02:14
  var opened = false, audioOK = true, started = false;

  /* ---------- Music ---------- */
  function setMusic(state, msg) {
    musicBtn.classList.toggle('playing', state === 'playing');
    musicBtn.setAttribute('aria-label', state === 'playing' ? 'Pause music' : 'Play music');
    musicMsg.textContent = msg || '';
  }
  audio.addEventListener('error', function () {          // missing or unreadable file
    audioOK = false; setMusic('off', 'add love-song.mp3');
  });
  audio.addEventListener('play', function () { setMusic('playing'); });
  audio.addEventListener('pause', function () { setMusic('paused'); });

  function seekThenPlay() {
    function go() {
      if (!started) { try { audio.currentTime = START; } catch (e) {} started = true; }
      var p = audio.play();
      if (p && p.catch) p.catch(function () { if (audioOK) setMusic('paused', 'tap to play'); });
    }
    if (audio.readyState >= 1) go();
    else audio.addEventListener('loadedmetadata', go, { once: true });
    audio.load && audio.readyState === 0 && audio.load();
  }
  musicBtn.addEventListener('click', function () {
    if (!audioOK) return;
    if (audio.paused) { if (!started) seekThenPlay(); else audio.play().catch(function () {}); }
    else audio.pause();                                   // resume continues, never restarts
  });

  /* ---------- Envelope opening ---------- */
  function openEnvelope() {
    if (opened) return; opened = true;
    seekThenPlay();                                       // must happen inside the click gesture
    envelope.classList.add('open');
    welcome.style.backdropFilter = 'blur(2px)';
    burst(reduce ? 0 : 22);
    setTimeout(function () { welcome.classList.add('leave'); }, reduce ? 300 : 3600);
    setTimeout(function () {
      body.classList.remove('locked'); body.classList.add('main-on');
      $('main').setAttribute('aria-hidden', 'false'); musicBtn.hidden = false;
      window.scrollTo(0, 0); observe(); startHearts();
    }, reduce ? 500 : 4300);
  }
  envelope.addEventListener('click', openEnvelope);

  /* ---------- Scroll reveals, finale typing, parallax, progress ---------- */
  function observe() {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); io.unobserve(e.target);
        if (e.target.id === 'finale1') typeFinale(e.target);
      });
    }, { threshold: .25 });
    document.querySelectorAll('.reveal,.reveal-img,#finale1').forEach(function (el, i) { io.observe(el); });
  }
  function typeFinale(el) {                               // letter-by-letter
    var lines = el.dataset.type.split('|'); el.textContent = '';
    var n = 0;
    lines.forEach(function (ln, li) {
      Array.from(ln).forEach(function (ch) {
        var s = document.createElement('span'); s.textContent = ch === ' ' ? '\u00A0' : ch;
        el.appendChild(s);
        setTimeout(function () { s.classList.add('on'); }, reduce ? 0 : 500 + n++ * 70);
      });
      if (li < lines.length - 1) el.appendChild(document.createElement('br'));
      n += 6;
    });
  }
  var ticking = false, bar = $('progress'), imgs = document.querySelectorAll('.photo .px');
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    if (!reduce && !isMobile) imgs.forEach(function (im) {
      var r = im.parentNode.getBoundingClientRect();
      im.style.setProperty('--py', ((r.top + r.height / 2 - innerHeight / 2) * -0.06).toFixed(1) + 'px');
    });
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ---------- Custom cursor (desktop only) ---------- */
  if (fine && !reduce) {
    var cur = $('cursor');
    addEventListener('mousemove', function (e) {
      cur.classList.add('on'); cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
  }

  /* ---------- Floating hearts (occasional) ---------- */
  function heartEl(x, d) {
    var h = document.createElement('span'); h.className = 'fheart'; h.textContent = '♡';
    h.style.left = x + 'vw'; h.style.fontSize = (10 + Math.random() * 14) + 'px';
    h.style.setProperty('--d', d + 's'); h.style.setProperty('--x', (Math.random() * 80 - 40) + 'px');
    document.body.appendChild(h); setTimeout(function () { h.remove(); }, d * 1000 + 200);
  }
  function burst(n) { for (var i = 0; i < n; i++) setTimeout(function () { heartEl(20 + Math.random() * 60, 5 + Math.random() * 4); }, i * 140); }
  function startHearts() {
    if (reduce) return;
    setInterval(function () { if (!document.hidden) heartEl(Math.random() * 100, 9 + Math.random() * 5); }, isMobile ? 7000 : 4500);
  }

  /* ---------- Background particles (canvas) ---------- */
  var cv = $('particles'), ctx = cv.getContext('2d'), P = [];
  function size() { cv.width = innerWidth; cv.height = innerHeight; }
  size(); addEventListener('resize', size);
  if (!reduce) {
    var count = isMobile ? 18 : 42;
    for (var i = 0; i < count; i++) P.push({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 1.8, s: .00004 + Math.random() * .00012, p: Math.random() * 6.28 });
    (function tick(t) {
      if (!document.hidden) {
        ctx.clearRect(0, 0, cv.width, cv.height);
        P.forEach(function (q) {
          q.y -= q.s * 16; if (q.y < -.02) { q.y = 1.02; q.x = Math.random(); }
          var a = .25 + .35 * Math.sin(t / 900 + q.p);
          ctx.beginPath(); ctx.arc(q.x * cv.width + Math.sin(t / 3000 + q.p) * 12, q.y * cv.height, q.r, 0, 6.28);
          ctx.fillStyle = 'rgba(216,166,161,' + a.toFixed(2) + ')'; ctx.shadowColor = 'rgba(232,215,195,.9)'; ctx.shadowBlur = 8; ctx.fill();
        });
      }
      requestAnimationFrame(tick);
    })(0);
  }
})();
