# Palette's Journal - Screeps Dashboard UX/Accessibility

## 2025-05-14 - UX Patterns and Accessibility Standards

**Learning:** The dashboard uses dynamic emoji favicons and CSS animations to provide immediate visual feedback for game state changes (e.g., Level Up). It also prioritizes accessibility by using high-contrast colors and ARIA labels for interactive elements.

**Action:**
- Maintain dynamic favicon updates when adding new states.
- Ensure all new interactive elements have associated ARIA labels and keyboard shortcuts.
- Use `#1e7e34` for success states and `#004b73` for primary actions to maintain WCAG AAA contrast.
- Use `interactive-hint` class for elements with tooltips/detailed info.
