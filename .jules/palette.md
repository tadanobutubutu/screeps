## 2024-05-24 - High-Contrast Text for Game Visuals
**Learning:** In games with complex and varied backgrounds (like Screeps terrain), simple text colors (even high-contrast ones like #FFD700) can become unreadable.
**Action:** Always apply a dark text stroke (outline) using `stroke: '#000000'` and `strokeWidth: 0.05` to any `RoomVisual.text` element that needs to be accessible across different terrain types.
