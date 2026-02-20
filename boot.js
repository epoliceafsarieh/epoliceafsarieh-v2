(function () {
  const BG = "#041E42";
  const LOGO = "assets/img/logo/logo_white.png";

  // ✅ سیاست نمایش
  const FIRST_VISIT_MIN_SHOW = 800;   // اولین ورود: حداقل 800ms نمایش
  const DELAY_SHOW = 450;             // دفعات بعد: اگر تا 450ms آماده نشد، نشان بده
  const FAILSAFE = 8000;

  const KEY = "ep_seen_v1"; // کلید اولین ورود (سراسری برای کل سایت)

  let shown = false;
  let done = false;
  let showTimer = null;
  let failTimer = null;
  let minShowUntil = 0;

  // حذف فلش سفید
  try {
    document.documentElement.style.background = BG;
    if (document.body) document.body.style.background = BG;
  } catch (e) {}

  function injectCSS() {
    if (document.getElementById("bootCSS")) return;
    const style = document.createElement("style");
    style.id = "bootCSS";
    style.textContent = `
      html,body{background:${BG} !important;}
      #bootLoader{
        position:fixed; inset:0; background:${BG};
        display:flex; align-items:center; justify-content:center;
        z-index:99999; transition:opacity .28s ease;
      }
      #bootLoader.boot-hide{opacity:0}
      .boot-inner{display:flex;flex-direction:column;align-items:center;gap:14px}
      .boot-logo{
        width:92px;height:auto;
        animation:pulse 1.45s ease-in-out infinite;
        filter: drop-shadow(0 10px 18px rgba(0,0,0,.25));
      }
      @keyframes pulse{
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
    injectCSS();

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
      imgEl.src = LOGO;
      imgEl.onload = () => {
        const sp = loader.querySelector(".boot-spinner");
        if (sp) sp.remove();
      };
    }

    shown = true;
    failTimer = setTimeout(forceHide, FAILSAFE);
  }

  function forceHide() {
    const el = document.getElementById("bootLoader");
    if (!el) return;
    el.classList.add("boot-hide");
    setTimeout(() => el.remove(), 300);
  }

  function hideRespectMinTime() {
    if (!shown) return;

    const now = Date.now();
    const wait = Math.max(0, minShowUntil - now);

    setTimeout(() => {
      if (!shown) return;
      forceHide();
    }, wait);
  }

  function markDone() {
    if (done) return;
    done = true;

    if (showTimer) clearTimeout(showTimer);
    if (failTimer) clearTimeout(failTimer);

    // اگر لودر نمایش داده شده، با رعایت حداقل زمان نمایش جمع کن
    hideRespectMinTime();
  }

  // سیگنال عمومی برای all.js و render.js
  window.__bootHide = markDone;

  // تشخیص اولین ورود (سراسری)
  let firstVisit = false;
  try {
    firstVisit = !localStorage.getItem(KEY);
    if (firstVisit) localStorage.setItem(KEY, "1");
  } catch (e) {}

  if (firstVisit) {
    // ✅ اولین ورود: فوراً نشان بده و حداقل چند لحظه نگه دار
    minShowUntil = Date.now() + FIRST_VISIT_MIN_SHOW;
    createLoader();
  } else {
    // ✅ دفعات بعد: فقط اگر طول کشید نشان بده
    showTimer = setTimeout(() => {
      // اگر قبل از این، آماده شدیم، اصلاً نشان نده
      if (done) return;
      createLoader();
    }, DELAY_SHOW);
  }

  // اگر صفحه خودش سریع آماده شد، done را صدا بزن (باز هم all.js/render.js دقیق‌ترند)
  document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() => requestAnimationFrame(markDone));
  }, { once: true });

  window.addEventListener("load", markDone, { once: true });

})();
