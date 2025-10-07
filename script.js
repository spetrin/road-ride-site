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

const galleryGrids = document.querySelectorAll(".gallery-grid");

if (galleryGrids.length) {
  const lang = (document.documentElement.lang || "en").toLowerCase();
  const closeLabels = {
    de: "Galerie schließen",
    ru: "Закрыть галерею",
    en: "Close gallery"
  };

  galleryGrids.forEach(grid => {
    let activeTrigger = null;
    const closeLabel = grid.dataset.closeLabel || closeLabels[lang] || closeLabels.en;
    const lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", closeLabel);
    closeBtn.innerHTML = "&times;";

    const lightboxImg = document.createElement("img");
    lightboxImg.alt = "";

    lightbox.append(closeBtn, lightboxImg);
    document.body.appendChild(lightbox);

    const openLightbox = (trigger, src, alt) => {
      activeTrigger = trigger;
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.classList.add("is-open");
      closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightboxImg.src = "";
      lightboxImg.alt = "";
      if (activeTrigger) {
        activeTrigger.focus();
        activeTrigger = null;
      }
    };

    const showImage = trigger => {
      if (!trigger) return;
      const img = trigger.querySelector("img");
      const src = trigger.dataset.full || (img && img.currentSrc) || (img && img.src) || "";
      const alt = img ? img.alt : "";
      openLightbox(trigger, src, alt);
    };

    grid.addEventListener("click", event => {
      const trigger = event.target.closest(".gallery-item");
      if (!trigger) return;
      showImage(trigger);
    });

    grid.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const trigger = event.target.closest(".gallery-item");
      if (!trigger) return;
      event.preventDefault();
      showImage(trigger);
    });

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  });
}
