// ╔══════════════════════════════════════════════════════════════════╗
// ║   CLASSLINK // GHOST-GRID EDITION                                  ║
// ║   a cyber/hacker game launcher — glass, glow, scanlines & vibes    ║
// ╚══════════════════════════════════════════════════════════════════╝

// ───────────────────────────────────────────────────────────────────
// 0. Inject base styles (fonts, animated background, HUD, glass, glow)
// ───────────────────────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

    :root{
        --bg-0:#05070d;
        --bg-1:#0a0f1c;
        --cyan:#00f0ff;
        --magenta:#ff2bd6;
        --lime:#39ff14;
        --violet:#7b5cff;
        --grid-line:rgba(0,240,255,.06);
        --glass:rgba(10,16,28,.55);
        --glass-brd:rgba(0,240,255,.22);
    }

    *{box-sizing:border-box}
    html,body{height:100%}
    body{
        margin:0;
        background:var(--bg-0);
        color:#d7e6ff;
        font-family:'JetBrains Mono',ui-monospace,monospace;
        overflow-x:hidden;
        position:relative;
    }

    /* animated starfield / aurora backdrop */
    #bgCanvas{
        position:fixed; inset:0; z-index:0;
        width:100%; height:100%;
        display:block;
    }

    /* moving grid floor (perspective) */
    .cyber-grid{
        position:fixed; left:50%; bottom:-10vh; z-index:0;
        width:200vw; height:120vh;
        transform:translateX(-50%) perspective(40vh) rotateX(62deg);
        transform-origin:center bottom;
        background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
        background-size:60px 60px;
        animation:gridMove 6s linear infinite;
        mask-image:linear-gradient(to top, #000 0%, transparent 75%);
        -webkit-mask-image:linear-gradient(to top, #000 0%, transparent 75%);
        pointer-events:none;
        opacity:.55;
    }
    @keyframes gridMove{ from{background-position:0 0} to{background-position:0 60px} }

    /* CRT scanlines + vignette */
    .scanlines{
        position:fixed; inset:0; z-index:60; pointer-events:none;
        background:repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,0) 2px,
            rgba(0,0,0,.10) 3px,
            rgba(0,0,0,0) 4px
        );
        mix-blend-mode:overlay; opacity:.45;
    }
    .vignette{
        position:fixed; inset:0; z-index:55; pointer-events:none;
        background:radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,.65) 100%);
    }

    /* everything sits above the backdrop */
    .ui-layer{ position:relative; z-index:10; }

    /* ── top status bar (HUD) ───────────────────────────────────── */
    .hud{
        position:sticky; top:0; z-index:90;
        display:flex; align-items:center; justify-content:space-between;
        gap:18px; padding:14px 26px;
        background:linear-gradient(180deg, rgba(5,7,13,.85), rgba(5,7,13,.25));
        backdrop-filter:blur(10px);
        -webkit-backdrop-filter:blur(10px);
        border-bottom:1px solid rgba(0,240,255,.18);
        font-size:12px; letter-spacing:.18em; text-transform:uppercase;
        color:#6fe9ff; text-shadow:0 0 8px rgba(0,240,255,.5);
    }
    .hud .logo{
        font-family:'Orbitron',sans-serif; font-weight:900; font-size:18px;
        letter-spacing:.32em;
        background:linear-gradient(90deg,var(--cyan),var(--magenta),var(--violet));
        -webkit-background-clip:text; background-clip:text; color:transparent;
        filter:drop-shadow(0 0 10px rgba(0,240,255,.45));
        animation:flicker 4s infinite;
    }
    .hud .logo .cursor{ color:var(--lime); -webkit-text-fill-color:var(--lime); animation:blink 1.1s steps(2) infinite; }
    .hud .stats{ display:flex; gap:22px; color:#7aa2c8; text-shadow:none; }
    .hud .stats b{ color:#cfe8ff; font-weight:500; }
    .hud .dot{ display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--lime); box-shadow:0 0 10px var(--lime); margin-right:7px; animation:pulse 1.6s infinite; }
    @keyframes pulse{ 0%,100%{opacity:1} 50%{opacity:.35} }
    @keyframes blink{ 0%,49%{opacity:1} 50%,100%{opacity:0} }
    @keyframes flicker{ 0%,97%,100%{opacity:1} 98%{opacity:.4} 99%{opacity:.8} }

    /* ── search bar ─────────────────────────────────────────────── */
    .search-wrap{
        position:sticky; top:62px; z-index:80;
        display:flex; justify-content:center;
        padding:26px 20px 6px;
    }
    #searchBar{
        width:92%; max-width:760px;
        padding:16px 22px 16px 52px;
        font-family:'JetBrains Mono',monospace; font-size:17px; font-weight:500;
        letter-spacing:.04em;
        color:#e8f6ff;
        background:var(--glass);
        border:1px solid var(--glass-brd);
        border-radius:16px;
        outline:none;
        backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
        box-shadow:
            0 0 0 1px rgba(0,240,255,.06),
            0 8px 40px rgba(0,240,255,.12),
            inset 0 0 22px rgba(0,240,255,.06);
        transition:border-color .25s ease, box-shadow .25s ease, transform .25s ease;
    }
    #searchBar::placeholder{ color:#5b7a9e; }
    #searchBar:focus{
        border-color:rgba(0,240,255,.6);
        box-shadow:
            0 0 0 1px rgba(0,240,255,.25),
            0 0 30px rgba(0,240,255,.35),
            inset 0 0 22px rgba(0,240,255,.1);
        transform:translateY(-1px);
    }
    .search-wrap::before{
        content:''; position:absolute; left:max(6%, calc(50% - 366px));
        top:42px; transform:translateY(-50%);
        font-family:'Orbitron',sans-serif; font-weight:700; font-size:20px;
        color:var(--cyan); text-shadow:0 0 12px rgba(0,240,255,.7);
        pointer-events:none; z-index:81;
    }
    .search-count{
        position:absolute; right:max(5%, calc(50% - 366px)); top:46px;
        font-size:11px; letter-spacing:.18em; text-transform:uppercase;
        color:#5b7a9e; pointer-events:none;
    }

    /* ── grid of tiles ──────────────────────────────────────────── */
    .grid{
        display:grid;
        grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));
        gap:34px 26px;
        padding:30px 40px 70px;
        justify-items:center;
        max-width:1500px; margin:0 auto;
    }

    .app-container{
        text-align:center; width:100%; max-width:200px;
        display:flex; flex-direction:column; align-items:center; gap:12px;
        opacity:0; transform:translateY(18px) scale(.96);
        animation:tileIn .55s cubic-bezier(.2,.8,.2,1) forwards;
    }
    @keyframes tileIn{ to{opacity:1; transform:none} }

    .app-btn{
        position:relative;
        width:150px; height:150px;
        border-radius:18px; border:1px solid rgba(0,240,255,.18);
        background:rgba(10,16,28,.6);
        color:white; cursor:pointer; padding:0; overflow:hidden;
        display:flex; align-items:center; justify-content:center;
        backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
        box-shadow:
            0 10px 30px rgba(0,0,0,.55),
            0 0 0 1px rgba(255,255,255,.03) inset;
        transition:transform .28s cubic-bezier(.2,.8,.2,1),
                   box-shadow .28s ease, border-color .28s ease;
        will-change:transform;
    }
    /* corner brackets — HUD frame */
    .app-btn::before, .app-btn::after{
        content:''; position:absolute; width:16px; height:16px; z-index:3;
        border:2px solid var(--cyan); opacity:.7;
        transition:opacity .25s ease, transform .25s ease;
    }
    .app-btn::before{ top:7px; left:7px; border-right:none; border-bottom:none; border-top-left-radius:6px; }
    .app-btn::after{ bottom:7px; right:7px; border-left:none; border-top:none; border-bottom-right-radius:6px; }

    /* moving scanline sheen across the tile */
    .app-btn .sheen{
        position:absolute; inset:0; z-index:2; pointer-events:none;
        background:linear-gradient(115deg, transparent 30%, rgba(0,240,255,.18) 48%, transparent 66%);
        background-size:300% 100%; background-position:200% 0;
        opacity:0; transition:opacity .2s ease;
        mix-blend-mode:screen;
    }
    .app-btn:hover .sheen{ opacity:1; animation:sheenMove 1.1s ease forwards; }
    @keyframes sheenMove{ from{background-position:200% 0} to{background-position:-60% 0} }

    .app-btn img{
        width:100%; height:100%; object-fit:cover;
        border-radius:18px; pointer-events:none;
        filter:saturate(1.05) contrast(1.05);
        transition:filter .3s ease, transform .4s ease;
    }

    .app-btn:hover{
        transform:translateY(-8px) scale(1.06);
        border-color:rgba(0,240,255,.7);
        box-shadow:
            0 18px 50px rgba(0,0,0,.6),
            0 0 26px rgba(0,240,255,.45),
            0 0 60px rgba(123,92,255,.25);
    }
    .app-btn:hover img{ filter:saturate(1.25) contrast(1.12) brightness(1.05); transform:scale(1.04); }
    .app-btn:hover::before, .app-btn:hover::after{ opacity:1; transform:scale(1.1); }

    .app-btn:active{ transform:translateY(-4px) scale(.98); }

    .label{
        font-size:13px; letter-spacing:.06em; font-weight:500;
        color:#9fb8d6; max-width:180px;
        word-wrap:break-word; line-height:1.25;
        text-shadow:0 1px 6px rgba(0,0,0,.8);
        transition:color .25s ease, text-shadow .25s ease;
    }
    .app-container:hover .label{ color:var(--cyan); text-shadow:0 0 12px rgba(0,240,255,.55); }

    /* empty state */
    .empty{
        grid-column:1/-1; text-align:center; padding:80px 20px;
        color:#5b7a9e; font-family:'Orbitron',sans-serif; letter-spacing:.3em;
        font-size:14px; text-transform:uppercase;
    }
    .empty span{ color:var(--magenta); text-shadow:0 0 14px rgba(255,43,214,.6); }

    /* boot splash */
    #boot{
        position:fixed; inset:0; z-index:999; background:var(--bg-0);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        gap:14px; font-family:'JetBrains Mono',monospace; color:var(--cyan);
        text-shadow:0 0 14px rgba(0,240,255,.6);
        transition:opacity .6s ease, visibility .6s ease;
    }
    #boot .b-logo{ font-family:'Orbitron',sans-serif; font-weight:900; font-size:34px; letter-spacing:.4em;
        background:linear-gradient(90deg,var(--cyan),var(--magenta)); -webkit-background-clip:text; background-clip:text; color:transparent; }
    #boot .b-bar{ width:280px; height:4px; border-radius:4px; background:rgba(0,240,255,.15); overflow:hidden; }
    #boot .b-bar i{ display:block; height:100%; width:0; background:linear-gradient(90deg,var(--cyan),var(--violet)); box-shadow:0 0 14px var(--cyan); animation:bootBar 1.1s ease forwards; }
    #boot .b-log{ font-size:11px; letter-spacing:.18em; color:#5b7a9e; min-height:16px; }
    @keyframes bootBar{ to{ width:100% } }
    #boot.hide{ opacity:0; visibility:hidden; }
`;
document.head.appendChild(style);

// ───────────────────────────────────────────────────────────────────
// 1. Boot splash (fake terminal boot — the "hacky" vibe)
// ───────────────────────────────────────────────────────────────────
const boot = document.createElement('div');
boot.id = 'boot';
boot.innerHTML = `
    <div class="b-logo">CLASSLINK</div>
    <div class="b-bar"><i></i></div>
    <div class="b-log">initializing class-link…</div>
`;
document.body.appendChild(boot);
const bootLog = boot.querySelector('.b-log');
const bootLines = [
  'decrypting index…',
  'mounting /games…',
  'rendering tiles…',
  'SYSTEM ONLINE ✓',
];
let bi = 0;
const bootTimer = setInterval(() => {
  if (bi < bootLines.length) bootLog.textContent = bootLines[bi++];
}, 240);
setTimeout(() => {
  clearInterval(bootTimer);
  boot.classList.add('hide');
  setTimeout(() => boot.remove(), 700);
}, 1150);

// ───────────────────────────────────────────────────────────────────
// 2. Animated background canvas (drifting particles + drifting hex)
// ───────────────────────────────────────────────────────────────────
const bgCanvas = document.createElement('canvas');
bgCanvas.id = 'bgCanvas';
document.body.insertBefore(bgCanvas, document.body.firstChild);

const gridFloor = document.createElement('div');
gridFloor.className = 'cyber-grid';
document.body.insertBefore(gridFloor, bgCanvas.nextSibling);

const scan = document.createElement('div'); scan.className = 'scanlines';
const vig = document.createElement('div'); vig.className = 'vignette';
document.body.appendChild(vig);
document.body.appendChild(scan);

(function initCanvas() {
  const ctx = bgCanvas.getContext('2d');
  let w, h, particles, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = bgCanvas.width = innerWidth * dpr;
    h = bgCanvas.height = innerHeight * dpr;
    bgCanvas.style.width = innerWidth + 'px';
    bgCanvas.style.height = innerHeight + 'px';
    const count = Math.min(90, Math.floor(innerWidth / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      r: (Math.random() * 1.6 + 0.4) * dpr,
      a: Math.random() * 0.5 + 0.2,
    }));
  }
  resize();
  addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // soft aurora blobs
    const t = performance.now() * 0.0002;
    const g1 = ctx.createRadialGradient(w * (0.3 + Math.sin(t) * 0.1), h * 0.3, 0, w * 0.3, h * 0.3, w * 0.5);
    g1.addColorStop(0, 'rgba(0,240,255,0.10)'); g1.addColorStop(1, 'rgba(0,240,255,0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);
    const g2 = ctx.createRadialGradient(w * (0.7 + Math.cos(t) * 0.1), h * 0.7, 0, w * 0.7, h * 0.7, w * 0.5);
    g2.addColorStop(0, 'rgba(123,92,255,0.10)'); g2.addColorStop(1, 'rgba(123,92,255,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);

    // particles + connection lines
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,240,255,${p.a})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < (140 * dpr) * (140 * dpr)) {
          const o = (1 - Math.sqrt(d2) / (140 * dpr)) * 0.18;
          ctx.strokeStyle = `rgba(0,240,255,${o})`;
          ctx.lineWidth = dpr * 0.6;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ───────────────────────────────────────────────────────────────────
// 3. HUD bar
// ───────────────────────────────────────────────────────────────────
const uiLayer = document.createElement('div');
uiLayer.className = 'ui-layer';
document.body.appendChild(uiLayer);

const hud = document.createElement('div');
hud.className = 'hud';
hud.innerHTML = `
    <div class="logo">CLASSLINK<span class="cursor">_</span></div>
    <div class="stats">
        <span><span class="dot"></span>ONLINE</span>
        <span>NODES <b id="nodeCount">--</b></span>
        <span id="clock">--:--:--</span>
    </div>
`;
uiLayer.appendChild(hud);

// live clock
function tickClock() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  document.getElementById('clock').textContent =
    `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
setInterval(tickClock, 1000); tickClock();

// ───────────────────────────────────────────────────────────────────
// 4. Search bar
// ───────────────────────────────────────────────────────────────────
const searchWrap = document.createElement('div');
searchWrap.className = 'search-wrap';
searchWrap.innerHTML = `
    <input id="searchBar" type="text" placeholder="search the grid" autocomplete="off" spellcheck="false" />
    <div class="search-count" id="searchCount"></div>
`;
uiLayer.appendChild(searchWrap);
const searchBar = document.getElementById('searchBar');
const searchCount = document.getElementById('searchCount');

// ───────────────────────────────────────────────────────────────────
// 5. Grid container
// ───────────────────────────────────────────────────────────────────
const grid = document.createElement('div');
grid.className = 'grid';
grid.id = 'appGrid';
uiLayer.appendChild(grid);

// ───────────────────────────────────────────────────────────────────
// 6. App list (UNCHANGED — same names, urls, icons)
// ───────────────────────────────────────────────────────────────────
const apps = [
  { name: 'NZ:P', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/test.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNIW09jfdkiAfWAQ81HXZaDwktgfgywV4p5w&s' },
  { name: 'Serious Sam', url: 'https://cdn.jsdelivr.net/gh/prokid8467-collab/serious/local/index.html', icon: 'https://i.ebayimg.com/00/s/MTI1MFgxMjAw/z/KCwAAOSwYwJlINmB/$_57.JPG?set_id=880000500F' },
  { name: 'Drift Hunters', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/drifthunters.html', icon: 'https://drifthunters3d.io/assets/upload/poki/webp/drift-hunters.webp' },
  { name: 'Eaglercraft', url: 'https://cdn.jsdelivr.net/gh/v10letfur/Eaglercraft-X-1.8.8/EaglercraftX_1.8_u53_Offline_Signed.html', icon: 'https://cdn2.steamgriddb.com/icon_thumb/349319c989f70ac97c3824689547bf5d.png' },
  { name: 'Drivemad', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/drivemad.html', icon: 'https://cdn-1.webcatalog.io/catalog/poki-drive-mad/poki-drive-mad-icon-filled-256.png?v=1714778298617' },
  { name: 'Snowrider 3D', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/snowrider.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJy4pM2G_0ViLxs6g-mq68YS7RRUv_XUHg4w&s' },
  { name: 'Slope', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/slope.html', icon: 'https://slope-play.com/cache/data/image/game/slope-logo-1-f309x309.webp' },
  { name: 'Subway Surfers', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/subwaysurfers.html', icon: 'https://static.wikia.nocookie.net/subwaysurf/images/c/c3/ThirtySixthAvatar.jpg' },
  { name: 'Buckshot Roulette', url: 'https://cdn.jsdelivr.net/gh/genizy/web-port@main/buckshot-roulette/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW0pkA7JfrcIexKwRvSuX4EaJw4n2Gf4r2Sw&s' },
  { name: 'Binding Of Isaac', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/binding-of-isaac-v1.666.html', icon: 'https://img.tapimg.net/market/images/877d89aad26d46c1ae9934370fc6c22e.jpg' },
  { name: 'Ultra Kill', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/ultrakill.html', icon: 'https://cdn2.steamgriddb.com/icon_thumb/ba9353718aa3b1793b8a23d51e19ef15.png' },
  { name: 'Pizza Tower', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/pizzatower.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS27aoYD-jiZcXXqXMiJ-VtOCA2LvvFHUQu3g&s' },
  { name: 'R.E.P.O', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/repo2.html', icon: 'https://mir-s3-cdn-cf.behance.net/projects/404/cf0349247119641.Y3JvcCw4NjIsNjc1LDE2OCww.jpg' },
  { name: 'Gun Spin', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/gunspin.html', icon: 'https://sc.filehippo.net/images/t_app-icon-l/p/39d0a468-21ab-466d-a65b-5585c02dd7ad/15864794/gunspin-logo' },
  { name: 'Cookie Clicker', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/cookieclicker.html', icon: 'https://play-lh.googleusercontent.com/Z1MOuuiD05ZN5LkVmMEvKF0mqAc-FknaQ2j8s4dZiO-LSPQX4EEA3RVJdlQEtxe96ok' },
  { name: 'Tiny Fishing', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/tinyfishing.html', icon: 'https://lh3.googleusercontent.com/hca11Z4buNnAB96QUDvbm107tF0r5EHZXQ5IwTjjbim83MALr6YfxR6HGafEytvBEkeRPiBsnPhOduvQRdYBjOheOw=s128-rj-sc0x00ffffff' },
  { name: 'Paper io', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/paper/index.html', icon: 'https://i.pinimg.com/736x/33/48/8a/33488a03a8ec1fb8f79d4800e5d17dcf.jpg' },
  { name: 'Baldis-plus', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/baldi.html', icon: 'https://play-lh.googleusercontent.com/EPV1TB4So1lB0DGrdCVExDpNU8ML67nd8OqBeoOIM-s6sDicxmDdPvCXD6n7LKevFl0' },
  { name: 'Getting Over It', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/getting-over-it.html', icon: 'https://play-lh.googleusercontent.com/xEDOZ9oZZrHswGxUR3w55e4XL9nF2r9HQpmpBO2iGsX3EbCstxawIpZB-EykrCPl6c0' },
  { name: 'Dumb Ways To Die', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/dumb-ways-to-die.html', icon: 'https://yt3.googleusercontent.com/ytc/AIdro_lS_HLx-8hMfveILM_CAmaWxgaOCwBKxb10vi55pPkCteU=s900-c-k-c0x00ffffff-no-rj' },
  { name: 'Super Hot', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/super-hott.html', icon: 'https://fontmeme.com/images/super-hot-game-font.jpg' },
  { name: 'Fruit Ninja', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/fruit-ninja.html', icon: 'https://play-lh.googleusercontent.com/eJ9OJnbRer1jjg5ZeNAnTXKcGd2B_NEqxCp2UsefcCABeFBaj_pNl_WKYBjup2GVGGc' },
  { name: 'Crossy Road', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/crossy-road.html', icon: 'https://upload.wikimedia.org/wikipedia/en/7/71/Crossy_Road_icon.jpeg' },
  { name: 'Geometry Dash', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/geometry-dash.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/785.png' },
  { name: 'Doom 1', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/doom-1.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/203.png' },
  { name: 'Doom 2', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/doom-2.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/602.png' },
  { name: 'Dead Seat', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/dead-seat.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/458.png' },
  { name: 'Super Mario 64', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/sm64.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/588.png' },
  { name: 'Jetpack Joyride', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/jj.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/7.png' },
  { name: 'Crazy Cattle 3D', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/crazy-cattle-3d.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/164.png' },
  { name: 'Yume Nikki', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/nikki.html', icon: 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/433.png' },
  { name: 'CSGO', url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/csgo.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6bznqalhYEF60S4VbKOscF0wg2LKJiiPJIngyn4QmRg&s=10' },
];

// ───────────────────────────────────────────────────────────────────
// 7. Render tiles (with stagger animation + glow)
// ───────────────────────────────────────────────────────────────────
const grid2 = document.getElementById('appGrid');
let renderToken = 0;

function renderApps(filteredApps) {
  const myToken = ++renderToken;
  grid2.innerHTML = '';

  if (filteredApps.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.innerHTML = `<span>// NO_MATCH</span> — nothing in the grid…`;
    grid2.appendChild(empty);
    updateCount(0);
    return;
  }

  filteredApps.forEach((app, i) => {
    const container = document.createElement('div');
    container.className = 'app-container';
    // staggered entrance
    container.style.animationDelay = `${Math.min(i * 28, 700)}ms`;

    const btn = document.createElement('button');
    btn.className = 'app-btn';
    btn.title = `launch ${app.name}`;
    btn.setAttribute('aria-label', app.name);

    const sheen = document.createElement('div');
    sheen.className = 'sheen';
    btn.appendChild(sheen);

    const img = document.createElement('img');
    img.src = app.icon;
    img.loading = 'lazy';
    img.alt = app.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '18px';
    img.style.pointerEvents = 'none';
    // fallback if icon fails
    img.onerror = () => {
      img.style.display = 'none';
      btn.style.background = 'linear-gradient(145deg,#0a0f1c,#16203a)';
      btn.innerHTML += `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Orbitron;font-weight:700;color:#00f0ff;text-shadow:0 0 12px #00f0ff;font-size:18px;z-index:4;letter-spacing:.1em">${app.name.slice(0,10)}</div>`;
    };
    btn.appendChild(img);

    // launch — unchanged behavior (open about:blank, fetch, write html)
    btn.onclick = async () => {
      const newWin = window.open('about:blank', '_blank');
      if (!newWin) return;
      newWin.document.write(`
        <html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
          html,body{margin:0;height:100%;background:#05070d;color:#00f0ff;font-family:'JetBrains Mono',monospace;display:flex;justify-content:center;align-items:center;overflow:hidden}
          .w{display:flex;flex-direction:column;align-items:center;gap:14px}
          .sp{width:46px;height:46px;border:3px solid rgba(0,240,255,.2);border-top-color:#00f0ff;border-radius:50%;animation:r 1s linear infinite;box-shadow:0 0 18px rgba(0,240,255,.5)}
          .t{letter-spacing:.2em;text-transform:uppercase;font-size:12px;text-shadow:0 0 10px rgba(0,240,255,.6)}
          @keyframes r{to{transform:rotate(360deg)}}
        </style></head><body><div class="w"><div class="sp"></div><div class="t">Launching ${app.name}</div></div></body></html>
      `);
      newWin.document.close();

      try {
        const res = await fetch(app.url);
        const html = await res.text();
        newWin.document.open();
        newWin.document.write(html);
        newWin.document.close();
      } catch (err) {
        newWin.document.body.innerHTML =
          '<div style="color:#ff2bd6;font-family:monospace;text-align:center"><h2>// CONNECTION_FAILED</h2><p style="color:#5b7a9e">couldn\'t reach the node.</p></div>';
      }
    };

    const label = document.createElement('div');
    label.className = 'label';
    label.innerText = app.name;

    container.appendChild(btn);
    container.appendChild(label);
    grid2.appendChild(container);
  });

  if (myToken === renderToken) updateCount(filteredApps.length);
}

function updateCount(n) {
  searchCount.textContent = `${n} / ${apps.length} NODES`;
  const nc = document.getElementById('nodeCount');
  if (nc) nc.textContent = apps.length;
}

// initial render
renderApps(apps);

// ───────────────────────────────────────────────────────────────────
// 8. Search filtering (unchanged logic, smoother)
// ───────────────────────────────────────────────────────────────────
let searchDebounce;
searchBar.addEventListener('input', function () {
  clearTimeout(searchDebounce);
  const q = this.value.toLowerCase();
  searchDebounce = setTimeout(() => {
    const filtered = apps.filter((app) => app.name.toLowerCase().includes(q));
    renderApps(filtered);
  }, 90);
});

// slash focuses search (extra hacky hotkey)
addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchBar) {
    e.preventDefault();
    searchBar.focus();
  }
  if (e.key === 'Escape') {
    searchBar.value = '';
    renderApps(apps);
    searchBar.blur();
  }
});
