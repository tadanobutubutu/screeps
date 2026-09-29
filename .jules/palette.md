## 2026-03-31 - WCAG 2.1.4 Keyboard Shortcuts Accessibility
**Learning:** Single-key shortcuts can trigger unexpectedly for screen readers or when typing; using Alt modifier or dedicated helper overlay (?) improves accessibility and discoverability.
**Action:** Provide explicit WCAG 2.1.4 compliant shortcuts and helper toast options in web dashboard interfaces.

## 2026-03-31 - WAI-ARIA role="status" and Interactive Controls
**Learning:** Applying `role="status"` directly to container elements that enclose interactive controls like `<button>` causes screen readers to treat the container as static advisory text, overriding or obscuring button interactivity.
**Action:** Remove `role="status"` from container elements with buttons and use `aria-live="polite"` on localized non-interactive status text elements.

## 2026-04-01 - Context-Aware Empty Search State and Live Region Scope
**Learning:** Displaying the exact active search query term in zero-match status messages (e.g. "「query」に一致なし") gives immediate clarity to users on why no items are shown, while keeping `role="status"` strictly localized on text nodes rather than parent containers prevents suppressing child button interactivity.
**Action:** Include search query terms in empty state feedback text and scope live region roles strictly to non-interactive text elements.

## 2026-04-01 - WAI-ARIA role="alert" on Container Elements with Interactive Buttons
**Learning:** Applying `role="alert"` directly to error container elements (`<main>` or `<div>`) that contain interactive controls like retry or copy `<button>` elements causes screen readers to read the container as static advisory text, suppressing button semantics and keyboard focus expectations.
**Action:** Remove `role="alert"` from container elements enclosing buttons and rely on `aria-live="assertive"` on the container or localized error heading/text elements.

## 2026-03-31 - WCAG 1.4.13 Toast Notification Keyboard Dismissability
**Learning:** Toast notifications that overlay UI content must be dismissable via keyboard (Escape key) without moving focus or pointer, and display visual key badges (`<kbd>Esc</kbd>`) alongside `aria-keyshortcuts="Escape"` to make dismissal intuitive and accessible.
**Action:** Use a ref for toast message state in global keydown listeners to avoid stale closures, and add visual key badges alongside `aria-keyshortcuts` on floating notifications.

## 2026-04-01 - WCAG 1.3.1 Landmark Semantics and Skip-To-Content Links
**Learning:** Wrapping children in a top-level `<main>` tag in Next.js layouts creates nested `<main>` landmarks when child page components render their own `<main id="main-content">`, violating HTML semantics and confusing screen reader landmark navigation.
**Action:** Avoid wrapping children in `<main>` in root layouts, and place an explicit skip link (`<a href="#main-content" className="skip-link">`) pointing directly to the child main landmark.

## 2026-04-01 - WCAG 4.1.2 Disclosure Summary Accessible Name Computation
**Learning:** Setting an explicit `aria-label` or `title` on a `<summary>` disclosure element overrides all nested child nodes (including dynamic badges like size metrics) during accessible name computation.
**Action:** Ensure dynamic badge data and complete text content are explicitly formatted inside the `aria-label` and `title` attributes of summary elements.

## 2026-04-01 - WAI-ARIA role="alert" on Container Elements with Interactive Buttons
**Learning:** Applying `role="alert"` directly to error container elements (`<main>` or `<div>`) that contain interactive controls like retry or copy `<button>` elements causes screen readers to read the container as static advisory text, suppressing button semantics and keyboard focus expectations.
**Action:** Remove `role="alert"` from container elements enclosing buttons and rely on `aria-live="assertive"` on the container or localized error heading/text elements.
