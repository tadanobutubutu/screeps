## 2025-05-15 - [High-Contrast Room Visuals]
**Learning:** In the Screeps environment, standard `RoomVisual` text and bars can easily blend into the varying background of the game world (terrain, structures, other creeps). Using a semi-transparent black rectangle (`opacity: 0.5`) as a background for complex visual elements like progress bars significantly improves scanability. Additionally, adding a `stroke` and `strokeWidth` to text elements ensures they remain legible regardless of the color they are rendered on.
**Action:** When implementing new in-game visual elements using `RoomVisual`, always include a semi-transparent background rectangle and use text strokes for labels.

## 2026-02-12 - [Dashboard Visibility and Persistence]
**Learning:** Screeps `RoomVisual` elements are transient and expire every tick. Throttling visual rendering (e.g., `Game.time % 10 === 0`) leads to a flickering UI that is invisible most of the time. For a smooth user experience, dashboards and other UI elements must be rendered every tick.
**Action:** Ensure all `RoomVisual` based UI components are called every tick in the main loop to maintain constant visibility.
