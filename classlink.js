(function () {
  if (window.__LAUNCHER__) return;
  window.__LAUNCHER__ = true;

  // --- STATE ---
  let isDragging = false, vx = 0, vy = 0, lastX = 0, lastY = 0;
  let launcherVisible = true, isHovered = false, menuOpen = false, escCount = 0;

  // --- HELPERS ---
  function css(el, styles) { Object.assign(el.style, styles); }

  // --- BUTTON ---
  const btn = document.createElement("div");
  css(btn, {
    position: "fixed", width: "70px", height: "70px",
    borderRadius: "50%", background: "#2c2c2c",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", zIndex: "10001", left: "8%", top: "10%",
    userSelect: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  });

  const img = document.createElement("img");
  img.src = "https://myapps.classlink.com/assets/images/classlink-logo-invert.svg";
  css(img, { width: "60%", height: "60%", pointerEvents: "none" });
  btn.appendChild(img);
  document.body.appendChild(btn);

  // --- MENU CONTAINER ---
  const menu = document.createElement("div");
  css(menu, { position: "fixed", width: "200px", height: "200px", pointerEvents: "none", zIndex: "10000" });
  document.body.appendChild(menu);

  // --- OVERLAY + IFRAME ---
  const overlay = document.createElement("div");
  css(overlay, { position: "fixed", inset: "0", background: "black", display: "none", zIndex: "9999" });

  const iframe = document.createElement("iframe");
  css(iframe, { width: "100%", height: "100%", border: "none" });
  iframe.removeAttribute("sandbox");
  iframe.allow = "fullscreen *; gamepad *; autoplay *; clipboard-read *; clipboard-write *; microphone *; camera *;";

  // Close button for overlay
  const closeBtn = document.createElement("div");
  css(closeBtn, {
    position: "absolute", top: "10px", right: "16px",
    color: "white", fontSize: "28px", cursor: "pointer",
    zIndex: "10002", userSelect: "none", opacity: "0.7",
    transition: "opacity 0.2s"
  });
  closeBtn.textContent = "✕";
  closeBtn.onmouseenter = () => closeBtn.style.opacity = "1";
  closeBtn.onmouseleave = () => closeBtn.style.opacity = "0.7";
  closeBtn.onclick = () => { overlay.style.display = "none"; iframe.src = ""; escCount = 0; };

  overlay.appendChild(iframe);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

// --- SIDE MENU ---
const sideMenu = document.createElement("div");
css(sideMenu, {
  position: "fixed",
  width: "260px",
  height: "320px",
  background: "#1e1e1e",
  borderRadius: "14px",
  zIndex: "10002",
  display: "none",
  overflow: "hidden",
  boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
  color: "white",
  fontFamily: "sans-serif"
});
document.body.appendChild(sideMenu);

// scroll area
const sideList = document.createElement("div");
css(sideList, {
  height: "100%",
  overflowY: "auto",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "8px"
});
sideMenu.appendChild(sideList);

  // --- OPEN FUNCTIONS ---
  function openApp(url) {
    closeRadialMenu();
    overlay.style.display = "block";
    iframe.src = url;
  }

  function openAppSmart(url) {
  closeRadialMenu();

  // If site is known to block iframe → open in new tab
  if (url.includes("zombsroyale.io")) {
    window.open(url, "_blank");
    return;
  }

  overlay.style.display = "block";
  iframe.src = url;

  // fallback if blocked
  setTimeout(() => {
    try {
      iframe.contentWindow.location.href;
    } catch (e) {
      overlay.style.display = "none";
      iframe.src = "";
      window.open(url, "_blank");
    }
  }, 1000);
}

  function openHTMLFromURL(url) {
  closeRadialMenu();
  overlay.style.display = "block";
  iframe.src = "";

  // GitHub → raw
  if (url.includes("github.com")) {
    url = url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/")
      .replace("/refs/heads/", "/");
  }

  fetch(url)
    .then(res => res.text())
    .then(html => {

      const base = `<base href="${url.substring(0, url.lastIndexOf("/") + 1)}">`;

      // ✅ Fix protocol-less URLs (jsDelivr etc.)
      html = html.replace(
        /src="\/\/([^"]+)"/g,
        'src="https://$1"'
      );

      html = html.replace(
        /href="\/\/([^"]+)"/g,
        'href="https://$1"'
      );

      // ✅ Remove broken jsDelivr stats API
      html = html.replace(
        /https:\/\/data\.jsdelivr\.com\/v1\/stats[^"']+/g,
        ""
      );

      // ✅ Force scripts to execute properly
      html = html.replace(
        /<script([^>]*)>/g,
        (match, attrs) => {
          if (attrs.includes("type=\"module\"")) return match;
          return `<script${attrs} defer>`;
        }
      );

      // 🛡 Runtime protection (VERY important for GN Math)
      const patchScript = `
        <script>
          // Block bad API
          const origFetch = window.fetch;
          window.fetch = function(...args) {
            if (args[0] && args[0].includes("data.jsdelivr.com/v1/stats")) {
              return Promise.resolve(new Response("{}", { status: 200 }));
            }
            return origFetch.apply(this, args);
          };

          // Fix XHR too
          const origOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            if (url && url.includes("data.jsdelivr.com/v1/stats")) {
              return;
            }
            return origOpen.call(this, method, url, ...rest);
          };

          // Fix navigation inside blob
          document.addEventListener("click", e => {
            const a = e.target.closest("a");
            if (a && a.href) {
              e.preventDefault();
              window.location.href = a.href;
            }
          });
        <\/script>
      `;

      html = html.replace("<head>", `<head>${base}${patchScript}`);

      const blob = new Blob([html], { type: "text/html" });
      iframe.src = URL.createObjectURL(blob);
    })
    .catch(() => {
      iframe.src = url;
    });
}

// --- SIDE MENU LOGIC ---
function positionSideMenu() {
  const rect = btn.getBoundingClientRect();

  let left = rect.right + 12;
  let top = rect.top;

  if (left + 260 > window.innerWidth) {
    left = rect.left - 260 - 12;
  }

  if (top + 320 > window.innerHeight) {
    top = window.innerHeight - 330;
  }

  sideMenu.style.left = left + "px";
  sideMenu.style.top = top + "px";
}

function openSideMenu(category) {
  positionSideMenu();
  sideMenu.style.display = "block";
  sideList.innerHTML = "";

  const games = {
    action: [
      { name: "NZP", url: "https://nzp.gay/" },
      { name: "Drift", url: "https://raw.githubusercontent.com/UncopylockDomainHere/testing/refs/heads/main/drift-hunters.html" },
      { name: "Eagler", url: "https://raw.githubusercontent.com/v10letfur/Eaglercraft-X-1.8.8/refs/heads/main/EaglercraftX_1.8_u53_Offline_Signed.html" },
      { name: "Snow", url: "https://github.com/UncopylockDomainHere/testing/raw/refs/heads/main/snowrider.html" },
    ],
    test: [
      { name: "zombs", url: "https://zombsroyale.io/" }
    ],
    more: [
      { name: "test2", url: "https://raw.githubusercontent.com/genizy/web-port/refs/heads/main/buckshot-roulette/index.html" }
    ]
  };

  (games[category] || []).forEach(g => {
    const item = document.createElement("div");
    css(item, {
      padding: "10px",
      background: "#2c2c2c",
      borderRadius: "8px",
      cursor: "pointer",
      textAlign: "center"
    });

    item.textContent = g.name;

    item.onclick = () => {
      sideMenu.style.display = "none";
      openHTMLFromURL(g.url);
    };

    sideList.appendChild(item);
  });
}

  // --- RADIAL BUTTONS ---
  function createRadialButton(label, angle, action, color = "#2c2c2c") {
    const b = document.createElement("div");
    css(b, {
      position: "absolute", left: "-15%", top: "-10%",
      width: "54px", height: "54px", borderRadius: "50%",
      background: `linear-gradient(145deg, ${color}, #1a1a1a)`,
      color: "white", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: "13px", fontWeight: "bold",
      fontFamily: "sans-serif", cursor: "pointer", pointerEvents: "auto",
      opacity: "0", transform: "translate(0px,0px) scale(0.3)",
      filter: "blur(6px)", boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
      transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease, filter 0.3s ease"
    });
    b.textContent = label;
    b.onclick = action;
    b.dataset.angle = angle;

    b.onmouseenter = () => {
      const cur = b.style.transform;
      b._baseTransform = cur;
      b.style.transform = cur + " scale(1.2)";
    };
    b.onmouseleave = () => {
      if (b._baseTransform) b.style.transform = b._baseTransform;
    };

    menu.appendChild(b);
    return b;
  }

  // 4 apps at 0°, 90°, 180°, 270°
const apps = [
  createRadialButton("Action", 0, () => openSideMenu("action")),
  createRadialButton("MC", 120, () => openSideMenu("test")),
  createRadialButton("More", 240, () => openSideMenu("more")),
];

  function openRadialMenu() {
    menuOpen = true;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    menu.style.left = cx + "px";
    menu.style.top = cy + "px";

    apps.forEach((b, i) => {
      const angle = (b.dataset.angle * Math.PI) / 180;
      const r = 90;
      const x = Math.cos(angle) * r, y = Math.sin(angle) * r;
      setTimeout(() => {
        b.style.opacity = "1";
        b.style.filter = "blur(0px)";
        b.style.transform = `translate(${x * 1.1}px, ${y * 1.1}px) scale(1.05)`;
        setTimeout(() => { b.style.transform = `translate(${x}px, ${y}px) scale(1)`; }, 110);
      }, i * 60);
    });
  }

  function closeRadialMenu() {
    menuOpen = false;
    [...apps].reverse().forEach((b, i) => {
      setTimeout(() => {
        b.style.opacity = "0";
        b.style.filter = "blur(6px)";
        b.style.transform = "translate(0px,0px) scale(0.3)";
        b._baseTransform = null;
      }, i * 40);
    });
  }

  // --- DRAG WITH INERTIA ---
// --- SIDE MENU DRAG ---
let draggingMenu = false, offsetX = 0, offsetY = 0;

sideMenu.addEventListener("mousedown", e => {
  draggingMenu = true;
  offsetX = e.clientX - sideMenu.offsetLeft;
  offsetY = e.clientY - sideMenu.offsetTop;
});

document.addEventListener("mousemove", e => {
  if (!draggingMenu) return;
  sideMenu.style.left = (e.clientX - offsetX) + "px";
  sideMenu.style.top  = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => draggingMenu = false);

  btn.addEventListener("contextmenu", e => { e.preventDefault(); isDragging = true; lastX = e.clientX; lastY = e.clientY; btn.style.transform = "scale(1.1)"; });
  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    vx = e.clientX - lastX; vy = e.clientY - lastY;
    btn.style.left = (btn.offsetLeft + vx) + "px";
    btn.style.top  = (btn.offsetTop  + vy) + "px";
    lastX = e.clientX; lastY = e.clientY;
  });
  document.addEventListener("mouseup", () => { isDragging = false; btn.style.transform = "scale(1)"; });

  (function inertia() {
    if (!isDragging) {
      btn.style.left = (btn.offsetLeft + vx) + "px";
      btn.style.top  = (btn.offsetTop  + vy) + "px";
      vx *= 0.91; vy *= 0.91;
      if (Math.abs(vx) < 0.1) vx = 0;
      if (Math.abs(vy) < 0.1) vy = 0;
    }
    requestAnimationFrame(inertia);
  })();

  // --- CLICK & HOVER ---
  btn.addEventListener("mouseenter", () => { isHovered = true; btn.style.boxShadow = "0 6px 20px rgba(0,0,0,0.7)"; });
  btn.addEventListener("mouseleave", () => { isHovered = false; btn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.5)"; });
  btn.addEventListener("click", () => menuOpen ? closeRadialMenu() : openRadialMenu());

  // --- KEYBINDS ---
  document.addEventListener("keydown", e => {
  if (e.key === "`") {
    launcherVisible = !launcherVisible;

    if (launcherVisible) {
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
      closeRadialMenu();
      sideMenu.style.display = "none";
      overlay.style.display = "none";
      iframe.src = "";
    }
  }

  if (e.shiftKey && e.key === "`") {
    if (launcherVisible && isHovered) {
      launcherVisible = false;
      btn.style.display = "none";
      closeRadialMenu();
      overlay.style.display = "none";
    } else if (!launcherVisible) {
      launcherVisible = true;
      btn.style.display = "flex";
    }
  }

  if (e.key === "Escape" && overlay.style.display === "block") {
    if (++escCount >= 2) {
      overlay.style.display = "none";
      iframe.src = "";
      escCount = 0;
    }
  }
});

})();
