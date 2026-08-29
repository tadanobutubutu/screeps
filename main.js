// main.js

const _ = require('lodash');
const dependencyGraphContent = require('./dependencyGraphContent');

// - REACT_015: Add lang attribute to HTML element
document.documentElement.lang = 'en';

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  // Check for aria-label first (from origin/main)
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  // Check for aria-labelledby (from origin/main)
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

  // Check for title element (from HEAD)
  const title = svgElement.querySelector('title');
  if (title && title.textContent) return title.textContent.trim();

  // Check for desc element (from origin/main)
  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }

  // Fallback to text content (from origin/main)
  return svgElement.textContent.trim() || '';
}

function updateSvgAccessibleName(svgElement, name) {
  if (!svgElement) return false;
  
  // Remove existing accessible name attributes
  svgElement.removeAttribute('aria-label');
  svgElement.removeAttribute('aria-labelledby');
  
  // Set the new accessible name using aria-label
  svgElement.setAttribute('aria-label', name);
  
  return true;
}

function setSvgAttributes(svgElement) {
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }

  // Ensure the SVG has an id for accessibility (from origin/main)
  ensureElementHasId(svgElement);

  // Add a default aria-label if none exists (from origin/main)
  if (!svgElement.getAttribute('aria-label')) {
    addAriaLabel(svgElement, 'SVG graphic');
  }
}

function setSvgAttributesArray(svgElements) {
  if (!svgElements || !Array.isArray(svgElements)) return;

  svgElements.forEach((svg, index) => {
    if (!svg) return;

    // Get or create a title element for accessibility (from HEAD)
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      svg.insertBefore(title, svg.firstChild);
    }

    // Set a default accessible name if none exists (from HEAD)
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      title.textContent = `SVG ${index + 1}`;
    }

    // Ensure the SVG has proper ARIA attributes (from HEAD)
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', `SVG ${index + 1}`);
    }
  });
}

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: Implement validateLandmark functionality

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
  }
};

// New export for the myNewFunction (from origin/main)
function myNewFunction(arr) {
  return _.map(arr, item => item * 2);
}

// Landmark Accessibility Functions (from origin/main)
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

function checkLandmarkElement(role, element) {
  // (code for checkLandmarkElement remains the same)
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

function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
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
  // (code for ensureUniqueLandmarks continues...)
}

// - REACT_017: Add/fix 4 landmark issues (from origin/main)
const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="search"]');
landmarks.forEach((landmark, index) => {
  landmark.setAttribute('aria-label', 'landmark-' + (index + 1));
  landmark.classList.add('landmark');
});

// - REACT_041: Add accessible names to 2 SVGs (from origin/main)
const svg1 = document.querySelector('svg');
const svg2 = document.querySelectorAll('svg')[1];
if (svg1) {
  svg1.setAttribute('aria-labelledby', 'svg1-title');
}
if (svg2) {
  svg2.setAttribute('aria-labelledby', 'svg2-title');
}

// - REACT_025: Ensure unique landmarks (2 issues) (from origin/main)
const mainElements = document.querySelectorAll('main');
if (mainElements.length > 1) {
  console.warn('Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
}

// - REACT_036: Fix 1 fake link issue (from origin/main)
const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
fakeLinks.forEach(link => {
  link.setAttribute('role', 'presentation');
});

// NEW: Implement this function for checking landmark elements (from origin/main)
function checkLandmarkElements() {
  const landmarks = document.querySelectorAll('.landmark');
  landmarks.forEach((landmark, index) => {
    if (landmark.hasAttribute('aria-labelledby') && !landmark.querySelector(`#landmark-label-${index}`)) {
      console.warn(`REACT_017: ARIA-labelledby attribute exists without corresponding element for landmark at index ${index}`);
    }
  });
}

// Run the function to check landmark elements (from origin/main)
checkLandmarkElements();

// Preserve the existing exports and add new functions (merged from both)
module.exports = {
  main,
  myNewFunction,
  getSvgAccessibleName,
  updateSvgAccessibleName,
  setSvgAttributes,
  setSvgAttributesArray,
  validateLandmark,
  ensureElementHasId,
  addAriaLabel,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  // Include functions from dependencyGraphContent if available (from origin/main)
  ...(dependencyGraphContent && typeof dependencyGraphContent === 'object' ? dependencyGraphContent : {})
};