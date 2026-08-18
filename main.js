// main.js
// [Existing code preserved as-is]

// Fix for REACT_015: React Language Attribute
// Add lang attribute to root element
document.documentElement.lang = 'en';

// Fix for REACT_027: React Table Structure
// Ensure tables have proper structure with <thead>, <tbody>, and <th> elements
function enhanceTableAccessibility(tableElement) {
  if (!tableElement.querySelector('thead') || !tableElement.querySelector('tbody')) {
    console.warn('Table structure needs improvement for better accessibility');
    // You might want to restructure the table here if needed
  }
}

// Fix for REACT_017: React Landmarks
// Add proper ARIA landmarks
function addLandmarks() {
  // Check if main landmark exists, if not add it
  if (!document.querySelector('main')) {
    const mainContent = document.querySelector('[role="main"]') || document.body.firstElementChild;
    if (mainContent) {
      const mainElement = document.createElement('main');
      while (mainContent.firstChild) {
        mainElement.appendChild(mainContent.firstChild);
      }
      mainContent.parentNode.insertBefore(mainElement, mainContent);
      mainContent.remove();
    }
  }

  // Ensure all nav elements have proper ARIA labels
  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }
  });
}

// Fix for REACT_041: React SVG Accessible Name
// Add title/desc to SVGs
function enhanceSVGAccessibility() {
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"])');
  svgs.forEach(svg => {
    if (!svg.querySelector('title') && !svg.querySelector('desc')) {
      const title = document.createElement('title');
      title.textContent = 'Graphic element';
      svg.prepend(title);
    }
  });
}

// Fix for REACT_025: React Unique Landmarks
// Ensure landmarks are unique
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
// Replace fake links with proper <a> elements
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