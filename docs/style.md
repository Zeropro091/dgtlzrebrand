# Style & Implementation Guide

## The Web Style: Neo-Brutalism Meets Editorial
The DGTLZ visual identity does not fit into standard corporate "clean" web design. It is a deliberate fusion of specific avant-garde web design movements:

1. **Neo-Brutalism (Specifically: Technical / Swiss Brutalism)**
   * **The Distinction:** Unlike "Pop Neo-Brutalism" (which often uses playful pastel colors, thick cartoonish black borders, and heavy offset drop shadows like Gumroad), DGTLZ uses **Technical Brutalism**.
   * **Characteristics:** Exposed structural elements, absolute lack of shadows or depth, raw 1px (hairline) borders dividing the screen into rigid boxes, high-contrast colors (Electric Blue & White), and a rejection of traditional UX "softness" (rounded corners, subtle gradients).
   * **The Vibe:** Raw, unfinished, honest, architectural, cold, and serious. It treats the browser window as a concrete blueprint rather than a glossy magazine page.
2. **Utilitarian / Terminal Aesthetic**
   * **Characteristics:** Heavy use of monospaced fonts (JetBrains Mono), metadata tagging (`[ENTER IDENTIFIER]`, `TERMINAL_01`), uppercase technical labels, and interactive elements that feel like command-line inputs.
   * **The Vibe:** Machine-readable, hyper-efficient, data-driven, and slightly dystopian.
3. **High-Fashion / Avant-Garde Editorial**
   * **Characteristics:** Extreme typographic scale contrast. Pushing classic, elegant Serif fonts (EB Garamond) to massive, screen-filling sizes (120px+) right next to tiny 10px technical text. Asymmetrical layouts that prioritize mood over traditional balance.
   * **The Vibe:** High-end, exclusive, conceptual, and unapologetic.
4. **The Picture Style: 1-Bit Dithered Duotone**
   * **The Aesthetic:** The images simulate early digital bitmap displays (like 1980s Macintosh graphics), retro terminal CRT screens, or lo-fi photocopies / risograph prints.
   * **The Technique:** It combines a **Duotone** effect (stripping all natural colors and mapping the grayscale values strictly to Electric Blue and White) with a **Dither / Halftone pattern** (using a uniform grid of tiny dots to simulate shading and texture).
   * **The Purpose:** This strips away organic realism and forces every photograph into the rigid, mathematical, and highly technical aesthetic of the brand. Images stop being windows into reality and become structural graphic elements.

---

## CSS Architecture
The project utilizes Tailwind CSS combined with custom CSS variables for strict theming and layout control.

### Base Variables (`index.css`)
```css
@theme {
  --color-electric-blue: #0000F2;
  --color-off-white: #F5F5F5;
  --color-surface: #fbf8ff;
  
  --font-serif: "EB Garamond", serif;
  --font-mono: "JetBrains Mono", monospace;

  --text-display-xl: 120px;
  --text-headline-lg: 64px;
  --text-headline-md: 32px;
  --text-body-lg: 16px;
  --text-body-sm: 13px;
  --text-label-caps: 12px;

  --spacing-gutter: 24px;
  --spacing-margin: 40px;
}
```

## Typographic Classes
*   `.font-display-xl`: EB Garamond, 120px, uppercase, tight tracking (-0.04em). Used for monolithic hero section titles.
*   `.font-headline-lg`: EB Garamond, 64px, tight tracking (-0.02em). Used for main section headers.
*   `.font-headline-md`: EB Garamond, 32px. Used for sub-section headers and product card titles.
*   `.font-body-lg` / `.font-body-sm`: JetBrains Mono, normal casing. Used for paragraphs and extended doctrine text.
*   `.font-label-caps`: JetBrains Mono, 12px, uppercase, 0.1em letter-spacing. Used universally for metadata, tags, small UI elements, and navigation.

## The Dither Effect (Image Processing)
To achieve the signature DGTLZ 1-bit image style, wrap standard `<img>` tags in the following container structure. The CSS handles the grayscale conversion, contrast boosting, and multiply/screen blending.

```html
<div class="dither-container">
  <img src="YOUR_IMAGE_URL" class="w-full h-full object-cover" />
  <div class="absolute inset-0 dither-pattern opacity-20 pointer-events-none"></div>
</div>
```

```css
/* Required CSS in index.css */
.dither-container { position: relative; overflow: hidden; }
.dither-container img { filter: grayscale(1) contrast(1.5) brightness(1.1); mix-blend-mode: multiply; }
.dither-container::after { content: ""; position: absolute; inset: 0; background-color: var(--color-electric-blue); mix-blend-mode: screen; pointer-events: none; }
.dither-pattern { background-image: radial-gradient(circle, var(--color-electric-blue) 1px, transparent 1px); background-size: 3px 3px; }
```

## Structural Classes
*   `.p-margin`: Applies the standard 40px padding to major architectural sections.
*   `.p-gutter`: Applies the standard 24px padding within grid cells and smaller cards.
*   `border-electric-blue`: Used universally for all dividing lines, structural grids, and component borders. Borders are always `1px` or `2px` solid, never dashed or soft.
