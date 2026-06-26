---
name: Emerald Retail Logic
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff3ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fd'
  surface-container-highest: '#d9e3f7'
  on-surface: '#121c2a'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#273140'
  inverse-on-surface: '#ebf1ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#5a5c5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#737576'
  on-tertiary-container: '#fcfdfe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#f9f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f7'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The brand personality is authoritative, efficient, and sophisticated. It targets a discerning consumer who values both speed and quality. By combining heavy, geometric typography with expansive whitespace, the UI establishes a premium "boutique" feel while maintaining the high-octane conversion logic of a global marketplace.

The design style is **Modern Minimalism**. It avoids decorative clutter in favor of structural clarity, using high-contrast color blocking and precise alignment to guide the user through the shopping funnel. The aesthetic response should feel like a high-end physical flagship store: clean, organized, and quietly luxurious.

## Colors

The palette is anchored by a **Deep Emerald Green**, specifically selected to evoke trust, growth, and financial security—essential traits for a high-end ecommerce platform. 

- **Primary (Emerald):** Reserved for critical conversion points, trust badges, and active states.
- **Secondary (Ink Black):** Used for primary headings and brand-level UI elements to provide a grounded, premium feel.
- **Neutral (Charcoal & Slate):** Used for body text and secondary labels to ensure high legibility without the harshness of pure black.
- **Background (Pure White):** The canvas is kept clean to allow product photography to serve as the primary visual driver.

## Typography

This design system uses a dual-font strategy to balance brand character with functional utility. 

**Montserrat** is utilized for headings to mirror the wide, geometric, and bold nature of the brand's visual identity. It communicates strength and modernity. Large display titles should use tighter letter spacing to maintain a "locked-in" editorial look.

**Inter** is the workhorse for all UI elements, body copy, and data-rich product descriptions. It provides exceptional legibility at small sizes and maintains a neutral, professional tone that doesn't compete with product imagery.

## Layout & Spacing

The layout follows a **Fluid Grid** system based on a 12-column structure for desktop and a 4-column structure for mobile. 

- **Vertical Rhythm:** A strict 8px baseline grid ensures consistent vertical pacing. 
- **Product Grids:** On desktop, product cards should span 3 columns (4 per row) for standard browsing, or 4 columns (3 per row) for premium collections to emphasize detail.
- **Whitespace:** Use generous padding (stack-lg) between major sections like "Featured Categories" and "New Arrivals" to prevent a cluttered, discount-store appearance. 
- **Mobile Reflow:** Elements stack vertically, with horizontal swiping reserved for category chips and "Recommended" product carousels to maintain a manageable page length.

## Elevation & Depth

To maintain a "premium" feel, the design system avoids heavy shadows in favor of **Ambient Softness**. Depth is used sparingly to signify interactivity and layering.

1.  **Level 0 (Flat):** Used for the main background and input fields.
2.  **Level 1 (Surface):** Subtle 1px borders in light gray (#E5E7EB) define sections without adding visual weight.
3.  **Level 2 (Float):** Product cards and dropdowns use an extra-diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)) to appear as if they are resting gently on the surface.
4.  **Level 3 (Overlay):** Modals and cart drawers use a backdrop blur (8px) combined with a slightly deeper shadow to isolate the user's focus during checkout or quick-view actions.

## Shapes

The shape language is defined by **Rounded (Level 2)** geometry. This softening of edges balances the "sharp" and bold typography, making the interface feel more approachable and trustworthy.

- **Standard Cards:** Use a 12px-16px corner radius.
- **Primary Buttons:** Use a slightly higher radius or full pill-shape to distinguish action items from informational containers.
- **Input Fields:** 8px radius to maintain a professional, structured look.
- **Product Images:** Should always inherit the container's roundedness to ensure a unified visual package.

## Components

### Buttons
Primary buttons use the Deep Emerald background with white Montserrat SemiBold text. They include a subtle hover state where the green darkens by 10%. Secondary buttons use a transparent background with an Emerald border or Ink Black text.

### Product Cards
Cards are the heart of the system. They feature a 1:1 or 4:5 aspect ratio image, followed by a left-aligned product name in charcoal and the price in bold black. A subtle "Quick Add" button appears only on hover for desktop, reducing visual noise during browsing.

### Trust Badges & Labels
Small, high-contrast labels (e.g., "Best Seller", "Authentic") should use the label-md typography style. These are tucked into the top-left corner of product cards or placed near the "Add to Cart" button on product detail pages.

### Input Fields
Inputs are clean with a 1px light gray border. When focused, the border transitions to Deep Emerald with a soft 2px outer glow of the same color to provide clear feedback.

### Lists & Navigation
The header navigation uses Montserrat Medium for top-level categories. On hover, a wide "Mega-Menu" utilizes tonal layering (Level 3 elevation) to organize sub-categories into logical columns with clear hierarchy.