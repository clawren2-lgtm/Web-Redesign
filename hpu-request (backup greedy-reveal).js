/* ============================================================
   HPU — Request Information page interactions
   ------------------------------------------------------------
   GSAP-powered motion — three zones, deliberately restrained:
     1. Entrance — hero text only + form card (nothing else)
     2. Stage reveal — GSAP height:"auto" expands each stage
     3. Personalization — debounced 800ms; "Nice to meet you"
        fades in, then 500ms later the action line follows
   Fallbacks gracefully to instant-reveal if GSAP is absent.
   ============================================================ */
(function () {
  "use strict";

  var body      = document.getElementById("rqFormBody");
  var card      = document.querySelector(".rq-form");
  var line      = document.getElementById("form-line");
  var started   = false;
  var nameTimer = null;
  var lastName  = null;
  /* set ONLY when the form is FULLY expanded (every stage open). The proof
     cards stay completely absent until this fires — they only accompany someone
     actively working down the form, and arming on the FINAL stage means the
     page height is already settled when the card triggers are measured.
     Module-scoped so it survives matchMedia toggles (resize across the
     wide-screen breakpoint). */
  var proofEngaged = false;

  if (!body) { return; }

  var stages  = [].slice.call(body.querySelectorAll(".formstage"));
  var firstEl = document.getElementById("form_9a1886c5-a2f1-49b1-ad15-2895c17b47fc");

  var G = window.gsap || null;
  var allowMotion = !!(G && window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches);

  /* ============================================================
     HELPERS
     ============================================================ */
  function satisfied(el) {
    if (el.type === "radio") {
      return !!body.querySelector('input[name="' + el.name + '"]:checked');
    }
    return el.value.trim() !== "";
  }
  function stageComplete(stage) {
    return [].slice.call(stage.querySelectorAll("[data-req]")).every(satisfied);
  }
  function syncSelect(el) {
    if (el.tagName === "SELECT") {
      el.setAttribute("data-empty", el.value === "" ? "true" : "false");
    }
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ============================================================
     1. ENTRANCE — hero text cascade + form card; nothing else.
        Restrained: no rail, no stat cards, no field stagger.
     ============================================================ */
  function initEntrance() {
    if (!allowMotion) { return; }

    /* Remove the CSS pre-paint hide so GSAP takes sole ownership */
    document.documentElement.classList.remove("rq-js");

    /* Pre-set opacity so there's no flash before GSAP runs.
       Entrance animates the hero text CHILDREN (lead + action) and the
       form card; the scroll dissolve later animates the PARENT textrow,
       so the two never fight over the same property. */
    G.set([".rq-hero__lead", ".rq-form"], { opacity: 0 });

    G.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".rq-hero__lead",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.72, clearProps: "transform" })
      /* form card rises gently — the hero overlap gives it context */
      .fromTo(".rq-form",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7,  clearProps: "transform" }, "-=0.32");
  }

  /* ============================================================
     SCROLL CHOREOGRAPHY (FX) — the signature moment.
     The hero is HELD via position:sticky inside the taller
     .rq-pinwrap (CSS, class .rq-fx). As the user scrolls, the
     white form card rides up over the held image and anchors,
     then the pin releases naturally when the pinwrap passes.
     ScrollTrigger here does ONE job: scrub the hero text to a
     soft dissolve (opacity + blur + scale) and ease the image in
     a touch — no transforms drive layout, so resize/orientation
     just re-measures the sticky box. gsap.matchMedia enables it
     only on capable desktops with motion allowed, and cleans up
     (removing .rq-fx + clearing props) when the query stops
     matching, so the layout always resets correctly.
     ============================================================ */
  function initScrollFX() {
    if (!G || !window.ScrollTrigger) { return; }
    G.registerPlugin(window.ScrollTrigger);
    var ST = window.ScrollTrigger;
    var root = document.documentElement;

    var mm = G.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", function () {
      root.classList.add("rq-fx");
      ST.refresh();

      /* Geometry is RESPONSIVE and re-measured on every refresh. The hold
         window is driven by CSS (.rq-fx .rq-pinwrap height = 100vh + 44vh),
         which is live vh — so the scrub's end MUST track the same viewport or
         the two desync on a resize and scrolling back up can't reach progress 0
         (the hero stays mid-dissolve / blurred). Function-based end + tail-lift
         + invalidateOnRefresh keep the trigger locked to the live CSS geometry
         on any width/height change.
         This is reset-safe ONLY because every tween below is an explicit fromTo
         with literal endpoints: invalidateOnRefresh re-records from/to on refresh,
         but literal {opacity:1, blur:0} means progress 0 ALWAYS restores a clear
         hero. (A .to() would re-capture the current — possibly dissolved — value
         as its start and is what causes stuck-blur; there are none here.) */
      var tl = G.timeline({
        scrollTrigger: {
          trigger: ".rq-pinwrap",
          start: "top top",
          /* Held window matches the CSS --rq-scroll (70vh) rise distance. The
             card rises this full distance purely through the sticky mechanism
             (a layout move, not a transform), so the page tail — footer included
             — stays in honest document flow with no stranded slack at the bottom. */
          end: function () { return "+=" + Math.round(window.innerHeight * 0.70); },
          scrub: 0.4,
          invalidateOnRefresh: true
        }
      });
      /* PHASE 1 (0 → ~0.42): the words blur and dissolve away first.
         PHASE 2 (~0.42 → end): only now does the background itself blur and
         drift in, while the edge vignette closes — so focus collapses onto
         the form. The two never overlap on the same target.
         EVERY tween here is an explicit fromTo — never .to(). With
         invalidateOnRefresh:true, a .to() re-captures whatever the CURRENT
         value is as its start whenever ScrollTrigger.refresh() fires; if that
         happens mid-scroll (form expanded, resize, …) the dissolved state
         becomes the new "start" and scrolling back up can no longer restore
         the hero. Explicit from values make refreshes always safe.
         NOTE: nothing here transforms the page tail. The card's full rise is the
         sticky-hold + the deep CSS margin-top on .rq-main (layout, not transform),
         so the footer lands flush at the document bottom with zero blank gap. */
      tl.fromTo(".rq-hero__textrow",
          { opacity: 1, filter: "blur(0px)", scale: 1 },
          { opacity: 0, filter: "blur(14px)", scale: 0.965, ease: "none", duration: 0.42 }, 0)
        .fromTo(".rq-hero__bg",
          { scale: 1 },
          { scale: 1.08, ease: "none", duration: 1 }, 0)
        .fromTo(".rq-hero__bg",
          { filter: "blur(0px)" },
          { filter: "blur(22px)", ease: "none", duration: 0.58 }, 0.42)
        .fromTo(".rq-hero__vignette",
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 0.58 }, 0.42);

      /* settle measurements once layout + images are in */
      requestAnimationFrame(function () { ST.refresh(); });

      return function () {
        root.classList.remove("rq-fx");
        G.set([".rq-hero__textrow", ".rq-hero__bg", ".rq-hero__vignette", ".rq-main", ".rq-counselor", "section.section", ".footer"], { clearProps: "all" });
        ST.refresh();
      };
    });
  }

  /* ============================================================
     PROOF-CARD SCRUB (FX) — wide screens, AND only once engaged.
     Four standalone proof cards live in .rq-proof — their OWN
     track, a direct child of <body>, absolutely positioned from
     the document top and spanning the hero + the white form
     section. The track is fully DECOUPLED from everything else:
       • it is never part of the hero scrub's transform set, so
         its trigger positions are plain layout positions that the
         -rise lift can never skew;
       • its height is measured and fixed in px exactly ONCE, at
         arm time — and arming now waits for the form to be FULLY
         expanded, so the page height is already settled and no
         ResizeObserver / rolling refreshes are needed;
       • it is absolute + pointer-events:none, so it adds zero
         page height and intercepts nothing.
     Two gates, both required:
       • PRESENCE — gsap.matchMedia gates to (min-width:1440) +
         motion-OK and tears everything down the moment the query
         stops matching. Narrow / reduced-motion sessions: nothing.
       • ENGAGEMENT — "rq:proof-engage" fires only when EVERY form
         stage is open. Only then is html.rq-proof-armed added
         (CSS displays the track) and the per-card triggers built.
         Before that: no layer, no triggers, zero cost — the cards
         only accompany someone actively working down the form.
     The cards themselves do nothing clever: they sit at fixed
     offsets (first 200px from the track top) and ride normal page
     scroll; each scrubbed timeline fades + un-blurs a card in as
     it nears the viewport middle and back out as it passes. Only
     opacity + filter animate — no layout, no transforms.
     ============================================================ */
  function initProofScrub() {
    if (!G || !window.ScrollTrigger) { return; }
    G.registerPlugin(window.ScrollTrigger);
    var ST    = window.ScrollTrigger;
    var layer = document.querySelector(".rq-proof");
    if (!layer) { return; }
    var cards = [].slice.call(layer.querySelectorAll(".rq-proofcard"));
    if (!cards.length) { return; }
    var root = document.documentElement;

    /* The track is decoupled from the document top: it BEGINS 100px below the
       hero (so it covers only the white form section, not the hero) and is
       shrunk by the hero's height accordingly. mainEl.offsetTop is the hero
       height; height spans from there to the bottom of the white section, minus
       the extra scroll-lift the page tail gets in FX mode (the tail renders that
       much higher than layout says) so the last card stays clear of the
       counselor strip as seen. offsetTop/offsetHeight are layout values —
       immune to any in-flight transforms. */
    var HERO_GAP = 100;

    /* The white section's height AS IF EVERY STAGE WERE OPEN — even while some
       are still collapsed. Closed stages sit at height:0 (clipped), but their
       inner content keeps its natural layout height, so reading
       `.formstage__inner` offsetHeight gives the height the stage WILL add when
       it opens; we also add the open-stage top margin (CSS clamp(18,2.2vw,24)).
       This lets the track be measured ONCE, at its full final size, so the cards
       sit in the exact same spots they do when the form is fully expanded —
       regardless of how much the user has filled in so far. The form then simply
       reveals its fields around the already-placed cards as the user scrolls. */
    function fullMainHeight(mainEl) {
      var extra = 0;
      var openMargin = Math.max(18, Math.min(24, window.innerWidth * 0.022));
      stages.forEach(function (s) {
        if (s.classList.contains("is-open")) { return; }
        var inner = s.querySelector(".formstage__inner");
        if (inner) { extra += inner.offsetHeight + openMargin; }
      });
      return mainEl.offsetHeight + extra;
    }

    function sizeTrack() {
      var mainEl = document.querySelector(".rq-main");
      if (!mainEl) { return; }
      /* The lift is now applied in LAYOUT (margin-top on .rq-main), so offsetTop
         already reflects it — no transform-rise compensation needed. */
      var rise = 0;
      var heroH = mainEl.offsetTop;
      /* Shrink the track by an extra ~100vh total, split evenly top + bottom:
         the top is pushed a further ~50vh down the page and the bottom pulled
         ~50vh up, so the cards sit in a tight central band well clear of both
         ends. */
      var trim = Math.round(window.innerHeight * 1.0);
      var h = fullMainHeight(mainEl) - rise - HERO_GAP - trim;
      layer.style.top    = Math.round(heroH + HERO_GAP + trim / 2) + "px";
      layer.style.height = Math.max(0, Math.round(h)) + "px";
    }

    var mm = G.matchMedia();
    mm.add("(min-width: 1440px) and (prefers-reduced-motion: no-preference)", function () {
      root.classList.add("rq-proof-on");

      var built = [];          /* timelines we create — killed on cleanup */
      var armed = false;
      var armTimer = null;
      var resizeTimer = null;
      var clip = null;     /* clip wrapper element (created at arm time) */
      var ro   = null;     /* ResizeObserver on .rq-main — keeps the clip current */

      /* Wrap the track in a clip container exactly once. Done in JS so the page
         markup stays clean and the wrap fully reverses on cleanup. */
      function ensureClip() {
        if (clip || !layer.parentNode) { return; }
        clip = document.createElement("div");
        clip.className = "rq-proof-clip";
        clip.setAttribute("aria-hidden", "true");
        layer.parentNode.insertBefore(clip, layer);
        clip.appendChild(layer);
      }

      /* Clip the track to the LIVE layout bottom of the form section. Uses pure
         layout coordinates (offsetTop + offsetHeight) — immune to the GSAP
         transform lift on the page tail — so it matches the same coordinate
         space the cards are positioned in. Any card whose centre sits below
         this line is outside the current form region and stays hidden until
         the form expands (a stage opens) and the ResizeObserver fires again. */
      function sizeClip() {
        if (!clip) { return; }
        var mainEl = document.querySelector(".rq-main");
        if (!mainEl) { return; }
        var bottom = mainEl.offsetTop + mainEl.offsetHeight;
        clip.style.height = Math.max(0, Math.round(bottom)) + "px";
        gateCards();
      }

      /* A card must clear the form-section bottom IN FULL before it shows.
         `overflow: clip` alone would let a card straddling that line render as a
         cut-off sliver, which on some viewports left a partial card peeking
         above the form bottom. Instead, hide any card whose box extends below
         the clip's live bottom edge so only fully-contained cards are visible.
         Both rects are read in the same frame, so the comparison is correct
         regardless of current scroll position. */
      function gateCards() {
        if (!clip) { return; }
        var clipBottom = clip.getBoundingClientRect().bottom;
        cards.forEach(function (card) {
          var pokes = card.getBoundingClientRect().bottom > clipBottom + 0.5;
          card.style.visibility = pokes ? "hidden" : "";
        });
      }

      function build() {
        ensureClip();
        root.classList.add("rq-proof-armed");   /* CSS now displays the layer */
        sizeTrack();                            /* fix the track height in px */
        sizeClip();                             /* clip to live content height */

        /* As the form expands (each stage opening grows .rq-main), grow the clip
           in step so newly-reachable cards reveal right as the user arrives. */
        if (window.ResizeObserver) {
          var mainEl = document.querySelector(".rq-main");
          if (mainEl) {
            ro = new ResizeObserver(function () { sizeClip(); });
            ro.observe(mainEl);
          }
        }

        cards.forEach(function (card) {
          /* resting (hidden) state — matches the explicit `from` below */
          G.set(card, { opacity: 0, filter: "blur(11px)" });

          /* progress 0 → card centre at 86% down the viewport (entering),
             progress ~0.5 → card centre mid-viewport (clear, opaque),
             progress 1 → card centre at 14% (leaving). A short clarity hold
             sits across the centre so it reads as a deliberate proof point.
             fromTo throughout — refreshes can never re-capture a stale start. */
          var tl = G.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: card,
              start: "center 86%",
              end: "center 14%",
              scrub: 0.5,
              invalidateOnRefresh: true
            }
          })
          .fromTo(card,
            { opacity: 0, filter: "blur(11px)" },
            { opacity: 1, filter: "blur(0px)",  duration: 0.34, ease: "power1.out" })
          .to(card, { opacity: 1, filter: "blur(0px)",  duration: 0.30 })
          .to(card, { opacity: 0, filter: "blur(11px)", duration: 0.36, ease: "power1.in" });
          built.push(tl);
        });
      }

      /* Arm as soon as the HERO leaves view — not when the form is finished.
         The track is measured at its full final size (fullMainHeight), so the
         cards take their fully-open positions immediately and the form just
         reveals fields around them as the user scrolls down and fills it in.
         A short delay lets layout settle before the one-time measurement. */
      function arm() {
        if (armed) { return; }
        armed = true;
        armTimer = setTimeout(build, 300);
      }

      /* Viewport resizes (still ≥1440) change the vh-based rise and reflow the
         form — re-fix the track height, then let ScrollTrigger re-measure. */
      function onResize() {
        if (!armed) { return; }
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          sizeTrack();
          sizeClip();
          /* Kill and rebuild all ScrollTriggers so they re-measure at the new width */
          ST.getAll().forEach(function (t) { 
            if (t && t !== armScrollST) { t.kill(); }
          });
          built = [];
          /* Rebuild the card triggers with fresh measurements */
          cards.forEach(function (card) {
            G.set(card, { opacity: 0, filter: "blur(11px)" });
            var tl = G.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: card,
                start: "center 86%",
                end: "center 14%",
                scrub: 0.5,
                invalidateOnRefresh: true
              }
            })
            .fromTo(card,
              { opacity: 0, filter: "blur(11px)" },
              { opacity: 1, filter: "blur(0px)",  duration: 0.34, ease: "power1.out" })
            .to(card, { opacity: 1, filter: "blur(0px)",  duration: 0.30 })
            .to(card, { opacity: 0, filter: "blur(11px)", duration: 0.36, ease: "power1.in" });
            built.push(tl);
          });
          ST.refresh();
        }, 150);
      }
      window.addEventListener("resize", onResize);

      /* PRIMARY trigger: the hero is held sticky inside .rq-pinwrap; once the
         pinwrap's bottom reaches the viewport bottom the held window is over and
         the hero is on its way out — arm here so the cards begin their approach
         in the white form region below. proofEngaged (autofill / fully-filled)
         and the rq:proof-engage event remain as belt-and-suspenders arm paths so
         the cards are never missed if the form was completed another way. */
      var armScrollST = ST.create({
        trigger: ".rq-pinwrap",
        start: "bottom bottom",
        once: true,
        onEnter: arm
      });

      if (proofEngaged) { arm(); }
      else { document.addEventListener("rq:proof-engage", arm); }

      return function () {
        document.removeEventListener("rq:proof-engage", arm);
        window.removeEventListener("resize", onResize);
        if (armScrollST) { armScrollST.kill(); }
        if (ro) { ro.disconnect(); ro = null; }
        clearTimeout(armTimer);
        clearTimeout(resizeTimer);
        built.forEach(function (tl) {
          if (tl.scrollTrigger) { tl.scrollTrigger.kill(); }
          tl.kill();
        });
        root.classList.remove("rq-proof-on", "rq-proof-armed");
        layer.style.height = "";
        layer.style.top = "";
        G.set(cards, { clearProps: "all" });
        cards.forEach(function (card) { card.style.visibility = ""; });
        /* unwrap the clip container so the layer returns to the body */
        if (clip) {
          if (layer && clip.parentNode) { clip.parentNode.insertBefore(layer, clip); }
          clip.remove();
          clip = null;
        }
      };
    });
  }

  /* slim progress line under the card header fills as stages open */
  function updateProgress() {
    var fill = document.getElementById("rqProgress");
    if (!fill || !stages.length) { return; }
    var open = body.querySelectorAll(".formstage.is-open").length;
    var pct  = Math.max(20, Math.round((open / stages.length) * 100));
    fill.style.width = pct + "%";
  }

  /* ============================================================
     2. STAGE REVEAL — GSAP height:"auto" (reliable cross-env)
     ============================================================ */
  function initStageHeights() {
    /* Stage 0 is already open — let GSAP confirm its natural height */
    if (stages[0]) { G && G.set(stages[0], { height: "auto", opacity: 1 }); }
    /* All others start collapsed.
       IMPORTANT: collapse with height:0 + overflow:hidden ONLY — keep opacity:1.
       Chrome's autofill engine treats any field under an opacity:0 ancestor as
       "hidden" and drops it from the form's fillable set. With the phone/address
       fields hidden that way, Chrome no longer recognises a complete contact
       profile and stops offering autofill on EVERY field (incl. the visible
       Name/Email). Clipping by height keeps the fields invisible to the user but
       still discoverable by autofill; the :-webkit-autofill detector below then
       expands the stages so the filled values show. */
    stages.slice(1).forEach(function (s) {
      if (G) { G.set(s, { height: 0, opacity: 1 }); }
      else   { s.style.height = "0"; s.style.opacity = "1"; }
    });
  }

  function animateStageIn(stage) {
    /* Add margin via CSS transition first, height via GSAP after */
    requestAnimationFrame(function () {
      if (allowMotion) {
        /* animate height only — opacity stays 1 so fields remain autofillable;
           the per-field stagger below provides the fade-in. */
        G.fromTo(stage,
          { height: 0 },
          { height: "auto",
            duration: 0.55, ease: "power3.out" });

        /* Stagger the fields inside after the container starts opening */
        var fields = [].slice.call(stage.querySelectorAll(
          ".form_question:not(.hidden):not([data-invisible]):not([data-hidden-by-condition])," +
          ".form_question_row:not(.hidden)," +
          ".rq-submit-wrap"
        ));
        if (fields.length) {
          G.fromTo(fields,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.065,
              ease: "power3.out", clearProps: "transform", delay: 0.14 });
        }
      } else {
        /* no-GSAP fallback: just reveal */
        stage.style.height  = "auto";
        stage.style.opacity = "1";
      }
    });
  }

  function revealStages() {
    for (var i = 1; i < stages.length; i++) {
      if (!stages[i].classList.contains("is-open") && stageComplete(stages[i - 1])) {
        stages[i].classList.add("is-open"); /* triggers CSS margin-top transition */
        animateStageIn(stages[i]);
      } else if (!stageComplete(stages[i - 1])) {
        break;
      }
    }
    /* The proof cards arm only once the form is FULLY expanded — every stage
       open — so the page height is settled before their track is measured. */
    if (stages.length && stages.every(function (s) { return s.classList.contains("is-open"); })) {
      markProofEngaged();
    }
  }

  /* Fire once, when the form reaches full expansion. initProofScrub() listens for
     this (or reads the flag directly if it armed after the fact, e.g. resize-into-range). */
  function markProofEngaged() {
    if (proofEngaged) { return; }
    proofEngaged = true;
    document.dispatchEvent(new CustomEvent("rq:proof-engage"));
  }

  /* ============================================================
     3. PERSONALIZATION — debounced 800ms, two-part fade
        Part 1: "Nice to meet you, [Name]." fades in
        Part 2: " Fill in the rest…" fades in 500ms later
        No colour change on the name — plain text only.
     ============================================================ */
  function schedulePersonalize() {
    clearTimeout(nameTimer);
    nameTimer = setTimeout(doPersonalize, 800);
  }

  function doPersonalize() {
    if (!line || !firstEl) { return; }
    var raw = firstEl.value.trim();
    var n   = raw.split(/\s+/)[0];
    if (n === lastName) { return; }
    lastName = n;

    var isPersonalized = n.length > 1;

    /* Build new HTML — both spans present immediately so layout is stable */
    var newHTML = isPersonalized
      ? '<span class="rq-greet">Nice to meet you, ' + escapeHtml(n) + '.</span>' +
        '<span class="rq-detail">Fill in the rest and we\u2019ll connect you with your counselor.</span>'
      : "Start something extraordinary.";

    if (!allowMotion) {
      line.innerHTML = newHTML;
      return;
    }

    /* Slide + fade the current line out */
    G.to(line, {
      opacity: 0, y: -8, duration: 0.2, ease: "power2.in",
      onComplete: function () {
        /* Measure height before/after the content swap and tween between
           them. Runs on `height` only — independent of the opacity/y tweens
           below — and clears itself so the line returns to auto height.
           toH already includes the (hidden) detail line, so no second shift
           when it fades in later. */
        var fromH = line.offsetHeight;
        line.innerHTML = newHTML;
        var toH = line.offsetHeight;
        if (Math.abs(toH - fromH) > 1) {
          G.fromTo(line,
            { height: fromH, overflow: "hidden" },
            { height: toH, duration: 0.5, ease: "power3.inOut",
              clearProps: "height,overflow" });
        }

        if (isPersonalized) {
          var greet  = line.querySelector(".rq-greet");
          var detail = line.querySelector(".rq-detail");

          /* Hide detail so it occupies space but isn't seen */
          G.set(detail, { opacity: 0 });

          /* Slide + fade whole line back in */
          G.fromTo(line,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.38, ease: "power3.out",
              clearProps: "transform" });

          /* 1500ms later, fade in the action line */
          G.to(detail, { opacity: 1, duration: 0.45, ease: "power2.out", delay: 1.5 });

        } else {
          /* Default text — simple fade in */
          G.fromTo(line,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.38, ease: "power3.out",
              clearProps: "transform" });
        }
      }
    });
  }

  /* ============================================================
     UTILITY: mark started (dismisses sticky bar)
     ============================================================ */
  function markStarted() {
    if (started) { return; }
    started = true;
    var sticky = document.getElementById("rqSticky");
    if (sticky) { sticky.classList.remove("is-on"); }
  }

  /* ============================================================
     MAIN EVENT HANDLER
     ============================================================ */
  function onChange(e) {
    markStarted();
    if (e && e.target) { syncSelect(e.target); }
    /* Personalization only watches the first-name field.
       Typing in other fields must not reset or cancel the timer. */
    if (e && e.target && e.target === firstEl) { schedulePersonalize(); }
    revealStages();
  }
  body.addEventListener("input",  onChange);
  body.addEventListener("change", onChange);

  /* ============================================================
     SUBMIT → SUCCESS MODAL
     Closes the form card out and rises a confirmation modal with
     reassurance + curated next steps. GSAP drives the entrance;
     falls back to instant show when motion is off.
     ============================================================ */
  var submitBtn = body.querySelector(".rq-submit");
  var modal     = document.getElementById("rqModal");
  var emailEl   = document.getElementById("form_88bf477a-7350-4492-9a95-c7777296192b");

  function lockScroll(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
  }

  function openSuccessModal() {
    if (!modal) { return; }
    markStarted();

    /* personalize the headline + reassurance */
    var name = firstEl ? firstEl.value.trim().split(/\s+/)[0] : "";
    var titleEl = document.getElementById("rqModalTitle");
    if (titleEl) {
      titleEl.innerHTML = (name && name.length > 1)
        ? "You\u2019re all set, " + escapeHtml(name) + "."
        : "You\u2019re all set.";
    }
    var subEl = document.getElementById("rqModalSub");
    var emailVal = emailEl && emailEl.value.trim();
    if (subEl && emailVal) {
      subEl.innerHTML = "Your personal admissions counselor will reach out within one business day — " +
        "something personal is headed to <strong>" + escapeHtml(emailVal) + "</strong>.";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll(true);

    var scrim  = document.getElementById("rqModalScrim");
    var cardEl = modal.querySelector(".rq-modal__card");
    var mark   = modal.querySelector(".rq-modal__mark");
    var items  = [].slice.call(modal.querySelectorAll(
      ".rq-modal__eyebrow, .rq-modal__title, .rq-modal__sub, .rq-modal__next, .rq-modal__dismiss"));

    if (allowMotion) {
      /* dissolve the form card away beneath the modal */
      if (card) { G.to(card, { opacity: 0, y: 18, scale: 0.985, duration: 0.4, ease: "power2.in" }); }
      G.set(scrim,  { opacity: 0 });
      G.set(cardEl, { opacity: 0, y: 26, scale: 0.96 });
      G.set(mark,   { scale: 0 });
      G.set(items,  { opacity: 0, y: 14 });
      G.timeline()
        .to(scrim,  { opacity: 1, duration: 0.4, ease: "power2.out" })
        .to(cardEl, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }, "-=0.2")
        .to(mark,   { scale: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.32")
        .to(items,  { opacity: 1, y: 0, duration: 0.45, stagger: 0.07,
                      ease: "power3.out", clearProps: "transform" }, "-=0.24");
    } else {
      if (card)   { card.style.display = "none"; }
      if (scrim)  { scrim.style.opacity = "1"; }
      if (cardEl) { cardEl.style.opacity = "1"; }
    }
  }

  function closeSuccessModal() {
    if (!modal) { return; }
    function finish() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      lockScroll(false);
      if (card) {
        if (allowMotion) {
          G.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out", clearProps: "transform" });
        } else {
          card.style.display = ""; card.style.opacity = "1";
        }
      }
    }
    if (allowMotion) {
      var scrim  = document.getElementById("rqModalScrim");
      var cardEl = modal.querySelector(".rq-modal__card");
      G.to(cardEl, { opacity: 0, y: 16, scale: 0.97, duration: 0.3, ease: "power2.in" });
      G.to(scrim,  { opacity: 0, duration: 0.32, ease: "power2.in", onComplete: finish });
    } else {
      finish();
    }
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openSuccessModal();
    });
  }
  var modalClose = document.getElementById("rqModalClose");
  if (modalClose) { modalClose.addEventListener("click", closeSuccessModal); }
  var modalScrim = document.getElementById("rqModalScrim");
  if (modalScrim) { modalScrim.addEventListener("click", closeSuccessModal); }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) { closeSuccessModal(); }
  });

  /* ============================================================
     STICKY MOBILE BAR
     ============================================================ */
  function initSticky() {
    var sticky  = document.getElementById("rqSticky");
    var btn     = document.getElementById("rqStickyBtn");
    var section = document.getElementById("request-form");
    if (!sticky || !section) { return; }

    function evaluate() {
      if (started) { sticky.classList.remove("is-on"); return; }
      var r = section.getBoundingClientRect();
      if (r.bottom < 8) { sticky.classList.add("is-on"); }
      else              { sticky.classList.remove("is-on"); }
    }
    window.addEventListener("scroll", evaluate, { passive: true });
    window.addEventListener("resize", evaluate);
    evaluate();

    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var top = section.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        sticky.classList.remove("is-on");
        var f = section.querySelector("input, select");
        if (f) { setTimeout(function () { f.focus({ preventScroll: true }); }, 500); }
      });
    }
  }

  /* ============================================================
     COLUMN BALANCE
     ============================================================ */
  function balanceColumns() {
    var rail = document.querySelector(".rq-rail");
    if (!card || !rail) { return; }
    card.style.minHeight = "";
    if (window.matchMedia("(min-width: 901px)").matches) {
      var railH = Math.round(rail.getBoundingClientRect().height);
      var cardH = Math.round(card.getBoundingClientRect().height);
      if (railH > cardH && railH > 0) { card.style.minHeight = railH + "px"; }
    }
  }
  window.addEventListener("resize", balanceColumns);
  window.addEventListener("load",   balanceColumns);

  /* ============================================================
     AUTOFILL DETECTION
     Chrome fires animationstart on inputs it autofills; we
     instantly open all stages so it can reach every field.
     ============================================================ */
  function openAllStages() {
    stages.forEach(function (s) {
      if (!s.classList.contains("is-open")) {
        s.classList.add("is-open");
        if (G) { G.set(s, { height: "auto", opacity: 1 }); }
        else   { s.style.height = "auto"; s.style.opacity = "1"; }
      }
    });
    /* Trigger stage reveal logic so open states are synced */
    revealStages();
  }
  body.addEventListener("animationstart", function (e) {
    if (e.animationName === "rq-autofill-detect") {
      openAllStages();
    }
  });

  /* ============================================================
     SEGMENTED SELECTORS — mirror the radio's checked state onto an
     explicit class so the selected styling is consistent across
     rendering engines (independent of :checked+span recalc quirks).
     ============================================================ */
  function initSeg() {
    [].slice.call(body.querySelectorAll(".seg")).forEach(function (seg) {
      var inputs = [].slice.call(seg.querySelectorAll('input[type="radio"]'));
      function sync() {
        inputs.forEach(function (i) {
          var lbl = i.closest("label");
          if (lbl) { lbl.classList.toggle("is-sel", i.checked); }
        });
      }
      seg.addEventListener("change", sync);
      sync();
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  [].slice.call(body.querySelectorAll("select")).forEach(syncSelect);
  initSeg();
  initStageHeights(); /* must run before entrance so stages are pre-set */
  initSticky();
  balanceColumns();
  initEntrance();
  initScrollFX();
  initProofScrub();
  updateProgress();

})();
