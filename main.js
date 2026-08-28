// main.js

const _ = require('lodash');
const dependencyGraphContent = require('./dependencyGraphContent');

// - REACT_015: Add lang attribute to HTML element
document.documentElement.lang = 'en';

// Setup keyboard navigation for accessibility
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Handle Tab key navigation
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
}

// Setup ARIA attributes for screen readers
function setupAccessibilityAttributes() {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    
    interactiveElements.forEach(function(element) {
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            console.warn('Interactive element missing accessible label:', element);
        }
    });
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  // Check for aria-label first
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const ids = svgElement.getAttribute('aria-labelledby').split(' ');
    let labels = [];
    ids.forEach(id => {
      const labelElement = document.getElementById(id);
      if (labelElement) {
        labels.push(labelElement.textContent.trim());
      }
    });
    if (labels.length > 0) {
      return labels.join(' ');
    }
  }

  // Check for title element
  const title = svgElement.querySelector('title');
  if (title && title.textContent) return title.textContent.trim();

  // Check for desc element
  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }

  // Fallback to text content
  return svgElement.textContent.trim() || '';
}

function setSvgAttributes(svgElement) {
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }

  // Ensure the SVG has an id for accessibility
  ensureElementHasId(svgElement);

  // Add a default aria-label if none exists
  if (!svgElement.getAttribute('aria-label')) {
    addAriaLabel(svgElement, 'SVG graphic');
  }
}

function setSvgAttributesArray(svgElements) {
  if (!svgElements || !Array.isArray(svgElements)) return;

  svgElements.forEach((svg, index) => {
    if (!svg) return;

    // Get or create a title element for accessibility
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      svg.insertBefore(title, svg.firstChild);
    }

    // Set a default accessible name if none exists
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      title.textContent = `SVG ${index + 1}`;
    }

    // Ensure the SVG has proper ARIA attributes
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', `SVG ${index + 1}`);
    }
  });
}

function validateLandmark(landmark) {
  if (!landmark) return false;
  if (!landmark.name || typeof landmark.name !== 'string') return false;
  if (typeof landmark.lat !== 'number' || typeof landmark.lng !== 'number') return false;
  if (landmark.lat < -90 || landmark.lat > 90) return false;
  if (landmark.lng < -180 || landmark.lng > 180) return false;
  return true;
}

// Main module entry point
// This file serves as the main entry for the application
const main = {
  // Store for functions
  functions: {},
  
  // Register a function
  register: function(name, fn) {
    this.functions[name] = fn;
  },
  
  // Get a registered function
  get: function(name) {
    return this.functions[name];
  },
  
  // Execute a registered function
  execute: function(name, ...args) {
    const fn = this.functions[name];
    if (typeof fn === 'function') {
      return fn.apply(this, args);
    }
    throw new Error(`Function ${name} not found`);
  },
  
  // Initialize the application
  init: function() {
    // Add keyboard navigation support
    setupKeyboardNavigation();
    
    // Add ARIA labels where needed
    setupAccessibilityAttributes();
    
    console.log('Application initialized');
  }
};

function myNewFunction(arr) {
  return _.map(arr, item => item * 2);
}

// Landmark Accessibility Functions
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  // Check if a <main> element already exists
  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  // Identify landmark elements that should remain outside of <main>
  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  // Create a new <main> element
  mainElement = document.createElement('main');

  // Move all body children that are not in the exclude list into <main>
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  // Append the <main> element to the body
  document.body.appendChild(mainElement);

  return mainElement;
}

function ensureUniqueLandmarks() {
  // Ensure only one main landmark
  const mains = document.querySelectorAll('main, [role="main"]');
  const removedMains = [];
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      removedMains.push(mains[i]);
      mains[i].remove();
    }
  }

  // Ensure only one banner landmark
  const banners = document.querySelectorAll('[role="banner"], header');
  const removedBanners = [];
  if (banners.length > 1) {
    for (let i = 1; i < banners.length; i++) {
      removedBanners.push(banners[i]);
      banners[i].remove();
    }
  }

  // Ensure only one contentinfo/footer landmark
  const footers = document.querySelectorAll('[role="contentinfo"], footer');
  if (footers.length > 1) {
    for (let i = 1; i < footers.length; i++) {
      footers[i].remove();
    }
  }
}

function checkLandmarkElements() {
  const landmarks = document.querySelectorAll('.landmark');
  landmarks.forEach((landmark, index) => {
    if (landmark.hasAttribute('aria-labelledby') && !landmark.querySelector(`#landmark-label-${index}`)) {
      console.warn(`REACT_017: ARIA-labelledby attribute exists without corresponding element for landmark at index ${index}`);
    }
  });
}

// Initialize the application
function init() {
    // Add keyboard navigation support
    setupKeyboardNavigation();
    
    // Add ARIA labels where needed
    setupAccessibilityAttributes();
    
    console.log('Application initialized');
}

// Run the function to check landmark elements
checkLandmarkElements();

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        main: main,
        init: init,
        setupKeyboardNavigation: setupKeyboardNavigation,
        setupAccessibilityAttributes: setupAccessibilityAttributes,
        myNewFunction: myNewFunction,
        getSvgAccessibleName: getSvgAccessibleName,
        setSvgAttributes: setSvgAttributes,
        setSvgAttributesArray: setSvgAttributesArray,
        validateLandmark: validateLandmark,
        ensureElementHasId: ensureElementHasId,
        addAriaLabel: addAriaLabel,
        wrapPrimaryContentInMain: wrapPrimaryContentInMain,
        ensureUniqueLandmarks: ensureUniqueLandmarks,
        checkLandmarkElements: checkLandmarkElements,
        // Include functions from dependencyGraphContent if available
        ...(dependencyGraphContent && typeof dependencyGraphContent === 'object' ? dependencyGraphContent : {})
    };
}