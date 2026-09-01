# Palette's Journal - Screeps Dashboard UX/Accessibility

## 2026-08-22 - [Polite Live Regions for Dynamic Timestamps & Empty States]

**Learning:** Timestamps indicating background data refreshes and fallback "empty state" tags (such as when no active rooms are available) should be wrapped in polite live regions (`role="status"` and `aria-live="polite"`). Pairing dynamic timestamps with accurate screen-reader descriptors (`aria-label="最後にデータが更新された時間: HH:MM:SS"`) ensures non-sighted users are informed as stats update without interrupting active speech or requiring manual focus shifts (WCAG 4.1.3 Status Messages).
**Action:** Always equip dynamically updating timestamp badges and fallback empty-state tags with `role="status"`, `aria-live="polite"`, and dynamic `aria-label` tags.

## 2026-08-14 - [Live Region & Dynamic Disabled States for Search Filters]

**Learning:** Adding `role="status"` and `aria-live="polite"` to filter result counters enables screen reader users to receive real-time auditory updates as search results change. Furthermore, dynamically setting `disabled` states alongside clear descriptive `aria-label` / `title` messages (e.g., "コピー対象の部屋がありません") on dependent bulk triggers when no matching items exist prevents confusing empty actions and reinforces clear UI boundary constraints.
**Action:** Always wrap dynamic filter result counters in polite live regions, and disable dependent group actions with clear descriptive accessibility labels when search query matches are empty.

## 2026-08-13 - [Headless Clipboard Permissions for Automated UX Verification]

**Learning:** Headless browser engines (like Chromium used in Playwright) block access to the native clipboard API (`navigator.clipboard.writeText`) by default, preventing simulated "click to copy" actions from successfully executing. Granting explicit `['clipboard-read', 'clipboard-write']` permissions at the browser context level enables full validation of copied telemetry states and corresponding toast notifications without throwing security exceptions.
**Action:** When writing Playwright or other browser verification scripts for copy-to-clipboard elements, always declare context-level clipboard permissions explicitly to ensure reliable automated visual tests.

## 2026-08-12 - [Accessible Keyboard-Navigable Scrollable Containers]

**Learning:** Scrollable non-interactive containers (such as `<pre>` code logs or dynamic JSON blocks) must be accessible to keyboard-only and screen-reader users by adding `tabIndex={0}` and a descriptive `aria-label`. This allows users to easily focus on and scroll through extensive content using arrow/navigation keys, satisfying WCAG 2.1.1 (Keyboard Accessibility).
**Action:** Always equip any scrollable visual wrapper with `tabIndex={0}`, standard `focus-visible` styling, and a descriptive `aria-label` attribute.

## 2026-08-11 - [Polished Label focus-within & Hover Feedback]

**Learning:** Standard interactive inline/native controls (such as checkbox/radio form elements) lack distinct highlight styling on focus or hover. Elevating the parent label element container with transitional background colors and high-contrast `:focus-within` styled focus outlines dramatically improves user discovery, satisfies keyboard-only accessibility requirements (WCAG 2.1.1), and ensures screen readers/focus outline targets are perfectly aligned with visual cues.
**Action:** When designing checkbox or other standard input toggle controls, wrap the inputs inside responsive `<label>` containers configured to highlight focus/hover state changes elegantly using state-driven/class-driven transitions.

## 2026-08-10 - [Reconciliation Key forcing for React Transition/Animation Reset]

**Learning:** In React-based visual notification or transient dialog components, consecutive text updates without a complete unmount of the wrapper container prevent CSS animation keyframes (such as a shrinking progress bar or entry animations) from replaying. Forcing element recreation using a distinct `key` attribute bound directly to the dynamic message content ensures the animation lifecycle is deterministically restarted.
**Action:** Always assign a unique, message-bound `key` to transient animation wrappers to guarantee consistent visual and motion behavior across consecutive state changes.

## 2026-08-09 - [Dynamic Attribute Synchronization & Keyboard Hints]

**Learning:** When using components that display interactive info/tooltips via a `title` attribute, duplicating the description in an explicit `aria-label` attribute guarantees that screen readers vocalize the dynamic metadata. Additionally, indicating keyboard controls (e.g. 'Esc' to clear a search input) directly inside the `placeholder` text greatly improves feature discoverability.
**Action:** Always provide matching `aria-label` tags for hover-only tooltips on non-standard interactive structures, and explicitly hint at keyboard shortcuts inside placeholder text.

## 2026-08-08 - [Keyboard Shortcut Hint & Focus for Input Navigation]

**Learning:** When introducing keyboard shortcuts for interactive form controls (such as using `Alt + S` to focus a search input), we must display a corresponding, accessible `<kbd>` badge adjacent to the element. Equipping the badge with explicit `tabIndex={0}`, descriptive `title`, and highly clear ARIA descriptors (e.g., `aria-label="キーボードショートカット Alt + S キーで部屋の検索入力にフォーカスできます"`) makes keyboard shortcuts easily discoverable for both visual and screen-reader users, fully satisfying WCAG 2.1.1 (Keyboard Accessibility).
**Action:** Always document keyboard shortcuts with a highly visible `<kbd>` component next to the targeted control, pairing it with consistent focusable hints and comprehensive screen-reader metadata.

## 2026-08-07 - [Dynamic Search Filtering & Bulk Actions Coordination]

**Learning:** When adding client-side search or filter inputs to groups of dynamic telemetry items (such as a list of active Screeps rooms), any adjacent bulk actions (such as "Copy All") must be contextually updated to reflect the filter state. Dynamically changing the action's behavior to copy only the filtered subset, and synchronizing its labels, tooltips, ARIA descriptors, and completion toasts, prevents user confusion and satisfies WCAG 2.1.1 (Keyboard Accessibility) and 2.4.4 (Link Purpose/Context).
**Action:** When implementing any search or filter component, always review and dynamically coordinate adjacent bulk actions to operate strictly on the filtered subset of visible data, updating all accessibility labels in sync.

## 2026-08-05 - [Accessible Dashboard Polling with User Control]

**Learning:** For monitoring-heavy screens like game status dashboards, polling or auto-refresh capabilities should be paired with explicit user controls. Implementing a clearly labeled checkbox with specific accessible markup (`aria-label="自動更新 (60秒ごと)"`) allows users to pause the refresh cycles at will. Furthermore, matching the refresh cycle to the API's caching layer avoids redundant server queries while maintaining the most up-to-date telemetry.
**Action:** Always provide accessible toggle switches for automated data-polling components, and verify they respect tab-navigation and status disclosure standards.

## 2026-08-04 - [Bulk Group Actions & Copied State Coordination]

**Learning:** For sections containing groups of interactable telemetry identifiers (such as a list of active room names), adding a bulk "Copy All" capability significantly enhances user flow and reduces mouse click wear. Consistent with individual copy elements, the bulk trigger must dynamically synchronize both its `title` and `aria-label` attributes to a clear copied success state (e.g. `すべての部屋名をコピーしました`) to prevent screen-reader and visual tooltip staterooms.
**Action:** Always provide clear bulk copy/action alternatives for group elements, and ensure their success states have fully coordinated visual/auditory metadata.

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
- 「コピー完了」のフィードバックには成功を示す緑色（`#1e7e34`）使用する。
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

## 2026-08-06 - [Interactive Focus Rings & Label Wrapper Transitions]

**Learning:** Silencing focus outlines using inline styles (such as `outline: 'none'`) on native form elements like checkboxes without a visible alternative creates a major accessibility blocker for keyboard navigation users. By removing inline outline overrides and setting clean `:focus-visible` rules combined with `:focus-within` on label wrappers, we ensure high keyboard focus visibility. Furthermore, utilizing pure CSS classes for transition effects (such as `:hover` on label containers) provides dynamic and highly responsive feedback without unnecessarily cluttering React component states.
**Action:** Never silence default outline styles on interactive elements without defining explicit `:focus-visible` styles, and utilize `:focus-within` on label containers for polished keyboard visual accessibility.

## 2026-08-21 - [Keyboard Shortcut Badge Accessibility & Focus Cleanliness]

**Learning:** Static visual shortcut badges (such as `<kbd>` indicators) should not carry `tabIndex={0}` or `cursor: 'help'` when placed directly adjacent to their target interactive elements (e.g. buttons or inputs). Retaining `tabIndex={0}` on non-interactive badges forces users navigating via keyboard (Tab key) through redundant focus stops before reaching the actual actionable control, violating WCAG 2.1.1 (Keyboard Navigation Efficiency).
**Action:** Always omit `tabIndex={0}` and `cursor: 'help'` from static `<kbd>` shortcut indicators that sit next to interactive controls.

## 2026-08-27 - Explicit Keyboard Shortcut Declaration via aria-keyshortcuts

**Learning:** Declaring `aria-keyshortcuts="Escape"` on interactive search inputs and clear triggers informs assistive technology users of supported keyboard shortcuts for input clearing and focus management (WCAG 2.1.4 / 2.1.1).
**Action:** Always include `aria-keyshortcuts` attributes on form inputs and control buttons when custom key handlers (such as Escape or Alt-based shortcuts) are configured.

## 2026-08-28 - [ARIA Keyshortcuts Formatting Specification]

**Learning:** Declaring `aria-keyshortcuts` attributes on interactive elements requires using lowercase letters when the Shift key is not part of the shortcut combination (e.g., `Alt+r` rather than `Alt+R`), according to W3C ARIA specifications. Using uppercase letters implies that the Shift key is required (e.g., `Alt+Shift+R`), which misinforms screen-reader users when the event listener only listens for unshifted keypresses.
**Action:** Always format `aria-keyshortcuts` strings using lowercase letters (e.g., `Alt+r`, `Alt+s`) unless the Shift key is explicitly required.

## 2026-08-29 - [High-Contrast Keyboard Focus Indicators vs Hover Trigger Anti-Patterns]

**Learning:** Reusing hover state handlers for keyboard focus events (`onFocus={() => setHover(true)}`) causes confusing hover scaling transforms during tab navigation while omitting true visual focus outlines. Tracking keyboard focus using dedicated focus state variables (`summaryFocused`, `refreshFocused`, `copyAllFocused`, `focusedRoom`, `jsonFocused`) and applying high-contrast focus outlines (`outline: 2px solid #004b73`, `outlineOffset: 2px`) ensures seamless visual feedback and keyboard navigation tracking (WCAG 2.4.7 Focus Visible).
**Action:** Always maintain dedicated focus state tracking or CSS `:focus-visible` styling for action buttons, avoiding using hover state setters inside `onFocus` handlers.
