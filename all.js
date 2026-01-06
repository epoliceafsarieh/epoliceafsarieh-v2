/* all.js — All services list (independent, no render.js) */

const SERVICES = [
  { title: "گذرنامه",              key: "passport",  href: "passport.html" },
  { title: "گواهینامه",            key: "driving",   href: "driving.html" },
  { title: "ترخیص خودرو / موتور",  key: "tarkhis",   href: "tarkhis.html" },
  { title: "خلافی خودرو / موتور",  key: "khalafi",   href: "khalafi.html" },

  // این‌ها در لیست شما هستند ولی فعلاً صفحه‌شان را نداریم → غیرفعال تا لینک شکسته نشود
  { title: "پلیس پیشگیری",         key: "prevent",   href: null },
  { title: "تشخیص هویت",           key: "identity",  href: null },
  { title: "کارت سوخت",            key: "fuel",      href: null },

  // تنها هاب
  { title: "نظام وظیفه",           key: "military",  href: "military-hub.html" },
];

const ICONS = {
  passport: svg("M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 4h6M9 12h6M9 16h4"),
  driving:  svg("M7 15h10l1.5-4.5A2 2 0 0 0 16.6 8H7.4a2 2 0 0 0-1.9 2.5L7 15Zm1.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"),
  tarkhis:  svg("M8 6h8M7 10h10M8 14h8M9 18h6"),
  khalafi:  svg("7 6h10M7 10h10M7 14h6M7 18h10"),
  prevent:  svg("12 2 20 6v6c0 5-3.5 9.4-8 10-4.5-.6-8-5-8-10V6l8-4Z"),
  identity: svg("8 7h8M7 11h10M9 15h6M10 19h4"),
  fuel:     svg("8 4h7v7a3 3 0 0 1-3 3H8V4Zm7 6h1.5A1.5 1.5 0 0 1 18 11.5V18a2 2 0 0 1-2 2h-1"),
  military: svg("12 3 20 7v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4Z"),
};

function svg(d){
  return `<path d="${d}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function iconSvg(key){
  const body = ICONS[key] || ICONS.prevent;
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">${body}</svg>`;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function render(){
  const root = document.getElementById("allList");
  if(!root) return;

  root.innerHTML = SERVICES.map(s => {
    const label = escapeHtml(s.title);

    // اگر href نداشت → غیرفعال (بدون لینک شکسته)
    if(!s.href){
      return `
        <div class="item" aria-disabled="true">
          ${iconSvg(s.key)}
          <span class="label">${label}</span>
          <span class="chev" aria-hidden="true">›</span>
        </div>
      `;
    }

    return `
      <a class="item" href="${s.href}">
        ${iconSvg(s.key)}
        <span class="label">${label}</span>
        <span class="chev" aria-hidden="true">›</span>
      </a>
    `;
  }).join("");
}

render();

