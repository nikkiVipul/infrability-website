# Homepage Offerings Restructure + Bold Generative Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the homepage offerings into AI Offerings (umbrella) + a new Other Business Solutions Offerings section, remove Platform Foundation, and replace the hero with a bold animated AI-orb hero plus an interactive curiosity hook.

**Architecture:** Static site, no build step. Edit `index.html` (markup), `assets/styles.css` (presentation/motion), `assets/main.js` (chip interaction + canvas particles). Hero orb uses a CSS-ring fallback that renders immediately; swapping to user-supplied generated images is a documented one-line CSS toggle. All motion respects `prefers-reduced-motion`.

**Tech Stack:** Hand-written HTML/CSS/vanilla JS. Existing design tokens (CSS custom properties), Space Grotesk / Inter / JetBrains Mono fonts. Verification via a local static server + Playwright MCP (this repo's established workflow).

## Global Constraints

- No build tooling, no frameworks, no new runtime dependencies — hand-written HTML/CSS/vanilla JS only.
- Dual theme is mandatory: every change must look correct in **light (default)** and **dark** (`<html data-theme="dark">`) using existing tokens (`--cyan`, `--azure`, `--violet`, `--panel`, `--line`, `--ink`, `--muted`, etc.).
- Verify every visual task at **desktop ~1280px** and **mobile ~420px**, in **both themes**, with **zero new console errors**.
- All curiosity-hook navigation targets stay **on the homepage** (`index.html` anchors).
- Honor `prefers-reduced-motion: reduce` — disable continuous/canvas animation, keep a static visual.
- Commit after each task. Author commits as **Vipul Sharma <vipul.nikki@gmail.com>**, no co-author trailer (use `git -c user.name="Vipul Sharma" -c user.email="vipul.nikki@gmail.com" commit --no-verify`).
- Copy is exact where specified. New section headings: **"AI Offerings"** and **"Other Business Solutions Offerings"**. The three Other-Business cards are **CRM — Dynamics 365**, **ERP — Microsoft**, **ERP — Odoo**.

---

## Verification harness (used by every task)

Start once, leave running in the background:

```bash
python -m http.server 8000 --directory "D:/GithubRepos/Website"
```

Standard visual check (Playwright MCP) for a task:
1. `browser_navigate` → `http://localhost:8000/index.html`
2. `browser_resize` 1280×900 → `browser_take_screenshot` (light)
3. `browser_evaluate`: `() => { localStorage.setItem('theme','dark'); location.reload(); }` → wait → screenshot (dark)
4. `browser_resize` 420×900 → screenshot (mobile dark) → reset theme: `() => { localStorage.setItem('theme','light'); location.reload(); }`
5. `browser_console_messages` → confirm no new errors.

Reset to light theme at the end of each task's check.

---

## File Structure

| File | Responsibility after this plan |
|------|-------------------------------|
| `index.html` | Hero rebuilt as two-column (copy + orb stage) with teaser-chip hook; console relocated below stats; `#platform` removed; "AI Offerings" divider added before `#products`; new `#offerings` (Other Business Solutions) section after `#agents`; footer column updated. |
| `assets/styles.css` | New rules: `.hero-grid`/`.hero-copy`, `.orb-stage` + orb motion keyframes, `.hook` chip block, `.offer-divider`, `#offerings` reuse of `.card`/`.grid`. Removed orphaned `.pf-ongoing`/`.pf-divider`/`.value-card` rules. |
| `assets/main.js` | New: teaser-chip interaction (`initHook`) and optional canvas particle field (`initOrbParticles`). Existing count-up/reveal logic untouched. |
| `assets/img/` | Consumes user-supplied `hero-orb-light.webp` / `hero-orb-dark.webp` (optional `hero-orb.mp4`, `band-threads.webp`) and an Odoo logo when available; CSS-ring fallback until then. |

---

## Task 1: Remove Platform Foundation + orphaned CSS

**Files:**
- Modify: `index.html` (delete `#platform` section, currently lines 408–465)
- Modify: `assets/styles.css` (remove `.pf-ongoing`/`.pf-divider`/`.value-card` rules, currently lines ~382–396)

**Interfaces:**
- Consumes: nothing.
- Produces: a homepage without the Platform Foundation section; no orphaned CSS. Later tasks insert new sections in the freed space.

- [ ] **Step 1: Delete the `#platform` section**

In `index.html`, remove the entire block from `<!-- ============ PLATFORM FOUNDATION ============ -->` through its closing `</section>` (the `<section class="container" id="platform">` … `</section>`, lines 408–465). Leave the `<!-- ============ DELIVERY MODEL ============ -->` section intact immediately after.

- [ ] **Step 2: Remove now-orphaned CSS**

In `assets/styles.css`, delete these rules (only used by the removed section — `.layer-card` and `.il-visual` are NOT touched):

```css
.pf-divider{display:flex;align-items:center;gap:16px;justify-content:center; /* …full rule… */ }
.pf-divider::before,.pf-divider::after{ /* … */ }
.pf-divider::before{ /* … */ }
.pf-divider::after{ /* … */ }
.value-card{ /* …full rule… */ }
.value-card:hover{ /* … */ }
.value-card .ic{ /* … */ }
.value-card h4{ /* … */ }
.value-card p{ /* … */ }
```

Also remove any `.pf-ongoing` rule if present. Confirm none of these classes appear elsewhere first:

Run: `grep -rn "pf-divider\|value-card\|pf-ongoing" --include=*.html --include=*.css .`
Expected: after deletion, **no matches** anywhere (they were homepage-only).

- [ ] **Step 3: Verify (visual harness)**

Run the standard visual check. Confirm: page renders end-to-end, AI Engineering section now flows directly into Delivery Model, no layout gap, no console errors, both themes OK at both breakpoints.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/styles.css
git -c user.name="Vipul Sharma" -c user.email="vipul.nikki@gmail.com" commit --no-verify -m "Remove Platform Foundation section and orphaned CSS"
```

---

## Task 2: Add "AI Offerings" divider before the AI Product Suite

**Files:**
- Modify: `index.html` (insert divider before `<section class="container" id="products">`, line 158)
- Modify: `assets/styles.css` (add `.offer-divider` rule)

**Interfaces:**
- Consumes: nothing.
- Produces: `.offer-divider` reusable label component (reused conceptually for the Other-Business heading in Task 3, which uses a normal `.section-head`).

- [ ] **Step 1: Insert the divider markup**

In `index.html`, immediately **before** `<!-- ============ AI PRODUCT SUITE ============ -->`, add:

```html
  <!-- ============ AI OFFERINGS (umbrella label) ============ -->
  <div class="container offer-divider rv" id="ai-offerings">
    <span class="offer-kicker"><img src="assets/img/aivortex-mark.png" alt="" />AI Offerings</span>
    <p>AIVortex-powered products and agentic solutions — built for secure, governed, production AI.</p>
  </div>
```

- [ ] **Step 2: Add `.offer-divider` CSS**

In `assets/styles.css` (near other section helpers, e.g. after `.section-head` ~line 175), add:

```css
.offer-divider{padding-top:clamp(30px,5vw,56px);padding-bottom:6px;display:flex;flex-direction:column;gap:10px}
.offer-divider .offer-kicker{display:inline-flex;align-items:center;gap:10px;width:fit-content;
  font-family:'Space Grotesk';font-weight:600;font-size:clamp(1.15rem,2vw,1.5rem);color:var(--head);
  padding:8px 16px 8px 8px;border:1px solid var(--line);border-radius:999px;background:var(--panel)}
.offer-divider .offer-kicker img{height:30px;width:30px;background:#eef2f7;border-radius:50%;padding:4px}
[data-theme="dark"] .offer-divider .offer-kicker img{background:rgba(255,255,255,.06)}
.offer-divider p{color:var(--muted);font-size:.96rem;max-width:60ch;margin:0}
```

- [ ] **Step 3: Verify (visual harness)**

Confirm the "AI Offerings" pill label sits above the AI Product Suite, reads cleanly in both themes, mark image shows, no console errors, mobile stacks fine.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/styles.css
git -c user.name="Vipul Sharma" -c user.email="vipul.nikki@gmail.com" commit --no-verify -m "Add AI Offerings umbrella divider before AI Product Suite"
```

---

## Task 3: Add "Other Business Solutions Offerings" section (CRM, Microsoft ERP, Odoo)

**Files:**
- Modify: `index.html` (insert `<section id="offerings">` after `#agents` closes at line 301; update footer "Platform" column lines 550–557)

**Interfaces:**
- Consumes: existing `.card` / `.grid g3` / `.card-head` / `.card-link` styles (no new CSS needed).
- Produces: anchor `#offerings` — the scroll target for the CRM and ERP teaser chips in Task 5.

- [ ] **Step 1: Insert the new section**

In `index.html`, immediately **after** the Agentic Solutions section's closing `</section>` (line 301) and before `<!-- ============ INDUSTRY SOLUTIONS ============ -->`, add:

```html
  <!-- ============ OTHER BUSINESS SOLUTIONS OFFERINGS ============ -->
  <section class="container" id="offerings">
    <div class="section-head rv">
      <span class="eyebrow">Other Business Solutions Offerings</span>
      <h2>Core business platforms — implemented, integrated and ready for AI.</h2>
      <p class="lede">Beyond the AIVortex AI line, Infrability delivers the operational backbone: CRM and ERP, configured to your processes and ready for AIVortex agents to reason and act on.</p>
    </div>
    <div class="grid g3">

      <article class="card rv">
        <span class="product-tag">CRM</span>
        <div class="card-head">
          <div class="ic"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14a6 6 0 0 1 3 6"/></svg></div>
          <h3>Dynamics 365 CRM</h3>
        </div>
        <p>Infrability's Dynamics 365 CRM capability — sales, customer service and customer engagement, configured to your processes and made intelligent with AIVortex.</p>
        <div class="feat"><span>Sales</span><span>Customer Service</span><span>Engagement</span></div>
        <a class="card-link" href="microsoft.html#dynamics">Explore Dynamics 365 CRM <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>

      <article class="card rv">
        <span class="product-tag">ERP</span>
        <div class="card-head">
          <div class="ic"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></div>
          <h3>Microsoft ERP</h3>
        </div>
        <p>Dynamics 365 Finance &amp; Operations and Business Central — ERP for finance, operations, supply chain and inventory, implemented and integrated end to end.</p>
        <div class="feat"><span>Finance &amp; Operations</span><span>Business Central</span><span>Supply chain</span></div>
        <a class="card-link" href="microsoft.html#dynamics">Explore Microsoft ERP <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>

      <article class="card rv">
        <span class="product-tag">ERP</span>
        <div class="card-head">
          <div class="ic"><svg viewBox="0 0 24 24"><path d="M4 7l8-4 8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/></svg></div>
          <h3>Odoo ERP</h3>
        </div>
        <p>Open-source Odoo implementation and integration — a flexible, cost-effective ERP across finance, sales, inventory and operations, connected to your wider enterprise systems.</p>
        <div class="feat"><span>Open-source</span><span>Modular</span><span>Cost-effective</span></div>
        <a class="card-link" href="mailto:info@infrability.com?subject=Odoo%20ERP%20enquiry">Talk to us about Odoo <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>

    </div>
  </section>
```

> Odoo card uses an inline SVG placeholder icon for now. When the official Odoo logo asset is supplied, swap the Odoo card's `<div class="ic">…</div>` for `<div class="ic"><img src="assets/img/odoo-logo.svg" alt="Odoo" style="width:24px;height:24px"/></div>`.

- [ ] **Step 2: Update the footer "Platform" column**

In `index.html`, replace the footer column (lines 550–557) currently headed `<h5>Platform</h5>` with:

```html
      <div>
        <h5>Business Solutions</h5>
        <a href="#offerings">Dynamics 365 CRM</a>
        <a href="#offerings">Microsoft ERP</a>
        <a href="#offerings">Odoo ERP</a>
        <a href="microsoft.html">Microsoft Platform</a>
        <a href="#contact">Talk to us</a>
      </div>
```

- [ ] **Step 3: Verify (visual harness)**

Confirm: `#offerings` shows 3 cards in a row (desktop) / stacked (mobile), CRM + Microsoft ERP links go to `microsoft.html#dynamics`, Odoo link opens a mailto, both themes OK, footer column now reads "Business Solutions", no console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html
git -c user.name="Vipul Sharma" -c user.email="vipul.nikki@gmail.com" commit --no-verify -m "Add Other Business Solutions Offerings section (CRM, Microsoft ERP, Odoo)"
```

---

## Task 4: Rebuild hero as two-column with animated orb stage; relocate console

**Files:**
- Modify: `index.html` (hero section lines 62–105: restructure into `.hero-grid`; move `.console-wrap` out to a new block after the stats strip)
- Modify: `assets/styles.css` (add `.hero-grid`, `.hero-copy`, `.orb-stage` + orb motion; adjust hero alignment)

**Interfaces:**
- Consumes: existing `.il-visual` ring/disc/mark styles (reused as the orb fallback), existing `.badge`/`.hero-cta`/`.btn` styles.
- Produces: `.hero-copy` container (Task 5 inserts the `.hook` block inside it); `.orb-stage` element (Task 6 appends a `<canvas>` into it).

- [ ] **Step 1: Restructure the hero markup**

In `index.html`, replace the hero section body. The hero keeps `class="hero container"` and the `.hero-aurora` div, but its inner content becomes a two-column grid. The old `.hero-chips` row is dropped (decluttered). Replace lines 65–104 (the `.hero-inner` block and the `.console-wrap` block) with:

```html
    <div class="hero-grid">
      <div class="hero-inner hero-copy rv in">
        <span class="badge"><img src="assets/img/aivortex-mark.png" alt="" />Infrability AI Solutions · Powered by AIVortex</span>
        <h1>Enterprise AI agents, document intelligence and automation — <span class="gradtext">built for real business systems.</span></h1>
        <p class="sub">Infrability builds secure AI solutions that connect HRMS, ITSM, DMS, ERP, CRM, email, Dynamics 365, Power Platform and Azure into one intelligent operating layer — powered by AIVortex.</p>
        <!-- HOOK BLOCK INSERTED HERE IN TASK 5 -->
        <div class="hero-cta">
          <a class="btn" href="#products">Explore AI solutions</a>
          <a class="btn ghost" href="mailto:info@infrability.com?subject=Discovery%20call%20—%20Infrability%20AI">Book a discovery call</a>
        </div>
      </div>

      <div class="orb-stage rv in" aria-hidden="true">
        <span class="orb-glow"></span>
        <span class="ringz b"></span><span class="ringz a"></span>
        <span class="disc"></span>
        <img class="mark" src="assets/img/aivortex-mark.png" alt="" />
      </div>
    </div>
```

> The `.orb-stage` reuses the `.ringz`/`.disc`/`.mark` fallback (same as `.il-visual`) so it renders immediately with no image. When the generated orb images arrive, enable the image swap in Step 3's commented block — the rings stay underneath as a graceful fallback.

- [ ] **Step 2: Relocate the governance console below the stats strip**

Move the console markup (the former `.console-wrap` block, old lines 80–104) so it sits **after** the stats-strip `</section>` (old line 115) inside its own container:

```html
  <!-- ============ AIVORTEX CONSOLE (see it in action) ============ -->
  <section class="container" style="padding-top:8px">
    <div class="console-wrap rv">
      <div class="console" aria-label="AIVortex governance console — illustrative">
        <!-- …unchanged console-bar + console-body markup moved verbatim… -->
      </div>
    </div>
  </section>
```

- [ ] **Step 3: Add hero layout + orb CSS**

In `assets/styles.css`, after the existing `.hero` rules (~line 207), add:

```css
/* two-column hero */
.hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:1.05fr .95fr;
  gap:clamp(28px,5vw,64px);align-items:center;max-width:1180px;margin:0 auto}
.hero-copy{max-width:none;margin:0;text-align:left}
.hero-copy p.sub{margin-left:0;max-width:54ch}
.hero-copy .hero-cta{justify-content:flex-start}
@media(max-width:880px){
  .hero-grid{grid-template-columns:1fr;gap:30px}
  .orb-stage{order:-1;max-width:320px;margin:0 auto}
  .hero-copy{text-align:center}
  .hero-copy p.sub{margin-left:auto;margin-right:auto}
  .hero-copy .hero-cta{justify-content:center}
}

/* orb stage (reuses .ringz/.disc/.mark from .il-visual) */
.orb-stage{position:relative;aspect-ratio:1;display:grid;place-items:center;width:100%;max-width:480px;
  margin-left:auto;animation:orbFloat 8s ease-in-out infinite}
.orb-stage .ringz{position:absolute;border-radius:50%;border:1px solid var(--hair)}
.orb-stage .ringz.a{width:78%;height:78%}
.orb-stage .ringz.b{width:100%;height:100%;border-style:dashed;border-color:rgba(var(--azure-rgb),.25);
  animation:orbSpin 40s linear infinite}
.orb-stage .disc{position:absolute;width:62%;height:62%;border-radius:50%;
  background:radial-gradient(circle at 50% 40%,rgba(var(--cyan-rgb),.30),rgba(var(--violet-rgb),.12) 60%,transparent 72%);
  animation:orbBreath 6s ease-in-out infinite}
.orb-stage .mark{position:relative;z-index:2;width:38%}
.orb-stage .orb-glow{position:absolute;width:120%;height:120%;border-radius:50%;
  background:conic-gradient(from 0deg,rgba(var(--cyan-rgb),.0),rgba(var(--cyan-rgb),.22),rgba(var(--violet-rgb),.18),rgba(var(--azure-rgb),.0));
  filter:blur(28px);animation:orbSpin 18s linear infinite}

@keyframes orbSpin{to{transform:rotate(360deg)}}
@keyframes orbBreath{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.05);opacity:1}}
@keyframes orbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}

@media(prefers-reduced-motion:reduce){
  .orb-stage,.orb-stage .ringz.b,.orb-stage .disc,.orb-stage .orb-glow{animation:none}
}

/* When real generated orb images are supplied, uncomment to swap the rings for the image:
.orb-stage{background-image:var(--orb-img);background-size:contain;background-position:center;background-repeat:no-repeat}
:root{--orb-img:url('img/hero-orb-light.webp')}
[data-theme="dark"]{--orb-img:url('img/hero-orb-dark.webp')}
.orb-stage .ringz,.orb-stage .disc{opacity:0}
*/
```

> If `--azure-rgb` is not already defined as a token, use `rgba(46,155,255,.25)` (dark) / it degrades gracefully; the existing `.il-visual` rules already reference `--azure-rgb`, so it exists.

- [ ] **Step 4: Verify (visual harness)**

Confirm: hero is two columns on desktop (copy left, animated orb right) and stacks on mobile (orb above copy); orb rings spin / disc breathes / stage floats; glow rotates; with `prefers-reduced-motion` emulated the orb is static. Console now appears as its own band below the stats strip. Both themes OK, no console errors. (Emulate reduced motion via `browser_evaluate` is not available; instead spot-check the `@media` rule exists and screenshot normal motion.)

- [ ] **Step 5: Commit**

```bash
git add index.html assets/styles.css
git -c user.name="Vipul Sharma" -c user.email="vipul.nikki@gmail.com" commit --no-verify -m "Rebuild hero as two-column animated orb; relocate governance console"
```

---

## Task 5: Curiosity hook — interactive teaser chips

**Files:**
- Modify: `index.html` (insert `.hook` block inside `.hero-copy`, at the `<!-- HOOK BLOCK INSERTED HERE IN TASK 5 -->` marker)
- Modify: `assets/styles.css` (add `.hook` rules)
- Modify: `assets/main.js` (add `initHook()` and call it)

**Interfaces:**
- Consumes: `.hero-copy` container (Task 4); on-page anchors `#products`, `#agents`, `#offerings` (Task 3).
- Produces: nothing consumed downstream.

- [ ] **Step 1: Insert the hook markup**

In `index.html`, replace the `<!-- HOOK BLOCK INSERTED HERE IN TASK 5 -->` comment with:

```html
        <div class="hook" role="group" aria-label="What can AIVortex do for you?">
          <span class="hook-q">What can AIVortex do for you?</span>
          <div class="hook-chips">
            <button type="button" class="hook-chip is-active" data-answer="Compares regulations to your policies and flags compliance gaps." data-link="#products" data-link-label="Meet RegNexus" aria-pressed="true">Compliance</button>
            <button type="button" class="hook-chip" data-answer="Scores customer risk and supports AML/CFT review." data-link="#products" data-link-label="Meet RiskLens" aria-pressed="false">Risk</button>
            <button type="button" class="hook-chip" data-answer="Answers policy, leave, payroll and onboarding questions." data-link="#agents" data-link-label="Meet the HRMS Agent" aria-pressed="false">HR</button>
            <button type="button" class="hook-chip" data-answer="Triages incidents and suggests resolutions." data-link="#agents" data-link-label="Meet the ITSM Agent" aria-pressed="false">IT</button>
            <button type="button" class="hook-chip" data-answer="Dynamics 365 CRM, implemented and made intelligent." data-link="#offerings" data-link-label="See CRM" aria-pressed="false">CRM</button>
            <button type="button" class="hook-chip" data-answer="Microsoft &amp; Odoo ERP, implemented and integrated." data-link="#offerings" data-link-label="See ERP" aria-pressed="false">ERP</button>
          </div>
          <p class="hook-answer" aria-live="polite">
            <span class="hook-answer-text">Compares regulations to your policies and flags compliance gaps.</span>
            <a class="hook-answer-link" href="#products">Meet RegNexus →</a>
          </p>
        </div>
```

- [ ] **Step 2: Add `.hook` CSS**

In `assets/styles.css`, after the hero rules, add:

```css
.hook{margin-top:28px;padding:18px;border:1px solid var(--line);border-radius:16px;background:var(--panel);max-width:54ch}
.hero-copy .hook{text-align:left}
.hook-q{display:block;font-family:'Space Grotesk';font-weight:600;font-size:.98rem;color:var(--head);margin-bottom:12px}
.hook-chips{display:flex;flex-wrap:wrap;gap:8px}
.hook-chip{font-family:'JetBrains Mono';font-size:.74rem;letter-spacing:.04em;color:var(--ink-soft);
  background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:7px 13px;cursor:pointer;
  transition:transform .18s,border-color .18s,background .18s,color .18s}
.hook-chip:hover{transform:translateY(-2px);border-color:rgba(var(--cyan-rgb),.5)}
.hook-chip.is-active{color:var(--btn-ink);background:var(--grad);border-color:transparent}
.hook-chip:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
.hook-answer{margin-top:14px;font-size:.92rem;color:var(--muted);display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline}
.hook-answer-link{color:var(--cyan);font-family:'Space Grotesk';font-weight:500;white-space:nowrap}
.hook-answer-link:hover{color:var(--head)}
@media(max-width:880px){.hook{margin-left:auto;margin-right:auto}.hook-chips{justify-content:center}.hero-copy .hook{text-align:center}.hook-answer{justify-content:center}}
@media(prefers-reduced-motion:reduce){.hook-chip{transition:none}}
```

- [ ] **Step 3: Add `initHook()` to main.js**

In `assets/main.js`, append:

```js
function initHook(){
  var hook = document.querySelector('.hook');
  if(!hook) return;
  var chips = hook.querySelectorAll('.hook-chip');
  var answerText = hook.querySelector('.hook-answer-text');
  var answerLink = hook.querySelector('.hook-answer-link');
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      chips.forEach(function(c){ c.classList.remove('is-active'); c.setAttribute('aria-pressed','false'); });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed','true');
      answerText.textContent = chip.dataset.answer;
      answerLink.textContent = chip.dataset.linkLabel + ' →';
      answerLink.setAttribute('href', chip.dataset.link);
      var target = document.querySelector(chip.dataset.link);
      if(target){
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
      }
    });
  });
}
initHook();
```

> If `main.js` wraps init in a `DOMContentLoaded` handler or an IIFE, add the `initHook()` call inside that same scope instead of at top level. Verify by reading the bottom of `main.js` first.

- [ ] **Step 4: Verify (interaction, Playwright MCP)**

1. `browser_navigate` → `http://localhost:8000/index.html`
2. Confirm first chip ("Compliance") is active and the answer reads "Compares regulations…" with a "Meet RegNexus →" link.
3. `browser_click` the "CRM" chip → assert (via `browser_evaluate` returning `document.querySelector('.hook-answer-text').textContent`) it now reads "Dynamics 365 CRM, implemented and made intelligent." and the link `href` is `#offerings`, and the page scrolled to `#offerings`.
4. Tab to a chip and press Enter (`browser_press_key`) → same swap happens (keyboard works).
5. `browser_console_messages` → no errors. Check both themes + mobile.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/styles.css assets/main.js
git -c user.name="Vipul Sharma" -c user.email="vipul.nikki@gmail.com" commit --no-verify -m "Add interactive curiosity-hook teaser chips to hero"
```

---

## Task 6 (optional polish): Canvas particle field behind the orb

**Files:**
- Modify: `index.html` (add `<canvas class="orb-particles">` inside `.orb-stage`)
- Modify: `assets/styles.css` (position the canvas)
- Modify: `assets/main.js` (add `initOrbParticles()`)

**Interfaces:**
- Consumes: `.orb-stage` element (Task 4).
- Produces: nothing consumed downstream. Skippable without affecting other tasks.

- [ ] **Step 1: Add the canvas element**

In `index.html`, inside `.orb-stage`, add as the first child:

```html
        <canvas class="orb-particles" aria-hidden="true"></canvas>
```

- [ ] **Step 2: Position the canvas**

In `assets/styles.css` add:

```css
.orb-particles{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
.orb-stage .mark,.orb-stage .disc{z-index:2}
```

- [ ] **Step 3: Add `initOrbParticles()` to main.js**

Append to `assets/main.js`:

```js
function initOrbParticles(){
  var canvas = document.querySelector('.orb-particles');
  if(!canvas) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = canvas.getContext('2d');
  var stage = canvas.parentElement, raf = null, running = false, pts = [];
  function size(){ var r = stage.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; }
  function seed(){ pts = []; for(var i=0;i<28;i++){ pts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.6+.6}); } }
  function frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var styles = getComputedStyle(document.documentElement);
    var rgb = (styles.getPropertyValue('--cyan-rgb')||'25,224,208').trim();
    pts.forEach(function(p){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>canvas.width) p.vx*=-1;
      if(p.y<0||p.y>canvas.height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba('+rgb+',.5)'; ctx.fill();
    });
    raf = requestAnimationFrame(frame);
  }
  function start(){ if(running) return; running=true; size(); seed(); frame(); }
  function stop(){ running=false; if(raf) cancelAnimationFrame(raf); }
  var io = new IntersectionObserver(function(es){ es[0].isIntersecting ? start() : stop(); });
  io.observe(stage);
  window.addEventListener('resize', function(){ if(running){ size(); seed(); } });
}
initOrbParticles();
```

- [ ] **Step 4: Verify (visual harness)**

Confirm faint cyan particles drift behind the orb, the AIVortex mark stays on top, no flicker, `browser_console_messages` clean. Particles should pause when the hero scrolls out of view (spot-check no errors after scrolling). Both themes OK.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/styles.css assets/main.js
git -c user.name="Vipul Sharma" -c user.email="vipul.nikki@gmail.com" commit --no-verify -m "Add canvas particle field behind hero orb"
```

---

## Self-Review (against the spec)

**Spec coverage:**
- A1 Remove Platform Foundation → Task 1 ✅
- A2 AI Offerings umbrella (no re-listing) → Task 2 ✅; Other Business Solutions Offerings 3 cards (CRM, Microsoft ERP, Odoo) → Task 3 ✅
- A3 Footer update → Task 3 Step 2 ✅; nav left as-is (per spec "minimal change preferred") ✅
- B1 Two-column hero + console relocation → Task 4 ✅
- B2 Orb visual + motion + theme swap + CSS fallback + reduced-motion → Task 4 (Steps 3) ✅; canvas particles → Task 6 ✅
- B3 Interactive teaser chips (default active, swap answer+href, on-page scroll, a11y) → Task 5 ✅

**Placeholder scan:** Task 1 Step 2 abbreviates the CSS rules being *deleted* (with `/* … */`) — acceptable since they are removals identified by selector, not code to author. All authored code (HTML/CSS/JS) is complete. No TBD/TODO in deliverables.

**Type/name consistency:** `.hero-copy`, `.orb-stage`, `.hook`, `.hook-chip`, `.hook-answer-text`, `.hook-answer-link`, `#offerings`, `initHook`, `initOrbParticles` are used consistently across tasks. Chip `data-link` targets (`#products`, `#agents`, `#offerings`) all exist after Tasks 3–4.

**Dropped-content note:** Predictive ML & MLOps and Managed Support & TAM are intentionally removed (Task 1) per the approved spec — reversible later.
