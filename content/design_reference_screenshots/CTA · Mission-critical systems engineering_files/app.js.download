// motion: gsap + scrolltrigger + lenis
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none)').matches;
  gsap.registerPlugin(ScrollTrigger);

  // hero background video: hold for reduced-motion (poster image remains).
  // otherwise ensure it plays on ios/safari, where muted autoplay is often blocked
  // (low-power mode) and the native play button sits under the headline. a one-shot
  // tap/click anywhere kicks it off and clears that stuck play button.
  (function () {
    var hv = document.getElementById('herovid');
    if (!hv) return;
    if (reduced) { hv.removeAttribute('autoplay'); hv.pause(); return; }
    var kick = function () { var p = hv.play(); if (p && p.catch) p.catch(function () {}); };
    kick();
    ['touchstart', 'click'].forEach(function (evt) {
      window.addEventListener(evt, function once() { kick(); window.removeEventListener(evt, once); }, { passive: true });
    });
  })();

  // custom cursor stays hidden until the intro loader is done (revealed in boot's loader-complete callback)
  var introCursor = document.querySelector('.cursor'); if (introCursor) introCursor.classList.add('hide');
  document.body.classList.add('is-loading');

  // always land at top on refresh / fresh load (no restored scroll)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  window.addEventListener('beforeunload', function () { window.scrollTo(0, 0); });
  window.addEventListener('pageshow', function (e) {
    window.scrollTo(0, 0);
    // bfcache restore (safari back button): the page comes back with the pixel-dither
    // transition cover still painted over it (black + grain) while the content underneath
    // is scrollable. clear the cover and make sure the page is revealed.
    if (e && e.persisted) {
      var g = document.getElementById('pixelgrid');
      if (g) { g.style.display = 'none'; g.innerHTML = ''; }
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
      if (window.__lenis) { window.__lenis.start(); window.__lenis.scrollTo(0, { immediate: true }); }
    }
  });

  // node-link graph field removed; vfusion is shown with a real pinned media sequence (initvfusion).
  // graphs kept as an empty list so the loader reveal calls stay valid no-ops.
  var graphs = [];
  var rzT;
  window.addEventListener('resize', function () {
    clearTimeout(rzT);
    rzT = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  });

  // line splitter: wrap each visual line for masked reveal
  function splitLines(el) {
    if (el.children.length && !el.querySelector('.in')) {
      // mixed content (manual lines already authored) -> use existing .in
    }
    if (el.querySelector('.in')) return Array.prototype.slice.call(el.querySelectorAll('.in'));
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    var words = text.split(' ');
    el.textContent = '';
    var spans = words.map(function (w, i) {
      var s = document.createElement('span'); s.className = 'w'; s.style.display = 'inline-block'; s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return s;
    });
    var lines = [], cur = null, top = null;
    spans.forEach(function (s) {
      var t = s.offsetTop;
      if (top === null || Math.abs(t - top) > 3) { cur = []; lines.push(cur); top = t; }
      cur.push(s);
    });
    el.textContent = '';
    var inners = [];
    lines.forEach(function (line) {
      var ln = document.createElement('span'); ln.className = 'ln';
      var inn = document.createElement('span'); inn.className = 'in';
      line.forEach(function (s, j) { inn.appendChild(document.createTextNode(s.textContent + (j < line.length - 1 ? ' ' : ''))); });
      ln.appendChild(inn); el.appendChild(ln); inners.push(inn);
    });
    return inners;
  }

  var splitEls = Array.prototype.slice.call(document.querySelectorAll('[data-split]'));
  var heroInners = Array.prototype.slice.call(document.querySelectorAll('#heroH1 .in'));
  var heroEl = document.getElementById('heroH1');
  if (heroEl) heroEl.classList.add('split');

  if (reduced) {
    document.querySelectorAll('[data-rv]').forEach(function (e) { e.style.opacity = 1; e.style.transform = 'none'; });
    heroInners.forEach(function (i) { i.style.transform = 'none'; });
    splitEls.forEach(function (el) { el.classList.add('split'); });
  } else {
    // prep splits + initial states
    splitEls.forEach(function (el) {
      el.classList.add('split');
      var inners = splitLines(el);
      gsap.set(inners, { yPercent: 115 });
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: function () { gsap.to(inners, { yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: 0.08 }); }
      });
    });
    gsap.set(heroInners, { yPercent: 115 });
    // generic reveals (hero items are handled by the intro timeline)
    document.querySelectorAll('[data-rv]').forEach(function (el) {
      gsap.set(el, { opacity: 0, y: 22 });
      if (el.closest('.hero')) return;
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: function () { gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }); }
      });
    });
  }

  /* image parallax on capability + closing backgrounds */
  if (!reduced) {
    document.querySelectorAll('.cap2 .bg img, .close .bg img, .careers .bg img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: img.closest('.bg'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* engineering section frames: scroll-drawn 1px border + corner crosshair ticks */
  document.querySelectorAll('[data-frame]').forEach(function (sec) {
    var f = document.createElement('div'); f.className = 'frame';
    ['ht', 'hb', 'vl', 'vr'].forEach(function (c) { var i = document.createElement('i'); i.className = c; f.appendChild(i); });
    ['tl', 'tr', 'bl', 'br'].forEach(function (c) { var b = document.createElement('b'); b.className = c; f.appendChild(b); });
    sec.appendChild(f);
    if (reduced) return; // reduced-motion css rule reveals frame statically
    var lines = f.querySelectorAll('i'), ticks = f.querySelectorAll('b');
    ScrollTrigger.create({
      trigger: sec, start: 'top 86%', once: true,
      onEnter: function () {
        gsap.to(lines, { scaleX: 1, scaleY: 1, duration: 0.85, ease: 'power3.inOut', stagger: 0.05 });
        gsap.to(ticks, { opacity: 1, duration: 0.4, ease: 'power1.out', delay: 0.45, stagger: 0.04 });
      }
    });
  });

  /* stat numbers: instrument decode on scroll-in (same vocabulary as the
     heritage ruler). final text is set up front so the tiles never reflow. */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var finalText = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    el.textContent = finalText;
    if (reduced) return;
    var row = el.closest('.vf-stats, .stats');
    var delay = row ? 0.14 * Array.prototype.indexOf.call(row.querySelectorAll('[data-count]'), el) : 0;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () {
        gsap.delayedCall(delay, function () { scrambleYear(el, finalText, { duration: 0.9 }); });
      }
    });
  });

  // vfusion pinned media sequence: scrub 3 real-media stages (ingest, enrich, predict)
  (function initVFusion() {
    var seq = document.getElementById('vfSeq');
    if (!seq) return;
    var frames = seq.querySelectorAll('.vf-frame');
    var stages = seq.querySelectorAll('.vf-stage');
    var fill = document.getElementById('vfFill');
    var num = document.getElementById('vfNum');
    // no pin on small screens or reduced-motion. is-static (desktop 3-col static) only for
    // reduced-motion on wider screens; mobile layout is owned by the max-width:820 media query.
    var isMobile = window.matchMedia('(max-width:820px)').matches;
    if (reduced && !isMobile) seq.classList.add('is-static');
    if (reduced || isMobile) return;
    function sstep(x) { x = x < 0 ? 0 : (x > 1 ? 1 : x); return x * x * (3 - 2 * x); }
    var b1 = 1 / 3, b2 = 2 / 3, tw = 0.11;
    if (frames[0]) frames[0].style.opacity = 1;
    if (stages[0]) stages[0].style.opacity = 1;
    ScrollTrigger.create({
      // refreshPriority: this pin must refresh before the generic triggers created
      // above it, so everything below the sequence measures pin-spaced positions
      // (otherwise reveals/decodes fire ~220vh early, offscreen, while pinned)
      trigger: seq, start: 'top top', end: '+=220%', pin: true, scrub: 0.5, anticipatePin: 1, refreshPriority: 1,
      onUpdate: function (self) {
        var p = self.progress;
        var w0 = 1 - sstep((p - (b1 - tw)) / (2 * tw));
        var w2 = sstep((p - (b2 - tw)) / (2 * tw));
        var w1 = 1 - w0 - w2; if (w1 < 0) w1 = 0;
        var w = [w0, w1, w2];
        for (var i = 0; i < frames.length; i++) {
          if (frames[i]) frames[i].style.opacity = w[i].toFixed(3);
          if (stages[i]) { stages[i].style.opacity = w[i].toFixed(3); stages[i].style.transform = 'translateY(' + ((1 - w[i]) * 26).toFixed(1) + 'px)'; }
        }
        if (fill) fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
        if (num) num.textContent = p < b1 ? '01' : (p < b2 ? '02' : '03');
      }
    });
  })();

  // smooth scroll (lenis) + scrolltrigger sync
  var lenis;
  function initLenis() {
    if (reduced) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95 });
    window.__lenis = lenis;
    lenis.scrollTo(0, { immediate: true, force: true });
    window.addEventListener('load', function () { window.scrollTo(0, 0); lenis.scrollTo(0, { immediate: true, force: true }); });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length > 1) { var t = document.querySelector(id); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: 0, duration: 1.4 }); } }
      });
    });
  }

  // custom cursor
  function initCursor() {
    if (touch) return;
    var cur = document.querySelector('.cursor');
    var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    gsap.ticker.add(function () { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; });
    document.querySelectorAll('a,button,.man .ln2,[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cur.classList.add('on'); });
      el.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
    });
  }

  /* uniform text-roll on buttons + nav links (replaces the magnetic drag) */
  function initTextRoll() {
    document.querySelectorAll('.btn, .go, .nav-c a, .nav-r a').forEach(function (el) {
      if (el.querySelector('.roll')) return;
      var arw = el.querySelector('.arw'); var arwHTML = arw ? ' ' + arw.outerHTML : '';
      if (arw) arw.remove();
      var text = el.textContent.replace(/\s+/g, ' ').trim(); if (!text) return;
      var esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      el.innerHTML = '<span class="roll"><span>' + esc + '</span><span aria-hidden="true">' + esc + '</span></span>' + arwHTML;
      el.classList.add('has-roll');
    });
  }

  /* global film-grain overlay (all pages, incl. the loader) */
  function initGrain() {
    var g = document.createElement('div'); g.className = 'grain-overlay'; g.setAttribute('aria-hidden', 'true');
    document.body.appendChild(g);
    if (reduced) return;
    var last = 0, gate = 1000 / 12;
    function tick(t) {
      if (t - last >= gate) { last = t; g.style.backgroundPosition = ((Math.random() * 424) | 0) + 'px ' + ((Math.random() * 380) | 0) + 'px'; }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // preloader intro
  // pixel grid: flex columns of square divs, ~10 cols, animated by opacity
  var pixel = { cells: [] };
  function buildPixelGrid() {
    var grid = document.getElementById('pixelgrid');
    if (!grid) return;
    grid.style.display = 'flex';
    grid.innerHTML = '';
    var W = grid.clientWidth || innerWidth, H = grid.clientHeight || innerHeight;
    var s = Math.ceil(W / 10);
    var cols = Math.ceil(W / s), rows = Math.ceil(H / s);
    var cells = [];
    for (var c = 0; c < cols; c++) {
      var col = document.createElement('div'); col.className = 'pxcol';
      for (var r = 0; r < rows; r++) {
        var px = document.createElement('div'); px.className = 'px';
        px.style.width = s + 'px';
        col.appendChild(px); cells.push(px);
      }
      grid.appendChild(col);
    }
    pixel.cells = cells;
  }

  function showHeroInstant() {
    graphs.forEach(function (g) { g.reveal = 1; });
    document.querySelectorAll('.hero [data-rv]').forEach(function (e) { gsap.set(e, { opacity: 1, y: 0 }); });
    gsap.set(heroInners, { yPercent: 0 });
  }

  /* the loading word as hand-authored bitmap glyphs on the cell grid (each lit
     cell becomes one square). replaces font rasterization so the letterforms
     are identical on every viewport — no threshold artifacts (clipped ring
     corners, short I, stray diagonal cells). */
  function rasterLoadingCells(Gx, Gy) {
    var GLYPHS = {
      L: ['X...', 'X...', 'X...', 'X...', 'X...', 'X...', 'XXXX'],
      O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
      A: ['..X..', '.X.X.', '.X.X.', 'X...X', 'XXXXX', 'X...X', 'X...X'],
      D: ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.'],
      I: ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
      N: ['X...X', 'XX..X', 'XX..X', 'X.X.X', 'X..XX', 'X..XX', 'X...X'],
      G: ['.XXX.', 'X...X', 'X....', 'X..XX', 'X...X', 'X...X', '.XXXX']
    };
    var word = 'LOADING', gap = 3, glyphH = 7;
    var widths = [], total = gap * (word.length - 1);
    for (var i = 0; i < word.length; i++) { widths.push(GLYPHS[word.charAt(i)][0].length); total += widths[i]; }
    var x0 = Math.max(0, Math.floor((Gx - total) / 2));
    var y0 = Math.max(0, Math.floor((Gy - glyphH) / 2));
    var cells = [], cx = x0;
    for (var i = 0; i < word.length; i++) {
      var g = GLYPHS[word.charAt(i)];
      for (var r = 0; r < glyphH; r++) for (var c = 0; c < widths[i]; c++) {
        if (g[r].charAt(c) === 'X') cells.push([cx + c, y0 + r]);
      }
      cx += widths[i] + gap;
    }
    return cells;
  }

  // serpentine-dither intro (webgl), b&w. returns false if unsupported.
  function runShaderIntro(done) {
    var loader = document.getElementById('loader');
    if (!loader) return false;
    var cv = document.createElement('canvas'); cv.id = 'glload';
    var gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return false;
    // hide all existing loader chrome; the shader canvas IS the opaque cover (clears top->bottom on exit)
    Array.prototype.forEach.call(loader.children, function (el) { el.style.display = 'none'; });
    loader.appendChild(cv);

    var COLS = 9.0, SUB = 6.0;
    var VERT = 'attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.,1.);}';
    var FRAG =
      'precision highp float;uniform vec2 uRes;uniform float uTime;uniform float uProgress;uniform float uForm;uniform float uExit;' +
      'const float COLS=' + COLS.toFixed(1) + ';const float SUB=' + SUB.toFixed(1) + ';' +
      'const vec3 BG=vec3(0.006);' +
      'float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}' +
      'void main(){vec2 uv=gl_FragCoord.xy/uRes;uv.y=1.-uv.y;' +
      'float rows=max(1.,floor(COLS*uRes.y/uRes.x));vec2 cell=vec2(COLS,rows);vec2 bId=floor(uv*cell);vec2 bUv=fract(uv*cell);float total=COLS*rows;' +
      'float colOrder=mod(bId.y,2.)<.5?bId.x:(COLS-1.-bId.x);float order=(bId.y*COLS+colOrder)/total;' +
      'float p=uProgress;float pB=clamp(p/0.80,0.,1.);' +
      'float span=0.13;float bl=clamp((pB-order*(1.-span))/span,0.,1.);' +
      'vec2 dId=floor(bUv*SUB);vec2 dUv=fract(bUv*SUB);float rnd=hash21(bId*9.13+dId);' +
      'float sq=step(max(abs(dUv.x-.5),abs(dUv.y-.5)),0.38);' +
      'float present=step(rnd,bl*0.42);float dot=present*sq;' +
      'float tone=0.86+0.11*step(0.5,hash21(bId*3.7+1.));' +
      'float lvl=hash21(bId*2.3+dId*0.7);float op=lvl<0.22?0.46:(lvl<0.45?0.74:1.0);' +
      'float ph=hash21(bId*5.5+dId*1.7)*6.2831;float spd=1.05+2.3*hash21(bId*1.7+dId*2.3);' +
      'float depth=mix(0.16,0.66,step(0.88,lvl));' +
      'float breath=max((1.0-depth)+depth*sin(uTime*spd+ph),0.0);' +
      'float front=smoothstep(0.09,0.,abs(pB-order));' +
      'float bright=mix(tone*op*breath,1.0,front*0.6);' +
      'float lockPulse=smoothstep(0.60,0.80,p)*(1.0-smoothstep(0.80,0.92,p));' +
      'bright=mix(bright,1.0,smoothstep(0.62,0.80,p)*op*0.55)+0.28*lockPulse;' +
      'bright=clamp(bright,0.0,1.0);' +
      // scatter dissolves as the word particles take over
      'float scatterVis=1.-smoothstep(0.0,0.50,uForm);' +
      'vec3 col=mix(BG,vec3(bright),dot*scatterVis);' +
      'if(uExit<0.001){gl_FragColor=vec4(col,1.0);}else{' +
      'float rowN=bId.y/max(rows-1.,1.);' +
      'float jitter=(hash21(bId+7.3)-.5)*.12;' +
      'float a=1.-clamp((uExit-rowN*0.60-jitter)/0.24,0.,1.);' +
      'gl_FragColor=vec4(col,a);}}' ;
    // word recruits: each lit LOADING cell is filled by a real square pulled out
    // of the built scatter field — same size, same grid, same tone — so the word
    // assembles from the field instead of arriving as a second system.
    var PVERT =
      'attribute vec2 aTarget;attribute vec2 aStart;attribute vec2 aCtrl;attribute float aRow;attribute float aRand;' +
      'uniform float uForm2;uniform float uPSize;' +
      'varying float vArr;varying float vRow;varying float vRand;' +
      'void main(){' +
      'float st=aRand*0.34;' +                                  // staggered launch, spread out
      'float e=clamp((uForm2-st)/(1.0-0.34),0.0,1.0);' +
      'e=e*e*e*(e*(e*6.0-15.0)+10.0);' +                        // smootherstep: no abrupt start/stop
      'float u=1.0-e;' +
      'vec2 pos=u*u*aStart+2.0*u*e*aCtrl+e*e*aTarget;' +        // quadratic bezier arc (curved path)
      'gl_Position=vec4(pos,0.0,1.0);' +
      'gl_PointSize=uPSize;' +                                  // field-square size, constant in flight
      'vArr=e;vRow=aRow;vRand=aRand;}';
    var PFRAG =
      'precision highp float;uniform float uExit2;varying float vArr;varying float vRow;varying float vRand;' +
      'void main(){vec2 pc=gl_PointCoord-0.5;' +
      'if(max(abs(pc.x),abs(pc.y))>0.36)discard;' +
      'float op=vRand<0.22?0.5:(vRand<0.5?0.78:1.0);' +
      'float bright=0.88+0.12*step(0.5,fract(vRand*7.0));' +
      'float a=op*smoothstep(0.0,0.12,vArr);' +                 // appears at launch, from the source square
      'if(uExit2>0.001){a*=1.-clamp((uExit2-vRow*0.60-(vRand-0.5)*0.12)/0.24,0.,1.);}' +
      'if(a<=0.002)discard;' +
      'gl_FragColor=vec4(vec3(bright),a);}';
    function sh(t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cv.remove(); return false; }
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPos');
    var uRes = gl.getUniformLocation(prog, 'uRes'), uTime = gl.getUniformLocation(prog, 'uTime'),
      uProgress = gl.getUniformLocation(prog, 'uProgress'), uForm = gl.getUniformLocation(prog, 'uForm'),
      uExit = gl.getUniformLocation(prog, 'uExit');
    // particle program (converging LOADING squares)
    var pprog = gl.createProgram();
    gl.attachShader(pprog, sh(gl.VERTEX_SHADER, PVERT));
    gl.attachShader(pprog, sh(gl.FRAGMENT_SHADER, PFRAG));
    gl.linkProgram(pprog);
    var hasParticles = gl.getProgramParameter(pprog, gl.LINK_STATUS);
    var pbuf = gl.createBuffer(), pCount = 0;
    var aTarget, aStart, aCtrl, aRow, aRand, uForm2, uExit2, uPSize;
    if (hasParticles) {
      aTarget = gl.getAttribLocation(pprog, 'aTarget'); aStart = gl.getAttribLocation(pprog, 'aStart');
      aCtrl = gl.getAttribLocation(pprog, 'aCtrl');
      aRow = gl.getAttribLocation(pprog, 'aRow'); aRand = gl.getAttribLocation(pprog, 'aRand');
      uForm2 = gl.getUniformLocation(pprog, 'uForm2'); uExit2 = gl.getUniformLocation(pprog, 'uExit2');
      uPSize = gl.getUniformLocation(pprog, 'uPSize');
    }
    // fp32-mimicking twin of the field shader's hash21 — lets JS know which
    // squares the GPU actually draws, so recruits launch from real squares.
    function h21(x, y) {
      var f = Math.fround;
      var px = f(x * f(123.34)); px = f(px - Math.floor(px));
      var py = f(y * f(456.21)); py = f(py - Math.floor(py));
      var d = f(f(px * f(px + f(45.32))) + f(py * f(py + f(45.32))));
      px = f(px + d); py = f(py + d);
      var m = f(px * py);
      return f(m - Math.floor(m));
    }
    function buildPoints() {
      if (!hasParticles) return;
      var rows = Math.max(1, Math.floor(COLS * cv.height / cv.width));
      var C = COLS * SUB, R = rows * SUB;
      var Gx = Math.round(0.92 * C), Gy = Math.round(0.30 * R);
      var c0 = Math.floor((C - Gx) / 2), r0 = Math.floor((R - Gy) / 2);
      var cells = rasterLoadingCells(Gx, Gy);
      // every square the built field shows (0.415 margin dodges fp32 edge cases)
      var sources = [];
      for (var by = 0; by < rows; by++) for (var bx = 0; bx < COLS; bx++)
        for (var dy = 0; dy < SUB; dy++) for (var dx = 0; dx < SUB; dx++) {
          if (h21(bx * 9.13 + dx, by * 9.13 + dy) < 0.415) {
            sources.push({
              x: ((bx + (dx + 0.5) / SUB) / COLS) * 2 - 1,
              y: 1 - ((by + (dy + 0.5) / SUB) / rows) * 2,
              lvl: h21(bx * 2.3 + dx * 0.7, by * 2.3 + dy * 0.7),
              used: false
            });
          }
        }
      var arr = new Float32Array(cells.length * 8);
      for (var i = 0; i < cells.length; i++) {
        // word cells sit on the exact field lattice, so recruits land flush
        var tx = ((c0 + cells[i][0] + 0.5) / C) * 2 - 1;
        var ty = 1 - ((r0 + cells[i][1] + 0.5) / R) * 2;
        // nearest unused lit square is the recruit
        var best = -1, bd = 1e9;
        for (var s = 0; s < sources.length; s++) {
          if (sources[s].used) continue;
          var ddx = sources[s].x - tx, ddy = sources[s].y - ty, d2 = ddx * ddx + ddy * ddy;
          if (d2 < bd) { bd = d2; best = s; }
        }
        var src = best >= 0 ? sources[best] : { x: tx, y: ty, lvl: Math.random() };
        if (best >= 0) sources[best].used = true;
        var sx = src.x, sy = src.y;
        // control point: midpoint pushed perpendicular; curvature scales with
        // path length so short hops stay near-straight
        var mx = (sx + tx) / 2, my = (sy + ty) / 2, dx = tx - sx, dy = ty - sy;
        var pl = Math.hypot(dx, dy), amt = (Math.random() * 2 - 1) * 0.35 * pl;
        var o = i * 8;
        arr[o] = tx; arr[o + 1] = ty;                     // aTarget
        arr[o + 2] = sx; arr[o + 3] = sy;                 // aStart (a real field square)
        arr[o + 4] = pl ? mx + (-dy / pl) * amt : mx;     // aCtrl
        arr[o + 5] = pl ? my + (dx / pl) * amt : my;
        arr[o + 6] = Gy > 1 ? cells[i][1] / (Gy - 1) : 0; // aRow (top->bottom)
        arr[o + 7] = src.lvl;                             // carries the source's tone tier
      }
      pCount = cells.length;
      gl.bindBuffer(gl.ARRAY_BUFFER, pbuf);
      gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
    }
    var pSizePx = 1;
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(innerWidth * dpr); cv.height = Math.floor(innerHeight * dpr);
      cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
      gl.viewport(0, 0, cv.width, cv.height);
      pSizePx = (cv.width / (COLS * SUB)) * (0.38 / 0.36); // recruit square == field square footprint
      buildPoints();
    }
    window.addEventListener('resize', resize); resize();

    // hero text/nav/graph stay hidden; squares fade down over the video (no black void on exit)
    graphs.forEach(function (g) { g.reveal = 0; });
    gsap.set('nav', { yPercent: -80, opacity: 0 });
    gsap.set('.hero .inner', { opacity: 0 });
    gsap.set(heroInners, { yPercent: 108, opacity: 0 });
    gsap.set('.hero [data-rv]', { opacity: 0, y: 14 });
    var heroVid = document.getElementById('herovid');
    if (heroVid) { heroVid.pause(); gsap.set(heroVid, { opacity: 0 }); }
    var BUILD = 1.75, FORM = 1.5, HOLD = 0.5, EXIT = 1.85, start = null, running = true, bgDropped = false, videoOn = false, textIn = false, ended = false;
    function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function easeOut(t) { return 1 - Math.pow(1 - t, 2.4); }
    function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function revealText() {
      if (textIn) return;
      textIn = true;
      document.body.classList.remove('is-loading');
      var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.to('nav', { yPercent: 0, opacity: 1, duration: 1.15, ease: 'power2.out' }, 0);
      tl.to('.hero .inner', { opacity: 1, duration: 1.0, ease: 'power1.inOut' }, 0.08);
      tl.to('.hero [data-rv]', { opacity: 1, y: 0, duration: 1.15, stagger: 0.06, ease: 'power2.out' }, 0.14);
      tl.to(heroInners, { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.085, ease: 'power2.out' }, 0.2);
      tl.to(graphs, { reveal: 1, duration: 1.45, ease: 'power1.inOut' }, 0.32);
    }
    function tick(now) {
      if (!running) return;
      if (start === null) start = now;
      var el = (now - start) / 1000;
      var bp = Math.min(el / BUILD, 1);
      var fp = el <= BUILD ? 0 : Math.min((el - BUILD) / FORM, 1);
      var holdEnd = BUILD + FORM + HOLD;
      var rawEx = el <= holdEnd ? 0 : Math.min((el - holdEnd) / EXIT, 1);
      var ex = easeOut(rawEx);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // pass 1: fullscreen scatter build + opaque cover (clears top->bottom on exit)
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uTime, el);
      gl.uniform1f(uProgress, ease(bp)); gl.uniform1f(uForm, easeInOut(fp)); gl.uniform1f(uExit, ex);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // pass 2: converging LOADING particles on top
      if (hasParticles && pCount) {
        gl.useProgram(pprog);
        gl.bindBuffer(gl.ARRAY_BUFFER, pbuf);
        gl.enableVertexAttribArray(aTarget); gl.vertexAttribPointer(aTarget, 2, gl.FLOAT, false, 32, 0);
        gl.enableVertexAttribArray(aStart); gl.vertexAttribPointer(aStart, 2, gl.FLOAT, false, 32, 8);
        gl.enableVertexAttribArray(aCtrl); gl.vertexAttribPointer(aCtrl, 2, gl.FLOAT, false, 32, 16);
        gl.enableVertexAttribArray(aRow); gl.vertexAttribPointer(aRow, 1, gl.FLOAT, false, 32, 24);
        gl.enableVertexAttribArray(aRand); gl.vertexAttribPointer(aRand, 1, gl.FLOAT, false, 32, 28);
        gl.uniform1f(uForm2, fp); gl.uniform1f(uExit2, ex); gl.uniform1f(uPSize, pSizePx);
        gl.drawArrays(gl.POINTS, 0, pCount);
        gl.disableVertexAttribArray(aTarget); gl.disableVertexAttribArray(aStart); gl.disableVertexAttribArray(aCtrl);
        gl.disableVertexAttribArray(aRow); gl.disableVertexAttribArray(aRand);
      }
      // exit phase only: drop loader bg + start hero video beneath the clearing shader
      if (ex > 0 && !bgDropped) { bgDropped = true; loader.style.background = 'transparent'; }
      if (ex > 0 && !videoOn && heroVid) {
        videoOn = true;
        heroVid.play();
        gsap.to(heroVid, { opacity: 0.82, duration: EXIT * 0.95, ease: 'power1.inOut' });
      }
      // content fades in while lower squares are still clearing
      if (ex >= 0.55 && !textIn) revealText();
      if (ex >= 1 && !ended) {
        ended = true; running = false;
        loader.style.display = 'none'; cv.remove();
        window.removeEventListener('resize', resize);
        if (!textIn) revealText();
        done();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return true;
  }

  function runLoader(done) {
    var loader = document.getElementById('loader');
    var grid = document.getElementById('pixelgrid');
    var count = document.getElementById('lcount');
    var bar = document.getElementById('lbar');

    // full counter+pixel intro is home/hero only; replays on every home load
    // (refresh or navigating back). subpages get only the quick dither-in.
    var isHome = !!document.getElementById('heroH1');

    if (reduced) {
      loader.style.display = 'none';
      if (grid) grid.style.display = 'none';
      showHeroInstant();
      done(); return;
    }

    if (!isHome) {
      // subpage: skip the counter, just dither the page in
      loader.style.display = 'none';
      buildPixelGrid();
      gsap.set(pixel.cells, { opacity: 1 });
      showHeroInstant();
      gsap.to(pixel.cells, {
        opacity: 0, duration: 0.28, ease: 'none', stagger: { amount: 0.6, from: 'random' },
        onComplete: function () { if (grid) grid.style.display = 'none'; }
      });
      done(); return;
    }

    // home: bespoke serpentine-dither shader intro (falls back to pixel-dither below)
    if (runShaderIntro(done)) return;

    buildPixelGrid();
    gsap.set(pixel.cells, { opacity: 0 });
    var o = { v: 0 };
    var tl = gsap.timeline({
      onComplete: function () { if (grid) grid.style.display = 'none'; done(); }
    });
    // 1: counter + bar on black
    tl.to(o, {
      v: 100, duration: 1.6, ease: 'power1.inOut',
      onUpdate: function () {
        var v = Math.round(o.v);
        count.textContent = v;
        bar.style.right = (100 - v) + '%';
      }
    }, 0);
    tl.to(graphs, { reveal: 1, duration: 1.4, ease: 'power2.out' }, 0.3);
    // 2: pixels snap to cover; hero set to final state, loader removed beneath
    tl.set(pixel.cells, { opacity: 1 }, 1.7);
    tl.call(showHeroInstant, null, 1.72);
    tl.set(loader, { display: 'none' }, 1.74);
    tl.from('nav', { yPercent: -120, duration: 0.7, ease: 'expo.out' }, 1.85);
    // 3: pixels dither out, hero dithers into view
    tl.to(pixel.cells, { opacity: 0, duration: 0.28, ease: 'none', stagger: { amount: 0.7, from: 'random' } }, 1.8);
  }

  // company mega dropdown
  function initMega() {
    var navr = document.querySelector('.nav-r');
    if (!navr) return;
    var trig = document.createElement('button');
    trig.className = 'megatrig'; trig.type = 'button'; trig.setAttribute('aria-expanded', 'false');
    trig.innerHTML = 'Company <span class="pm" aria-hidden="true"></span>';
    navr.appendChild(trig);

    var mega = document.createElement('div');
    mega.className = 'mega'; mega.id = 'mega'; mega.setAttribute('aria-hidden', 'true');
    mega.innerHTML =
      '<div class="mega-inner wrap">' +
        '<b class="mtick tl" aria-hidden="true">+</b><b class="mtick tr" aria-hidden="true">+</b>' +
        '<b class="mtick bl" aria-hidden="true">+</b><b class="mtick br" aria-hidden="true">+</b>' +
        '<div class="mega-lead">' +
          '<div class="label dim">CTA Inc. / Est. 1979</div>' +
          '<p class="mega-stmt disp">Systems engineering for the missions that cannot fail.</p>' +
          '<div class="mega-meta">' +
            '<a class="mega-cta" href="/contact"><span class="label dim">Contact</span><span class="ml">Start a conversation</span></a>' +
            '<a class="mega-cta" href="https://www.linkedin.com/company/cta-inc" target="_blank" rel="noopener"><span class="label dim">Social</span><span class="ml">LinkedIn</span></a>' +
          '</div>' +
        '</div>' +
        '<div class="mega-cols">' +
          '<div class="mega-col">' +
            '<div class="label dim">Capabilities</div>' +
            '<a href="/capabilities#ai"><span class="ix">01</span><span class="lb">AI for Healthcare &amp; Defense</span><span class="arw">→</span></a>' +
            '<a href="/capabilities#data"><span class="ix">02</span><span class="lb">Enterprise Data</span><span class="arw">→</span></a>' +
            '<a href="/capabilities#mfg"><span class="ix">03</span><span class="lb">DoD Manufacturing</span><span class="arw">→</span></a>' +
            '<a href="/capabilities#cyber"><span class="ix">04</span><span class="lb">Cybersecurity</span><span class="arw">→</span></a>' +
            '<a href="/capabilities#vf"><span class="ix">05</span><span class="lb">VFusion™</span><span class="arw">→</span></a>' +
          '</div>' +
          '<div class="mega-col">' +
            '<div class="label dim">Company</div>' +
            '<a href="/about"><span class="ix">01</span><span class="lb">About CTA</span><span class="arw">→</span></a>' +
            '<a href="/about#heritage"><span class="ix">02</span><span class="lb">Our Origins</span><span class="arw">→</span></a>' +
            '<a href="/projects"><span class="ix">03</span><span class="lb">Project Examples</span><span class="arw">→</span></a>' +
            '<a href="/about#careers"><span class="ix">04</span><span class="lb">Careers</span><span class="arw">→</span></a>' +
            '<a href="/contact"><span class="ix">05</span><span class="lb">Contact</span><span class="arw">→</span></a>' +
          '</div>' +
        '</div>' +
        '<div class="mega-foot cap-stmt">' +
          '<span>DUNS #193973948</span><span>NAICS 332999 / 541511 / 518210</span><span>GSA GS-35F-320DA</span><span>ISO 9001:2015</span><span>CMMC Certified Professional</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(mega);

    var revealEls = mega.querySelectorAll('.mega-lead, .mega-col a, .mega-foot');
    var isOpen = false, closeT;
    function open() {
      clearTimeout(closeT); if (isOpen) return; isOpen = true;
      mega.classList.add('open'); trig.classList.add('open');
      mega.setAttribute('aria-hidden', 'false'); trig.setAttribute('aria-expanded', 'true');
      if (!reduced) {
        gsap.killTweensOf(revealEls);
        gsap.fromTo(revealEls, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.035, delay: 0.06 });
      }
    }
    function shut() {
      isOpen = false; mega.classList.remove('open'); trig.classList.remove('open');
      mega.setAttribute('aria-hidden', 'true'); trig.setAttribute('aria-expanded', 'false');
    }
    function close() { closeT = setTimeout(shut, 140); }
    trig.addEventListener('mouseenter', open);
    trig.addEventListener('mouseleave', close);
    mega.addEventListener('mouseenter', function () { clearTimeout(closeT); });
    mega.addEventListener('mouseleave', close);
    trig.addEventListener('click', function (e) { e.preventDefault(); isOpen ? shut() : open(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) shut(); });
  }

  // mobile nav: burger + full-screen drawer (injected once, all pages, <900px)
  function initMobileNav() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var burger = document.createElement('button');
    burger.className = 'burger'; burger.type = 'button';
    burger.setAttribute('aria-label', 'Menu'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-controls', 'mdrawer');
    burger.innerHTML = '<span></span><span></span>';
    nav.appendChild(burger);

    function norm(p) { p = p.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, ''); if (p.length > 1) p = p.replace(/\/+$/, ''); return p || '/'; }
    var here = norm(location.pathname);
    function cur(p) { return norm(p) === here ? ' aria-current="page"' : ''; }
    var drawer = document.createElement('div');
    drawer.className = 'mdrawer'; drawer.id = 'mdrawer'; drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML =
      '<div class="mdrawer-in">' +
        '<div class="mnav-links">' +
          '<a href="/about"' + cur('/about') + '><span class="ix">01</span>About</a>' +
          '<a href="/capabilities"' + cur('/capabilities') + '><span class="ix">02</span>Capabilities</a>' +
          '<a href="/projects"' + cur('/projects') + '><span class="ix">03</span>Projects</a>' +
          '<a href="/contact"' + cur('/contact') + '><span class="ix">04</span>Contact</a>' +
        '</div>' +
        '<div class="mdrawer-sub">' +
          '<div class="label dim">Capabilities</div>' +
          '<a href="/capabilities#ai">AI for Healthcare &amp; Defense</a>' +
          '<a href="/capabilities#data">Enterprise Data</a>' +
          '<a href="/capabilities#mfg">DoD Manufacturing</a>' +
          '<a href="/capabilities#cyber">Cybersecurity</a>' +
          '<a href="/capabilities#vf">VFusion™</a>' +
        '</div>' +
        '<div class="mdrawer-foot">' +
          '<a href="/contact" class="btn">Start a conversation <span class="arw">→</span></a>' +
          '<div class="mdrawer-ids"><span>DUNS #193973948</span><span>GSA GS-35F-320DA</span><span>ISO 9001:2015</span><span>CMMC</span></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(drawer);

    var open = false;
    function set(o) {
      open = o;
      burger.classList.toggle('open', o); drawer.classList.toggle('open', o);
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', o ? 'false' : 'true');
      document.documentElement.classList.toggle('nav-open', o);
      if (lenis) { o ? lenis.stop() : lenis.start(); }
    }
    burger.addEventListener('click', function () { set(!open); });
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) set(false); });
  }

  // page transitions: pixel dither cover, then navigate
  function initPageNav() {
    if (reduced) return;
    var grid = document.getElementById('pixelgrid');
    if (!grid) return;
    document.querySelectorAll('a[href]').forEach(function (a) {
      if (a.target === '_blank') return;
      var raw = a.getAttribute('href');
      if (!raw) return;
      var url;
      try { url = new URL(raw, location.href); } catch (e) { return; }
      if (url.origin !== location.origin) return;            // external / mailto / tel
      if (url.pathname === location.pathname) return;         // same page, let hash/lenis handle
      a.addEventListener('click', function (e) {
        e.preventDefault();
        buildPixelGrid();
        gsap.set(pixel.cells, { opacity: 0 });
        gsap.to(pixel.cells, {
          opacity: 1, duration: 0.28, ease: 'none', stagger: { amount: 0.5, from: 'random' },
          onComplete: function () { window.location.href = url.href; }
        });
      });
    });
  }

  // instrument decode — each character is a fixed-width cell sized to its
  // final glyph (the block never shifts). cells lock left-to-right on a steady
  // march; unresolved cells cycle glyphs at a readable ~15Hz, dimmed, so a
  // frozen frame reads as "resolving", never as a typo.
  function scrambleYear(el, finalText, opts) {
    if (!el || !finalText) return;
    opts = opts || {};
    var duration = opts.duration == null ? 0.8 : opts.duration;
    if (el._scrambleTween) el._scrambleTween.kill();
    el.classList.add('is-scrambling');

    // spaces map to a literal nbsp so the cell keeps its width (a plain space
    // collapses to zero inside an inline-block cell)
    var chars = finalText.split('').map(function (c) { return c === ' ' ? ' ' : c; });
    var cells = [];
    el.textContent = '';
    chars.forEach(function (c) {
      var s = document.createElement('span');
      s.className = 'sc';
      s.textContent = c;
      el.appendChild(s);
      cells.push(s);
    });
    var widths = cells.map(function (s) { return s.getBoundingClientRect().width; });
    cells.forEach(function (s, i) { s.style.width = widths[i].toFixed(2) + 'px'; });

    function glyphFor(i, cur) {
      var pool = /\d/.test(chars[i]) ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var g;
      do { g = pool.charAt(Math.floor(Math.random() * pool.length)); }
      while (g === cur || g.toLowerCase() === chars[i].toLowerCase());
      return g;
    }
    cells.forEach(function (s, i) {
      if (!/[0-9a-z]/i.test(chars[i])) return; // punctuation and spaces sit fixed
      s.classList.add('u'); s.textContent = glyphFor(i, '');
    });

    var head = 0.12;                                // brief all-cycling beat
    var step = (duration - head) / chars.length;    // then lock left-to-right
    var state = { t: 0 };
    var lastSwap = 0;
    el._scrambleTween = gsap.to(state, {
      t: duration,
      duration: duration,
      ease: 'none',
      onUpdate: function () {
        var swap = state.t - lastSwap >= 0.066;
        if (swap) lastSwap = state.t;
        for (var i = 0; i < cells.length; i++) {
          if (state.t >= head + (i + 1) * step) {
            if (cells[i].classList.contains('u')) {
              cells[i].classList.remove('u');
              cells[i].textContent = chars[i];
            }
          } else if (swap && cells[i].classList.contains('u')) {
            cells[i].textContent = glyphFor(i, cells[i].textContent);
          }
        }
      },
      onComplete: function () {
        for (var i = 0; i < cells.length; i++) {
          cells[i].classList.remove('u');
          cells[i].textContent = chars[i];
        }
        el.classList.remove('is-scrambling');
        el._scrambleTween = null;
      }
    });
  }

  function resetYear(el) {
    if (!el) return;
    if (el._scrambleTween) { el._scrambleTween.kill(); el._scrambleTween = null; }
    el.classList.remove('is-scrambling');
    el.textContent = el.getAttribute('data-year') || el.textContent;
  }

  // about heritage: instrument ruler. milestones sit above their text columns
  // (0/25/50/100); per-year tick density carries the true time scale within each
  // era. in-flow scroll scrubs 1979 -> today with a lerp-smoothed playhead.
  function initTimeline() {
    var root = document.querySelector('[data-tl]');
    if (!root) return;
    var section = document.getElementById('heritage');
    var ph = root.querySelector('.tl-ph'), ro = root.querySelector('.tl-ro');
    var evs = root.querySelectorAll('.tl .ev');
    var drops = root.querySelectorAll('.tl-gap .dp');
    var ticks = root.querySelectorAll('.tl-ruler .tk');
    var nodes = root.querySelectorAll('.tl-ruler .nd');
    var eras = root.querySelectorAll('.tl-ruler .tl-era i');
    var labels = root.querySelectorAll('.tl-ruler .ym');
    var base = root.querySelector('.tl-base'), fill = root.querySelector('.tl-fill');
    if (reduced) return;
    var isMobile = window.matchMedia('(max-width:820px)').matches;

    var segs = JSON.parse(root.getAttribute('data-tl-segs') || '[[1979,1985,0,25],[1985,1995,25,50],[1995,2026,50,100]]');
    function posOf(el) { return parseFloat(el.style.left) || 0; }
    function anchorX(_p) { return -50; }
    function yearAt(p) {
      for (var i = 0; i < segs.length; i++) {
        var s = segs[i];
        if (p <= s[3] || i === segs.length - 1) return s[0] + ((p - s[2]) / (s[3] - s[2])) * (s[1] - s[0]);
      }
    }
    var marks = [0, 25, 50, 100];
    var on = [false, false, false, false];
    var hit = [false, false, false, false];
    var revealed = false;
    var lastRo = '';

    ticks.forEach(function (tk) { gsap.set(tk, { xPercent: anchorX(posOf(tk)), scaleY: 0, transformOrigin: 'bottom center' }); });
    nodes.forEach(function (nd) {
      gsap.set(nd, { xPercent: anchorX(posOf(nd)), rotation: 45, opacity: 0, scale: 0.4, transformOrigin: 'center center' });
    });
    labels.forEach(function (lb) { gsap.set(lb, { xPercent: anchorX(posOf(lb)), opacity: 0, y: 6 }); });
    drops.forEach(function (dp) { gsap.set(dp, { xPercent: anchorX(posOf(dp)), scaleY: 0, transformOrigin: 'top center' }); });
    gsap.set(base, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(eras, { opacity: 0 });
    evs.forEach(function (ev) { ev.classList.add('dm'); });

    function revealRuler() {
      if (revealed) return;
      revealed = true;
      gsap.to(base, { scaleX: 1, duration: 1.15, ease: 'power3.inOut' });
      gsap.to(ticks, {
        scaleY: 1, duration: 0.55, ease: 'power2.out',
        stagger: { amount: 0.85, from: 'start' },
        xPercent: function (_i, el) { return anchorX(posOf(el)); }
      });
      gsap.to(eras, { opacity: 1, duration: 0.9, delay: 0.15, stagger: 0.08 });
      gsap.to(labels, {
        opacity: 1, y: 0, duration: 0.55, delay: 0.35, stagger: 0.06, ease: 'power2.out',
        xPercent: function (_i, el) { return anchorX(posOf(el)); }
      });
      gsap.to(nodes, {
        opacity: 1, scale: 1, duration: 0.5, delay: 0.45, stagger: 0.08, ease: 'back.out(2)',
        xPercent: function (_i, el) { return anchorX(posOf(el)); },
        rotation: 45
      });
      gsap.to(ph, { opacity: 1, duration: 0.35, delay: 0.65 });
    }

    function setEv(i, o) {
      if (on[i] === o) return;
      on[i] = o;
      var yr = evs[i].querySelector('.yr');
      evs[i].classList.toggle('dm', !o);
      gsap.to(drops[i], {
        xPercent: anchorX(posOf(drops[i])),
        scaleY: o ? 1 : 0, duration: 0.55, ease: 'power2.out', overwrite: true
      });
      if (o) {
        if (!hit[i]) {
          hit[i] = true;
          scrambleYear(yr, yr.getAttribute('data-year') || yr.textContent, { duration: 0.8 });
        }
        gsap.fromTo(yr, { y: 10 }, { y: 0, duration: 0.65, ease: 'power3.out' });
      } else {
        hit[i] = false;
        resetYear(yr);
      }
    }

    var target = 0, smooth = 0, idle = false;
    function syncPlayhead() {
      var d = target - smooth;
      if (Math.abs(d) < 0.008) {
        if (idle) return;
        smooth = target; idle = true;
      } else {
        smooth += d * 0.12; idle = false;
      }
      ph.style.left = smooth + '%';
      fill.style.transform = 'scaleX(' + (smooth / 100) + ')';
      var newRo = smooth > 99.2 ? 'TODAY' : String(Math.round(yearAt(Math.max(0, Math.min(100, smooth)))));
      if (newRo !== lastRo) { ro.textContent = newRo; lastRo = newRo; }
      for (var i = 0; i < marks.length; i++) setEv(i, smooth >= marks[i] - 0.15);
    }

    ScrollTrigger.create({
      trigger: section || root,
      start: 'top 78%',
      once: true,
      onEnter: revealRuler
    });

    if (isMobile) {
      // no pin on mobile: the sticky ruler docks under the nav and the playhead
      // maps to the era list's scroll, hitting each node exactly as that era's
      // block crosses the read line at 72% of the viewport.
      var list = root.querySelector('.tl');
      var th = [0, 0.25, 0.5, 0.75];
      var refreshTh = function () {
        var lr = list.getBoundingClientRect();
        if (!lr.height) return;
        th = Array.prototype.map.call(evs, function (ev) {
          return (ev.getBoundingClientRect().top - lr.top) / lr.height;
        });
      };
      refreshTh();
      ScrollTrigger.create({
        trigger: list,
        start: 'top 72%',
        end: 'bottom 72%',
        onRefresh: refreshTh,
        onUpdate: function (self) {
          var p = self.progress, out = 100;
          if (p <= th[0]) out = marks[0];
          else {
            for (var i = 0; i < th.length - 1; i++) {
              if (p <= th[i + 1]) {
                out = marks[i] + ((p - th[i]) / (th[i + 1] - th[i])) * (marks[i + 1] - marks[i]);
                break;
              }
            }
          }
          target = out;
        }
      });
    } else {
      // pinned pass: the section holds for one viewport of scroll while the
      // playhead sweeps 1979 -> today, so each era decodes as its own beat.
      // the sweep completes at 88% of the hold so TODAY settles before release;
      // default pinSpacing keeps the doctrine block from sliding underneath.
      ScrollTrigger.create({
        trigger: section || root,
        pin: section || root,
        start: function () {
          var el = section || root;
          return 'top ' + Math.max(0, Math.round((window.innerHeight - el.offsetHeight) / 2)) + 'px';
        },
        end: '+=100%',
        anticipatePin: 1,
        // refresh before the generic triggers so sections below the pin
        // measure pin-spaced positions (same fix as the vfusion pin)
        refreshPriority: 1,
        onUpdate: function (self) { target = Math.min(100, (self.progress / 0.88) * 100); }
      });
    }

    gsap.ticker.add(syncPlayhead);
  }

  // boot
  function boot() {
    initGrain();
    initCursor();
    initTextRoll();
    initLenis();
    initMega();
    initMobileNav();
    initPageNav();
    initTimeline();
    var navEl = document.querySelector('nav');
    if (navEl) {
      var ns = function () { navEl.classList.toggle('scrolled', (window.scrollY || window.pageYOffset || 0) > 40); };
      window.addEventListener('scroll', ns, { passive: true });
      ns();
    }
    runLoader(function () {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
      ScrollTrigger.refresh();
      if (introCursor) introCursor.classList.remove('hide');
    });
  }

  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]).then(boot);
  } else { boot(); }
})();
