// services/index.js
(function () {
  window.SERVICE_DATA = window.SERVICE_DATA || {};
  window.SERVICES = window.SERVICE_DATA;

  // نرمال‌سازی نام فیلدها برای سازگاری با render.js
  Object.keys(window.SERVICES).forEach((k) => {
    const svc = window.SERVICES[k];
    if (!svc) return;

    // اگر render.js دنبال notDone است ولی دیتا notice دارد
    if (!svc.notDone && Array.isArray(svc.notice)) svc.notDone = svc.notice;

    // برای تیتر نوار بالا، اگر render.js دنبال barTitle/shortTitle است
    if (!svc.barTitle && svc.title) svc.barTitle = svc.title;
  });
})();
