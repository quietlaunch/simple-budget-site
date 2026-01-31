### **DEV\_DesignArchitectureAddendum\_10.2.4\_20260130**

*Design Architecture Addendum — Token System 2.0 Integration*

---

## **0\. Scope and Authority**

**Scope**

This addendum defines the **CSS architecture** for all FortuneTell surfaces:

* App frontend  
* Marketing site(s)  
* Product/SEO site(s)  
* Any future web UI

**Authority**

* This document is binding for how styling is structured in all web repos.  
* It **implements** and **depends on**:  
  * `DEV_DesignTokensSystem_2.0_20260130` (rules \+ token names, no values).  
  * `tokens.yaml` (single source of all numeric/token values).  
* It supersedes any previous CSS layering guidance; the architecture described here is the only valid model going forward.

---

## **1\. Styling Architecture**

The styling system has **exactly two layers**:

1. **Token layer**  
   * A generated stylesheet (`tokens.css`) that:  
     * Declares all design tokens as CSS custom properties on `:root`.  
     * Contains **no** selectors, classes, or layout rules.  
   * All token names and roles are defined in `DEV_DesignTokensSystem_2.0_20260130`.  
   * All token values are defined only in `tokens.yaml`.  
2. **Component layer**  
   * Component-scoped stylesheets (`*.module.css` or equivalent) attached to UI components.  
   * Every visible style (layout, spacing, colors, typography) is implemented here **using only** token references.

No additional shared or global styling layers are permitted.

---

## **2\. Token Ownership and Generation**

### **2.1 Single Source of Truth**

1. `DEV_DesignTokensSystem_2.0_20260130` defines:  
   * Token names,  
   * Token categories,  
   * Behavioral rules,  
   * “One rule per situation” defaults.  
2. `tokens.yaml` defines:  
   * Concrete values for:  
     * Color tokens,  
     * Typography tokens,  
     * Spacing tokens,  
     * Radius/border tokens,  
     * Container tokens,  
     * Breakpoint tokens,  
     * Icon size tokens.  
3. `tokens.css` is generated from `tokens.yaml` and:  
   * Declares all tokens as `--token-name` on `:root`.  
   * Is the **only** CSS file that may define CSS custom properties.

### **2.2 Hard Rules**

* Only `tokens.css` may contain `--token-name` declarations.  
* Component stylesheets:  
  * **Must not** declare any `--*` variables.  
  * **Must not** create alias variables (for example, a second naming layer over the 2.0 tokens).  
* Any change to token values must be made by:  
  * Updating `tokens.yaml`,  
  * Regenerating `tokens.css`,  
  * Not by editing CSS directly.

---

## **3\. Module Stylesheets — Responsibilities and Limits**

Component stylesheets (`*.module.css` or equivalent) are the only place where styling logic lives, apart from token definitions.

### **3.1 Allowed in Modules**

Modules may:

* Define **layout and composition**:  
  * `display`, `flex`, `grid`, `gap`, alignment, positioning, etc.  
* Apply **spacing** using only spacing tokens:  
  * `margin`, `padding`, `gap` with `var(--space-*)`.  
* Apply **colors** using only:  
  * Theme tokens `var(--theme-*)`,  
  * Semantic tokens `var(--semantic-color-*)`.  
* Apply **typography** using only:  
  * Font-size tokens (`var(--font-size-*)`),  
  * Font-weight tokens (`var(--font-weight-normal)` / `var(--font-weight-bold)`),  
  * Any line-height tokens defined in the token system.  
* Apply **radii and borders** using only:  
  * `var(--universal-element-radius)`,  
  * Line width tokens,  
  * Theme/semantic color tokens.  
* Implement **state styles**:  
  * Hover, focus, active, disabled, error, etc., expressed entirely in terms of tokens and allowed transforms.

### **3.2 Forbidden in Modules**

Modules may **not**:

* Use raw literals for:  
  * Colors,  
  * Spacing,  
  * Font sizes,  
  * Border widths or radii,  
  * Container widths,  
  * Breakpoints.  
* Declare any CSS custom properties (`--*`).  
* Invent additional token families or alias layers.  
* Implement shadows of any kind (no `box-shadow`).  
* Implement independent contrast or theme behavior (contrast is driven only by token overrides).

If a needed value is not expressible via existing tokens, it is either:

* A spec gap that must be addressed by updating `DEV_DesignTokensSystem_2.0_20260130` \+ `tokens.yaml`, or  
* A candidate for a 1% exception (see §9).

---

## **4\. Cross-Surface Application**

The architecture in this addendum applies uniformly across all web repos.

**Requirements**

* All repos import the same generated `tokens.css`.  
* All visible styling is implemented in component stylesheets under Pattern A.  
* Any previous styling approach that relied on shared, non-component CSS layers is considered legacy and must be treated as a migration target toward this architecture.

There is exactly one design system and one token system across all surfaces.

---

## **5\. Layout, Spacing, and “One Rule per Situation”**

`DEV_DesignTokensSystem_2.0_20260130` defines:

* The final spacing token set,  
* The container and breakpoint tokens,  
* Single default rules for common situations (card padding, inter-component gaps, list rows, forms, page padding, section bands, layout patterns).

**Architectural rules**

1. Component styles must use the documented default for each situation unless:  
   * A more specific rule is explicitly documented in the spec, or  
   * A 1% exception has been explicitly authorized and annotated.  
2. Common patterns such as:  
   * Single-column page layout,  
   * Narrow form flow,  
   * Two-column (main \+ sidebar),  
   * Multi-card grid,  
     are built in components using container and spacing tokens, following the defaults defined in the 2.0 token system.  
3. Components **must not** introduce alternative spacing scales, container widths, or breakpoints.

The architecture thus encodes “one default rule per situation” as the baseline behavior for all modules.

---

## **6\. Forms and Inputs**

Forms and inputs are implemented as components that consume the token system.

**Architectural rules**

1. All form-related styling (inputs, textareas, selects, buttons, helper text, error messages):  
   * Uses typography roles and font-size tokens.  
   * Uses color tokens from the theme and semantic sets.  
   * Uses spacing tokens only.  
   * Uses `--universal-element-radius` for corners.  
   * Uses line width tokens for borders.  
2. Cross-surface consistency:  
   * Forms on all surfaces must use the same token-driven patterns.  
   * Surfaces cannot define separate visual systems for basic controls.  
3. Any shared form primitives (for example, field wrappers, form layouts) are implemented as components with their own module stylesheets, not as a separate global CSS system.

---

## **7\. Banner and LogoF**

The unified banner and LogoF implementation are considered part of the architecture because they appear on every surface.

**Architectural rules**

1. **Banner**  
   * Implemented as a component with a module stylesheet.  
   * Uses:  
     * Container tokens for width,  
     * Spacing tokens for padding and gaps,  
     * Theme tokens for background and border,  
     * Typography tokens for the wordmark.  
   * The banner structure (brand on the left, navigation/actions on the right) is consistent across surfaces.  
2. **LogoF**  
   * Implemented as a component using a dedicated class.  
   * Uses:  
     * Spacing and icon size tokens for its dimensions,  
     * A semantic token for its background,  
     * A theme token for text color,  
     * `--universal-element-radius` for shape,  
     * Typography tokens for size and weight.  
3. There is a single canonical pattern for the banner \+ LogoF.  
   * Variants that deviate visually require explicit authorization as exceptions (see §9).

---

## **8\. High-Contrast Behavior**

Contrast behavior is driven exclusively through the token system.

**Architectural rules**

1. High-contrast mode is enabled at the root (for example via a class on the root element), and implemented only via token overrides in the generated token stylesheet.  
2. Modules do not contain high-contrast–specific rules; they simply consume tokens.  
3. High-contrast overrides:  
   * May remap theme tokens to increase contrast.  
   * Must not introduce new colors or new tokens.  
   * Must not change the underlying semantic color token set.

The architecture ensures that enabling high contrast is purely a matter of token remapping, not component-level branching.

---

## **9\. Exceptions (V10 1% Mechanism)**

Exceptions are rare, explicitly authorized deviations from the token and architecture rules.

**Process**

1. Any deviation from:  
   * The token set (new values, new scales),  
   * The typography rules (including minimum sizes),  
   * The spacing, container, or breakpoint sets,  
   * The “one rule per situation” defaults,  
2. is considered an exception.  
3. An exception must:  
   * Be explicitly authorized, and

Be annotated **in the code** directly above the exceptional rule as:  
/\* USER authorized V10 exception: \<brief reason\> \*/

*   
4. Exceptions are:  
   * Component-specific,  
   * Context-specific,  
   * Not precedents for other components.  
5. Known high-care areas (for example, dense calendar layouts, dense timelines) must attempt to use standard tokens first; if that is not possible without unacceptable regressions, exceptions are handled via this mechanism.

---

## **10\. Enforcement and Use with Automation**

To ensure the architecture continues to serve its purpose—minimal, predictable, token-driven design—the following rules apply to all automated and human changes:

1. **Token definition enforcement**  
   * Any CSS custom property declarations outside `tokens.css` are violations.  
   * Any raw color/spacing/font-size/breakpoint/container values are violations unless explicitly annotated as exceptions.  
2. **Architecture enforcement**  
   * Any new shared CSS file that is not:  
     * The generated `tokens.css`, or  
     * A component module stylesheet,  
       is a violation.  
3. **AI-specific constraints**  
   * Automated tools must:  
     * Treat `DEV_DesignTokensSystem_2.0_20260130` and `tokens.yaml` as the sole design authority.  
     * Use only `var(--token-name)` values from `tokens.css`.  
     * Apply the single default rule for each situation where the spec defines one.  
     * Never introduce new tokens, new naming layers, or new shared CSS files.  
4. **Change process**  
   * If a needed visual pattern cannot be expressed using existing tokens and rules:  
     * The correct next step is to propose a change to the token system and/or this architecture addendum,  
     * Not to patch around the system at module level.

---

This addendum defines the **only** valid CSS architecture for FortuneTell web properties under Token System 2.0.

