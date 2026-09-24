function addSvgAccessibilityProps() {
    if (typeof document === 'undefined') return;
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
            svg.setAttribute('aria-label', 'Accessible SVG graphic');
        }
        if (!svg.hasAttribute('role')) {
            svg.setAttribute('role', 'img');
        }
        if (!svg.hasAttribute('focusable')) {
            svg.setAttribute('focusable', 'false');
        }
      }
    }
  });
}

// Handle keyboard navigation for custom components
function handleKeyboardNavigation(items, options = {}) {
  const itemsArray = items;
  itemsArray.forEach((item, index) => {
    item.setAttribute('tabindex', index === 0 ? '0' : '-1');
    item.addEventListener('keydown', (e) => {
      let newIndex;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        newIndex = (index + 1) % itemsArray.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        newIndex = (index - 1 + itemsArray.length) % itemsArray.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = itemsArray.length - 1;
      }
      if (newIndex !== undefined) {
        itemsArray[newIndex].focus();
        itemsArray[newIndex].setAttribute('tabindex', '0');
        item.setAttribute('tabindex', '-1');
        e.preventDefault();
      }
    });
}

// Insight Report Accessibility Issues:
// - Missing ARIA labels on interactive elements
// - Keyboard navigation improvements needed
// - Focus management for dynamic content
// - Color contrast compliance
// - Screen reader announcements for dynamic updates

// Skip link functionality
function initSkipLinks() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
        e.preventDefault();
      }
    });
  }
}

// Import required modules and export the new necessary functions here in main.js (preserving the original code)
// No additional external modules are required; browser globals (document) are used.

  // Validate lang attribute format (BCP 47 compliance)
  const validLangPattern = /^[a-z]{2,3}(-[A-Z]{2})?$/i;
  if (!validLangPattern.test(lang)) {
    return false;
  }

    // BEGIN CHANGES TO ADDRESS ACCESSIBILITY ISSUES

// New function: checkAccessibilityAttributes
const checkAccessibilityAttributes = (element) => {
  const attributes = {};

  if (!element) {
    return attributes;
  }

  attributes.lang = element.getAttribute('lang');
  attributes.role = element.getAttribute('role');
  attributes.ariaLabel = element.getAttribute('aria-label');
  attributes.ariaDescribedby = element.getAttribute('aria-describedby');
  attributes.ariaHidden = element.getAttribute('aria-hidden');
  attributes.tabIndex = element.getAttribute('tabindex');

  return attributes;
};

// New function: ensureAccessibility
const ensureAccessibility = (element, options = {}) => {
  if (!element) {
    return false;
  }

  let success = true;

  if (options.lang) {
    success = setLangAttribute(element, options.lang) && success;
  }

  if (options.role) {
    element.setAttribute('role', options.role);
  }

  if (options.ariaLabel) {
    element.setAttribute('aria-label', options.ariaLabel);
  }

  return success;
};

// New function: ensureDependencyGraphARIA
function ensureDependencyGraphARIA(container) {
  const graph = container.querySelector('.dependency-graph') || container.querySelector('[data-graph]');
  if (graph) {
    if (!graph.getAttribute('role')) {
      graph.setAttribute('role', 'img');
    }
    if (!graph.getAttribute('aria-label')) {
      graph.setAttribute('aria-label', 'Dependency graph');
    }

module.exports = {
  announceToScreenReader,
  trapFocus,
  handleKeyboardNavigation,
  prefersReducedMotion,
  initSkipLinks,
  setLangAttribute,
  checkAccessibilityAttributes,
  ensureAccessibility,
  ensureDependencyGraphARIA
};