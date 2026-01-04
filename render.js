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
  // ✅ تغییر ۱: امکان حذف بولت‌ها به‌صورت موضعی (فقط برای گام‌ها)
  function liList(items, opts) {
    if (!items || !items.length) return "";

    const clean = items.map(x => String(x ?? "").trim()).filter(Boolean);
    const isHead = (s) => /[:：]$/.test(s);
    const hasAnyHead = clean.some(isHead);

    const ulCls = (opts && opts.noBullets) ? ` class="no-bullets"` : "";

    // ✅ FIX 1: اگر تیتر نداریم، فقط در صورت درخواست noBullets اعمال شود (نه همیشه)
    if (!hasAnyHead) return `<ul${ulCls}>${clean.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;

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

        // ✅ FIX 2: sublist نباید no-bullets بگیرد تا بولت‌ها برای زیرلیست بماند
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

  .wrap{max-width:860px;margin:18px auto 90px;padding:0 14px}
  .card{
    background:var(--card);
    border:1px solid var(--border);
    border-radius:var(--radius);
    overflow:visible;
    box-shadow:var(--shadow);
  }
  .card-clip{
    overflow:visible;
    border-radius:0 0 var(--radius) var(--radius);
  }

  .brandbar{
    position:sticky;
    top:0;
    z-index:1000;
    background:var(--brand-blue) !important;
    color:#fff;
    padding:6px 12px;
    height:60px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    overflow:hidden;
    border-radius:var(--radius) var(--radius) 0 0;
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
    width:72px;height:72px;border-radius:14px;
    display:flex;align-items:center;justify-content:center;
    border:2px solid var(--brand-blue);
    background:transparent;
    position:absolute;right:12px;top:50%;
    transform:translateY(-50%);
    z-index:2;
  }
  .svc-icon{width:66px;height:66px;object-fit:contain;display:block}

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

  /* ===== Fee dropdown: card-like (نه پنجره عجیب) ===== */
  .meta details.pill{
    flex: 1 1 100%;
    width: 100%;
    max-width: 100%;
    white-space: normal; /* summary هم اگر لازم شد بشکند */
  }

  .meta details.pill > summary{
    width: 100%;
  }

  .fee-box{
    margin-top:10px;
    padding:12px;
    background:#fff;
    border:1px solid var(--border);
    border-radius:14px;
    box-shadow: 0 10px 24px rgba(2,8,23,.08);
  }

  /* جدول: کارت‌مانند و خوانا */
  .fee-box table{
    width:100%;
    border-collapse:separate;
    border-spacing:0;
    font-size:13px;
    overflow:hidden;
    border:1px solid var(--border);
    border-radius:12px;
  }

  .fee-box th,
  .fee-box td{
    border:0;
    padding:10px 12px;
    text-align:right;
    vertical-align:top;
  }

  .fee-box th{
    background:#f2f5f9;
    font-weight:900;
    color:#0f172a;
  }

  .fee-box tr + tr td{
    border-top:1px solid var(--border);
  }

  /* ستون‌ها کمی متعادل‌تر شوند */
  .fee-box td:first-child{
    width:44%;
    font-weight:800;
    color:#0f172a;
  }

  .fee-box td:last-child{
    width:56%;
    color:#334155;
  }

  /* ===== HERO (Task-first) ===== */
  .hero{
    padding:14px 16px 14px;
    background:#fff;
    border-bottom:1px solid var(--border);
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
    font-weight:500;
  }
  .hero-actions{
    display:grid;
    grid-template-columns:1fr;
    gap:10px;
    margin-top:10px;
  }
  .hero-actions.sticky-cta{
    position:sticky;
    top:60px;
    z-index:900;
    background:#fff;
    padding-top:10px;
    padding-bottom:10px;
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
    border:1px solid var(--brand-blue);
  }
  .btn-secondary{
    display:block;
    text-align:center;
    background:#fff;
    color:var(--brand-blue);
    text-decoration:none;
    border-radius:14px;
    padding:12px 14px;
    font-weight:900;
    border:1px solid rgba(4,30,66,.35);
  }

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
  /* فقط تیتر گام‌های انجام کار */
.sec:first-of-type summary{
  justify-content:center;
  text-align:center;
}

.sec:first-of-type summary span{
  font-size:17px;
  font-weight:900;
}

  .sec summary small{
   display:none;
  }
  .sec-body{padding:12px 14px}

  ul,ol{margin:0;padding-right:20px;font-size:14px}
  li{margin:8px 0;font-weight:normal}

  
  /* گام‌های انجام کار: فقط بولتِ لیست اصلی حذف شود (زیرلیست‌ها بولت داشته باشند) */
ul.no-bullets{
  list-style:none;
  padding-right:0;
}

ul.no-bullets > li{
  list-style:none;
}

/* زیرلیست‌ها (مثل افراد زیر ۱۸ سال / بانوان متأهل) بولت داشته باشند */
ul.no-bullets ul,
ul.sublist{
margin:4px 0;
   margin-right:28px;
  list-style:disc;
  padding-right:22px;
}


  .subhead{margin:10px 0 6px;font-weight:900;color:#0f172a}
  ul.sublist{margin:0;padding-right:22px}
  /* فقط زیرلیستِ داخل «گام‌های انجام کار» کمی جلوتر برود */
.sec:first-of-type ul.sublist{
  padding-right:34px; /* از 22 بیشتر شد => جلوتر می‌آید */
}


  .cta{margin-top:10px}
  .cta a{
    display:inline-block;
    background:rgba(4,30,66,.12);
    border:1px solid rgba(4,30,66,.35);
    padding:10px 14px;
    border-radius:12px;
    font-weight:900;
    color:#041E42;
    text-decoration:none;
  }

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
  .faq .ans{padding:10px 14px;color:#334155;font-size:13px;font-weight:normal}

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
    text-decoration:none;
    padding:10px 14px;
    border-radius:12px;
    font-weight:900;
  }
  .hint{font-size:12px;color:#777}

  /* ===== Bottom CTA ثابت (فقط وقتی سرویس بخواهد) ===== */
  .bottom-cta{
    position:fixed;
    right:0;left:0;bottom:0;
    background:rgba(245,247,251,.92);
    backdrop-filter:saturate(140%) blur(6px);
    border-top:1px solid var(--border);
    padding:10px 14px calc(10px + env(safe-area-inset-bottom));
    z-index:2000;
  }
  .bottom-cta .inner{
    max-width:860px;
    margin:0 auto;
  }

  /* فقط برای آکاردئون مادر مدارک (#docs) */
  details.sec#docs{
    border:0;
    background:transparent;
  }

  details.sec#docs > summary{
    justify-content:center;
    text-align:center;
    background:#fff;
    border:1px solid rgba(4,30,66,.35);
    border-radius:14px;
    padding:12px 14px;
    color:var(--brand-blue);
  }

  details.sec#docs[open] > summary{
    border-radius:14px 14px 0 0;
  }

  details.sec#docs > .sec-body{
    border:1px solid var(--border);
    border-top:0;
    border-radius:0 0 14px 14px;
    background:#fff;
  }

  @media (max-width: 480px){
  .wrap{ margin:10px auto 60px; padding:0 10px; }
  .header{ padding:10px 12px 8px; }

  .hero{ padding:10px 12px 10px; }
  .content{ padding:12px 12px 14px; }

  .sec{ margin-top:8px; }
  .sec summary{ padding:10px 12px; }
  .sec-body{ padding:10px 12px; }

  .footer{ margin-top:10px; padding-top:6px; }

  .hero-actions{ gap:8px; margin-top:8px; }

  /* ===== Mobile: جدول به هم نریزد ===== */
  .meta details.pill{
    flex-basis: 100%;
  }

  .fee-box{
    padding:10px;
  }

  .fee-box table{
    font-size:12.5px;
  }

  .fee-box th,
  .fee-box td{
    padding:9px 10px;
  }

  /* اگر متن طولانی شد، طبیعی بشکند */
  .fee-box td{
    white-space:normal;
    overflow-wrap:anywhere;
    word-break:break-word;
  }
}

</style>`;

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
    if (!svc) {
      app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="card-clip"><div class="content">این خدمت پیدا نشد.</div></div></div></div>`;
      return;
    }

    const metaParts = [];
    if (svc?.meta?.time) metaParts.push(`<div class="pill">زمان معمول: ${esc(svc.meta.time)}</div>`);

    let feeHtml = "";
    const feeKey = svc?.meta?.feeKey;
    const feeObj =
      (typeof window.FEES !== "undefined" && feeKey && window.FEES[feeKey])
        ? window.FEES[feeKey]
        : null;

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

    // === HERO: فقط اگر سرویس واقعاً داده داده باشد ===
    const hasHero =
      !!(svc.heroTitle || svc.heroSubtitle || svc.heroPrimary || svc.heroSecondary);

    const heroTitle = esc(svc.heroTitle || "");
    const heroSubtitle = esc(svc.heroSubtitle || "");
    const heroPrimary = svc.heroPrimary || null;
    const heroSecondary = svc.heroSecondary || null;

    // اگر سرویس heroSecondary را روی #docs گذاشته، روی سکشن اول id بدهیم
    const wantsDocsAnchor =
      (typeof heroSecondary?.href === "string") && heroSecondary.href.trim() === "#docs";

    // =========================
    // تغییر ۶ (فقط همین):
    // سکشن اول (گام‌ها) قبل از دکمه‌های Hero بیاید
    // =========================
    let firstSectionHtml = "";
    const restSectionsHtml = (svc.sections || []).map((sec, idx) => {
      // ✅ تغییر ۱: فقط برای سکشن اول (گام‌ها) بولت‌ها حذف شود
      const body = (idx === 0)
        ? liList(sec.items || [], { noBullets: true })
        : liList(sec.items || []);

      const ctaHtml = (sec.cta && sec.cta.label && sec.cta.href)
        ? `<div class="cta"><a href="${esc(sec.cta.href)}">${esc(sec.cta.label)}</a></div>`
        : "";
      const openAttr = (sec && sec.open) ? " open" : "";

      const html = `
        <details class="sec"${openAttr}>
          <summary>
            <span>${esc(sec.heading || "")}</span>
            <small>${esc(sec.tag || "")}</small>
          </summary>
          <div class="sec-body">${body}${ctaHtml}</div>
        </details>
      `;

      if (idx === 0) {
        firstSectionHtml = html;
        return ""; // سکشن اول از لیست پایین حذف می‌شود
      }
      return html;
    }).join("");

    const heroHtml = hasHero ? `
      <div class="hero">
    
        ${heroSubtitle ? `<p class="hero-sub">${heroSubtitle}</p>` : ""}

        ${firstSectionHtml}

        <div class="hero-actions sticky-cta">
          ${heroPrimary?.label && heroPrimary?.href
            ? `<a class="btn-primary" href="${esc(heroPrimary.href)}">${esc(heroPrimary.label)}</a>`
            : ""
          }
          ${heroSecondary?.label && heroSecondary?.href
            ? `<a class="btn-secondary" href="${esc(heroSecondary.href)}">${esc(heroSecondary.label)}</a>`
            : ""
          }
        </div>
      </div>
    ` : "";

    const noticeList =
      (svc.notDone && svc.notDone.length) ? svc.notDone
      : (svc.notice && svc.notice.length) ? svc.notice
      : null;

    const notDoneHtml = (noticeList && noticeList.length)
      ? `
        <details class="sec">
          <summary><span>نکات مهم</span><small></small></summary>
          <div class="sec-body">${olList(noticeList)}</div>
        </details>
      `
      : "";

   const faqHtml = (svc.faqEnabled === true && svc.faq && svc.faq.length)
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

    // Bottom CTA: فقط اگر سرویس explicitly داده باشد
    const hasBottomCta = !!(svc.bottomCta && svc.bottomCta.label && svc.bottomCta.href);
    const bottomCta = hasBottomCta ? svc.bottomCta : null;

    const bottomCtaHtml = bottomCta ? `
      <div class="bottom-cta">
        <div class="inner">
          <a class="btn-primary" href="${esc(bottomCta.href)}">${esc(bottomCta.label)}</a>
        </div>
      </div>
    ` : "";

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

          <div class="card-clip">
            <div class="header">
              <div class="meta">
                ${metaParts.join("")}
                ${feeHtml}
              </div>
            </div>

            ${heroHtml}

            <div class="content">
              <details class="sec" id="docs">
                <summary>
                  <span>مدارک لازم (چک لیست)</span>
                  <small></small>
                </summary>
                <div class="sec-body">
                  ${restSectionsHtml}
                </div>
              </details>

              ${notDoneHtml}
              ${faqHtml}

              <div class="footer">
                <span class="hint">این راهنما به مرور کامل‌تر می‌شود</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      ${bottomCtaHtml}
    `;

    // کار ۵: کلیک روی «مدارک لازم را ببین» => آکاردئون مادر باز شود و به آن اسکرول کند
    if (wantsDocsAnchor) {
      const btnDocs = app.querySelector('.btn-secondary[href="#docs"]');
      const docsWrap = app.querySelector('details.sec#docs');
      if (btnDocs && docsWrap) {
        btnDocs.addEventListener("click", function (e) {
          e.preventDefault();
          docsWrap.setAttribute("open", "");
          docsWrap.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }

  const key = window.SERVICE_KEY;
  if (!key) {
    app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="card-clip"><div class="content">شناسه خدمت مشخص نیست.</div></div></div></div>`;
    return;
  }

  renderService(key);
})();
