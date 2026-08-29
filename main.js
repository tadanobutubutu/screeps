// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} lang - The language code (e. g., 'en', 'es', 'fr')
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && htmlElement.setAttribute) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Manages focus for accessibility (ARIA best practice)
 * @param {HTMLElement} element - The element to focus on
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Traps focus within a container element (useful for modals/dialogs)
 * @param {HTMLElement} container - The container element
 * @param {KeyboardEvent} event - The keyboard event
 */
function trapFocus(container, event) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Announces content to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcementElement = document.createElement('div');
  announcementElement.setAttribute('aria-live', priority);
  announcementElement.setAttribute('role', 'alert');
  announcementElement.className = 'sr-only';
  document.body.appendChild(announcementElement);
  
  if (announcementElement) {
    announcementElement.textContent = '';
    // Force screen reader to announce by removing and re-adding content
    setTimeout(() => {
      announcementElement.textContent = message;
    }, 100);
  }
}

/**
 * Handles keyboard navigation for custom components
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} orientation - 'horizontal' or 'vertical'
 */
function handleKeyboardNavigation(event, orientation = 'horizontal') {
  const key = event.key;
  const isVertical = orientation === 'vertical';
  const nextKeys = isVertical ? ['ArrowDown'] : ['ArrowRight'];
  const prevKeys = isVertical ? ['ArrowUp'] : ['ArrowLeft'];

  if (nextKeys.includes(key) || prevKeys.includes(key)) {
    event.preventDefault();
    // Navigation logic handled by component-specific implementations
  }
}

// ----- Additional functions (origin/main) -----
// Main.js - Application entry point

function newFeature() {
  // Version 2 implementation (origin/main branch)
  // Code for version 2 implementation replaces the original version 1 code.
  // This assumes that version 2 is a replacement or an upgrade of the existing feature.

  // TODO: Add any other missing exports that might have been?
  // Added missing exports as per the issue

  // Existing exports as they were before the conflict
  // No changes needed since they were not part of the conflict
}

// main.js

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  const nav = document.querySelector('nav');
  if (nav) {
    nav.setAttribute('role', 'navigation');
  }

  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
  }

  const footer = document.querySelector('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
  }

  // Function to ensure all SVG elements have accessible names
  const ensureSvgAccessibleNames = () => {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      // Check if SVG is hidden
      const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                       svg.getAttribute('hidden') !== null ||
                       svg.style.display === 'none' ||
                       svg.style.visibility === 'hidden';

      if (isHidden) {
        return;
      }

      // Check for existing accessible name
      const hasAriaLabel = svg.getAttribute('aria-label') !== null;
      const hasAriaLabelledBy = svg.getAttribute('aria-labelledby') !== null;
      const hasTitle = svg.querySelector('title') !== null;
      const hasDesc = svg.querySelector('desc') !== null;

      if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
        return;
      }

      // Determine if decorative - SVGs used for favicons/decorative purposes
      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.closest('head') !== null;

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('role', 'presentation');
      } else {
        // Add a generic title for non-decorative SVGs
        const title = document.createElement('title');
        title.textContent = 'Icon';
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Icon');
      }
    });
  };

  // Function to handle updating accessible SVG names when DOM mutates
  const updateAccessibleSvgNames = () => {
    setTimeout(() => {
      ensureSvgAccessibleNames();
    }, 0);
  };

  // Initial run
  ensureSvgAccessibleNames();

  // Run again after DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      updateAccessibleSvgNames();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'aria-label', 'aria-labelledby']
      });
    }
  }
});

// Assuming the button click is handled by JavaScript, here 's how it might look:
document.addEventListener('click', (e) => {
  if (e.target.id === 'back-button') {
    rotateBack();
  }
});

// Combined module exports for both accessibility and Node utilities
module.exports = {
  // Accessibility functions (from HEAD)
  addLangAttribute,
  manageFocus,
  trapFocus,
  announceToScreenReader,
  handleKeyboardNavigation,
  // Node utilities and other functions (from origin/main)
  helloWorld,
  rotateBack,
  checkTableStructure,
  validateTableSchema,
  existingFunction,
  newFunction,
  myFunction1,
  myFunction2,
  addressAccessibilityIssues,
  loop: function() {
    console.log('Running screeps loop');
  },
  newFeature: newFeature,
  // Spawning logic
  spawnCreep,
  canSpawn,
  getSpawnQueue,
  clearSpawnQueue,
  getCreepsByRole,
  // Additional exports
  helloWorld,
  rotateBack,
  checkTableStructure,
  validateTableSchema,
  existingFunction,
  newFunction,
  myFunction1,
  myFunction2,
  addressAccessibilityIssues,
  loop: function() {
    console.log('Running screeps loop');
  },
  newFeature: newFeature,
  // Spawning logic
  spawnCreep,
  canSpawn,
  getSpawnQueue,
  clearSpawnQueue,
  getCreepsByRole
};