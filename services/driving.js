// services/driving.js
(function () {
  window.SERVICE_DATA = window.SERVICE_DATA || {};
  window.SERVICES = window.SERVICES || {};

  const driving = {
    barTitle: "تعویض و المثنی گواهینامه",
    icon: "assets/img/icons/license.png",

    heroTitle: "تعویض و المثنی گواهینامه",
    heroSubtitle: "راهنمای مدارک و مراحل — عکس بیومتریک در دفتر انجام می‌شود.",

    heroPrimary: { label: "مدارک لازم", href: "#docs" },
    heroSecondary: { label: "مراحل انجام کار", href: "#steps" },

    sections: [
      {
        heading: "شرایط کلی",
        open: true,
        items: [
          "حضور شخص متقاضی در دفتر الزامی است",
          "عکس به صورت بیومتریک در دفتر انجام می‌شود"
        ]
      },
      {
        heading: "مدارک لازم (چی بیارم؟)",
        tag: "چک‌لیست",
        items: [
          "شناسنامه (اصل)",
          "کارت ملی (اصل)",
          "ارائه اصل شناسنامه و کارت ملی عکس‌دار",
          "گواهینامه (اصل)",
          "در صورت داشتن چند گواهینامه (موتور | خودرو | ویژه) همه تحویل شود",
          "کد پستی ۱۰ رقمی محل سکونت",
          "شناسه قبض برق منزل (از پیامک قبض)"
        ]
      },
      {
        heading: "مراحل انجام کار",
        tag: "چه مراحلی داره",
        items: [
          "مراجعه به پلیس +۱۰ و ثبت مدارک",
          "ارجاع به پزشک معتمد و انجام معاینه",
          "بازگشت به دفتر و ثبت نهایی",
          "تحویل رسید معتبر گواهینامه"
        ]
      }
    ],

    notDone: [
      "صدور اولیه گواهینامه مربوط به آموزشگاه است",
      "معاینه پزشکی خارج از دفتر انجام می‌شود"
    ]
  };

  window.SERVICE_DATA.driving = driving;
  window.SERVICES.driving = driving;
})();
