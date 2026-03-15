"use strict";

/* ----------------------------------------------------------
    CUSTOM CURSOR
---------------------------------------------------------- */
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");

let mouseX = 0,
  mouseY = 0;
let ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

// Lag the ring for smooth trailing effect
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top = ringY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Expand on hover over interactive elements
const hoverTargets = document.querySelectorAll(
  "a, button, .villa-card, .gallery-item, .metric, .concept-pillar",
);
hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("expand");
    cursorRing.classList.add("expand");
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("expand");
    cursorRing.classList.remove("expand");
  });
});

/* ----------------------------------------------------------
    NAVIGATION — scroll state
---------------------------------------------------------- */
const nav = document.getElementById("mainNav");
window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  },
  { passive: true },
);

/* ----------------------------------------------------------
    MOBILE MENU
---------------------------------------------------------- */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileOverlay = document.getElementById("mobileOverlay");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu__nav a");

function openMobileMenu() {
  burger.classList.add("is-active");
  mobileMenu.classList.add("is-open");
  mobileOverlay.classList.add("is-open");
  document.body.classList.add("menu-open");
  burger.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");
}

function closeMobileMenu() {
  burger.classList.remove("is-active");
  mobileMenu.classList.remove("is-open");
  mobileOverlay.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  burger.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
}

if (burger && mobileMenu && mobileOverlay && mobileMenuClose) {
  burger.addEventListener("click", () => {
    if (mobileMenu.classList.contains("is-open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuClose.addEventListener("click", closeMobileMenu);
  mobileOverlay.addEventListener("click", closeMobileMenu);

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      closeMobileMenu();
    }
  });
}

/* ----------------------------------------------------------
    SCROLL-TRIGGERED REVEAL ANIMATIONS
---------------------------------------------------------- */
const revealSelectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
const reveals = document.querySelectorAll(revealSelectors);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
);

reveals.forEach((el) => revealObserver.observe(el));

/* ----------------------------------------------------------
    CONCEPT IMAGE — parallax scroll trigger
---------------------------------------------------------- */
const conceptImgCol = document.getElementById("conceptImgCol");
if (conceptImgCol) {
  const imgObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) conceptImgCol.classList.add("visible");
      });
    },
    { threshold: 0.2 },
  );
  imgObs.observe(conceptImgCol);
}

/* ----------------------------------------------------------
    PARALLAX EFFECT on images
---------------------------------------------------------- */
const parallaxImgs = document.querySelectorAll(".parallax-img");

function handleParallax() {
  parallaxImgs.forEach((img) => {
    const rect = img.closest("div, section").getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    const shift = center * 0.08;
    img.style.transform = `translateY(${shift}px) scale(1.06)`;
  });
}

window.addEventListener("scroll", handleParallax, { passive: true });
handleParallax();

/* ----------------------------------------------------------
    GALLERY ITEM STAGGER on scroll
---------------------------------------------------------- */
const galleryItems = document.querySelectorAll(".gallery-item");
const galleryObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 80);
        galleryObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
galleryItems.forEach((g) => {
  g.classList.add("reveal-scale");
  galleryObserver.observe(g);
});

/* ----------------------------------------------------------
    SMOOTH COUNTER ANIMATION for stat numbers
---------------------------------------------------------- */
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = Math.floor(ease * target);
    el.innerHTML = val + "<span>" + suffix + "</span>";
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const heroStats = document.querySelectorAll(".hero-stat-num");
let statsAnimated = false;
const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      const data = [
        { val: 48, suffix: "+" },
        { val: 12, suffix: "%" },
        { val: 5, suffix: "" },
        { val: 12, suffix: "M+" },
      ];
      heroStats.forEach((el, i) => {
        setTimeout(
          () => animateCounter(el, data[i].val, data[i].suffix, 1200),
          i * 150,
        );
      });
    }
  },
  { threshold: 0.5 },
);
if (heroStats.length)
  statsObserver.observe(heroStats[0].closest(".hero-stats"));

/* ----------------------------------------------------------
    METRIC COUNTER ANIMATION
---------------------------------------------------------- */
const metricVals = document.querySelectorAll(".metric-val");
const metricData = [
  { val: 12, suffix: "%" },
  { val: 18, suffix: "%" },
  { val: 85, suffix: "%" },
  { val: 25, suffix: "yr" },
];
let metricsAnimated = false;
const metricObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !metricsAnimated) {
      metricsAnimated = true;
      metricVals.forEach((el, i) => {
        setTimeout(
          () =>
            animateCounter(el, metricData[i].val, metricData[i].suffix, 1400),
          i * 200,
        );
      });
    }
  },
  { threshold: 0.4 },
);
if (metricVals.length)
  metricObserver.observe(metricVals[0].closest(".investment-metrics"));

/* ----------------------------------------------------------
    FORM SUBMISSION HANDLER
---------------------------------------------------------- */
function handleSubmit(btn) {
  const orig = btn.textContent;
  btn.textContent = "Sending...";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "Consultation Requested ✓";
    btn.style.background = "#1D3461";
    btn.style.color = "#fff";
    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled = false;
      btn.style.background = "";
      btn.style.color = "";
    }, 4000);
  }, 1600);
}

/* ----------------------------------------------------------
    HERO VIDEO FALLBACK — show background image
---------------------------------------------------------- */
const heroVideo = document.querySelector("#hero video");
if (heroVideo) {
  heroVideo.addEventListener("error", () => {
    heroVideo.style.display = "none";
  });
}
