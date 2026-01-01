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
    return `<ul>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  }
  function olList(items) {
    if (!items || !items.length) return "";
    return `<ol>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ol>`;
  }

  const app = document.getElementById("app");
  if (!app) return;

  if (typeof window.SERVICES === "undefined") {
    app.innerHTML = `<div style="padding:16px;font-family:tahoma">خطا: فایل services.js بارگذاری نشده است.</div>`;
    return;
  }

  const style = `
  <style>
    :root{
      --brand-blue:#041E42; /* منبع واحد رنگ */
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
      font-family:Tahoma,Arial,sans-serif;
      background:var(--bg);
      color:var(--text);
      line-height:1.95;
    }
    .wrap{max-width:860px;margin:18px auto 28px;padding:0 14px}
    .card{
      background:var(--card);
      border:1px solid var(--border);
      border-radius:var(--radius);
      overflow:hidden;
      box-shadow:var(--shadow);
    }

    /* نوار بالا — باریک‌تر و هم‌رنگ دور آیکون */
    .brandbar{
      background:var(--brand-blue);
      color:#fff;
      padding:4px 12px; /* باریک‌تر از قبل */
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

    .svc-badge{
      width:80px;
      height:80px;
      border-radius:16px;
      display:flex;
      align-items:center;
      justify-content:center;
      border:2px solid currentColor; /* دقیقاً همان رنگ */
      background:rgba(255,255,255,.10);
      flex:0 0 auto;
    }

    .svc-icon{
      width:74px;
      height:74px;
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
      display:inline-flex;
      align-items:center;
      gap:6px;
      padding:6px 10px;
      border-radius:12px;
      background:rgba(255,255,255,.12);
      border:1px solid rgba(255,255,255,.22);
      color:#fff;
      text-decoration:none;
      font-size:13px;
      font-weight:900;
      cursor:pointer;
      white-space:nowrap;
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
      margin-top:6px;
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
      white-space:nowrap;
    }

    .content{padding:16px 16px 18px}

    /* سکشن‌ها */
    .sec{
      margin-top:12px;
      border:1px solid var(--border);
      border-radius:12px;
      background:#fff;
      overflow:hidden;
    }
    .sec summary{
      padding:12px 14px;
      font-size:15px;
      font-weight:900;
      color:#0f172a;
      display:flex;
      justify-content:space-between;
      gap:10px;
      background:var(--section-bg);
    }
    .sec summary small{
      font-weight:600;
      color:#64748b;
      font-size:12px;
    }
    .sec-body{padding:12px 14px}

    ul,ol{margin:0;padding-right:20px;font-size:14px}
    li{margin:8px 0;font-weight:normal}

    /* نکات مهم — فقط عنوان بولد */
    .notdone{
      margin-top:14px;
      border:1px solid var(--border);
      background:#fff;
      border-radius:14px;
      padding:12px 14px;
    }
    .notdone-title{
      font-weight:900;
      margin-bottom:8px;
    }
    .notdone ol li{
      font-weight:normal;
    }

    /* FAQ */
    .faq-title{margin:14px 0 8px;font-size:15px;font-weight:900}
    .faq details{
      border:1px solid var(--border);
      border-radius:12px;
      padding:0;
      background:#fff;
      margin-top:10px;
      overflow:hidden;
    }
    .faq summary{
      padding:12px 14px;
      font-weight:900;
      background:var(--section-bg); /* آبی کم‌رنگ */
      cursor:pointer;
    }
    .faq .ans{
      padding:10px 14px;
      color:#334155;
      font-size:13px;
      font-weight:normal;
    }

    .footer{
      margin-top:14px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
      padding-top:8px;
      border-top:1px dashed #e9edf5;
    }
    .btn{
      background:#eaf2ff;
      border:1px solid #cfe0ff;
      padding:10px 12px;
      border-radius:14px;
      font-weight:900;
      color:#0a58ca;
      text-decoration:none;
    }
    .hint{font-size:12px;color:#777}
  </style>`;

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
    if (!svc) {
      app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="content">این خدمت پیدا نشد.</div></div></div>`;
      return;
    }

    const metaParts = [];
    if (svc?.meta?.time) metaParts.push(`<div class="pill">زمان معمول: ${esc(svc.meta.time)}</div>`);

    let feeHtml = "";
    const feeKey = svc?.meta?.feeKey;
    const feeObj = (typeof window.FEES !== "undefined" && feeKey && window.FEES[feeKey]) ? window.FEES[feeKey] : null;

    if (feeObj && Array.isArray(svc.feeRows) && svc.feeRows.length) {
      const rows = svc.feeRows.map(r => ({ title: r.label, value: feeObj[r.field] }));
      feeHtml = `
        <details class="pill">
          <summary>هزینه: ${esc(svc?.meta?.feeSummary || "مطابق تعرفه رسمی")} (جزئیات)</summary>
          <div class="fee-box">
            <table>
              <tr><th>عنوان</th><th>مبلغ/توضیح</th></tr>
              ${rows.map(r => `<tr><td>${esc(r.title)}</td><td>${esc(safeText(r.value))}</td></tr>`).join("")}
            </table>
          </div>
        </details>
      `;
    }

    const sectionsHtml = (svc.sections || []).map(sec => `
      <details class="sec" open>
        <summary>
          <span>${esc(sec.heading || "")}</span>
          <small>${esc(sec.tag || "")}</small>
        </summary>
        <div class="sec-body">${liList(sec.items || [])}</div>
      </details>
    `).join("");

    const notDoneHtml = (svc.notDone && svc.notDone.length)
      ? `
        <div class="notdone">
          <div class="notdone-title">نکات مهم</div>
          ${olList(svc.notDone)}
        </div>
      `
      : "";

    const faqHtml = (svc.faq && svc.faq.length)
      ? `
        <div class="faq">
          <div class="faq-title">سؤالات پرتکرار</div>
          ${svc.faq.map(f => `
            <details>
              <summary>${esc(f.q || "")}</summary>
              <div class="ans">${esc(f.a || "")}</div>
            </details>
          `).join("")}
        </div>
      `
      : "";

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
            ${faqHtml}

            <div class="footer">
              <a class="btn" href="index.html">بازگشت به صفحه اصلی</a>
              <span class="hint">این راهنما به مرور کامل‌تر می‌شود</span>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  const key = window.SERVICE_KEY;
  if (!key) {
    app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="content">شناسه خدمت مشخص نیست.</div></div></div>`;
    return;
  }

  renderService(key);
})();
