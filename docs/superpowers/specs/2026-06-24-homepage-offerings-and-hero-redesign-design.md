# Homepage Offerings Restructure + Bold Generative Hero — Design

**Date:** 2026-06-24
**Driver:** Investor feedback
**Scope:** `index.html`, `assets/styles.css`, `assets/main.js`, new image assets in `assets/img/`

## Goal

Two changes to the Infrability homepage, driven by investor feedback:

1. **Restructure the offerings taxonomy** into two explicit, named buckets — *AI Offerings* and *Other Business Solutions Offerings* — and remove the "Platform Foundation" section.
2. **Make the landing page genuinely eye-catching** with a bold, animated AI hero and a curiosity hook that makes a first-time visitor want to discover the full breadth of what Infrability provides.

Out of scope: the Microsoft/Dynamics subpage, the 16 product subpages, and any backend/location-based image logic.

---

## Part A — Offerings Restructure

### A1. Remove "Platform Foundation"
Delete the entire `#platform` section from `index.html`. Per the decision to "keep CRM + ERP only," the following items are **dropped from the homepage** (they remain on `microsoft.html`):
- Power Platform, Azure & Private Cloud, Data Lakehouse, BI & Analytics, Integration Layer
- Predictive ML & MLOps, Managed Support & TAM

> Note: Predictive ML & MLOps and Managed Support & TAM were previously flagged (memory: `homepage-ia-declutter`, `original-site-gap-analysis`) as gaps not to lose. They are being dropped per explicit instruction this session; trivially reinstated later if the investor reverses.

### A2. New "Offerings" overview band
Add a new `<section id="offerings">` placed **immediately after the stats strip** (high on the page, before the AIVortex Intelligence Layer), so it frames the breadth of offerings early and reinforces the curiosity hook.

Structure — two clearly headed groups:

**AI Offerings**
- Short lede positioning AIVortex AI products + agentic solutions as the AI line.
- A compact list/chips of the AI line (RegNexus, RiskLens, Document Intelligence Hub, agents, …) that **deep-link down** to the existing detailed `#products` and `#agents` sections.
- CTA: "Explore AI products →" (to `#products`).

**Other Business Solutions Offerings**
- A **3-card row** (decision: three cards, so Odoo is visible on its own):
  1. **CRM — Dynamics 365** (the "Core CRM": Infrability's Dynamics 365 CRM capability — sales, service, customer engagement).
  2. **ERP — Microsoft** (Dynamics 365 Finance & Operations / Business Central).
  3. **ERP — Odoo** (open-source ERP implementation & integration).
- Each card links to `microsoft.html` where relevant (CRM, Microsoft ERP) and a contact/enquiry mailto for Odoo until a dedicated page exists.

Cards reuse the existing `.card` / `.grid g3` visual system for consistency. Odoo uses the official Odoo logo/wordmark (brand asset, supplied — not generated); Microsoft/Dynamics may use existing SVG iconography.

### A3. Navigation & footer
- Top nav: leave the existing "Platform" link (→ `microsoft.html`) as-is, OR optionally add an "Offerings" anchor (`#offerings`). Minimal change preferred; add `#offerings` only if it reads cleanly.
- Footer: rename the "Platform" column content lightly to reflect offerings (CRM / ERP — Microsoft / ERP — Odoo / Microsoft Platform). No structural footer changes.

---

## Part B — Bold Generative Hero + Curiosity Hook

### B1. Hero layout
Replace the current single-column hero (static aurora + governance console) with a **two-column bold hero**:

- **Left column:** badge, `<h1>`, sub-paragraph, the curiosity-hook chip block (B3), and the two CTAs (`Explore AI solutions`, `Book a discovery call`). Keep existing hero copy; the hook adds the curiosity device.
- **Right column:** an **orb visual stage** — the generated AI vortex orb as the centerpiece, with CSS/Canvas motion layered on the still image (B2).
- The **governance console** is moved **lower on the page** (relocated just below the stats strip or merged into the AIVortex Intelligence Layer area as a "see it in action" element), preserving its credibility content without competing with the new hero.
- Mobile: columns stack (orb above or below the text, sized down); chips wrap.

### B2. Orb visual + motion (still image + CSS/Canvas)
- **Assets (user-supplied, generated externally):**
  - `assets/img/hero-orb-dark.webp` — orb composed for dark theme (baked dark background).
  - `assets/img/hero-orb-light.webp` — orb composed for light theme (light background).
  - Optional: `assets/img/hero-orb.mp4` / `.webm` looping video; `assets/img/band-threads.webp` texture.
- **Theme handling:** the orb stage swaps image by theme using `[data-theme]` rules (CSS background-image on the stage element, or two `<img>` toggled via CSS). Default (light) shows the light orb; `data-theme="dark"` shows the dark orb.
- **Motion (CSS, on the still):** slow continuous rotation of a conic/radial glow overlay, a gentle scale/opacity "breathing" pulse, and a subtle float. Optional parallax: orb shifts slightly on scroll/pointer.
- **Particles (Canvas, optional layer):** lightweight drifting particle/node field behind the orb, drawn on a `<canvas>` sized to the stage. No external libraries.
- **If `hero-orb.mp4` is present:** use a looping muted `<video>` in place of the still; fall back to the still image otherwise.
- **Graceful fallback:** until the real images are delivered, the stage renders a pure-CSS gradient/ring orb (reuse existing `.il-visual` ring styling as the placeholder) so the page is never broken.
- **Performance/accessibility:** honor `prefers-reduced-motion: reduce` — disable canvas + rotation/pulse, show a static orb. Images lazy/optimized; canvas throttled and paused when off-screen.

### B3. Curiosity hook — interactive teaser chips
Under the H1/sub in the left column:

- Label line: **"What can AIVortex do for you?"**
- A row of chip buttons: **Compliance · Risk · HR · IT · CRM · ERP**.
- An **answer line** below the chips that updates when a chip is selected, e.g.:
  - Compliance → "Compares regulations to your policies and flags gaps." → RegNexus
  - Risk → "Scores customer risk and supports AML/CFT review." → RiskLens
  - HR → "Answers policy, leave, payroll and onboarding questions." → HRMS Agent
  - IT → "Triages incidents and suggests resolutions." → ITSM Agent
  - CRM → "Dynamics 365 CRM, implemented and made intelligent." → Other Business Solutions Offerings
  - ERP → "Microsoft & Odoo ERP, implemented and integrated." → Other Business Solutions Offerings
- Behavior: clicking a chip (1) swaps the answer text + the "learn more →" link target, and (2) smooth-scrolls to the relevant section. AI chips target `#products`/`#agents`/specific cards; CRM/ERP chips target `#offerings` (the Other Business Solutions band). **All targets stay on the homepage.**
- First chip is selected by default so the answer line is never empty.
- Accessibility: real `<button>`s in a labelled group, keyboard-navigable, `aria-pressed` on the active chip, answer region `aria-live="polite"`.

---

## Files & Components

| File | Change |
|------|--------|
| `index.html` | New `#offerings` band (A2); remove `#platform` (A1); rebuild hero markup as two-column with orb stage + chip hook (B1–B3); relocate console; footer tweak (A3). |
| `assets/styles.css` | `.hero` two-column layout + responsive stack; `.orb-stage` + theme image swap + motion keyframes; `.hook` chip block; `#offerings` band + reuse `.card`/`.grid`. Remove now-unused `#platform`-only rules (`.pf-ongoing`, `.value-card`, `.pf-divider`) if not referenced elsewhere — verify first. |
| `assets/main.js` | Chip interaction (swap answer + href + smooth-scroll, default selection, a11y); optional canvas particle field with reduced-motion + offscreen guards. Existing count-up/reveal logic untouched. |
| `assets/img/` | New: `hero-orb-dark.webp`, `hero-orb-light.webp` (essential); optional `hero-orb.mp4`/`.webm`, `band-threads.webp`; Odoo logo asset. |

## Theme & Responsive Requirements
- Must look correct in **both** light (default) and dark themes — two orb variants, chip/band colors from existing tokens.
- Verify at desktop (~1280px) and mobile (~420px) per established workflow (Playwright screenshots).

## Verification
- Hero renders with orb (or CSS fallback) + animated motion; reduced-motion shows static.
- Chips: default selected, click swaps answer + scrolls to correct on-page target, keyboard works.
- `#offerings` shows AI Offerings group + 3 Other-Business cards (CRM, Microsoft ERP, Odoo); links resolve.
- `#platform` fully removed; no dangling nav/footer links or orphaned CSS.
- Both themes + both breakpoints verified.

## Open items
- Final orb images (and optional video/texture) to be supplied by user; build proceeds with CSS fallback until then.
- Official Odoo logo asset to be supplied.
