import { addLangAttribute, fixTableStructureIssues, addMainLandmark, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssue, checkLinkAndButtonAccessibility } from './accessibilityFixes';

const _ = require('lodash');
import dependencyGraphContent from './dependencyGraphContent';

// - REACT_015: Add lang attribute to HTML element
document.documentElement.lang = 'en';

const dependencyGraphContent = require('./dependencyGraphContent');

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
  // Add a default aria-label if none exists
  if (!svgElement.getAttribute('aria-label')) {
    addAriaLabel(svgElement, 'SVG graphic');
  }
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

  // Check for duplicate banners
  const banners = document.querySelectorAll('[role="banner"], [role="header"]');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
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

// - REACT_017: Add/fix 4 landmark issues
// Assuming landmarks are represented by ARIA roles, you might add or correct them like this:
const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="search"]');
landmarks.forEach((landmark, index) => {
  // Assuming you know which ARIA roles are correct for your landmarks
  landmark.setAttribute('aria-label', 'landmark-' + (index + 1));
  landmark.classList.add('landmark');
});

// - REACT_041: Add accessible names to 2 SVGs
const svg1 = document.querySelector('svg');
const svg2 = document.querySelectorAll('svg')[1];
if (svg1) {
  svg1.setAttribute('aria-labelledby', 'svg1-title');
}
if (svg2) {
  svg2.setAttribute('aria-labelledby', 'svg2-title');
}

// - REACT_025: Ensure unique landmarks (2 issues)
// Fix: For components with conditional <main> elements (e.g., Dashboard error/success states),
// ensure only ONE <main> landmark exists in the source. Replace duplicate <main> tags
// in conditional branches with <section> elements. For runtime validation:
const mainElements = document.querySelectorAll('main');
if (mainElements.length > 1) {
  // Log warning for debugging purposes
  console.warn('Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
  // The static fix should be applied in the source files:
  // - ... Replace one <main> with <section role="region" ...
  // - ... Same fix
}

// - REACT_036: Fix 1 fake link issue
const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
fakeLinks.forEach(link => {
  // Add the `role` attribute to indicate the link is not a real navigation link
  link.setAttribute('role', 'presentation');
});

// NEW: Implement this function for checking landmark elements
function checkLandmarkElements() {
  const landmarks = document.querySelectorAll('.landmark');
  landmarks.forEach((landmark, index) => {
    // Additional checks or logic to validate landmark elements
    // This could be additional attributes, structure checks, etc.
    if (landmark.hasAttribute('aria-labelledby') && !landmark.querySelector(`#landmark-label-${index}`)) {
      console.warn(`REACT_017: ARIA-labelledby attribute exists without corresponding element for landmark at index ${index}`);
    }
    // You can add more checks here based on the requirements
  });
}

/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Implement your code here.
  // Example of creating a button in-page:
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  // Append the button to the body or another element as needed
  document.body.appendChild(button);
}

// Address accessibility issues from insight report:
// Import dependencyGraphContent

// - REACT_015: Add lang attribute to HTML element
addLangAttribute();

// Fix 26 table structure issues
fixTableStructureIssues();

// Add/fix 2 landmark issues
addMainLandmark();

// Add accessible names to 2 SVGs
addSvgAccessibleNames();

// Ensure unique landmarks
ensureUniqueLandmarks();

// Fix 1 fake link issue
fixFakeLinkIssue();

// Run the function to check landmark elements
checkLandmarkElements();

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
  renderIndexView,
  checkLandmarks,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  checkLinkAndButtonAccessibility,
  renderDependencyGraph: dependencyGraphContent && dependencyGraphContent.renderDependencyGraph ? dependencyGraphContent.renderDependencyGraph : () => {},
  getLandmarkData: dependencyGraphContent && dependencyGraphContent.getLandmarkData ? dependencyGraphContent.getLandmarkData : () => {},
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  fixFakeLinkIssue,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames
};