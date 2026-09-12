const _ = require('lodash');
const dependencyGraphContent = {};

// - REACT_015: Add lang attribute to HTML element
document.documentElement.lang = 'en';

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  // Check for aria-label first (from origin/main)
  if (svgElement.getAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  // Check for aria-labelledby (from origin/main)
  if (svgElement.getAttribute('aria-labelledby')) {
    const ids = svgElement.getAttribute('aria-labelledby').split(' ');
    let labels = [];
    ids.forEach(id => {
      const labelElement = document.getElementById(id);
      if (labelElement) {
        labels.push(labelElement.textContent);
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
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return;
  }

  // Ensure the SVG has an id for accessibility (from origin/main)
  ensureElementHasId(svgElement);

  // Add a default aria-label if none exists (from origin/main)
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'SVG graphic');
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

    if (!accessibleName && title) {
      title.textContent = `SVG ${index + 1}`;
    }
  });
}

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

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

// New export for the myNewFunction
function myNewFunction(arr) {
  return _.map(arr, item => item * 2);
}

// SVG Accessibility Functions
function getSvgAccessibleName(svgElement) {
  // Check for aria-label
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
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }
  // Ensure the SVG has an id for accessibility
  ensureElementHasId(svgElement);
  // Add a default aria-label if none exists, using accessible name if possible
  if (!svgElement.getAttribute('aria-label')) {
    const accessibleName = getSvgAccessibleName(svgElement);
    const label = accessibleName || 'SVG graphic';
    addAriaLabel(svgElement, label);
  }
}

// Landmark Accessibility Functions
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

// Check for duplicate banners (separate from addAriaLabel)
function checkDuplicateBanners() {
  const banners = document.querySelectorAll('[role="banner"], [role="header"], header');
  if (banners.length > 1) {
    for (let i = 1; i < banners.length; i++) {
      banners[i].removeAttribute('role');
    }
    console.warn('Multiple banner/header landmarks detected. Extra banners have had their roles removed.');
  }
}

function checkLandmarkElement(role, element) {
  if (!element) return false;
  
  // Check if element has the correct role (explicit or implicit)
  const explicitRole = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  const implicitRoles = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'section': 'region',
    'form': 'search'
  };
  
  const expectedRole = implicitRoles[tagName] || explicitRole;
  if (expectedRole !== role) {
    console.warn(`REACT_017: Landmark element has role "${expectedRole}" but expected "${role}"`);
    return false;
  }
  
  // Check for accessible name
  const accessibleName = element.getAttribute('aria-label') || 
                         element.getAttribute('aria-labelledby') || 
                         (element.querySelector('title') && element.querySelector('title').textContent.trim());
  
  if (!accessibleName) {
    console.warn(`REACT_017: Landmark element with role "${role}" lacks accessible name`);
    return false;
  }
  
  return true;
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
  const landmarks = document.querySelectorAll('nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
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
  const landmarkSelectors = 'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"], [role="region"]';
  const landmarks = container.querySelectorAll(landmarkSelectors);
  const issues = [];
  
  landmarks.forEach((landmark, index) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || 
                 (tagName === 'header' ? 'banner' :
                  tagName === 'nav' ? 'navigation' :
                  tagName === 'main' ? 'main' :
                  tagName === 'aside' ? 'complementary' :
                  tagName === 'footer' ? 'contentinfo' : null);
    
    if (role) {
      const isValid = checkLandmarkElement(role, landmark);
      if (!isValid) {
        issues.push({ element: landmark, role, index });
      }
    }
  });
  
  return issues;
}

function ensureUniqueLandmarks() {
  // Ensure only one main landmark
  const mains = document.querySelectorAll('[role="main"], main');
  const removedMains = [];
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].remove();
      removedMains.push(mains[i]);
    }
  }

  // Ensure only one banner landmark
  const banners = document.querySelectorAll('[role="banner"], header');
  const removedBanners = [];
  if (banners.length > 1) {
    for (let i = 1; i < banners.length; i++) {
      banners[i].remove();
      removedBanners.push(banners[i]);
    }
  }

  // Ensure only one contentinfo/footer landmark
  const footers = document.querySelectorAll('[role="contentinfo"], footer');
  if (footers.length > 1) {
    for (let i = 1; i < footers.length; i++) {
      footers[i].remove();
    }
  }

  return {
    removedMains,
    removedBanners
  };
}

// - REACT_017: Add/fix 4 landmark issues (from origin/main)
const landmarkElements = document.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], [role="search"]');
landmarkElements.forEach((landmark, index) => {
  landmark.id = landmark.id || 'landmark-' + (index + 1);
  landmark.classList.add('landmark');
});

// - REACT_041: Add accessible names to 2 SVGs (from origin/main)
const svg1 = document.getElementById('svg1');
const svg2 = document.getElementById('svg2');
if (svg1) {
  svg1.setAttribute('aria-labelledby', 'svg1-title');
}
if (svg2) {
  svg2.setAttribute('aria-labelledby', 'svg2-title');
}

// - REACT_025: Ensure unique landmarks (2 issues) (from origin/main)
const mainElements = document.querySelectorAll('main, [role="main"]');
if (mainElements.length > 1) {
  // Log warning for debugging purposes
  console.warn('Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
  // The static fix should be applied in the source files:
  // - ... Replace one <main> with <section role="region" ...
  // - ... Same fix
}

// - REACT_036: Fix 1 fake link issue (from origin/main)
const fakeLinks = document.querySelectorAll('a:not([href])');
fakeLinks.forEach(link => {
  // Add the `role` attribute to indicate the link is not a real navigation link
  link.setAttribute('role', 'presentation');
});

// NEW: Implement this function for checking landmark elements
function checkLandmarkElements() {
  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach((landmark, index) => {
    if (landmark.hasAttribute('aria-labelledby') && !document.getElementById(landmark.getAttribute('aria-labelledby'))) {
      console.warn(`ARIA-labelledby attribute exists without corresponding element for landmark at index ${index}`);
    }
  });
}

// Run the function to check landmark elements
if (typeof document !== 'undefined') {
  checkLandmarkElements();
  ensureUniqueLandmarks();
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

// Preserve the existing exports and add new functions
module.exports = {
  main,
  myNewFunction,
  getSvgAccessibleName,
  updateSvgAccessibleName,
  setSvgAttributes,
  ensureElementHasId,
  addAriaLabel,
  checkLandmarkElement,
  checkDuplicateBanners,
  validateLandmark,
  validateLandmarkStructure,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  createInPageButton,
  // Include functions from dependencyGraphContent if available
  ...(dependencyGraphContent && typeof dependencyGraphContent === 'object' ? dependencyGraphContent : {})
};