// TODO: Address accessibility issues from insight report

// Accessibility live region utility
function announce(message) {
  let liveRegion = document.getElementById('accessibility-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0 0 0 0)';
    liveRegion.id = 'accessibility-live-region';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = '';
  // Trigger update for screen readers
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 0);
}

// Export for use in other modules (if the environment supports exports)
if (typeof exports !== 'undefined') {
  exports.announce = announce;
}