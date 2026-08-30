// TODO: Add the necessary new functions (without strict mode)
import React from 'react';
import ReactDOM from 'react-dom';

// The existing code

function addLangAttribute(element) {
  // Implement the function to add lang attribute
  if (element) {
    element.setAttribute('lang', 'en');
  }
}

function fixTableStructure(table) {
  // Implement the function to fix table structure issues
  if (!table) return;
  
  // Ensure table has proper structure
  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    // Move all TR children into tbody
    const rows = Array.from(table.children).filter(
      child => child.tagName === 'TR' && child.parentElement === table
    );
    rows.forEach(row => {
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
  }
}

function addMainLandmark(reactRoot) {
  // Implement the function to add main landmark
  if (!reactRoot) return;
  
  const mainLandmark = document.createElement('main');
  mainLandmark.id = "main-landmark";
  
  // Move the first child of reactRoot into the main landmark
  if (reactRoot.firstChild) {
    const firstChild = reactRoot.firstChild;
    mainLandmark.appendChild(firstChild);
    reactRoot.appendChild(mainLandmark);
  } else {
    reactRoot.appendChild(mainLandmark);
  }
}

// New accessibility functions based on the issue requirements

// REACT_015: Get lang attribute value
function getLangAttribute(element) {
  if (!element) return 'en';
  return element.getAttribute('lang') || 'en';
}

// REACT_015: Create in-page button with proper accessibility
function createInPageButton(onClick, label, buttonText) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', label || 'In-page action');
  button.textContent = buttonText || 'Action';
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  if (!table) return { valid: false, issues: ['Table element is required'] };
  
  const issues = [];
  
  // Check for caption or accessible name
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label');
  const hasAriaLabelledby = table.getAttribute('aria-labelledby');
  
  if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
    issues.push('Table should have a caption or aria-label/aria-labelledby');
  }
  
  // Check for th elements with proper scope
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope') && !th.getAttribute('id')) {
      issues.push(`Header at index ${index} should have scope or id attribute`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  if (!table) return { valid: false, issues: ['Table element is required'] };
  
  const issues = [];
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    issues.push('Table should have a thead element');
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    issues.push('Table should have a tbody element');
  }
  
  // Check for direct TR children (should be in thead/tbody)
  const directRows = Array.from(table.children).filter(
    child => child.tagName === 'TR' && child.parentElement === table
  );
  
  if (directRows.length > 0) {
    issues.push('Table should not have direct TR children outside thead/tbody');
  }
  
  return { valid: issues.length === 0, issues };
}

// REACT_017: Validate landmark presence
function validateLandmark(container) {
  if