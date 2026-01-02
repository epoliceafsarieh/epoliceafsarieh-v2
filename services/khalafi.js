// services/khalafi.js
(function () {
  window.SERVICE_DATA = window.SERVICE_DATA || {};

  window.SERVICE_DATA.khalafi = {
    title: "خلافی خودرو",
    subtitle: "استعلام، پرداخت و چاپ رسید خلافی در دفتر",
    meta: {
      time: "همان‌روز / در لحظه",
      feeKey: "khalafi",
      feeSummary: "مطابق تعرفه رسمی (مشاهده جزئیات)"
    },
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

