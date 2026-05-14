## 2025-05-15 - [GCL/Power Delta Tracking]
**Learning:** Adding immediate visual feedback for incremental progress (like GCL/Power increases) significantly enhances the "living" feel of a dashboard. However, implementation must strictly adhere to React best practices—specifically, avoiding state updates within other state updater functions to prevent side effects and maintain predictable rendering behavior.
**Action:** Always perform related state updates sequentially in the main logic flow rather than nested within functional updaters. Maintain surgical edits to stay within line count constraints and follow existing style and design patterns.

## 2025-05-16 - [Urgency Animations & Delta Feedback]
**Learning:** Subtle, high-frequency animations (like `shake`) are more effective than slow animations (like `pulse`) for conveying critical status or urgency in compact UIs. Additionally, explicit delta indicators (e.g., `+1` for room gains) provide immediate "success feedback" that raw numbers lack, improving the user's sense of progress during brief dashboard checks.
**Action:** Use `shake` for critical alerts and include numeric deltas for all key resources to emphasize recent changes.

## 2026-05-14 - [GCL Level Up Estimation]
**Learning:** Providing actionable progress information, such as an "estimated time to level up," transforms raw data into meaningful feedback for long-term players. This enhancement leverages the rate of change between data syncs, making the dashboard feel more dynamic and helpful. Updating ARIA attributes (like `aria-valuetext`) ensures this "delightful" information is also accessible to screen reader users.
**Action:** Always look for opportunities to derive "velocity" or "time-to-goal" metrics from static stats to improve user engagement and situational awareness.
