/* Shikarpur Sweet & Bakers — mobile menu, lightbox, FAQ, scrollspy, reveal */
(function () {
  "use strict";

  /* Mobile menu */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove("open");
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* Lightbox */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  var lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  var lastFocus = null;
  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (lightbox) {
    document.querySelectorAll(".gallery-tile").forEach(function (tile) {
      tile.addEventListener("click", function () {
        openLightbox(tile.getAttribute("data-full"), tile.getAttribute("data-alt"));
      });
    });
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* FAQ accordion */
  document.querySelectorAll(".acc-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = btn.parentElement.querySelector(".acc-panel");
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });

  /* Scrollspy */
  var navLinks = document.querySelectorAll(".site-nav a");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var el = document.querySelector(id);
      if (el) sections.push({ link: link, el: el });
    }
  });
  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("active"); });
          var match = sections.find(function (s) { return s.el === entry.target; });
          if (match) match.link.classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".section, .trust, .marquee, .cta-band");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
    /* Safety net: never leave content hidden if the observer stalls. */
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("visible"); });
    }, 2500);
  }
})();
