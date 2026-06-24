/* ============================================================
   "Does HPU Have a Football Team?" — broadcast choreography
   ------------------------------------------------------------
   The broadcast metaphor lives entirely in the motion: a posted
   final score, a bottom-line ticker, a center-court camera pan, a
   film-reel of highlights, a venue tour, a flag-football wipe, a
   scoreboard accordion.

   AEO discipline: every fact is live, visible text by default.
   Animated start-states apply only under html.js-anim (set by the
   head gate when JS runs AND reduced-motion is off). This script
   reveals them. Counters count up but the static DOM already reads
   the real value. The FAQ accordion animates measured height, never
   display:none, so answers stay in the DOM open or closed.
   ============================================================ */
(function () {
  "use strict";

  var allowMotion = !window.matchMedia ||
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  /* Tell the head gate we're handling reveal (don't strip js-anim early). */
  window.__motionReady = true;

  /* ---------- FAQ scoreboard accordion (works regardless of motion) ----------
     Animates measured height + opacity; the answer text is always present in
     the DOM. A purple indicator (CSS ::before) slides in as each item opens. */
  (function initFaq() {
    var faq = document.getElementById("fbFaq");
    if (!faq) { return; }
    var items = [].slice.call(faq.querySelectorAll(".fb-faq__item"));

    function setOpen(item, open) {
      var btn = item.querySelector(".fb-faq__q");
      var panel = item.querySelector(".fb-faq__panel");
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
      var btn = item.querySelector(".fb-faq__q");
      btn.addEventListener("click", function () {
        var open = item.classList.contains("is-open");
        // close any other open item (single-open scoreboard line)
        items.forEach(function (other) { if (other !== item) { setOpen(other, false); } });
        setOpen(item, !open);
      });
    });

    // Default the football question open on mobile so the answer shows.
    if (window.matchMedia && window.matchMedia("(max-width: 860px)").matches) {
      setOpen(items[0], true);
    }
  })();

  /* ---------- Lazy-loaded highlight videos (works regardless of motion) ----------
     YouTube thumbnails act as posters; the iframe is only swapped in on click, so
     four embeds never weigh down the page or fight the GSAP scroll. */
  (function initVideos() {
    document.querySelectorAll(".fb-card__media[data-video] .fb-vplay").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var media = btn.closest(".fb-card__media");
        var id = media.getAttribute("data-video");
        media.innerHTML =
          '<iframe src="https://www.youtube.com/embed/' + id + '?rel=0&autoplay=1" ' +
          'title="HPU athletics highlight" frameborder="0" ' +
          'allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';
      });
    });
  })();

  if (!window.gsap || !window.ScrollTrigger || !allowMotion) {
    // No motion path: ensure nothing stays hidden behind the gate.
    document.documentElement.classList.remove("js-anim");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  // Ignore the mobile browser address-bar show/hide resize (it would otherwise
  // thrash the pinned triggers); genuine viewport size changes still refresh.
  ScrollTrigger.config({ ignoreMobileResize: true });
  var mm = gsap.matchMedia();
  var toArray = gsap.utils.toArray;

  // Shared scrub easing (seconds of catch-up lag) for every scrubbed trigger
  // on the page. Tune in one place.
  var SCRUB = 0.25;

  /* ============================================================
     SECTION 1 · THE ANSWER — hero scoreboard
     ============================================================ */
  (function hero() {
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(".fb-hero__kicker",
        { opacity: 0, y: 16, letterSpacing: "0.34em" },
        { opacity: 1, y: 0, letterSpacing: "0.18em", duration: 0.8 }, 0.2)
      // headline lines rise out of the clean edge (y:0 pins the px base so
      // the gate's translateY(110%) can't leave a residual offset)
      .fromTo(".fb-hero__line",
        { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.05, stagger: 0.1 }, 0.32)
      .fromTo(".fb-hero__prose p",
        { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 1.05)
      // stat slab tiles flip in on rotateX, left to right (split-flap board)
      .fromTo(".fb-tile",
        { opacity: 0, rotateX: -90 },
        { opacity: 1, rotateX: 0, duration: 0.62, stagger: 0.12, ease: "back.out(1.5)" }, 1.25)
      .fromTo(".fb-hero__cue",
        { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.7 }, 1.7);

    // gentle scrub parallax on the arena image as the user scrolls out
    gsap.fromTo(".fb-hero__media", { yPercent: 0, scale: 1.0 },
      { yPercent: 14, scale: 1.08, ease: "none",
        scrollTrigger: { trigger: ".fb-hero", start: "top top", end: "bottom top", scrub: SCRUB } });
  })();

  /* ============================================================
     TICKER · seamless bottom-line marquee (separator band)
     ============================================================ */
  (function ticker() {
    var track = document.getElementById("fbMarquee");
    if (track) {
      var set = track.firstElementChild;
      track.appendChild(set.cloneNode(true));
      var dur = window.matchMedia("(max-width: 860px)").matches ? 42 : 32;
      var loop = gsap.to(track, { xPercent: -50, duration: dur, ease: "none", repeat: -1 });
      track.parentElement.addEventListener("mouseenter", function () { loop.timeScale(0.18); });
      track.parentElement.addEventListener("mouseleave", function () { loop.timeScale(1); });
    }
  })();

  /* ============================================================
     SECTION 3 · CENTER COURT — pan (desktop) / stack (mobile)
     ============================================================ */
  (function court() {
    // Score tick-up: "A-B" posts like a scoreboard.
    function tickScore(el) {
      if (!el || el.__done) { return; } el.__done = true;
      var parts = (el.getAttribute("data-score") || "0-0").split("-");
      var A = parseInt(parts[0], 10), B = parseInt(parts[1], 10);
      var a = { v: 0 }, b = { v: 0 };
      function render() { el.textContent = Math.round(a.v) + "\u2013" + Math.round(b.v); }
      gsap.to(a, { v: A, duration: 1.1, ease: "power2.out", onUpdate: render });
      gsap.to(b, { v: B, duration: 1.1, ease: "power2.out", onUpdate: render });
    }
    var scoreEls = toArray(".fb-panel__score .fb-panel__scoreVal");

    // intro + panel copy reveal early (so both read once panned in)
    gsap.timeline({ scrollTrigger: { trigger: ".fb-court", start: "top 72%", once: true } })
      .fromTo([".fb-court__eyebrow", ".fb-court__lede"],
        { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }, 0)
      .fromTo(".fb-panel__k, .fb-panel__h, .fb-panel__p",
        { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, ease: "power3.out" }, 0.2);

    // men's score ticks as the section arrives
    ScrollTrigger.create({ trigger: ".fb-court", start: "top 55%", once: true,
      onEnter: function () { tickScore(scoreEls[0]); } });

    mm.add("(min-width: 861px)", function () {
      var track = document.getElementById("fbCourtTrack");
      var women = false;

      // Pin ONLY the two-panel viewport (intro + panels stay in natural DOM
      // flow). The pin engages when the viewport is centered in the screen, so
      // the panels read dead-center as the section scrolls past.
      //
      // RESIZE-PROOF MAPPING: the dwell is a FIXED FRACTION of the pan, so the
      // timeline's internal ratio (durations 1 : DWELL) is identical to the
      // scroll ratio baked into `end` (panLen : panLen*DWELL) at ANY viewport
      // size. Both `end` and the pan distance are function-based, so
      // invalidateOnRefresh recomputes them from scratch on every refresh
      // (i.e. on resize) and they stay perfectly in sync — no captured pixels.
      var DWELL = 0.3; // hold the women's panel centered for 30% of the pan
      var panLen  = function () { return window.innerWidth * 0.99; };
      var panDist = function () { return -(track.scrollWidth - window.innerWidth); };
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".fb-court__viewport", start: "center center",
          end: function () { return "+=" + (panLen() * (1 + DWELL)); },
          scrub: SCRUB, pin: ".fb-court__viewport", anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: function (self) {
            // tick the women's score as the pan nears completion
            if (!women && self.progress > 0.42) { women = true; tickScore(scoreEls[1]); }
          }
        }
      });
      // the horizontal camera pan across the two panels (duration 1), then an
      // empty hold (duration DWELL) keeps the panel centered before the release.
      // fromTo with explicit x:0 so invalidateOnRefresh always re-derives the
      // pan from a fixed origin (a bare .to() would re-read its start from the
      // live transform and corrupt the mapping when resized mid/after the pin).
      tl.fromTo(track, { x: 0 }, { x: panDist, ease: "none", duration: 1, immediateRender: true }, 0)
        .to({}, { duration: DWELL });
    });

    mm.add("(max-width: 860px)", function () {
      // women's score ticks when its panel enters
      ScrollTrigger.create({ trigger: ".fb-panel--flip", start: "top 70%", once: true,
        onEnter: function () { tickScore(scoreEls[1]); } });
    });
  })();

  /* ============================================================
     SECTION 4 · THE HIGHLIGHT REEL — film track (desktop) / snap (mobile)
     ============================================================ */
  (function reel() {
    gsap.timeline({ scrollTrigger: { trigger: ".fb-reel", start: "top 74%", once: true } })
      .fromTo(".fb-reel__head .eyebrow",
        { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 0)
      .fromTo(".fb-reel__title",
        { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0.08)
      .fromTo(".fb-reel__sub",
        { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" }, 0.18);

    var track = document.getElementById("fbReelTrack");
    var cards = toArray(".fb-card", track);

    mm.add("(min-width: 861px)", function () {
      function focusCards() {
        var cx = window.innerWidth / 2;
        cards.forEach(function (c) {
          var r = c.getBoundingClientRect();
          var d = Math.abs((r.left + r.width / 2) - cx) / window.innerWidth;
          // no opacity fade — all cards remain fully visible
          gsap.set(c, { opacity: 1 });
        });
      }
      var dist = function () {
        // include the track's left offset (container inset) so the final cards
        // are still reached by the pan
        var m = parseFloat(getComputedStyle(track).marginLeft) || 0;
        return track.scrollWidth - window.innerWidth + m;
      };
      // RESIZE-PROOF MAPPING: the trailing hold is a fixed fraction (HOLD) of
      // the pan distance, so the timeline ratio (1 : HOLD) matches the scroll
      // ratio in `end` (dist : dist*HOLD) at any size. With invalidateOnRefresh,
      // both recompute together on resize and stay in sync.
      var HOLD = 0.15;
      var tl = gsap.timeline({
        scrollTrigger: {
          // Pin ONLY the film-track viewport (header + cards stay in natural DOM
          // flow), engaging when it is centered in the screen so the cards read
          // center. The header flows naturally above — it can never overlap.
          trigger: ".fb-reel__viewport", start: "center center",
          // pan distance plus a short hold so the final cards settle before unpin
          end: function () { return "+=" + (dist() * (1 + HOLD)); },
          scrub: SCRUB, pin: ".fb-reel__viewport", anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: focusCards, onRefresh: focusCards
        }
      });
      // fromTo with explicit x:0 origin so invalidateOnRefresh re-derives the
      // pan from a fixed start (prevents the bare-.to() resize corruption).
      tl.fromTo(track, { x: 0 }, { x: function () { return -dist(); }, ease: "none", duration: 1, immediateRender: true });
      tl.to({}, { duration: HOLD });   // hold on the last cards so they can be reached
      focusCards();
      return function () { gsap.set(cards, { clearProps: "opacity" }); };
    });

    mm.add("(max-width: 860px)", function () {
      cards.forEach(function (c) {
        gsap.fromTo(c, { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: c, start: "top 88%", once: true } });
      });
    });
  })();

  /* ============================================================
     SECTION 5 · THE VENUES — facility tour (multi-rate parallax)
     ============================================================ */
  (function venues() {
    var cards = toArray(".fb-venue");
    cards.forEach(function (v, i) {
      gsap.fromTo(v, { y: 34, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: v, start: "top 86%", once: true } });
    });

    // Multi-rate parallax: each image drifts at a different pace (desktop).
    mm.add("(min-width: 821px)", function () {
      cards.forEach(function (v, i) {
        var media = v.querySelector(".fb-venue__media img, .fb-venue__media .ph");
        if (!media) { return; }
        var rate = 8 + (i % 3) * 6; // 8 / 14 / 20 percent
        gsap.fromTo(media, { yPercent: -rate / 2 }, { yPercent: rate / 2, ease: "none",
          scrollTrigger: { trigger: v, start: "top bottom", end: "bottom top", scrub: SCRUB } });
      });
    });
  })();

  /* ============================================================
     SECTION 6 · CAN YOU PLAY FOOTBALL — first-down marker wipe
     ============================================================ */
  (function play() {
    gsap.timeline({ scrollTrigger: { trigger: ".fb-play", start: "top 72%", once: true } })
      .fromTo(".fb-play__q", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0)
      .fromTo(".fb-play__a", { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0.15);
  })();

  /* ============================================================
     SECTION 8 · GAME-DAY CLOSE — buttons rise in
     ============================================================ */
  (function close() {
    gsap.timeline({ scrollTrigger: { trigger: ".fb-close", start: "top 78%", once: true } })
      .fromTo(".fb-close__h", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0)
      .fromTo(".fb-close__sub", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" }, 0.15)
      .fromTo(".fb-close__cta .btn", { y: 16, autoAlpha: 0, scale: 0.97 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power4.out" }, 0.32);
  })();

  // Pinned triggers need accurate measurements once images + fonts settle, and
  // a clean reset whenever the viewport changes size. invalidateOnRefresh on the
  // pinned timelines means refresh() recomputes all pin/pan distances from
  // scratch, so resizing never leaves a trigger mis-measured.
  var refreshTimer;
  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  }
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  window.addEventListener("resize", scheduleRefresh);
  window.addEventListener("orientationchange", scheduleRefresh);
})();
