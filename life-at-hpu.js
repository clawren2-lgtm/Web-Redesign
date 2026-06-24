/* ============================================================
   "Life at HPU" — hub-page choreography
   ------------------------------------------------------------
   Refactored to lean entirely on GSAP's own machinery:

   • gsap.matchMedia({...}) with a conditions object owns EVERY
     scroll animation. When a breakpoint or the reduced-motion
     preference changes, GSAP reverts everything it created and
     re-runs the setup for the new conditions — no manual resize
     listeners, no hand-rolled teardown. This is how the page
     "updates with screen-size change": natively.
   • ScrollTrigger.batch() reveals the eight cards with far fewer
     triggers than one-per-card.
   • The pinned Signature strip uses function-based start/end +
     invalidateOnRefresh, so its geometry is recomputed on every
     refresh (load, resize, font swap) instead of being cached.
     Combined with ScrollTrigger.config({ ignoreMobileResize })
     and stable CSS aspect-ratios (images can't reflow the strip),
     the pin stays correct scrolling down AND back up.
   • No manual ScrollTrigger.refresh() polling on image load — the
     old hack that fought the active pin is gone.

   AEO discipline unchanged: every fact is live, visible text by
   default; animated start-states apply only under html.js-anim;
   the one count-up reads the real value from the static DOM.
   ============================================================ */
(function () {
  "use strict";

  var allowMotion = !window.matchMedia ||
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  /* Tell the head gate we're handling reveal (don't strip js-anim early). */
  window.__motionReady = true;

  /* ---------- FAQ accordion (independent of scroll / screen size) ----------
     Animates measured height + opacity; answer text is always in the DOM. */
  (function initFaq() {
    var faq = document.getElementById("laFaq");
    if (!faq) { return; }
    var items = [].slice.call(faq.querySelectorAll(".la-faq__item"));

    function setOpen(item, open) {
      var btn = item.querySelector(".la-faq__q");
      var panel = item.querySelector(".la-faq__panel");
      var inner = panel.firstElementChild;
      btn.setAttribute("aria-expanded", String(open));
      item.classList.toggle("is-open", open);
      if (window.gsap && allowMotion) {
        gsap.killTweensOf(panel);
        if (open) {
          gsap.set(panel, { height: "auto" });
          gsap.from(panel, { height: 0, duration: 0.42, ease: "power3.out" });
          gsap.fromTo(inner, { y: -8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out", delay: 0.04 });
        } else {
          gsap.to(panel, { height: 0, duration: 0.34, ease: "power2.inOut" });
        }
      } else {
        panel.style.height = open ? "auto" : "0px";
      }
    }

    items.forEach(function (item) {
      var btn = item.querySelector(".la-faq__q");
      btn.addEventListener("click", function () {
        var open = item.classList.contains("is-open");
        items.forEach(function (other) { if (other !== item) { setOpen(other, false); } });
        setOpen(item, !open);
      });
    });

    if (items[0]) { setOpen(items[0], true); }   // first question open by default
  })();

  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.remove("js-anim");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* Don't let mobile browser-chrome show/hide (which only changes viewport
     HEIGHT) trigger a ScrollTrigger refresh — that's the usual cause of a
     pin recalculating mid-scroll and "jumping". */
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Shared scrub lag (seconds) for every scrubbed trigger. 0.25 across the site.
  var SCRUB = 0.25;
  var toArray = gsap.utils.toArray;

  /* One count-up, run exactly once, preserving any prefix/suffix. The static
     DOM already shows the real value, so this is pure enhancement. */
  function countUp(el) {
    if (el.__counted) { return; }
    el.__counted = true;
    /* Only the explicitly opted-in stat animates; others stay static. */
    if (!el.hasAttribute("data-count")) { return; }
    var raw = (el.getAttribute("data-final") || el.textContent).trim();
    var m = raw.match(/^(\D*?)([\d.,]+)(.*)$/);
    if (!m) { el.textContent = raw; return; }
    var prefix = m[1], suffix = m[3];
    var target = parseFloat(m[2].replace(/,/g, ""));
    var hasDot = /\./.test(m[2]);
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.0, ease: "power2.out",
      onUpdate: function () {
        el.textContent = prefix + (hasDot ? obj.v.toFixed(1) : Math.round(obj.v)) + suffix;
      },
      onComplete: function () { el.textContent = raw; }
    });
  }

  /* ---- HERO INTRO (load) — plays exactly once. Kept OUTSIDE matchMedia on
     purpose: a one-shot intro must never be reverted/replayed by a breakpoint
     rebuild (that was freezing the H1 mid-rise). Gated on motion preference. */
  if (allowMotion) {
    /* Set the starting zoom state before the first paint so there's no flash */
    gsap.set(".la-hero__media img", { scale: 1.18, transformOrigin: "50% 50%" });

    gsap.timeline({ defaults: { ease: "power4.out" } })
      /* Slow zoom-out on load: 1.18 → 1.0 over 3 s */
      .to(".la-hero__media img", { scale: 1.0, duration: 3.0, ease: "power2.out" }, 0)
      .fromTo(".la-hero__kicker",
        { opacity: 0, y: 14, letterSpacing: "0.34em" },
        { opacity: 1, y: 0, letterSpacing: "0.2em", duration: 0.8 }, 0.15)
      .fromTo(".la-hero__line",
        { yPercent: 112, y: 0 }, { yPercent: 0, y: 0, duration: 1.15, stagger: 0.1 }, 0.34)
      .fromTo(".la-hero__prose p",
        { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 }, 1.0);
  }

  /* ============================================================
     gsap.matchMedia — the single owner of every SCROLL animation.
     The conditions object lets one setup function branch on size
     and on motion preference; GSAP reverts + reruns it whenever
     any of these conditions change.

     RESIZE STRATEGY (three cooperating GSAP mechanisms):
     1. ScrollTrigger auto-calls ScrollTrigger.refresh() after every
        window resize (debounced 200 ms). Trigger start/end positions
        are always recalculated — no manual listener needed.
     2. invalidateOnRefresh: true on EVERY trigger tells GSAP to call
        tween.invalidate() on each refresh, clearing cached "from"
        values so they are re-read from live DOM geometry. Applied to
        all triggers below — even once:true ones — so position anchors
        are correct if a resize happens before the trigger fires.
     3. gsap.matchMedia() tears down and rebuilds every animation when
        a breakpoint condition flips (e.g. desktop ↔ mobile).
     ============================================================ */
  var mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 861px)",
    isMobile: "(max-width: 860px)",
    motionOK: "(prefers-reduced-motion: no-preference)"
  }, function (ctx) {
    var cond = ctx.conditions;

    /* Reduced motion: the head gate never added js-anim, so all content is
       already visible. Build nothing — and let matchMedia revert anything
       from a previous (motion-on) state automatically. */
    if (!cond.motionOK) { return; }

    /* ---- 1 · HERO parallax — gentle scrubbed drift as the hero scrolls
       away. (The intro timeline lives outside matchMedia, above.) ---- */
    /* Scroll zoom-back-in: as hero exits, the image zooms from 1.0 back up to 1.15
       (mirrors the load zoom-out so the motion feels intentional both ways). */
    gsap.fromTo(".la-hero__media", { yPercent: 0, scale: 1.0 },
      { yPercent: 10, scale: 1.15, ease: "none",
        scrollTrigger: {
          trigger: ".la-hero", start: "top top", end: "bottom top",
          scrub: 2, invalidateOnRefresh: true
        } });

    /* ---- 2 · SHORT ANSWER — copy fades up, then the 3 stats count up ---- */
    var stats = toArray(".la-stat");
    var vals = toArray(".la-stat__val");
    gsap.timeline({ scrollTrigger: { trigger: ".la-answer", start: "top 70%", once: true, invalidateOnRefresh: true } })
      .fromTo([".la-answer__h", ".la-answer__p"],
        { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0)
      .fromTo(stats,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15, ease: "power3.out",
          onStart: function () {
            vals.forEach(function (v, i) { gsap.delayedCall(0.12 + i * 0.15, function () { countUp(v); }); });
          } }, 0.35);

    /* ---- 3 · CAMPUS-LIFE CARDS — head settles, then each card BLURS UP as
       it enters: rises a little while resolving from blurred to sharp. Each
       card animates on its own trigger (no group stagger sweep). ---- */
    gsap.timeline({ scrollTrigger: { trigger: ".la-cards", start: "top 80%", once: true, invalidateOnRefresh: true } })
      .fromTo(".la-cards__head > *",
        { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 0);

    gsap.set(".la-card", { autoAlpha: 0, y: 30, filter: "blur(14px)" });
    toArray(".la-card").forEach(function (card) {
      gsap.to(card, {
        autoAlpha: 1, y: 0, filter: "blur(0px)",
        duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 88%", once: true, invalidateOnRefresh: true }
      });
    });

    /* ---- 4 · SIGNATURE MOMENTS — intro reveal + the strip ---- */
    gsap.timeline({ scrollTrigger: { trigger: ".la-sig", start: "top 74%", once: true, invalidateOnRefresh: true } })
      .fromTo(".la-sig__eyebrow",
        { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 0)
      .fromTo(".la-sig__h",
        { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0.08);

    /* The horizontal strip pin (desktop) and the card fades (mobile) are
       registered as DEDICATED matchMedia queries below — NOT gated here with
       cond.isDesktop. The combined conditions object was resolving to the
       mobile branch at desktop width, so the pin never got built. */

    /* ---- 5 · RANKINGS (only if present) — badges meet from both sides ---- */
    if (document.querySelector(".la-rank")) {
      gsap.timeline({ scrollTrigger: { trigger: ".la-rank", start: "top 72%", once: true, invalidateOnRefresh: true } })
        .fromTo(".la-rank__h", { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0)
        .fromTo(".la-rank__p", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0.12);

      var badges = toArray(".la-badge");
      badges.forEach(function (b, i) {
        gsap.fromTo(b, { x: (i === 0 ? 56 : -56), autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: ".la-badges", start: "top 80%", once: true, invalidateOnRefresh: true } });
      });
    }

    /* ---- 6 · CTA — single settling fade-up ---- */
    gsap.timeline({ scrollTrigger: { trigger: ".la-cta", start: "top 80%", once: true, invalidateOnRefresh: true } })
      .fromTo(".la-cta__h", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out" }, 0)
      .fromTo(".la-cta__sub", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" }, 0.14)
      .fromTo(".la-cta__actions", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" }, 0.28);

    // matchMedia handles teardown of everything above on condition change.
  });

  /* ============================================================
     SIGNATURE STRIP — dedicated matchMedia registrations.
     Kept OUT of the combined conditions object above, which was resolving to
     the mobile branch at desktop width (so the pin was never created, and a
     resize never rebuilt it). These single-query registrations mirror the
     football page's working structure: gsap.matchMedia reverts + reruns the
     matching one on every breakpoint cross, so the pin is correctly built on
     desktop and torn down on mobile. Geometry is function-based with
     invalidateOnRefresh, so resizing WITHIN desktop recomputes it cleanly.
     ============================================================ */
  mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", function () {
    var viewport = document.querySelector(".la-sig__viewport");
    var track = document.getElementById("laSigTrack");
    if (!track || !viewport) { return; }

    // padding-left (CSS) bakes the centering offset into scrollWidth, so the
    // travel is a clean scrollWidth - clientWidth.
    var travel = function () { return Math.max(0, track.scrollWidth - viewport.clientWidth); };

    // A timeline OWNS the ScrollTrigger and a fromTo child (explicit x:0 origin)
    // does the travel — the same proven, resize-safe shape as the football pin.
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: viewport,
        start: "center center",
        end: function () { return "+=" + travel(); },
        pin: viewport,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: SCRUB,
        invalidateOnRefresh: true
      }
    });
    tl.fromTo(track,
      { x: 0 },
      { x: function () { return -travel(); }, ease: "none", duration: 1, immediateRender: true });
  });

  mm.add("(max-width: 860px) and (prefers-reduced-motion: no-preference)", function () {
    var track = document.getElementById("laSigTrack");
    if (!track) { return; }
    /* Mobile: the strip is a native swipe; just fade the cards in. */
    toArray(".la-sigcard").forEach(function (c) {
      gsap.fromTo(c, { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: c, start: "top 88%", once: true, invalidateOnRefresh: true } });
    });
  });

  /* ---- Reload-below guard -----------------------------------------------
     GSAP's ScrollTrigger calls refresh() on the 'load' event; once:true
     triggers that are already past their start fire at that point. But
     browser scroll restoration can settle in a frame AFTER that refresh,
     which means the trigger never sees the real scroll position and
     stays dormant — the stats never count.

     Fix: listen for 'load' ourselves (fires in the same tick as GSAP's),
     then step ONE requestAnimationFrame forward so we land after GSAP's
     own refresh callback. At that point every normally-fired trigger has
     had its chance. If the stat values are still uncounted AND the section
     is already above the 70 % threshold, we reveal and count directly.
  ----------------------------------------------------------------------- */
  window.addEventListener("load", function () {
    requestAnimationFrame(function () {
      if (!allowMotion) { return; }
      var statVals = document.querySelectorAll(".la-stat__val");
      if (!statVals.length) { return; }

      /* Bail out if the trigger already fired (all stats are counted). */
      var anyUncounted = [].some.call(statVals, function (v) { return !v.__counted; });
      if (!anyUncounted) { return; }

      var answerEl = document.querySelector(".la-answer");
      if (!answerEl) { return; }

      /* If the section's top is already above the 70 % trigger threshold,
         the trigger should have fired but didn't — handle it directly. */
      if (answerEl.getBoundingClientRect().top < window.innerHeight * 0.7) {
        gsap.set([".la-answer__h", ".la-answer__p"], { autoAlpha: 1, y: 0 });
        gsap.set(".la-stat", { autoAlpha: 1, y: 0 });
        [].forEach.call(statVals, function (v) { countUp(v); });
      }
    });
  }, { once: true });

  /* ---- Resize reset -----------------------------------------------------
     ScrollTrigger auto-refreshes on resize, but during a continuous
     drag-resize those mid-gesture refreshes can leave the pinned horizontal
     strip in an intermediate (mis-measured) state. A debounced refresh AFTER
     the gesture settles recomputes every trigger's geometry from scratch —
     function-based start/end + invalidateOnRefresh mean the pin location and
     the horizontal travel distance are re-derived together and stay in sync.
  ----------------------------------------------------------------------- */
  var resizeTimer;
  function resetTriggers() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  }
  window.addEventListener("resize", resetTriggers);
  window.addEventListener("orientationchange", resetTriggers);

})();
