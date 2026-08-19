/**
 * Fixes REACT_025: Multiple <main> landmarks
 * Ensures only one <main> element exists in the document
 */
function fixMainLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    const mainToKeep = mains[0];
    for (let i = 1; i < mains.length; i++) {
      const mainEl = mains[i];
      const children = Array.from(mainEl.childNodes);
      children.forEach(child => mainToKeep.appendChild(child));
      mainEl.parentNode.removeChild(mainEl);
    }
  }
}

/**
 * Fixes REACT_041: React SVG Accessible Name
 * Adds aria-label to SVGs in layout components
 */
function fixSvgAccessibility() {
  // For app/layout.tsx
  const appLayoutSvg = document.querySelector('app-layout svg');
  if (appLayoutSvg) {
    appLayoutSvg.setAttribute('aria-label', 'Application icon');
  }

  // For dashboard/app/layout.tsx
  const dashboardLayoutSvg = document.querySelector('dashboard-app-layout svg');
  if (dashboardLayoutSvg) {
    dashboardLayoutSvg.setAttribute('aria-label', 'Dashboard icon');
  }
}

// Run the fixes when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    fixMainLandmarks();
    fixSvgAccessibility();
  });
}

// ... (rest of existing code remains unchanged)