// render.js
(function () {
    // جلوگیری از scroll restore مرورگر بعد از رفرش/بازگشت
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

 function escText(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escAttr(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
   // Backward-compatible: هرجا esc(...) مانده، همان escText حساب شود
function esc(s){ return escText(s); }
 

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
/* ===== Blue ramp (from your sample) ===== */
--ramp-1:#161E31; /* darkest */
--ramp-2:#2C3A5E; /* between */
--ramp-3:#394974; /* mid */
--ramp-4:#4E6498; /* light */
--ramp-ink:#424757; /* support tone (borders/shadows) */

/* mapping for existing code (no widespread refactor) */
--blue-2: var(--ramp-2);
--blue-3: var(--ramp-3);
--blue-4: var(--ramp-4);



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
}
:root{
  --padX:12px;
  --padY:10px;
  --secGap:8px;
}
.content{ padding:0 var(--padX) 14px; }
.card-gap{ height:12px; }

.sec{
  margin-top:var(--secGap);
  border:1px solid var(--border);
  border-radius:var(--radius);
  background:#fff;
  overflow:hidden;
}

.sec summary{ padding:var(--padY) var(--padX); }
.sec-body{ padding:var(--padY) var(--padX); }


@media (max-width:480px){
  :root{ --padX:12px; --padY:10px; --secGap:8px; }
}



  *{box-sizing:border-box}
  html{
  background: var(--bg) !important;
  background-image:none !important;
}

  body{
  margin:0;
  font-family:"Vazirmatn", Tahoma, Arial, sans-serif;
  background:var(--bg);
  color:var(--text);
  line-height:1.95;
  direction:rtl;          /* کلیدی */
    background: var(--bg) !important;
  background-image: none !important;

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
 
background: linear-gradient(270deg,
  var(--ramp-1) 0%,
  var(--ramp-1) 62%,
  var(--ramp-2) 82%,
  var(--ramp-3) 100%
) !important;


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
    padding-right:72px;
    margin-right:-16px;
  }

 .svc-badge{
  width:60px;height:60px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;

  border:0;                 /* ✅ کادر حذف */
  background:transparent;   /* ✅ پس‌زمینه حذف */
  box-shadow:none;          /* ✅ سایه حذف */

  position:absolute;right:12px;top:50%;
  transform:translateY(-50%);
  z-index:2;
}

  .svc-icon{
  width:52px;height:52px;
  object-fit:contain;
  display:block;
  border:0;
  outline:0;
  background:transparent;
}
/* فقط صفحه گذرنامه: آیکن بالا کمی کوچک‌تر */
.is-passport .svc-icon{
  width:44px;
  height:44px;
}



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
/* ===== Breadcrumb ===== */
.breadcrumb{
  margin:6px 0 2px;
  color:#041e42;
  text-align:right;
  flex:1 1 auto;
  min-width:0;

  /* ✅ اینجا ellipsis کل خط را خاموش کن */
  display:flex;
  align-items:center;
  gap:2px;
  white-space:nowrap;
 overflow:hidden;

  text-overflow:clip;

  font-size:13px;
  letter-spacing:-.1px;
}


.breadcrumb a{
  color:#041e42;
  text-decoration:none;
}

.breadcrumb a:hover{
  text-decoration:underline;
}

.breadcrumb span{
  color:#475569;
  font-weight:600;
}





.bc-sep{ color:#94a3b8; margin:0 2px; }
.header-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}

.header-cta{
  display:flex;
  justify-content:flex-end;
  flex:0 0 auto;
 margin-left:12px;
  margin-right:0;
}

/* CTA زیر نوار (دانلود فرم) */
.header-cta .meta-cta{
  font-size:12px;
  padding:7px 10px;
  border-radius:999px;
}
.bc-dots{
  color:#94a3b8;
  margin-left:4px;
  text-decoration:none;
  cursor:pointer;
}
.bc-dots:hover{ text-decoration:underline; }
.bc-current{
  font-weight:700;
  color:#475569;
}
#bcCurrent{
  display:inline-block;
  flex:0 0 auto;        /* ✅ قفل: آخرین آیتم همیشه دیده شود */
  white-space:nowrap;
  overflow:visible;     /* ✅ دیگر نباید "صفحه" نصفه شود */
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
  border:0;              /* خط دور حذف */
  border-radius:12px;
  padding:0;             /* چون داخلش table داریم، padding لازم نیست یا کمش کن */
  background:transparent;
  direction:rtl;
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
  font-size: 20px;  /* تغییر به 22px */
  color: #0f172a;  /* رنگ سرمه‌ای */
  margin: 0 0 6px;
}

.hero-sub {
  font-size: 14px;  /* تغییر به 14px */
  color: var(--muted);
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


  /* ===== Emphasis for main blocks (Steps + Docs) ===== */
.steps-card{
  box-shadow: 0 16px 36px rgba(2,8,23,.10) !important;
}
details.sec#docs{
  box-shadow: 0 16px 36px rgba(2,8,23,.10) !important;
}

.steps-card summary,
details.sec#docs > summary{
  box-shadow: none !important;
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
  background-color: rgba(4,30,66,.05);

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
    padding:var(--padY) var(--padX);
    font-size:15px;
    font-weight:900;
    color:#0f172a;
    display:flex;
    gap:10px;
    background:var(--section-bg);
  }
 /* پیش‌فرض: summary های سکشن‌ها space-between */
.sec > summary{ justify-content:space-between; }

/* steps + docs: وسط‌چین */
.steps-card > summary,
details.sec#docs > summary{
  justify-content:center !important;
}


  
/* === unify: steps + docs header (same height & font) === */
.steps-card > summary,
details.sec#docs > summary{
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;

  /* ✅ ارتفاع دقیق‌تر و یک‌دست مثل رفرنس */
  min-height:52px !important;
   padding:12px 12px !important;
  line-height:1.2 !important;

  font-size:17px !important;
  font-weight:900 !important;
  text-align:center !important;

  /* ✅ یک‌تکه شدن هدر */
  border-bottom:0 !important;
}

/* title spans */
.steps-card > summary .sec-title,
details.sec#docs > summary .docs-title{
  font-size:inherit !important;
  font-weight:inherit !important;
}

/* ✅ گام‌ها: اون span اضافه که تداخل ایجاد می‌کند */
.steps-card > summary .chev{
  display:none !important;
}


.steps-card summary{
 background: #EEF2F7 !important;

  color: var(--ramp-1) !important;  /* ✅ متن تیره */
   border-bottom:0 !important;

}
.steps-card summary span{
  color: var(--ramp-1) !important;
}


  .sec summary small{
   display:none;
  }
 

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
  background:var(--bg);
  border-top:1px solid var(--border);
  padding:10px 14px calc(10px + env(safe-area-inset-bottom));
  z-index:2000;
}

  .bottom-cta .inner{
    max-width:860px;
    margin:0 auto;
  }

/* =========================
   DOCS (match 18:40)
   - mother shell (light gray)
   - dark title
   - children inset (mother visible)
   ========================= */
details.sec#docs{
  /* ✅ مادر باید قاب داشته باشد */
  border:1px solid #E6EAF2;
  background:#EEF2F7;
  border-radius: var(--radius);
  padding:0;
  margin-top:12px;
  overflow:hidden;
}
/* ✅ FIX: یکپارچگی نوار عنوان "مدارک و شرایط" با بدنه‌ی مادر */
details.sec#docs > summary{
  background:#EEF2F7 !important;          /* هم‌رنگ بدنه‌ی مادر */
  border-bottom:0 !important;             /* خط جداکننده نداشته باشد */
  margin:0 !important;

  /* گردی بالای کارت دقیقاً روی summary هم بنشیند */
  border-radius: var(--radius) var(--radius) 0 0 !important;
}

/* ✅ FIX: بدنه از زیرِ نوار جدا دیده نشود */
details.sec#docs > .sec-body{
  padding-top: 8px !important;            /* اگر هنوز جدا بود: 4px کن */
}

/* ✅ (اختیاری ولی پیشنهاد من برای تمیزی): عنوان کمی فشرده‌تر مثل رفرنس */
details.sec#docs > summary{
  padding: 12px var(--padX) !important;   /* ارتفاع نوار کنترل‌شده */
}


details.sec#docs > .sec-body{
  background:transparent;

  /* ✅ اینجا “فریم خاکستری” ساخته می‌شود */
  padding:4px 12px 14px;
}





/* حذف فلش پیش‌فرض summary مادر */
details.sec#docs > summary::after{ content:none !important; }
details.sec#docs > summary::-webkit-details-marker{ display:none; }



details.sec#docs .doc-sec{
  margin:8px 0 0;
  background:#F3F6FA;   /* 👈 حالت بسته */
  border:1px solid #E1E6EF;
  border-radius:14px;
  overflow:hidden;
  box-shadow: 0 6px 14px rgba(22,30,49,.04);
  transition:background .25s ease, box-shadow .25s ease;
}
details.sec#docs .doc-sec[open]{
  background:#ffffff;   /* 👈 حالت باز */
  box-shadow: 0 10px 22px rgba(22,30,49,.08);
}



/* هدر کارت داخلی */
details.sec#docs .doc-sec > summary{
  position:relative;
 padding:9px 12px;     /* از 10 کمتر => باریک‌تر */
font-size:14px;       /* از 13 بیشتر => خواناتر */

  font-weight:900;

  color: var(--ramp-1);
  background:transparent;   /* از رنگ مادر تبعیت کند */

  display:flex;
  align-items:center;
  justify-content:flex-start;
  gap:10px;

  cursor:pointer;
  border:0;
  direction:rtl;
  text-align:right;
}




/* فقط دستگاه‌هایی که واقعاً hover دارند (دسکتاپ) */
@media (hover:hover) and (pointer:fine){
  details.sec#docs .doc-sec > summary:hover{
    background: rgba(78,100,152,.06);
  }
}

/* موبایل: فقط هنگام لمس، نه حالت چسبنده */
details.sec#docs .doc-sec > summary:active{
  background: rgba(78,100,152,.06);
}


/* open state */
details.sec#docs .doc-sec[open] > summary{
  box-shadow: inset 0 3px 0 var(--ramp-1);
}

/* بدنه کارت داخلی */
details.sec#docs .doc-sec > .sec-body{
  padding:12px;
  border-top:1px solid #E6EAF2;
  background:#fff;
}

/* RTL: عنوان راست، + چپ */
details.sec#docs .doc-sec > summary .sec-title{
  order:1;
  flex:1 1 auto;
  min-width:0;
  text-align:right;
}
details.sec#docs .doc-sec > summary .sec-toggle{
  order:2;
  margin-right:auto;            /* ✅ + سمت چپ */
  font-size:20px;
line-height:1;

  font-weight:900;
  color: var(--ramp-ink);
  width:22px;
  text-align:center;
  flex:0 0 22px;
}

 

@media (max-width: 480px){
  .wrap{ margin:8px auto 60px; padding:0 10px; }
.header{ padding:10px 12px 10px; }
.meta{ padding-top:18px; padding-bottom:6px; }
  .hero{ padding:6px 12px 4px; }
  .content > .steps-card{ margin-top:2px; }
    .footer{ margin-top:10px; padding-top:6px; }
  .hero-actions{ gap:8px; margin-top:8px; }
}


/* CTA کوچک کنار زمان/هزینه */
.meta-cta{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:8px 12px;
  border:1px solid var(--blue-2);
  background:var(--blue-2);
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

.brand-left{
  display:flex;
  align-items:center;
  gap:10px;
}
.fee-shortcut{
  font-size:12px;
  font-style:italic;
  color:rgba(255,255,255,.9);
  text-decoration:none;
  border:0px solid rgba(255,255,255,.25);
  padding:6px 10px;
  border-radius:999px;
  position:relative;
  padding-left:28px;
  padding-right:10px;
}
.fee-shortcut::before{
  content:"";
  position:absolute;
  left:10px;
  right:auto;
  top:50%;
  width:8px;
  height:8px;
  border-right:2.6px solid rgba(255,255,255,.95);
  border-bottom:2.6px solid rgba(255,255,255,.95);
  transform:translateY(-55%) rotate(45deg); /* فلش رو به پایین */
}

.top-cta{
  background:#fff;
  color:var(--brand-blue);
  text-decoration:none;
  font-weight:900;
  font-size:12px;
  padding:7px 10px;
  border-radius:999px;
}
/* ===== Scroll FAB (glossy / jelly like sample) ===== */
.scroll-fab{
  position:fixed;
  left:14px;
  right:auto;
  bottom:86px;
  z-index:2500;

  width:54px;
  height:54px;
  border-radius:999px;

  /* ✅ گرادیان ژله‌ای (خاکستری-آبیِ سیرتر) */
  background:
    radial-gradient(120% 120% at 30% 22%,
      rgba(255,255,255,.92) 0%,
      rgba(245,248,252,.80) 28%,
      rgba(214,226,238,.75) 55%,
      rgba(176,192,210,.88) 100%);

  /* ✅ رینگ دور و لبه‌ی نرم */
  border:1px solid rgba(140,160,180,.55);

  /* ✅ عمق و درخشش (مثل نمونه) */
  box-shadow:
    0 16px 34px rgba(2,8,23,.22),                  /* سایه بیرونی */
    inset 0 2px 0 rgba(255,255,255,.85),           /* هایلایت بالا */
    inset 0 -10px 18px rgba(90,110,130,.18),       /* عمق پایین */
    inset 0 0 0 6px rgba(255,255,255,.35);         /* رینگ داخلی */

  backdrop-filter:saturate(150%) blur(10px);

  display:none;
  align-items:center;
  justify-content:center;

  cursor:pointer;
  -webkit-tap-highlight-color:transparent;
  transition:transform .15s ease, box-shadow .15s ease, opacity .15s ease;
}

.scroll-fab:hover{
  transform:translateY(-2px);
  box-shadow:
    0 18px 38px rgba(2,8,23,.24),
    inset 0 2px 0 rgba(255,255,255,.88),
    inset 0 -10px 18px rgba(90,110,130,.18),
    inset 0 0 0 6px rgba(255,255,255,.38);
}
.scroll-fab:active{ transform:translateY(0); }



/* فلش داخل: رنگ از متغیر می‌آید */
.scroll-fab span{
  display:block;
  width:14px;
  height:14px;

  color: var(--fab-ink, rgba(35,55,80,.75));   /* ✅ فقط رنگ آیکون */
  border-right:3px solid currentColor;
  border-bottom:3px solid currentColor;

  transform:rotate(45deg);
  margin-top:-2px;
  font-size:0;
  line-height:0;
  opacity: var(--fab-op, 1);
transition: opacity .15s ease;

}



/* وقتی نزدیک انتهای صفحه‌ایم => جهت بالا */
.scroll-fab.to-top span{
  transform:rotate(-135deg);
  margin-top:2px;
}

/* FAB bounce کوتاه و شیک (فقط وقتی کلاس is-bounce فعال شد) */
.scroll-fab.is-bounce{
  animation: fabBounce 2.4s ease-in-out infinite;
}
@keyframes fabBounce{
  0%,100% { transform:translateY(0); }
  50%     { transform:translateY(-6px); }
}

/* جلوگیری از سفید شدن هنگام intro */
.scroll-fab.intro-running{
  backdrop-filter:none !important;
  -webkit-backdrop-filter:none !important;
}

.military-current::before{
  content:"●";
  font-size:14px;
}
/* ✅ بالا کشیدن کل محتوا (گام‌ها می‌آید بالا) */
.content{
  margin-top:-18px !important;
}

/* موبایل کمی کمتر */
@media (max-width: 480px){
  .content{ margin-top:-12px !important; }
}

details.sec#docs > summary{
  padding:25px 12px 10px !important;
}
</style>`;

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
   if (!svc) {
  app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="card-clip"><div class="content">این خدمت پیدا نشد.</div></div></div></div>`;
  return;
}

const isPassport =
  /passport/i.test(String(serviceKey || "")) ||
  /گذرنامه/.test(String(svc?.barTitle || svc?.shortTitle || ""));

      
// ===== Breadcrumb (آخر-محور + کوتاه‌سازی روی صفحه فعلی) =====

// همیشه این دو تا ثابت‌اند

const currentLabelFull = (svc.barTitle || svc.shortTitle || "صفحه فعلی").trim();
// ===== Windows Breadcrumb (… > خدمات > [parent] > صفحه جاری) =====
const ref = (document.referrer || "");
const cameFromMilitaryHub = /(^|\/)military-hub\.html(\?|#|$)/.test(ref);

// 1) تعریف قوانین هاب‌ها (الان فقط نظام وظیفه)
const HUBS = {
  military: {
    label: "نظام وظیفه",
    href: "military-hub.html",
    // تشخیص «زیرمجموعه نظام وظیفه» بدون نیاز به تغییر تک‌تک سرویس‌ها
    match: (svc, key) => {
      const t = `${svc?.barTitle || ""} ${svc?.shortTitle || ""}`;
      const k = String(key || "");
      return (
        /military|nezam|vazife|sarbazi/i.test(k) ||
        /نظام\s*وظیفه|سرباز|سربازی|مشمول|اعزام|معافیت/i.test(t)
      );
    }
  }
};

// 2) تعیین hubKey
let hubKey = null;

// اگر از هاب نظام وظیفه آمده‌ایم => قطعی
if (cameFromMilitaryHub) hubKey = "military";

// اگر از سرچ/QR آمده‌ایم => با match تشخیص بده
if (!hubKey) {
  for (const k in HUBS) {
    if (HUBS[k].match(svc, serviceKey)) { hubKey = k; break; }
  }
}
// اگر هنوز hubKey نداریم: فقط در صورتی از lastHub استفاده کن
// که خودِ صفحه "به احتمال زیاد" نظام‌وظیفه‌ای باشد (بر اساس متن/کلید)
if (!hubKey) {
  try {
    const last = sessionStorage.getItem("lastHub");
    if (last && HUBS[last]) {
      // یک چک سبک برای اینکه page واقعاً همون خانواده باشد
      const t = `${svc?.barTitle || ""} ${svc?.shortTitle || ""}`;
      const k = String(serviceKey || "");
      const looksMilitary =
        /military|nezam|vazife|sarbazi/i.test(k) ||
        /نظام\s*وظیفه|سرباز|سربازی|مشمول|اعزام|معافیت/i.test(t);

      if (looksMilitary) hubKey = last;
    }
  } catch (e) { /* ignore */ }
}

      

// 3) حافظه نشست: آخرین هاب
// - اگر صفحه الان زیرمجموعه هاب است => ذخیره کن
// - اگر نیست => پاک کن (تا گذرنامه/… آلوده نشود)
try {
  if (hubKey) sessionStorage.setItem("lastHub", hubKey);
  else sessionStorage.removeItem("lastHub");
} catch (e) { /* ignore */ }

// 4) parent را از hubKey بساز
let parent = hubKey ? { label: HUBS[hubKey].label, href: HUBS[hubKey].href } : null;



let raw = Array.isArray(svc.breadcrumb) ? svc.breadcrumb.slice() : [
  { label: "خانه", href: "index.html" },
  { label: "خدمات", href: "all.html" },
  { label: currentLabelFull, href: "" }
];

// حذف صفحه فعلی
if (raw.length) raw = raw.slice(0, -1);

// حذف خانه
raw = raw.filter(c => !/خانه/.test(String(c?.label || "")));

// حذف "خدمات" از parentها (چون جداگانه رندر می‌کنیم)
raw = raw.filter(c => !/^خدمات$/.test(String(c?.label || "").trim()));

// اگر سرویس زیرمجموعه هاب نبود، اجازه نده "نظام وظیفه" از breadcrumb دیتا وارد شود
if (!hubKey) {
  raw = raw.filter(c => !/نظام\s*وظیفه/.test(String(c?.label || "")));
}

// اگر hubKey نداریم، parent را از raw بگیر (برای سایر دسته‌ها)
if (!parent) parent = raw.length ? raw[raw.length - 1] : null;

// HTML breadcrumb
const breadcrumbHtml = `
<div class="breadcrumb" id="breadcrumb">

  <!-- خانه (پیش‌فرض نمایش داده می‌شود) -->
  <a class="bc-home" id="bcHome" href="index.html">خانه</a>
  <span class="bc-sep" id="bcSepHome">›</span>

  <!-- سه‌نقطه (پیش‌فرض مخفی است؛ فقط وقتی کم جا شد جای خانه/خدمات می‌نشیند) -->
  <a class="bc-dots" id="bcDots" href="index.html" style="display:none">…</a>
  <span class="bc-sep" id="bcSepDots" style="display:none">›</span>

  <a class="bc-services" id="bcServices" href="all.html">خدمات</a>

  ${parent ? `
    <span class="bc-sep" id="bcSepParent">›</span>
    ${parent.href
    ? `<a class="bc-parent bc-part" id="bcParent" data-full="${escAttr(parent.label)}" href="${escAttr(parent.href)}">${escText(parent.label)}</a>`
: `<span class="bc-parent bc-part" id="bcParent" data-full="${escAttr(parent.label)}">${escText(parent.label)}</span>`

    }
  ` : ""}

  <span class="bc-sep" id="bcSepCurrent">›</span>
 <span class="bc-current ${hubKey ? "military-current" : ""}" id="bcCurrent">
  ${hubKey ? "" : "صفحه جاری"}
</span>

</div>
`;







      


const feeKey = svc?.meta?.feeKey;
const feeObj =
  (typeof window.FEES !== "undefined" && feeKey && window.FEES[feeKey])
    ? window.FEES[feeKey]
    : null;

const hasTime = !!svc?.meta?.time;
const hasFeeTable = !!(feeObj && Array.isArray(svc.feeRows) && svc.feeRows.length);

let feeRowsHtml = "";

if (hasTime || hasFeeTable) {
  const feeRows = hasFeeTable
    ? svc.feeRows.map(r => ({ title: r.label, value: feeObj[r.field] }))
    : [];

  feeRowsHtml = feeRows.map(r =>
    `<tr><td>هزینه</td><td>${esc(r.title)}: ${esc(safeText(r.value))}</td></tr>`
  ).join("");
}

const feeSectionHtml = (hasTime || hasFeeTable) ? `
  <details class="sec doc-sec" id="feeBox">
    <summary>
      <span class="sec-toggle" aria-hidden="true">+</span>
      <span class="sec-title">زمان و هزینه</span>
    </summary>
    <div class="sec-body">
      <div class="fee-box" style="margin-top:0">
        <table>
          <tr><th>بخش</th><th>مقدار/توضیح</th></tr>
          ${hasTime ? `<tr><td>زمان</td><td>${esc(svc.meta.time)}</td></tr>` : ""}
          ${feeRowsHtml}
        </table>
      </div>
    </div>
  </details>
` : "";




    // === HERO: فقط اگر سرویس واقعاً داده داده باشد ===
    const hasHero =
      !!(svc.heroTitle || svc.heroSubtitle || svc.heroPrimary || svc.heroSecondary);

   const heroTitle = escText(svc.heroTitle || "");
const heroSubtitle = escText(svc.heroSubtitle || "");

  
    const heroPrimary = svc.heroPrimary || null;
    const heroSecondary = svc.heroSecondary || null;
  
      const topCtaHtml =
  (heroPrimary?.label && heroPrimary?.href)
  ? `<a class="top-cta" href="${escAttr(heroPrimary.href)}">${escText(heroPrimary.label)}</a>`

    : "";

      
      
      
      const metaCtaHtml =
  (heroPrimary?.label && heroPrimary?.href)
 ? `<a class="meta-cta" href="${escAttr(heroPrimary.href)}">${escText(heroPrimary.label)}</a>`

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
  ? `<div class="cta"><a href="${escAttr(stepsSec.cta.href)}">${escText(stepsSec.cta.label)}</a></div>`

    : "";

  stepsHtml = `
    <details class="sec card steps-card" open>
      <summary>
       
       <span class="sec-title">${esc(stepsSec.heading || stepsSec.title || "گام‌های انجام کار")}</span>
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
  ? `<div class="cta"><a href="${escAttr(sec.cta.href)}">${escText(sec.cta.label)}</a></div>`

    : "";

  return `
    <details class="sec doc-sec">
      <summary>
        <span class="sec-toggle" aria-hidden="true">+</span>
        <span class="sec-title">${esc(sec.heading || sec.title || "")}</span>
      </summary>
      <div class="sec-body">${body}${ctaHtml}</div>
    </details>
  `;
}).join("");



 
     const heroHtml = hasHero ? `
  <div class="hero">

   ${
  (svc.heroTitle && (svc.heroTitle !== (svc.barTitle || svc.shortTitle || "")))
  ? `<h2 class="hero-title">${heroTitle}</h2>`

    : ""
}


    ${heroSubtitle ? `<p class="hero-sub">${heroSubtitle}</p>` : ""}

    <div class="hero-actions sticky-cta">
    
      ${heroSecondary?.label && heroSecondary?.href
      ? `<a class="btn-secondary" href="${escAttr(heroSecondary.href)}">${escText(heroSecondary.label)}</a>`

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
      <summary>
  <span class="sec-toggle" aria-hidden="true">+</span>
  <span class="sec-title">نکات مهم</span>
</summary>

      <div class="sec-body">${olList(noticeList)}</div>
    </details>
  `
  : "";


 const faqHtml = (svc.faqEnabled === true && svc.faq && svc.faq.length)
  ? `
    <details class="sec doc-sec">
     <summary>
  <span class="sec-toggle" aria-hidden="true">+</span>
  <span class="sec-title">سؤالات پرتکرار</span>
</summary>

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
    ? `<div class="svc-badge"><img class="svc-icon" src="${escAttr(svc.icon)}" alt=""></div>`

      : "";

    // Bottom CTA: فقط اگر سرویس explicitly داده باشد
    const hasBottomCta = !!(svc.bottomCta && svc.bottomCta.label && svc.bottomCta.href);
    const bottomCta = hasBottomCta ? svc.bottomCta : null;

    const bottomCtaHtml = bottomCta ? `
      <div class="bottom-cta">
        <div class="inner">
         <a class="btn-primary" href="${escAttr(bottomCta.href)}">${escText(bottomCta.label)}</a>

        </div>
      </div>
    ` : "";

    app.innerHTML = `
      ${style}
      <div class="wrap">
       <div class="card ${isPassport ? "is-passport" : ""}">

          <div class="brandbar">
            <div class="brand-right">
            
              ${iconHtml}
              <div class="svc-title">${esc(svc.barTitle || svc.shortTitle || "")}</div>
            </div>
         <div class="brand-left">
  <a class="back-btn" id="smartBackBtn" href="#" aria-label="بازگشت"></a>
</div>


            
          </div>

          <div class="card-clip">
        <div class="header">

  <div class="header-row">
${breadcrumbHtml}



    ${metaCtaHtml ? `<div class="header-cta">${metaCtaHtml}</div>` : `<div class="header-cta"></div>`}
  </div>

</div>


            ${heroHtml}

<div class="content">

${stepsHtml}
<div class="card-gap"></div>
          
<details class="sec" id="docs" open>

  <summary>
  <span class="docs-title">مدارک و شرایط</span>
  <!-- علامت +/− برای این بخش حذف شد -->
</summary>

<div class="sec-body">
  ${restSectionsHtml}
  ${feeSectionHtml}
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
<button class="scroll-fab" id="scrollFab" aria-label="اسکرول">
  <span aria-hidden="true"></span>
</button>




      ${bottomCtaHtml}
    `;
// ===== Windows Breadcrumb fit (خانه > خدمات > parent > صفحه جاری) =====
(function () {
  const bc = app.querySelector("#breadcrumb");
  if (!bc) return;

  const home = app.querySelector("#bcHome");
  const sepHome = app.querySelector("#bcSepHome");

  const dots = app.querySelector("#bcDots");
  const sepDots = app.querySelector("#bcSepDots");

  const services = app.querySelector("#bcServices");

  const sepParent = app.querySelector("#bcSepParent");
  const parent = app.querySelector("#bcParent");

  function setDisplay(el, on){
    if (!el) return;
    el.style.display = on ? "" : "none";
  }

  // کوتاه‌سازی parent از چپ: …ظام وظیفه
  function leftEllipsize(el, full){
    if (!el) return;

    el.textContent = full;
    if (bc.scrollWidth <= bc.clientWidth) return;

    let lo = 1, hi = full.length, best = 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      el.textContent = "…" + full.slice(full.length - mid);
      if (bc.scrollWidth <= bc.clientWidth) { best = mid; lo = mid + 1; }
      else { hi = mid - 1; }
    }
    el.textContent = (best <= 1) ? "…" : ("…" + full.slice(full.length - best));
  }

  function fit(){
    // ===== حالت پایه: خانه > خدمات > [parent] > صفحه جاری =====
    setDisplay(home, true);
    setDisplay(sepHome, true);

    setDisplay(dots, false);
    setDisplay(sepDots, false);

    setDisplay(services, true);

    setDisplay(sepParent, !!parent);
    setDisplay(parent, !!parent);

    // ریست parent
    if (parent) parent.textContent = parent.getAttribute("data-full") || parent.textContent;

    // dots وقتی جای "خانه" را می‌گیرد => index.html
    if (dots) dots.href = "index.html";

    if (bc.scrollWidth <= bc.clientWidth) return;

    // ===== مرحله 1: خانه => … (… لینک به landing = index.html) =====
    setDisplay(home, false);
    setDisplay(sepHome, false);

    setDisplay(dots, true);
    setDisplay(sepDots, true);
    if (dots) dots.href = "index.html";

    if (bc.scrollWidth <= bc.clientWidth) return;

    // ===== مرحله 2: نظام‌وظیفه‌ای‌ها: خدمات حذف شود و … برود all.html =====
    const isMilitaryPage = !!hubKey;

    if (isMilitaryPage) {
      setDisplay(services, false);
      if (dots) dots.href = "all.html";

      if (bc.scrollWidth <= bc.clientWidth) return;

      // ===== مرحله 3: parent را از چپ کوتاه کن =====
      if (parent){
        const full = parent.getAttribute("data-full") || parent.textContent || "";
        leftEllipsize(parent, full);
        if (bc.scrollWidth <= bc.clientWidth) return;
      }

      // ===== مرحله 4: فقط … + صفحه جاری =====
      setDisplay(sepParent, false);
      setDisplay(parent, false);
      return;
    }

  // ===== غیرنظام: اگر هنوز جا کم است، خدمات هم حذف شود =====
// در این مرحله "…" باید برود به خدمات (نه لندینگ)
setDisplay(services, false);
setDisplay(sepDots, false);           // جلوگیری از دو تا جداکننده
if (dots) dots.href = "all.html";     // ✅ قرارداد: … => خدمات

  }

  fit();
  window.addEventListener("resize", fit);
})();

      

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
// toggle فقط برای فرزندان
const docChildren = app.querySelectorAll('details.sec#docs .doc-sec');

docChildren.forEach(sec => {
  const icon = sec.querySelector('.sec-toggle');
  if (!icon) return;

  icon.textContent = sec.open ? '−' : '+';

  sec.addEventListener('toggle', () => {
    icon.textContent = sec.open ? '−' : '+';
  });
});
const fab = app.querySelector("#scrollFab");
let fabIntroRunning = false;

      
// ===== Smart Back Button =====
const smartBack = app.querySelector("#smartBackBtn");

if (smartBack) {
  smartBack.addEventListener("click", function (e) {
    e.preventDefault();

    const ref = document.referrer || "";

    if (/military-hub\.html/.test(ref)) {
      location.href = "military-hub.html";
      return;
    }

    if (/all\.html/.test(ref)) {
      location.href = "all.html";
      return;
    }

    if (/index\.html/.test(ref)) {
      location.href = "index.html";
      return;
    }

    // اگر مستقیم با QR آمده
    location.href = "all.html";
  });
}


function isScrollable(){
  const doc = document.documentElement;
  return doc.scrollHeight > (window.innerHeight + 5);
}
function isNearBottom(){
  const doc = document.documentElement;
  return (window.scrollY + window.innerHeight) >= (doc.scrollHeight - 80);
}

function updateFab(){
  if (!fab) return;

  if (!isScrollable()){
    fab.style.display = "none";
    return;
  }

  fab.style.display = "inline-flex";

  const nearBottom = isNearBottom();
  fab.classList.toggle("to-top", nearBottom);

// بعد از intro دیگر bounce خودکار نداشته باش
if (!fabIntroRunning) {
  fab.classList.remove("is-bounce");
}


}

function runFabIntro() {
  if (!fab) return;

  fab.classList.remove("intro-running"); // ایمن‌سازی
  if (!isScrollable()) return;

  fabIntroRunning = true;
  fab.classList.add("intro-running");
  fab.classList.remove("is-bounce");

  const prevAnim = fab.style.animation;
  const prevTransition = fab.style.transition;
  fab.style.animation = "none";
  fab.style.transition = "none";

  fab.style.display = "inline-flex";

  requestAnimationFrame(() => {
    const rect = fab.getBoundingClientRect();
   const h = rect.height || parseInt(getComputedStyle(fab).height);


    const brandbarH = 60;
    const startCenterY = Math.max(90, brandbarH + 14 + (h / 2));

    const bottomCtaEl = document.querySelector(".bottom-cta");
    const bottomCtaH = bottomCtaEl ? bottomCtaEl.getBoundingClientRect().height : 0;

    const hitPad = 6;
    const targetCenterY = window.innerHeight - hitPad - (h / 2) - bottomCtaH;

    const currentCenterY = rect.top + (h / 2);
    const dyToStart = startCenterY - currentCenterY;
    const dyStartToTarget = targetCenterY - startCenterY;

    const startY = dyToStart;
    const endY = dyToStart + dyStartToTarget;

    fab.style.transform = `translateY(${startY}px)`;
    fab.style.opacity = "0";

   const anim = fab.animate(
  [
    { transform: `translateY(${startY}px)`, opacity: 0.0, offset: 0.00 },
    { transform: `translateY(${startY + (endY - startY) * 0.35}px)`, opacity: 1.0, offset: 0.20 },
    { transform: `translateY(${startY + (endY - startY) * 0.78}px)`, opacity: 1.0, offset: 0.62 },
    { transform: `translateY(${endY}px)`, opacity: 1.0, offset: 0.78 },
    { transform: `translateY(${endY + 12}px)`, opacity: 1.0, offset: 0.84 },
    { transform: `translateY(${endY - 7}px)`, opacity: 1.0, offset: 0.90 },
    { transform: `translateY(${endY}px)`, opacity: 1.0, offset: 1.00 }
  ],
  {
    duration: 15000,
    easing: "cubic-bezier(.22,.85,.2,1)",
    fill: "forwards"
  }
);

// ✅ رنگ آیکون FAB هنگام پایین آمدن: ramp-4 -> ramp-3 -> ramp-2 -> ramp-1
const setFabInkByProgress = (p) => {
  let c = "var(--ramp-4)";
  if (p >= 0.35) c = "var(--ramp-3)";
  if (p >= 0.62) c = "var(--ramp-2)";
  if (p >= 0.78) c = "var(--ramp-1)";
  fab.style.setProperty("--fab-ink", c);

  // ✅ محو -> پررنگ
  const op = 0.12 + (p * 0.88);   // از 0.12 تا 1
  fab.style.setProperty("--fab-op", op.toFixed(3));
};


const dur = anim.effect.getTiming().duration || 1;

const tickInk = () => {
  if (!fabIntroRunning) return;
  const t = (anim.currentTime || 0);
  const p = Math.max(0, Math.min(1, t / dur));
  setFabInkByProgress(p);
  requestAnimationFrame(tickInk);
};

// شروع از کم
fab.style.setProperty("--fab-ink", "var(--ramp-4)");
fab.style.setProperty("--fab-op", "0.12");

      requestAnimationFrame(tickInk);


    anim.onfinish = () => {
      const settle = fab.animate(
        [
          { transform: `translateY(${endY}px)` },
          { transform: `translateY(${endY + 8}px)` },
          { transform: `translateY(${endY}px)` },
          { transform: `translateY(${endY + 5}px)` },
          { transform: `translateY(${endY}px)` },
          { transform: `translateY(${endY + 3}px)` },
          { transform: `translateY(${endY}px)` }
        ],
        { duration: 520, easing: "ease-out", fill: "forwards" }
      );

      settle.onfinish = () => {
        fab.style.transform = `translateY(${endY}px)`;
        fab.style.opacity = "1";

        fab.style.animation = prevAnim;
        fab.style.transition = prevTransition;

        fab.classList.remove("intro-running");
        fabIntroRunning = false;
      };
    };
  });
}


if (fab) {
 fab.addEventListener("click", () => {
  const goingUp = fab.classList.contains("to-top");

  window.scrollTo({
    top: goingUp ? 0 : document.documentElement.scrollHeight,
    behavior: "smooth"
  });
});


  window.addEventListener("scroll", updateFab, { passive:true });
  window.addEventListener("resize", () => {
    updateFab();
  });

  updateFab();
  runFabIntro();
}   

   
  } // پایان renderService

  const key = window.SERVICE_KEY;
  if (!key) {
    app.innerHTML = `${style}<div class="wrap"><div class="card"><div class="card-clip"><div class="content">شناسه خدمت مشخص نیست.</div></div></div></div>`;
    return;
  }

  renderService(key);
})();
