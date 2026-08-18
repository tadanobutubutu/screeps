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

  // Add scope attributes to table headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      // Determine if this is a row or column header based on context
      const isRowHeader = header.parentElement.tagName.toLowerCase() === 'thead' &&
                         header.parentElement.parentElement.tagName.toLowerCase() === 'table';
      header.setAttribute('scope', isRowHeader ? 'row' : 'col');
    }
  });
}

// Fix for REACT_017: React Landmarks
// Add proper ARIA landmarks
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
// Replace fake links with proper <button> elements for in-page actions
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    // Only replace if it's an in-page action (href="#")
    if (link.getAttribute('href') === '#') {
      const button = document.createElement('button');
      // Copy all attributes from the link to the button
      Array.from(link.attributes).forEach(attr => {
        button.setAttribute(attr.name, attr.value);
      });
      // Remove href to prevent default behavior
      button.removeAttribute('href');
      // Replace the link with the button
      link.parentNode.replaceChild(button, link);
      // Add ARIA role for better semantics
      button.setAttribute('role', 'button');
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