## 2026-03-10 - Screeps RoomVisual Persistence
**Learning:** RoomVisual elements in Screeps are transient and cleared every tick. Throttling visual updates (e.g., drawing only every 10 ticks) results in a flickering UI that is only visible for one frame.
**Action:** Always execute RoomVisual rendering logic every tick within the main loop to ensure persistent and smooth visual feedback.
