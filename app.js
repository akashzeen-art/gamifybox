const i18n = {
  "ar-IQ": {
    hero: "ملفك جاهز للتنزيل!",
    ready: "محتواك<br><strong>جاهز الآن!</strong>",
    continue: "استمر »",
    prompt: "أدخل رقم هاتفك المحمول للدخول",
    phoneLabel: "رقم الهاتف المحمول:",
    phoneError: "يرجى إدخال رقم هاتف صحيح (10–11 رقم)",
    cta: "احصل على الرمز الخاص بي »",
    pinPrompt: "أدخل الرمز الذي وصلك عبر الرسالة",
    pinLabel: "رمز التحقق:",
    pinError: "الرمز غير صحيح",
    verifyCta: "تأكيد »",
    success: "تم التحقق بنجاح!",
    legalsShort: "أول ٣ أيام تجربة مجانية، وبعدها الاشتراك بـ ٣٠٠ دينار عراقي/اليوم",
    footer:
      'مرحباً بك في مسابقة "اعرف بلدك"!<br>أول 3 أيام تجربة مجانية ثم الاشتراك هو 300 دينار عراقي/يوم.<br>يمكنك إلغاء الاشتراك في أي وقت مجاناً عبر إرسال 0 إلى 2010.',
    terms: "الشروط والأحكام",
    dir: "rtl",
    lang: "ar-IQ",
  },
  "en-IQ": {
    hero: "Your file is ready to download!",
    ready: "Your content is<br><strong>ready now!</strong>",
    continue: "Continue »",
    prompt: "Enter your mobile number to continue",
    phoneLabel: "Mobile number:",
    phoneError: "Please enter a valid phone number (10–11 digits)",
    cta: "Get my code »",
    pinPrompt: "Enter the code sent by SMS",
    pinLabel: "Verification code:",
    pinError: "Invalid code",
    verifyCta: "Confirm »",
    success: "Verified successfully!",
    legalsShort: "First 3 days free trial, then 300 IQD/day",
    footer:
      'Welcome to the "Know Your Country" quiz!<br>First 3 days free, then 300 IQD/day.<br>Cancel anytime free by sending 0 to 2010.',
    terms: "Terms & Conditions",
    dir: "ltr",
    lang: "en-IQ",
  },
};

const languageSelect = document.getElementById("language-select");

function applyLanguage(code) {
  const t = i18n[code] || i18n["ar-IQ"];
  document.documentElement.lang = t.lang;
  document.documentElement.dir = t.dir;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] != null) el.textContent = t[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (t[key] != null) el.innerHTML = t[key];
  });

  if (languageSelect) {
    languageSelect.style.backgroundPosition =
      t.dir === "rtl" ? "left 10px center" : "right 10px center";
  }
}

const OFFER_URL =
  "http://143.198.213.74/prod/LP/landing?creatid=236&hash={click_id}&pubid={publisher_id}";

function digitsOnly(value) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function isValidPhone(value) {
  return /^\d{10,11}$/.test(value);
}

function getQueryParam(names) {
  const params = new URLSearchParams(window.location.search);
  for (const name of names) {
    const value = params.get(name);
    if (value != null && value !== "") return value;
  }
  return "";
}

function buildOfferUrl() {
  const clickId = getQueryParam([
    "click_id",
    "clickid",
    "hash",
    "cid",
  ]);
  const publisherId = getQueryParam([
    "publisher_id",
    "pubid",
    "pub_id",
    "pid",
  ]);

  return OFFER_URL.replace("{click_id}", encodeURIComponent(clickId)).replace(
    "{publisher_id}",
    encodeURIComponent(publisherId)
  );
}

function redirectToOffer() {
  window.location.href = buildOfferUrl();
}

function initLandingPage() {
  const nextBtn = document.getElementById("nextStep");
  if (!nextBtn) return;

  nextBtn.addEventListener("click", (event) => {
    event.preventDefault();
    nextBtn.classList.add("loading");
    nextBtn.disabled = true;
    redirectToOffer();
  });
}

function initLoginPage() {
  const phoneInput = document.getElementById("phone");
  const phoneError = document.getElementById("phone-error");
  const form = document.getElementById("access-form");
  const submitBtn = document.getElementById("submit-btn");

  if (!form || !phoneInput || !submitBtn) return;

  phoneInput.addEventListener("input", () => {
    phoneInput.value = digitsOnly(phoneInput.value);
    phoneError.classList.remove("show");
    phoneInput.classList.remove("is-invalid");
    submitBtn.disabled = !isValidPhone(phoneInput.value);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = phoneInput.value;

    if (!isValidPhone(phone)) {
      phoneError.classList.add("show");
      phoneInput.classList.add("is-invalid");
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    redirectToOffer();
  });
}

if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    applyLanguage(languageSelect.value);
  });
  applyLanguage(languageSelect.value || "ar-IQ");
}

if (window.GAMIFY_PAGE === "landing" || document.getElementById("nextStep")) {
  initLandingPage();
}

if (window.GAMIFY_PAGE === "login" || document.getElementById("access-form")) {
  initLoginPage();
}
