# HPU Request Information Page — Design Spec
**Phase:** Design  
**Register:** Admissions/Recruitment (Register 3) + Parent layer  
**Mobile-first:** Yes  
**Form strategy:** Progressive disclosure — form expands as the student fills it, so it never looks daunting

---

## Strategic Premise

The progressive form changes the design logic entirely. A long pre-sell section before the form
would create friction before the student sees anything simple — the opposite of what we want.
Because the form starts with just a few fields and reveals more as you go, the form itself is the
conversion experience. The page's job is to get the student to that first field as fast as possible
and make filling it out feel like the obvious next move.

**Core design principle: the form is front and center. Everything else earns its place by being
next to or below the form, not in front of it.**

---

## Page Architecture (Mobile-First)

### 1. Hero — Above the Fold

Minimal. No competing imagery.

**Eyebrow:**
UNDERGRADUATE ADMISSIONS

**H1:**
You Were Meant to be Extraordinary.®

**Subhead:**
Start here. Your personal HPU admissions counselor is waiting on the other side of this form —
ready to walk you through the right major, your scholarship picture, and what life at HPU actually
looks like for YOU.

On mobile, the H1 and subhead are the entire above-the-fold experience. No CTA button is needed —
the form loads immediately below and the scroll is the CTA.

On desktop, the hero should be short enough that the student can see the top of the form without
scrolling. Seeing the first fields immediately reduces hesitation before they start.

---

### 2. Form Section — Immediate, Below the Hero

This is the main event. The form follows the hero with minimal separation. No additional section
header is needed between the hero and the form.

**Pre-form framing (one line, above the first field):**
Tell us about yourself — we'll personalize everything from here.

**Developer note:**
The Slate form expands progressively as the student fills it out. Do not let the full collapsed
form height set the iframe height on load. Use Slate's postMessage or scroll-height API to let
the iframe grow as the student fills it. Each progressive expansion should animate smoothly.

#### Alongside the Form — Desktop Right Rail

On desktop, a right rail sits beside the form. This content should not compete with the form. Its
job is to confirm the student made the right decision to start filling it out — not to pre-sell
them before they start.

**Right-rail block 1 — What happens when you submit:**

Your admissions counselor — the real person assigned to your region and your interests — will
reach out personally. They're your advocate through every step: major exploration, scholarship
opportunities, campus visits, and the application itself.

**Right-rail block 2 — Four reasons HPU families are glad they reached out:**

- #1 Best-Run College in the Nation — The Princeton Review, two consecutive years
- 99% employed or in graduate school within 180 days — 14 points above the national average
- $75 million in scholarships awarded to students each year
- 15:1 faculty-to-student ratio — your professors know your name

**Right-rail block 3 — For parents and families:**

You can include a parent email in the form below. HPU counselors reach out to the whole family —
because choosing a university is something you navigate together.

The right-rail content does not appear as a separate section on mobile. It is not critical enough
to interrupt the form scroll on a small screen.

---

### 3. Sticky Bar — Mobile Only

On mobile, once the student has scrolled past the form without starting it, a sticky bar appears
at the bottom of the screen. It disappears once the student begins typing in any form field.

**Sticky bar copy:**
Ready to connect with your HPU counselor?
[Fill Out the Form] — anchors back to the top of the form

---

### 4. Counselor Finder Strip

For the student who already knows what they want to ask and will skip the form entirely.

**Copy:**
Already know what you want to ask?
[Find Your Admissions Counselor →]

Link: `https://discover.highpoint.edu/portal/find-your-counselor`

---

### 5. Not-Ready Strip — Bottom of Page, Low Priority

For the visitor who isn't ready to fill out a form. Two side-by-side cards giving them a
next-best action rather than a dead end.

**Card 1 — Visit:**
See it before you decide.
The campus closes the deal for most HPU students. Tour options fill quickly.
[Schedule a Tour →]

**Card 2 — Virtual Tour:**
Can't visit yet? Start here.
Take a self-guided virtual tour of the Premier Life Skills University® and see why HPU is
rated one of the most beautiful campuses in the nation.
[Launch Virtual Tour →]

---

## Copy Hierarchy Summary

| Section | Purpose | Tone |
|---|---|---|
| H1 | Brand anchor + emotional entry | Aspirational, trademark |
| Subhead | Bridge from feeling to action | Conversational, counselor-as-advocate |
| Pre-form framing | Reduce friction at first field | Warm, lightweight |
| Right-rail trust | Justify the submit | Factual, outcome-oriented |
| Parent callout | Acknowledge dual audience | Inclusive, practical |
| Counselor strip | Capture high-intent skippers | Direct, command-verb |
| Not-ready strip | Retain low-intent visitors | Low-pressure, inviting |

---

## Mobile Scroll Order

1. H1 + subhead
2. Form — immediate, full-width
3. Counselor finder strip
4. Not-ready strip (Visit / Virtual Tour)

---

## What This Page Does Not Have (and Why)

**No pre-sell benefits section before the form.** The progressive form makes this unnecessary.
A long benefits section before the form adds scroll distance between the student's decision to
engage and their first interaction with a field.

**No countdown timers or artificial urgency.** The rankings, the counselor model, and the 99%
outcome stat are the urgency.

**No hero video.** Video on mobile is slow and intrusive. The form is the action. Video belongs
on the Tour page, not here.

**No social media feed embeds.** These pull attention away from the single conversion goal.

---

## Voice Checklist (Per Brand Guide)

- [x] Register 3: second-person, command verbs, counselor-as-advocate
- [x] Trademark preserved: You Were Meant to be Extraordinary.®, Premier Life Skills University®
- [x] At least one named stat per section
- [x] Rankings cited with consecutive-years language
- [x] Reader addressed as YOU (student) with parent layer acknowledged separately
- [x] No hedging, no modesty, no generic higher-ed boilerplate
