# Design System Strategy: Anthracite & Amber

## 1. Overview & Creative North Star: "The Precision Console"
This design system is built to evoke the tactile, high-fidelity feel of professional studio equipment merged with the hyper-efficient logic of a modern Integrated Development Environment (IDE). We are moving away from the "flat web" aesthetic toward a **"Precision Console"**—a digital interface that feels like a physical, machined object.

### The Editorial Shift
To break the "template" look, this system rejects rigid, equal-width grids. Instead, we utilize **Intentional Asymmetry**. Larger specification displays (JetBrains Mono) should be offset against tight, functional UI controls (Inter). Overlapping elements—such as a component spec card bleeding slightly over a glassmorphism background—create a sense of three-dimensional depth and "physical" assembly.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in `surface` (#131313) to provide a void-like canvas where components appear to be "mounted."

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be achieved through:
- **Tonal Shifts:** Placing a `surface_container_low` card against a `surface_dim` background.
- **Negative Space:** Using the `16` (5.5rem) or `20` (7rem) spacing tokens to create mental groupings.
- **Luminance Contrast:** A subtle shift from `surface` to `surface_bright` defines a header without a single stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked obsidian plates.
- **Base Layer:** `surface_dim` (#131313).
- **Secondary Sectioning:** `surface_container_low` (#1c1b1b).
- **Primary Interaction Cards:** `surface_container` (#201f1f) with a `0.7rem` (`md`) radius.
- **Floating Details:** `surface_container_highest` (#353534) for tooltips or flyouts.

### The "Glass & Gradient" Rule
To achieve the "Soft Obsidian" look, use `surface_variant` with a 60% opacity and a `backdrop-blur` of 20px. For primary CTAs, do not use flat fills; apply a subtle linear gradient from `primary` (#ffdbaf) to `primary_container` (#ffb74d) at a 135-degree angle to mimic the sheen of a physical amber LED.

---

## 3. Typography: Technical Elegance
We use a dual-typeface system to balance human-centric navigation with machine-readable specs.

*   **Display & Headlines (`spaceGrotesk`):** Used for configuration titles (e.g., "Threadripper™ 7980X"). Its wide apertures and technical geometry provide the "High-end Audio" feel.
*   **Interface UI (`inter`):** Used for all functional labels, buttons, and navigation. 
*   **Technical Specs (`JetBrains Mono`):** (Referenced as an override for spec values). Use `label-md` size but with `letter-spacing: -0.02em` for an editorial, "monospaced-but-premium" look.

**Hierarchy Note:** Always pair a `display-lg` headline with a `body-sm` description to create high-contrast tension—this is the hallmark of premium editorial design.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too "web-native." We use **Ambient Glows** and **Tonal Stacking**.

*   **The Layering Principle:** Instead of a drop shadow, elevate a card by moving it from `surface_container_low` to `surface_container_high`. The eye perceives the increase in lightness as a move toward the light source.
*   **Ambient Shadows:** When a card must "float" (e.g., a modal), use a shadow with a 40px blur at 6% opacity, using the `primary_fixed_dim` color as the shadow tint. This mimics the light bleed from an amber status LED.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use `outline_variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components: The Configurator Kit

### Buttons
- **Primary (Amber):** Gradient fill (`primary` to `primary_container`). Text in `on_primary_fixed`. Use `xl` (1.5rem) roundness for a "pill" look that stands out against sharp-cornered hardware specs.
- **Secondary (Violet):** `secondary_container` background with `on_secondary_container` text. Use for secondary actions like "Compare Specs."
- **Tertiary (Ghost):** No background. `primary` text. Hover state shifts background to `surface_bright` at 10% opacity.

### Input Fields & Selectors
- **The Obsidian Input:** Use `surface_container_lowest` for the field background. The active state is signaled not by a border, but by a 2px `surface_tint` (#ffb954) bottom-aligned "status bar."
- **Typography in Inputs:** Use `JetBrains Mono` for numerical values (RAM, Storage) to emphasize the "workstation" nature.

### Cards & Lists (The "No-Divider" Rule)
- **Cards:** Forbid the use of divider lines between card header and body. Use a `1.4rem` (`4`) vertical gap to separate content.
- **Lists:** Separate items using a subtle shift in background color on hover (`surface_container_high`) rather than a line. 

### Custom Components: The "Spec-Meter"
For workstation performance metrics, use a custom horizontal bar using `primary` for the fill and `surface_container_highest` for the track. Add a subtle outer glow (`primary_fixed_dim`) to the fill to mimic a glowing vacuum tube.

---

## 6. Do's and Don'ts

### Do
- **Do** use `20` (7rem) spacing for top-level section margins to let the design "breathe" like a high-end magazine.
- **Do** use `secondary` (Cyber Violet) sparingly—only for "High-Performance" or "Turbo" mode indicators.
- **Do** use `surface_bright` for interactive icons to ensure they pop against the deep charcoal base.

### Don't
- **Don't** use pure white (#FFFFFF). Use `on_surface` (#e5e2e1) to maintain the "Soft Obsidian" mood.
- **Don't** use 90-degree corners. The `DEFAULT` (12px) radius is mandatory for all primary containers to maintain the "machined" feel.
- **Don't** use standard "drop shadows." If it doesn't look like an ambient glow from a light source, it doesn't belong in the system.
- **Don't** use traditional "Primary Blue" for links. Use `tertiary` (#b6e8ff) for a "chilled" tech blue that complements the warm amber.