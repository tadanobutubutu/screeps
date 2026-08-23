function getAccessibilityScore() {
  return 87; // Current Insight Code score
}

function getHiContrastMode() {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

function getScreenReaderMode() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
  return mediaQuery.media !== 'not all' && mediaQuery.matches;
}

export { getAccessibilityScore, getHiContrastMode, getScreenReaderMode };