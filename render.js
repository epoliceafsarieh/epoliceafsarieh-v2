// ⬇️ فقط بخش‌های کلیدی را می‌بینی؛ کل فایل را جایگزین کن
// تفاوت اصلی: subtitle و photo pill دیگر رندر نمی‌شوند

// داخل renderService:

const metaPills = [];
if (svc.meta?.time)
  metaPills.push(`<div class="pill">زمان معمول: ${esc(svc.meta.time)}</div>`);

// ❌ عکس/بیومتریک عمداً حذف شد

// در HTML خروجی:

<div class="header">
  <div class="meta">
    ${metaPills.join("")}
    ${feeTable}
  </div>
</div>
