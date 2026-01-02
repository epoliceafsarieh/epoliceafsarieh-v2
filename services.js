<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>گذرنامه بین‌المللی</title>

<style>
:root{
  --brand:#041E42;
  --bg:#f5f7fb;
  --card:#ffffff;
  --text:#0f172a;
  --muted:#475569;
  --border:#e6e8ee;
  --soft:#f1f5ff;
  --radius:14px;
}

/* پایه */
*{box-sizing:border-box}
body{
  margin:0;
  font-family:Tahoma, Arial, sans-serif;
  background:var(--bg);
  color:var(--text);
  line-height:2;              /* اصل Mississippi */
  font-size:15px;
}

/* ظرف */
.wrap{
  max-width:860px;
  margin:18px auto 32px;
  padding:0 14px;
}

/* کارت اصلی */
.card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:var(--radius);
  overflow:hidden;
}

/* نوار بالا */
.brandbar{
  background:var(--brand);
  color:#fff;
  padding:10px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.brandbar .title{
  font-weight:900;
  font-size:17px;
}

.brandbar a{
  color:#fff;
  text-decoration:none;
  font-weight:800;
  font-size:13px;
  padding:6px 10px;
  border:1px solid rgba(255,255,255,.25);
  border-radius:10px;
}

/* متا */
.meta{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  justify-content:center;
  padding:14px;
  border-bottom:1px solid var(--border);
}

.pill{
  background:var(--soft);
  border:1px solid var(--border);
  border-radius:999px;
  padding:8px 14px;
  font-weight:800;
  font-size:13px;
}

/* محتوا */
.content{
  padding:18px 16px 24px;
}

/* بخش‌ها */
.section{
  margin-top:18px;
  border:1px solid var(--border);
  border-radius:12px;
  background:#fff;
  overflow:hidden;
}

.section-header{
  background:#f8fbff;
  padding:12px 14px;
  font-weight:900;
  font-size:15px;
}

.section-body{
  padding:14px 18px;
}

/* لیست‌ها */
ul,ol{
  margin:0;
  padding-right:20px;
}

li{
  margin:10px 0;              /* فاصله اسکن‌پذیر */
}

/* دکمه‌ها */
.btn{
  display:inline-block;
  margin-top:10px;
  background:var(--soft);
  border:1px solid var(--border);
  padding:10px 16px;
  border-radius:12px;
  font-weight:900;
  color:var(--brand);
  text-decoration:none;
}

/* علامت توجه */
.marker{
  display:inline-block;
  width:10px;
  height:10px;
  background:#f59e0b;
  border-radius:50%;
  margin-right:6px;
}

/* فوتر */
.footer{
  margin-top:24px;
  padding-top:14px;
  border-top:1px dashed var(--border);
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
}

.footer a{
  background:rgba(4,30,66,.12);
  border:1px solid rgba(4,30,66,.35);
  padding:10px 14px;
  border-radius:12px;
  font-weight:900;
  color:var(--brand);
  text-decoration:none;
}

.hint{
  font-size:12px;
  color:#64748b;
}
</style>
</head>

<body>

<div class="wrap">
  <div class="card">

    <div class="brandbar">
      <div class="title">گذرنامه بین‌المللی</div>
      <a href="index.html">بازگشت</a>
    </div>

    <div class="meta">
      <div class="pill">زمان معمول: ۷ تا ۱۴ روز کاری</div>
      <div class="pill">هزینه: برای مشاهده کلیک کنید</div>
    </div>

    <div class="content">

      <!-- مدارک هویتی -->
      <div class="section">
        <div class="section-header">مدارک هویتی (الزامی)</div>
        <div class="section-body">
          <ul>
            <li>اصل شناسنامه عکس‌دار (بالای ۱۵ سال)</li>
            <li>اصل کارت ملی  
              <ul>
                <li>یا رسید ثبت‌نام کارت ملی (حداقل ۷۲ ساعت گذشته باشد)</li>
              </ul>
            </li>
            <li>تکمیل فرم درخواست گذرنامه</li>
          </ul>

          <a class="btn" href="#">تکمیل فرم درخواست گذرنامه</a>
        </div>
      </div>

      <!-- افراد زیر ۱۸ -->
      <div class="section">
        <div class="section-header">افراد زیر ۱۸ سال (در صورت مشمول بودن)</div>
        <div class="section-body">
          <ul>
            <li>رضایت‌نامه محضری پدر یا قیم قانونی</li>
            <li>افراد بالای ۱۵ سال:
              <ul>
                <li>شناسنامه عکس‌دار</li>
                <li>کارت ملی</li>
              </ul>
            </li>
            <li>افراد زیر ۱۵ سال:
              <ul>
                <li>شناسنامه</li>
                <li>یکی از مدارک: گواهی تحصیل / دفترچه بیمه عکس‌دار / گذرنامه عکس‌دار</li>
              </ul>
            </li>
            <li>برای زیر ۵ سال: عکس ۴×۶ رنگی با زمینه سفید الزامی است</li>
          </ul>
        </div>
      </div>

      <!-- بانوان -->
      <div class="section">
        <div class="section-header">وضعیت بانوان (در صورت مشمول بودن)</div>
        <div class="section-body">
          <ul>
            <li>بانوان متأهل: رضایت‌نامه محضری همسر</li>
            <li>بانوان مطلقه: اصل طلاق‌نامه</li>
            <li>بانوانی که همسر آن‌ها فوت شده: اصل گواهی فوت</li>
            <li>
              <span class="marker"></span>
              بانوان مقیم خارج از کشور:
              <ul>
                <li>در صورت داشتن همسر خارجی، رضایت‌نامه محضری همسر لازم نیست</li>
                <li>اقامت با گذرنامه ایرانی قابل قبول است</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <!-- گذرنامه قبلی -->
      <div class="section">
        <div class="section-header">گذرنامه قبلی</div>
        <div class="section-body">
          <ul>
            <li>گذرنامه قبلی (در صورت وجود)</li>
            <li>مدرک نحوه ورود به کشور برای متولدین خارج از کشور</li>
            <li>در صورت مفقودی یا مخدوشی گذرنامه معتبر: پیگیری از طریق دفتر</li>
            <li>افرادی که گذرنامه منقضی‌شده آن‌ها مفقود یا مخدوش شده است، می‌توانند مستقیماً به دفاتر خدمات مراجعه کنند</li>
          </ul>
        </div>
      </div>

      <!-- نکات مهم -->
      <div class="section">
        <div class="section-header">نکات مهم</div>
        <div class="section-body">
          <ol>
            <li>این صفحه مربوط به گذرنامه بین‌المللی است. گذرنامه زیارتی از طریق باجه پیگیری می‌شود.</li>
            <li>عکس فقط به‌صورت بیومتریک در دفتر اخذ می‌شود و عکس کاغذی پذیرفته نیست.</li>
            <li>تکمیل پرونده بدون حضور متقاضی امکان‌پذیر نیست.</li>
          </ol>
        </div>
      </div>

      <!-- سوالات -->
      <div class="section">
        <div class="section-header">سؤالات پرتکرار</div>
        <div class="section-body">
          <strong>گذرنامه زیارتی از این مسیر انجام می‌شود؟</strong>
          <p>خیر. برای گذرنامه زیارتی از طریق باجه اقدام کنید.</p>
        </div>
      </div>

      <div class="footer">
        <a href="index.html">بازگشت به صفحه اصلی</a>
        <span class="hint">این راهنما به مرور کامل‌تر می‌شود</span>
      </div>

    </div>
  </div>
</div>

</body>
</html>
