const _ = require('lodash');
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
  if (!element) {
    return { valid: false, reason: 'Element is null or undefined' };
  }

  const validRoles = {
    banner: ['header', '[role="banner"]'],
    main: ['main', '[role="main"]'],
    navigation: ['nav', '[role="navigation"]'],
    complementary: ['aside', '[role="complementary"]'],
    contentinfo: ['footer', '[role="contentinfo"]'],
    region: ['section', '[role="region"]'],
    form: ['form', '[role="form"]'],
    search: ['[role="search"]']
  };

  if (!validRoles[role]) {
    return { valid: false, reason: `Unknown role: ${role}` };
  }

  // Verify element matches the role
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  const elementRole = element.getAttribute && element.getAttribute('role');
  const isValidTag = validRoles[role].some(selector => {
    if (selector.startsWith('[role=')) {
      const expectedRole = selector.match(/\[role="(\w+)"\]/)[1];
      return elementRole === expectedRole;
    }
    return tagName === selector;
  });

  return {
    valid: isValidTag,
    reason: isValidTag ? null : `Element does not match role: ${role}`,
    element
  };
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
  const results = {
    main: [],
    banner: [],
    navigation: [],
    complementary: [],
    contentinfo: [],
    form: [],
    region: [],
    search: []
  };

  if (!container || typeof container.querySelectorAll !== 'function') {
    return results;
  }

  // Check main landmarks
  container.querySelectorAll('main, [role="main"]').forEach(el => {
    results.main.push(checkLandmarkElement('main', el));
  });

  // Check banner landmarks
  container.querySelectorAll('header, [role="banner"]').forEach(el => {
    results.banner.push(checkLandmarkElement('banner', el));
  });

  // Check navigation landmarks
  container.querySelectorAll('nav, [role="navigation"]').forEach(el => {
    results.navigation.push(checkLandmarkElement('navigation', el));
  });

  // Check complementary landmarks
  container.querySelectorAll('aside, [role="complementary"]').forEach(el => {
    results.complementary.push(checkLandmarkElement('complementary', el));
  });

  // Check contentinfo landmarks
  container.querySelectorAll('footer, [role="contentinfo"]').forEach(el => {
    results.contentinfo.push(checkLandmarkElement('contentinfo', el));
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
  // Include functions from dependencyGraphContent if available
  ...(dependencyGraphContent && typeof dependencyGraphContent === 'object' ? dependencyGraphContent : {})
};