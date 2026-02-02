// services/catalog.js
(function () {
  window.CATALOG = window.CATALOG || {};

  // یک لیست واحد برای کل سایت
  window.CATALOG.SERVICES = [
    { key:"passport",  title:"گذرنامه",             href:"passport.html",     icon:"assets/img/icons/passport.png" },
    { key:"driving",   title:"گواهینامه",           href:"driving.html",      icon:"assets/img/icons/license.png" },
    { key:"military",  title:"نظام وظیفه",          href:"military-hub.html", icon:null },
     { key:"fuelcard",  title:"کارت سوخت",           href:"fuelcard.html",     icon:"assets/img/icons/fuelcard.png" },
        { key:"tarkhis",   title:"ترخیص خودرو / موتور", href:"tarkhis.html",      icon:"assets/img/icons/tow.png" },
    { key:"khalafi",   title:"خلافی خودرو / موتور", href:"khalafi.html",      icon:"assets/img/icons/khalafi.png" },

    // اگر هنوز صفحه ندارند، href را null بگذار (در all غیرفعال می‌شود، در سرچ هم نیاید)
    { key:"pishgiri",  title:"پلیس پیشگیری",        href:null,               icon:null },
    { key:"tashkhis",  title:"تشخیص هویت",          href:null,               icon:null },

    
  ];
})();
