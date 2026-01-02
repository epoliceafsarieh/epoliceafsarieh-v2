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

    .brandbar{
      position:relative;
      background:var(--brand-blue) !important;
      color:#fff;
      padding:6px 12px;
      height:60px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      overflow:hidden;
    }

    .brand-right{
      position:relative;
      display:flex;
      align-items:center;
      gap:12px;
      min-width:0;
      padding-right:90px;
      margin-right:-16px;
    }

    .svc-badge{
      width:72px;
      height:72px;
      border-radius:14px;
      display:flex;
      align-items:center;
      justify-content:center;
      border:2px solid var(--brand-blue);
      background:transparent;
      flex:0 0 auto;
      margin-top:6px;

      position:absolute;
      right:12px;
      top:50%;
      transform:translateY(-50%);
      z-index:2;
    }

    .svc-icon{
      width:66px;
      height:66px;
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
      z-index:3;
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

    details{margin:0}
    summary{cursor:pointer;list-style:none}
    summary::-webkit-details-marker{display:none}

    .fee-box{
      margin-top:10px;
      border:1px solid var(--border);
      border-radius:12px;
      padding:12px;
      background:#fff;
    }
    table{width:100%;border-collapse:collapse;font-size:13px}
    th,td{border:1px solid var(--border);padding:10px;text-align:center}
    th{background:#f2f5f9;font-weight:900}

    .content{padding:16px 16px 18px}

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
      background:var(--section-bg);
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
    .back-btn-footer{
      background:var(--brand-blue) !important;
      border:1px solid var(--brand-blue) !important;
      color:#fff !important;
    }

    .btn{
      background:rgba(4,30,66,.12);
      border:1px solid rgba(4,30,66,.35);
      padding:10px 14px;
      border-radius:12px;
      font-weight:900;
      color:#041E42;
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

    // ✅ فقط اینجا: اگر notDone نبود، از notice استفاده کن (بدون تغییر محتوا)
    const noticeList = (svc.notDone && svc.notDone.length) ? svc.notDone
                      : (svc.notice && svc.notice.length) ? svc.notice
                      : null;

    const notDoneHtml = (noticeList && noticeList.length)
      ? `
        <details class="sec" open>
          <summary>
            <span>نکات مهم</span>
            <small></small>
          </summary>
          <div class="sec-body">
            ${olList(noticeList)}
          </div>
        </details>
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
              <a class="back-btn back-btn-footer" href="index.html">بازگشت به صفحه اصلی</a>
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
