# Palette Journal - Critical UX Learnings

This journal tracks critical UX and accessibility learnings from working on the Screeps AI codebase.

## 2025-05-27 - Improving Discoverability of Interactive Status Indicators
**Learning:** Status indicators that also serve as triggers for actions (like "Last Sync" triggering a refresh) are often perceived as static text by users and screen readers if they lack proper semantic roles and visual cues.
**Action:** Always use semantic elements (or appropriate ARIA roles), `cursor: pointer`, and clear focus indicators (like consistent focus rings) for any status display that allows user interaction.
