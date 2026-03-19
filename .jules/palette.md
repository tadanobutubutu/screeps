## 2025-05-15 - [High-Contrast Room Visuals]
**Learning:** In the Screeps environment, standard `RoomVisual` text and bars can easily blend into the varying background of the game world (terrain, structures, other creeps). Using a semi-transparent black rectangle (`opacity: 0.5`) as a background for complex visual elements like progress bars significantly improves scanability. Additionally, adding a `stroke` and `strokeWidth` to text elements ensures they remain legible regardless of the color they are rendered on.
**Action:** When implementing new in-game visual elements using `RoomVisual`, always include a semi-transparent background rectangle and use text strokes for labels.

## 2026-02-12 - [Dashboard Visibility and Persistence]
**Learning:** Screeps `RoomVisual` elements are transient and expire every tick. Throttling visual rendering (e.g., `Game.time % 10 === 0`) leads to a flickering UI that is invisible most of the time. For a smooth user experience, dashboards and other UI elements must be rendered every tick.
**Action:** Ensure all `RoomVisual` based UI components are called every tick in the main loop to maintain constant visibility.

## 2024-05-23 - [Multi-state Visual Feedback]
**Learning:** For critical game resources like the CPU Bucket in Screeps, binary color states (red/green) are often insufficient. Adding a middle "warning" state (e.g., yellow for 30%-70% levels) provides much better proactive feedback to users, allowing them to adjust their strategy before the system hits an emergency state.
**Action:** Use multi-state color coding (Red/Yellow/Green) for all continuous resource monitors in dashboards to improve user awareness.

## 2025-05-20 - [Comprehensive Information Density]
**Learning:** In information-heavy dashboards like the Screeps Room Dashboard, cramming all data into single lines reduces scanability and causes text overflow issues. Using a multi-line approach with thematic grouping (e.g., basic roles vs. advanced roles) and intuitive emojis improves cognitive load and ensures the UI remains usable as the bot's complexity grows.
**Action:** When adding more than 4-5 categories of metrics to a dashboard, group them logically and use multi-line layouts to maintain legibility.

## 2025-06-20 - [Semantic Color-Coding for Status Dashboards]
**Learning:** For status-heavy dashboards, "glanceability" is key. Using semantic color-coding (Red/Orange/Yellow/Green) for system modes and resource levels (Red/Yellow/Cyan) allows users to immediately assess the health of their colony without parsing raw numbers. Syncing the text color with its corresponding progress bar reinforces this visual association.
**Action:** Always apply semantic colors to status indicators and resource bars to improve cognitive processing speed in high-information-density UIs.
