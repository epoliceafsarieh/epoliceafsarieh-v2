// wizard.js
document.addEventListener('DOMContentLoaded', function () {
  const questions = [
    { question: "نام شما چیست؟", key: "firstName" },
    { question: "نام خانوادگی شما چیست؟", key: "lastName" },
    { question: "قد شما چقدر است؟", key: "height" },
    // افزودن سوالات دیگر
  ];

  let currentStep = 0;
  const answers = {};

  function showNextQuestion() {
    if (currentStep < questions.length) {
      const question = questions[currentStep];
      const questionElement = document.getElementById("question");
      questionElement.innerText = question.question;

      // مخفی کردن دکمه بعدی تا کاربر جواب دهد
      document.getElementById("nextButton").disabled = false;
    } else {
      // پایان فرآیند و ارسال به PDF یا هر چیز دیگر
      alert("تمام شد!");
    }
  }

  // ذخیره پاسخ‌ها و نمایش سوال بعدی
  document.getElementById("nextButton").addEventListener("click", function () {
    const userAnswer = document.getElementById("answerInput").value;
    answers[questions[currentStep].key] = userAnswer;
    currentStep++;
    showNextQuestion();
  });

  showNextQuestion();
});
