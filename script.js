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

const MINI_ROUTE_DATA = {
  "saarburg-trier": {
    viewBox: { width: 960, height: 360 },
    basePath: "M80 280 C200 240 290 210 360 190 S520 160 620 220 S780 180 880 140",
    segments: [
      { id: "saarburg-nittel", d: "M80 280 C200 240 290 210 360 190" },
      { id: "nittel-konz", d: "M360 190 C460 150 530 190 620 220" },
      { id: "konz-trier", d: "M620 220 C720 270 800 170 880 140" }
    ],
    points: [
      { id: "saarburg", x: 80, y: 280, r: 13, textAnchor: "start", labelDx: 6, labelDy: 34, label: { ru: "Saarburg", de: "Saarburg", en: "Saarburg" } },
      { id: "nittel", x: 360, y: 190, r: 12, textAnchor: "middle", labelDx: 0, labelDy: -24, label: { ru: "Nittel", de: "Nittel", en: "Nittel" } },
      { id: "konz", x: 620, y: 220, r: 12, textAnchor: "middle", labelDx: 0, labelDy: 34, label: { ru: "Konz", de: "Konz", en: "Konz" } },
      { id: "trier", x: 880, y: 140, r: 13, textAnchor: "end", labelDx: -10, labelDy: -24, label: { ru: "Trier", de: "Trier", en: "Trier" } }
    ]
  },
  "trip-mehring": {
    viewBox: { width: 960, height: 360 },
    basePath: "M70 290 C210 250 320 200 420 190 S590 220 720 210 S820 180 880 140",
    segments: [
      { id: "trier-mehringerhoehe", d: "M70 290 C210 250 320 200 420 190" },
      { id: "mehringerhoehe-piesport", d: "M420 190 C500 190 620 210 720 210" },
      { id: "piesport-mehring", d: "M720 210 C790 200 840 180 880 140" }
    ],
    points: [
      { id: "trier", x: 70, y: 290, r: 12, textAnchor: "start", labelDx: 6, labelDy: 30, label: { ru: "Trier", de: "Trier", en: "Trier" } },
      { id: "mehringerhoehe", x: 420, y: 190, r: 12, textAnchor: "middle", labelDx: 0, labelDy: -26, label: { ru: "Mehringer H?he", de: "Mehringer H?he", en: "Mehringer H?he" } },
      { id: "piesport", x: 620, y: 210, r: 12, textAnchor: "middle", labelDx: 0, labelDy: 34, label: { ru: "Piesport", de: "Piesport", en: "Piesport" } },
      { id: "mehring", x: 880, y: 140, r: 13, textAnchor: "end", labelDx: -8, labelDy: -28, label: { ru: "Mehring", de: "Mehring", en: "Mehring" } }
    ]
  },
  "trip-vulkansee": {
    viewBox: { width: 960, height: 360 },
    basePath: "M60 300 C170 260 260 200 340 180 S470 150 560 190 S680 250 820 210 S900 160 930 110",
    segments: [
      { id: "trier-saarburg", d: "M60 300 C170 260 260 200 340 180" },
      { id: "saarburg-daun", d: "M340 180 C430 160 520 170 560 190" },
      { id: "daun-camp", d: "M560 190 C640 220 760 230 820 210" },
      { id: "camp-loop", d: "M820 210 C870 190 900 160 930 110" }
    ],
    points: [
      { id: "trier", x: 60, y: 300, r: 12, textAnchor: "start", labelDx: 6, labelDy: 30, label: { ru: "Trier", de: "Trier", en: "Trier" } },
      { id: "saarburg", x: 260, y: 210, r: 12, textAnchor: "middle", labelDx: 0, labelDy: -28, label: { ru: "Saarburg", de: "Saarburg", en: "Saarburg" } },
      { id: "daun", x: 560, y: 190, r: 12, textAnchor: "middle", labelDx: 0, labelDy: -28, label: { ru: "Daun", de: "Daun", en: "Daun" } },
      { id: "camp", x: 930, y: 110, r: 13, textAnchor: "end", labelDx: -8, labelDy: -26, label: { ru: "Camp am Maar", de: "Camp am Maar", en: "Camp am Maar" } }
    ]
  },
  "trip-mosel": {
    viewBox: { width: 960, height: 360 },
    basePath: "M50 300 C150 260 230 210 310 205 S420 220 500 180 S580 140 650 150 S730 190 780 150 S840 110 910 130",
    segments: [
      { id: "trier-mainz", d: "M50 300 C150 260 230 210 310 205" },
      { id: "mainz-heidelberg", d: "M310 205 C380 210 450 210 500 180" },
      { id: "heidelberg-ulm", d: "M500 180 C550 150 600 140 650 150" },
      { id: "ulm-fussen", d: "M650 150 C700 170 740 190 780 150" },
      { id: "fussen-zell", d: "M780 150 C810 130 840 120 880 130" },
      { id: "zell-glockner", d: "M880 130 C900 125 910 125 910 130" }
    ],
    points: [
      { id: "trier", x: 50, y: 300, r: 12, textAnchor: "start", labelDx: 6, labelDy: 28, label: { ru: "Trier", de: "Trier", en: "Trier" } },
      { id: "mainz", x: 320, y: 205, r: 12, textAnchor: "middle", labelDx: 0, labelDy: -28, label: { ru: "Mainz", de: "Mainz", en: "Mainz" } },
      { id: "heidelberg", x: 500, y: 180, r: 12, textAnchor: "middle", labelDx: 0, labelDy: -28, label: { ru: "Heidelberg", de: "Heidelberg", en: "Heidelberg" } },
      { id: "ulm", x: 650, y: 150, r: 12, textAnchor: "middle", labelDx: 0, labelDy: -26, label: { ru: "Ulm", de: "Ulm", en: "Ulm" } },
      { id: "fussen", x: 780, y: 150, r: 12, textAnchor: "middle", labelDx: 0, labelDy: 34, label: { ru: "F?ssen", de: "F?ssen", en: "F?ssen" } },
      { id: "zell", x: 880, y: 130, r: 12, textAnchor: "middle", labelDx: 0, labelDy: -24, label: { ru: "Zell am See", de: "Zell am See", en: "Zell am See" } },
      { id: "grossglockner", x: 910, y: 130, r: 13, textAnchor: "end", labelDx: -6, labelDy: 32, label: { ru: "Gro?glock???", de: "Gro?glockner", en: "Gro?glockner" } }
    ]
  }
};

const MINI_ROUTE_COPY = {
  "saarburg-trier": {
    en: {
      segments: {
        "saarburg-nittel": ["Stage 1 - Saarburg -> Nittel", "River flats, vineyard breeze, friendly cadence."],
        "nittel-konz": ["Stage 2 - Nittel -> Konz", "Rolling bends, compact climbs and the Saar meeting the Moselle."],
        "konz-trier": ["Stage 3 - Konz -> Trier", "Short punchy hills, ridge views and the glide to Porta Nigra."]
      },
      points: {
        saarburg: ["Saarburg - roll-out", "Wander past the waterfall, then drop onto the riverside lane."],
        nittel: ["Nittel", "Steady riverbank, perfect for finding your rhythm."],
        konz: ["Konz", "Saar meets Moselle - ideal coffee stop before the hills."],
        trier: ["Trier", "Finish at Porta Nigra and dive into the old town."]
      }
    },
    ru: {
      segments: {
        "saarburg-nittel": ["??????? 1 - Saarburg -> Nittel", "?????? ??????? ????? ?????, ???? ?? ??? ???????."],
        "nittel-konz": ["??????? 2 - Nittel -> Konz", "??????????, ???????? ??????? ? ????? ? ??????? ???."],
        "konz-trier": ["??????? 3 - Konz -> Trier", "???????? ???????, ???????? ? ????? ? Porta Nigra."]
      },
      points: {
        saarburg: ["Saarburg - ?????", "??????? ? ???????? ?????? ?????????? ????? ???????."],
        nittel: ["Nittel", "?????? ???? ????? ????, ????? ??????? ??????."],
        konz: ["Konz", "??????? ????? ? ??????, ??????? ???? ????? ???????."],
        trier: ["Trier", "????? ? Porta Nigra ? ???????? ?? ??????? ??????."]
      }
    },
    de: {
      segments: {
        "saarburg-nittel": ["Abschnitt 1 - Saarburg -> Nittel", "Flacher Saar-Flow, Weinberge links und rechts."],
        "nittel-konz": ["Abschnitt 2 - Nittel -> Konz", "Kompakte Anstiege, Kurven und das Saar-Mosel-Treffen."],
        "konz-trier": ["Abschnitt 3 - Konz -> Trier", "Kurze Puncher, Kammblicke und das Einrollen zur Porta Nigra."]
      },
      points: {
        saarburg: ["Saarburg - Start", "Wasserfall, Burgblick und dann ab auf den Tacho."],
        nittel: ["Nittel", "Ruhiger Saarabschnitt zum Einpendeln des Takts."],
        konz: ["Konz", "Hier treffen Saar und Mosel - perfekter Stop vor den H?geln."],
        trier: ["Trier", "Ziel an der Porta Nigra, weiter in die Altstadt."]
      }
    }
  },
  "trip-mehring": {
    en: {
      segments: {
        "trier-mehringerhoehe": ["Stage 1 - Trier -> Mehringer H?he", "Warm-up over R?merbr?cke and climb to the first lookout."],
        "mehringerhoehe-piesport": ["Stage 2 - Mehringer H?he -> Piesport", "Flowing ridge line and vineyard sweepers."],
        "piesport-mehring": ["Stage 3 - Piesport -> Mehring", "Drop back to the river and roll into Huxlay-H?tte."]
      },
      points: {
        trier: ["Trier", "Meet at Porta Nigra and cross the bridge."],
        mehringerhoehe: ["Mehringer H?he", "Sunset lookout over the Mosel bend."],
        piesport: ["Piesport", "Vineyard terraces and gentle bends."],
        mehring: ["Mehring", "Arrive for dinner at Huxlay-H?tte."]
      }
    },
    ru: {
      segments: {
        "trier-mehringerhoehe": ["???? 1 - Trier -> Mehringer H?he", "????? ????? R?merbr?cke ? ??????? ?????? ? ?????????."],
        "mehringerhoehe-piesport": ["???? 2 - Mehringer H?he -> Piesport", "??????? ??? ?????? ? ???????? ?????????."],
        "piesport-mehring": ["???? 3 - Piesport -> Mehring", "????? ? ???? ? ????? ? ?????? ??????."]
      },
      points: {
        trier: ["Trier", "???? ? Porta Nigra, ???????? ???????."],
        mehringerhoehe: ["Mehringer H?he", "???????? ????? ??????."],
        piesport: ["Piesport", "??????????? ??????? ? ?????? ????."],
        mehring: ["Mehring", "????? ? ???? ? Huxlay-H?tte."]
      }
    },
    de: {
      segments: {
        "trier-mehringerhoehe": ["Etappe 1 - Trier -> Mehringer H?he", "?ber die R?merbr?cke warmfahren und zur Aussicht."],
        "mehringerhoehe-piesport": ["Etappe 2 - Mehringer H?he -> Piesport", "Weinberge, Abendlicht und flie?ende Kurven."],
        "piesport-mehring": ["Etappe 3 - Piesport -> Mehring", "Zur?ck ins Tal und Einkehr in der Huxlay-H?tte."]
      },
      points: {
        trier: ["Trier", "Treffpunkt Porta Nigra, los geht's."],
        mehringerhoehe: ["Mehringer H?he", "Aussicht ?ber die Moselschleife."],
        piesport: ["Piesport", "Terrassen, Reben, Moselblick."],
        mehring: ["Mehring", "Abendessen und Ausklang."]
      }
    }
  },
  "trip-vulkansee": {
    en: {
      segments: {
        "trier-saarburg": ["Stage 1 - Trier -> Saarburg", "Early start, Saar river bends and a waterfall coffee."],
        "saarburg-daun": ["Stage 2 - Saarburg -> Daun", "Climb into the Eifel, forests and ridges."],
        "daun-camp": ["Stage 3 - Daun -> Camp am Maar", "Loop the maars, rolling lines and viewpoints."],
        "camp-loop": ["Stage 4 - Camp am Maar", "Settle at the lake, explore the evening loop."]
      },
      points: {
        trier: ["Trier", "Departure at R?merbr?cke."],
        saarburg: ["Saarburg", "Waterfall stop before the hills."],
        daun: ["Daun", "Supplies before the maar circuit."],
        camp: ["Camp am Maar", "Basecamp right at the water."]
      }
    },
    ru: {
      segments: {
        "trier-saarburg": ["???? 1 - Trier -> Saarburg", "?????? ?????, ???? ???? ? ???? ? ????????."],
        "saarburg-daun": ["???? 2 - Saarburg -> Daun", "??????????? ? ??????, ???? ? ??????."],
        "daun-camp": ["???? 3 - Daun -> Camp am Maar", "?????? ?????? ????, ????? ???????? ? ?????."],
        "camp-loop": ["???? 4 - Camp am Maar", "??????????? ? ?????? ? ???????? ????."]
      },
      points: {
        trier: ["Trier", "????? ?? R?merbr?cke ?? ????????."],
        saarburg: ["Saarburg", "???? ? ???????? ? ?????."],
        daun: ["Daun", "?????? ? ???????? ?????."],
        camp: ["Camp am Maar", "?????? ? ????, ?????? ? ??????."]
      }
    },
    de: {
      segments: {
        "trier-saarburg": ["Etappe 1 - Trier -> Saarburg", "Fr?her Start, Saar-Kurven und Wasserfall-Kaffee."],
        "saarburg-daun": ["Etappe 2 - Saarburg -> Daun", "Eifel-Anstieg, W?lder und K?mme."],
        "daun-camp": ["Etappe 3 - Daun -> Camp am Maar", "Maare umrunden, flie?ende H?henlinien."],
        "camp-loop": ["Etappe 4 - Camp am Maar", "Zelte auf, Abendloop am See."]
      },
      points: {
        trier: ["Trier", "Start an der R?merbr?cke."],
        saarburg: ["Saarburg", "Stopp am Wasserfall."],
        daun: ["Daun", "Versorgung vor der Maar-Runde."],
        camp: ["Camp am Maar", "Basecamp direkt am Wasser."]
      }
    }
  },
  "trip-mosel": {
    en: {
      segments: {
        "trier-mainz": ["Day 1 - Trier -> Mainz", "Mosel bends, Bernkastel to Traben, evening at the Rhine."],
        "mainz-heidelberg": ["Day 2 - Mainz -> Heidelberg", "Loreley cliffs and castle-lined river roads."],
        "heidelberg-ulm": ["Day 3 - Heidelberg -> Schw?bisch Hall -> Ulm", "Timbered towns and rolling hills."],
        "ulm-fussen": ["Day 4 - Ulm -> F?ssen", "Pre-Alps, lakes and castle silhouettes."],
        "fussen-zell": ["Day 5 - F?ssen -> Zell am See", "Through Reutte, Innsbruck and into Austria."],
        "zell-glockner": ["Day 6/7 - Zell am See -> Gro?glockner", "Climb the Hochalpenstra?e and descend to Heiligenblut."]
      },
      points: {
        trier: ["Trier", "Kick-off at Porta Nigra."],
        mainz: ["Mainz", "Rhine promenade and local wine."],
        heidelberg: ["Heidelberg", "Castle view above the Neckar."],
        ulm: ["Ulm", "Munster spire and Danube evening."],
        fussen: ["F?ssen", "Fairytale castles in sight."],
        zell: ["Zell am See", "Lake basecamp before the climb."],
        grossglockner: ["Gro?glockner", "High alpine finale, glaciers and panoramas."]
      }
    },
    ru: {
      segments: {
        "trier-mainz": ["???? 1 - Trier -> Mainz", "??????, Bernkastel-Kues ? ????? ?? ?????????? ?????."],
        "mainz-heidelberg": ["???? 2 - Mainz -> Heidelberg", "???????, ????? ? ????????? ????? ?????."],
        "heidelberg-ulm": ["???? 3 - Heidelberg -> Schw?bisch Hall -> Ulm", "???????, ???????? ??????, ?????? ??????."],
        "ulm-fussen": ["???? 4 - Ulm -> F?ssen", "????????? ? ??????? ???????."],
        "fussen-zell": ["???? 5 - F?ssen -> Zell am See", "????? Reutte ? Innsbruck ? ???????."],
        "zell-glockner": ["???? 6/7 - Zell am See -> Gro?glockner", "?????? ?? Hoch??penstra?e ? ????? ? Heiligenblut."]
      },
      points: {
        trier: ["Trier", "????? ? Porta Nigra."],
        mainz: ["Mainz", "????? ?? ?????."],
        heidelberg: ["Heidelberg", "????? ??? ???????."],
        ulm: ["Ulm", "???? ? ???????? ?? ?????."],
        fussen: ["F?ssen", "??? ?? ????????????."],
        zell: ["Zell am See", "???? ????? ????????."],
        grossglockner: ["Gro?glockner", "???????????? ???????? ? ??????."]
      }
    },
    de: {
      segments: {
        "trier-mainz": ["Tag 1 - Trier -> Mainz", "Moselkurven, Bernkastel bis Traben, Abend am Rhein."],
        "mainz-heidelberg": ["Tag 2 - Mainz -> Heidelberg", "Loreley-Felsen und Burgenstra?en."],
        "heidelberg-ulm": ["Tag 3 - Heidelberg -> Schw?bisch Hall -> Ulm", "Fachwerk, H?gel, gutes Essen."],
        "ulm-fussen": ["Tag 4 - Ulm -> F?ssen", "Voralpen, Seen, K?nigsschl?sser."],
        "fussen-zell": ["Tag 5 - F?ssen -> Zell am See", "?ber Reutte und Innsbruck nach ?sterreich."],
        "zell-glockner": ["Tag 6/7 - Zell am See -> Gro?glockner", "Hochalpenstra?e erklimmen und nach Heiligenblut rollen."]
      },
      points: {
        trier: ["Trier", "Kick-off an der Porta Nigra."],
        mainz: ["Mainz", "Abend am Rhein."],
        heidelberg: ["Heidelberg", "Schlossblick ?ber dem Neckar."],
        ulm: ["Ulm", "M?nster, Donau, After-Ride."],
        fussen: ["F?ssen", "K?nigsschl?sser im Blick."],
        zell: ["Zell am See", "Basislager am Wasser."],
        grossglockner: ["Gro?glockner", "Hochalpine Kr?nung mit Gletscherblick."]
      }
    }
  }
};

const ROUTE_STORAGE_PREFIX = "roadandrideRoute:";

const ROUTE_PREVIEW_COPY = {
  ru: {
    title: "Ваш вариант маршрута",
    saved: "Сохранено",
    alt: "Сохранённый вариант маршрута",
    note: "Черновик хранится только на этом устройстве."
  },
  de: {
    title: "Deine gespeicherte Route",
    saved: "Gespeichert am",
    alt: "Gespeicherte Route",
    note: "Der Entwurf bleibt lokal auf diesem Gerät."
  },
  en: {
    title: "Your saved route",
    saved: "Saved on",
    alt: "Saved route preview",
    note: "Draft is stored locally on this device."
  }
};

function injectCustomRoutePreview(container, routeId) {
  if (!("localStorage" in window)) return;
  let storedRaw = null;
  try {
    storedRaw = window.localStorage.getItem(`${ROUTE_STORAGE_PREFIX}${routeId}`);
  } catch (error) {
    return;
  }
  if (!storedRaw) return;
  let stored;
  try {
    stored = JSON.parse(storedRaw);
  } catch (error) {
    return;
  }
  if (!stored || !stored.preview) return;

  const previewTarget = container.closest(".trip-route")?.querySelector("[data-route-preview]");
  if (!previewTarget) return;

  const lang = (container.dataset.lang || document.documentElement.lang || "en").toLowerCase();
  const copy = ROUTE_PREVIEW_COPY[lang] || ROUTE_PREVIEW_COPY.en;
  const date = stored.savedAt ? new Date(stored.savedAt) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "short" }).format(date)
      : "";

  const descriptionHtml = stored.description ? `<p class="trip-route-preview__meta">${stored.description.replace(/\n+/g, "<br>")}</p>` : "";

previewTarget.innerHTML = `
    <div class="trip-route-preview__header">
      <strong>${copy.title}</strong>
      ${formattedDate ? `<span class="trip-route-preview__meta">${copy.saved} ${formattedDate}</span>` : ""}
    </div>
    <img class="trip-route-preview__image" src="${stored.preview}" alt="${copy.alt}">
    ${descriptionHtml}
    <span class="trip-route-preview__meta">${copy.note}</span>
  `;
  previewTarget.classList.add("is-visible");;
}

if (routeMapContainers.length) {
  const SVG_NS = "http://www.w3.org/2000/svg";

  routeMapContainers.forEach(container => {
    const routeId = container.dataset.routeMap;
    const config = MINI_ROUTE_DATA[routeId];
    if (!config) return;

    const lang = (container.dataset.lang || document.documentElement.lang || "en").toLowerCase();
    const copyGroup = MINI_ROUTE_COPY[routeId] || {};
    const langPack = copyGroup[lang] || copyGroup.en || { segments: {}, points: {} };
    const fallbackPack = copyGroup.en || { segments: {}, points: {} };

    container.classList.add("route-map--ready");

    const viewBox = config.viewBox || { width: 960, height: 360 };
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${viewBox.width} ${viewBox.height}`);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    container.appendChild(svg);

    if (config.basePath) {
      const basePath = document.createElementNS(SVG_NS, "path");
      basePath.setAttribute("d", config.basePath);
      basePath.classList.add("route-line");
      svg.appendChild(basePath);
    }

    const tooltip = document.createElement("div");
    tooltip.className = "route-tooltip";
    tooltip.setAttribute("role", "status");
    container.appendChild(tooltip);

    let activeShape = null;

    function getLines(collection, id) {
      const pack = collection === "segments" ? langPack.segments : langPack.points;
      const fallback = collection === "segments" ? fallbackPack.segments : fallbackPack.points;
      const candidate = pack && pack[id];
      const fallbackCandidate = fallback && fallback[id];
      return candidate || fallbackCandidate || [];
    }

    function placeTooltip(clientX, clientY, element) {
      const bounds = container.getBoundingClientRect();
      let posX;
      let posY;

      if (typeof clientX === "number" && typeof clientY === "number") {
        posX = clientX - bounds.left;
        posY = clientY - bounds.top;
      } else {
        const targetBounds = element.getBoundingClientRect();
        posX = targetBounds.left + targetBounds.width / 2 - bounds.left;
        posY = targetBounds.top + targetBounds.height / 2 - bounds.top;
      }

      const clampedX = Math.max(18, Math.min(bounds.width - 18, posX));
      const clampedY = Math.max(28, Math.min(bounds.height - 18, posY - 28));

      tooltip.style.left = `${clampedX}px`;
      tooltip.style.top = `${clampedY}px`;
    }

    function showTooltip(element, lines, clientX, clientY) {
      if (!lines.length) return;
      if (activeShape && activeShape !== element) {
        activeShape.classList.remove("is-active");
      }
      activeShape = element;
      element.classList.add("is-active");
      tooltip.innerHTML = lines.join("<br>");
      tooltip.classList.add("is-visible");
      placeTooltip(clientX, clientY, element);
    }

    function hideTooltip() {
      if (activeShape) {
        activeShape.classList.remove("is-active");
      }
      activeShape = null;
      tooltip.classList.remove("is-visible");
      tooltip.innerHTML = "";
    }

    function setupInteractiveShape(element, lines) {
      if (!lines.length) return;
      element.setAttribute("tabindex", "0");
      element.setAttribute("role", "button");
      element.setAttribute("aria-label", lines[0]);

      element.addEventListener("pointerenter", event => {
        showTooltip(element, lines, event.clientX, event.clientY);
      });

      element.addEventListener("pointermove", event => {
        if (activeShape === element) {
          placeTooltip(event.clientX, event.clientY, element);
        }
      });

      element.addEventListener("pointerleave", hideTooltip);
      element.addEventListener("focus", () => {
        showTooltip(element, lines);
      });
      element.addEventListener("blur", hideTooltip);

      element.addEventListener("click", event => {
        event.preventDefault();
        showTooltip(element, lines, event.clientX, event.clientY);
      });

      element.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showTooltip(element, lines);
        }
        if (event.key === "Escape") {
          hideTooltip();
        }
      });
    }

    (config.segments || []).forEach(segment => {
      const pathElement = document.createElementNS(SVG_NS, "path");
      pathElement.setAttribute("d", segment.d);
      pathElement.classList.add("route-segment");
      svg.appendChild(pathElement);
      const lines = getLines("segments", segment.id);
      setupInteractiveShape(pathElement, lines);
    });

    (config.points || []).forEach(point => {
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.classList.add("route-point");
      circle.setAttribute("cx", point.x);
      circle.setAttribute("cy", point.y);
      circle.setAttribute("r", point.r || 12);
      svg.appendChild(circle);

      const label = document.createElementNS(SVG_NS, "text");
      label.classList.add("route-label");
      label.setAttribute("x", point.x + (point.labelDx || 0));
      label.setAttribute("y", point.y + (point.labelDy || -24));
      label.setAttribute("text-anchor", point.textAnchor || "middle");
      label.setAttribute("aria-hidden", "true");
      const labelText = point.label ? (point.label[lang] || point.label.en || "") : "";
      label.textContent = labelText;
      svg.appendChild(label);

      const lines = getLines("points", point.id);
      setupInteractiveShape(circle, lines);
    });

    container.addEventListener("pointerleave", hideTooltip);
    container.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        hideTooltip();
      }
    });

    injectCustomRoutePreview(container, routeId);
  });
}
