(function () {

  function init() {
    if (!document.body) return;

    if (window.__LAUNCHER__) return;
    window.__LAUNCHER__ = true;

    // --- STATE ---
    let isDragging = false;
    let vx = 0, vy = 0;
    let lastX = 0, lastY = 0;

    let launcherVisible = true;
    let isHovered = false;
    let escCount = 0;

    // --- BUTTON ---
    const btn = document.createElement("div");
    Object.assign(btn.style, {
      position: "fixed",
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      background: "#2c2c2c",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: "10001",
      left: "100px",
      top: "100px",
      userSelect: "none",
      transition: "transform 0.2s ease"
    });

    const img = document.createElement("img");
    img.src = "https://myapps.classlink.com/assets/images/classlink-logo-invert.svg";
    Object.assign(img.style, {
      width: "60%",
      height: "60%",
      pointerEvents: "none"
    });

    btn.appendChild(img);
    document.body.appendChild(btn);

    // --- MENU ---
    const menu = document.createElement("div");
    Object.assign(menu.style, {
      position: "fixed",
      width: "200px",
      height: "200px",
      pointerEvents: "none",
      zIndex: "10000"
    });

    document.body.appendChild(menu);

    // --- OVERLAY ---
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      background: "black",
      display: "none",
      zIndex: "9999"
    });

    const iframe = document.createElement("iframe");

Object.assign(iframe.style, {
  width: "100%",
  height: "100%",
  border: "none"
});

// ❌ REMOVE sandbox completely
iframe.removeAttribute("sandbox");

// ✅ Allow important features
iframe.allow = `
  fullscreen *;
  gamepad *;
  autoplay *;
  clipboard-read *;
  clipboard-write *;
`;

    overlay.appendChild(iframe);
    document.body.appendChild(overlay);

    // --- RADIAL BUTTONS ---
    function createRadialButton(label, angle, action) {
      const b = document.createElement("div");

      Object.assign(b.style, {
  position: "absolute",
  left: "-10%",
  top: "-10%",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(145deg, #3a3a3a, #1f1f1f)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  cursor: "pointer",
  pointerEvents: "auto",

  opacity: "0",
  transform: "translate(0px,0px) scale(0.3)",
  filter: "blur(6px)",

  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, filter 0.3s ease"
  });

  b.addEventListener("mouseenter", () => {
  b.style.transform += " scale(1.15)";
});

b.addEventListener("mouseleave", () => {
  b.style.transform = b.style.transform.replace(" scale(1.15)", "");
});

      b.textContent = label;
      b.onclick = action;
      b.dataset.angle = angle;

      menu.appendChild(b);
      return b;
    }
    
function openApp(url) {
  overlay.style.display = "block";
  iframe.src = url;
}

function openHTMLFromURL(url) {
  closeRadialMenu();
  overlay.style.display = "block";

  iframe.src = ""; // reset

  setTimeout(() => overlay.style.opacity = "1", 10);

  // convert github → raw automatically
  if (url.includes("github.com")) {
    url = url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/")
      .replace("/refs/heads/", "/");
  }

  // 🔥 fetch → inject → blob (best compatibility)
  fetch(url)
    .then(res => res.text())
    .then(html => {

      // ensure base tag for relative paths
      const base = `<base href="${url.substring(0, url.lastIndexOf("/") + 1)}">`;

      const finalHTML = html.replace("<head>", `<head>${base}`);

      const blob = new Blob([finalHTML], { type: "text/html" });
      const blobURL = URL.createObjectURL(blob);

      iframe.src = blobURL;
    })
    .catch(() => {
      // fallback (CORS-safe)
      iframe.src = url;
    });
}

 const apps = [
  createRadialButton("NZP", 0, () => openHTMLFromURL("https://raw.githubusercontent.com/UncopylockDomainHere/nzp-team.github.io/refs/heads/main/index.html")),
  createRadialButton("DriveMad", 60, () => openHTMLFromURL("https://raw.githubusercontent.com/gswitchgames/gswitchgames.github.io/refs/heads/tbg95/drive-mad.html")),
  createRadialButton("Eaglercraft", 120, () => openHTMLFromURL("https://raw.githubusercontent.com/v10letfur/Eaglercraft-X-1.8.8/refs/heads/main/EaglercraftX_1.8_u53_Offline_Signed.html")),
  createRadialButton("Slope", 180, () => openHTMLFromURL("https://raw.githubusercontent.com/gswitchgames/gswitchgames.github.io/refs/heads/tbg95/slope.html")),
  createRadialButton("DriftHunters", 240, () => openHTMLFromURL("https://raw.githubusercontent.com/UncopylockDomainHere/testing/refs/heads/main/drift-hunters.html")),
  createRadialButton("Test", 320, () => openHTMLFromURL("https://raw.githubusercontent.com/gswitchgames/gswitchgames.github.io/refs/heads/tbg95/slope.html")),
];

    let menuOpen = false;

    function openRadialMenu() {
  menuOpen = true;

  const rect = btn.getBoundingClientRect();

  // TRUE CENTER of the button
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Position menu exactly at center
  menu.style.left = centerX + "px";
  menu.style.top = centerY + "px";

  apps.forEach((btnItem, i) => {
    const angle = (btnItem.dataset.angle * Math.PI) / 180;
    const radius = 80;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    setTimeout(() => {
      btnItem.style.opacity = "1";
      btnItem.style.filter = "blur(0px)";

      // overshoot
      btnItem.style.transform = `translate(${x * 1.15}px, ${y * 1.15}px) scale(1.1)`;

      setTimeout(() => {
        btnItem.style.transform = `translate(${x}px, ${y}px) scale(1)`;
      }, 120);

    }, i * 70);
  });
}

function closeRadialMenu() {
  menuOpen = false;

  apps.slice().reverse().forEach((btnItem, i) => {
    setTimeout(() => {
      btnItem.style.opacity = "0";
      btnItem.style.filter = "blur(6px)";
      btnItem.style.transform = `translate(0px,0px) scale(0.3)`;
    }, i * 50);
  });
}

    // --- DRAG ---
    function startDrag(x, y) {
      isDragging = true;
      lastX = x;
      lastY = y;
      btn.style.transform = "scale(1.1)";
    }

    function moveDrag(x, y) {
      if (!isDragging) return;

      const dx = x - lastX;
      const dy = y - lastY;

      vx = dx;
      vy = dy;

      btn.style.left = (btn.offsetLeft + dx) + "px";
      btn.style.top = (btn.offsetTop + dy) + "px";

      lastX = x;
      lastY = y;
    }

    function stopDrag() {
      isDragging = false;
      btn.style.transform = "scale(1)";
    }

    function animateInertia() {
      if (!isDragging) {
        btn.style.left = (btn.offsetLeft + vx) + "px";
        btn.style.top = (btn.offsetTop + vy) + "px";

        vx *= 0.92;
        vy *= 0.92;

        if (Math.abs(vx) < 0.1) vx = 0;
        if (Math.abs(vy) < 0.1) vy = 0;
      }

      requestAnimationFrame(animateInertia);
    }

    animateInertia();

    // --- EVENTS ---
    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });

    document.addEventListener("mousemove", (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener("mouseup", stopDrag);

    btn.addEventListener("mouseenter", () => isHovered = true);
    btn.addEventListener("mouseleave", () => isHovered = false);

    btn.addEventListener("click", () => {
      if (menuOpen) closeRadialMenu();
      else openRadialMenu();
    });

    // --- KEYBINDS ---
    document.addEventListener("keydown", (e) => {

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
        escCount++;
        if (escCount >= 3) {
          overlay.style.display = "none";
          iframe.src = "";
          escCount = 0;
        }
      }

    });
  }

  // ✅ Proper DOM ready fix
  function waitForBody(callback) {
  if (document.body) return callback();
  requestAnimationFrame(() => waitForBody(callback));
}

waitForBody(init);

})();
