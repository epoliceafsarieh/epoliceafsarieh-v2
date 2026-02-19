(function () {
  const BRAND_BG = "#041E42";
  const LOGO_SRC = "assets/img/logo/logo_white.png";

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
        <img class="boot-logo" alt="" />
        <div class="boot-spinner" aria-hidden="true"></div>
      </div>
    `;

    // ✅ مهم: اگر body هنوز نیامده، به html بچسبان؛ بعداً ok است
    const mount = document.body || document.documentElement;
    mount.appendChild(loader);

    // لوگو
    const imgEl = loader.querySelector(".boot-logo");
    if (imgEl) {
      imgEl.src = LOGO_SRC;
      imgEl.onload = () => {
        const sp = loader.querySelector(".boot-spinner");
        if (sp) sp.remove();
      };
      imgEl.onerror = () => {
        // اگر لوگو لود نشد، اسپینر بماند
      };
    }
  }

  function removeLoader() {
    const el = document.getElementById("bootLoader");
    if (!el) return;
    el.classList.add("boot-hide");
    setTimeout(() => el.remove(), 380);
  }

  function boot() {
    injectCSS();
    createLoader();

    // سیگنال حذف (از render.js / all.js / index / hub)
    window.__bootHide = removeLoader;

    // Fail-safe
    setTimeout(removeLoader, 8000);
  }

  // ✅ اگر body هنوز آماده نیست، صبر کن
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
