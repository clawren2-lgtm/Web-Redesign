/* ============================================================
   Life Skills — Motion layer (GSAP + ScrollTrigger)
   ------------------------------------------------------------
   AEO / crawler safety (IMPORTANT):
   • All page content is fully VISIBLE by default.
   • A pre-paint gate (html.js-anim, set by the inline <head> script)
     hides only the about-to-animate elements, and only when JS runs
     with reduced-motion off — preventing the "flash then animate".
   • Reveals are tween-attached ScrollTriggers with once:true, so they
     fire exactly once (no replay/reverse on scroll-back) AND play on
     load if the page is already scrolled past them (deep-links) — so
     no element is ever stranded hidden. Final opacity is kept inline
     and transform is cleared, so CSS hover never fights GSAP.
   • If GSAP is missing/blocked or reduced-motion is on, the gate is
     removed and everything shows. Static HTML + JSON-LD remain the
     source of truth for crawlers regardless.
   ============================================================ */
(function () {
  "use strict";

  var EASE = "power3.out";

  function ungate() { document.documentElement.classList.remove("js-anim"); }

  function start() {
    var allowMotion = !window.matchMedia ||
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

    // Fail-safe: no GSAP, or motion not wanted → reveal everything, no animation.
    if (!window.gsap || !window.ScrollTrigger || !allowMotion) {
      window.__motionReady = true;
      ungate();
      window.animateFeedIn = window.animateFeedIn || function () {};
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    window.__motionReady = true;

    /* Tween-attached reveal: hidden → natural, ONCE, keeps final opacity
       inline, clears transform. `opts.trigger` lets a group share one
       trigger (for staggered grids/columns). */
    function reveal(targets, opts) {
      opts = opts || {};
      var from = { opacity: 0, y: (opts.y != null ? opts.y : 28) };
      if (opts.x != null) { from.x = opts.x; }
      if (opts.scale != null) { from.scale = opts.scale; }
      return gsap.fromTo(targets, from, {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: opts.duration || 0.8,
        ease: EASE,
        stagger: opts.stagger || 0,
        clearProps: "transform",
        scrollTrigger: {
          trigger: opts.trigger || targets,
          start: opts.start || "top 86%",
          once: true
        }
      });
    }

    function grid(containerSel, childSel, opts) {
      var el = document.querySelector(containerSel);
      if (!el) { return; }
      var kids = el.querySelectorAll(childSel);
      if (!kids.length) { return; }
      reveal(kids, Object.assign({ trigger: el, start: "top 82%", stagger: 0.08, duration: 0.7 }, opts || {}));
    }

    /* ---------- Quote feed: reveal visible cards + keep triggers aligned ---------- */
    window.animateFeedIn = function () {
      var posts = document.querySelectorAll(".feed .post:not(.is-hidden)");
      if (posts.length && window.gsap) {
        gsap.fromTo(posts, { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out", clearProps: "transform" });
      }
      // Filtering / "show more" changes the feed's height, which shifts every
      // trigger below it. Recalculate positions once the new layout is flushed.
      if (window.ScrollTrigger) {
        requestAnimationFrame(function () { ScrollTrigger.refresh(); });
      }
    };

    /* ---------- HERO: entrance plays ONCE on load — no scroll re-animation ---------- */
    // clearProps:"all" wipes every inline style GSAP set, so nothing is left behind.
    gsap.timeline({ defaults: { ease: EASE } })
      .fromTo(".hero .eyebrow", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7,  clearProps: "transform" })
      .fromTo(".hero__h1",      { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.95, clearProps: "transform" }, "-=0.45")
      .fromTo(".hero__sub",     { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8,  clearProps: "transform" }, "-=0.6")
      .fromTo(".hero .btn-row", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7,  clearProps: "transform" }, "-=0.55");

    // Image parallax only — opacity is NEVER changed on .hero__content.
    // Keeping opacity off the scrub means there is no possible leftover dim state
    // regardless of scroll position, page height changes, or refresh() calls.
    gsap.to(".hero__media", {
      scale: 1.12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".hero__content", {
      yPercent: -10, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    /* ---------- Generic single-block reveals ---------- */
    gsap.utils.toArray(".reveal").forEach(function (el) {
      reveal(el, { y: 28, start: "top 88%" });
    });

    /* ---------- Staggered grids (children, not wrappers) ---------- */
    grid(".proofbar", ".proofbar__cell", { y: 28, stagger: 0.1 });
    grid(".statrow", ".statrow > div", { y: 30, stagger: 0.12 });
    grid(".skillgrid", ".skillcard", { y: 30, scale: 0.97, stagger: 0.07 });
    grid(".teasergrid", ".teaser", { y: 30, stagger: 0.08 });
    grid(".inres-grid", ".inres", { y: 38, scale: 0.96, stagger: 0.1, duration: 0.8 });
    grid("#researchGrid", ".statcard", { y: 30, stagger: 0.08, duration: 0.7 });
    grid(".elemflow", ".elemflow__item", { y: 30, stagger: 0.07 });
    grid(".skillnav", ".skillnav__item", { y: 30, scale: 0.97, stagger: 0.06 });

    // Feed first reveal (once). animateFeedIn is also called by evidence.js on filter.
    ScrollTrigger.create({ trigger: ".feed", start: "top 82%", once: true, onEnter: window.animateFeedIn });

    /* ---------- TIMELINE: axis draws as you scroll, entries slide in ---------- */
    var tl = document.querySelector(".tl");
    if (tl) {
      var axis = tl.querySelector(".tl__axis");
      if (axis) {
        gsap.fromTo(axis, { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: tl, start: "top 78%", end: "bottom 72%", scrub: 0.6 }
        });
      }
      reveal(tl.querySelectorAll(".tl__col--left .tl__colhead, .tl__col--left .tl__entry"),
        { x: -38, y: 0, trigger: tl, start: "top 84%", stagger: 0.12, duration: 0.7 });
      reveal(tl.querySelectorAll(".tl__col--right .tl__colhead, .tl__col--right .tl__entry"),
        { x: 38, y: 0, trigger: tl, start: "top 84%", stagger: 0.12, duration: 0.7 });
    }

    /* ---------- Count-up numbers (final value restored exactly) ---------- */
    function setupCount(selector) {
      gsap.utils.toArray(selector).forEach(function (el) {
        var raw = el.getAttribute("data-final") || el.textContent.trim();
        el.setAttribute("data-final", raw);
        var m = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
        if (!m) { return; }
        var pre = m[1], target = parseFloat(m[2]), post = m[3];
        var dec = (m[2].indexOf(".") >= 0) ? 1 : 0;
        ScrollTrigger.create({
          trigger: el, start: "top 90%", once: true,
          onEnter: function () {
            var o = { v: 0 };
            gsap.to(o, {
              v: target, duration: 1.3, ease: "power2.out",
              onUpdate: function () { el.textContent = pre + o.v.toFixed(dec) + post; },
              onComplete: function () { el.textContent = raw; }
            });
          }
        });
      });
    }
    setupCount(".moment__num");
    setupCount(".proofbar__val");
    setupCount(".statrow__num");
    setupCount("#researchGrid .statcard__num");

    // Recalculate after everything (and fonts) settle.
    ScrollTrigger.refresh();

    // Deep-link safety: the feed's reveal is callback-based (it picks the
    // currently-visible cards), so if the page loads already scrolled past
    // the feed, reveal it now rather than leaving it gated.
    var feedEl = document.querySelector(".feed");
    if (feedEl && feedEl.getBoundingClientRect().top < (window.innerHeight || 800) * 0.2) {
      window.animateFeedIn();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
