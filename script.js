// Мобильное меню
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuBtn.classList.toggle("open"); // можно добавить анимацию кнопки
  });
}

// Год в футере
const year = new Date().getFullYear();
["year", "year2", "year3"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.textContent = year;
});

const contactForms = document.querySelectorAll(".contact-form");

if (contactForms.length) {
  const locales = {
    ru: {
      subject: "Сообщение с сайта Road & Ride",
      intro: "Привет, команда Road & Ride!",
      name: "Имя",
      email: "Email",
      message: "Сообщение"
    },
    de: {
      subject: "Nachricht von Road & Ride",
      intro: "Hallo Road & Ride Team!",
      name: "Name",
      email: "Email",
      message: "Nachricht"
    },
    en: {
      subject: "Message from Road & Ride",
      intro: "Hello Road & Ride team!",
      name: "Name",
      email: "Email",
      message: "Message"
    }
  };

  contactForms.forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const nameInput = form.querySelector("[name='name']");
      const emailInput = form.querySelector("[name='email']");
      const messageInput = form.querySelector("[name='message']");

      if (!nameInput || !emailInput || !messageInput) {
        form.submit();
        return;
      }

      const langHint = form.dataset.lang || document.documentElement.lang || "en";
      const locale = locales[langHint] || locales.en;

      const subject = form.dataset.subject || locale.subject;
      const lines = [
        locale.intro,
        "",
        `${locale.name}: ${nameInput.value.trim()}`,
        `${locale.email}: ${emailInput.value.trim()}`,
        "",
        `${locale.message}:`,
        messageInput.value.trim()
      ];

      const baseAction = form.getAttribute("action") || "mailto:roadundride@gmail.com";
      const separator = baseAction.includes("?") ? "&" : "?";
      const mailtoUrl = `${baseAction}${separator}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\r\n"))}`;

      window.location.href = mailtoUrl;
      setTimeout(() => form.reset(), 200);
    });
  });
}
