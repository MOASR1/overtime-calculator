const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const basicSalaryInput = document.getElementById("basicSalary");
const totalSalaryInput = document.getElementById("totalSalary");

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const errorBox = document.getElementById("error");

const results = document.getElementById("results");
const overtimeAmount = document.getElementById("overtimeAmount");
const leaveDays = document.getElementById("leaveDays");
const leaveDetails = document.getElementById("leaveDetails");

const totalOvertime = document.getElementById("totalOvertime");
const totalHourly = document.getElementById("totalHourly");
const basicHalfHourly = document.getElementById("basicHalfHourly");
const overtimeHourly = document.getElementById("overtimeHourly");

const articleBtn = document.getElementById("articleBtn");
const articleModal = document.getElementById("articleModal");
const closeModal = document.getElementById("closeModal");

function numberValue(input) {
  return Number(input.value);
}

function formatMoney(value) {
  return value.toLocaleString("ar-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatNumber(value) {
  return value.toLocaleString("ar-SA", {
    maximumFractionDigits: 2
  });
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
  results.hidden = true;
}

function hideError() {
  errorBox.hidden = true;
}

function formatLeave(totalLeaveHours) {
  const fullDays = Math.floor(totalLeaveHours / 8);
  const remainingHours = totalLeaveHours - (fullDays * 8);

  if (fullDays === 0) {
    return {
      main: `${formatNumber(totalLeaveHours)} ساعة`,
      detail: "إجازة تعويضية"
    };
  }

  if (remainingHours === 0) {
    return {
      main: `${formatNumber(fullDays)} يوم`,
      detail: `${formatNumber(totalLeaveHours)} ساعة إجازة تعويضية`
    };
  }

  return {
    main: `${formatNumber(fullDays)} يوم`,
    detail: `+ ${formatNumber(remainingHours)} ساعة — الإجمالي ${formatNumber(totalLeaveHours)} ساعة`
  };
}

function calculate() {
  hideError();

  const hours = numberValue(hoursInput);
  const minutes = numberValue(minutesInput);
  const basicSalary = numberValue(basicSalaryInput);
  const totalSalary = numberValue(totalSalaryInput);

  if (!Number.isFinite(hours) || hours < 0) {
    showError("أدخل عدد ساعات صحيحًا.");
    return;
  }

  if (!Number.isFinite(minutes) || minutes < 0 || minutes > 59) {
    showError("الدقائق يجب أن تكون بين 0 و59.");
    return;
  }

  if (!Number.isFinite(basicSalary) || basicSalary <= 0) {
    showError("أدخل الراتب الأساسي.");
    return;
  }

  if (!Number.isFinite(totalSalary) || totalSalary <= 0) {
    showError("أدخل الراتب الإجمالي.");
    return;
  }

  const overtimeHours = hours + (minutes / 60);

  if (overtimeHours <= 0) {
    showError("أدخل وقت العمل الإضافي.");
    return;
  }

  // المعادلة المحددة للتطبيق:
  // أجر ساعة الراتب الإجمالي = الإجمالي ÷ 30 ÷ 8
  // 50% من أجر ساعة الأساسي = الأساسي ÷ 2 ÷ 30 ÷ 8
  // الاستحقاق = (أجر ساعة الإجمالي + 50% من أجر ساعة الأساسي) × ساعات الإضافي

  const totalHourlyRate = totalSalary / 30 / 8;
  const basicHalfHourlyRate = basicSalary / 2 / 30 / 8;
  const overtimeHourlyRate = totalHourlyRate + basicHalfHourlyRate;
  const amount = overtimeHourlyRate * overtimeHours;

  // الإجازة التعويضية: 1.5 ساعة عن كل ساعة عمل إضافية
  const compensatoryHours = overtimeHours * 1.5;
  const leave = formatLeave(compensatoryHours);

  overtimeAmount.textContent = formatMoney(amount);
  leaveDays.textContent = leave.main;
  leaveDetails.textContent = leave.detail;

  totalOvertime.textContent = `${formatNumber(overtimeHours)} ساعة`;
  totalHourly.textContent = `${formatMoney(totalHourlyRate)} ر.س`;
  basicHalfHourly.textContent = `${formatMoney(basicHalfHourlyRate)} ر.س`;
  overtimeHourly.textContent = `${formatMoney(overtimeHourlyRate)} ر.س`;

  results.hidden = false;
}

function resetCalculator() {
  hoursInput.value = "";
  minutesInput.value = "";
  basicSalaryInput.value = "";
  totalSalaryInput.value = "";
  hideError();
  results.hidden = true;
  hoursInput.focus();
}

calculateBtn.addEventListener("click", calculate);
resetBtn.addEventListener("click", resetCalculator);

[hoursInput, minutesInput, basicSalaryInput, totalSalaryInput].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      calculate();
    }
  });
});

articleBtn.addEventListener("click", () => {
  articleModal.hidden = false;
  document.body.style.overflow = "hidden";
});

function closeArticle() {
  articleModal.hidden = true;
  document.body.style.overflow = "";
}

closeModal.addEventListener("click", closeArticle);

articleModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal-backdrop")) {
    closeArticle();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !articleModal.hidden) {
    closeArticle();
  }
});
