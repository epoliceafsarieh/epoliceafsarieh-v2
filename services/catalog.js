// services/catalog.js
(function () {
  window.CATALOG = window.CATALOG || {};

  // یک لیست واحد برای کل سایت
  window.CATALOG.SERVICES = [
    { key:"passport",  title:"گذرنامه",             href:"passport.html",     icon:"assets/img/icons/passport.png" },
    { key:"driving",   title:"گواهینامه",           href:"driving.html",      icon:"assets/img/icons/license.png" },
    { key:"nezam-ezam", title:"اعزام به خدمت", href:"nezam-ezam.html", icon:null, hiddenFromAll:true},
    { key:"moafiat_pezeshki", title:"معافیت پزشکی", href:"moafiat-pezeshki.html", icon:null, hiddenFromAll:true },
    { key:"kefalat", title:"معافیت کفالت", href:"kefalat.html", icon:null, hiddenFromAll:true },
    { key:"isargari", title:"معافیت ایثارگری", href:"isargari.html", icon:null, hiddenFromAll:true },
    { key:"behzisti", title:"معافیت مددجویان بهزیستی", href:"behzisti.html", icon:null, hiddenFromAll:true },

    { key:"military",  title:"نظام وظیفه",          href:"military-hub.html", icon:null },
     { key:"fuelcard",  title:"کارت سوخت",           href:"fuelcard.html",     icon:"assets/img/icons/fuelcard.png" },
        { key:"tarkhis",   title:"ترخیص خودرو / موتور", href:"tarkhis.html",      icon:"assets/img/icons/tow.png" },
    { key:"khalafi",   title:"خلافی خودرو / موتور", href:"khalafi.html",      icon:"assets/img/icons/khalafi.png" },

    // اگر هنوز صفحه ندارند، href را null بگذار (در all غیرفعال می‌شود، در سرچ هم نیاید)
    { key:"pishgiri",  title:"پلیس پیشگیری",        href:null,               icon:null },
    { key:"tashkhis",  title:"تشخیص هویت",          href:null,               icon:null },

    
  ];
})();
