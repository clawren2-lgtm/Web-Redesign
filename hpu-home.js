/* ============================================================
   High Point University — Homepage interactions
   ------------------------------------------------------------
   Apple-faithful components:
   • "Get the highlights" auto-advancing slider (dots + pause)
   • "Take a closer look" accordion (+/− pills, inline bubbles,
     up/down arrows, synced media)
   • "4K video" gallery (media on top, pill row, centered caption)
   • "Delightful new design" card carousels (caption below,
     circular arrows bottom-right)
   • Bento tap-to-expand · depth tabs · GSAP reveal + pinned scrub
   Pin/scrub disabled under prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- DATA ---------------- */

  // Section 4 — "Get the highlights" (verify rankings before publish)
  var HIGHLIGHTS = [
    { rank: "Career Outcomes", fig: "99%", lab: "employed or in graduate school within 180 days \u2014 14 points above the national average.", src: "NACE First-Destination Survey, Class of 2025", note: "graduates on commencement stage" },
    { rank: "Princeton Review", fig: "#1", lab: "Best-Run College in the Nation.", src: "The Princeton Review, Best 390 Colleges", note: "Kester Promenade aerial" },
    { rank: "U.S. News & World Report", fig: "#1", lab: "Best Regional College in the South \u2014 thirteen consecutive years.", src: "U.S. News & World Report", note: "campus landmark at golden hour" },
    { rank: "Career Services", fig: "Top 10", lab: "in the nation for career services.", src: "The Princeton Review \u2014 #9 Best Career Services", note: "career & professional development center" },
    { rank: "Enrollment", fig: "100 yrs", lab: "the largest enrollment in a century \u2014 growing through the national enrollment cliff.", src: "HPU Office of Institutional Research", note: "students between classes" }
  ];

  // 15 schools (verify count/order against live site before publish)
  var SCHOOLS = [
    { name: "Earl N. Phillips School of Business", desc: "The largest school at HPU, where finance students trade in a live-ticker room and pitch in the Business Plan Competition." },
    { name: "Nido R. Qubein\u00ae School of Communication", desc: "A Hollywood-standard TV studio, a 24-foot video wall, and Ascension 336, a student-run agency with real clients." },
    { name: "Congdon School of Health Sciences", desc: "Inside the 220,000 sq ft Congdon Hall: cadaver labs, a zero-gravity treadmill, and clinical gait analysis." },
    { name: "Wanek School of Natural Sciences", desc: "Research-active faculty and students working shoulder to shoulder on funded grants from their first year." },
    { name: "Webb School of Engineering", desc: "A 24/7 MakerSpace with laser cutters and PCB mills sits at the heart of the $500 million Innovation Corridor." },
    { name: "Stout School of Education", desc: "Future teachers in classrooms early and often, building the judgment that no methods textbook can teach." },
    { name: "Witcher School of Humanities and Behavioral Sciences", desc: "Psychology, criminal justice, and the liberal arts that anchor every Life Skill HPU is known for." },
    { name: "David R. Hayworth School of Arts and Design", desc: "Theater, dance, and design studios in the Hayworth Fine Arts Center, including the Pauline Theatre." },
    { name: "David S. Congdon School of Entrepreneurship", desc: "Opened in Plato S. Wilson Hall in 2024 to turn the entrepreneurial spirit into a discipline you can practice." },
    { name: "Teresa Caine School of Nursing", desc: "Graduated its first BSN class in 2024, training nurses on simulation units built to clinical standard." },
    { name: "Fred Wilson School of Pharmacy", desc: "A PharmD program inside Congdon Hall, paired with the health-sciences research labs next door." },
    { name: "School of Optometry", desc: "Housed in Webb Hall, preparing the next generation of eye-care clinicians and researchers." },
    { name: "Workman School of Dental Medicine", desc: "North Carolina's only private dental school, with a haptic simulation lab of ten SIMtoCARE units." },
    { name: "Kenneth F. Kahn School of Law", desc: "Opened in 2024 with an inaugural class building the profession's foundation in advocacy and judgment." },
    { name: "Norcross Graduate School", desc: "Master's and doctoral pathways, including HPU's tuition-free master's in communication and business leadership." }
  ];

  // Section 8 — Access to Innovators (lead with the most recognizable)
  var INNOVATORS = [
    { name: "Steve Wozniak", role: "Apple Co-Founder", title: "Innovator in Residence", photo: "uploads/Steve Wozniak.jpg", pos: "center top" },
    { name: "Marc Randolph", role: "Netflix Co-Founder", title: "Entrepreneur in Residence", photo: "uploads/Marc-Randolph.jpg", pos: "center 24%" },
    { name: "Cynt Marshall", role: "Former Dallas Mavericks CEO", title: "Sports Executive in Residence", photo: "uploads/Cynt Marshall.jpg", pos: "center 14%" },
    { name: "Russell Weiner", role: "CEO of Domino's", title: "Corporate Executive in Residence", photo: "", note: "portrait \u00b7 Russell Weiner" },
    { name: "Byron Pitts", role: "ABC Nightline Co-Anchor", title: "Journalist in Residence", photo: "uploads/Byron Pitts.JPG", pos: "center 14%" },
    { name: "Teena Piccione", role: "Google Executive", title: "Data Expert in Residence", photo: "", note: "portrait \u00b7 Teena Piccione" },
    { name: "Sean Suggs", role: "President, Toyota Battery Mfg. NC", title: "Technology Executive in Residence", photo: "", note: "portrait \u00b7 Sean Suggs" }
  ];

  // Section 11 — Graduate stories (DATA GATE: placeholder profiles, flagged for review)
  var GRADUATES = [
    { name: "Graduate Name", major: "Business Administration", outcome: "Analyst \u00b7 Goldman Sachs", note: "grad portrait" },
    { name: "Graduate Name", major: "Biology", outcome: "Research \u00b7 NASA Goddard", note: "grad portrait" },
    { name: "Graduate Name", major: "Strategic Communication", outcome: "Associate \u00b7 PwC", note: "grad portrait" },
    { name: "Graduate Name", major: "Exercise Science", outcome: "Doctor of PT \u00b7 Duke", note: "grad portrait" },
    { name: "Graduate Name", major: "Computer Science", outcome: "Engineer \u00b7 Microsoft", note: "grad portrait" },
    { name: "Graduate Name", major: "Sport Management", outcome: "Operations \u00b7 the NBA", note: "grad portrait" }
  ];

  // Section 10 — Outcomes by field (DATA GATE: figures are placeholders)
  var FIELDS = [
    { label: "Business", fig: "00%", figlab: "placeholder \u2014 placed within 180 days", lead: "Business.", p: "Phillips School of Business graduates move into finance, consulting, and corporate roles \u2014 credentialed before they apply.", where: "Recent destinations", landed: "Goldman Sachs, PwC, JPMorgan Chase", note: "business graduate at work" },
    { label: "Health Sciences", fig: "00%", figlab: "placeholder \u2014 placed or in grad school", lead: "Health Sciences.", p: "Congdon School graduates enter clinical programs and practice trained on equipment most schools never see.", where: "Recent destinations", landed: "Duke, Wake Forest Baptist, top DPT programs", note: "health sciences graduate at work" },
    { label: "Communication", fig: "00%", figlab: "placeholder \u2014 placed within 180 days", lead: "Communication.", p: "Qubein School graduates step into newsrooms, agencies, and studios with a portfolio built on real client work.", where: "Recent destinations", landed: "ABC, ESPN, national agencies", note: "communication graduate at work" },
    { label: "Sciences", fig: "00%", figlab: "placeholder \u2014 placed or in grad school", lead: "Sciences.", p: "Wanek School graduates carry funded research experience into graduate school and the lab.", where: "Recent destinations", landed: "NASA Goddard, R1 doctoral programs", note: "sciences graduate at work" },
    { label: "Engineering", fig: "00%", figlab: "placeholder \u2014 placed within 180 days", lead: "Engineering.", p: "Webb School graduates leave with hands on the MakerSpace and a project record employers can verify.", where: "Recent destinations", landed: "Toyota, Microsoft, regional manufacturers", note: "engineering graduate at work" }
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------------- 1 · SUB-NAV solidify ---------------- */
  function initNav() {
    var nav = document.querySelector(".subnav--home");
    if (!nav) { return; }
    var onScroll = function () {
      if (window.scrollY > window.innerHeight * 0.7) { nav.classList.add("is-solid"); }
      else { nav.classList.remove("is-solid"); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- 4 · "GET THE HIGHLIGHTS" SLIDER ---------------- */
  function initHighlights() {
    var track = document.getElementById("hlTrack");
    var dotsWrap = document.getElementById("hlDots");
    var pause = document.getElementById("hlPause");
    if (!track || !dotsWrap) { return; }

    track.innerHTML = HIGHLIGHTS.map(function (h) {
      return '<div class="hlslide" role="group" aria-roledescription="slide">' +
        '<div class="hlcard">' +
          '<div class="hlcard__media"><div class="ph ph--dark"><span class="ph__label">' + esc(h.note) + "</span></div></div>" +
          '<div class="hlcard__body">' +
            '<p class="hlcard__rank">' + esc(h.rank) + "</p>" +
            '<div class="hlcard__fig">' + esc(h.fig) + "</div>" +
            '<p class="hlcard__lab">' + esc(h.lab) + "</p>" +
            '<p class="hlcard__src">' + esc(h.src) + "</p>" +
          "</div>" +
        "</div></div>";
    }).join("");

    dotsWrap.innerHTML = HIGHLIGHTS.map(function (_, i) {
      return '<button class="hldot' + (i === 0 ? " is-on" : "") + '" type="button" aria-label="Highlight ' + (i + 1) + '" data-i="' + i + '"></button>';
    }).join("");

    var slides = [].slice.call(track.querySelectorAll(".hlslide"));
    var dots = [].slice.call(dotsWrap.querySelectorAll(".hldot"));
    var n = slides.length;
    var cur = 0, playing = true, timer = null;
    var INTERVAL = 4600;

    function layout() {
      // center the active slide; peek neighbors
      var slide = slides[cur];
      var vp = track.parentElement;
      var offset = slide.offsetLeft - (vp.clientWidth - slide.clientWidth) / 2;
      offset = Math.max(0, Math.min(offset, track.scrollWidth - vp.clientWidth));
      if (window.gsap) { gsap.to(track, { x: -offset, duration: 0.6, ease: "power2.out", overwrite: true }); }
      else { track.style.transform = "translateX(" + (-offset) + "px)"; }
      slides.forEach(function (s, i) { s.setAttribute("aria-hidden", i === cur ? "false" : "true"); });
      dots.forEach(function (d, i) { d.classList.toggle("is-on", i === cur); });
    }
    function go(i) { cur = (i + n) % n; layout(); }
    function next() { go(cur + 1); }
    function start() { stop(); if (playing) { timer = setInterval(next, INTERVAL); } }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    var ICON_PAUSE = '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="3.4" height="12" rx="1"/><rect x="9.6" y="2" width="3.4" height="12" rx="1"/></svg>';
    var ICON_PLAY = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg>';
    if (pause) {
      pause.innerHTML = ICON_PAUSE;
      pause.addEventListener("click", function () {
        playing = !playing;
        pause.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
        pause.setAttribute("aria-label", playing ? "Pause" : "Play");
        if (playing) { start(); } else { stop(); }
      });
    }
    dotsWrap.addEventListener("click", function (e) {
      var d = e.target.closest(".hldot");
      if (d) { go(parseInt(d.getAttribute("data-i"), 10)); start(); }
    });
    track.parentElement.addEventListener("mouseenter", stop);
    track.parentElement.addEventListener("mouseleave", function () { if (playing) { start(); } });
    window.addEventListener("resize", layout);

    layout();
    start();
  }

  /* ---------------- 7 · "TAKE A CLOSER LOOK" ACCORDION ---------------- */
  function initCloser() {
    var list = document.getElementById("closerList");
    var media = document.getElementById("closerMedia");
    if (!list || !media) { return; }

    media.innerHTML = SCHOOLS.map(function (s, i) {
      return '<div class="ph ph--dark closer__img' + (i === 0 ? " is-on" : "") +
             '" data-i="' + i + '"><span class="ph__label">campus \u00b7 ' + esc(s.name) + "</span></div>";
    }).join("");

    list.innerHTML = SCHOOLS.map(function (s, i) {
      return '<button class="closeritem" type="button" data-i="' + i + '" aria-expanded="' + (i === 0) + '">' +
        '<span class="closeritem__head">' +
          '<span class="closeritem__icon" aria-hidden="true"></span>' +
          '<span class="closeritem__label">' + esc(s.name) + "</span>" +
        "</span>" +
        '<span class="closeritem__body"><span class="closeritem__bodyinner">' +
          '<span class="closeritem__bubble">' + esc(s.desc) + "</span>" +
        "</span></span>" +
      "</button>";
    }).join("");

    var items = [].slice.call(list.querySelectorAll(".closeritem"));
    var frames = [].slice.call(media.querySelectorAll(".closer__img"));
    var prev = document.getElementById("closerPrev");
    var next = document.getElementById("closerNext");
    var cur = 0;

    function select(i) {
      i = Math.max(0, Math.min(SCHOOLS.length - 1, i));
      cur = i;
      items.forEach(function (b, j) {
        var on = (j === i);
        b.setAttribute("aria-expanded", on ? "true" : "false");
        var body = b.querySelector(".closeritem__body");
        var inner = body && body.querySelector(".closeritem__bodyinner");
        if (body && inner) {
          body.style.maxHeight = on ? (inner.scrollHeight + 8) + "px" : "0px";
        }
      });
      frames.forEach(function (f, j) { f.classList.toggle("is-on", j === i); });
      if (prev) { prev.disabled = (i === 0); }
      if (next) { next.disabled = (i === SCHOOLS.length - 1); }
      var active = items[i];
      if (active) {
        var lr = list.getBoundingClientRect(), ar = active.getBoundingClientRect();
        if (ar.top < lr.top + 8 || ar.bottom > lr.bottom - 8) {
          list.scrollTop += (ar.top - lr.top) - (lr.height - ar.height) / 2;
        }
      }
    }
    list.addEventListener("click", function (e) {
      var b = e.target.closest(".closeritem");
      if (b) { select(parseInt(b.getAttribute("data-i"), 10)); }
    });
    if (prev) { prev.addEventListener("click", function () { select(cur - 1); }); }
    if (next) { next.addEventListener("click", function () { select(cur + 1); }); }
    select(0);
  }

  /* ---------------- CAROUSELS (8 & 11) ---------------- */
  function renderInnovators() {
    var track = document.getElementById("innoTrack");
    if (!track) { return; }
    track.innerHTML = INNOVATORS.map(function (p) {
      var media = p.photo
        ? '<div class="incard__photo"><img src="' + esc(p.photo) + '" alt="' + esc(p.name) +
          '" style="object-position:' + (p.pos || "center top") + ';"></div>'
        : '<div class="incard__photo ph ph--dark"><span class="ph__label">' + esc(p.note || p.name) + "</span></div>";
      return '<article class="incard">' + media +
        '<p class="incard__logo">' + esc(p.title) + "</p>" +
        '<h3 class="incard__name">' + esc(p.name) + "</h3>" +
        '<p class="incard__role">' + esc(p.role) + "</p></article>";
    }).join("");
  }

  function renderGraduates() {
    var track = document.getElementById("gradTrack");
    if (!track) { return; }
    track.innerHTML = GRADUATES.map(function (g) {
      return '<article class="incard">' +
        '<div class="incard__photo ph ph--dark"><span class="ph__label">' + esc(g.note) + "</span></div>" +
        '<p class="incard__logo">' + esc(g.major) + "</p>" +
        '<h3 class="incard__name">' + esc(g.name) + "</h3>" +
        '<p class="incard__role">' + esc(g.outcome) + "</p></article>";
    }).join("");
  }

  function wireCarousel(trackId, prevId, nextId) {
    var track = document.getElementById(trackId);
    var prev = document.getElementById(prevId);
    var next = document.getElementById(nextId);
    if (!track) { return; }
    function step() {
      var card = track.querySelector(".incard");
      var gap = parseFloat(getComputedStyle(track).columnGap || "24") || 24;
      return (card ? card.getBoundingClientRect().width : 280) + gap;
    }
    function update() {
      if (!prev || !next) { return; }
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    if (prev) { prev.addEventListener("click", function () { track.scrollBy({ left: -step() * 2, behavior: "smooth" }); }); }
    if (next) { next.addEventListener("click", function () { track.scrollBy({ left: step() * 2, behavior: "smooth" }); }); }
    track.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* ---------------- 10 · "4K VIDEO" FIELD GALLERY ---------------- */
  function initFieldGallery() {
    var tabs = document.getElementById("fieldPills");
    var media = document.getElementById("fieldMedia");
    if (!tabs || !media) { return; }

    tabs.innerHTML = FIELDS.map(function (f, i) {
      return '<button class="pill" role="tab" data-i="' + i + '" aria-selected="' + (i === 0) + '">' + esc(f.label) + "</button>";
    }).join("");
    media.insertAdjacentHTML("afterbegin", FIELDS.map(function (f, i) {
      return '<div class="ph ph--dark' + (i === 0 ? " is-on" : "") + '" data-i="' + i +
             '"><span class="ph__label">' + esc(f.note) + "</span></div>";
    }).join(""));

    var chipFig = document.getElementById("fieldChipFig");
    var chipLab = document.getElementById("fieldChipLab");
    var capP = document.getElementById("fieldP");
    var capWhere = document.getElementById("fieldWhere");
    var pills = [].slice.call(tabs.querySelectorAll(".pill"));
    var frames = [].slice.call(media.querySelectorAll(".ph"));

    function select(i) {
      pills.forEach(function (b, j) { b.setAttribute("aria-selected", j === i); });
      frames.forEach(function (f, j) { f.classList.toggle("is-on", j === i); });
      var f = FIELDS[i];
      if (chipFig) { chipFig.textContent = f.fig; }
      if (chipLab) { chipLab.textContent = f.figlab; }
      if (capP) { capP.innerHTML = "<b>" + esc(f.lead) + "</b> " + esc(f.p); }
      if (capWhere) { capWhere.innerHTML = esc(f.where) + ": <strong>" + esc(f.landed) + "</strong>"; }
    }
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest(".pill");
      if (b) { select(parseInt(b.getAttribute("data-i"), 10)); }
    });
    select(0);
  }

  /* ---------------- 12 · BENTO expand ---------------- */
  function initBento() {
    var grid = document.getElementById("bento");
    if (!grid) { return; }
    grid.addEventListener("click", function (e) {
      var t = e.target.closest(".tile[data-expandable]");
      if (!t) { return; }
      e.preventDefault();
      var open = t.getAttribute("aria-expanded") === "true";
      t.setAttribute("aria-expanded", open ? "false" : "true");
      if (window.ScrollTrigger) { window.ScrollTrigger.refresh(); }
    });
    grid.querySelectorAll(".tile[data-expandable]").forEach(function (t) {
      t.setAttribute("aria-expanded", "false");
      t.setAttribute("tabindex", "0");
      t.setAttribute("role", "button");
      t.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t.click(); }
      });
    });
  }

  /* ---------------- 16 · DEPTH tabs ---------------- */
  function initDepthTabs() {
    var tabs = document.getElementById("progTabs");
    if (!tabs) { return; }
    var panels = [].slice.call(document.querySelectorAll("[data-progpanel]"));
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest(".tab");
      if (!b) { return; }
      var key = b.getAttribute("data-panel");
      [].slice.call(tabs.querySelectorAll(".tab")).forEach(function (t) {
        t.setAttribute("aria-selected", t === b);
      });
      panels.forEach(function (pn) {
        pn.classList.toggle("is-on", pn.getAttribute("data-progpanel") === key);
      });
    });
  }

  /* ---------------- MOTION (GSAP) ---------------- */
  function ungate() { document.documentElement.classList.remove("js-anim"); }

  function initMotion() {
    var allow = !window.matchMedia ||
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

    if (!window.gsap || !window.ScrollTrigger || !allow) {
      window.__motionReady = true;
      ungate();
      [].slice.call(document.querySelectorAll(".scrub__frame")).forEach(function (f, i) {
        f.style.opacity = i === 0 ? "1" : "0";
      });
      var seq0 = document.querySelector(".scrub");
      if (seq0) { seq0.style.height = "auto"; }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    window.__motionReady = true;

    function reveal(targets, opts) {
      opts = opts || {};
      return gsap.fromTo(targets, { opacity: 0, y: opts.y != null ? opts.y : 28 },
        { opacity: 1, y: 0, duration: opts.duration || 0.8, ease: "power3.out",
          stagger: opts.stagger || 0, clearProps: "transform",
          scrollTrigger: { trigger: opts.trigger || targets, start: opts.start || "top 86%", once: true } });
    }
    function grid(sel, child, opts) {
      var el = document.querySelector(sel);
      if (!el) { return; }
      var kids = el.querySelectorAll(child);
      if (kids.length) { reveal(kids, Object.assign({ trigger: el, start: "top 84%", stagger: 0.08, duration: 0.7 }, opts || {})); }
    }

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".hero .eyebrow", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, clearProps: "transform" })
      .fromTo(".hero__h1", { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.95, clearProps: "transform" }, "-=0.45")
      .fromTo(".hero__sub", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, clearProps: "transform" }, "-=0.6")
      .fromTo(".hero .btn-row", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, clearProps: "transform" }, "-=0.55");

    gsap.to(".hero__media", { scale: 1.12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    gsap.utils.toArray(".reveal").forEach(function (el) { reveal(el, { y: 28, start: "top 88%" }); });
    grid("#innoTrack", ".incard", { y: 26, stagger: 0.06 });
    grid("#gradTrack", ".incard", { y: 26, stagger: 0.06 });
    grid("#bento", ".tile", { y: 28, stagger: 0.07 });
    grid(".logosrow", ".logocard", { y: 26, stagger: 0.1 });
    grid(".fork", ".forkcol", { y: 26, stagger: 0.12 });

    gsap.utils.toArray(".moment__num, .statcallout__fig").forEach(function (el) {
      var raw = el.getAttribute("data-final") || el.textContent.trim();
      el.setAttribute("data-final", raw);
      var m = raw.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
      if (!m) { return; }
      var pre = m[1], numStr = m[2].replace(/,/g, ""), target = parseFloat(numStr), post = m[3];
      var dec = (numStr.indexOf(".") >= 0) ? 1 : 0;
      var hasComma = m[2].indexOf(",") >= 0;
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: function () {
        var o = { v: 0 };
        gsap.to(o, { v: target, duration: 1.3, ease: "power2.out",
          onUpdate: function () {
            var val = o.v.toFixed(dec);
            if (hasComma) { val = Number(val).toLocaleString("en-US"); }
            el.textContent = pre + val + post;
          },
          onComplete: function () { el.textContent = raw; } });
      } });
    });

    // ----- PINNED SCRUB SEQUENCE -----
    var seq = document.querySelector(".scrub");
    var frames = [].slice.call(document.querySelectorAll(".scrub__frame"));
    var dots = [].slice.call(document.querySelectorAll(".scrub__dot"));
    if (seq && frames.length) {
      gsap.set(frames, { opacity: 0 });
      gsap.set(frames[0], { opacity: 1 });
      var nf = frames.length;
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: seq, start: "top top", end: "+=" + (nf * 70) + "%",
          scrub: 0.6, pin: ".scrub__stage", anticipatePin: 1,
          onUpdate: function (self) {
            var idx = Math.min(nf - 1, Math.floor(self.progress * nf));
            dots.forEach(function (d, i) { d.classList.toggle("is-on", i === idx); });
          }
        }
      });
      for (var i = 1; i < nf; i++) {
        tl.to(frames[i - 1], { opacity: 0, duration: 0.5 }, i - 1)
          .to(frames[i], { opacity: 1, duration: 0.5 }, i - 1);
      }
    }

    ScrollTrigger.refresh();
  }

  function init() {
    initNav();
    initHighlights();
    initCloser();
    renderInnovators();
    renderGraduates();
    wireCarousel("innoTrack", "innoPrev", "innoNext");
    wireCarousel("gradTrack", "gradPrev", "gradNext");
    initFieldGallery();
    initBento();
    initDepthTabs();
    initMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
