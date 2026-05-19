---
name: Professional Service Logic
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e8f2'
  surface-container-highest: '#e0e2ec'
  on-surface: '#191c23'
  on-surface-variant: '#414754'
  inverse-surface: '#2d3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#9e4300'
  on-tertiary: '#ffffff'
  tertiary-container: '#c55500'
  on-tertiary-container: '#0e0200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783100'
  background: '#f9f9ff'
  on-background: '#191c23'
  surface-variant: '#e0e2ec'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1280px
  gutter: 20px
  margin-mobile: 16px
---

## Brand & Style

The visual identity of the design system is centered on **Efficiency, Reliability, and Precision**. Designed for the UK mobile repair industry, the aesthetic prioritizes high-density information management without sacrificing clarity. 

The design style is **Corporate / Modern**, drawing inspiration from industry leaders like Stripe and Shopify. It utilizes a "Clean-Room" approach: ample whitespace, a crisp geometric foundation, and subtle depth to guide the user's focus toward critical repair data and customer statuses. The emotional goal is to reassure service managers that their operations are organized, professional, and under control.

## Colors

The palette is anchored by **Business Blue**, a color synonymous with trust and technical competence in the UK service sector. 

- **Primary**: Used for main actions, active states, and branding accents.
- **Neutrals**: A sophisticated range of cool greys (Slate) is used for typography and structural borders, ensuring the interface feels airy and modern.
- **Surface**: The background uses a very light tint (#F8FAFC) to differentiate the canvas from white card-based containers.
- **Semantic Colors**: Success, Warning, and Error colors are calibrated for high legibility against white backgrounds, specifically for "Repair Status" badges.

## Typography

This design system utilizes **Inter** for all UI roles due to its exceptional legibility on small screens and professional, neutral character. 

- **Headlines**: Use Semi-Bold (600) or Bold (700) weights with slight negative letter-spacing for a tight, "SaaS-native" look.
- **Body Text**: The default size is 14px (`body-md`) for data-heavy views, with 16px (`body-lg`) reserved for settings and marketing-adjacent pages.
- **Labels**: Small caps or medium-weight 12px labels are used for metadata, table headers, and form field hints.
- **Monospace**: For IMEI numbers, serial numbers, and reference codes, use a monospaced font to prevent character confusion.

## Layout & Spacing

The system follows a **Fixed-Fluid Hybrid Grid**. 
- **Dashboard/Admin**: Uses a fluid-width sidebar (240px–280px) with a flexible content area that expands to a maximum of 1440px to prevent excessive line lengths on ultra-wide monitors.
- **Spacing Rhythm**: A strict 8px linear scale ensures consistent vertical rhythm.
- **Data Grids**: Use "Comfortable" padding for desktop (12px-16px cell padding) and "Compact" for mobile repair logs (8px cell padding).
- **Margins**: Mobile views use a 16px side margin, while desktop views utilize a 24px or 32px margin to define the workspace.

## Elevation & Depth

Visual hierarchy is established using **Tonal Layers** supplemented by **Ambient Shadows**.

- **Level 0 (Floor)**: The background (#F8FAFC) is the lowest point.
- **Level 1 (Cards)**: White surfaces with a 1px border (#E2E8F0). In high-density views, shadows are omitted in favor of borders.
- **Level 2 (Overlays/Dropdowns)**: Soft, diffused shadows with a large blur radius (16px–24px) and low opacity (8%–10% black). This provides depth for menus without feeling heavy.
- **Active State**: Interactive elements may use a subtle inner shadow or a 2px primary color border to denote focus.

## Shapes

The design system employs a **Rounded** shape language to soften the industrial nature of service software.

- **Standard Elements**: Buttons, Input fields, and Cards use a 0.5rem (8px) corner radius.
- **Small Elements**: Checkboxes and status tags use a 0.25rem (4px) radius.
- **Large Elements**: Modal containers and feature highlights use a 1rem (16px) radius for a more approachable feel.
- **Full Round**: Used exclusively for notification badges and user avatars.

## Components

### Buttons
- **Primary**: Solid Business Blue with white text. 8px radius.
- **Secondary**: Ghost style with #E2E8F0 border and #1A73E8 text.
- **Critical**: Solid Red (#DC2626) for "Delete Repair" or "Cancel Order."

### Status Badges
High-contrast text on a low-opacity background of the same color (e.g., Success: Dark Green text on Light Green background). These are essential for identifying repair stages like "Pending," "In Progress," and "Ready for Collection."

### Data Tables
- Header rows use a light grey background (#F1F5F9) with 12px Medium-weight text.
- Row hover states use a subtle tint change to #F8FAFC.
- Vertical borders are avoided; use horizontal dividers only to maintain a clean flow.

### Form Fields
- Inputs feature a 1px border. On focus, the border changes to Business Blue with a subtle 3px outer glow (ring) of the same color at 20% opacity.
- Labels sit 4px above the input field in 12px Semi-Bold grey text.

### Cards
Cards are the primary container. They must always have a 1px border (#E2E8F0). For dashboard "Quick Stats," cards should include a small icon in the top right corner for visual indexing.