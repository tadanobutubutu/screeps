# Palette's Journal - Screeps Dashboard UX/Accessibility

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
