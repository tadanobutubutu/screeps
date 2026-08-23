// TODO: Add back any required exports that might have been?
// (This comment remains as-is)

// Address accessibility issues from insight report

function wrapPrimaryContentInMain(element) {
  const main = document.querySelector('main') || document.createElement('main');
  if (main && element) {
    main.appendChild(element);
  }
}

// Reusable wrapper function to address accessibility issues
function wrapperFunction(callback, accessibilityInsights) {
  processAccessibilityIssues(callback, accessibilityInsights);
}

// Assuming the function takes the insights object and processes it to address any issues
function addressAccessibilityIssues(accessibilityInsights) {
  accessibilityInsights.issues.forEach(issue => {
    // Find the element with the ID that matches the issue
    const element = document.getElementById(issue.id);

    // If the element exists, apply the accessibility solution
    if (element) {
      element.setAttribute('aria-label', issue.solution);
      // You can add more solutions as needed
    }
  });
}

// New function to ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  const uniqueLandmarks = new Set();
  landmarks.forEach(landmark => {
    if (!uniqueLandmarks.has(landmark.role)) {
      uniqueLandmarks.add(landmark.role);
    } else {
      console.warn(`Warning: Duplicate landmark role: ${landmark.role}`);
    }
  });
  return uniqueLandmarks.size === landmarks.length;
}

// Add missing scope attributes to <th> elements for accessibility
function addMissingScopeAttributes(table) {
  // Select all <th> elements that do not already have a scope attribute
  const headers = table ? table.querySelectorAll('th:not([scope])') : [];
  headers.forEach(el => {
    // Apply a default scope of "col" (column header)
    el.setAttribute('scope', 'col');
  });
}

// New function to address requested changes for REACT_025
function processAccessibilityIssues(callback, accessibilityInsights) {
  accessibilityInsights.landmarks.forEach(landmark => {
    // Find the element with the ID that matches the landmark
    const element = document.getElementById(landmark.id);

    // If the element exists, add the appropriate landmark role
    if (element) {
      element.setAttribute('role', landmark.role);
      // You can add more landmark roles as needed
    }
  });

  // Ensure unique landmarks
  if (!ensureUniqueLandmarks(accessibilityInsights.landmarks)) {
    throw new Error('Error: Duplicate landmark roles found');
  }

  callback(accessibilityInsights);
}

// Wrap the existing addressAccessibilityIssues function with the new processAccessibilityIssues wrapper function
processAccessibilityIssues(addressAccessibilityIssues, accessibilityInsights);

// Wrap the primary content element in the main container

// Add missing scope attributes to table header cells (fixes REACT_027)
function validateTableAccessibility(table) {
  const issues = [];
  const thElements = table ? table.querySelectorAll('th') : [];
  
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      issues.push({
        element: th,
        issue: 'Missing scope attribute on table header',
        solution: 'col'
      });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

function validateTableStructure(table) {
  const issues = [];
  const rows = table ? table.querySelectorAll('tr') : [];
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push({
        row: rowIndex,
        issue: 'Empty table row'
      });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

// REACT_015: Add lang attribute to HTML element
function getLangAttribute(element) {
  return element ? element.getAttribute('lang') : null;
}

function getFullLangAttribute(element) {
  const lang = getLangAttribute(element);
  if (lang && lang.includes('-')) {
    return lang;
  }
  return lang ? `${lang}-en` : 'en';
}

function setLangAttribute(element, lang) {
  if (element) {
    element.setAttribute('lang', lang);
    return true;
  }
  return false;
}

// REACT_017: Add/fix landmark issues
function validateLandmark(element) {
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  const role = element ? element.getAttribute('role') : null;
  return role && validRoles.includes(role);
}

function validateLandmarkStructure(doc) {
  const landmarks = doc ? doc.querySelectorAll('[role]') : [];
  const issues = [];
  const mainLandmarks = [];
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role === 'main') {
      mainLandmarks.push(landmark);
    }
  });
  
  if (mainLandmarks.length > 1) {
    issues.push({
      issue: 'Multiple main landmarks found',
      count: mainLandmarks.length
    });
  }
  
  return { valid: issues.length === 0, issues };
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svg) {
  const title = svg ? svg.querySelector('title') : null;
  const ariaLabel = svg ? svg.getAttribute('aria-label') : null;
  const ariaLabelledby = svg ? svg.getAttribute('aria-labelledby') : null;
  
  if (ariaLabel) return ariaLabel;
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    return titleElement ? titleElement.textContent : null;
  }
  if (title) return title.textContent;
  
  return null;
}

function setSvgAccessibleName(svg, name) {
  if (!svg) return false;
  
  // First check if there's already a title element
  let title = svg.querySelector('title');
  
  if (!title) {
    title = document.createElement('title');
    svg.insertBefore(title, svg.firstChild);
  }
  
  title.textContent = name;
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
  
  return true;
}

// REACT_036: Fix fake link issue
function createInPageButton(text, action) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('type', 'button');
  if (typeof action === 'function') {
    button.addEventListener('click', action);
  }
  return button;
}

function createAccessibleLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('role', 'link');
  return link;
}

// ... existing exports and functions may remain in main.js

module.exports = {
  wrapPrimaryContentInMain,
  addressAccessibilityIssues,
  processAccessibilityIssues,
  wrapperFunction,
  ensureUniqueLandmarks,
  addMissingScopeAttributes,
  validateTableAccessibility,
  validateTableStructure,
  getLangAttribute,
  getFullLangAttribute,
  setLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  addressReact036Issue
};

// Address the REACT_036 issue by changing the anchor to a button
function addressReact036Issue() {
  const element = document.getElementById('unrotate');
  if (element) {
    element.innerHTML = '<button id="unrotate">rotate back</button>';
    const newButton = element.querySelector('button');
    newButton.setAttribute('type', 'button'); // Ensure it's a button with no default action
  }
}

// Call the function to make the change
addressReact036Issue();