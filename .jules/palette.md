## 2026-02-12 - Accessibility via Text Stroke
**Learning:** In Screeps, RoomVisual text is often rendered over unpredictable terrain (swamps, walls, structures). Adding a black stroke (`stroke: '#000000', strokeWidth: 0.05`) to all text elements is a critical accessibility pattern to ensure readability regardless of the background.
**Action:** Always include a high-contrast stroke for RoomVisual text elements.

## 2026-02-12 - Spawning Feedback Loop
**Learning:** Simple text labels for long-running processes like spawning lack the interactivity users expect. Replacing them with real-time progress bars (using `needTime` and `remainingTime`) significantly improves the "feel" of the automation.
**Action:** Use `vfx.progressBar` for time-based processes when `visualEffects` are enabled.
