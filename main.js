// Import required modules
import { union } from 'lodash'; // You'll need to install lodash if it's not already installed

// Import graph rendering functions
import { renderGraph } from './newGraphRenderingFunctions'; // Assuming you have a separate file for the new functions

/**
 * Check and ensure accessibility attributes for links and buttons
 */
export function checkLinkAndButtonAccessibility() {
  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button');

  links.forEach(link => {
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'link');
    }
    if (!link.hasAttribute('href')) {
      console.error('Accessibility Error: Link without href attribute', link);
    }
  });

  buttons.forEach(button => {
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
    // Check for accessible name for buttons
    if (!button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) {
      console.error('Accessibility Error: Button without accessible name', button);
    }
  });
}

// Function to render graph/index using new functions
function renderGraphIndex() {
  // JavaScript code to prepare data for the graph
  const data = prepareDataForGraph();

  // Render the graph using the new functions
  renderGraph(data);
}

// Update the existing rotateBack function to call renderGraphIndex
export function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');

  // Call renderGraphIndex before rotating back
  renderGraphIndex();
}

// ... Existing functions from current main.js ...

/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
export function calculateSum(a, b) {
  return a + b;
}

export function calculateDifference(a, b) {
  return a - b;
}

export function calculateProduct(a, b) {
  return a * b;
}

export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function divide(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new Error('Both operands must be numbers.');
  }
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

/**
 * Check if an element has the specified accessibility attribute
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} attribute - The accessibility attribute to check for
 * @returns {boolean} True if the attribute is present and non-empty, false otherwise
 */
export function checkAccessibilityAttribute(element, attribute) {
  if (!element || typeof element.getAttribute !== 'function') {
    return false;
  }
  const value = element.getAttribute(attribute);
  return value !== null && value !== '';
}

/**
 * Ensure an element has a non-empty accessibility label
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element has an aria-label or accessible name, false otherwise
 */
export function ensureAccessibleLabel(element) {
  if (!element) {
    return false;
  }
  return checkAccessibilityAttribute(element, 'aria-label') ||
         checkAccessibilityAttribute(element, 'aria-labelledby') ||
         checkAccessibilityAttribute(element, 'alt');
}

/**
 * Validate that an element has proper focusability for accessibility
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element is focusable, false otherwise
 */
export function validateFocusableElement(element) {
  if (!element) {
    return false;
  }
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
  const tagName = element.tagName?.toLowerCase();
  const isFocusable = focusableTags.includes(tagName) ||
                      element.tabIndex >= 0 ||
                      checkAccessibilityAttribute(element, 'tabindex');
  return isFocusable && !element.hasAttribute('disabled');
}

// Default export for backwards compatibility
export default {
  calculateSum,
  calculateDifference,
  calculateProduct,
  isNumber,
  clamp,
  divide,
  start() {
    console.log('Application started');
    return Promise.resolve();
  }
};

export const logger = {
  info(message) {
    console.log(`[INFO] ${message}`);
  }
};

const a11yStore = {
  // ... existing code (from both conflicting branches)

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // Game loop function
  run() {
    // Your game logic here...

    // Update scope attributes in all .html files in the views directory
    const viewsDir = path.join(__dirname, 'views');
    fs.readdirSync(viewsDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const filePath = path.join(viewsDir, file);
        updateThScopeAttribute(filePath);
      });
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = [...document.querySelectorAll('[role="landmark"]')];
    landmarkElements.forEach((landmark, index) => {
      // Ensure landmark has a unique ID
      if (landmark.id === '') {
        landmark.id = `landmark-${index}`;
      }

      // Ensure unique accessible names for duplicate landmarks
      if (landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${landmarkElements[index].nodeName.toLowerCase()}-${index + 1}`);
      }
    });
  },

  // ... Existing functions from current main.js ...

/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
export function calculateSum(a, b) {
  return a + b;
}

export function calculateDifference(a, b) {
  return a - b;
}

export function calculateProduct(a, b) {
  return a * b;
}

export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function divide(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new Error('Both operands must be numbers.');
  }
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

/**
 * Check if an element has the specified accessibility attribute
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} attribute - The accessibility attribute to check for
 * @returns {boolean} True if the attribute is present and non-empty, false otherwise
 */
export function checkAccessibilityAttribute(element, attribute) {
  if (!element || typeof element.getAttribute !== 'function') {
    return false;
  }
  const value = element.getAttribute(attribute);
  return value !== null && value !== '';
}

/**
 * Ensure an element has a non-empty accessibility label
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element has an aria-label or accessible name, false otherwise
 */
export function ensureAccessibleLabel(element) {
  if (!element) {
    return false;
  }
  return checkAccessibilityAttribute(element, 'aria-label') ||
         checkAccessibilityAttribute(element, 'aria-labelledby') ||
         checkAccessibilityAttribute(element, 'alt');
}

/**
 * Validate that an element has proper focusability for accessibility
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element is focusable, false otherwise
 */
export function validateFocusableElement(element) {
  if (!element) {
    return false;
  }
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
  const tagName = element.tagName?.toLowerCase();
  const isFocusable = focusableTags.includes(tagName) ||
                      element.tabIndex >= 0 ||
                      checkAccessibilityAttribute(element, 'tabindex');
  return isFocusable && !element.hasAttribute('disabled');
}

// Default export for backwards compatibility
export default {
  calculateSum,
  calculateDifference,
  calculateProduct,
  isNumber,
  clamp,
  divide,
  start() {
    console.log('Application started');
    return Promise.resolve();
  }
};

export const logger = {
  info(message) {
    console.log(`[INFO] ${message}`);
  }
};

const a11yStore = {
  // ... existing code (from both conflicting branches)

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // Game loop function
  run() {
    // Your game logic here...

    // Update scope attributes in all .html files in the views directory
    const viewsDir = path.join(__dirname, 'views');
    fs.readdirSync(viewsDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const filePath = path.join(viewsDir, file);
        updateThScopeAttribute(filePath);
      });
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = [...document.querySelectorAll('[role="landmark"]')];
    landmarkElements.forEach((landmark, index) => {
      // Ensure landmark has a unique ID
      if (landmark.id === '') {
        landmark.id = `landmark-${index}`;
      }

      // Ensure unique accessible names for duplicate landmarks
      if (landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${landmarkElements[index].nodeName.toLowerCase()}-${index + 1}`);
      }
    });
  },

  // ... Existing functions from current main.js ...

/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
export function calculateSum(a, b) {
  return a + b;
}

export function calculateDifference(a, b) {
  return a - b;
}

export function calculateProduct(a, b) {
  return a * b;
}

export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function divide(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new Error('Both operands must be numbers.');
  }
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

/**
 * Check if an element has the specified accessibility attribute
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} attribute - The accessibility attribute to check for
 * @returns {boolean} True if the attribute is present and non-empty, false otherwise
 */
export function checkAccessibilityAttribute(element, attribute) {
  if (!element || typeof element.getAttribute !== 'function') {
    return false;
  }
  const value = element.getAttribute(attribute);
  return value !== null && value !== '';
}

/**
 * Ensure an element has a non-empty accessibility label
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element has an aria-label or accessible name, false otherwise
 */
export function ensureAccessibleLabel(element) {
  if (!element) {
    return false;
  }
  return checkAccessibilityAttribute(element, 'aria-label') ||
         checkAccessibilityAttribute(element, 'aria-labelledby') ||
         checkAccessibilityAttribute(element, 'alt');
}

/**
 * Validate that an element has proper focusability for accessibility
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element is focusable, false otherwise
 */
export function validateFocusableElement(element) {
  if (!element) {
    return false;
  }
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
  const tagName = element.tagName?.toLowerCase();
  const isFocusable = focusableTags.includes(tagName) ||
                      element.tabIndex >= 0 ||
                      checkAccessibilityAttribute(element, 'tabindex');
  return isFocusable && !element.hasAttribute('disabled');
}

// Default export for backwards compatibility
export default {
  calculateSum,
  calculateDifference,
  calculateProduct,
  isNumber,
  clamp,
  divide,
  start() {
    console.log('Application started');
    return Promise.resolve();
  }
};

export const logger = {
  info(message) {
    console.log(`[INFO] ${message}`);
  }
};

const a11yStore = {
  // ... existing code (from both conflicting branches)

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // Game loop function
  run() {
    // Your game logic here...

    // Update scope attributes in all .html files in the views directory
    const viewsDir = path.join(__dirname, 'views');
    fs.readdirSync(viewsDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const filePath = path.join(viewsDir, file);
        updateThScopeAttribute(filePath);
      });
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = [...document.querySelectorAll('[role="landmark"]')];
    landmarkElements.forEach((landmark, index) => {
      // Ensure landmark has a unique ID
      if (landmark.id === '') {
        landmark.id = `landmark-${index}`;
      }

      // Ensure unique accessible names for duplicate landmarks
      if (landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${landmarkElements[index].nodeName.toLowerCase()}-${index + 1}`);
      }
    });
  },

  // ... Existing functions from current main.js ...
};