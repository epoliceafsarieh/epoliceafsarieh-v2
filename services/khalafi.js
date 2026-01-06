// services/khalafi.js
// services/khalafi.js
(function () {
  window.SERVICE_DATA = window.SERVICE_DATA || {};
  window.SERVICES = window.SERVICES || {};

  const khalafi = {
    barTitle: "خلافی خودرو و موتورسیکلت",
    icon: "assets/img/icons/khalafi.png",

    heroTitle: "استعلام و پرداخت خلافی",
    
    meta: {
      time: "—",
      feeKey: "khalafi",
      feeSummary: "کلیک کنید"
    },

    sections: [],
    notDone: [],
    faqEnabled: false
  };

  window.SERVICE_DATA.khalafi = khalafi;
  window.SERVICES.khalafi = khalafi;
})();

    feeRows: [
      { label: "استعلام خلافی", field: "inquiry" },
      { label: "پرداخت", field: "payment" },
      { label: "چاپ رسید", field: "print" }
    ],
    sections: [
      {
        heading: "اطلاعات لازم",
        tag: "اصلی",
        items: [
          "شماره پلاک خودرو",
          "شماره تماس برای دریافت پیامک/رسید (در صورت نیاز)"
        ]
      },
      {
        heading: "مراحل انجام کار",
        tag: "گام‌به‌گام",
        items: [
          "اعلام پلاک و درخواست استعلام",
          "اعلام مبلغ و تأیید متقاضی برای پرداخت (در صورت تمایل)",
          "چاپ رسید/گزارش و تحویل به متقاضی"
        ]
      }
    ],
    notice: [
      "بدون شماره پلاک، استعلام انجام نمی‌شود",
      "رسید چاپی ارائه می‌شود"
    ]
  };
})();

