// services/khalafi.js
(function () {
  window.SERVICE_DATA = window.SERVICE_DATA || {};
  window.SERVICES = window.SERVICES || {};

  const khalafi = {
    barTitle: "خلافی خودرو و موتورسیکلت",
    icon: "assets/img/icons/khalafi1.png",

    heroTitle: "استعلام و پرداخت خلافی",

    meta: {
      time: "—",
      feeKey: "khalafi",
      feeSummary: "کلیک کنید"
    },

    feeRows: [
      { label: "استعلام خلافی", field: "inquiry" },
      { label: "پرداخت", field: "payment" },
      { label: "چاپ رسید", field: "print" }
    ],

    sections: [
      {
        heading: "اطلاعات لازم",
        open: true,
        items: [
          "شماره پلاک خودرو/موتورسیکلت",
          "شماره تماس برای دریافت پیامک/رسید (در صورت نیاز)"
        ]
      },
      {
        heading: "گام‌های انجام کار",
        items: [
          "۱) اعلام پلاک و ثبت درخواست استعلام",
          "۲) اعلام مبلغ و تأیید متقاضی برای پرداخت (در صورت تمایل)",
          "۳) چاپ رسید/گزارش و تحویل به متقاضی"
        ]
      }
    ],

    // نکات مهم (الگوی پروژه شما)
    notDone: [
      "بدون شماره پلاک، استعلام انجام نمی‌شود.",
      "رسید چاپی ارائه می‌شود."
    ],

    faqEnabled: false
  };

  window.SERVICE_DATA.khalafi = khalafi;
  window.SERVICES.khalafi = khalafi;
})();
