// Check for accessibility landmarks and implement addProperLandmarkRegions()

const { parseHTML } = require('screeps-parser');
const xpath = require('xpath');

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
    document.addEventListener('DOMContentLoaded', () => {
      checkMainLandmark();
      addProperLandmarkRegions();
    });
  } else {
    checkMainLandmark();
    addProperLandmarkRegions();
  }
}

// Implement addProperLandmarkRegions() function
function addProperLandmarkRegions() {
  const html = parseHTML(document.documentElement);
  const regions = xpath.select('/html/body//*[not(self::script)]', html);

  // Add landmark role to each element matching criteria
  regions.forEach((region) => {
    if (xpath.evaluate('./role', region, html).toString() !== '<Role:region>') {
      region.setAttribute('role', 'region');
      region.setAttribute('aria-label', region.outerHTML);
    }
  });
}

module.exports = { checkMainLandmark, addProperLandmarkRegions };