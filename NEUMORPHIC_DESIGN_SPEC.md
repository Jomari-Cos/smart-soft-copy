# Neumorphic Design Specification

## App Type
**SMART SOFT COPY — Modern Education Grade Mapping UI**

This document defines a modern Neumorphic 2.0 design system for a productivity application that automates grade mapping, visual scaffolding, and audio verification for teachers.

---

## 1. Visual Style: Neumorphism 2.0

### Core Logic
- Use a soft, extruded plastic aesthetic where UI elements appear to float above the background.
- Each component uses two shadows:
  - Light highlight on the upper-left
  - Dark shadow on the lower-right
- This creates the impression of subtle depth and tactile form.

### Surface and Shape
- Border-radius: `12px` to `20px`
- Surfaces should feel soft and organic rather than sharp or mechanical.
- UI elements should feel consistent in curvature across buttons, cards, inputs, and navigation.

### Elevation States
- **Elevated state**: buttons, cards, and panels use a softer outer shadow to appear lifted.
- **Pressed state / Active input**: use an inset shadow or reversed lighting to show a depressed effect.
- **Neutral surfaces**: use the same background color with subtle highlights and shadows for consistency.

---

## 2. Color Palette (Soft & Low-Contrast)

### Background Base
- Primary background: `#E0E5EC` (light mode)
- Secondary background: `#2D3436` (dark mode alternative)

### Accent Color
- Main accent: `#4F8CFF` (Electric Blue)
- Secondary accent: `#5BD4A4` (Soft Mint)
- CTA and critical alerts should use accent color or a contrasting variant.

### Shadow Colors
- Light highlight: `#FFFFFF` with 20% opacity -> `rgba(255, 255, 255, 0.8)`
- Dark shadow: `#A3B1C6` with 25% opacity -> `rgba(163, 177, 198, 0.25)`
- For dark mode: light highlight `rgba(65, 73, 81, 0.7)` and dark shadow `rgba(0, 0, 0, 0.45)`.

### Text Colors
- Primary text (light mode): `#2B3138`
- Secondary text: `#596A7C`
- Inverse text: `#F7F9FC`

---

## 3. Typography & Layout

### Font Family
- Primary: `Inter`, `Montserrat`, or `Poppins`
- Use weights: `400`, `500`, `600`, `700`

### Text Hierarchy
- Headings: high contrast and bold to stand out against low-contrast background.
- Body text: dark grey for readability, with `line-height: 1.6`.
- Secondary text: softer grey for labels, hints, and metadata.

### Grid System
- Use an `8pt` grid system.
- Spacing based on multiples of 8: `8px`, `16px`, `24px`, `32px`, `40px`, `48px`.
- Consistent padding and margin to avoid clutter around soft shadows.

### Layout Guidance
- Use generous whitespace around cards and form groups.
- Keep panels clearly separated but visually linked by shared background.
- Avoid tight clusters; let each neumorphic element breathe.

---

## 4. UI Components

### Buttons

#### Standard Button
- Background: `#E0E5EC`
- Border-radius: `16px`
- Box-shadow:
  - `8px 8px 20px rgba(163, 177, 198, 0.25)`
  - `-8px -8px 20px rgba(255, 255, 255, 0.8)`
- Text color: `#2B3138`

#### CTA Button
- Background: `#4F8CFF`
- Border-radius: `18px`
- Shadow:
  - `6px 6px 18px rgba(79, 140, 255, 0.22)`
  - `-6px -6px 18px rgba(255, 255, 255, 0.9)`
- Text color: `#FFFFFF`
- Hover: slightly darker blue and stronger outer shadow.

#### Toggled Button
- Default: elevated style with accent outline.
- Active: pressed inset effect.
- Example:
  - Idle: `background: #E0E5EC; border: 1px solid rgba(79, 140, 255, 0.18)`
  - Active: `box-shadow: inset 6px 6px 14px rgba(163, 177, 198, 0.25), inset -6px -6px 14px rgba(255,255,255,0.8); background: #F1F5FB;`

#### Floating Action Button (FAB)
- Shape: circle, `56px` or `64px`
- Background: accent color
- Shadow:
  - `12px 12px 24px rgba(79, 140, 255, 0.24)`
  - `-12px -12px 24px rgba(255, 255, 255, 0.7)`
- Icon: centered and bright white.

### Inputs

#### Recessed Search Bar
- Background: `#E8EDF4`
- Border-radius: `20px`
- Padding: `14px 18px`
- Shadow: `inset 6px 6px 12px rgba(163, 177, 198, 0.2), inset -6px -6px 12px rgba(255, 255, 255, 0.9)`
- Placeholder text: `#8A98A8`

#### Text Field
- Background: same as the search bar
- Border-radius: `16px`
- Border: none or very subtle `1px solid rgba(163, 177, 198, 0.18)`
- Focus state: inner glow with accent or dark highlight.
- Active/pressed state:
  - `box-shadow: inset 6px 6px 14px rgba(163, 177, 198, 0.25), inset -6px -6px 14px rgba(255,255,255,0.8);`

### Cards

#### Information Card
- Background: `#E0E5EC`
- Border-radius: `18px`
- Padding: `24px`
- Box-shadow:
  - `10px 10px 24px rgba(163, 177, 198, 0.22)`
  - `-10px -10px 24px rgba(255, 255, 255, 0.8)`
- Inner bevel: subtle top-left highlight and bottom-right shadow to create depth.

#### Card Header
- Use bold headings with `font-size: 18px`.
- Add a small accent pill or icon for quick status recognition.

#### Card Content
- Use grouped rows or columns.
- Keep data separated by subtle dividers or whitespace, not harsh lines.

### Navigation

#### Sidebar
- Background: `#E0E5EC`
- Width: `280px` or `320px`
- Use embedded labels and icons with soft dividers.
- Active menu item: elevated button style with accent glow.

#### Bottom Dock
- Use a large pill-shaped container with rounded corners.
- Apply a soft shadow beneath it for floating effect.
- Include 3–5 top-level actions or quick links.

#### Navigation Items
- Default: small neumorphic pill.
- Selected: raised accent with dark border and stronger shadow.

---

## 5. Accessibility Guidelines

- Maintain at least `4.5:1` contrast ratio for text on background.
- Use bold or dark text for important labels.
- Support keyboard focus states with a visible ring or glow.
- Provide text alternatives for icons and audio actions.
- Avoid relying only on color; use both iconography and labels.

---

## 6. Example CSS Framework

```css
:root {
  --bg: #E0E5EC;
  --surface: #E8EDF4;
  --surface-strong: #D6DBE3;
  --text-primary: #2B3138;
  --text-secondary: #596A7C;
  --accent: #4F8CFF;
  --accent-soft: #5BD4A4;
  --shadow-light: rgba(255,255,255,0.9);
  --shadow-dark: rgba(163,177,198,0.25);
}

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: 'Inter', 'Poppins', 'Montserrat', sans-serif;
  line-height: 1.6;
  margin: 0;
}

.neu-surface {
  background: var(--surface);
  border-radius: 18px;
  box-shadow:
    10px 10px 24px var(--shadow-dark),
    -10px -10px 24px var(--shadow-light);
}

.neu-pressed {
  box-shadow:
    inset 6px 6px 18px rgba(163,177,198,0.22),
    inset -6px -6px 18px rgba(255,255,255,0.75);
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: 16px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.button--primary {
  background: var(--accent);
  color: #fff;
  box-shadow:
    8px 8px 18px rgba(79,140,255,0.24),
    -8px -8px 18px rgba(255,255,255,0.7);
}

.button--primary:hover {
  transform: translateY(-1px);
}

.button--secondary {
  background: var(--surface);
  color: var(--text-primary);
  box-shadow:
    10px 10px 24px var(--shadow-dark),
    -10px -10px 24px var(--shadow-light);
}

.input {
  width: 100%;
  padding: 16px 20px;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid rgba(163,177,198,0.16);
  box-shadow:
    inset 6px 6px 16px rgba(163,177,198,0.18),
    inset -6px -6px 16px rgba(255,255,255,0.85);
  color: var(--text-primary);
}

.input:focus {
  outline: none;
  box-shadow:
    inset 4px 4px 12px rgba(163,177,198,0.24),
    inset -4px -4px 12px rgba(255,255,255,0.9),
    0 0 0 3px rgba(79,140,255,0.14);
}

.card {
  background: var(--surface);
  border-radius: 18px;
  padding: 24px;
  box-shadow:
    12px 12px 28px var(--shadow-dark),
    -12px -12px 28px var(--shadow-light);
}

.nav {
  background: var(--surface);
  border-radius: 20px;
  box-shadow:
    12px 12px 28px var(--shadow-dark),
    -12px -12px 28px var(--shadow-light);
}

.nav__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 16px;
}

.nav__item--active {
  background: rgba(79,140,255,0.12);
  box-shadow:
    inset 4px 4px 12px rgba(79,140,255,0.16),
    inset -4px -4px 12px rgba(255,255,255,0.75);
}
```

---

## 7. Component Usage Examples

### Primary CTA
- Use for main actions such as `Submit`, `Confirm`, or `Start Match`.
- Keep the label short and clear.
- Place it in cards or toolbars with enough margin.

### Secondary Buttons
- Use for actions like `Clear`, `Save Draft`, or `Cancel`.
- Keep them elevated but less visually dominant than CTA.

### Form Fields
- Use recessed styles for name search and grade entry fields.
- Active input fields should appear softly pressed.

### Cards
- Use large cards for grade-matching results, student details, and verification status.
- Group content inside cards using row spacing and small accent labels.

### Navigation
- Use a sidebar for desktop workflows and a bottom dock for mobile or compact screens.
- Keep navigation items consistent with the same neumorphic treatment.

---

## 8. Summary

This Neumorphic 2.0 design system is built for a modern educational productivity app with a polished, soft tactile feel. It balances gentle, low-contrast surfaces with strong text readability and clear CTA accent colors.

The key focus is on:
- Accessible typography and spacing
- Consistent extruded plastic shadows
- Clear elevated vs pressed states
- A calm, refined visual tone with bright accent signals

Use this specification as the foundation for implementing a visually modern and highly usable SMART SOFT COPY UI.
