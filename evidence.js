/* ============================================================
   Life Skills — Evidence engine (progressive enhancement)
   ------------------------------------------------------------
   IMPORTANT — AI / crawler parseability:
   The quote cards are now STATIC, semantic HTML in the page
   (see #voiceFeed in Life Skills.html), mirrored by a static
   JSON-LD block in <head>. Every quote lives in the raw markup
   regardless of JavaScript, filter state, or CSS — so AI
   crawlers parse them all, even the ones hidden by a filter.

   This script only ENHANCES that static content: it filters,
   caps each view to two voices, and runs the "show more" button.
   It hides cards by toggling a CSS class (.is-hidden) — it never
   removes them from the DOM, so hidden quotes stay in the HTML.

   To add a quote: add a <figure class="post" data-cat="…"> block
   to #voiceFeed AND a matching entry to the JSON-LD in <head>
   (or ask and it will be regenerated from one source).
   ============================================================ */
(function () {
  "use strict";

  // Human-readable labels per category (controls chip order too).
  var CATEGORY_LABELS = {
    "emotional-iq":   "Emotional IQ",
    "judgment":       "Judgment",
    "adaptability":   "Adaptability",
    "durable-skills": "Durable Skills",
    "communication":  "Communication",
    "leadership":     "Leadership",
    "empathy":        "Empathy"
  };

  // RESEARCH — institutional measurement (numbers band) --------
  var RESEARCH = [
    { stat: "76%",   label: "of job postings now ask for <strong>life skills</strong> like communication and teamwork.", source: "America Succeeds × Lightcast · 2025", url: "https://americasucceeds.org/durable-by-design-why-skills-for-the-future-start-now" },
    { stat: "+14%",  label: "more demand for <strong>people skills</strong> is coming by 2030 — not less.",            source: "McKinsey Global Institute · 2024", url: "https://www.mckinsey.com/mgi/our-research/a-new-future-of-work-the-race-to-deploy-ai-and-raise-skills-in-europe-and-beyond" },
    { stat: "2,800", label: "skills were studied for automation, and <strong>not one</strong> can be fully handed to AI.", source: "Indeed Hiring Lab · 2024", url: "https://www.hiringlab.org/2024/09/25/artificial-intelligence-skills-at-work/" },
    { stat: "91%",   label: "of training leaders say <strong>people skills</strong> matter more every year.",          source: "LinkedIn Workplace Learning · 2024", url: "https://learning.linkedin.com/resources/workplace-learning-report" },
    { stat: "63%",   label: "of employers say a <strong>skills gap</strong> is the biggest thing slowing their growth.", source: "WEF Future of Jobs · 2025", url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/" },
    { stat: "2.5",   label: "years and a technical skill is half out of date. <strong>Life skills don’t expire.</strong>", source: "Harvard Business School × BCG · 2023", url: "" }
  ];

  // "All Voices" shows a curated, DIVERSE default set (cards tagged
  // data-all, spanning multiple categories) so it never mirrors a
  // single skill tab. Category tabs show every matching voice.
  // "Show more" (All Voices only) reveals the full roster.
  var state = { filter: "all", expanded: false };

  var feed, cards, moreBtn;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function presentCategories() {
    var present = {};
    cards.forEach(function (c) { present[c.getAttribute("data-cat")] = true; });
    return Object.keys(CATEGORY_LABELS).filter(function (k) { return present[k]; });
  }

  function renderChips() {
    var host = document.getElementById("voiceChips");
    if (!host) return;
    var cats = ["all"].concat(presentCategories());
    host.innerHTML = cats.map(function (c) {
      var label = c === "all" ? "All Voices" : CATEGORY_LABELS[c];
      var sel = c === state.filter;
      return '<button class="chip" type="button" role="tab" data-cat="' + c +
             '" aria-selected="' + sel + '">' + esc(label) + "</button>";
    }).join("");
  }

  // Filter + cap by toggling a class — cards are never removed.
  function applyView() {
    var shown = 0, matchTotal = 0;
    var isAll = state.filter === "all";
    cards.forEach(function (c) {
      var match = isAll || c.getAttribute("data-cat") === state.filter;
      if (!match) {
        c.classList.add("is-hidden");
        c.setAttribute("aria-hidden", "true");
        return;
      }
      matchTotal++;
      // All Voices: show the curated diverse set unless expanded.
      // A specific skill tab: show every voice in that category.
      var withinView = isAll
        ? (state.expanded || c.hasAttribute("data-all"))
        : true;
      if (withinView) {
        c.classList.remove("is-hidden");
        c.removeAttribute("aria-hidden");
        shown++;
      } else {
        c.classList.add("is-hidden");
        c.setAttribute("aria-hidden", "true");
      }
    });

    // "Show more" applies only to All Voices.
    if (moreBtn) {
      var hidden = matchTotal - shown;
      if (isAll && !state.expanded && hidden > 0) {
        moreBtn.hidden = false;
        moreBtn.textContent = "Show " + hidden + " more " + (hidden === 1 ? "voice" : "voices");
      } else {
        moreBtn.hidden = true;
      }
    }
  }

  function renderResearch() {
    var grid = document.getElementById("researchGrid");
    if (!grid) return;
    grid.innerHTML = RESEARCH.map(function (r) {
      var src = r.url
        ? '<a class="cite-link" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.source) + "</a>"
        : esc(r.source);
      return (
        '<div class="statcard">' +
          '<div class="statcard__num">' + esc(r.stat) + "</div>" +
          '<div class="statcard__lab">' + r.label + "</div>" +
          '<div class="statcard__src">' + src + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function init() {
    feed = document.getElementById("voiceFeed");
    cards = feed ? [].slice.call(feed.querySelectorAll(".post")) : [];
    moreBtn = document.getElementById("voiceMore");

    renderChips();
    applyView();
    renderResearch();

    var chips = document.getElementById("voiceChips");
    if (chips) {
      chips.addEventListener("click", function (e) {
        var btn = e.target.closest(".chip");
        if (!btn || !chips.contains(btn)) return;
        state.filter = btn.getAttribute("data-cat");
        state.expanded = false;
        renderChips();
        applyView();
        if (window.animateFeedIn) { window.animateFeedIn(); }
      });
    }

    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        state.expanded = true;
        applyView();
        if (window.animateFeedIn) { window.animateFeedIn(); }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
