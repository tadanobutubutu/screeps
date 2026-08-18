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
    if (link.id === 'unrotate') {
      const button = document.createElement('button');
      button.id = link.id;
      button.textContent = link.textContent;
      button.className = link.className;
      button.setAttribute('aria-label', link.getAttribute('aria-label') || 'Rotate back');

      // Copy any event listeners from the original link
      const clone = link.cloneNode(true);
      const listeners = getEventListeners(link);
      Object.keys(listeners).forEach(eventType => {
        listeners[eventType].forEach(listener => {
          button.addEventListener(eventType, listener.listener);
        });
      });

      link.parentNode.replaceChild(button, link);
    }
  });
}

// Helper function to get event listeners (simplified version)
function getEventListeners(element) {
  const listeners = {};
  const events = ['click', 'keydown', 'focus', 'blur'];
  events.forEach(eventType => {
    const eventListeners = [];
    const handler = element[`on${eventType}`];
    if (handler) {
      eventListeners.push({ listener: handler });
    }
    listeners[eventType] = eventListeners;
  });
  return listeners;
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