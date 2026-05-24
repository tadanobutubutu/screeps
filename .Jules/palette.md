## 2025-05-15 - [GCL/Power Delta Tracking]

**Learning:** Adding immediate visual feedback for incremental progress (like GCL/Power increases) significantly enhances the "living" feel of a dashboard. However, implementation must strictly adhere to React best practices—specifically, avoiding state updates within other state updater functions to prevent side effects and maintain predictable rendering behavior.
**Action:** Always perform related state updates sequentially in the main logic flow rather than nested within functional updaters. Maintain surgical edits to stay within line count constraints and follow existing style and design patterns.

## 2025-05-16 - [Urgency Animations & Delta Feedback]

**Learning:** Subtle, high-frequency animations (like `shake`) are more effective than slow animations (like `pulse`) for conveying critical status or urgency in compact UIs. Additionally, explicit delta indicators (e.g., `+1` for room gains) provide immediate "success feedback" that raw numbers lack, improving the user's sense of progress during brief dashboard checks.
**Action:** Use `shake` for critical alerts and include numeric deltas for all key resources to emphasize recent changes.

## 2026-05-14 - [GCL Level Up Estimation]

**Learning:** Providing actionable progress information, such as an "estimated time to level up," transforms raw data into meaningful feedback for long-term players. This enhancement leverages the rate of change between data syncs, making the dashboard feel more dynamic and helpful. Updating ARIA attributes (like `aria-valuetext`) ensures this "delightful" information is also accessible to screen reader users.
**Action:** Always look for opportunities to derive "velocity" or "time-to-goal" metrics from static stats to improve user engagement and situational awareness.

## 2026-05-15 - [XP Velocity & Tab Feedback]

**Learning:** Actionable progress metrics like XP/h and "time to goal" significantly enhance user engagement by providing velocity context. Synchronizing the dashboard state (Level Up, Copied) with the browser tab (Title and Favicon) provides high-value feedback for users multi-tasking across tabs. Using local variables in the render body for derived metrics used in both JSX and ARIA attributes ensures efficiency without redundant hook calls.
**Action:** Always derive velocity metrics from sync deltas and reflect critical state changes in the tab title/favicon for a "living" application feel.

## 2026-05-16 - [Copy-on-Click for Resource Lists]
**Learning:** Transform static summary labels (like "2 Rooms") into interactive "Copy to Clipboard" buttons. This provides hidden utility for power users who need to export list data (e.g., room names for coordination) without cluttering the UI with explicit "Export" buttons. Keyboard shortcuts (like 'K' for 'Keys/Rooms') and immediate visual feedback (animation + icon swap) make the interaction feel intentional and modern.
**Action:** Identify summary stats that represent lists of IDs or names and add "Copy to Clipboard" functionality with appropriate ARIA labels and shortcut hints.

## 2026-05-24 - [Human-Readable Summary Export]
**Learning:** Providing a human-readable "Copy Summary" feature complements raw JSON exports by allowing users to quickly capture and share key performance metrics (GCL, power, velocity, ETA) without manual formatting. This reduces friction for status updates and documentation.
**Action:** Always include a "Copy human-readable summary" option alongside raw data exports in status-heavy dashboards.
