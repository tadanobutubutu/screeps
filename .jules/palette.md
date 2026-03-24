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

## 2025-06-21 - [Dashboard Information Density and Accessibility]
**Learning:** Magenta text (#ff00ff) on a semi-transparent black background has lower contrast than white text (#ffffff), making it harder for users with visual impairments to read. Additionally, providing absolute values without context (like storage energy) requires more cognitive effort than pairing them with a percentage-based progress bar.
**Action:** Use white for primary informational text and always accompany large resource counts with a visual progress bar and percentage for faster "at-a-glance" status checks.

## 2025-06-25 - [Dynamic UI Section Management]
**Learning:** When adding dynamic or rotating content to a fixed-size dashboard (like the Daily Challenge), the total visual real estate must be expanded dynamically. Increasing the background container's height and shifting lower elements (like the Rank Badge) using relative positioning ensures the UI remains balanced and prevents element overlapping as new metrics are introduced.
**Action:** When adding new sections to a dashboard, always calculate and update the container height and provide sufficient padding/offset for existing elements.

## 2025-06-25 - [Deterministic Testing for Rotating Content]
**Learning:** For systems that rotate content daily (like the Daily Challenge), hardcoding values in unit tests leads to brittle, non-deterministic failures. Fetching the active configuration (e.g., the daily metric) directly from the module under test ensures that assertions remain valid regardless of the execution date.
**Action:** Use dynamic setup in unit tests for time-dependent or rotating features to ensure consistent test results across different environments and dates.

## 2025-06-26 - [Dynamic Urgency Signaling]
**Learning:** In a high-information-density UI like the Screeps dashboard, static red text for "HOSTILES" can be overlooked during prolonged combat. Implementing a pulsing opacity effect (e.g., `0.7 + 0.3 * Math.sin(Game.time / 3)`) creates a subtle "breathing" animation that draws the eye without being as jarring as a rapid flash, significantly improving alert visibility.
**Action:** Use sinusoidal pulsing for critical warnings or state changes to provide persistent but non-distracting urgency signaling.

## 2025-06-26 - [Accessibility in Small-Scale Text]
**Learning:** For very small informational text (e.g., font size 0.4 for CPU/Bucket stats), semantic colors like Green or Yellow can suffer from poor contrast against a 50% opacity black background. Forcing these labels to White (#ffffff) ensures maximum readability and WCAG compliance for small-scale UI elements, while relying on adjacent progress bars to convey status through color.
**Action:** Prioritize high-contrast white text for sub-0.5 font sizes on transparent backgrounds, even if it replaces semantic status colors.

## 2025-06-30 - [Visual Rewards for Completion]
**Learning:** In a gamified UI, reaching 100% on a progress bar should feel distinct from "near completion". Using a unique "Gold" (#FFD700) color specifically for the 100% state provides a clear, satisfying visual reward that distinguishes completed tasks from those still in progress, providing immediate positive reinforcement.
**Action:** Always implement a dedicated "completed" color state (like Gold) for progress bars in gamified systems to differentiate the "Finished" state from "High Progress".
