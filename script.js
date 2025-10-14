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
    de: "Galerie schliessen",
    ru: "Закрыть галерею",
    en: "Close gallery"
  };
  const prevLabels = {
    de: "Vorheriges Foto",
    ru: "Предыдущее фото",
    en: "Previous photo"
  };
  const nextLabels = {
    de: "Naechstes Foto",
    ru: "Следующее фото",
    en: "Next photo"
  };
  const openLabels = {
    de: "Galerieansicht oeffnen",
    ru: "Открыть галерею",
    en: "Open gallery"
  };

  galleryGrids.forEach(grid => {
    const items = Array.from(grid.querySelectorAll(".gallery-item"));
    if (!items.length) return;

    let currentIndex = 0;
    let activeTrigger = null;

    const closeLabel = grid.dataset.closeLabel || closeLabels[lang] || closeLabels.en;
    const prevLabel = grid.dataset.prevLabel || prevLabels[lang] || prevLabels.en;
    const nextLabel = grid.dataset.nextLabel || nextLabels[lang] || nextLabels.en;
    const openLabel = grid.dataset.openLabel || openLabels[lang] || openLabels.en;

    const featured = document.createElement("button");
    featured.type = "button";
    featured.className = "gallery-featured";
    featured.setAttribute("aria-label", openLabel);

    const featuredImg = document.createElement("img");
    featuredImg.alt = "";

    const featuredCaption = document.createElement("span");
    featuredCaption.className = "gallery-featured__caption";
    featuredCaption.hidden = true;

    featured.append(featuredImg, featuredCaption);
    grid.parentNode.insertBefore(featured, grid);

    featured.addEventListener("click", () => {
      activeTrigger = items[currentIndex];
      openLightbox(currentIndex);
    });

    const hasMultiple = items.length > 1;

    let prevBtn;
    let nextBtn;

    if (hasMultiple) {
      const controls = document.createElement("div");
      controls.className = "gallery-controls";

      prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "gallery-nav gallery-nav--prev";
      prevBtn.setAttribute("aria-label", prevLabel);
      prevBtn.innerHTML = "<span aria-hidden=\"true\">&#9664;</span>";

      nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "gallery-nav gallery-nav--next";
      nextBtn.setAttribute("aria-label", nextLabel);
      nextBtn.innerHTML = "<span aria-hidden=\"true\">&#9654;</span>";

      controls.append(prevBtn, nextBtn);
      grid.after(controls);
    }

    const lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "gallery-lightbox__close";
    closeBtn.setAttribute("aria-label", closeLabel);
    closeBtn.innerHTML = "&times;";

    const prevLightboxBtn = document.createElement("button");
    prevLightboxBtn.type = "button";
    prevLightboxBtn.className = "gallery-lightbox__nav gallery-lightbox__nav--prev";
    prevLightboxBtn.setAttribute("aria-label", prevLabel);
    prevLightboxBtn.innerHTML = "<span aria-hidden=\"true\">&#9664;</span>";

    const nextLightboxBtn = document.createElement("button");
    nextLightboxBtn.type = "button";
    nextLightboxBtn.className = "gallery-lightbox__nav gallery-lightbox__nav--next";
    nextLightboxBtn.setAttribute("aria-label", nextLabel);
    nextLightboxBtn.innerHTML = "<span aria-hidden=\"true\">&#9654;</span>";

    const lightboxImg = document.createElement("img");
    lightboxImg.alt = "";

    if (!hasMultiple) {
      prevLightboxBtn.hidden = true;
      nextLightboxBtn.hidden = true;
    }

    lightbox.append(closeBtn, prevLightboxBtn, lightboxImg, nextLightboxBtn);
    document.body.appendChild(lightbox);

    items.forEach((item, index) => {
      item.dataset.galleryIndex = index;
    });

    function getImageData() {
      const item = items[currentIndex];
      const img = item ? item.querySelector("img") : null;
      const src = item ? item.dataset.full || (img && img.currentSrc) || (img && img.src) || "" : "";
      const alt = img ? img.alt : "";
      return { src, alt };
    }

    function updateFeatured() {
      const data = getImageData();
      featuredImg.src = data.src;
      featuredImg.alt = data.alt;
      if (data.alt) {
        featuredCaption.textContent = data.alt;
        featuredCaption.hidden = false;
      } else {
        featuredCaption.textContent = "";
        featuredCaption.hidden = true;
      }
      const label = data.alt ? `${openLabel}: ${data.alt}` : openLabel;
      featured.setAttribute("aria-label", label);
    }

    function setActive(index) {
      const safeIndex = (index + items.length) % items.length;
      if (items[currentIndex]) {
        items[currentIndex].classList.remove("is-active");
      }
      currentIndex = safeIndex;
      items[currentIndex].classList.add("is-active");
      activeTrigger = items[currentIndex];
      updateFeatured();
    }

    function ensureVisible() {
      const activeItem = items[currentIndex];
      if (activeItem && activeItem.scrollIntoView) {
        activeItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }

    function refreshLightboxImage() {
      const data = getImageData();
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
    }

    function stepImage(delta) {
      if (!hasMultiple) return;
      setActive(currentIndex + delta);
      if (!lightbox.classList.contains("is-open")) {
        ensureVisible();
      } else {
        refreshLightboxImage();
      }
    }

    function openLightbox(index) {
      const targetIndex = typeof index === "number" ? index : currentIndex;
      setActive(targetIndex);
      refreshLightboxImage();
      lightbox.classList.add("is-open");
      closeBtn.focus();
      document.addEventListener("keydown", handleDocumentKeydown);
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightboxImg.src = "";
      lightboxImg.alt = "";
      document.removeEventListener("keydown", handleDocumentKeydown);
      if (activeTrigger) {
        activeTrigger.focus();
      }
      activeTrigger = null;
    }

    function handleDocumentKeydown(event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (!hasMultiple) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepImage(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepImage(-1);
      }
    }

    grid.addEventListener("click", event => {
      const trigger = event.target.closest(".gallery-item");
      if (!trigger) return;
      const index = items.indexOf(trigger);
      activeTrigger = trigger;
      openLightbox(index);
    });

    grid.addEventListener("keydown", event => {
      const trigger = event.target.closest(".gallery-item");
      if (!trigger) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const index = items.indexOf(trigger);
        activeTrigger = trigger;
        openLightbox(index);
      } else if (hasMultiple && event.key === "ArrowRight") {
        event.preventDefault();
        stepImage(1);
        items[currentIndex].focus();
      } else if (hasMultiple && event.key === "ArrowLeft") {
        event.preventDefault();
        stepImage(-1);
        items[currentIndex].focus();
      }
    });

    if (hasMultiple && prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        stepImage(-1);
      });

      nextBtn.addEventListener("click", () => {
        stepImage(1);
      });
    }

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });

    if (hasMultiple) {
      prevLightboxBtn.addEventListener("click", () => {
        stepImage(-1);
        prevLightboxBtn.focus();
      });

      nextLightboxBtn.addEventListener("click", () => {
        stepImage(1);
        nextLightboxBtn.focus();
      });
    }

    setActive(0);
  });
}
// Route preview blocks have been removed; no client-side handling required.


