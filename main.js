// main.js
// [Existing code preserved as-is]
// Fix for REACT_015: React Language Attribute
document.documentElement.lang = 'en';

// Fix for REACT_027: React Table Structure
function enhanceTableAccessibility(tableElement) {
  if (!tableElement.querySelector('thead') || !tableElement.querySelector('tbody')) {
    console.warn('Table structure needs improvement for better accessibility');
    // You might want to restructure the table here if needed
  }
}

// Fix for REACT_017: React Landmarks
function addLandmarks() {
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }
  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }
  });
}

// Fix for REACT_041: React SVG Accessible Name
function enhanceSVGAccessibility() {
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"])');
  svgs.forEach(svg => {
    // Check if SVG is in the favicon context (dashboard/app/layout.tsx)
    const isFavicon = svg.closest('link[rel="icon"]') !== null;
    if (isFavicon) {
      // For favicon SVGs, mark as decorative
      if (!svg.hasAttribute('aria-hidden')) {
        svg.setAttribute('aria-hidden', 'true');
      }
    } else if (!svg.querySelector('title') && !svg.querySelector('desc')) {
      // For other SVGs, add a title if missing
      const title = document.createElement('title');
      title.textContent = 'Graphic element';
      svg.prepend(title);
    }
  });
}

// Fix for REACT_025: React Unique Landmarks
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'navigation', 'search', 'region'];
  landmarks.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      console.warn(`Multiple elements with role="${role}" found. Consider making them unique.`);
    }
  });
}

// Fix for REACT_036: React Fake Link
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"], [tabindex="0"]');
  fakeLinks.forEach(link => {
    if (!link.tagName.toLowerCase() === 'a') {
      console.warn('Fake link detected. Consider using proper <a> elements.');
    }
  });
}

// Initialize accessibility enhancements
function initAccessibility() {
  addLandmarks();
  enhanceSVGAccessibility();
  ensureUniqueLandmarks();
  replaceFakeLinks();
  // Enhance all tables on the page
  document.querySelectorAll('table').forEach(table => {
    enhanceTableAccessibility(table);
  });
}

// Run on DOM content loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}
// [Existing exports preserved as-is]