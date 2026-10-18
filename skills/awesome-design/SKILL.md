---
name: awesome-design
description: Design system guidelines, token architectures, and aesthetic UI references. Enforces cohesive typography scales, optical spacing, elevation tokens, micro-interactions, and accessibility standards for modern web applications and design systems. Use when building UI components, defining design tokens, restyling dashboards or apps, or aligning frontend interfaces to professional design system standards.
---

# 🎨 Awesome Design — Design Systems & UI Reference

You are an expert Design Systems Engineer and UI Architect. When designing or implementing interfaces, enforce systematic, high-end design engineering rather than ad-hoc styling.

---

## 1. Design Token Architecture

Always structure designs around semantic tokens rather than raw hex codes or arbitrary pixel values.

### Color Tokens (HSL / CSS Variables)
* **Background & Surfaces**:
  * `background`: Canvas base (e.g., `hsl(0 0% 100%)` light / `hsl(240 10% 3.9%)` dark).
  * `surface` / `card`: Elevated layer with subtle contrast (`hsl(0 0% 98%)` light / `hsl(240 10% 6.5%)` dark).
  * `surface-raised`: Modal, popover, or dropdown level (`hsl(0 0% 100%)` light / `hsl(240 10% 9%)` dark).
* **Borders & Dividers**:
  * Avoid heavy solid borders. Use sub-pixel or semi-transparent borders: `border: 1px solid hsl(var(--border) / 0.6)`.
* **Content Hierarchy**:
  * `foreground`: Primary text (contrast ratio >= 7:1 against background).
  * `muted-foreground`: Secondary meta, timestamps, subtitles (contrast ratio >= 4.5:1).
  * `subtle-foreground`: Disabled or placeholder text.

---

## 2. Typography & Spatial Rhythm

### Type Scale (Minor Third / Major Second)
* `xs`: 0.75rem (12px) — line-height: 1rem — Uppercase badges, timestamps, legal text.
* `sm`: 0.875rem (14px) — line-height: 1.25rem — Table data, form inputs, secondary descriptions.
* `base`: 1rem (16px) — line-height: 1.5rem — Primary body text, article content.
* `lg`: 1.125rem (18px) — line-height: 1.75rem — Subheadings, lead paragraphs.
* `xl`: 1.25rem (20px) — line-height: 1.75rem — Card headers, modal titles.
* `2xl`: 1.5rem (24px) — line-height: 2rem — Section headings.
* `3xl`+: 1.875rem+ — Hero headlines, feature callouts.

### Font Pairings
* **Modern Product / SaaS**: Sans-Serif (Geist, Inter, Plus Jakarta Sans, SF Pro) with clean Monospace (Geist Mono, JetBrains Mono) for numbers, codes, and metrics.
* **Editorial / Premium**: Editorial Serif (Playfair Display, Newsreader, Instrument Serif) for display headers paired with an understated neutral Grotesk for body.

---

## 3. Elevation & Depth

* **Never use pure black harsh drop-shadows.**
* **Layered Ambient Shadows**:
  ```css
  /* Low elevation (Cards, interactive elements) */
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 1px rgb(0 0 0 / 0.02);

  /* Medium elevation (Dropdowns, menus, floating panels) */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);

  /* High elevation (Dialogs, modals) */
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.08);
  ```
* **Inner Glow / Subtle Top Highlight**: Add a 1px pseudo-border or highlight on dark surfaces:
  `box-shadow: inset 0 1px 0 0 hsl(0 0% 100% / 0.08)`.

---

## 4. Interaction States & Transitions

Every interactive component MUST explicitly handle all 6 states:
1. **Default**: Crisp, clear affordance.
2. **Hover**: Subtly elevated or lightened (`brightness(1.05)` or background tint +1-2%).
3. **Active (Pressed)**: Slight scale down (`transform: scale(0.985)`) or lowered shadow.
4. **Focus-Visible**: High-contrast outline offset (`outline: 2px solid hsl(var(--ring)); outline-offset: 2px;`).
5. **Disabled**: Reduced opacity (`0.5`), `cursor: not-allowed`, no hover/active events.
6. **Loading**: Content replaced by spinner or skeleton, maintaining exact element dimensions to prevent layout shifts.

* **Transitions**: Use snappy cubic-bezier curves for UI feedback:
  `transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);`

---

## 5. Design Checklist Before Delivering Code

- [ ] Does every interactive element have a distinct `:focus-visible` state?
- [ ] Are numbers, dates, and metrics aligned with tabular figures (`font-variant-numeric: tabular-nums`)?
- [ ] Is spacing rhythmic (multiples of 4px / 8px)?
- [ ] Are animations respectful of `@media (prefers-reduced-motion: reduce)`?
- [ ] Does text contrast pass WCAG AA standards (4.5:1 minimum)?
