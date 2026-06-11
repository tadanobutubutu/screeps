# Palette's Journal - Screeps Dashboard UX/Accessibility

## 2025-05-22 - [Accessibility & Consistency]

**Learning:** Improving color contrast to WCAG AAA (#004b73) and ensuring consistent number formatting (adding Billions support) across the dashboard and game visuals enhances both accessibility and user trust.
**Action:** Always verify brand colors against AAA standards and keep formatting utilities synchronized between frontend and game-side code.

## 2025-05-22 - [Refining Button Feedback During Async Operations]

**Learning:** Adding visual feedback (like icons and animations) to an interactive element during an async operation is only half the battle. To ensure full accessibility, the parent element's `aria-label` and `title` must also be updated to reflect the transient state, as screen readers often prioritize the parent's label over its children.
**Action:** Always verify that state-driven UI changes are reflected in parent container ARIA attributes and title tags, especially for buttons and other interactive elements.

## 2025-06-12 - [WCAG AAA Color Unification]

**Learning:** Using a unified palette of WCAG AAA compliant colors (#004b73 for brand blue, #155d27 for success green, #b71c1c for error red) across both CSS and component logic ensures consistent accessibility and brand identity.
**Action:** Always check color contrast against AAA standards and prefer these unified hex codes for all UI feedback elements.

## 2025-05-14 - エラーメッセージの利便性向上

**Learning:** ダッシュボードのエラーメッセージは技術的で長くなる傾向がある。エラーアラートに専用の「コピー」ボタンを提供することで、デバッグやサポートのための情報取得が容易になり、ユーザー体験が向上する。

**Action:**

- エラーやログなどの一時的な技術データには「コピー」ボタンを含める。
- 「コピー完了」のフィードバックには成功を示す緑色（`#1e7e34`）を使用する。
- ボタンには明確なARIAラベル（例：`aria-label={copied ? "コピー済み" : "エラーをコピー"}`）を付与する。
