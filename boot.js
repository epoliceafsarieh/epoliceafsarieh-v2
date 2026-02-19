(function () {
  const BRAND_BG = "#041E42";
  const LOGO_SRC = "assets/img/logo/logo_white.png";
  const SHOW_DELAY_MS = 350; // ✅ فقط اگر بیشتر از این طول کشید، لودر را نشان بده
  const FAILSAFE_MS = 8000;

  let showTimer = null;
  let failTimer = null;
  let shown = false;

  // ✅ 1) از همان اول، قبل از هر paint، پس‌زمینه را سرمه‌ای کن (حذف فلش سفید)
  try {
    document.documentElement.style.background = BRAND_BG;
    // اگر body هنوز نیامده، مشکلی نیست
    if (document.body) document.body.style.background = BRAND_BG;
  } catch (e) {}

  function injectCSS() {
    if (document.getElementById("bootCSS")) return;
    const style = document.createElement("style");
    style.id = "bootCSS";
    style.textContent = `
      html,body{background:${BRAND_BG} !important;}

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

    const mount = document.body || document.documentElement;
    mount.appendChild(loader);

    const imgEl = loader.querySelector(".boot-logo");
    if (imgEl) {
      imgEl.src = LOGO_SRC;
      imgEl.onload = () => {
        const sp = loader.querySelector(".boot-spinner");
        if (sp) sp.remove();
      };
    }
  }

  function showLoader() {
    shown = true;
    injectCSS();
    createLoader();

    // Fail-safe فقط وقتی نمایش داده شد
    failTimer = setTimeout(hideLoader, FAILSAFE_MS);
  }

  function hideLoader() {
    if (showTimer) clearTimeout(showTimer);
    if (failTimer) clearTimeout(failTimer);

    const el = document.getElementById("bootLoader");
    if (!el) return;
    el.classList.add("boot-hide");
    setTimeout(() => el.remove(), 380);
  }

  // ✅ 2) سیگنال پایان: اگر لود سریع بود، تایمر را کنسل می‌کند و لودر اصلاً ساخته نمی‌شود
  window.__bootHide = function () {
    if (showTimer) clearTimeout(showTimer);
    if (shown) hideLoader(); // فقط اگر واقعاً نمایش داده شده
  };

  // ✅ 3) لودر را با تأخیر نشان بده
  // اگر DOM هنوز آماده نیست، باز هم ok: showLoader mount را body||html می‌کند
  showTimer = setTimeout(showLoader, SHOW_DELAY_MS);

})();
