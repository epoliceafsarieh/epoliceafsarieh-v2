// render.js
(function () {
  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  function safeText(v) {
    const t = (v ?? "").toString().trim();
    return t ? t : "—";
  }

  // لیست هوشمند: تیترهای داخلی با ":" و زیرلیست
  // فقط برای گام‌ها امکان حذف بولت
  function liList(items, opts) {
    if (!items || !items.length) return "";

    const clean = items.map(x => String(x ?? "").trim()).filter(Boolean);
    const isHead = (s) => /[:：]$/.test(s);
    const hasAnyHead = clean.some(isHead);

    const ulCls = (opts && opts.noBullets) ? ` class="no-bullets"` : "";

    // ✅ اصلاح ۱: فقط در صورت noBullets کلاس بده
    if (!hasAnyHead) {
      return `<ul${ulCls}>${clean.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    }

    let html = "";
    let i = 0;

    let openMainUl = false;
    const openUl = () => { if (!openMainUl) { html += `<ul${ulCls}>`; openMainUl = true; } };
    const closeUl = () => { if (openMainUl) { html += `</ul>`; openMainUl = false; } };

    while (i < clean.length) {
      const cur = clean[i];

      if (isHead(cur)) {
        closeUl();
        html += `<div class="subhead">${esc(cur)}</div>`;

        const sub = [];
        i++;
        while (i < clean.length && !isHead(clean[i])) {
          sub.push(clean[i]);
          i++;
        }

        // ✅ اصلاح ۲: زیرلیست همیشه بولت‌دار
        if (sub.length) {
          html += `<ul class="sublist">${sub.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
        }
        continue;
      }

      openUl();
      html += `<li>${esc(cur)}</li>`;
      i++;
    }

    closeUl();
    return html;
  }

  function olList(items) {
    if (!items || !items.length) return "";
    return `<ol>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ol>`;
  }

  const app = document.getElementById("app");
  if (!app) return;

  if (typeof window.SERVICES === "undefined") {
    app.innerHTML = `<div style="padding:16px;font-family:tahoma">خطا: فایل‌های سرویس بارگذاری نشده است.</div>`;
    return;
  }

  const style = `
<style>
@font-face{
  font-family:"Vazirmatn";
  src:url("assets/fonts/vazirmatn/Vazirmatn-Regular.woff2") format("woff2");
  font-weight:400;
  font-style:normal;
  font-display:swap;
}
@font-face{
  font-family:"Vazirmatn";
  src:url("assets/fonts/vazirmatn/Vazirmatn-Medium.woff2") format("woff2");
  font-weight:500;
  font-style:normal;
  font-display:swap;
}
@font-face{
  font-family:"Vazirmatn";
  src:url("assets/fonts/vazirmatn/Vazirmatn-Bold.woff2") format("woff2");
  font-weight:700;
  font-style:normal;
  font-display:swap;
}
:root{
  --brand-blue:#041E42;
  --bg:#f5f7fb;
  --card:#fff;
  --text:#0f172a;
  --muted:#475569;
  --border:#e6e8ee;
  --soft:#f1f5ff;
  --shadow:0 10px 30px rgba(2,8,23,.06);
  --radius:16px;
  --section-bg:#f8fbff;
}

*{box-sizing:border-box}
body{
  margin:0;
  font-family:"Vazirmatn", Tahoma, Arial, sans-serif;
  background:var(--bg);
  color:var(--text);
  line-height:1.95;
}

ul.no-bullets{
  list-style:none;
  padding-right:0;
}
ul.no-bullets > li{
  list-style:none;
}

/* زیرلیست‌ها بولت دارند */
ul.sublist{
  list-style:disc;
  padding-right:22px;
}
</style>`;

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
    if (!svc) return;

    let firstSectionHtml = "";
    const restSectionsHtml = (svc.sections || []).map((sec, idx) => {
      const body = (idx === 0)
        ? liList(sec.items || [], { noBullets: true })
        : liList(sec.items || []);

      const html = `
        <details class="sec">
          <summary>
            <span>${esc(sec.heading || "")}</span>
            <small>${esc(sec.tag || "")}</small>
          </summary>
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
      <div class="wrap">
        ${firstSectionHtml}
        ${restSectionsHtml}
      </div>
    `;
  }

  const key = window.SERVICE_KEY;
  if (!key) return;
  renderService(key);
})();
