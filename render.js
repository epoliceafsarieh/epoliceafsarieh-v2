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
  function liList(items) {
    if (!items || !items.length) return "";

    const clean = items.map(x => String(x ?? "").trim()).filter(Boolean);
    const isHead = (s) => /[:：]$/.test(s);
    const hasAnyHead = clean.some(isHead);

    if (!hasAnyHead) return `<ul>${clean.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;

    let html = "";
    let i = 0;

    let openMainUl = false;
    const openUl = () => { if (!openMainUl) { html += `<ul>`; openMainUl = true; } };
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

  /* --- بقیه فایل دقیقاً همان نسخهٔ اولیهٔ شماست --- */

})();
