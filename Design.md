S---
name: Nocturne Remote
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c4c7c9'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8e9193'
  outline-variant: '#444749'
  surface-tint: '#c4c7c9'
  primary: '#ffffff'
  on-primary: '#2d3133'
  primary-container: '#e0e3e5'
  on-primary-container: '#626567'
  inverse-primary: '#5c5f61'
  secondary: '#b7c8e1'
  on-secondary: '#213145'
  secondary-container: '#3a4a5f'
  on-secondary-container: '#a9bad3'
  tertiary: '#ffffff'
  on-tertiary: '#32302a'
  tertiary-container: '#e7e2d9'
  on-tertiary-container: '#67645d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e0e3e5'
  primary-fixed-dim: '#c4c7c9'
  on-primary-fixed: '#191c1e'
  on-primary-fixed-variant: '#444749'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e7e2d9'
  tertiary-fixed-dim: '#cbc6bd'
  on-tertiary-fixed: '#1d1b16'
  on-tertiary-fixed-variant: '#494640'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  touch-target-min: 48px
  safe-margin: 24px
  gutter: 16px
  stack-gap: 12px
---

## Brand & Style
The design system is centered on a high-end, cinematic experience tailored for home theater environments. The brand personality is sophisticated, discreet, and premium, designed to fade into the background while remaining effortlessly functional in low-light settings. 

The aesthetic leverages **Glassmorphism** combined with **Minimalism**. By using depth and translucency rather than vibrant color, the UI mimics a high-tech glass console. This approach ensures that the interface feels like an extension of the hardware it controls—refined, precise, and unobtrusive.

## Colors
This design system utilizes a monochromatic palette to maintain a "dark room" focus. 
- **Primary:** A soft off-white used exclusively for high-contrast text and active iconography.
- **Secondary:** A muted slate gray for secondary labels and inactive states.
- **Neutral/Base:** A deep midnight navy (`#020617`) serves as the foundation, providing enough depth for the glass layers to "pop" against.
- **Functional Accents:** No vibrant colors are permitted. Statuses are indicated through opacity shifts and subtle stroke weight changes rather than hue changes.

## Typography
**Manrope** is selected for its modern, balanced proportions and exceptional legibility at various weights. Its geometric yet friendly character suits the sophisticated hardware-adjacent feel of the app. 

For technical data—such as device IDs, connection ports, or timestamps—**JetBrains Mono** is used in all-caps to provide a precise, "utility" feel that contrasts against the fluid glass containers. High contrast between weights is used to establish hierarchy without needing varied colors.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for one-handed mobile use. All primary interactions are concentrated in the "Thumb Zone" (the bottom 2/3 of the screen).

- **Touchpad:** A large, central fluid container that spans the width of the screen (minus margins).
- **Dock:** A bottom-aligned fixed bar for quick-launching apps.
- **Grid:** App libraries use a 3-column grid on mobile to ensure icons remain large enough for easy tapping.
- **Spacing:** A strict 8px-based system ensures mathematical harmony. Margins are generous (24px) to prevent accidental edge-taps when holding the device securely.

## Elevation & Depth
Depth is created through **Backdrop Blurs** and **Tonal Layering** rather than traditional drop shadows.
- **Level 0 (Background):** Solid Midnight Navy.
- **Level 1 (Main UI Containers):** `glass_fill` (40% opacity) with a 20px backdrop blur. These containers have a 1px solid `glass_stroke`.
- **Level 2 (Active Buttons/Cards):** Increased fill opacity (60%) and a subtle internal glow (inner shadow) to simulate light catching the edge of a physical glass pane.
- **Visual hierarchy:** Elements that are higher in the stack appear more opaque and have a slightly brighter border.

## Shapes
The shape language uses **Rounded** (0.5rem base) corners to feel ergonomic and friendly. 
- Large containers (Touchpads, App Cards) use `rounded-xl` (1.5rem) to mimic the rounded corners of modern smartphones and TV screens.
- Smaller elements (Chips, small buttons) use the base `rounded` (0.5rem) to maintain a crisp, professional look.

## Components
- **Buttons:** All buttons must meet the 48px minimum touch target. Primary remote buttons (Volume, Channel) are vertical glass pillars. Use high-weight icons (`primary_color_hex`) for clarity.
- **Glass Cards:** Used for App Library items. The card has no background color other than the frosted blur; the app icon itself provides the visual anchor.
- **Now Playing Scrubber:** A thin, horizontal line. The "played" portion is a solid white line, while the "unplayed" is a 10% white stroke. No bulky handles—the entire line is the touch target.
- **Navigation Dock:** A floating glass bar at the bottom of the screen with a more intense blur (40px) to separate it from the content scrolling behind it.
- **Connection List:** Simple list items separated by thin 8% white borders. Active device is indicated by a small white "connected" dot.