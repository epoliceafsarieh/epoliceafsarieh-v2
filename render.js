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

  // لیست هوشمند
  function liList(items, opts) {
    if (!items || !items.length) return "";

    const clean = items.map(x => String(x ?? "").trim()).filter(Boolean);
    const isHead = (s) => /[:：]$/.test(s);
    const hasAnyHead = clean.some(isHead);

    const ulClass = (opts && opts.noBullets) ? ' class="no-bullets"' : "";

    // حالت ساده (بدون تیتر :)
    if (!hasAnyHead) {
      return `<ul${ulClass}>${clean.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    }

    let html = "";
    let i = 0;
    let openMainUl = false;

    const openUl = () => {
      if (!openMainUl) {
        html += `<ul${ulClass}>`;
        openMainUl = true;
      }
    };

    const closeUl = () => {
      if (openMainUl) {
        html += `</ul>`;
        openMainUl = false;
      }
    };

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

  const style = `
<style>
ul{margin:0;padding-right:20px;font-size:14px}
li{margin:8px 0}

/* فقط بولت‌های گام‌ها حذف شود — ساختار حفظ شود */
ul.no-bullets{
  list-style:none;
  padding-right:20px;
}

.subhead{margin:10px 0 6px;font-weight:900}
ul.sublist{padding-right:22px}
</style>`;

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
    if (!svc) return;

    let firstSectionHtml = "";
    const restSectionsHtml = (svc.sections || []).map((sec, idx) => {
      const body =
        idx === 0
          ? liList(sec.items || [], { noBullets: true })
          : liList(sec.items || []);

      const html = `
        <details class="sec"${idx !== 0 && sec.open ? " open" : ""}>
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

  if (window.SERVICE_KEY) {
    renderService(window.SERVICE_KEY);
  }
})();
