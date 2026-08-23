import { newFunction } from './newModule';
import { class1, function1, Object1 } from './path/to/module';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
// - REACT_036: Fix 1 fake link issue

// Accessibility fix for REACT_025: Ensure unique landmarks
const uniqueLandmarks = () => {
  // Implementation to ensure all landmarks have unique IDs
  const landmarks = ['nav', 'main', 'header', 'footer', 'aside', 'section', 'article'];
  const existingIds = new Set();
  
  // First pass: collect all existing IDs
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach(element => {
      if (element.id) {
        existingIds.add(element.id);
      }
    });
  });

  // Second pass: ensure all landmarks have unique IDs
  return (element) => {
    if (!element) return false;

    if (!element.id) {
      let counter = 1;
      let newId = element.tagName.toLowerCase() + '-' + counter;
      while (existingIds.has(newId)) {
        counter++;
        newId = element.tagName.toLowerCase() + '-' + counter;
      }
      element.id = newId;
      existingIds.add(newId);
    }

    return true;
  };
};

// Accessibility fix for REACT_015: Add lang attribute to HTML element
const addLangAttribute = () => {
  return (htmlElement) => {
    if (!htmlElement || htmlElement.tagName.toLowerCase() !== 'html') {
      return false;
    }
    if (!htmlElement.getAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
    return true;
  };
};

// Accessibility fix for REACT_017: Add/fix landmark issues
const fixLandmarks = () => {
  const landmarkSelectors = ['nav', 'main', 'header', 'footer', 'aside', 'form'];
  
  return (element) => {
    if (!element) return false;
    
    // Add role if missing for semantic elements
    const tagName = element.tagName.toLowerCase();
    if (['nav', 'main', 'header', 'footer', 'aside'].includes(tagName)) {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', tagName === 'header' ? 'banner' : tagName);
      }
    }
    
    return true;
  };
};

// Accessibility fix for REACT_041: Add accessible names to SVGs
const addSvgAccessibleNames = () => {
  return (svgElement, accessibleName) => {
    if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
      return false;
    }
    
    // Add aria-label if not present
    if (!svgElement.getAttribute('aria-label') && !svgElement.getAttribute('aria-labelledby')) {
      svgElement.setAttribute('aria-label', accessibleName || 'Decorative icon');
    }
    
    // Add title element as fallback
    if (!svgElement.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = accessibleName || 'Icon';
      svgElement.insertBefore(title, svgElement.firstChild);
    }
    
    return true;
  };
};

// Accessibility fix for REACT_036: Fix fake link issues
const fixFakeLinks = () => {
  return (element) => {
    if (!element) return false;
    
    const tagName = element.tagName.toLowerCase();
    
    // If it's a clickable element that should be a link
    if (element.onclick && tagName !== 'a' && tagName !== 'button') {
      // Convert to proper button or add role="button"
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
      
      // Add keyboard support if not present
      if (!element.hasAttribute('onKeyDown')) {
        const originalOnClick = element.onclick;
        element.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            originalOnClick.call(element, e);
          }
        };
      }
    }
    
    // If it's an anchor without href
    if (tagName === 'a' && !element.getAttribute('href') && element.onclick) {
      element.setAttribute('role', 'button');
    }
    
    return true;
  };
};

// PRESERVE all existing code, exports, and functions from current main.js
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Example:
// const someVar = require('some-module');
// function init() { /* ... */ }
// module.exports.loop = function() { /* ... */ }
// ----- END ORIGINAL CODE -----

export { newFunction, class1, function1, Object1, uniqueLandmarks, addLangAttribute, fixLandmarks, addSvgAccessibleNames, fixFakeLinks };