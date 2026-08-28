// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

// REACT_025: Add other accessibility changes as per the insight report
function setupAccessibility() {
  // Add skip to main content link for keyboard users
  const existingSkipLink = document.querySelector('.skip-link');
  if (!existingSkipLink && document.body) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '0';
    skipLink.style.background = '#000';
    skipLink.style.color = '#fff';
    skipLink.style.padding = '8px 16px';
    skipLink.style.zIndex = '9999';
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Add ARIA live region for dynamic content announcements
  let liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.padding = '0';
    liveRegion.style.margin = '-1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';
    document.body.appendChild(liveRegion);
  }

  // Ensure all interactive elements are properly keyboard accessible
  const interactiveElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]');
  interactiveElements.forEach(el => {
    if (!el.hasAttribute('tabindex') || el.getAttribute('tabindex') === '0') {
      el.style.outline = 'none';
      el.addEventListener('focus', () => {
        el.style.outline = '2px solid #0066cc';
        el.style.outlineOffset = '2px';
      });
      el.addEventListener('blur', () => {
        el.style.outline = 'none';
      });
    }
  });

  // Add landmark roles if missing
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.hasAttribute('id')) {
    mainElement.id = 'main-content';
  }

  // Announce page changes for screen readers
  const announceToScreenReader = (message) => {
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 100);
    }
  };

  return { announceToScreenReader };
}

// Initialize accessibility features
function init() {
  addLangAttribute('en');
  setupAccessibility();
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Export functions for testing
export { addLangAttribute, setupAccessibility, init };

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}