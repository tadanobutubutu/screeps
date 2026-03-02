## 2025-05-15 - [High Contrast UI Elements]
**Learning:** In-game visual elements like `RoomVisual` text can easily become unreadable against complex background tiles. Using semi-transparent background rectangles and text strokes significantly improves scanability and accessibility.
**Action:** Always wrap `RoomVisual.text` labels in a `RoomVisual.rect` background or apply a high-contrast `stroke` to ensure the text remains legible regardless of the underlying game terrain or structures.
