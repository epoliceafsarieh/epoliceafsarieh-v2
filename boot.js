(function () {
  const BRAND_BG = "#041E42"; // پس‌زمینه مناسب برای لوگوی سفید

  // چند مسیر رایج لوگو در پروژه‌ها (یکی باید جواب بدهد)
  const LOGO_CANDIDATES = [
    "assets/img/logo/logo_white.png",
    "/assets/img/logo/logo_white.png",
    "assets/img/logo/logo.png",
    "/assets/img/logo/logo.png",
    "assets/img/logo/logo.svg",
    "/assets/img/logo/logo.svg",
  ];

  function injectCSS() {
    if (document.getElementById("bootCSS")) return;
    const style = document.createElement("style");
    style.id = "bootCSS";
    style.textContent = `
      #bootLoader{
        position:fixed; inset:0;
        background:${BRAND_BG};
        display:flex; align-items:center; justify-content:center;
        z-index:99999;
        transition:opacity .35s ease;
      }
      #bootLoader.boot-hide{opacity:0}
      .boot-inner{display:flex;flex-direction:column;align-items:center;gap:14px}
      .boot-logo{
        width:92px; height:auto;
        animation:pulseLogo 1.5s ease-in-out infinite;
        filter: drop-shadow(0 10px 18px rgba(0,0,0,.25));
      }
      @keyframes pulseLogo{
        0%{transform:scale(1);opacity:.92}
        50%{transform:scale(1.07);opacity:1}
        100%{transform:scale(1);opacity:.92}
      }
      .boot-spinner{
        width:22px;height:22px;border-radius:999px;
        border:3px solid rgba(255,255,255,.25);
        border-top-color: rgba(255,255,255,.9);
        animation:spin .9s linear infinite;
      }
      @keyframes spin{to{transform:rotate(360deg)}}
    `;
    document.head.appendChild(style);
  }

  function createLoader() {
    if (document.getElementById("bootLoader")) return;
    const loader = document.createElement("div");
    loader.id = "bootLoader";
    loader.innerHTML = `
      <div class="boot-inner">
        <img class="boot-logo" alt="" style="display:none" />
        <div class="boot-spinner" aria-hidden="true"></div>
      </div>
    `;
    document.body.appendChild(loader);
  }

  function tryLoadLogo(imgEl) {
    return new Promise((resolve) => {
      let i = 0;
      function next() {
        if (i >= LOGO_CANDIDATES.length) return resolve(false);
        const src = LOGO_CANDIDATES[i++];
        const probe = new Image();
        probe.onload = () => {
          imgEl.src = src;
          imgEl.style.display = "block";
          resolve(true);
        };
        probe.onerror = () => next();
        probe.src = src + (src.includes("?") ? "&" : "?") + "v=" + Date.now();
      }
      next();
    });
  }

  function removeLoader() {
    const el = document.getElementById("bootLoader");
    if (!el) return;
    el.classList.add("boot-hide");
    setTimeout(() => el.remove(), 380);
  }

  injectCSS();
  createLoader();

  const imgEl = document.querySelector("#bootLoader .boot-logo");
  if (imgEl) {
    tryLoadLogo(imgEl).then((ok) => {
      // اگر لوگو پیدا شد، اسپینر را حذف کن
      if (ok) {
        const sp = document.querySelector("#bootLoader .boot-spinner");
        if (sp) sp.remove();
      }
    });
  }

  // سیگنال پایان لود از صفحات (render.js / all.js / hub / index)
  window.__bootHide = removeLoader;

  // Fail-safe: اگر جایی سیگنال نیامد، گیر نکند
  setTimeout(removeLoader, 8000);
})();
