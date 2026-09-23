# DGTLZ.AGENCY — Design System V.05

> **CLASSICAL HIGH-CONTRAST BRUTALISM / NEO-EDITORIAL PRINT**
> Single source of truth. Merged from: Brand Design System V.05 (master) + UI Doctrine.
> Status: MASTER DIRECTION — every contributor (human or AI agent) codes from this file.

---

## 00. CORE IDEA

**CLASSICAL FORM × DIGITAL DISTORTION**

DGTLZ treats design as an engineered artifact. The identity combines the
authority of classical art (Roman/Greek sculpture, editorial typography,
architectural grids) with the raw structure of digital systems (halftone
print textures, blueprint systems, controlled digital distortion).

**OLD ENOUGH TO HAVE AUTHORITY. NEW ENOUGH TO FEEL DANGEROUS.**

Brand promise: **BUILD THE NEXT.**

The visual formula:

```text
DGTLZ =
CLASSICAL IMAGE + EDITORIAL TYPE + VISIBLE GRID
+ KLEIN BLUE + TECHNICAL METADATA + CONTROLLED DISTORTION
```

---

## 01. DESIGN TOKENS

```yaml
version: v05-master
name: DGT.LZ Digital Brutalism

colors:
  primary: "#0B17EF"        # Klein Blue — hero, logo, banners, borders
  on-primary: "#FFFFFF"     # text over blue
  background: "#F4F4F2"     # primary canvas (off-white)
  surface: "#FFFFFF"        # clean surfaces
  surface-muted: "#EAEAE6"  # muted panels
  text-primary: "#111111"   # main text
  text-body: "#1E293B"      # body copy
  text-muted: "#334155"     # metadata
  border: "#0B17EF"         # all grid lines & borders
  black: "#050505"          # high-contrast moments

typography:
  display-hero:
    fontFamily: Bodoni MT, Didot, Playfair Display, serif
    fontSize: 72px            # desktop scale up to 160-220px on hero
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: -0.03em
  display-banner:
    fontFamily: Bodoni MT, Didot, Playfair Display, serif
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: 0.02em
  headline-card:
    fontFamily: Space Mono, JetBrains Mono, monospace
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.02em
  body-md:
    fontFamily: Inter, Helvetica Neue, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-mono:
    fontFamily: Space Mono, JetBrains Mono, monospace
    fontSize: 12px
    lineHeight: 1.5
  label-caps:
    fontFamily: JetBrains Mono, Space Mono, monospace
    fontSize: 11px
    fontWeight: 700
    letterSpacing: 0.12em
  label-meta:
    fontFamily: JetBrains Mono, Space Mono, monospace
    fontSize: 10px
    fontWeight: 500
    letterSpacing: 0.1em

rounded:
  none: 0px                   # THE radius. Always. No exceptions.

spacing:                      # strict 8px base system
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  5xl: 128px
  frame: 1px
```

### Color Ratio

**70% Off-White/White · 20% Klein Blue · 10% Black/Muted Gray**
Blue should be visually powerful but not everywhere. No gradients. No soft
transparency as a primary treatment.

### Type Scale (Desktop)

| Level | Size | Usage |
| :--- | :--- | :--- |
| Display XL | 160–220px | Hero |
| Display L | 100–140px | Major title |
| H1 | 72–96px | Section title |
| H2 | 48–64px | Subsection |
| H3 | 32–40px | Card title |
| Body L | 20–24px | Intro |
| Body | 16–18px | Standard |
| Meta | 11–13px | Technical |
| Micro | 9–10px | Index/label |

Mobile reduces scale aggressively while preserving hierarchy.

---

## 02. GRID SYSTEM — THE GRID IS PART OF THE BRAND

- Desktop: **12 columns** · Tablet: **8** · Mobile: **4**
- Gap: 16px (`--grid-gap`)

The grid is **visible whenever possible**. Use:

- vertical rules & horizontal dividers (1px `--color-border`)
- registration marks (＋)
- alignment lines
- section indexes (`01 /`, `02 /` …)

The grid is not invisible layout infrastructure. It is a primary visual
element — layouts read like architectural floor plans.

```css
.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
.rule { border: 1px solid var(--color-border); }
.blue-block { background: #0B17EF; color: #FFFFFF; }
```

---

## 03. NEO-BRUTALIST ARCHITECTURE (UI DOCTRINE)

1. **The Exposed Grid** — content housed in rigid blocks, separated by
   strict 1px/2px solid strokes. Never hidden.
2. **Flat Stacking (Zero Shadows)** — shadows, elevations, blurs, and
   gradients are forbidden. Elements do not float; they sit heavily.
3. **Sharp Geometry** — every button, card, input, container: `0px`
   border radius. Curves imply softness; we do not design for softness.

### Interactive Posture

- **Binary States** — hover/focus/active are immediate and machine-like.
  No slow fades, no subtle opacity.
- **Color Inversion** — hover triggers violent inversion: white bg/blue
  text → blue bg/white text. Instant.
- **Cursor as Tool** — cursor feels like a crosshair / terminal caret.

### Forbidden

- rounded cards & pill buttons
- soft shadows & glassmorphism
- excessive gradients
- floating soft UI
- bounce/elastic easing

---

## 04. THE TACTILE INTERFACE (WHAT IT SHOULD FEEL LIKE)

- **Sharp, Zero-Radius Geometry** — you mentally "feel" the corners.
  Sharp, dangerous, unapologetic. A world of razor wire, sheet metal, glass.
- **Infinite Gravity** — no drop shadows means no illusion of depth.
  Everything is bolted flat to the screen. Heavy, immovable, industrial.
- **Binary Tactility (The Snap)** — hover doesn't fade, it *snaps*. Like
  throwing a heavy industrial breaker switch: a mechanical *CLACK* from
  0 to 1. No in-between, no hesitation.
- **Friction as a Feature** — the layout is grid-locked. You navigate it
  deliberately, stepping over 1px borders like thresholds between
  concrete rooms. The user is active, not passive.

---

## 05. COMPONENT LANGUAGE

### Buttons

```text
[ VIEW PROJECT ]  [ START A PROJECT ]  [ EXPLORE SYSTEM ]
```

Square, uppercase, tracked typography, sharp border, no shadow, no pill.

```css
button {
  border: 1px solid currentColor;
  border-radius: 0;
  background: transparent;
  padding: 12px 18px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

### Cards (editorial panels, not SaaS cards)

```text
┌─────────────────────────────┐
│  01 / IDENTITY              │
│  PROJECT TITLE              │
│  BRAND / DIGITAL / CULTURE  │
├─────────────────────────────┤
│  VIEW CASE →                │
└─────────────────────────────┘
```

### Step Badges

Inverted square chips (`01`, `02`) at card origins — `background:
primary`, `color: on-primary`, `padding: 6px`, `radius: 0`.

### Section Divider (signature)

Full-width Klein Blue block:

```text
██████████████████████████████████████
  02 / SELECTED WORK
██████████████████████████████████████
```

White, bold, uppercase, editorial, tightly tracked.

### Navigation

```text
HOME   ABOUT   WORK   SERVICES   BLOG   CONTACT
```

Generous letter spacing. JetBrains Mono. Fixed top — a structural steel
beam. Houses the terminal command center.

### Forms

Inputs reduced to minimum: underlines or full-box outlines, `0px` radius.
Labels above in `label-caps` (mono, uppercase, tracked). Placeholders
sound like system prompts: `[ENTER IDENTIFIER]`, `TRANSMIT DATA`.

---

## 06. ICONOGRAPHY

Geometric, technical, monoline, sharp, grid-based. Use sparingly.

```text
＋   ×   →   ↗   ⌁   □   ┼   ✦
```

The four-point DGTLZ star (✦) — orientation + precision + progress —
dominates over conventional UI iconography.

---

## 07. IMAGERY DIRECTION

Tension between **ANCIENT × DIGITAL**.

**Preferred subjects:** Roman busts, Greek sculpture, marble fragments,
columns, architecture, brutalist buildings, computer hardware, screens,
digital artifacts.

**Treatment:** monochrome, Klein Blue duotone, halftone, dithering, hard
threshold, grain, hard crop, extreme contrast.

**Avoid:** generic stock, lifestyle smiles, polished corporate
photography, soft gradients, pastel filters.

### Classical Image Frame (archive metadata)

Every major classical image gets a technical frame:

```text
┌───────────────────────────────┐
│ T_07                          │
│ ROME                          │
│ C. 120 AD                     │
│                               │
│          [ SCULPTURE ]        │
│                               │
│ GRID 04 / ARCHIVE 017         │
└───────────────────────────────┘
```

Metadata reads like a museum catalog. Prefix labels with technical syntax
(`//`, `[...]`).

**Live example:** the team section — 5 marble portraits from the Met
Museum Open Access collection rendered in `public/team/`.

---

## 08. GLITCH SYSTEM

Glitch is an **accent**, not the identity.

**Allowed:** horizontal displacement, pixel slicing, scanline
interruption, duplicated type, registration offset, raster corruption,
cropped letters, broken grids.

**Rule: 80% STRUCTURE / 20% DISTORTION.**
The design must survive with the glitch removed.

---

## 09. MOTION PRINCIPLES

Mechanical, never soft.

**Preferred:** hard cuts, linear movement, snap transitions, horizontal
wipes, grid expansion, type reveal, image displacement, controlled glitch.

**Avoid:** bounce, elastic easing, floating cards, soft parallax.

```text
Fast:   120–180ms
Medium: 240–360ms
Slow:   500–800ms
```

Mostly linear or sharply controlled easing.

### Reduced Motion (mandatory)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 10. BRAND VOICE & COPY RULES

**Voice:** confident, precise, intelligent, brief, culturally aware.

**Prefer:** `BUILD THE NEXT.` over "We are a passionate team helping
brands achieve their digital goals."
**Prefer:** `IDENTITY / SYSTEM / EXPERIENCE` over "Our comprehensive
range of creative services."

**Use:** short statements, active verbs, technical language, editorial
captions, strong nouns, controlled provocation.
**Avoid:** corporate jargon, motivational clichés, vague promises,
overly friendly copy, unnecessary adjectives.

**Campaign lines:** MAKE IT CONCRETE. / DESIGN WITH WEIGHT. / STRUCTURE
THE UNKNOWN. / CULTURE MEETS CODE. / NO SOFT EDGES. / BUILT, NOT
DECORATED. / FROM ARTIFACT TO INTERFACE. / SYSTEMS FOR THE NEXT ERA.

---

## 11. ACCESSIBILITY

Brutalism never compromises usability:

- sufficient text contrast
- visible focus states
- keyboard navigation
- readable body text
- semantic HTML, alt text
- reduced-motion support (above)

Experimental visuals belong **around** the information architecture,
never in place of it.

---

## 12. DESIGN PROCESS

```text
01 / DECODE    → understand brand, audience, culture, problem
02 / DEFINE    → strategy, positioning, visual territory, system
03 / CONSTRUCT → identity, typography, grid, imagery, components
04 / DISTORT   → experimentation, contrast, glitch, cultural tension
05 / DEPLOY    → real-world digital & physical applications
```

---

## 13. RULE OF THREE

Every DGTLZ composition contains at least three layers:

1. **STRUCTURE** — grid, border, typography, alignment
2. **CULTURE** — sculpture, architecture, editorial reference
3. **DIGITAL** — glitch, raster, interface, technical notation

If all three are present, the work feels like DGTLZ.

---

## 14. DO / DON'T

**DO:** extreme scale · hard borders · expose the grid · serif + mono
pairing · decisive blue · aggressive crops · archive references ·
information density · controlled imperfection.

**DON'T:** make everything minimal · round components · soft shadows ·
gradient overuse · random glitch · decoration without concept · generic
stock aesthetics · sacrifice readability for style.

---

## 15. IMPLEMENTATION STATUS (dgt-remake)

| Token/Rule | Status |
| :--- | :--- |
| Playfair Display (display serif) | ✅ loaded via Google Fonts |
| JetBrains Mono (mono) | ✅ active |
| Klein Blue `#0B17EF` | ⚠️ site uses `#0000F2` — sync pending |
| Off-white `#F4F4F2` | ⚠️ site uses `#F5F5F5` — sync pending |
| 0px radius everywhere | ✅ |
| Visible grid borders | ✅ |
| Marble team portraits (Met Museum) | ✅ deployed |
| Section dividers (blue blocks) | ✅ |
| Reduced-motion guard | ⏳ not yet verified in build |
| Favicon (✦ star on Klein Blue chip) | ✅ `public/favicon.svg` + PNG set (16–512), wired in `index.html` |

> **Sync rule:** when this file changes, `src/index.css` @theme tokens
> must be updated to match, then `npm run build` + deploy.
