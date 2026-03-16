## 2025-05-15 - [High-Contrast Room Visuals]
**Learning:** In the Screeps environment, standard `RoomVisual` text and bars can easily blend into the varying background of the game world (terrain, structures, other creeps). Using a semi-transparent black rectangle (`opacity: 0.5`) as a background for complex visual elements like progress bars significantly improves scanability. Additionally, adding a `stroke` and `strokeWidth` to text elements ensures they remain legible regardless of the color they are rendered on.
**Action:** When implementing new in-game visual elements using `RoomVisual`, always include a semi-transparent background rectangle and use text strokes for labels.

## 2026-02-12 - [Dashboard Visibility and Persistence]
**Learning:** Screeps `RoomVisual` elements are transient and expire every tick. Throttling visual rendering (e.g., `Game.time % 10 === 0`) leads to a flickering UI that is invisible most of the time. For a smooth user experience, dashboards and other UI elements must be rendered every tick.
**Action:** Ensure all `RoomVisual` based UI components are called every tick in the main loop to maintain constant visibility.

## 2024-05-23 - [Multi-state Visual Feedback]
**Learning:** For critical game resources like the CPU Bucket in Screeps, binary color states (red/green) are often insufficient. Adding a middle "warning" state (e.g., yellow for 30%-70% levels) provides much better proactive feedback to users, allowing them to adjust their strategy before the system hits an emergency state.
**Action:** Use multi-state color coding (Red/Yellow/Green) for all continuous resource monitors in dashboards to improve user awareness.
