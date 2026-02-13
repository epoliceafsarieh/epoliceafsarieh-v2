// render.js
(function () {
    // جلوگیری از scroll restore مرورگر بعد از رفرش/بازگشت
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

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
    --brand-blue:#041E42;   /* رنگ برند شما */
    --bg:#f5f7fb;          /* پس‌زمینه اصلی */
    --card:#fff;           /* پس‌زمینه کارت‌ها */
    --text:#0f172a;        /* متن اصلی */
    --muted:#475569;       /* متن ثانویه */
    --border:#e6e8ee;      /* مرزها */
    --soft:#f1f5ff;        /* پس‌زمینه نرم */
    --shadow:0 10px 30px rgba(2,8,23,.06); /* سایه کارت‌ها */
    --radius:16px;         /* شعاع مرزها */
    --section-bg:#f8fbff;  /* پس‌زمینه سکشن‌ها */
    --section-soft: #EEF2F6;

    
}


  *{box-sizing:border-box}
  body{
  margin:0;
  font-family:"Vazirmatn", Tahoma, Arial, sans-serif;
  background:var(--bg);
  color:var(--text);
  line-height:1.95;
  direction:rtl;          /* کلیدی */
}


 .wrap{max-width:860px;margin:8px auto 70px;padding:0 14px}

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
    gap:8px;
    min-width:0;
    padding-right:90px;
    margin-right:-16px;
  }

  .svc-badge{
    width:60px;height:60px;border-radius:12px;
    display:flex;align-items:center;justify-content:center;
    border:2px solid var(--brand-blue);
    background:transparent;
    position:absolute;right:12px;top:50%;
    transform:translateY(-50%);
    z-index:2;
  }
  .svc-icon{width:52px;height:52px;object-fit:contain;display:block}

  .svc-title{
    font-weight:900;
    font-size:17px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width:60vw;
    letter-spacing:-.2px;
  }

.back-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-decoration:none;
  background:transparent;
  border:0;
  border-radius:0;
  font-size:0;            /* متن "بازگشت" دیده نشود */
  cursor:pointer;
  color:#fff;
  z-index:3;

  /* اندازه کلیک */
  width:28px;
  height:28px;

  /* فاصله از لبه */
  margin-left:4px;
  padding:0;
}

.back-btn::before{
  content:"";
  width:8px;              /* فلش کوچک */
  height:8px;
  border-left:2.4px solid rgba(255,255,255,.95);
  border-bottom:2.4px solid rgba(255,255,255,.95);
  transform:rotate(45deg);
}
.header{
  padding:10px 16px 10px;   /* کمتر */
  background:#fff;
  border-bottom:none;
}

.meta{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  justify-content:center;
  align-items:center;

  padding-top:18px;         /* ✅ این «پایین‌آوردن» واقعی است */
  padding-bottom:6px;
  margin:0;
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
     direction: rtl; /* اضافه کردن این خط برای درست شدن rtl */
  }
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{border:1px solid var(--border);padding:10px;text-align:center}
  th{background:#f2f5f9;font-weight:900}

  /* ===== HERO (Task-first) ===== */
  .hero{
    padding:6px 16px 0px;
    background:#fff;
    border-bottom:none;
  }
  .hero-title {
  font-weight: 900;
  font-size: 22px;  /* تغییر به 22px */
  color: #0f172a;  /* رنگ سرمه‌ای */
  margin: 0 0 6px;
}

.hero-sub {
  font-size: 14px;  /* تغییر به 14px */
  color: #334155;  /* رنگ خاکستری تیره */
  font-weight: 500;
  margin: 0 0 10px;
}

  .hero-actions{
    display:grid;
    grid-template-columns:1fr;
    gap:10px;
    margin-top:5px;
  }
  .hero-actions.sticky-cta{
    position:sticky;
    top:60px;
    z-index:900;
    background:#fff;
    padding-top:0px;
    padding-bottom:0px;
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

 .content{padding:0px 16px 14px}


  .sec{
    margin-top:12px;
    border:1px solid var(--border);
    border-radius:12px;
    background:#fff;
    overflow:hidden;
  }
/* ===== Watermark behind first section (Steps) ===== */
.steps-card{
  position: relative;
  overflow: hidden;
}

.steps-card .sec-body{
  position: relative;
  overflow: hidden;
}

/* واترمارک واقعی تمام‌سطح (قابل‌دیدن و هم‌اندازه‌ی کارت) */
.steps-card .sec-body::before{
  content:"";
  position:absolute;
  inset:0;
  z-index:0;
  pointer-events:none;

  /* رنگ واترمارک (خیلی ملایم) */
  background-color: rgba(4,30,66,.04);

  /* ✅ لوگو به عنوان ماسک، اندازه = اندازه‌ی کارت */
  -webkit-mask-image: url("assets/img/logo/logo_white.png");
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: auto 90%;

  mask-image: url("assets/img/logo/logo_white.png");
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: auto 90%;

  /* اختیاری ولی خوب برای نرم شدن لبه‌ها */
  filter: blur(.3px);
}


/* محتوای گام‌ها روی واترمارک */
.steps-card .wmContent{
  position: relative;
  z-index: 1;
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
  
/* فقط تیتر گام‌های انجام کار (فقط روی steps-card) */
.steps-card summary{
  justify-content:center;
  text-align:center;
}
.steps-card summary span{
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
.steps-card ul.sublist{
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
  /* آکاردئون‌های FAQ */
.faq summary {
  background: var(--section-bg); /* پس‌زمینه سبک */
  padding: 12px 14px;
  font-weight: 900;
  color: #0f172a;
    cursor:pointer;
  }
  .faq .ans{
  padding:10px 14px;
  color:#334155;font-size:13px;font-weight:normal}

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

 /* ===== Docs wrapper (مدارک و شرایط) مطابق تصویر ===== */
details.sec#docs{
  border:0;
  background:#EEF2F6;     /* ✅ رنگ زمینه مادر */
  border-radius:16px;     /* ✅ radius مادر */
  padding:16px;           /* ✅ padding مادر */
  margin-top:16px;        /* ✅ فاصله از بالا */
  overflow:visible;
}

/* تیتر مادر: روی زمینه خاکستری باشد، نه یک دکمه/کارت جدا */
details.sec#docs > summary{
  display:flex;
  align-items:center;
  justify-content:center;
  background:transparent; /* ✅ شفاف تا زمینه خاکستری دیده شود */
  border:0;               /* ✅ بدون خط دور */
  border-radius:0;
  padding:0 0 12px;       /* ✅ فاصله زیر تیتر */
  color:#0f172a;
  font-size:16px;
  font-weight:900;
}

/* فلش پیش‌فرض را کامل حذف کن */
details.sec#docs > summary::after{ content:none !important; }
details.sec#docs > summary::-webkit-details-marker{ display:none; }

/* بدنه‌ی مادر: شفاف تا خاکستریِ مادر دیده شود */
details.sec#docs > .sec-body{
  border:0;
  background:transparent;
  padding:0;
}

/* ===== کارت‌های داخلی (آکاردئون‌های فرزند) مطابق تصویر ===== */
details.sec#docs .doc-sec{
  margin-top:12px;
  background:#ffffff;              /* ✅ سفید */
  border:1px solid #e6e8ee;        /* ✅ خط دور */
  border-radius:16px;              /* ✅ radius کارت داخلی */
  overflow:hidden;
}

/* summary هر کارت داخلی */
details.sec#docs .doc-sec > summary{
  background:#ffffff;              /* ✅ سفید */
  padding:16px;
  font-size:15px;
  font-weight:900;
  color:#0f172a;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

/* بدنه کارت داخلی */
details.sec#docs .doc-sec > .sec-body{
  padding:16px;
  border-top:1px solid #e6e8ee;    /* ✅ جداکننده داخل کارت */
  background:#ffffff;
}


  

@media (max-width: 480px){
  .wrap{ margin:8px auto 60px; padding:0 10px; }
.header{ padding:10px 12px 10px; }
.meta{ padding-top:18px; padding-bottom:6px; }


  .hero{ padding:6px 12px 4px; }
  .content{ padding:6px 12px 12px; }

  .content > .steps-card{ margin-top:4px; }
  .sec{ margin-top:8px; }
  .sec summary{ padding:10px 12px; }
  .sec-body{ padding:10px 12px; }

  .footer{ margin-top:10px; padding-top:6px; }
  .hero-actions{ gap:8px; margin-top:8px; }
}

/* نسخه دسکتاپ/عمومی */
.sec{ margin-top:8px; }
.sec summary{ padding:10px 12px; }
.sec-body{ padding:10px 12px; }

/* CTA کوچک کنار زمان/هزینه */
.meta-cta{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:8px 12px;
  border-radius:999px;
  background:var(--brand-blue);
  color:#fff !important;
  text-decoration:none !important;
  font-weight:900;
  font-size:13px;
  border:1px solid var(--brand-blue);
}

.header .meta a{ text-decoration:none; }


/* ===== زمان و هزینه: RTL قطعی در همه مرورگرها ===== */
.header .meta details.pill{
  direction: rtl;                 /* کل کنترل RTL */
}

.header .meta details.pill > summary{
  position:relative;
  display:block;                  /* flex ممنوع */
  direction:rtl;                  /* قفل RTL روی خود summary */
  unicode-bidi:plaintext;         /* جلوگیری از قاطی شدن bidi */
  text-align:center;
  padding:8px 14px 8px 36px;      /* جای فلش در چپ */
  line-height:1.2;
}

/* فلش همیشه سمت چپِ pill */
.header .meta details.pill > summary::after{
  content:"";
  position:absolute;
  left:14px;
  top:50%;
  width:8px;
  height:8px;
  border-right:3px solid #334155;
  border-bottom:3px solid #334155;
  transform:translateY(-55%) rotate(45deg);
  transition:transform .2s ease;
}

.header .meta details.pill[open] > summary::after{
  transform:translateY(-45%) rotate(-135deg);
}





</style>`;

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
    if (!svc) {
      app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="card-clip"><div class="content">این خدمت پیدا نشد.</div></div></div></div>`;
      return;
    }

const metaParts = [];

const feeKey = svc?.meta?.feeKey;
const feeObj =
  (typeof window.FEES !== "undefined" && feeKey && window.FEES[feeKey])
    ? window.FEES[feeKey]
    : null;

const hasTime = !!svc?.meta?.time;
const hasFeeTable = !!(feeObj && Array.isArray(svc.feeRows) && svc.feeRows.length);

if (hasTime || hasFeeTable) {
  const feeRows = hasFeeTable
    ? svc.feeRows.map(r => ({ title: r.label, value: feeObj[r.field] }))
    : [];

  const feeRowsHtml = feeRows.map(r =>
    `<tr><td>هزینه</td><td>${esc(r.title)}: ${esc(safeText(r.value))}</td></tr>`
  ).join("");

  metaParts.push(`
    <details class="pill">
      <summary>زمان و هزینه</summary>
      <div class="fee-box">
        <table>
          <tr><th>بخش</th><th>مقدار/توضیح</th></tr>
          ${hasTime ? `<tr><td>زمان</td><td>${esc(svc.meta.time)}</td></tr>` : ""}
          ${feeRowsHtml}
        </table>
      </div>
    </details>
  `);
}



    // === HERO: فقط اگر سرویس واقعاً داده داده باشد ===
    const hasHero =
      !!(svc.heroTitle || svc.heroSubtitle || svc.heroPrimary || svc.heroSecondary);

    const heroTitle = esc(svc.heroTitle || "");
    const heroSubtitle = esc(svc.heroSubtitle || "");
    const heroPrimary = svc.heroPrimary || null;
    const heroSecondary = svc.heroSecondary || null;
   const metaCtaHtml =
  (heroPrimary?.label && heroPrimary?.href)
    ? `<a class="meta-cta" href="${esc(heroPrimary.href)}">${esc(heroPrimary.label)}</a>`
    : "";





      
    // اگر سرویس heroSecondary را روی #docs گذاشته، روی سکشن اول id بدهیم
    const wantsDocsAnchor =
      (typeof heroSecondary?.href === "string") && heroSecondary.href.trim() === "#docs";

    // =========================
    // تغییر ۶ (فقط همین):
    // سکشن اول (گام‌ها) قبل از دکمه‌های Hero بیاید
    // =========================
    
    // --- SPLIT: Steps (index 0) separate, others under docs ---
const sections = Array.isArray(svc.sections) ? svc.sections : [];
const stepsSec = sections.length ? sections[0] : null;
const otherSecs = sections.length > 1 ? sections.slice(1) : [];

// ✅ گام‌ها: همیشه باز + واترمارک + بدون بولتِ لیست اصلی
let stepsHtml = "";
if (stepsSec) {
  const body = liList(stepsSec.items || [], { noBullets: true });

  const ctaHtml = (stepsSec.cta && stepsSec.cta.label && stepsSec.cta.href)
    ? `<div class="cta"><a href="${esc(stepsSec.cta.href)}">${esc(stepsSec.cta.label)}</a></div>`
    : "";

  stepsHtml = `
    <details class="sec card steps-card" open>
      <summary>
       
       <span class="sec-title">${esc(stepsSec.heading || stepsSec.title || "گام‌های انجام کار")}</span>

        <span class="chev" aria-hidden="true"></span>
      </summary>
      <div class="sec-body">
        <div class="wmContent">${body}${ctaHtml}</div>
      </div>
    </details>
  `;
}

// ✅ بقیه بخش‌ها: زیر “آنچه باید بدانید” (بسته، ولی عنوان معلوم)
const restSectionsHtml = otherSecs.map((sec, i) => {
  const body = liList(sec.items || []);
  const ctaHtml = (sec.cta && sec.cta.label && sec.cta.href)
    ? `<div class="cta"><a href="${esc(sec.cta.href)}">${esc(sec.cta.label)}</a></div>`
    : "";

  return `
    <details class="sec doc-sec">
      <summary>
       
       <span class="sec-title">${esc(sec.heading || sec.title || "")}</span>

        <span class="chev" aria-hidden="true"></span>
      </summary>
      <div class="sec-body">${body}${ctaHtml}</div>
    </details>
  `;
}).join("");


 
     const heroHtml = hasHero ? `
  <div class="hero">

   ${
  (svc.heroTitle && (svc.heroTitle !== (svc.barTitle || svc.shortTitle || "")))
    ? `<h2 class="hero-title">${esc(svc.heroTitle)}</h2>`
    : ""
}


    ${heroSubtitle ? `<p class="hero-sub">${heroSubtitle}</p>` : ""}

    <div class="hero-actions sticky-cta">
    
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
    <details class="sec doc-sec">
      <summary><span class="sec-title">نکات مهم</span><span class="chev" aria-hidden="true"></span></summary>
      <div class="sec-body">${olList(noticeList)}</div>
    </details>
  `
  : "";


 const faqHtml = (svc.faqEnabled === true && svc.faq && svc.faq.length)
  ? `
    <details class="sec doc-sec">
      <summary><span class="sec-title">سؤالات پرتکرار</span><span class="chev" aria-hidden="true"></span></summary>
      <div class="sec-body">
        ${svc.faq.map(f => `
          <div style="font-weight:900;margin:10px 0 6px">${esc(f.q || "")}</div>
          <div style="color:#334155;font-size:13px;line-height:1.9">${esc(f.a || "")}</div>
        `).join("")}
      </div>
    </details>
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
            <a class="back-btn" id="backBtn" href="#">بازگشت</a>
          </div>

          <div class="card-clip">
            <div class="header">
              <div class="meta">
  ${metaParts.join("")}
  ${metaCtaHtml}
</div>

            </div>

            ${heroHtml}

            <div class="content">

${stepsHtml}



            
            <details class="sec" id="docs" open>

                <summary>
                  <span> آنچه باید بدانید </span>
                  <small></small>
                </summary>
               <div class="sec-body">
  ${restSectionsHtml}
  ${notDoneHtml}
  ${faqHtml}
</div>

              </details>

           
              <div class="footer">
                <span class="hint">این راهنما به مرور کامل‌تر می‌شود</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      ${bottomCtaHtml}
    `;

    // ✅ هندلر بازگشت بعد از رندر
    const backBtn = app.querySelector("#backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const params = new URLSearchParams(location.search);
        const from = params.get("from");

        if (from === "all") {
          location.href = "all.html";
          return;
        }

        const origin = sessionStorage.getItem("serviceFrom");
        if (origin) {
          location.href = origin;
          return;
        }

        location.href = "index.html";
      });

      backBtn.setAttribute("aria-label", "بازگشت");
    }

       // کار ۵: فقط اگر دکمه‌ی Hero به #docs لینک شده باشد
    if (wantsDocsAnchor) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });

      const btnDocs = app.querySelector('.btn-secondary[href="#docs"]');
      const docsWrapBtn = app.querySelector('details.sec#docs');

      if (btnDocs && docsWrapBtn) {
        btnDocs.addEventListener("click", function (e) {
          e.preventDefault();
          docsWrapBtn.open = true;
          docsWrapBtn.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }

    // ✅ آکاردئون مادر: همیشه باز + تغییر متن
    const docsWrap = app.querySelector('details.sec#docs');
    if (docsWrap) {
      docsWrap.open = true;
      docsWrap.addEventListener("toggle", () => {
        if (!docsWrap.open) docsWrap.open = true;
      });

      const span = docsWrap.querySelector("summary span");
      if (span) span.textContent = "مدارک و شرایط";
    }

  } // پایان renderService

  const key = window.SERVICE_KEY;
  if (!key) {
    app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="card-clip"><div class="content">شناسه خدمت مشخص نیست.</div></div></div></div>`;
    return;
  }

  renderService(key);
})();
