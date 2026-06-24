# HPU Homepage — Build Specification

> **For the implementing agent:** This document defines layout, structure, behavior, and interactions
> for every section of the HPU homepage. Do not infer colors, fonts, spacing, or border-radius
> values from this document — those come from the existing design system. Apply the site's existing
> CSS custom properties, utility classes, and component tokens throughout. Where this spec says
> "primary button" or "outlined button," use the site's existing button variants. Where it says
> "display heading" or "body text," use the site's existing type scale.

---

## Global Page Rules

- All sections are full-width (`width: 100%`). Max content width is constrained by the site's
  existing container class, not by this spec.
- Breakpoint for "mobile" throughout this document: `< 768px`. "Desktop" means `>= 768px`.
- Lazy-load all images below the fold using `loading="lazy"`.
- All videos must have `autoplay muted loop playsinline` and a `poster` attribute pointing to a
  still frame. Never autoplay video with sound.
- Every CTA button that appears in a section on mobile must be full-width (`width: 100%`).
- On desktop, CTA buttons are auto-width, left-aligned or centered per section spec.
- A globally persistent sticky header (outside this spec) contains site navigation. This spec
  handles only page body content.

---

## Section 1 — Hero: Full-Screen Video

### Purpose
Full-viewport video hero with text overlay and primary CTAs. This is the only content the visitor
sees before scrolling. It must function completely at every viewport size, including when the mobile
browser chrome (address bar + bottom nav bar) is visible.

### HTML Structure
```
<section class="hero" aria-label="Hero">
  <div class="hero__media">
    <video
      class="hero__video hero__video--desktop"
      autoplay muted loop playsinline
      poster="/assets/hero-poster-desktop.jpg"
      aria-hidden="true"
    >
      <source src="/assets/hero-desktop.mp4" type="video/mp4">
    </video>
    <video
      class="hero__video hero__video--mobile"
      autoplay muted loop playsinline
      poster="/assets/hero-poster-mobile.jpg"
      aria-hidden="true"
    >
      <source src="/assets/hero-mobile.mp4" type="video/mp4">
    </video>
  </div>
  <div class="hero__overlay" aria-hidden="true"></div>
  <div class="hero__content">
    <p class="hero__eyebrow">The Premier Life Skills University</p>
    <h1 class="hero__headline">You Were Meant to be Extraordinary®</h1>
    <p class="hero__subhead">
      HPU built its entire curriculum around the skills that decide what
      happens after graduation.
    </p>
    <div class="hero__ctas">
      <a href="/visit" class="btn btn--primary btn--lg">Schedule a Visit</a>
      <a href="/admissions/request-info" class="btn btn--outlined btn--lg">Request Info</a>
      <a href="/apply" class="btn btn--text btn--lg">Apply</a>
    </div>
  </div>
</section>
```

### Layout — Desktop
- `height: 100vh`. Minimum height: 600px.
- `.hero__media` is `position: absolute; inset: 0`. Video fills container via
  `object-fit: cover; width: 100%; height: 100%`.
- `.hero__video--mobile` is `display: none` on desktop.
- `.hero__overlay` is `position: absolute; inset: 0`. Use a CSS gradient:
  `linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)`.
- `.hero__content` is `position: relative; z-index: 2`. Positioned in the lower third of the
  section: `display: flex; flex-direction: column; justify-content: flex-end`. Pad bottom
  generously so content clears the fold.
- `.hero__ctas` uses `display: flex; flex-direction: row; gap: [site token]; align-items: center`.

### Layout — Mobile
- `height: 100svh` (use `svh` unit — "small viewport height" — which accounts for browser chrome
  on iOS and Android). Fallback: `height: 100vh` for browsers that do not support `svh`.
- `.hero__video--desktop` is `display: none`. `.hero__video--mobile` is `display: block`.
- `.hero__content` pushes to lower third via flex column justify-content end. Bottom padding must
  keep CTAs above the bottom browser nav bar — use at minimum `padding-bottom: 5svh`.
- `.hero__ctas` changes to `flex-direction: column; width: 100%`. All three buttons become
  full-width. Order: primary filled → outlined → text link.

### Accessibility
- `<h1>` is the page's only H1.
- Video has `aria-hidden="true"` — it is decorative.
- Overlay has `aria-hidden="true"`.
- Ensure text over overlay meets WCAG AA contrast. The gradient overlay exists for this purpose.

---

## Section 2 — Premier Life Skills

### Purpose
Introduce HPU's core differentiator — the required first-year life skills seminar taught by
President Qubein — before any proof points. This is the "why" that makes all subsequent stats
meaningful.

### Pattern: Eyebrow + Headline + Body + Video CTA
Derived from Apple's full-width centered content block pattern.

### HTML Structure
```
<section class="section-life-skills" aria-labelledby="life-skills-heading">
  <div class="container">
    <p class="eyebrow">Premier Life Skills</p>
    <h2 class="display-heading" id="life-skills-heading">
      The only sitting university president in the country who teaches your
      freshman class.
    </h2>
    <p class="body-lg body-centered">
      Every incoming student takes the President's Seminar on Life Skills,
      taught by President Nido Qubein himself. It is where the skills
      employers cannot find — communicating, adapting, leading, solving
      problems without an answer key — get built into the curriculum, not
      added as an elective.
    </p>
    <a href="#film" class="btn btn--primary" id="watch-film-trigger">
      Watch the Film
    </a>
    <div class="video-embed" id="life-skills-video" aria-label="HPU Life Skills Film">
      <!-- Embed or native video player goes here -->
      <!-- Use a thumbnail image with a play button overlay as the default state -->
      <!-- Clicking .watch-film-trigger or the thumbnail reveals/plays the video -->
    </div>
  </div>
</section>
```

### Layout — Desktop
- Single centered column. Content max-width approximately 55–60% of the container width.
- Eyebrow, heading, body, and CTA are all centered.
- Video embed appears below the CTA button, full container width with a moderate aspect ratio
  (16:9).
- The button triggers scroll-to or reveal of the video embed — implementation preference.

### Layout — Mobile
- Full-width single column. All elements remain centered.
- Video embed is full-width, 16:9.
- CTA button is full-width.

### Behavior
- Video is NOT autoplayed. User clicks the button or thumbnail to play.
- If using a YouTube/Vimeo embed, load the iframe only after user interaction (facade pattern)
  to avoid layout shift and performance hit on page load.

---

## Section 3 — Rankings and Outcomes

### Purpose
Proof block. Three stats that validate the Premier Life Skills thesis. Appears immediately after
the mechanism is explained.

### Pattern: Three-Up Stat Cards
Custom pattern built from the split-stat pattern. Three equal cards in a row.

### HTML Structure
```
<section class="section-stats" aria-labelledby="stats-heading">
  <div class="container">
    <h2 class="sr-only" id="stats-heading">Rankings and Outcomes</h2>
    <div class="stat-grid">

      <div class="stat-card">
        <span class="stat-card__number">99%</span>
        <span class="stat-card__label">
          employed or in graduate school within 180 days
        </span>
        <span class="stat-card__source">
          14 points above the national average — NACE First-Destination Survey
        </span>
      </div>

      <div class="stat-card">
        <span class="stat-card__number">#1</span>
        <span class="stat-card__label">Best-Run College in the Nation</span>
        <span class="stat-card__source">The Princeton Review, Best 390 Colleges</span>
      </div>

      <div class="stat-card">
        <span class="stat-card__number">#1</span>
        <span class="stat-card__label">
          Best Regional College in the South — 13 consecutive years
        </span>
        <span class="stat-card__source">U.S. News & World Report</span>
      </div>

    </div>
    <div class="section-cta">
      <a href="/visit" class="btn btn--primary">Schedule a Visit</a>
    </div>
  </div>
</section>
```

### Layout — Desktop
- `.stat-grid` is `display: grid; grid-template-columns: repeat(3, 1fr); gap: [site token]`.
- Each `.stat-card` is a vertically stacked flex column: number on top, label in middle, source
  at bottom. Card has a subtle background and border to visually separate it from the section
  background.
- `.section-cta` is centered below the grid.

### Layout — Mobile
- `.stat-grid` collapses to `grid-template-columns: 1fr`. Cards stack vertically.
- CTA button is full-width.

---

## Section 4 — Access to Innovators

### Purpose
Showcase that HPU students have real, in-person access to 30+ global leaders. This is the
experiential learning proof point.

### Pattern: Horizontal Feature Card Scroll
Derived from Apple's feature card carousel. Cards are horizontally scrollable.

### HTML Structure
```
<section class="section-innovators" aria-labelledby="innovators-heading">
  <div class="container">
    <p class="eyebrow">Access to Innovators</p>
    <h2 class="display-heading" id="innovators-heading">
      Learn from the people who built what you use.
    </h2>
    <p class="body-lg">
      More than 30 global leaders mentor HPU students — on campus, in the
      room, in conversation. Not a guest lecture. Access.
    </p>
  </div>

  <div class="card-scroll-wrapper" role="region" aria-label="Innovator cards" tabindex="0">
    <div class="card-scroll-track" id="innovators-track">

      <article class="innovator-card">
        <div class="innovator-card__image-wrap">
          <img src="/assets/innovators/wozniak.jpg" alt="Steve Wozniak"
               loading="lazy" class="innovator-card__image">
        </div>
        <div class="innovator-card__body">
          <span class="innovator-card__role">Innovator in Residence</span>
          <h3 class="innovator-card__name">Steve Wozniak</h3>
          <p class="innovator-card__title">Apple Co-Founder</p>
        </div>
      </article>

      <!-- Repeat pattern for: Marc Randolph, Cynt Marshall, Russell Weiner,
           Dr. John C. Maxwell, Byron Pitts, Teena Piccione, Sean Suggs -->
      <!-- Same structure for each card -->

    </div>

    <!-- Desktop navigation arrows -->
    <button class="card-scroll-prev" aria-label="Previous innovators"
            aria-controls="innovators-track">&#8249;</button>
    <button class="card-scroll-next" aria-label="Next innovators"
            aria-controls="innovators-track">&#8250;</button>
  </div>

  <div class="container">
    <div class="section-cta">
      <a href="/admissions/request-info" class="btn btn--primary">Request Info</a>
    </div>
  </div>
</section>
```

### Layout — Desktop
- `.card-scroll-wrapper` is `position: relative; overflow: hidden`.
- `.card-scroll-track` is `display: flex; flex-direction: row; gap: [site token]`. It is wider
  than the viewport — overflow is hidden by the wrapper.
- Show 3 full cards at a time. The fourth card bleeds ~30px to signal scrollability.
- Each `.innovator-card` has a fixed width of approximately `(container-width - 2*gap) / 3`.
- `.innovator-card__image-wrap` has a square aspect ratio (`aspect-ratio: 1 / 1`). Image is
  `object-fit: cover; width: 100%; height: 100%`.
- `.innovator-card__body` stacks: role (small caps label) → name (heading weight) → title (body).
- Prev/Next arrow buttons are `position: absolute` on the left and right edges of the wrapper,
  vertically centered at the image portion of the cards (not the full card height).
- JS: Clicking next translates the track by one card width + gap. Clicking prev reverses.
  Use CSS `scroll-behavior: smooth` or a JS `transform` transition (`transition: transform 300ms ease`).
- At the last card, hide the Next button. At the first, hide Prev.

### Layout — Mobile
- `.card-scroll-track` becomes `overflow-x: auto; scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch`. Remove the JS prev/next behavior.
- Each card has `scroll-snap-align: start`.
- Show 1 full card plus ~20px of the next card to signal horizontal scroll.
- Card width: `calc(100vw - [container-padding] - 20px)`.
- Arrow buttons are `display: none` on mobile.
- No scrollbar: `scrollbar-width: none` and `::-webkit-scrollbar { display: none }`.

### Card Image Spec
- Square crop on all portraits. Face centered.
- Hover state on desktop: subtle scale transform on `.innovator-card__image` (`transform:
  scale(1.03); transition: transform 400ms ease`).

---

## Section 5 — The Transformation

### Purpose
Communicate momentum and ambition by showing the before/after of HPU's growth since 2005. Answers
the unspoken question: "Is this place going somewhere?"

### Pattern: Split Stat Rows (two stacked)
Derived from Apple's 50/50 split feature block. Two rows — 2005 then Today.

### HTML Structure
```
<section class="section-transformation" aria-labelledby="transformation-heading">
  <div class="container">
    <h2 class="display-heading" id="transformation-heading">
      A university in motion.
    </h2>
  </div>

  <div class="transformation-row transformation-row--then">
    <div class="transformation-row__text">
      <span class="transformation-row__era">2005</span>
      <ul class="transformation-stats" role="list">
        <li><strong>28</strong> buildings</li>
        <li><strong>3</strong> schools</li>
        <li><strong>$38M</strong> operating budget</li>
        <li><strong>650,000</strong> sq ft</li>
        <li><strong>385</strong> employees</li>
      </ul>
    </div>
    <div class="transformation-row__image">
      <img src="/assets/campus-2005.jpg" alt="HPU campus circa 2005"
           loading="lazy">
    </div>
  </div>

  <div class="transformation-row transformation-row--now">
    <div class="transformation-row__image">
      <img src="/assets/campus-today.jpg" alt="HPU campus today"
           loading="lazy">
    </div>
    <div class="transformation-row__text">
      <span class="transformation-row__era">Today</span>
      <ul class="transformation-stats" role="list">
        <li><strong>130</strong> buildings</li>
        <li><strong>14</strong> schools</li>
        <li><strong>$406M</strong> operating budget</li>
        <li><strong>4.5M</strong> sq ft</li>
        <li><strong>2,318</strong> employees</li>
      </ul>
    </div>
  </div>

</section>
```

### Layout — Desktop
- Each `.transformation-row` is `display: grid; grid-template-columns: 1fr 1fr; align-items:
  center`.
- Row 1 (2005): text left, image right.
- Row 2 (Today): image left, text right. The column order in the DOM matches the visual order on
  desktop (no need for `order` manipulation on desktop).
- Images fill their grid cell: `width: 100%; height: 100%; object-fit: cover`. Aspect ratio
  approximately 4:3.
- `.transformation-row__era` is a large display-weight label that visually anchors the block.
- `.transformation-stats` is an unstyled list. Each `<li>` shows the number in display weight
  followed by a label in body weight on the same line.
- No CTA in this section.

### Layout — Mobile
- Each `.transformation-row` collapses to `grid-template-columns: 1fr`.
- Row 1: era label + stats stack first, image below.
- Row 2: era label + stats stack first, image below. Use `order` on mobile to bring text before
  image in both rows (`transformation-row--now .transformation-row__image { order: 2 }`).

### Animation (optional enhancement)
- On scroll into view (IntersectionObserver), the stat numbers can count up from zero to their
  final values over 800ms using a simple JS counter animation. Respect
  `prefers-reduced-motion: reduce` — skip animation if set.

---

## Section 6 — The Community

### Purpose
Emotional layer. Communicate that HPU is a place students genuinely want to be, anchored by 95%
on-campus residency.

### Pattern: Full-Width Centered + Image Cluster
Derived from Apple's centered headline + device cluster pattern. Three campus images stacked or
fanned instead of product photos.

### HTML Structure
```
<section class="section-community" aria-labelledby="community-heading">
  <div class="container">
    <p class="eyebrow">Campus Life</p>
    <h2 class="display-heading" id="community-heading">
      95% of students choose to live here. There is a reason.
    </h2>
  </div>

  <div class="community-image-cluster" aria-hidden="true">
    <div class="community-image community-image--left">
      <img src="/assets/community/arboretum.jpg"
           alt="Mariana H. Qubein Arboretum" loading="lazy">
    </div>
    <div class="community-image community-image--center">
      <img src="/assets/community/promenade.jpg"
           alt="Students on Kester Promenade" loading="lazy">
    </div>
    <div class="community-image community-image--right">
      <img src="/assets/community/residence-hall.jpg"
           alt="HPU residence hall" loading="lazy">
    </div>
  </div>

  <div class="container">
    <p class="body-lg body-centered">
      A 500-acre campus designed to make you want to be here. From the
      Mariana H. Qubein Arboretum and its 31 gardens to the residence halls
      that earned the #6 Best College Dorms ranking — the campus is the
      argument.
    </p>
    <div class="section-cta">
      <a href="/visit" class="btn btn--primary">Schedule a Visit</a>
    </div>
  </div>
</section>
```

### Layout — Desktop
- `.community-image-cluster` is `display: grid; grid-template-columns: 1fr 1.2fr 1fr;
  align-items: end; gap: [site token]`.
- The center image (`.community-image--center`) is taller than the flanking images —
  approximately 20% taller. Use `align-self: stretch` or a fixed aspect ratio difference:
  flanking images `aspect-ratio: 4/5`, center image `aspect-ratio: 3/4`.
- All images: `object-fit: cover; width: 100%; border-radius: [site token]`.
- Body text and CTA are centered below the cluster, constrained to ~60% container width.

### Layout — Mobile
- `.community-image-cluster` becomes `grid-template-columns: 1fr`. All three images stack
  vertically. The center image appears first.
- CTA button is full-width.

---

## Section 7 — Academic Portfolio

### Purpose
Answer "do you have my major?" without building a full program explorer on the homepage. Visitors
explore by school name; clicking leads to a dedicated school page.

### Pattern: Accordion Detail Explorer
Derived from Apple's "Take a closer look" accordion spec explorer.

### HTML Structure
```
<section class="section-academics" aria-labelledby="academics-heading">
  <div class="container">
    <h2 class="display-heading" id="academics-heading">
      Find your school.
    </h2>
    <p class="body-lg">
      14 schools. 80+ programs. Step through them one at a time.
    </p>
  </div>

  <div class="accordion-explorer" id="academics-explorer">

    <div class="accordion-explorer__list" role="list">

      <div class="accordion-item" role="listitem" data-index="0">
        <button class="accordion-item__trigger"
                aria-expanded="false"
                aria-controls="accordion-panel-0"
                id="accordion-trigger-0">
          <span class="accordion-item__icon" aria-hidden="true"></span>
          Earl N. Phillips School of Business
        </button>
        <div class="accordion-item__panel"
             id="accordion-panel-0"
             role="region"
             aria-labelledby="accordion-trigger-0"
             hidden>
          <p class="accordion-item__description">
            Finance, marketing, accounting, management, economics, and
            international business — credentialed before graduation.
          </p>
          <a href="/academics/business" class="accordion-item__link">
            Explore the Phillips School &rarr;
          </a>
          <!-- Mobile only: image renders here, inside the panel -->
          <div class="accordion-item__mobile-image" aria-hidden="true">
            <img src="/assets/schools/business.jpg"
                 alt="Earl N. Phillips School of Business" loading="lazy">
          </div>
        </div>
      </div>

      <!-- Repeat accordion-item pattern for all 14 schools + Norcross
           Graduate School. Each has its own panel, description, link, and
           mobile image. -->

    </div>

    <!-- Desktop only: persistent image panel that updates on accordion open -->
    <div class="accordion-explorer__visual" aria-hidden="true" id="accordion-visual">
      <img src="/assets/schools/business.jpg"
           alt="" id="accordion-visual-img"
           class="accordion-explorer__visual-img">
    </div>

  </div>

  <div class="container">
    <div class="section-cta">
      <a href="/academics" class="btn btn--primary">Find Your Program</a>
    </div>
  </div>
</section>
```

### Layout — Desktop
- `.accordion-explorer` is `display: grid; grid-template-columns: 1fr 1fr; gap: [site token];
  align-items: start`.
- `.accordion-explorer__list` is the left column.
- `.accordion-explorer__visual` is the right column. It is `position: sticky; top: [header-height
  + [site token]]` so it stays in view as the user opens accordion items.
- The visual image (`#accordion-visual-img`) updates its `src` and `alt` via JS when an accordion
  item opens. Cross-fade transition: `opacity` from 0 to 1 over 200ms, swap image src at opacity 0.
- `.accordion-item__mobile-image` is `display: none` on desktop.
- Accordion items: The trigger has a `+` icon that rotates to `×` when `aria-expanded="true"`.
  Use a CSS transform on `.accordion-item__icon`: `transform: rotate(45deg)` when expanded.
- Panel reveal: `hidden` attribute is toggled via JS. Animate height from 0 to auto using the
  `details`/`summary` pattern or a JS height animation (`max-height` transition).
- Only one accordion item open at a time. Opening a new item closes the previous one.

### Layout — Mobile
- `.accordion-explorer` becomes `display: block`. The `.accordion-explorer__visual` desktop panel
  is `display: none`.
- `.accordion-item__mobile-image` becomes `display: block` and renders inside the open panel,
  below the description and link.
- Multiple items can be open simultaneously on mobile (remove the "one at a time" constraint).

### Accessibility
- Full keyboard navigation: `Enter` and `Space` toggle accordion items.
- `aria-expanded` updates on toggle.
- `hidden` attribute on panel (not just CSS display) ensures screen readers skip closed panels.

---

## Section 8 — Graduate Outcomes

### Purpose
The 99% placement stat as a close, not an opener. By this point the visitor understands the
mechanism. Now the number lands as proof of the whole argument. Named graduate profiles make it
human.

### Pattern: Tabbed Feature Explorer
Derived from Apple's camera feature tab switcher.

### HTML Structure
```
<section class="section-outcomes" aria-labelledby="outcomes-heading">
  <div class="container">
    <p class="eyebrow">Career Outcomes</p>
    <h2 class="display-heading" id="outcomes-heading">
      99% employed or in graduate school within 180 days.
    </h2>
    <p class="body-lg body-centered">14 points above the national average.</p>
  </div>

  <div class="tabbed-explorer" id="outcomes-explorer"
       aria-label="Graduate outcomes by field">

    <div class="tabbed-explorer__media">
      <img src="/assets/graduates/business-grad.jpg"
           alt="Business graduate"
           id="outcomes-media-img"
           loading="lazy"
           class="tabbed-explorer__image">
    </div>

    <div role="tablist" aria-label="Field of study"
         class="tabbed-explorer__tabs" id="outcomes-tabs">
      <button role="tab" aria-selected="true" aria-controls="outcomes-panel-0"
              id="outcomes-tab-0" class="tab-pill tab-pill--active"
              data-media="/assets/graduates/business-grad.jpg"
              data-alt="Business graduate">
        Business
      </button>
      <button role="tab" aria-selected="false" aria-controls="outcomes-panel-1"
              id="outcomes-tab-1" class="tab-pill"
              data-media="/assets/graduates/health-grad.jpg"
              data-alt="Health Sciences graduate">
        Health Sciences
      </button>
      <button role="tab" aria-selected="false" aria-controls="outcomes-panel-2"
              id="outcomes-tab-2" class="tab-pill"
              data-media="/assets/graduates/comm-grad.jpg"
              data-alt="Communication graduate">
        Communication
      </button>
      <button role="tab" aria-selected="false" aria-controls="outcomes-panel-3"
              id="outcomes-tab-3" class="tab-pill"
              data-media="/assets/graduates/engineering-grad.jpg"
              data-alt="Engineering graduate">
        Engineering
      </button>
      <button role="tab" aria-selected="false" aria-controls="outcomes-panel-4"
              id="outcomes-tab-4" class="tab-pill"
              data-media="/assets/graduates/sciences-grad.jpg"
              data-alt="Sciences graduate">
        Sciences
      </button>
    </div>

    <div class="tabbed-explorer__panels">

      <div role="tabpanel" id="outcomes-panel-0" aria-labelledby="outcomes-tab-0">
        <p class="outcome-name">Graduate Name</p>
        <p class="outcome-destination">Analyst · Goldman Sachs</p>
        <p class="outcome-program">B.S. Finance, Class of 2025</p>
      </div>

      <!-- Repeat tabpanel for each field. hidden attribute on inactive panels. -->

    </div>
  </div>

  <div class="container">
    <div class="section-cta">
      <a href="/apply" class="btn btn--primary btn--lg">Apply</a>
    </div>
  </div>
</section>
```

### Layout — Desktop
- `.tabbed-explorer` is `display: flex; flex-direction: column; align-items: center`.
- `.tabbed-explorer__media` is full container width. Image: `width: 100%; aspect-ratio: 16/9;
  object-fit: cover`. This is the full-bleed image that changes per active tab.
- `.tabbed-explorer__tabs` is centered below the image. Tabs render as pill-shaped buttons in a
  horizontal row: `display: flex; flex-direction: row; gap: [site token]; flex-wrap: wrap;
  justify-content: center`.
- Active tab has a filled background. Inactive tabs have no fill (outlined or ghost style).
- `.tabbed-explorer__panels` is centered below the tabs, max-width approximately 50% of container.
- JS behavior: clicking a tab (1) sets `aria-selected="true"` on clicked tab, `false` on others;
  (2) removes `hidden` from corresponding panel, adds `hidden` to others; (3) cross-fades the
  media image (opacity 0 → swap src → opacity 1, 200ms each phase).
- CTA button (`Apply`) is below the panels, centered.

### Layout — Mobile
- `.tabbed-explorer__media` is full-width, `aspect-ratio: 1/1` on mobile (square crop).
- `.tabbed-explorer__tabs` scrolls horizontally. Same technique as Section 4 card scroll:
  `overflow-x: auto; display: flex; flex-direction: row; flex-wrap: nowrap; gap: [site token];
  scroll-snap-type: x mandatory`. Each tab pill: `scroll-snap-align: start; flex-shrink: 0`.
- No scrollbar visible.
- `.tabbed-explorer__panels` is full-width, below the tabs.
- CTA button is full-width.

---

## Section 9 — Value Equation

### Purpose
Address cost and close parent anxiety. Frame the investment clearly before the final CTA sequence.

### Pattern: Split Stat Block
Derived from Apple's 50/50 split with large accent stat.

### HTML Structure
```
<section class="section-value" aria-labelledby="value-heading">
  <div class="split-block">

    <div class="split-block__text">
      <p class="eyebrow">For Families</p>
      <h2 class="display-heading" id="value-heading">
        An education built to return more than it costs.
      </h2>
      <p class="body-lg">
        The total cost of attendance is $80,687. After aid and scholarships,
        the average direct investment is $48,429 — roughly $11,000 less than
        peer private universities. HPU distributes more than $75 million in
        scholarship support every year.
      </p>
      <div class="value-stat">
        <span class="value-stat__number">$48,429</span>
        <span class="value-stat__label">average direct investment after aid</span>
      </div>
      <a href="/tuition" class="btn btn--primary">See Financial Planning</a>
    </div>

    <div class="split-block__image">
      <img src="/assets/family-visit.jpg"
           alt="Family visiting HPU campus" loading="lazy">
    </div>

  </div>
</section>
```

### Layout — Desktop
- `.split-block` is `display: grid; grid-template-columns: 1fr 1fr; gap: [site token];
  align-items: center`.
- Text left, image right.
- `.value-stat__number` is a large display-weight number in the site's accent color.
- Image: `width: 100%; aspect-ratio: 4/3; object-fit: cover`.

### Layout — Mobile
- `.split-block` becomes `grid-template-columns: 1fr`.
- Image appears first, text below.
- CTA button is full-width.

### Sticky Mobile CTA
From this section onward, a floating sticky CTA bar appears at the bottom of the mobile screen.

```
<div class="sticky-cta-bar" id="sticky-cta" aria-label="Primary action" hidden>
  <a href="/visit" class="btn btn--primary btn--full-width">Schedule a Visit</a>
</div>
```

- `position: fixed; bottom: 0; left: 0; right: 0; z-index: 100`.
- JS: Use IntersectionObserver on `.section-value`. When `.section-value` enters the viewport,
  remove `hidden` from `#sticky-cta`. Dismiss on scroll past the final CTA block in Section 10.
- Desktop: `display: none` always.
- Add `padding-bottom` equal to the sticky bar height to the `<body>` when the bar is visible,
  to prevent it from obscuring content.

---

## Section 10 — Final CTA Block

### Purpose
Capture every visitor still reading. Two audience paths (students and parents) plus the full
three-button CTA sequence one final time.

### HTML Structure
```
<section class="section-final-cta" aria-labelledby="final-cta-heading"
         id="final-cta-block">
  <div class="container">

    <h2 class="display-heading" id="final-cta-heading">Two ways in.</h2>

    <div class="audience-split">

      <div class="audience-block audience-block--students">
        <h3 class="audience-block__heading">Students</h3>
        <p class="audience-block__subhead">Find your program.</p>
        <ul class="audience-block__links" role="list">
          <li><a href="/academics">Explore 80+ programs across 14 schools</a></li>
          <li><a href="/admissions/counselor">Meet your admissions counselor</a></li>
          <li><a href="/visit">Plan your visit</a></li>
        </ul>
        <a href="/academics" class="btn btn--primary">Find Your Program</a>
      </div>

      <div class="audience-block audience-block--parents">
        <h3 class="audience-block__heading">Parents</h3>
        <p class="audience-block__subhead">See the value.</p>
        <ul class="audience-block__links" role="list">
          <li><a href="/tuition">Understand the investment and the aid</a></li>
          <li><a href="/tuition/planning">Explore financial planning</a></li>
          <li><a href="/outcomes">Read the outcomes — 99%, first in North Carolina</a></li>
        </ul>
        <a href="/tuition" class="btn btn--primary">Explore Financial Planning</a>
      </div>

    </div>

    <div class="final-cta-trio">
      <a href="/visit" class="btn btn--primary btn--lg">Schedule a Visit</a>
      <a href="/admissions/request-info" class="btn btn--outlined btn--lg">Request Info</a>
      <a href="/apply" class="btn btn--text btn--lg">Apply</a>
    </div>

    <p class="fafsa-line" aria-label="Application codes">
      FAFSA 002933 &middot; SAT 5293 &middot; ACT 3108
    </p>

  </div>
</section>
```

### Layout — Desktop
- `.audience-split` is `display: grid; grid-template-columns: 1fr 1fr; gap: [site token]`.
- Each `.audience-block` is a contained card or visually separated column.
- `.final-cta-trio` is centered below the audience split: `display: flex; flex-direction: row;
  gap: [site token]; justify-content: center; align-items: center`.
- `.fafsa-line` is centered, small body text, below the trio.

### Layout — Mobile
- `.audience-split` collapses to `grid-template-columns: 1fr`. Students block first, Parents second.
- Both CTA buttons inside audience blocks are full-width.
- `.final-cta-trio` collapses to `flex-direction: column`. All three buttons full-width.
- JS: When this section enters the viewport, dismiss `#sticky-cta` (Section 9) by adding
  `hidden` attribute back.

---

## JavaScript Summary

All JS should be unobtrusive and progressively enhanced. If JS fails, the page must still render
and be navigable.

| Behavior | Mechanism |
|---|---|
| Hero video — mobile/desktop swap | CSS only via `display: none` on the appropriate video element |
| Life Skills video facade | Click handler on trigger + thumbnail; load iframe/player on interaction |
| Stat counter animation | IntersectionObserver + requestAnimationFrame counter; skip if `prefers-reduced-motion` |
| Innovators card scroll — desktop | JS `transform: translateX` on track; calc offset per card width + gap |
| Innovators card scroll — mobile | CSS `scroll-snap` only; no JS required |
| Transformation stat counter | Same as stat counter above |
| Accordion open/close | Toggle `aria-expanded` + `hidden` on panel; update desktop visual image with cross-fade |
| Accordion — one open at a time (desktop) | On open, close all others in the list |
| Outcomes tab switch | Toggle `aria-selected` + `hidden` on panels; cross-fade image |
| Sticky CTA bar | IntersectionObserver on `.section-value` (show) and `#final-cta-block` (hide) |

---

## Accessibility Checklist

- All interactive elements (buttons, links, accordion triggers, tabs) are keyboard accessible.
- `aria-expanded`, `aria-selected`, `aria-controls`, `aria-labelledby`, `hidden` are managed by JS
  for dynamic components.
- Decorative images have `alt=""` or `aria-hidden="true"`. Content images have descriptive alt text.
- Videos are decorative (`aria-hidden="true"`). No captions required for muted background video,
  but if the Life Skills film has a play button, a transcript link should be provided nearby.
- Color contrast for all text over images or overlays must meet WCAG AA.
- Focus styles must be visible on all interactive elements — do not suppress `:focus-visible`.
- Horizontal scroll regions (card scroll, tab row) have `tabindex="0"` on the scroll container
  and `role="region"` with an `aria-label`.

---

## Performance Notes

- Hero videos: provide both `.mp4` and `.webm` sources. Use separate assets for mobile vs desktop
  to avoid downloading a landscape video on a portrait screen.
- Lazy-load all images below the fold (`loading="lazy"`).
- Innovator card images: serve at the rendered card width (approximately 300–400px). Do not serve
  full-resolution portraits.
- Life Skills video: use the facade/placeholder pattern — do not load the video player iframe
  until user interaction.
- IntersectionObserver is used throughout. Set `rootMargin` to trigger animations slightly before
  the element enters the viewport (`rootMargin: "0px 0px -100px 0px"`).
