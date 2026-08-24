// main.js - Entry point for the application with accessibility fixes for React components
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), ... and createAccessibleLink())

import accessibilityModule from 'accessibility-module';

// Add Lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.getAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell, cellIndex) => {
        const isTH = cell.tagName === 'TH';
        if (!isTH) return;
        if (cellIndex === 0) {
          cell.setAttribute('scope', 'row');
        } else {
          cell.setAttribute('scope', 'col');
        }
      });
    });
  });
}

// Fix table structure issues by checking TH cell scopes
function checkTableStructure() {
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        hasIssues = true;
      }
    });
  });
  return !hasIssues;
}

// Check valid TH scope attribute
function hasValidTHScope(th) {
  const scope = th.getAttribute('scope');
  return scope === 'row' || scope === 'col' || scope === 'rowgroup' || scope === 'colgroup';
}

// Add/fix 4 landmark issues
function validateLandmark() {
  const landmarks = document.querySelectorAll('nav, footer, aside, main');
  landmarks.forEach(landmark => {
    if (!landmark.getAttribute('role')) {
      landmark.setAttribute('role', 'landmark');
    }
  });
}

// Ensure unique landmarks
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('nav, footer, aside, main');
  const landmarkIds = new Set();
  for (let i = 0; i < landmarks.length; i++) {
    if (landmarkIds.has(landmarks[i].id)) {
      landmarks[i].setAttribute('role', landmarks[i].tagName.toLowerCase());
      landmarks[i].id = `${landmarks[i].id}-duplicate`;
    } else {
      landmarkIds.add(landmarks[i].id);
    }
  }
  return Array.from(landmarkIds).length === landmarks.length;
}

// Add proper landmark regions
function addLandmarkRegions() {
  const landmarkElements = ['header', 'nav', 'footer', 'article', 'section'];
  landmarkElements.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', landmark);
      }
    });
  });
}

// Fix 1 fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.href === '#' || !link.href) {
      // Replace the link with a button for in-page actions
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.setAttribute('type', 'button');

      // Copy all attributes except href
      Array.from(link.attributes).forEach(attr => {
        if (attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      });

      // Preserve ARIA attributes for accessibility
      if (link.getAttribute('aria-label')) {
        button.setAttribute('aria-label', link.getAttribute('aria-label'));
      }
      if (link.getAttribute('aria-labelledby')) {
        button.setAttribute('aria-labelledby', link.getAttribute('aria-labelledby'));
      }

      // Replace the link with the button in the DOM
      link.parentNode.replaceChild(button, link);
    }
  });
}

// New functions requested by the issue

function getLangAttribute() {
  const html = document.documentElement;
  return html.getAttribute('lang') || 'en';
}

function getFullLangAttribute() {
  const lang = document.documentElement.lang;
  return lang ? lang : 'en';
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        hasIssues = true;
      } else if (!hasValidTHScope(th)) {
        hasIssues = true;
      }
    });
  });
  return !hasIssues;
}

function validateTableStructure() {
  return checkTableStructure();
}

function getSvgAccessibleName() {
  const svgs = document.querySelectorAll('svg');
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const ariaLabelledBy = svg.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const labelEl = document.getElementById(ariaLabelledBy);
      if (labelEl) return labelEl.textContent.trim();
    }
    const title = svg.querySelector('title');
    if (title) return title.textContent.trim();
  }
  return '';
}

// Wrap primary content in main element for accessibility
function wrapPrimaryContentInMain() {
  // Check if a main element already exists
  let mainElement = document.querySelector('main');

  if (mainElement) {
    return mainElement;
  }

  // Find body content excluding common landmark elements
  const body = document.body;
  const excludedTags = ['header', 'nav', 'footer', 'aside', 'script', 'style', 'link', 'meta'];
  const mainContent = [];

  // Get all direct children of body
  Array.from(body.children).forEach(child => {
    if (!excludedTags.includes(child.tagName.toLowerCase())) {
      mainContent.push(child);
    }
  });

  // If no content to wrap, return null
  if (mainContent.length === 0) {
    return null;
  }

  // Create main element
  mainElement = document.createElement('main');
  mainElement.setAttribute('id', 'main-content');

  // Move content into main element (insert in reverse order to maintain position)
  while (mainContent.length > 0) {
    const child = mainContent.pop();
    mainElement.appendChild(child);
  }

  // Insert main element after header if one exists
  const header = body.querySelector('header');
  if (header && header.nextSibling) {
    body.insertBefore(mainElement, header.nextSibling);
  } else if (header) {
    body.appendChild(mainElement);
  } else {
    body.insertBefore(mainElement, body.firstChild);
  }

  return mainElement;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('nav, footer, aside, main, header');
  const landmarkRoles = new Map();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      if (landmarkRoles.has(role)) {
        landmark.setAttribute('aria-label', `${role}-${landmarkRoles.get(role)}`);
        landmarkRoles.set(role, landmarkRoles.get(role) + 1);
      } else {
        landmarkRoles.set(role, 1);
      }
    }
  });
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (!title) {
        const newTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        newTitle.textContent = `SVG graphic ${index + 1}`;
        svg.insertBefore(newTitle, svg.firstChild);
      }
    }
  });
}

// Fake link / accessible link creation helpers
function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.setAttribute('type', 'button');
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

function createAccessibleLink(href, label) {
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.setAttribute('aria-label', label);
  link.textContent = label;
  return link;
}

// Validate link accessibility (fake link check)
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let hasIssues = false;
  links.forEach(link => {
    if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
      hasIssues = true;
    }
  });
  return !hasIssues;
}

// Add main landmark wrapper
function addMainLandmark() {
  return wrapPrimaryContentInMain();
}

// Fix unique landmarks - wrapper for validateLandmarkStructure
function fixUniqueLandmarks() {
  return validateLandmarkStructure();
}

// Main entry: Address all accessibility issues
function addressAccessibilityIssues() {
  addLangAttribute();
  fixTableStructure();
  addLandmarkRegions();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
}

// Export all functions for use by other modules and tests
export {
  addLangAttribute,
  fixTableStructure,
  checkTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  fixUniqueLandmarks,
  addLandmarkRegions,
  fixFakeLinkIssue,
  createInPageButton,
  addSvgAccessibleNames,
  validateLinkAccessibility,
  createAccessibleLink,
  addressAccessibilityIssues,
  hasValidTHScope,
  validateLandmark,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  wrapPrimaryContentInMain
};

// Example usage of the accessibility functions
addressAccessibilityIssues();
addLandmarkRegions();