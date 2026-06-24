# Scroll-gated section reveal — change notes & rollback

**Date:** 2026-06-10
**Files touched:** `hpu-request.js`, `hpu-request.css`
**Untouched:** `Request Information.html` (still loads the same JS/CSS)

## What changed

The Request Information form reveals its sections (Contact → Academic → Education →
Address) one at a time. Previously a section opened the instant its required fields
were filled, and **autofill opened the entire form at once**.

Now the reveal is **scroll-gated**:

- When the user scrolls the **bottom of the current section above the vertical
  centre of the viewport** (a "I'm done here, what's next" gesture), the gate fires.
- **All required fields filled** → the next section animates open.
- **Something required missing** → each empty required field gets a Web-Orange
  *"Required to continue"* indicator (border ring + inline message + one gentle
  shake), the section does **not** advance, and (if it scrolled out of sight) the
  first missing field is nudged back into view.
- Fixing the flagged field(s) advances **immediately** — the user isn't forced to
  scroll again to be rewarded for fixing it.
- Errors are **never** shown before the user has engaged with the form (typed or
  autofilled at least once).

**Autofill** now behaves like typing: it fills every field (even collapsed ones —
they're clipped by height, not hidden from Chrome), and the sections then reveal
progressively as the user scrolls, each gate passing instantly because the section
is already complete.

### One intentional refinement
Required-ness is now read from visible `.form_question[data-required="1"]`, which
**includes Birthdate** (3 selects) in the Contact section. The old build gated only
on `[data-req]` elements and so silently let an empty Birthdate through despite its
asterisk. If you want the old, looser set back, see the rollback note below.

## How it works (for future edits)
All logic lives in `hpu-request.js`:
- `GATE_ENABLED` / `GATE_RATIO` — master switch and the 0.5 (50% viewport) trigger line.
- `evaluate(fromScroll)` — single source of truth, called on scroll (`true`) and on
  every input (`false`). Branch (A) handles error recovery, branch (B) the normal
  scroll-past reveal/flag.
- `openStage(i)` — reveals a section (reuses the existing `animateStageIn`), with a
  640 ms settle lock so the open animation can't trip the gate.
- `markStageErrors` / `refreshStageErrors` / `clearStageErrors` / `setFieldError` —
  the indicator. CSS lives under "SCROLL-GATED REVEAL" in `hpu-request.css`
  (`.form_question.is-missing`, `.rq-fieldmsg`, `@keyframes rq-shake`).

## Rollback options (easiest → most surgical)

1. **Quick disable (keep code):** set `GATE_ENABLED = false` near the top of
   `hpu-request.js`. The gate stops firing. (Note: this alone does *not* restore
   the old autofill-opens-all path — use option 2/3 for a true revert.)

2. **Full revert to the previous behavior:** copy the backups over the live files:
   - `hpu-request (backup greedy-reveal).js`  →  `hpu-request.js`
   - (CSS additions are additive/inert without the JS, so the CSS need not be reverted.)
   A fully self-contained snapshot of the old version is also preserved at
   `Request Information (backup greedy-reveal).html` (it points at the backup JS) —
   open it to see/compare the old interaction at any time.

3. **Keep scroll reveal but loosen required set (drop enforced Birthdate):** in
   `hpu-request.js`, change `requiredFields()` to query `'[data-req]'` parents
   instead of `'.form_question[data-required="1"]'`.
