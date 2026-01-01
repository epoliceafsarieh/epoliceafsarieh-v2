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
      --ms-blue:#041E42; /* رنگ دور آیکون */
      --bg:#f5f7fb;
      --card:#fff;
      --text:#0f172a;
      --muted:#475569;
      --border:#e6e8ee;
      --soft:#f1f5ff;
      --shadow:0 10px 30px rgba(2,8,23,.06);
      --radius:16px;
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

    /* نوار بالا — ۲۰٪ باریک‌تر + هم‌رنگ دور آیکون */
    .brandbar{
      background:var(--ms-blue);
      color:#fff;
      padding:5px 12px; /* قبلاً 6px → ۲۰٪ کمتر */
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

    /* آیکون — بدون تغییر */
    .svc-badge{
      width:80px;
      height:80px;
      border-radius:16px;
      display:flex;
      align-items:center;
      justify-content:center;
      border:2px solid var(--ms-blue);
      background:transparent;
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
    }

    .back-btn{
      padding:6px 10px;
      border-radius:12px;
      background:rgba(255,255,255,.12);
      border:1px solid rgba(255,255,255,.25);
      color:#fff;
      text-decoration:none;
      font-size:13px;
      font-weight:900;
      cursor:pointer;
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
      margin-top:6px;
    }

    .pill{
      background:var(--soft);
      border:1px solid var(--border);
      border-radius:999px;
      padding:8px 12px;
      font-size:13px;
      font-weight:800;
    }

    .content{padding:16px}

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
      background:#f8fbff;
      cursor:pointer;
    }
    .sec-body{padding:12px 14px}

    .notdone{
      margin-top:14px;
      border:1px solid var(--border);
      background:#fff;
      border-radius:14px;
      padding:12px 14px;
    }

    .footer{
      margin-top:14px;
      padding-top:8px;
      border-top:1px dashed #e9edf5;
      display:flex;
      justify-content:space-between;
      align-items:center;
      flex-wrap:wrap;
      gap:10px;
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
  </style>`;

  function renderService(key) {
    const svc = window.SERVICES[key];
    if (!svc) {
      app.innerHTML = style + "<div class='wrap'><div class='card'><div class='content'>خدمت پیدا نشد</div></div></div>";
      return;
    }

    const iconHtml = svc.icon
      ? `<div class="svc-badge"><img class="svc-icon" src="${esc(svc.icon)}"></div>`
      : "";

    app.innerHTML = `
      ${style}
      <div class="wrap">
        <div class="card">

          <div class="brandbar">
            <div class="brand-right">
              ${iconHtml}
              <div class="svc-title">${esc(svc.barTitle || svc.title)}</div>
            </div>
            <a class="back-btn" href="index.html">بازگشت</a>
          </div>

          <div class="header">
            <div class="meta">
              ${svc.meta?.time ? `<div class="pill">زمان معمول: ${esc(svc.meta.time)}</div>` : ""}
            </div>
          </div>

          <div class="content">
            ${(svc.sections||[]).map(s=>`
              <details class="sec" open>
                <summary>${esc(s.heading)}</summary>
                <div class="sec-body">${liList(s.items)}</div>
              </details>
            `).join("")}

            ${svc.notDone ? `
              <div class="notdone">
                <strong>نکات مهم</strong>
                ${olList(svc.notDone)}
              </div>` : ""}

            <div class="footer">
              <a class="btn" href="index.html">بازگشت</a>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  if (!window.SERVICE_KEY) {
    app.innerHTML = style + "<div class='wrap'><div class='card'><div class='content'>شناسه خدمت مشخص نیست</div></div></div>";
    return;
  }

  renderService(window.SERVICE_KEY);
})();
