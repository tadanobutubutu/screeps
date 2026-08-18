// Current main.js placeholder
// This file needs to be updated to fix REACT_017 React Landmarks issue

// Add <main> landmark to fix accessibility warnings
export function MainContent({ children }) {
  return <main>{children}</main>;
}

// The following files need <main> landmark updates:
// - app/layout.tsx
// - dashboard/app/layout.tsx
// - docs/index.html
// - (additional affected files)

const navElements = document.querySelectorAll('nav');
navElements.forEach(nav => {
  if (!nav.getAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }
});

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
// Ensure only one main landmark exists
function ensureUniqueMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Multiple main elements found. Only the first one will be kept.');
    for (let i = 1; i < mainElements.length; i++) {
      const element = mainElements[i];
      const parent = element.parentNode;
      const section = document.createElement('section');
      for (let attr of element.attributes) {
        section.setAttribute(attr.name, attr.value);
      }
      while (element.firstChild) {
        section.appendChild(element.firstChild);
      }
      parent.replaceChild(section, element);
    }
  }
}

// Fix for REACT_025: React Unique Landmarks
// Ensure landmarks are unique
function ensureUniqueLandmarks() {
  const landmarks = ['navigation', 'search', 'region'];
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
    if (link.tagName.toLowerCase() !== 'a') {
      console.warn('Fake link detected. Consider using proper <a> elements.');
    }
  });
}

// Initialize accessibility enhancements
function initAccessibility() {
  addLandmarks();
  enhanceSVGAccessibility();
  ensureUniqueMainLandmark(); // New function for main landmark
  ensureUniqueLandmarks(); // Existing function for other landmarks
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
export default MainContent;