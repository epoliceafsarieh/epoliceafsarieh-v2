// render.js
(function () {
  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // =============================
  // لیست استاندارد (ساختار امن)
  // =============================
  function liList(items, opts) {
    if (!items || !items.length) return "";

    const noBullets = opts && opts.noBullets;
    const ulClass = noBullets ? ' class="no-bullets"' : "";

    let html = `<ul${ulClass}>`;
    items.forEach(x => {
      const t = String(x ?? "").trim();
      if (t) html += `<li>${esc(t)}</li>`;
    });
    html += `</ul>`;
    return html;
  }

  function olList(items) {
    if (!items || !items.length) return "";
    return `<ol>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ol>`;
  }

  const app = document.getElementById("app");
  if (!app) return;

  if (typeof window.SERVICES === "undefined") {
    app.innerHTML = `<div style="padding:16px">خطا: سرویس‌ها لود نشده‌اند</div>`;
    return;
  }

  const style = `
<style>
ul,ol{margin:0;padding-right:22px}
li{margin:8px 0}

ul.no-bullets{
  list-style:none;
  padding-right:0;
}
ul.no-bullets > li{
  list-style:none;
}
</style>`;

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
    if (!svc) {
      app.innerHTML = style + `<div>خدمت پیدا نشد</div>`;
      return;
    }

    let firstSectionHtml = "";
    const restSectionsHtml = (svc.sections || []).map((sec, idx) => {
      const body =
        idx === 0
          ? liList(sec.items || [], { noBullets: true }) // فقط گام‌ها بدون بولت
          : liList(sec.items || []);

      const html = `
        <details class="sec"${sec.open && idx !== 0 ? " open" : ""}>
          <summary><span>${esc(sec.heading || "")}</span></summary>
          <div class="sec-body">${body}</div>
        </details>
      `;

      if (idx === 0) {
        firstSectionHtml = html;
        return "";
      }
      return html;
    }).join("");

    app.innerHTML = `
      ${style}
      <div class="content">
        ${firstSectionHtml}

        <details class="sec" id="docs">
          <summary><span>مدارک لازم (چک لیست)</span></summary>
          <div class="sec-body">
            ${restSectionsHtml}
          </div>
        </details>
      </div>
    `;
  }

  const key = window.SERVICE_KEY;
  if (!key) {
    app.innerHTML = style + `<div>شناسه خدمت مشخص نیست</div>`;
    return;
  }

  renderService(key);
})();
