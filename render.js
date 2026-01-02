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

  const style = `
<style>
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

  .wrap{max-width:860px;margin:18px auto 40px;padding:0 14px}

  .card{
    background:var(--card);
    border:1px solid var(--border);
    border-radius:var(--radius);
    overflow:visible;
    box-shadow:var(--shadow);
  }

  .brandbar{
    position:sticky;
    top:0;
    z-index:1000;
    background:var(--brand-blue);
    color:#fff;
    padding:6px 12px;
    height:60px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    border-radius:var(--radius) var(--radius) 0 0;
  }

  .brand-right{
    position:relative;
    display:flex;
    align-items:center;
    gap:12px;
    min-width:0;
    padding-right:90px;
  }

  .svc-badge{
    width:72px;height:72px;border-radius:14px;
    display:flex;align-items:center;justify-content:center;
    border:2px solid var(--brand-blue);
    background:transparent;
    position:absolute;right:0;top:50%;
    transform:translateY(-50%);
  }

  .svc-icon{width:66px;height:66px;object-fit:contain}

  .svc-title{
    font-weight:900;
    font-size:18px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width:60vw;
  }

  .back-btn{
    padding:6px 10px;
    border-radius:12px;
    background:rgba(255,255,255,.12);
    border:1px solid rgba(255,255,255,.22);
    color:#fff;
    text-decoration:none;
    font-size:13px;
    font-weight:900;
  }

  .header{
    padding:14px 16px 12px;
    background:#fff;
    border-bottom:1px solid var(--border);
  }

  .meta{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    justify-content:center;
    align-items:center;
  }

  .pill{
    background:var(--soft);
    border:1px solid var(--border);
    border-radius:999px;
    padding:8px 12px;
    font-size:13px;
    font-weight:800;
    display:flex;
    align-items:center;
    gap:8px;
  }

  /* HERO */
  .hero{
    background:#fff;
    border-bottom:1px solid var(--border);
    padding:14px 16px;
  }

  .hero-title{
    font-weight:900;
    font-size:16px;
    margin:0 0 6px;
  }

  .hero-sub{
    margin:0 0 10px;
    color:#334155;
    font-size:13px;
  }

  .hero-actions{
    position:sticky;
    top:60px;
    z-index:900;
    background:#fff;
    padding:10px 0;
  }

  .btn-primary{
    display:block;
    text-align:center;
    background:var(--brand-blue);
    color:#fff;
    text-decoration:none;
    border-radius:14px;
    padding:12px 14px;
    font-weight:900;
  }

  .btn-secondary{
    display:block;
    text-align:center;
    margin-top:8px;
    background:#fff;
    color:var(--brand-blue);
    border:1px solid rgba(4,30,66,.35);
    border-radius:14px;
    padding:12px 14px;
    font-weight:900;
    text-decoration:none;
  }

  .content{padding:16px}

  details{margin-top:12px}
  summary{cursor:pointer;font-weight:900}
  summary::-webkit-details-marker{display:none}

</style>`;

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
    if (!svc) {
      app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="content">این خدمت پیدا نشد.</div></div></div>`;
      return;
    }

    const metaParts = [];
    if (svc?.meta?.time) metaParts.push(`<div class="pill">زمان معمول: ${esc(svc.meta.time)}</div>`);

    const heroPrimary = svc.heroPrimary || null;
    const heroSecondary = svc.heroSecondary || null;

    const heroHtml = `
      <div class="hero">
        ${svc.heroTitle ? `<div class="hero-title">${esc(svc.heroTitle)}</div>` : ""}
        ${svc.heroSubtitle ? `<p class="hero-sub">${esc(svc.heroSubtitle)}</p>` : ""}
        ${heroPrimary ? `
          <div class="hero-actions">
            <a class="btn-primary" href="${esc(heroPrimary.href)}">${esc(heroPrimary.label)}</a>
            ${heroSecondary ? `<a class="btn-secondary" href="${esc(heroSecondary.href)}">${esc(heroSecondary.label)}</a>` : ""}
          </div>` : ""}
      </div>
    `;

    const sectionsHtml = (svc.sections || []).map(sec => `
      <details>
        <summary>${esc(sec.heading || "")}</summary>
        <div>${liList(sec.items || [])}</div>
      </details>
    `).join("");

    app.innerHTML = `
      ${style}
      <div class="wrap">
        <div class="card">
          <div class="brandbar">
            <div class="brand-right">
              ${svc.icon ? `<div class="svc-badge"><img class="svc-icon" src="${esc(svc.icon)}"></div>` : ""}
              <div class="svc-title">${esc(svc.barTitle || "")}</div>
            </div>
            <a class="back-btn" href="index.html">بازگشت</a>
          </div>

          <div class="header">
            <div class="meta">${metaParts.join("")}</div>
          </div>

          ${heroHtml}

          <div class="content">
            ${sectionsHtml}
          </div>
        </div>
      </div>
    `;
  }

  if (!window.SERVICE_KEY) {
    app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="content">شناسه خدمت مشخص نیست.</div></div></div>`;
    return;
  }

  renderService(window.SERVICE_KEY);
})();
