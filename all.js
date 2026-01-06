/* all.js — All services list (independent) */

const SERVICES = [
  { title: "گذرنامه",             icon: "passport", href: "passport.html" },
  { title: "گواهینامه",           icon: "license",  href: "driving.html"  },
  { title: "خلافی خودرو / موتور", icon: "khalafi",  href: "khalafi.html"  },
  { title: "ترخیص خودرو / موتور", icon: "tow",      href: "tarkhis.html"  },

  // فعلاً صفحه ندارند → غیرفعال، ولی نمایش داده می‌شوند
  { title: "پلیس پیشگیری",        icon: "other",    href: null },
  { title: "تشخیص هویت",          icon: "other",    href: null },
  { title: "کارت سوخت",           icon: "other",    href: null },

  // تنها هاب (مرحله بعد می‌سازیم)
  { title: "نظام وظیفه",          icon: "other",    href: "military-hub.html" },
];

const ICON_SRC = {
  passport: "assets/img/icons/passport.png",
  license:  "assets/img/icons/license.png",
  tow:      "assets/img/icons/tow.png",
  khalafi:  "assets/img/icons/other.png", // اگر آیکن اختصاصی خلافی داری، همین را عوض می‌کنیم
  other:    "assets/img/icons/other.png",
};

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function iconImg(iconKey){
  const src = ICON_SRC[iconKey] || ICON_SRC.other;
  return `<img class="icon-img" src="${src}" alt="" aria-hidden="true">`;
}

function render(){
  const root = document.getElementById("allList");
  if(!root) return;

  root.innerHTML = SERVICES.map(s => {
    const label = escapeHtml(s.title);

    if(!s.href){
      return `
        <div class="item" aria-disabled="true">
          ${iconImg(s.icon)}
          <span class="label">${label}</span>
          <span class="chev" aria-hidden="true">›</span>
        </div>
      `;
    }

    return `
      <a class="item" href="${s.href}">
        ${iconImg(s.icon)}
        <span class="label">${label}</span>
        <span class="chev" aria-hidden="true">›</span>
      </a>
    `;
  }).join("");
}

render();
