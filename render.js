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

  // لیست هوشمند: تشخیص تیترهای داخلی (خط‌هایی که با ":" تمام می‌شوند) و ساخت زیرلیست
  function liList(items) {
    if (!items || !items.length) return "";

    const clean = items
      .map(x => String(x ?? "").trim())
      .filter(Boolean);

    const isHead = (s) => /[:：]$/.test(s);

    // اگر تیتر داخلی نداریم، رفتار ساده
    const hasAnyHead = clean.some(isHead);
    if (!hasAnyHead) {
      return `<ul>${clean.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    }

    let html = "";
    let i = 0;

    // یک UL اصلی برای آیتم‌های قبل از اولین تیتر
    let openMainUl = false;
    const openUl = () => { if (!openMainUl) { html += `<ul>`; openMainUl = true; } };
