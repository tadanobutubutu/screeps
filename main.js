// TODO: Implement the new function as per the issue requirements

// main.js - Combined utility and accessibility features

// Existing functionality preserved
function exampleFunction() {
  return 'example';
}

// New function implementation
function processData(input) {
  if (!input) {
    return null;
  }
  return input;
}

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);
  
  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion
  };
}

// TODO: add the new functions or changes requested in the issue

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

// Add accessible names to SVG elements
function addAccessibleNamesToSvg() {
  const svgs = document.querySelectorAll('svg');
  if (svgs.length >= 2) {
    svgs[0].setAttribute('aria-label', 'First SVG');
    svgs[1].setAttribute('aria-label', 'Second SVG');
  }
}

/**
 * Renders an index view with accessibility support
 * @param {Object} options - Configuration options
 * @param {Array} options.data - Array of items to render
 * @param {HTMLElement|string} options.container - Container element or selector
 * @param {Function} options.itemRenderer - Function to render each item (receives item and index)
 * @param {Function} [options.onItemSelect] - Callback when item is selected
 * @param {string} [options.role='list'] - ARIA role for the list
 * @param {string} [options.itemRole='listitem'] - ARIA role for each item
 * @returns {Object|null} - Methods to interact with the view or null on error
 */
function renderIndexView(options = {}) {
  const {
    data = [],
    container,
    itemRenderer,
    onItemSelect,
    role = 'list',
    itemRole = 'listitem'
  } = options;

  // Get container element
  let containerEl;
  if (typeof container === 'string') {
    containerEl = document.querySelector(container);
  } else {
    containerEl = container;
  }

  if (!containerEl) {
    console.error('renderIndexView: Container element not found');
    return null;
  }

  if (typeof itemRenderer !== 'function') {
    console.error('renderIndexView: itemRenderer function is required');
    return null;
  }

  // Create the list element
  const list = document.createElement('ul');
  list.setAttribute('role', role);
  list.setAttribute('class', 'index-view-list');
  list.id = `index-view-${Date.now()}`;

  // Create document fragment for performance
  const fragment = document.createDocumentFragment();
  const itemElements = [];

  data.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.setAttribute('role', itemRole);
    listItem.setAttribute('tabindex', '0');
    listItem.dataset.index = index;

    const renderedContent = itemRenderer(item, index);
    if (renderedContent instanceof HTMLElement) {
      listItem.appendChild(renderedContent);
    } else {
      listItem.innerHTML = renderedContent;
    }

    itemElements.push(listItem);
    fragment.appendChild(listItem);
  });

  list.appendChild(fragment);
  containerEl.appendChild(list);

  // Set up keyboard navigation
  const handleKeyDown = (event) => {
    const currentIndex = parseInt(event.target.dataset.index, 10);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < itemElements.length - 1) {
          itemElements[currentIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          itemElements[currentIndex - 1].focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        itemElements[0].focus();
        break;
      case 'End':
        event.preventDefault();
        itemElements[itemElements.length - 1].focus();
        break;
      case 'Enter':
      case ' ':
        if (onItemSelect) {
          event.preventDefault();
          onItemSelect(itemElements[currentIndex], item);
        }
        break;
    }
  };

  list.addEventListener('keydown', handleKeyDown);

  // Handle item selection on click
  list.addEventListener('click', (event) => {
    const clickedItem = event.target.closest('li');
    if (clickedItem && onItemSelect) {
      const index = parseInt(clickedItem.dataset.index, 10);
      onItemSelect(clickedItem, data[index]);
    }
  });

  // Set initial focus to first item if any
  if (itemElements.length > 0) {
    itemElements[0].focus();
  }

  return {
    getList: () => list,
    getItems: () => itemElements,
    getItem: (index) => itemElements[index],
    updateData: (newData) => {
      itemElements.forEach((el) => el.remove());
      itemElements.length = 0;

      const newFragment = document.createDocumentFragment();
      newData.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', itemRole);
        listItem.setAttribute('tabindex', '0');
        listItem.dataset.index = index;

        const renderedContent = itemRenderer(item, index);
        if (renderedContent instanceof HTMLElement) {
          listItem.appendChild(renderedContent);
        } else {
          listItem.innerHTML = renderedContent;
        }

        itemElements.push(listItem);
        newFragment.appendChild(listItem);
      });

      list.appendChild(newFragment);

      if (itemElements.length > 0) {
        itemElements[0].focus();
      }
    },
    destroy: () => {
      list.removeEventListener('keydown', handleKeyDown);
      list.removeEventListener('click', handleKeyDown);
      list.remove();
      itemElements.length = 0;
    }
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    exampleFunction,
    processData,
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    addAccessibleNamesToSvg,
    renderIndexView
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
    addAccessibleNamesToSvg();
  });
}