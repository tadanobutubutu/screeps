// Check for accessibility landmarks
const checkMainLandmark = () => {
  const hasMain = document.querySelector('main') !== null;
  if (!hasMain) {
    console.warn('Accessibility Warning: Page is missing <main> landmark for screen readers');
  }
  return hasMain;
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkMainLandmark);
  } else {
    checkMainLandmark();
  }
}

module.exports = { checkMainLandmark };