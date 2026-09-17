## 2026-03-31 - WCAG 2.1.4 Keyboard Shortcuts Accessibility
**Learning:** Single-key shortcuts can trigger unexpectedly for screen readers or when typing; using Alt modifier or dedicated helper overlay (?) improves accessibility and discoverability.
**Action:** Provide explicit WCAG 2.1.4 compliant shortcuts and helper toast options in web dashboard interfaces.

## 2026-03-31 - WAI-ARIA role="status" and Interactive Controls
**Learning:** Applying `role="status"` directly to container elements that enclose interactive controls like `<button>` causes screen readers to treat the container as static advisory text, overriding or obscuring button interactivity.
**Action:** Remove `role="status"` from container elements with buttons and use `aria-live="polite"` on localized non-interactive status text elements.

## 2026-03-31 - WCAG 1.4.13 Toast Notification Keyboard Dismissability
**Learning:** Toast notifications that overlay UI content must be dismissable via keyboard (Escape key) without moving focus or pointer, and display visual key badges (`<kbd>Esc</kbd>`) alongside `aria-keyshortcuts="Escape"` to make dismissal intuitive and accessible.
**Action:** Use a ref for toast message state in global keydown listeners to avoid stale closures, and add visual key badges alongside `aria-keyshortcuts` on floating notifications.
