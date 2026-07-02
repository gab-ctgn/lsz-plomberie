/* =====================================================================
   LSZ Plomberie — interactions légères (vanilla JS, aucune dépendance)
   - Menu mobile
   - Header "collé" au scroll
   - Reveal des sections au scroll (IntersectionObserver)
   - Année du footer
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Menu mobile ---------------------------------------------------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobile-menu");

  function closeMenu() {
    if (!menu) return;
    menu.classList.add("hidden");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Ouvrir le menu");
  }

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("hidden") === false;
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    // Ferme le menu après un clic sur un lien
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---- Header collé au scroll ---------------------------------------- */
  var navShell = document.getElementById("nav-shell");
  function onScroll() {
    if (!navShell) return;
    navShell.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Reveal au scroll ---------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = el.getAttribute("data-delay");
          if (delay) el.style.setProperty("--reveal-delay", delay + "ms");
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback : tout afficher
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Comparateur avant / après (hero) ------------------------------ */
  (function initCompare() {
    var el = document.getElementById("hero-compare");
    if (!el) return;
    var clip = el.querySelector(".hero-compare__clip");
    var handle = el.querySelector(".hero-compare__handle");
    var range = el.querySelector(".hero-compare__range");
    var dragging = false;

    function setPos(p) {
      p = Math.max(0, Math.min(100, p));
      clip.style.clipPath = "inset(0 " + (100 - p) + "% 0 0)";
      handle.style.left = p + "%";
      if (range && Number(range.value) !== Math.round(p)) range.value = Math.round(p);
    }

    function fromClientX(x) {
      var rect = el.getBoundingClientRect();
      setPos(((x - rect.left) / rect.width) * 100);
    }

    // Pointer events : unifie souris + tactile + stylet
    el.addEventListener("pointerdown", function (e) {
      dragging = true;
      el.classList.add("is-dragging");
      if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
      fromClientX(e.clientX);
    });
    el.addEventListener("pointermove", function (e) {
      if (dragging) fromClientX(e.clientX);
    });
    function stop() { dragging = false; el.classList.remove("is-dragging"); }
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointercancel", stop);

    // Clavier : le range reste focusable via Tab (pointer-events:none ne bloque
    // que la souris, pas le focus clavier), les flèches déclenchent "input".
    if (range) {
      range.addEventListener("input", function () { setPos(Number(range.value)); });
    }

    setPos(50);
  })();

  /* ---- Année dans le footer ------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ====================================================================
     COUCHE PREMIUM — interactions haut de gamme
     ==================================================================== */
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ---- Barre de progression de lecture ------------------------------- */
  (function () {
    var bar = document.getElementById("scroll-progress");
    if (!bar) return;
    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var p = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = "scaleX(" + p + ")";
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
      },
      { passive: true }
    );
    update();
  })();

  /* ---- Scrollspy : lien de nav actif --------------------------------- */
  (function () {
    if (!hasIO) return;
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    if (!links.length) return;
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var id = "#" + e.target.id;
          links.forEach(function (l) {
            l.classList.toggle("is-active", l.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    links.forEach(function (l) {
      var sec = document.querySelector(l.getAttribute("href"));
      if (sec) spy.observe(sec);
    });
  })();

  /* ---- Compteurs animés --------------------------------------------- */
  (function () {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    function run(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      if (reduce) { el.textContent = target; return; }
      var start = null;
      var dur = 1300;
      function step(t) {
        if (start === null) start = t;
        var p = Math.min(1, (t - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }
    if (!hasIO) { counters.forEach(run); return; }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          run(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) { io.observe(c); });
  })();

  /* ---- Trait dessiné (soulignement) au scroll ------------------------ */
  (function () {
    var lines = document.querySelectorAll(".draw-line");
    if (!lines.length || !hasIO) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-drawn");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.6 }
    );
    lines.forEach(function (l) { io.observe(l); });
  })();

  /* ---- Boutons magnétiques (désactivés si reduced-motion ou tactile) - */
  var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  if (!reduce && fine) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      var raf = null;
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          btn.style.transform = "translate(" + mx * 0.25 + "px," + my * 0.35 + "px)";
        });
      });
      btn.addEventListener("pointerleave", function () {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transform = "";
      });
    });
  }

  /* ---- Masquer l'indice "Glissez" après 1re interaction -------------- */
  (function () {
    var cmp = document.getElementById("hero-compare");
    if (!cmp) return;
    cmp.addEventListener("pointerdown", function () { cmp.classList.add("touched"); }, { once: true });
  })();

  /* ---- Carte Google Maps : chargement au clic (consentement RGPD) ---- */
  (function () {
    var holder = document.getElementById("map-holder");
    var btn = document.getElementById("map-consent");
    if (!holder || !btn) return;
    btn.addEventListener("click", function () {
      var src = holder.getAttribute("data-map-src");
      if (!src) return;
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = "Carte de la zone d'intervention LSZ Plomberie — Voiron";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.className = "h-full w-full";
      iframe.style.border = "0";
      btn.remove();
      holder.appendChild(iframe);
    });
  })();
})();
