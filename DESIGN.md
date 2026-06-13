# DESIGN.md — Conscious Travel

> Machine-readable design system for Impeccable, Hallmark, Taste Skill, and all Claude Code sessions.
> Every UI decision in this file is already implemented. Do NOT deviate from these tokens.

---

## Aesthetic Family

**Editorial-Atmospheric Luxury** — the visual language of a boutique slow-travel brand.

Closest references:
- Kinfolk magazine (generous whitespace, serif-led, photography-first)
- Aesop (warm minimal, typographic restraint, earthy palette)
- Cedarwood & Fir (editorial rhythm, asymmetric layouts)

Anti-references (never look like these):
- Airbnb — rounded cards, blue CTAs, info-dense grids
- Booking.com — purple-to-blue gradient, tabs, star ratings
- GetYourGuide — hero carousels with overlaid text, yellow badges
- Any site with: Inter as body font, purple/cyan gradients, floating 3D blobs

---

## Typography

### Fonts (all loaded via `next/font/google`, CSS variables already set)

| Role         | Family         | Variable                  | Use for                              |
|--------------|----------------|---------------------------|--------------------------------------|
| **Display**  | Fraunces       | `--font-serif-display`    | All headings h1–h4, pull quotes      |
| **Body**     | Manrope        | `--font-sans`             | Body copy, UI labels, form fields    |
| **Mono**     | Geist Mono     | `--font-geist-mono`       | Booking refs, codes only             |

**Tailwind classes:** `font-serif` = Fraunces, `font-sans` = Manrope, `font-mono` = Geist Mono

### Type Scale

```
Display XL:  font-serif text-5xl sm:text-6xl lg:text-7xl  tracking-[-0.03em]  weight-500
Display L:   font-serif text-4xl sm:text-5xl               tracking-[-0.025em] weight-500
H1:          font-serif text-3xl sm:text-4xl               tracking-[-0.02em]  weight-500
H2:          font-serif text-2xl sm:text-3xl               tracking-[-0.015em] weight-500
H3:          font-serif text-xl sm:text-2xl                tracking-[-0.01em]  weight-500
Body:        font-sans  text-base                          leading-[1.7]       weight-400/500
Small:       font-sans  text-sm                            leading-[1.6]       weight-400
Label:       font-sans  text-xs tracking-[0.15em] uppercase                    weight-500
```

**Rules:**
- NEVER use Inter, Roboto, Arial, or DM Sans
- Body text is Manrope, weight 400–500, never bold except for `<strong>`
- Headings always use Fraunces (`font-serif`), weight 400–600
- Tracking on labels: `tracking-[0.15em]` to `tracking-[0.25em]` uppercase
- Line height body: minimum 1.65, prefer 1.7

---

## Color System

All values are live CSS custom properties in `globals.css`. Use Tailwind semantic tokens, not raw hex.

### Semantic Tokens

| Token                     | Tailwind Class                  | Hex         | Use for                              |
|---------------------------|---------------------------------|-------------|--------------------------------------|
| `--background`            | `bg-background`                 | `#faf7f1`   | Page background — warm cream         |
| `--foreground`            | `text-foreground`               | `#1f2a24`   | Primary text — deep forest ink       |
| `--bg-soft`               | `bg-bg-soft`                    | `#f1ece1`   | Cards, chips, soft sections          |
| `--card`                  | `bg-card`                       | `#f1ece1`   | Card backgrounds                     |
| `--card-foreground`       | `text-card-foreground`          | `#1f2a24`   | Text inside cards                    |
| `--ink-soft`              | `text-ink-soft`                 | `#3a4640`   | Secondary body text                  |
| `--muted-foreground`      | `text-muted-foreground`         | `#8a8478`   | Captions, helper text, placeholders  |
| `--accent`                | `bg-accent`, `text-accent`      | `#2d5240`   | Forest green — interactive elements  |
| `--accent-foreground`     | `text-accent-foreground`        | `#faf7f1`   | Text on accent backgrounds           |
| `--accent-deep`           | `bg-accent-deep`                | `#162a22`   | Primary CTAs, nav, dark actions      |
| `--primary`               | `bg-primary`                    | `#162a22`   | Primary buttons                      |
| `--primary-foreground`    | `text-primary-foreground`       | `#faf7f1`   | Text on primary buttons              |
| `--border`                | `border-border`                 | `#e8dfcc`   | All borders — soft sand              |
| `--line`                  | `border-line`                   | `#e8dfcc`   | Dividers                             |
| `--destructive`           | `text-destructive`              | `#c54e3e`   | Errors — warm red                    |

### Color Rules

- NEVER: pure white (`#fff`), pure black (`#000`)
- NEVER: blue, teal, purple, cyan in ANY component — not even hover states
- NEVER: gradient that transitions between cool hues
- Green (`--accent`) is the ONLY action color. Use it sparingly.
- Warm neutrals dominate. Accent is used ≤3 times per view.
- Background is always warm cream (`--background`), never flat white

---

## Spacing & Layout

### Base Unit

All spacing is multiples of **8px** (0.5rem). Avoid 6px, 10px, 14px.

### Section Spacing

```
Section padding vertical:   py-20 sm:py-28 lg:py-36    (premium — breathe)
Section padding horizontal: px-6  sm:px-12 lg:px-20
Max content width:          max-w-6xl (1152px) or max-w-7xl for full-bleed
```

### Grid Philosophy

- **NOT every section is centered** — alternating left-align and center creates editorial rhythm
- Prefer `grid gap-12 lg:grid-cols-[1fr_360px]` (asymmetric) over equal columns
- Tour cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with `gap-8`
- Hero: full-bleed (`w-full min-h-screen`), NOT constrained max-width

### Border Radius

```
--radius-sm:  0.625rem  (10px) — small chips, tags
--radius-md:  0.875rem  (14px) — form inputs
--radius:     1.375rem  (22px) — cards (default)
--radius-xl:  1.75rem   (28px) — modals
--radius-2xl: 2.25rem   (36px) — large hero pills
Full pill:    rounded-full     — CTAs, navigation pills
```

---

## Motion

### Philosophy

Every animation must justify its existence. If you cannot state WHY it moves, remove it.

### Approved Easing

```js
// Entrance (elements entering view)
cubic-bezier(0.19, 1, 0.22, 1)    // expo-out — fast in, smooth settle

// Exit
cubic-bezier(0.4, 0, 1, 1)        // ease-in — quick, clean

// Micro (hover, click)
cubic-bezier(0.4, 0, 0.2, 1)      // standard — 150ms
```

### Duration Scale

```
Micro (hover, toggle):  100–150ms
Reveal (scroll entry):  400–600ms
Page transition:        300ms
Stagger delay:          60ms between items
```

### Scroll Reveals

```css
/* Only these two properties. No scale, no rotate, no blur. */
opacity: 0 → 1
translateY: 24px → 0
```

### Banned Animations

- NEVER: `bounce`, `spring`, `elastic` on UI elements
- NEVER: `scale` on card hover (use shadow or border instead)
- NEVER: infinite spin/pulse unless it's a loading indicator
- NEVER: `blur()` entrance — it looks like Instagram stories
- NEVER: Random floating blobs or particle systems outside the WebGL hero
- WebGL (Three.js, GSAP, Theatre.js): **hero section ONLY** — not scattered across pages

---

## Components

### CTA Buttons

```jsx
// Primary — dark pill
<button className="bg-accent-deep text-primary-foreground rounded-full px-6 h-11 text-sm font-medium transition-colors hover:bg-accent">
  Book Now
</button>

// Secondary — ghost
<button className="border border-border text-foreground rounded-full px-6 h-11 text-sm font-medium hover:bg-bg-soft transition-colors">
  Learn More
</button>
```

Rules:
- ALWAYS `rounded-full` for primary CTAs
- NEVER blue or purple button
- Max 2 CTAs per viewport
- Text: 13–14px, `font-medium` (never bold on buttons)

### Cards

```jsx
// Tour card — editorial style, NOT shadcn Card defaults
<div className="rounded-[var(--radius)] border border-border/60 bg-card overflow-hidden">
  {/* Image: aspect-ratio 16/10, NOT 4/3 */}
  {/* Title: font-serif text-xl */}
  {/* Category: text-xs tracking-[0.2em] uppercase text-muted-foreground */}
</div>
```

Rules:
- Box shadow: `shadow-sm` ONLY — never `shadow-md`, `shadow-xl`
- No `hover:shadow-xl` — use `hover:border-border` instead
- Card background: always `bg-card` (`#f1ece1`), never white

### Forms / Inputs

```jsx
<input className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none" />
```

### Labels / Category Tags

```jsx
<span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
  Eco · 7 days
</span>
```

---

## Layout Macrostructures

Use these named structures from Hallmark. DO NOT default to hero → 3-feature → CTA → footer.

| Page Type      | Preferred Structure              |
|----------------|----------------------------------|
| Home           | Editorial Split (WebGL left, text right) |
| Tours listing  | Masonry or Asymmetric Grid       |
| Tour detail    | Long-form editorial with sticky aside |
| Checkout       | Two-column [form | sticky summary] |
| About          | Text-heavy editorial letter      |
| Sustainability | Stat-led with inline quotes      |

---

## Anti-Slop Gates (run before shipping any component)

These are the 41-point Impeccable checks relevant to this project:

**Typography**
- [ ] No Inter, Roboto, or Arial anywhere in rendered output
- [ ] Headings use `font-serif` (Fraunces)
- [ ] Body text line-height ≥ 1.65
- [ ] Label tracking ≥ 0.15em when uppercase

**Color**
- [ ] No purple, blue, cyan, or teal anywhere
- [ ] No gradient between cool hues
- [ ] Background is warm cream, not white
- [ ] Accent (green) used ≤3 visible instances per viewport

**Layout**
- [ ] No centered hero with centered H1 + centered subtext + centered CTA (AI-slop tier 1)
- [ ] No hero → 3-equal-card → centered-CTA rhythm without deliberate variation
- [ ] Max-width sections have left or right aligned text, not always centered
- [ ] Card box-shadow is `shadow-sm` max — no `shadow-xl` on hover

**Motion**
- [ ] Every animation has a stated purpose (entrance, feedback, navigation)
- [ ] No bounce or elastic easing
- [ ] No floating particle elements outside hero

**Interaction**
- [ ] All interactive elements have `:focus-visible` ring (already in globals.css)
- [ ] Touch targets ≥ 44px height
- [ ] Hover states change border or background — not scale

---

## Tech Stack Reference

```
Framework:   Next.js 16.2 (App Router, React 19)
Styling:     Tailwind CSS v4 — use semantic tokens, never raw hex in JSX
Animation:   Framer Motion (motion/react), GSAP, Lenis (smooth scroll)
3D:          Three.js + @react-three/fiber — hero ONLY
DB:          Neon Postgres via Drizzle ORM
Payments:    Midtrans Snap
Email:       Resend / Gmail SMTP
Hosting:     Vercel
```

---

*This file is authoritative. It reflects the actual live codebase, not an aspiration.*
*Last updated: 2026-06-13*
