/* boot.js — Global minimal loader (Anti-FOUC / Anti-CLS)
   هدف: کاربر در هر صفحه (landing/all/service/hub) بلافاصله یک UI خنثی و تمیز ببیند
   و بعد از آماده شدن صفحه، Loader حذف شود.
*/

(function () {
  // اگر قبلاً ساخته شده، دوباره اجرا نکن
  if (window.__BOOT_LOADER__) return;
  window.__BOOT_LOADER__ = true;

  function ensureStyle() {
    if (document.getElementById('bootStyle')) return;
    var st = document.createElement('style');
    st.id = 'bootStyle';
    st.textContent = [
      ':root{--boot-bg:#f5f7fb;--boot-dot:#041E42;}',
      'html,body{margin:0;padding:0;}',
      'body{background:var(--boot-bg);}',
      '.boot-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;}',
      '.boot-overlay{background:var(--boot-bg);}',
      '.boot-spinner{width:48px;height:48px;border-radius:999px;border:4px solid rgba(4,30,66,.16);border-top-color:rgba(4,30,66,.75);animation:bootSpin .9s linear infinite;}',
      '@keyframes bootSpin{to{transform:rotate(360deg);}}',
      'html.boot-done .boot-overlay{display:none !important;}',
      'html.boot-loading body{overflow:hidden;}'
    ].join('\n');
    document.head.appendChild(st);
  }

  function ensureOverlay() {
    if (document.getElementById('bootOverlay')) return;
    var ov = document.createElement('div');
    ov.id = 'bootOverlay';
    ov.className = 'boot-overlay';
    ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<div class="boot-spinner"></div>';
    // اول body
    (document.body || document.documentElement).appendChild(ov);
  }

  function show() {
    ensureStyle();
    ensureOverlay();
    document.documentElement.classList.add('boot-loading');
    document.documentElement.classList.remove('boot-done');
  }

  function hide() {
    document.documentElement.classList.add('boot-done');
    document.documentElement.classList.remove('boot-loading');
    var ov = document.getElementById('bootOverlay');
    if (ov) ov.remove();
  }

  // API برای صفحات
  window.__bootShow = show;
  window.__bootHide = hide;

  // نمایش سریع
  if (document.readyState === 'loading') {
    // قبل از اولین paint هم معمولاً می‌رسد
    show();
    document.addEventListener('DOMContentLoaded', function () {
      // اگر صفحه هیچ اسکریپتی برای hide صدا نزده باشد، حداقل بعد از load خودکار جمع شود.
      // (برای صفحاتی مثل landing که ثابت‌اند)
      window.addEventListener('load', function () {
        // یک frame صبر برای layout
        requestAnimationFrame(function(){ setTimeout(function(){ if (!document.documentElement.classList.contains('boot-done')) hide(); }, 60); });
      }, { once: true });
    }, { once: true });
  } else {
    // اگر خیلی دیر لود شد، باز هم نمایش بده و سریع hide
    show();
    requestAnimationFrame(function(){ setTimeout(hide, 60); });
  }

  // فِیل‌سیف: هرگز بیش از 8 ثانیه روی صفحه نماند
  setTimeout(function(){
    if (!document.documentElement.classList.contains('boot-done')) hide();
  }, 8000);
})();
