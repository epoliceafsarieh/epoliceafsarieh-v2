<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>همه خدمات پلیس +۱۰</title>

  <style>
    :root{
      /* نزدیک‌تر به ایندکس */
      --ms-blue:#041E42;

      --card:rgba(255,255,255,.10);
      --stroke:rgba(255,255,255,.22);

      --text:#fff;
      --muted:rgba(255,255,255,.78);
      --muted2:rgba(255,255,255,.66);

      --radius:16px;
    }

    *{box-sizing:border-box}
    html,body{overflow-x:hidden}
    body{
      margin:0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont,
                   "Segoe UI", Roboto, Arial, sans-serif;
      background: var(--ms-blue); /* به ایندکس نزدیک‌تر */
      color:var(--text);
      line-height:1.9;
      min-height:100vh;
    }

    .wrap{
      max-width:640px;
      margin:0 auto;
      padding:18px 16px 22px;
    }

    /* ✅ فقط برای بازگشت بالا-چپ */
    .topbar{
      display:flex;
      justify-content:flex-start;
      align-items:center;
      gap:12px;
      padding:6px 2px 6px;
    }

    .back{
      border:1px solid var(--stroke);
      border-radius:14px;
      padding:10px 12px;
      background:rgba(255,255,255,.10);
      color:#fff;
      font-weight:800;
      font-family:inherit;
      cursor:pointer;
      flex:0 0 auto;
    }

    /* ✅ لوگو وسط مثل ایندکس */
    .brand{
      text-align:center;
      margin: 6px 0 16px;
    }
    .brand img{
      width:96px;
      height:auto;
      object-fit:contain;
      display:inline-block;
    }

    .list{
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .item{
      display:flex;
      align-items:center;
      gap:12px;
      padding:12px 12px;
      border-radius:var(--radius);
      border:1px solid var(--stroke);
      background:var(--card);
      color:#fff;
      text-decoration:none;
    }

    .item[aria-disabled="true"]{
      opacity:.55;
      cursor:default;
    }

    /* آیکن‌های خودت (PNG) – متوسط، کوچک‌تر از ایندکس */
    .icon-img{
      width:36px;
      height:36px;
      flex:0 0 36px;
      object-fit:contain;
      display:block;
      opacity:.92;
    }

    .label{
      flex:1 1 auto;
      font-weight:850;
      font-size:15px;
      line-height:1.35;
      min-width:0;
      white-space:normal;
      overflow-wrap:anywhere;
      word-break:break-word;
    }

    .chev{
      opacity:.55;
      font-size:18px;
      line-height:1;
      transform: translateY(-1px);
      flex:0 0 auto;
    }

    /* حضور ضعیف خدمات ویژه (ساختار ثابت؛ متن فعلاً دست‌نخورده) */
    .weak{
      margin-top:20px;
      padding:10px 6px 0;
      color:var(--muted2);
      font-size:12.5px;
      line-height:1.7;
      text-align:center;
    }
    .weak a{
      color:inherit;
      text-decoration:none;
      border-bottom:1px dotted rgba(255,255,255,.28);
      padding-bottom:1px;
    }
  </style>
</head>

<body>
  <div class="wrap">

    <div class="topbar">
      <button class="back" type="button" onclick="location.href='index.html'">بازگشت</button>
    </div>

    <div class="brand">
      <img src="assets/img/logo/logo_white.png" alt="" aria-hidden="true">
    </div>

    <div id="allList" class="list" aria-label="فهرست خدمات"></div>

    <div class="weak">
      اگر کار شما جزو این خدمات نیست، مسیر
      <a href="internet.html">«خدمات ویژه»</a>
      در دسترس است.
    </div>

  </div>

  <script src="all.js"></script>
</body>
</html>
