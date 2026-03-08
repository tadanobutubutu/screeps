# Palette UX Journal

## 2025-05-14 - Standardizing Visual Text Contrast
**Learning:** In Screeps, RoomVisual text can be difficult to read when rendered over various terrain types (swamp, wall, plain) or structures. Applying a thin black stroke (strokeWidth: 0.05) significantly improves legibility regardless of the background color.
**Action:** Always apply `stroke: '#000000'` and `strokeWidth: 0.05` (or 0.04 for smaller text) to all `room.visual.text` calls that display critical information.
