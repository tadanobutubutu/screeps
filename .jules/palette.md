## 2026-03-04 - [High-Contrast Game Visuals]
**Learning:** In game environments with complex backgrounds (like Screeps), text visibility is significantly compromised without explicit contrast elements. Adding semi-transparent background rectangles and text strokes (outlines) dramatically improves accessibility and prevents information loss.
**Action:** Always use 'visual.rect' for backgrounds and 'stroke'/'strokeWidth' for text elements in 'RoomVisual' to ensure readability regardless of the underlying game terrain or structures.
