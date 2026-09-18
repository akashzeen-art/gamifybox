const DEFAULT_LANG = "fr";

const i18n = {
  fr: {
    title: "Téléchargez ici ! Accédez à votre contenu !",
    hero: "Votre fichier est prêt à être téléchargé !",
    ready: "Votre contenu<br><strong>est prêt maintenant !</strong>",
    continue: "Continuer »",
    prompt: "Entrez votre numéro de mobile pour continuer",
    phoneLabel: "Numéro de téléphone mobile :",
    phoneError: "Veuillez entrer un numéro de téléphone valide (8–15 chiffres)",
    cta: "Obtenir mon code »",
    pinPrompt: "Entrez le code reçu par SMS",
    pinLabel: "Code de vérification :",
    pinError: "Code invalide",
    verifyCta: "Confirmer »",
    success: "Vérifié avec succès !",
    legalsShort:
      "3 premiers jours d’essai gratuit, puis abonnement selon les conditions de l’offre",
    footer:
      "Bienvenue !<br>3 premiers jours d’essai gratuit, puis abonnement selon les conditions de l’offre.<br>Vous pouvez résilier à tout moment selon les instructions indiquées.",
    terms: "Conditions générales",
    dir: "ltr",
    lang: "fr",
  },
  en: {
    title: "Download here! Access your content!",
    hero: "Your file is ready to download!",
    ready: "Your content<br><strong>is ready now!</strong>",
    continue: "Continue »",
    prompt: "Enter your mobile number to continue",
    phoneLabel: "Mobile number:",
    phoneError: "Please enter a valid phone number (8–15 digits)",
    cta: "Get my code »",
    pinPrompt: "Enter the code sent by SMS",
    pinLabel: "Verification code:",
    pinError: "Invalid code",
    verifyCta: "Confirm »",
    success: "Verified successfully!",
    legalsShort: "First 3 days free trial, then subscription per offer terms",
    footer:
      "Welcome!<br>First 3 days free trial, then subscription per offer terms.<br>You can cancel anytime as indicated in the offer instructions.",
    terms: "Terms & Conditions",
    dir: "ltr",
    lang: "en",
  },
  ar: {
    title: "حمل هنا! للوصول إلى محتواك!",
    hero: "ملفك جاهز للتنزيل!",
    ready: "محتواك<br><strong>جاهز الآن!</strong>",
    continue: "استمر »",
    prompt: "أدخل رقم هاتفك المحمول للدخول",
    phoneLabel: "رقم الهاتف المحمول:",
    phoneError: "يرجى إدخال رقم هاتف صحيح (8–15 رقم)",
    cta: "احصل على الرمز الخاص بي »",
    pinPrompt: "أدخل الرمز الذي وصلك عبر الرسالة",
    pinLabel: "رمز التحقق:",
    pinError: "الرمز غير صحيح",
    verifyCta: "تأكيد »",
    success: "تم التحقق بنجاح!",
    legalsShort: "أول 3 أيام تجربة مجانية، ثم الاشتراك وفق شروط العرض",
    footer:
      "مرحباً بك!<br>أول 3 أيام تجربة مجانية، ثم الاشتراك وفق شروط العرض.<br>يمكنك إلغاء الاشتراك في أي وقت وفق التعليمات.",
    terms: "الشروط والأحكام",
    dir: "rtl",
    lang: "ar",
  },
};

const languageSelect = document.getElementById("language-select");

function applyLanguage(code) {
  const t = i18n[code] || i18n[DEFAULT_LANG];
  document.documentElement.lang = t.lang;
  document.documentElement.dir = t.dir;
  document.title = t.title;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] != null) el.textContent = t[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (t[key] != null) el.innerHTML = t[key];
  });

  const logo = document.querySelector(".main__form-logo");
  if (logo) {
    logo.alt = t.title;
    logo.title = t.title;
  }

  if (languageSelect) {
    languageSelect.style.backgroundPosition =
      t.dir === "rtl" ? "left 8px center" : "right 8px center";
  }
}

const CTA_URL = "https://m.gamfiybox.com/click";

function digitsOnly(value) {
  return value.replace(/\D/g, "").slice(0, 15);
}

function isValidPhone(value) {
  return /^\d{8,15}$/.test(value);
}

function buildOfferUrl() {
  const url = new URL(CTA_URL);
  const params = new URLSearchParams(window.location.search);
  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
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

function resolveInitialLang() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = (params.get("lang") || params.get("aslang") || "").toLowerCase();
  if (fromQuery.startsWith("fr")) return "fr";
  if (fromQuery.startsWith("en")) return "en";
  if (fromQuery.startsWith("ar")) return "ar";

  const saved = localStorage.getItem("selectedLang");
  if (saved && i18n[saved]) return saved;

  return DEFAULT_LANG;
}

if (languageSelect) {
  const initialLang = resolveInitialLang();
  languageSelect.value = initialLang;

  languageSelect.addEventListener("change", () => {
    localStorage.setItem("selectedLang", languageSelect.value);
    applyLanguage(languageSelect.value);
  });

  applyLanguage(initialLang);
}

if (window.GAMIFY_PAGE === "landing" || document.getElementById("nextStep")) {
  initLandingPage();
}

if (window.GAMIFY_PAGE === "login" || document.getElementById("access-form")) {
  initLoginPage();
}
