const _ = require('lodash');
const dependencyGraphContent = require('./dependency-graph');

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
  }
};

// New export for the myNewFunction
function myNewFunction(arr) {
  return _.map(arr, item => item * 2);
}

// SVG Accessibility Functions
function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return '';
  }
  
  // Check for aria-label
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label').trim();
  }
  
  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const ids = svgElement.getAttribute('aria-labelledby').split(/\s+/).filter(Boolean);
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
  if (title) {
    return title.textContent.trim();
  }
  
  // Check for desc element (often used as description, but can be used as name)
  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }
  
  // Fallback to text content
  return svgElement.textContent.trim() || '';
}

function setSvgAttributes(svgElement) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return;
  }
  // Ensure the SVG has an id for accessibility
  ensureElementHasId(svgElement);
  // Add a default aria-label if none exists
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', 'SVG graphic');
  }
}

// Landmark Accessibility Functions
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `accessibility-id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }

  // Check for duplicate banners
  const banners = document.querySelectorAll('[role="banner"], [role="header"], header');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }
}

function checkLandmarkElement(role, element) {
  if (!element) {
    return { valid: false, message: 'Element is required' };
  }
  
  const elementRole = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Check if role matches expected landmark role
  if (role === 'main' && elementRole !== 'main' && tagName !== 'main') {
    return { valid: false, message: `Element should be a main landmark` };
  }
  
  // Check for proper labeling
  const hasLabel = element.hasAttribute('aria-label') || 
                   element.hasAttribute('aria-labelledby') ||
                   element.hasAttribute('aria-describedby');
  
  if (!hasLabel && (role === 'nav' || role === 'aside')) {
    return { valid: false, message: `Landmark ${role} should have an accessible name` };
  }
  
  return { valid: true, message: '' };
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  // Check if a <main> element already exists
  let mainElement = document.querySelector('main, [role="main"]');
  if (mainElement) {
    return mainElement;
  }

  // Identify landmark elements that should remain outside of <main>
  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('nav, aside, footer, header, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  // Create a new <main> element
  mainElement = document.createElement('main');
  ensureElementHasId(mainElement);
  mainElement.setAttribute('role', 'main');

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

function checkLandmarks(container = document) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const results = [];
  
  landmarkRoles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"], ${role === 'main' ? 'main' : role === 'navigation' ? 'nav' : role === 'contentinfo' ? 'footer' : role}`);
    
    elements.forEach((element, index) => {
      const checkResult = checkLandmarkElement(role, element);
      results.push({
        role,
        index,
        valid: checkResult.valid,
        message: checkResult.message
      });
    });
  });
  
  return results;
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
  const banners = document.querySelectorAll('header, [role="banner"]');
  const removedBanners = [];
  if (banners.length > 1) {
    for (let i = 1; i < banners.length; i++) {
      removedBanners.push(banners[i]);
      banners[i].remove();
    }
  }

  // Ensure only one contentinfo/footer landmark
  const footers = document.querySelectorAll('footer, [role="contentinfo"]');
  const removedFooters = [];
  if (footers.length > 1) {
    for (let i = 1; i < footers.length; i++) {
      removedFooters.push(footers[i]);
      footers[i].remove();
    }
  }

  return {
    removedMains,
    removedBanners,
    removedFooters
  };
}

// NEW: Implement this function for checking landmark elements
function checkLandmarkElements() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const results = [];
  
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"], ${role === 'main' ? 'main' : role === 'navigation' ? 'nav' : role === 'contentinfo' ? 'footer' : role}`);
    
    elements.forEach((element, index) => {
      // Check if element has aria-labelledby attribute
      if (element.hasAttribute('aria-labelledby')) {
        const labelledbyId = element.getAttribute('aria-labelledby');
        const labelElement = document.getElementById(labelledbyId);
        
        if (!labelElement) {
          results.push({
            type: 'error',
            message: `ARIA-labelledby attribute exists without corresponding element for landmark ${role} at index ${index}`,
            element: element
          });
        }
      }
      
      // Check for proper accessibility attributes
      if (!element.hasAttribute('aria-label') && 
          !element.hasAttribute('aria-labelledby') &&
          role !== 'main') {
        results.push({
          type: 'warning',
          message: `Landmark ${role} at index ${index} should have an accessible name`,
          element: element
        });
      }
    });
  });
  
  return results;
}

// Run the function to check landmark elements
function runLandmarkAccessibilityCheck() {
  const results = checkLandmarkElements();
  const errors = results.filter(r => r.type === 'error');
  
  if (errors.length > 0) {
    console.warn('Accessibility issues found:', errors);
  }
  
  return results;
}

// Preserve the existing exports and add new functions
module.exports = {
  main,
  myNewFunction,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureElementHasId,
  addAriaLabel,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  runLandmarkAccessibilityCheck,
  // Include functions from dependencyGraphContent if available
  ...(dependencyGraphContent && typeof dependencyGraphContent === 'object' ? dependencyGraphContent : {})
};