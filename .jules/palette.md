# Palette UX Journal 🎨

## 2024-05-23 - Visual Accessibility in Screeps RoomVisuals

**Learning:** When using `RoomVisual` text and shapes, they can often become unreadable depending on the underlying terrain (swamp, wall, plain) or other structures. Adding a black text stroke significantly improves legibility across all backgrounds. Additionally, using semi-transparent black backgrounds (`#000000` with `opacity: 0.5`) for progress bars and dashboards provides a consistent, high-contrast area for information display.

**Action:** Always apply `stroke: '#000000', strokeWidth: 0.05` to `RoomVisual.text` calls and prefer `#000000` with `opacity: 0.5` or higher for background rectangles.
