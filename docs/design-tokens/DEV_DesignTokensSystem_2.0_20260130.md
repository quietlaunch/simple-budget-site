DEV\_DesignTokensSystem\_2.0\_20260130  
Design Token Rules & Variable Names (Final & Authoritative)

---

1. Scope & Goals  
   Surfaces  
* fortunetell-frontend (app UI)  
* fortunetell-site (marketing)  
* simple-budget-site (product/SEO)  
* Any future FortuneTell surface

Goals

1. Single, universal token system across all surfaces.  
2. Minimal, tightly constrained set of tokens.  
3. No ad-hoc CSS values for colors, type, spacing, containers, or breakpoints.  
4. No semantic alias families that grow over time.  
5. Large visual changes are driven by a small set of tokens.  
6. AI and human implementers follow “one default rule per situation”.  
7. Any exception uses the V10 1% mechanism and must be explicitly documented.

All rules below assume that concrete values live only in tokens.json and are surfaced to CSS via a generated tokens.css.

---

1. Token Categories

1.1 Color Tokens — Base 11 Only

Theme (non-semantic)

* \--theme-primary  
* \--theme-secondary  
* \--theme-tertiary  
* \--theme-accent  
* \--theme-background

Semantic (forecast / state)

* \--semantic-color-safe  
* \--semantic-color-safe-hover  
* \--semantic-color-warning  
* \--semantic-color-warning-hover  
* \--semantic-color-danger  
* \--semantic-color-danger-hover

Rules

1. There are exactly 11 color tokens. No additions.  
2. All color usage in CSS must be var(--…) references to these tokens.  
3. No raw color literals (no \#…, rgb(), rgba(), hsl(), etc.).  
4. No extra color token families (no separate \--brand-*, \--status-*, \--surface-\*, etc.).  
5. Role/utility tokens may exist (for example, “button primary background”) but must resolve directly to one of the 11 base tokens.  
6. Visual nuance comes from layout, typography, spacing, and composition, not new colors.

1.1.1 High Contrast Behavior

Mechanism

* High-contrast mode is enabled by adding a class to the root element:  
  :root.ft-high-contrast { … }

Rules

1. In high-contrast mode, only \--theme-\* tokens may be remapped to increase contrast.  
2. \--semantic-color-\* tokens keep their underlying values; only their usage may change via structural tokens.  
3. High-contrast overrides may only:  
   * Remap existing tokens to other existing tokens, and  
   * Adjust composition of surfaces and text based on those tokens.  
4. High-contrast overrides must not introduce:  
   * New color tokens, or  
   * Raw color values.

---

1.2 Typography Tokens & Roles

1.2.1 Size Tokens

Font size tokens (values defined in tokens.json):

* \--font-size-2xl  
* \--font-size-xl  
* \--font-size-lg  
* \--font-size-md  
* \--font-size-sm  
* \--font-size-xs

These represent a strictly descending scale from largest (2xl) to smallest (xs).

1.2.2 Weight & Line-Height Tokens

* \--font-weight-normal  
* \--font-weight-bold

Optional line-heights per role (if needed):

* \--line-height-h1 … \--line-height-h6

Only these two weight tokens may be used.

1.2.3 Typographic Roles

Roles:

* h1  
* h2  
* h3  
* h4  
* h5  
* h6

Role → size mapping:

* h1 → \--font-size-2xl  
* h2 → \--font-size-xl  
* h3 → \--font-size-lg  
* h4 → \--font-size-md  
* h5 → \--font-size-sm  
* h6 → \--font-size-xs

Body text and small text

* Body text:  
  * Uses \--font-size-sm and \--font-weight-normal.  
  * Uses semantic text elements (, , etc.), not heading elements.  
* Small supporting text:  
  * Uses \--font-size-xs and \--font-weight-normal unless otherwise specified.  
  * Example contexts: helper text, metadata, timestamps, secondary labels (subject to 1% exception rules).

Global constraints

1. All text must use one of the six size tokens via the role mapping above.  
2. h5 is the size reference for body text; body text uses the same size token but is not implemented as an element.  
3. h6 / \--font-size-xs is the minimum text role; no roles smaller than this may be defined.  
4. Only \--font-weight-normal and \--font-weight-bold may be used; no additional weights.  
5. No ad-hoc font sizes or weights are allowed.

1.2.4 Helper and validation text

Rules

1. Helper text (explanatory text under or beside fields) must:  
   * Use the \--font-size-xs token with \--font-weight-normal, and  
   * Use a text color derived from the tertiary theme token.  
2. Error text (validation messages) must:  
   * Use the \--font-size-xs token with \--font-weight-normal, and  
   * Use a text color derived from the danger semantic token.  
3. Success/confirmation text (if present) must:  
   * Use the \--font-size-xs token with \--font-weight-normal, and  
   * Use a text color derived from the safe semantic token.  
4. No other dedicated sizes or colors may be introduced for helper/validation text:  
   * They must always use \--font-size-xs and a color derived from existing theme or semantic tokens.

1.2.5 1% Exception Candidates (Typography)

These contexts are allowed to request deviations under the V10 1% rule:

* Calendar day labels and numbers.  
* Dock bar labels.  
* History / transaction timestamps.  
* Account view dates.

Default:

* These must still use h5 or h6 roles (that is, \--font-size-sm or \--font-size-xs).

Any deviation:

* Is an explicit 1% exception,  
* Requires user authorization, and  
* Must be annotated in code (see 2.8).

---

1.3 Spacing Tokens

Tokens:

* \--space-1  
* \--space-2  
* \--space-3  
* \--space-4  
* \--space-5  
* \--space-6

Intended roles:

* \--space-1 — micro spacing (very tight internal adjustments, icon→text, badge internals).  
* \--space-2 — tight spacing (label→control spacing, tightly related items).  
* \--space-3 — primary spacing between components and default padding.  
* \--space-4 — card/panel internal padding.  
* \--space-5 — large gaps inside sections between major blocks.  
* \--space-6 — vertical padding for section bands.

Rules

1. All margins, padding, and layout gaps must use these spacing tokens.  
2. No other spacing tokens or raw spacing values are allowed.  
3. When unsure, default gap between components is \--space-3.

---

1.4 Radius & Border/Divider Tokens

Tokens:

* \--universal-element-radius  
* \--line-width-thin  
* \--line-width-thick

Conceptual line roles:

* Thin line → \--line-width-thin  
* Thick line → \--line-width-thick

Rules

1. \--universal-element-radius is the default radius for:  
   * Buttons, inputs, chips, cards/panels, and most interactive elements.  
2. Only the two line width tokens may be used for borders/dividers:  
   * \--line-width-thin  
   * \--line-width-thick  
3. Border colors must be chosen from theme or semantic color tokens; there is no separate border color palette.  
4. Any other radius or border width is a refactor target or a 1% exception.

---

1.5 Container Tokens

Tokens:

* \--container-sm  
* \--container-lg

Roles:

* \--container-sm:  
  * Narrow flows (forms, wizards, modal-like pages).  
* \--container-lg:  
  * Main content width for app and marketing surfaces.

Rules

1. These are the only container width tokens.  
2. Any constrained-content layout must choose either \--container-sm or \--container-lg.  
3. No additional container tokens may be added.

---

1.6 Breakpoint Tokens

Tokens:

* \--bp-sm  
* \--bp-md  
* \--bp-lg

Roles:

* \--bp-sm — “small” breakpoint.  
* \--bp-md — primary layout-change breakpoint.  
* \--bp-lg — large/desktop refinement breakpoint.

Rules

1. All media queries must use \--bp-sm, \--bp-md, or \--bp-lg.  
2. \--bp-md is the shared “major layout change” breakpoint (for example, 1→2 columns).  
3. \--bp-sm and \--bp-lg refine layout before/after \--bp-md; they do not define independent systems.  
4. No other breakpoint tokens may be introduced.

---

1.7 Icon Tokens

Tokens:

* \--icon-size-sm  
* \--icon-size-md  
* \--icon-size-lg

Conceptual mapping:

* \--icon-size-sm — aligned to body text scale.  
* \--icon-size-md — intermediate/icon emphasis size.  
* \--icon-size-lg — large icons (for example, dock or hero icons).

Rules

1. Only these three icon size tokens are allowed.  
2. All icons must use one of these tokens for both width and height.  
3. Icon colors must be chosen from the theme or semantic color tokens.  
4. No ad-hoc width/height values on icons.

---

2. Implementation Rules

2.1 Single Source of Values

1. All concrete values for tokens in this document are defined only in tokens.json (or equivalent structured source).  
2. tokens.css is generated from tokens.json and is the only CSS file allowed to define these tokens.  
3. No repository may define additional \--theme-*, \--semantic-*, \--space-*, \--container-*, \--bp-*, \--font-size-*, \--icon-size-\*, or border/radius tokens outside tokens.css.  
4. Any change to token names or roles must be reflected both in this spec and in tokens.json.  
5. tokens.css may contain only :root and :root.ft-high-contrast selectors.

2.2 No Raw Values

Rules

1. CSS must not contain raw literals for:  
   * Colors,  
   * Spacing,  
   * Font sizes,  
   * Container widths,  
   * Breakpoints.  
2. Any such literal is either:  
   * A defect to be refactored, or  
   * A 1% exception (2.8) and must be explicitly annotated.

2.3 No Shadows

Rules

1. No box-shadow (or equivalent shadow mechanism) is allowed.  
2. Visual hierarchy and separation use:  
   * Color tokens,  
   * Borders (--border-width-\*),  
   * Spacing (--space-\*),  
   * Typography.

2.5 Forms & Inputs

Scope:

* All forms and inputs across fortunetell-frontend, fortunetell-site, and simple-budget-site.

Inputs (text, amount, textarea, select, etc.):

* Font  
  * Uses body text role (size token \--font-size-sm, weight \--font-weight-normal).  
* Colors  
  * Text color: theme token.  
  * Placeholder color: tertiary theme token.  
  * Background: theme background token.  
  * Border (default): theme accent token.  
  * Border (focus): theme or semantic token according to focus rule (no new colors).  
  * Border (error): danger semantic token.  
  * Disabled:  
    * Text: tertiary theme token.  
    * Background: neutral tone derived from theme tokens.  
* Spacing  
  * Padding uses spacing tokens only.  
* Radius  
  * \--universal-element-radius.  
* States  
  * Default, focus, error, disabled are defined and consistent across surfaces.

Buttons (submit / primary actions):

* Font  
  * Uses body size; weight is either normal or bold depending on role, but consistent within each button style.  
* Colors  
  * Mapped from button color rules (see 2.6).  
* Spacing & Radius  
  * Padding from spacing tokens only.  
  * Radius: \--universal-element-radius.

Cross-surface requirements:

* All forms and inputs across all surfaces share the same token-based pattern for:  
  * Typography,  
  * Colors,  
  * Spacing,  
  * Radius,  
  * States.  
* Marketing/landing forms do not define their own independent system; they consume this one.

2.6 Buttons & Links — Semantic Assignment

Every actionable control must be assigned a semantic role:

* Primary: main forward action.  
* Secondary: neutral / supporting action.  
* Danger: destructive or risky action.

Rules

1. Button/link variants must be implemented using:  
   * The 11 color tokens,  
   * Typography and spacing tokens,  
   * \--universal-element-radius.  
2. Calendar day buttons use calendar semantics (based on semantic colors) and are not forced into button role tokens; they still use tokens but follow calendar rules (2.11).

2.7 Focus outlines

Rules

1. All keyboard and focus-visible outlines for interactive elements (buttons, links, inputs, selects, toggles) must use:  
   * \--border-width-thin or \--border-width-thick, and  
   * A color token derived from the theme or semantic set.  
2. The default focus outline pattern is:  
   * Border/outline width derived from \--border-width-thick,  
   * Color derived from the theme accent token.  
3. No component may introduce its own custom focus color or width outside these tokens.  
4. If a component needs a different focus treatment, it must:  
   * Still use \--border-width-thin or \--border-width-thick and a base color token, and  
   * Be explicitly documented in the component/module spec.

2.8 1% Exception Mechanism

Exceptions are allowed only under the V10 1% rule.

Rules

1. Any deviation from token rules (color, type, spacing, container, breakpoints, etc.) must:  
   * Be explicitly authorized, and  
   * Be annotated in code:  
     /\* USER authorized V10 exception: \*/  
2. Exceptions are component- and context-specific; they do not create new global patterns.  
3. Other components may not reuse an exception without separate authorization.  
4. Known typography exception candidates are listed in 1.2.5; spacing/layout exceptions are typically limited to the calendar (2.11).

2.9 Spacing & Layout Defaults (One Rule Per Situation)

When nothing more specific is specified, these are the defaults. AI and humans must use these as the single rule for each situation.

Card / Panel Padding

/\* All cards/panels \*/  
padding: var(--space-4);

Inter-component Gaps (stacks & inline groups)

/\* Between components in stacks/grids/flex rows \*/  
gap: var(--space-3);

Used for:

* Vertical stacks (component→component),  
* Horizontal flex/grid rows (item→item).

List / Table Row Spacing

/\* List/table rows \*/  
padding-block: var(--space-3);

No extra external row margins by default.

Form Label → Input Spacing

/\* Label stacked above control \*/  
margin-bottom: var(--space-2);

Page Body Padding (Horizontal)

/\* Page content from viewport edge \*/  
padding-inline: var(--space-3);

Applies unless a layout pattern overrides it.

Section Bands (Vertical Rhythm)

/\* Section band vertical padding \*/  
padding-block: var(--space-6);

Used for:

* Marketing sections,  
* High-level “banded” sections in app pages.

2.10 Layout Patterns (One Default Per Situation)

Using:

* Container tokens: \--container-sm, \--container-lg  
* Breakpoints: \--bp-sm, \--bp-md, \--bp-lg

2.10.1 Default Single-Column Page (App \+ Marketing)

Default layout when nothing else is specified.

* Wrapper:  
  * max-width: var(--container-lg);  
  * margin-inline: auto;  
* Padding:  
  * padding-inline: var(--space-3);  
* Sections:  
  * If using section bands, padding-block: var(--space-6);.

2.10.2 Narrow Flow (Forms/Wizards/Modals)

Used for focused flows such as auth, settings, wizards, modal-like pages.

* Wrapper:  
  * max-width: var(--container-sm);  
  * margin-inline: auto;  
* Padding:  
  * padding-inline: var(--space-3);  
* Vertical:  
  * If treated as a full page/section, padding-block: var(--space-6);.

2.10.3 Two-Column (Main \+ Sidebar)

* Wrapper:  
  * max-width: var(--container-lg);  
  * margin-inline: auto;  
  * padding-inline: var(--space-3);  
* Layout:  
  * Viewports below \--bp-md:  
    * Single column stack with gap: var(--space-5); between main and sidebar.  
  * Viewports at or above \--bp-md:  
    * Two columns with column-gap: var(--space-5);.

Used for dashboards or pages with secondary side content.

2.10.4 Grid Sections (Multi-Card Grids)

* Wrapper:  
  * Same as default single-column wrapper.  
* Grid:  
  * Viewports below \--bp-md: 1 column.  
  * Viewports at or above \--bp-md: up to 3 columns (or fewer if content is limited).  
* Gaps:  
  * row-gap: var(--space-5);  
  * column-gap: var(--space-5);

2.11 Calendar as a High-Care Component

Scope:

* Calendar month/day grid and any future calendar/day-grid/week-view modules.

Rules:

1. Calendar must always attempt to use standard 2.0 tokens:  
   * 11 color tokens,  
   * Typography roles,  
   * Spacing tokens,  
   * Containers,  
   * Breakpoints.  
2. Any deviation (for example, non-token spacing, typography outside h1–h6, custom width/breakpoint) is a 1% exception and must:  
   * Be explicitly authorized, and  
   * Be annotated in code:  
     /\* USER authorized V10 exception: \*/  
3. No silent exceptions are allowed.  
4. Other components do not get automatic access to calendar exceptions.

2.12 Banner \+ LogoF — Unified Pattern

2.12.1 LogoF Component

Component:

* Renders the “F” glyph inside a branded block.

Base class:

* .ft-logo-f

Rules:

* .ft-logo-f:  
  * Uses spacing and icon tokens to define its size.  
  * Uses semantic tokens for background.  
  * Uses theme tokens for text color.  
  * Uses \--universal-element-radius for radius.  
  * Uses typography tokens for font size and weight.  
* Spacing between LogoF and wordmark is handled by parent via gap.  
* No alternative LogoF styles are allowed without a V10 exception annotation.

2.12.2 Banner Structure

Canonical markup:

Rules:

1. Brand lockup (LogoF \+ wordmark) sits on the left.  
2. Surface-specific nav/CTAs are on the right inside .ft-banner\_\_nav.  
3. No other direct children of .ft-banner\_\_inner unless explicitly specified.

2.12.3 Banner Styling (Token-Only)

* .ft-banner:  
  * Full width.  
  * Background derived from \--theme-background.  
  * Bottom border derived from theme line token (accent color \+ thin width).  
  * Uses a fixed blur in implementation for frosted effect (no new colors).  
  * Positioned above content and below modals.  
* .ft-banner\_\_inner:  
  * max-width: var(--container-lg);  
  * Centered via margin-inline: auto;  
  * padding-inline: var(--space-3);  
  * padding-block derived from \--space-2.  
  * display: flex; align-items: center; justify-content: space-between;  
  * gap: var(--space-3); between brand and nav.  
* .ft-banner\_\_brand:  
  * display: inline-flex; align-items: center;  
  * gap: var(--space-2); between LogoF and wordmark.  
  * No text decoration.  
* .ft-banner\_\_wordmark:  
  * Uses h3 typography role and a text color token derived from \--theme-primary.  
* .ft-banner\_\_nav:  
  * display: inline-flex; align-items: center;  
  * gap: var(--space-3); between nav items.

Breakpoints:

* .ft-banner is full-width at all viewport sizes.  
* .ft-banner\_\_inner always uses container and padding rules above.  
* There are no breakpoint-specific banner style changes by default; responsive nav patterns are specified separately if needed.

Allowed by default:

* Contents of .ft-banner\_\_nav (links/buttons) using standard button and typography rules.

Not allowed without V10 exception:

* Changing banner height/padding/containers,  
* Changing LogoF colors, radius, or sizing,  
* Changing background behavior (for example, gradients, extra stripes).

Any override must include:

/\* USER authorized V10 exception: \*/

---

End of document.