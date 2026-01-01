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

  function ul(items) {
    if (!items || !items.length) return "";
    return `<ul>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  }

  function ol(items) {
    if (!items || !items.length) return "";
    return `<ol>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ol>`;
  }

  // ---------- Guards ----------
  const app = document.getElementById("app");
  if (!app) return;

  if (typeof window.SERVICES === "undefined") {
    app.innerHTML = `<div style="padding:16px;font-family:tahoma">خطا: فایل services.js بارگذاری نشده است.</div>`;
    return;
  }

  // ---------- Shared Styles ----------
  const style = `
  <style>
    :root{
      --brand:#0b3b7a;
      --bg:#f5f7fb;
      --card:#ffffff;
      --text:#0f172a;
      --muted:#475569;
      --border:#e6e8ee;
      --soft:#f1f5ff;

      --danger-bg:#fff1f2;
      --danger-border:#fecdd3;
      --danger-text:#9f1239;

      --shadow:0 10px 30px rgba(2,8,23,.06);
      --radius:16px;
    }

    *{box-sizing:border-box}

    body{
      margin:0;
      font-family:Tahoma, Arial, sans-serif;
      background:var(--bg);
      color:var(--text);
      line-height:1.9;
    }

    .wrap{max-width:860px;margin:16px auto 24px;padding:0 14px}

    .card{
      background:var(--card);
      border:1px solid var(--border);
      border-radius:var(--radius);
      overflow:hidden;
      box-shadow:var(--shadow);
    }

    /* ---------- Top brand bar (باریک) ---------- */
    .brandbar{
      background:var(--brand);
      color:#fff;
      padding:8px 12px;          /* باریک */
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
    }

    .brand-right{
      display:flex;
      align-items:center;
      gap:12px;
      min-width:0;
    }

    /* ---------- Service icon (بزرگ) ---------- */
    .svc-badge{
      width:78px;
      height:78px;
      border-radius:16px;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid var(--brand);
      background:rgba(255,255,255,.12);
      flex:0 0 auto;
    }

    .svc-icon{
      width:58px;
      height:58px;
      object-fit:contain;
      display:block;
    }

    .svc-title{
      font-weight:900;
      font-size:18px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width:60vw;
      letter-spacing:-.2px;
    }

    .back-btn{
      padding:6px 10px;
      border-radius:12px;
      background:rgba(255,255,255,.15);
      border:1px solid rgba(255,255,255,.25);
      color:#fff;
      font-weight:900;
      text-decoration:none;
      font-size:13px;
      cursor:pointer;
      white-space:nowrap;
    }

    /* ---------- Header under brand bar (فقط متا) ---------- */
    .header{
      padding:12px 16px 10px;
      border-bottom:1px solid var(--border);
      background:#fff;
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
      padding:6px 10px;
      font-size:12px;
      font-weight:900;
      color:#0f172a;
      white-space:nowrap;
    }

    details{margin:0}
    summary{cursor:pointer;list-style:none}
    summary::-webkit-details-marker{display:none}

    .fee-pill summary{
      display:flex;
      align-items:center;
      gap:8px;
      justify-content:center;
    }

    .fee-box{
      margin-top:10px;
      border:1px solid var(--border);
      border-radius:12px;
      padding:10px;
      background:#fff;
    }

    table{width:100%;border-collapse:collapse;font-size:13px}
    th,td{border:1px solid var(--border);padding:10px;text-align:center}
    th{background:#f2f5f9;font-weight:900}

    /* ---------- Content ---------- */
    .content{padding:16px}

    .sec{
      margin-top:12px;
      border:1px solid var(--border);
      border-radius:12px;
      background:#fff;
      overflow:hidden;
    }

    .sec summary{
      padding:10px 14px;
      font-weight:900;
      background:#f8fbff;
      cursor:pointer;
      display:flex;
      justify-content:space-between;
      gap:10px;
    }

    .sec summary small{
      font-weight:900;
      font-size:12px;
      color:#64748b;
    }

    .sec-body{padding:12px 14px}

    ul{margin:0;padding-right:18px}
    li{margin:6px 0}

    /* ---------- Not done (قرمز + شماره‌دار) ---------- */
    .danger{
      margin-top:14px;
      border:1px solid var(--danger-border);
      background:var(--danger-bg);
      border-radius:14px;
      padding:12px 14px;
      color:var(--danger-text);
    }

    .danger-title{
      font-weight:900;
      margin-bottom:8px;
      color:var(--danger-text);
    }

    .danger ol{
      margin:0;
      padding-right:18px;
      font-weight:900;
      color:#7f1d1d;
    }

    .danger li{margin:8px 0}

    /* ---------- Footer ---------- */
    .footer{
      margin-top:16px;
      border-top:1px dashed #e9edf5;
      padding-top:10px;
      display:flex;
      justify-content:space-between;
      gap:10px;
      flex-wrap:wrap;
      align-items:center;
    }

    .btn{
      background:#eaf2ff;
      border:1px solid #cfe0ff;
      padding:8px 12px;
      border-radius:14px;
      font-weight:900;
      color:#0a58ca;
      text-decoration:none;
    }

    .hint{font-size:12px;color:#777}
  </style>`;

  // ---------- Renderer ----------
  function renderService(key) {
    const svc = window.SERVICES[key];
    if (!svc) {
      app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="content">این خدمت پیدا نشد.</div></div></div>`;
      return;
    }

    // Meta pills (فقط زمان + هزینه)
    const metaParts = [];

    if (svc?.meta?.time) {
      metaParts.push(`<div class="pill">زمان معمول: ${esc(svc.meta.time)}</div>`);
    }

    // Fee table (optional)
    let feeHtml = "";
    const feeKey = svc?.meta?.feeKey;
    const feeObj = (typeof window.FEES !== "undefined" && feeKey && window.FEES[feeKey]) ? window.FEES[feeKey] : null;

    if (feeObj && Array.isArray(svc.feeRows) && svc.feeRows.length) {
      const rows = svc.feeRows.map(r => ({
        label: r.label,
        value: feeObj[r.field]
      }));

      feeHtml = `
        <details class="pill fee-pill">
          <summary>هزینه: ${esc(svc?.meta?.feeSummary || "مطابق تعرفه رسمی")} (جزئیات)</summary>
          <div class="fee-box">
            <table>
              <tr><th>عنوان</th><th>مبلغ/توضیح</th></tr>
              ${rows.map(r => `<tr><td>${esc(r.label)}</td><td>${esc(safeText(r.value))}</td></tr>`).join("")}
            </table>
          </div>
        </details>
      `;
    }

    // Sections
    const sectionsHtml = (svc.sections || []).map(sec => `
      <details class="sec" open>
        <summary>
          <span>${esc(sec.heading || "")}</span>
          <small>${esc(sec.tag || "")}</small>
        </summary>
        <div class="sec-body">${ul(sec.items || [])}</div>
      </details>
    `).join("");

    // Not done (قرمز + شماره‌دار)
    const notDoneHtml = (svc.notDone && svc.notDone.length)
      ? `
        <div class="danger">
          <div class="danger-title">چه کارهایی در این خدمت انجام نمی‌شود</div>
          ${ol(svc.notDone)}
        </div>
      ` : "";

    // Optional notice (اگر خواستی نگه داریم؛ فعلاً دست نمی‌زنیم)
    const noticeHtml = (svc.notice && svc.notice.length)
      ? `
        <div class="sec" style="padding:12px 14px">
          <div style="font-weight:900;margin-bottom:8px">نکات مهم</div>
          ${ul(svc.notice)}
        </div>
      ` : "";

    const iconHtml = svc.icon
      ? `<div class="svc-badge"><img class="svc-icon" src="${esc(svc.icon)}" alt=""></div>`
      : "";

    app.innerHTML = `
      ${style}
      <div class="wrap">
        <div class="card">

          <div class="brandbar">
            <div class="brand-right">
              ${iconHtml}
              <div class="svc-title">${esc(svc.barTitle || svc.shortTitle || "")}</div>
            </div>
            <a class="back-btn" href="index.html">بازگشت</a>
          </div>

          <div class="header">
            <div class="meta">
              ${metaParts.join("")}
              ${feeHtml}
            </div>
          </div>

          <div class="content">
            ${sectionsHtml}
            ${notDoneHtml}
            ${noticeHtml}

            <div class="footer">
              <a class="btn" href="index.html">بازگشت به صفحه اصلی</a>
              <span class="hint">این راهنما به مرور کامل‌تر می‌شود</span>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // ---------- Entry ----------
  const key = window.SERVICE_KEY;
  if (!key) {
    app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="content">شناسه خدمت مشخص نیست.</div></div></div>`;
    return;
  }

  renderService(key);
})();
