// TODO: Address accessibility issues from insight report:

// Accessibility helper functions
const A11yHelpers = {
  // Create a visually hidden but screen-reader accessible element
  createScreenReaderOnly: (text) => {
    const srElement = document.createElement('span');
    srElement.setAttribute('aria-hidden', 'true');
    return srElement;
  },

  // Announce content to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Trap focus within an element (useful for modals)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },

  // Handle escape key to close modals/dropdowns
  handleEscapeKey: (callback) => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Add accessible name to SVGs
  addAccessibleNameToSVG: (svgElement, label) => {
    if (!svgElement) return;

    // Add aria-label to the SVG element
    svgElement.setAttribute('aria-label', label);

    // Optionally, add a title element for accessibility
    const title = document.createElement('title');
    title.textContent = label;
    svgElement.insertBefore(title, svgElement.firstChild);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { A11yHelpers };
} else {
  export { A11yHelpers };
}

// React component
import React from 'react';
import ReactDOM from 'react-dom/client';
const htmlElement = document.querySelector('html');
if (htmlElement) {
  htmlElement.setAttribute('lang', 'en');
}
const App = () => {
  return (
    <div id="root" lang="en" role="main">
      <header role="banner">
        <h1 id="app-title">Welcome</h1>
      </header>
      <main id="main-content">
        <p id="description">This is a demo application.</p>
        <table id="data-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>30</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>25</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};
export default App;

// Update the SVG icons to include accessible names
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Apple Icon</title><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>',
};

// Assuming there is a function to set the icons, we would call it like this:
// setIcons(icons);

// If the icons are directly used in the component, we would modify the component to include the accessible name
// For example:
// <img src={icons.icon} alt="Screeps Dashboard" aria-label="Screeps Dashboard" />
// <img src={icons.apple} alt="Apple Icon" aria-label="Apple Icon" />