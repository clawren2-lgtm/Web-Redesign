/* ============================================================
   HPU Homepage v2 — interactions
   ------------------------------------------------------------
   Reuses the established component patterns (accordion explorer,
   tabbed field gallery, card carousel, GSAP reveal + count-up)
   and adds the v2-spec pieces: Life Skills film facade, scroll-
   triggered stat counters, named graduate profiles, and the
   sticky mobile CTA bar. All progressively enhanced.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- DATA ---------------- */

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

  var INNOVATORS = [
    { name: "Steve Wozniak", role: "Apple Co-Founder", title: "Innovator in Residence", photo: "uploads/Steve Wozniak.jpg", pos: "center top" },
    { name: "Marc Randolph", role: "Netflix Co-Founder", title: "Entrepreneur in Residence", photo: "uploads/Marc-Randolph.jpg", pos: "center 24%" },
    { name: "Cynt Marshall", role: "Former Dallas Mavericks CEO", title: "Sports Executive in Residence", photo: "uploads/Cynt Marshall.jpg", pos: "center 14%" },
    { name: "Russell Weiner", role: "CEO of Domino's", title: "Corporate Executive in Residence", photo: "", note: "portrait \u00b7 Russell Weiner" },
    { name: "Byron Pitts", role: "ABC Nightline Co-Anchor", title: "Journalist in Residence", photo: "uploads/Byron Pitts.JPG", pos: "center 14%" },
    { name: "Teena Piccione", role: "Google Executive", title: "Data Expert in Residence", photo: "", note: "portrait \u00b7 Teena Piccione" },
    { name: "Sean Suggs", role: "President, Toyota Battery Mfg. NC", title: "Technology Executive in Residence", photo: "", note: "portrait \u00b7 Sean Suggs" }
  ];

  // Section 8 — named graduate profiles (DATA GATE: placeholders)
  var FIELDS = [
    { label: "Business", fig: "99%", figlab: "placed within 180 days", name: "Graduate Name", dest: "Analyst \u00b7 Goldman Sachs", prog: "B.S. Finance, Class of 2025", note: "business graduate" },
    { label: "Health Sciences", fig: "99%", figlab: "placed or in grad school", name: "Graduate Name", dest: "Doctor of PT \u00b7 Duke", prog: "B.S. Exercise Science, Class of 2025", note: "health sciences graduate" },
    { label: "Communication", fig: "99%", figlab: "placed within 180 days", name: "Graduate Name", dest: "Associate \u00b7 national agency", prog: "B.A. Strategic Communication, 2025", note: "communication graduate" },
    { label: "Engineering", fig: "99%", figlab: "placed within 180 days", name: "Graduate Name", dest: "Engineer \u00b7 Microsoft", prog: "B.S. Computer Engineering, 2025", note: "engineering graduate" },
    { label: "Sciences", fig: "99%", figlab: "placed or in grad school", name: "Graduate Name", dest: "Research \u00b7 NASA Goddard", prog: "B.S. Biology, Class of 2025", note: "sciences graduate" }
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------------- SUB-NAV solidify ---------------- */
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

  /* ---------------- 2 · LIFE SKILLS FILM FACADE ---------------- */
  function initFilm() {
    var facade = document.getElementById("lifeSkillsFilm");
    var trigger = document.getElementById("watchFilm");
    if (!facade) { return; }
    var played = false;
    function play() {
      if (played) { return; }
      played = true;
      var v = document.createElement("video");
      v.className = "videofacade__video";
      v.setAttribute("controls", "");
      v.setAttribute("autoplay", "");
      v.setAttribute("playsinline", "");
      v.src = "uploads/lifeskills banner video.mp4";
      facade.appendChild(v);
      facade.classList.add("is-playing");
      try { v.play(); } catch (e) {}
    }
    facade.addEventListener("click", play);
    facade.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });
    if (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        facade.scrollIntoView ? null : null; // avoid scrollIntoView; rely on smooth anchor
        play();
      });
    }
  }

  /* ---------------- 4 · INNOVATORS CARD SCROLL ---------------- */
  function renderInnovators() {
    var track = document.getElementById("innoTrack");
    if (!track) { return; }
    track.innerHTML = INNOVATORS.map(function (p) {
      var media = p.photo
        ? '<div class="incard__photo"><img src="' + esc(p.photo) + '" alt="' + esc(p.name) +
          '" loading="lazy" style="object-position:' + (p.pos || "center top") + ';"></div>'
        : '<div class="incard__photo ph ph--dark"><span class="ph__label">' + esc(p.note || p.name) + "</span></div>";
      return '<article class="incard">' + media +
        '<p class="incard__logo">' + esc(p.title) + "</p>" +
        '<h3 class="incard__name">' + esc(p.name) + "</h3>" +
        '<p class="incard__role">' + esc(p.role) + "</p></article>";
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

  /* ---------------- 7 · ACADEMICS ACCORDION ---------------- */
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

  /* ---------------- 8 · OUTCOMES TABBED EXPLORER ---------------- */
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
    var oName = document.getElementById("outcomeName");
    var oDest = document.getElementById("outcomeDest");
    var oProg = document.getElementById("outcomeProg");
    var pills = [].slice.call(tabs.querySelectorAll(".pill"));
    var frames = [].slice.call(media.querySelectorAll(".ph"));

    function select(i) {
      pills.forEach(function (b, j) { b.setAttribute("aria-selected", j === i); });
      frames.forEach(function (f, j) { f.classList.toggle("is-on", j === i); });
      var f = FIELDS[i];
      if (chipFig) { chipFig.textContent = f.fig; }
      if (chipLab) { chipLab.textContent = f.figlab; }
      if (oName) { oName.textContent = f.name; }
      if (oDest) { oDest.textContent = f.dest; }
      if (oProg) { oProg.textContent = f.prog; }
    }
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest(".pill");
      if (b) { select(parseInt(b.getAttribute("data-i"), 10)); }
    });
    select(0);
  }

  /* ---------------- 9 · STICKY MOBILE CTA ---------------- */
  function initStickyCta() {
    var bar = document.getElementById("stickyCta");
    var showAt = document.getElementById("value");
    var hideAt = document.getElementById("visit");
    if (!bar || !showAt) { return; }
    var shown = false, dismissed = false;
    function evaluate() {
      if (dismissed) { return; }
      var vy = showAt.getBoundingClientRect().top;
      if (!shown && vy < window.innerHeight) { shown = true; bar.classList.add("is-on"); }
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.target === showAt && en.isIntersecting && !dismissed) { shown = true; bar.classList.add("is-on"); }
          if (en.target === hideAt && en.isIntersecting) { dismissed = true; bar.classList.remove("is-on"); }
        });
      }, { rootMargin: "0px 0px -20% 0px" }).observe(showAt) ;
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { dismissed = true; bar.classList.remove("is-on"); }
        });
      }, { rootMargin: "0px 0px -10% 0px" });
      if (hideAt) { io2.observe(hideAt); }
    } else {
      window.addEventListener("scroll", evaluate, { passive: true });
      evaluate();
    }
  }

  /* ---------------- COUNT-UP (scroll-triggered) ---------------- */
  function initCounters() {
    var els = [].slice.call(document.querySelectorAll(
      ".statcard__num, .xstats strong, .statcallout__fig"));
    if (!els.length) { return; }

    function parse(raw) {
      var m = raw.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
      if (!m) { return null; }
      return {
        pre: m[1], numStr: m[2].replace(/,/g, ""), post: m[3],
        target: parseFloat(m[2].replace(/,/g, "")),
        dec: (m[2].indexOf(".") >= 0) ? 1 : 0,
        comma: m[2].indexOf(",") >= 0
      };
    }
    function run(el) {
      var raw = el.getAttribute("data-final") || el.textContent.trim();
      el.setAttribute("data-final", raw);
      if (reducedMotion()) { el.textContent = raw; return; }
      var p = parse(raw);
      if (!p) { el.textContent = raw; return; }
      var start = null, dur = 900;
      function frame(t) {
        if (start === null) { start = t; }
        var prog = Math.min(1, (t - start) / dur);
        var eased = 1 - Math.pow(1 - prog, 3);
        var val = (p.target * eased).toFixed(p.dec);
        if (p.comma) { val = Number(val).toLocaleString("en-US"); }
        el.textContent = p.pre + val + p.post;
        if (prog < 1) { requestAnimationFrame(frame); }
        else { el.textContent = raw; }
      }
      requestAnimationFrame(frame);
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -100px 0px" });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(run);
    }
  }

  /* ---------------- MOTION (GSAP reveal) ---------------- */
  function ungate() { document.documentElement.classList.remove("js-anim"); }

  function initMotion() {
    var allow = !window.matchMedia ||
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

    if (!window.gsap || !window.ScrollTrigger || !allow) {
      window.__motionReady = true;
      ungate();
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
    grid("#statGrid", ".statcard", { y: 26, stagger: 0.09 });
    grid("#innoTrack", ".incard", { y: 26, stagger: 0.06 });
    grid(".xform", ".xrow", { y: 30, stagger: 0.12, duration: 0.8 });
    grid(".cluster", ".cluster__img", { y: 30, stagger: 0.1 });
    grid(".audiencesplit", ".audiencecol", { y: 26, stagger: 0.12 });

    ScrollTrigger.refresh();
  }

  function init() {
    initNav();
    initFilm();
    renderInnovators();
    wireCarousel("innoTrack", "innoPrev", "innoNext");
    initCloser();
    initFieldGallery();
    initStickyCta();
    initCounters();
    initMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
