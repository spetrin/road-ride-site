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
﻿const routeMapContainers = document.querySelectorAll("[data-route-map]");

const ROUTE_MAPS = {
  "saarburg-trier": {
    viewBox: { width: 960, height: 360 },
    path: "M80 280 C200 240 290 210 360 190 S520 160 620 220 S780 180 880 140",
    points: [
      { label: "Saarburg", x: 80, y: 280, textAnchor: "start", dx: 6, dy: 32 },
      { label: "Nittel", x: 360, y: 190, textAnchor: "middle", dx: 0, dy: -22 },
      { label: "Konz", x: 620, y: 220, textAnchor: "middle", dx: 0, dy: 34 },
      { label: "Trier", x: 880, y: 140, textAnchor: "end", dx: -10, dy: -24 }
    ]
  },
  "trip-mehring": {
    viewBox: { width: 960, height: 360 },
    path: "M70 290 C210 250 320 200 420 190 S590 220 720 210 S820 180 880 140",
    points: [
      { label: "Trier", x: 70, y: 290, textAnchor: "start", dx: 6, dy: 30 },
      { label: "Mehringer Höhe", x: 420, y: 190, textAnchor: "middle", dx: 0, dy: -24 },
      { label: "Piesport", x: 620, y: 210, textAnchor: "middle", dx: 0, dy: 32 },
      { label: "Mehring", x: 880, y: 140, textAnchor: "end", dx: -8, dy: -26 }
    ]
  },
  "trip-vulkansee": {
    viewBox: { width: 960, height: 360 },
    path: "M60 300 C170 260 260 200 340 180 S470 150 560 190 S680 250 820 210 S900 160 930 110",
    points: [
      { label: "Trier", x: 60, y: 300, textAnchor: "start", dx: 6, dy: 30 },
      { label: "Saarburg", x: 260, y: 210, textAnchor: "middle", dx: 0, dy: -26 },
      { label: "Daun", x: 560, y: 190, textAnchor: "middle", dx: 0, dy: -26 },
      { label: "Camp am Maar", x: 930, y: 110, textAnchor: "end", dx: -8, dy: -24 }
    ]
  },
  "trip-mosel": {
    viewBox: { width: 960, height: 360 },
    path: "M50 300 C150 260 230 210 310 205 S420 220 500 180 S580 140 650 150 S730 190 780 150 S840 110 910 130",
    points: [
      { label: "Trier", x: 50, y: 300, textAnchor: "start", dx: 6, dy: 28 },
      { label: "Mainz", x: 320, y: 205, textAnchor: "middle", dx: 0, dy: -26 },
      { label: "Heidelberg", x: 500, y: 180, textAnchor: "middle", dx: 0, dy: -26 },
      { label: "Ulm", x: 650, y: 150, textAnchor: "middle", dx: 0, dy: -24 },
      { label: "Füssen", x: 780, y: 150, textAnchor: "middle", dx: 0, dy: 32 },
      { label: "Zell am See", x: 880, y: 130, textAnchor: "middle", dx: 0, dy: -24 },
      { label: "Großglockner", x: 910, y: 130, textAnchor: "end", dx: -8, dy: 32 }
    ]
  }
};

if (routeMapContainers.length) {
  const SVG_NS = "http://www.w3.org/2000/svg";

  routeMapContainers.forEach(container => {
    const routeId = container.dataset.routeMap;
    const config = ROUTE_MAPS[routeId] || ROUTE_MAPS["saarburg-trier"];
    if (!config) return;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${config.viewBox.width} ${config.viewBox.height}`);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    container.appendChild(svg);

    if (config.path) {
      const mainPath = document.createElementNS(SVG_NS, "path");
      mainPath.setAttribute("d", config.path);
      mainPath.classList.add("route-line");
      svg.appendChild(mainPath);
    }

    (config.points || []).forEach(point => {
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.classList.add("route-point");
      circle.setAttribute("cx", point.x);
      circle.setAttribute("cy", point.y);
      circle.setAttribute("r", 11);
      svg.appendChild(circle);

      const label = document.createElementNS(SVG_NS, "text");
      label.classList.add("route-label");
      label.setAttribute("x", point.x + (point.dx || 0));
      label.setAttribute("y", point.y + (point.dy || -24));
      label.setAttribute("text-anchor", point.textAnchor || "middle");
      label.setAttribute("aria-hidden", "true");
      label.textContent = point.label;
      svg.appendChild(label);
    });
  });
}

    
const routePreviewBlocks = document.querySelectorAll("[data-route-preview]");

if (routePreviewBlocks.length && "localStorage" in window) {
  routePreviewBlocks.forEach(block => {
    const storageKey = block.dataset.routePreview;
    if (!storageKey) return;

    let raw = null;
    try {
      raw = localStorage.getItem(storageKey);
    } catch (error) {
      raw = null;
    }
    if (!raw) return;

    let payload = null;
    try {
      payload = JSON.parse(raw);
    } catch (error) {
      payload = null;
    }
    if (!payload || !payload.preview) return;

    const img = block.querySelector("[data-route-preview-image]");
    if (img) {
      img.src = payload.preview;
    }

    const descEl = block.querySelector("[data-route-preview-description]");
    if (descEl) {
      descEl.textContent = payload.description || "";
    }

    const metaEl = block.querySelector("[data-route-preview-meta]");
    if (metaEl) {
      metaEl.textContent = payload.savedAt
        ? new Intl.DateTimeFormat("ru", { dateStyle: "medium", timeStyle: "short" }).format(
            new Date(payload.savedAt)
          )
        : "";
    }

    block.hidden = false;
  });
}


