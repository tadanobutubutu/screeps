import React from 'react';
import ReactDOM from 'react-dom';

function addLangAttribute(element) {
  if (element) {
    element.setAttribute('lang', 'en');
  }
}

function fixTableStructure(table) {
  if (!table) return;
  
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
  
  const rows = Array.from(table.children).filter(child => 
    child.tagName === 'TR' && 
    child.parentElement === table
  );
  
  rows.forEach(row => {
    tbody.appendChild(row);
  });
}

function addMainLandmark(reactRoot) {
  if (!reactRoot) return;
  
  const mainLandmark = document.createElement('main');
  mainLandmark.id = "main-landmark";
  
  if (reactRoot.firstChild) {
    const firstChild = reactRoot.firstChild;
    mainLandmark.appendChild(firstChild);
    reactRoot.appendChild(mainLandmark);
  } else {
    reactRoot.appendChild(mainLandmark);
  }
}

function renderDependencyGraph() {
  // Placeholder function to render dependency graph
  console.log('Dependency graph rendering logic would go here.');
}

function displayModuleStructure() {
  // Placeholder function to display module structure
  console.log('Module structure display logic would go here.');
}

function YouHaveComponent() {
  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => alert('Clicked!')}
    >
      You Have A Component
    </div>
  );
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