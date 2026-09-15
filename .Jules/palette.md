## 2026-03-31 - WCAG 2.1.4 Keyboard Shortcuts Accessibility
**Learning:** Single-key shortcuts can trigger unexpectedly for screen readers or when typing; using Alt modifier or dedicated helper overlay (?) improves accessibility and discoverability.
**Action:** Provide explicit WCAG 2.1.4 compliant shortcuts and helper toast options in web dashboard interfaces.

## 2026-03-31 - WAI-ARIA role="status" and Interactive Controls
**Learning:** Applying `role="status"` directly to container elements that enclose interactive controls like `<button>` causes screen readers to treat the container as static advisory text, overriding or obscuring button interactivity.
**Action:** Remove `role="status"` from container elements with buttons and use `aria-live="polite"` on localized non-interactive status text elements.
