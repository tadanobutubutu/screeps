# Palette's Journal - Screeps Dashboard UX/Accessibility

## 2026-08-03 - [Dismissable Toast Notifications and Proper Document Localization]
**Learning:** For dynamic, transient background/success messages displayed via a Toast component, providing an explicit, keyboard-accessible "Dismiss" (✕) button with highly visible custom focus styling and clear screen reader labels (e.g. `aria-label="通知を閉じる"`) is critical for accessibility. It prevents users from being forced to wait out a timed fade, complying with WCAG 2.2.4 (User Control). Additionally, setting the root HTML tag language matching the predominant text (e.g., `<html lang="ja">`) ensures text-to-speech synthesizers use proper pronunciation rather than phonetic distortion.
**Action:** Always pair timed Toast notifications with a highly-visible dismiss trigger styled with a clear focus ring, and ensure document-level localization is correctly defined.

## 2026-08-01 - [Visual Telemetry Accessibility with Semantic Progress Bars]

**Learning:** For dynamic, resource-intensive visual metrics like CPU usage on dashboards, replacing raw text stats with a color-coded, keyboard-focusable progress bar significantly reduces user cognitive load. Implementing proper semantic ARIA attributes (`role="progressbar"`, `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-valuetext`) guarantees that screen readers announce changes deterministically and with equal fidelity.
**Action:** Always wrap visual gauges in focusable container blocks (`tabIndex={0}`) with descriptive title tooltips and style indicators with clear color thresholds (green/teal, orange, red) to provide instant visual and auditory feedback.

## 2025-05-22 - [Accessibility & Consistency]

**Learning:** Improving color contrast to WCAG AAA (#004b73) and ensuring consistent number formatting (adding Billions support) across the dashboard and game visuals enhances both accessibility and user trust.
**Action:** Always verify brand colors against AAA standards and keep formatting utilities synchronized between frontend and game-side code.

## 2025-05-22 - [Refining Button Feedback During Async Operations]

**Learning:** Adding visual feedback (like icons and animations) to an interactive element during an async operation is only half the battle. To ensure full accessibility, the parent element's `aria-label` and `title` must also be updated to reflect the transient state, as screen readers often prioritize the parent's label over its children.
**Action:** Always verify that state-driven UI changes are reflected in parent container ARIA attributes and title tags, especially for buttons and other interactive elements.

## 2025-05-14 - エラーメッセージの利便性向上

**Learning:** ダッシュボードのエラーメッセージは技術的で長くなる傾向がある。エラーアラートに専用の「コピー」ボタンを提供することで、デバッグやサポートのための情報取得が容易になり、ユーザー体験が向上する。

**Action:**

- エラーやログなどの一時的な技術データには「コピー」ボタンを含める。
- 「コピー完了」のフィードバックには成功を示す緑色（`#1e7e34`）を使用する。
- ボタンには明確なARIAラベル（例：`aria-label={copied ? "コピー済み" : "エラーをコピー"}`）を付与する。

## 2025-05-23 - [Accessible Progress Indicators]

**Learning:** Replacing static text percentages with visual progress bars using `role="progressbar"` and ARIA attributes (`aria-valuenow`, `aria-valuemax`) significantly improves accessibility for screen readers while providing a more "delightful" and responsive feel for all users. Using 2-decimal precision for slow-moving metrics like GCL makes progress feel more tangible.

**Action:** Whenever displaying progress or levels, prefer semantic progress bars with high-precision percentages and smooth CSS transitions.

## 2026-07-11 - [Contextual Accessibility for UX Hints]

**Learning:** When adding `title` attributes (tooltips) to non-interactive elements like `<p>` tags for UX hints, it is crucial to include `tabIndex={0}`. This ensures the hint is discoverable and readable by keyboard and screen reader users who would otherwise skip over the element.

**Action:** Always pair `title` or UX hints on static elements with `tabIndex={0}` and appropriate semantic classes (e.g., `.interactive-hint`) to maintain accessibility standards.

## 2026-07-16 - [Enhanced Progress Clarity & Accessibility]

**Learning:** Combining number formatting (K, M, B suffixes) with `aria-valuetext` on progress bars provides a high-fidelity experience for both visual and screen-reader users. Showing the raw values (e.g., "1.2M / 2.0M") alongside the percentage reduces cognitive load and provides more tangible progress context.
**Action:** Always provide both relative (percentage) and absolute (formatted count) values for progress metrics, and mirror this in `aria-valuetext` for accessibility.

## 2026-07-22 - [Dynamic Feedback Coordination for Copy Actions]

**Learning:** When implementing "click to copy" interactions, it is crucial to keep the `title` and `aria-label` attributes fully coordinated with the interactive/visual state changes. Dynamically switching both to a success state message (e.g., "コピー済み") prevents mismatch bugs where screen readers and native tooltips hover-stale descriptions of "Copy" on an already copied item.
**Action:** Always dynamically bind and update both `title` and `aria-label` attributes in sync with any transient UI states (such as success copy confirmations).

## 2026-07-26 - [Transient Success Feedback for Async Actions]

**Learning:** Providing non-disruptive, transient visual feedback for manually triggered background actions (such as dashboard refresh buttons or keyboard shortcuts like Alt + R) makes interactions feel responsive and highly rewarding. Pairing this banner with an `aria-live="polite"` attribute ensures keyboard and screen reader users are immediately updated on task completion without shifting focus.
**Action:** Always include transient visual badges accompanied by `aria-live="polite"` attributes when actions complete in the background to keep all users seamlessly informed.

## 2026-07-28 - [Accessible Interactive Nesting inside Summary]

**Learning:** Nesting interactive elements like `<button>` inside a `<summary>` element violates HTML specifications and breaks accessibility. Screen readers and keyboard navigation users lose focus control or fail to activate either the details disclosure or the nested button correctly.
**Action:** Keep `<summary>` elements clean of nested focusable controls; instead, place interactive buttons or tooltips inside the body of the `<details>` container, formatted with appropriate visual groupings.

## 2026-07-29 - [Overlay Portal Placement for Toast Notifications]

**Learning:** When implementing a floating Toast notification system, rendering the Toast component nested deep inside layout wrappers (like collapsible `<details>` or scrollable boxes) can cause the Toast to become completely hidden or cut off by container styles (`display: none` or `overflow: hidden`). Placing the Toast at the root level of the component's main layout prevents layout inheritance issues and ensures visual consistency.
**Action:** Always position floating status/feedback notifications at the absolute root or outermost level of your React component hierarchy rather than nested inside conditional blocks.

## 2026-07-31 - [Cursor Separation on Details Containers]

**Learning:** Applying `cursor: pointer` to a parent `<details>` element causes the hand pointer cursor to be inherited by all of its nested children (including massive `<pre>` blocks). This misleadingly implies that the entire block is clickable and disrupts standard text-selection patterns. Setting `border: none` (or other structural styling) on the `<details>` container and applying `cursor: pointer` strictly to the `<summary>` element preserves expected interactive bounds.
**Action:** Always scope `cursor: pointer` exclusively to the toggleable `<summary>` element rather than the parent `<details>` component.

## 2026-07-25 - [Cross-Browser Disclosure Consistency & Keyboard Focus]

**Learning:** Default `<details>` and `<summary>` list-style markers vary significantly across browser engines (Chrome, Firefox, Safari), resulting in visual inconsistency. Hiding the default markers using both `listStyle: 'none'` and `-webkit-details-marker` while explicitly tracking the element's expansion state via React's `onToggle` allows for a highly consistent and beautifully animated custom chevron indicator. Crucially, when overriding default summary styles, custom `:focus-visible` styles must be explicitly defined to maintain proper visual focus states for keyboard-only users.
**Action:** Always hide default browser markers on summary tags globally, pair them with a state-driven rotating chevron element, and enforce an explicit `focus-visible` outline stylesheet rule.
