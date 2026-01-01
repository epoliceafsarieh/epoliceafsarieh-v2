(function () {
  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  function liList(items) {
    if (!items || !items.length) return "";
    return `<ul>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  }
  function safeText(v) {
    const t = (v ?? "").toString().trim();
    return t ? t : "—";
  }

  // Guard
  if (typeof window.SERVICES === "undefined") {
    const el = document.getElementById("app");
    if (el) el.innerHTML = `<div style="padding:16px;font-family:tahoma">خطا: فایل services.js بارگذاری نشده است.</div>`;
    return;
  }

  const style = `
  <style>
    :root{
      --ms-blue:#041E42;
      --bg:#f5f7fb; --card:#fff; --text:#0f172a; --muted:#475569;
      --border:#e6e8ee; --soft:#f1f5ff;
      --warn:#fff6e5; --warn-border:#ffd89a;
      --shadow:0 10px 30px rgba(2,8,23,.06); --radius:16px;
    }
    *{box-sizing:border-box}
    body{font-family:Tahoma,Arial,sans-serif;margin:0;background:var(--bg);color:var(--text);line-height:1.95}
    .wrap{max-width:860px;margin:18px auto 28px;padding:0 14px}
    .card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}

    /* Brand bar (هماهنگ با Index) */
    .brandbar{
      background:var(--ms-blue);
      color:#fff;
      padding:12px 14px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
    }
    .brand-left{
      display:flex;
      align-items:center;
      gap:10px;
      min-width:0;
    }
    .brand-logo{width:34px;height:34px;object-fit:contain}
    .svc-icon{width:34px;height:34px;object-fit:contain}
    .brand-title{
      font-weight:900;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      font-size:14px;
    }
    .back-btn{
      display:inline-flex;align-items:center;gap:6px;
      padding:8px 10px;border-radius:12px;
      background:rgba(255,255,255,.12);
      border:1px solid rgba(255,255,255,.22);
      color:#fff;text-decoration:none;font-size:13px;font-weight:900;
      cursor:pointer;
    }

    .header{padding:16px 16px 12px;border-bottom:1px solid var(--border);background:#fff}
    .title{margin:0 0 6px;font-size:20px;color:var(--ms-blue);text-align:center;letter-spacing:-.2px;font-weight:900}
    .subtitle{margin:0 auto 10px;font-size:13px;color:var(--muted);max-width:44rem;text-align:center}

    .content{padding:16px 16px 18px}

    .meta{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px}
    .pill{background:var(--soft);border:1px solid var(--border);border-radius:999px;padding:8px 12px;font-size:13px;display:flex;align-items:center;gap:8px;white-space:nowrap}
    details{margin:0}
    summary{cursor:pointer;list-style:none}
    summary::-webkit-details-marker{display:none}

    .fee-box{margin-top:10px;border:1px solid var(--border);border-radius:12px;padding:12px;background:#fff}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th,td{border:1px solid var(--border);padding:10px;text-align:center}
    th{background:#f2f5f9;font-weight:700}

    /* Sections as details (open by default) */
    .sec{margin-top:12px;border:1px solid var(--border);border-radius:12px;background:#fff;overflow:hidden}
    .sec summary{
      padding:12px 14px;
      font-size:15px;font-weight:900;color:#0f172a;
      display:flex;justify-content:space-between;gap:10px;
      background:#f8fbff;
    }
    .sec summary small{font-weight:700;color:#64748b;font-size:12px}
    .sec .sec-body{padding:12px 14px}

    ul{margin:0;padding-right:20px;font-size:14px}
    li{margin:8px 0}

    .note{background:var(--warn);border:1px solid var(--warn-border);border-radius:14px;padding:12px;font-size:13px;color:#3b2a00;margin-top:14px}
    .note div{margin:6px 0;font-weight:900}

    .footer{margin-top:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding-top:8px;border-top:1px dashed #e9edf5}
    .btn{background:#eaf2ff;border:1px solid #cfe0ff;padding:10px 12px;border-radius:14px;font-weight:900;color:#0a58ca;text-decoration:none}
    .hint{font-size:12px;color:#777}

    .faq-title{margin:14px 0 8px;font-size:15px;font-weight:900;color:#0f172a}
    .faq details{border:1px solid var(--border);border-radius:12px;padding:10px 12px;background:#fff;margin-top:10px}
    .faq summary{font-weight:900}
    .faq .ans{margin-top:8px;color:#334155;font-size:13px}
  </style>`;

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
    const app = document.getElementById("app");
    if (!app) return;

    if (!svc) {
      app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="content">این خدمت پیدا نشد.</div></div></div>`;
      return;
    }

    const feeKey = svc?.meta?.feeKey;
    const feeObj = (typeof window.FEES !== "undefined" && feeKey && window.FEES[feeKey]) ? window.FEES[feeKey] : null;

    let feeTable = "";
    if (feeObj && Array.isArray(svc.feeRows) && svc.feeRows.length) {
      const feeRows = svc.feeRows.map(r => ({
        title: r.label,
        value: feeObj[r.field]
      }));

      feeTable = `
        <details class="pill">
          <summary>هزینه: ${esc(svc?.meta?.feeSummary || "مطابق تعرفه رسمی")} (جزئیات)</summary>
          <div class="fee-box">
            <table>
              <tr><th>عنوان</th><th>مبلغ/توضیح</th></tr>
              ${feeRows.map(r => `<tr><td>${esc(r.title)}</td><td>${esc(safeText(r.value))}</td></tr>`).join("")}
            </table>
          </div>
        </details>
      `;
    }

    const timePill = svc?.meta?.time ? `<div class="pill">زمان معمول: ${esc(svc.meta.time)}</div>` : "";
    const photoPill = svc?.meta?.photo ? `<div class="pill">عکس: ${esc(svc.meta.photo)}</div>` : "";

    const sectionsHtml = (svc.sections || []).map(sec => `
      <details class="sec" open>
        <summary>
          <span>${esc(sec.heading || "")}</span>
          <small>${esc(sec.tag || "")}</small>
        </summary>
        <div class="sec-body">
          ${liList(sec.items || [])}
        </div>
      </details>
    `).join("");

    const notDoneHtml = (svc.notDone && svc.notDone.length)
      ? `
        <details class="sec" open>
          <summary>
            <span>چه کارهایی در این خدمت انجام نمی‌شود</span>
            <small>شفاف‌سازی</small>
          </summary>
          <div class="sec-body">
            ${liList(svc.notDone)}
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

    const noticeHtml = (svc.notice && svc.notice.length)
      ? `<div class="note">${(svc.notice || []).map(n => `<div>• ${esc(n)}</div>`).join("")}</div>`
      : "";

    // آیکن سفید فقط در نوار سرمه‌ای (نه در بدنه سفید)
    const svcIcon = svc.icon ? `<img class="svc-icon" src="${esc(svc.icon)}" alt="">` : "";
    const shortTitle = svc.shortTitle || "راهنمای خدمت";

    app.innerHTML = `
      ${style}
      <div class="wrap">
        <div class="card">

          <div class="brandbar">
            <div class="brand-left">
              <img class="brand-logo" src="assets/img/logo/logo_white.png" alt="">
              ${svcIcon}
              <div class="brand-title">${esc(shortTitle)}</div>
            </div>
            <a class="back-btn" href="index.html">بازگشت</a>
          </div>

          <div class="header">
            <h1 class="title">${esc(svc.title)}</h1>
            ${svc.subtitle ? `<div class="subtitle">${esc(svc.subtitle)}</div>` : ""}
            <div class="meta">
              ${timePill}
              ${feeTable}
              ${photoPill}
            </div>
          </div>

          <div class="content">
            ${sectionsHtml}
            ${notDoneHtml}
            ${faqHtml}
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

  // In scenario #2 every service page sets this:
  const key = window.SERVICE_KEY;
  if (!key) {
    const app = document.getElementById("app");
    if (app) app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="content">شناسه خدمت تنظیم نشده است.</div></div></div>`;
    return;
  }

  renderService(key);
})();
