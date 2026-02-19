(function () {
  const BRAND_BG = "#041E42";
  const LOGO_SRC = "assets/img/logo/logo_white.png";
  const SHOW_DELAY_MS = 250;
  const FAILSAFE_MS = 8000;

  let showTimer = null;
  let failTimer = null;
  let shown = false;
  let done = false;

  // حذف فلش سفید
  try {
    document.documentElement.style.background = BRAND_BG;
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
        transition:opacity .28s ease;
      }
      #bootLoader.boot-hide{opacity:0}

      .boot-inner{display:flex;flex-direction:column;align-items:center;gap:14px}
      .boot-logo{
        width:92px; height:auto;
        animation:pulseLogo 1.45s ease-in-out infinite;
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
        animation:spin .85s linear infinite;
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
    (document.body || document.documentElement).appendChild(loader);

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
    if (done) return;          // اگر صفحه آماده شد، اصلاً نشان نده
    shown = true;
    injectCSS();
    createLoader();
    failTimer = setTimeout(hideNow, FAILSAFE_MS);
  }

  function hideNow() {
    if (!shown) return;
    const el = document.getElementById("bootLoader");
    if (!el) return;
    el.classList.add("boot-hide");
    setTimeout(() => el.remove(), 300);
  }

  function markDone() {
    if (done) return;
    done = true;

    if (showTimer) clearTimeout(showTimer);
    if (failTimer) clearTimeout(failTimer);

    // اگر لودر نمایش داده شده، جمعش کن
    hideNow();
  }

  // ✅ این را برای کدهای دیگر هم نگه می‌داریم (اگر خواستی بعداً از render.js صدا بزنی)
  window.__bootHide = markDone;

  // ✅ اگر DOM آماده شد، معمولاً کافی است (مخصوصاً صفحات ساده مثل index / all / hub)
  document.addEventListener("DOMContentLoaded", () => {
    // یک فریم فرصت بده تا اسکریپت‌ها inject کنند
    requestAnimationFrame(() => requestAnimationFrame(markDone));
  }, { once: true });

  // ✅ اگر تصاویر/فونت‌ها دیر برسند، نهایتاً load هم جمعش می‌کند
  window.addEventListener("load", markDone, { once: true });

  // ✅ برای صفحات سرویس که با JS داخل #app رندر می‌شوند:
  // وقتی #app اولین محتوا را گرفت، یعنی صفحه عملاً آماده نمایش است
  try {
    const app = document.getElementById("app");
    if (app) {
      const obs = new MutationObserver(() => {
        if (app.childNodes && app.childNodes.length > 0) {
          obs.disconnect();
          markDone();
        }
      });
      obs.observe(app, { childList: true, subtree: true });
    }
  } catch (e) {}

  // ✅ نمایش با تأخیر (روی اینترنت سریع معمولاً قبل از این done می‌شود و اصلاً نمی‌آید)
  showTimer = setTimeout(showLoader, SHOW_DELAY_MS);

})();
