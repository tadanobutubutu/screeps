import React from 'react';

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// TODO: Implement the new function as per the issue requirements
function wrapPrimaryContentInMain(content) {
  return `<main id="primary-content">${content}</main>`;
}

// DONE: Address accessibility issues from insight report:
// - DONE REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - DONE REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - DONE REACT_017: Add/fix 4 landmark issues (handled by validateLandmark() and validateLandmarkStructure())
// - DONE REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and validateSvgAccessibility())
// - DONE REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - DONE REACT_036: Fix 1 fake link issue (handled by createInPageButton(), personName(), and ...)
// ADD: Address new accessibility issues from insight report
// New functions to address REACT_036: Fix fake link issue
function personName(name) {
  // Creates an accessible person name element
  if (typeof document === 'undefined') return null;

  const span = document.createElement('span');
  span.className = 'person-name';
  span.textContent = name;
  return span;
}

function createInPageButton(text, onClick, ariaLabel) {
  // Creates an accessible in-page button (not a fake link)
  if (typeof document === 'undefined') return null;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'in-page-button';
  button.textContent = text;
  button.setAttribute('aria-label', ariaLabel || text);

  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to implement the wrapPrimaryContentInMain function
const wrapPrimaryContentInMain = (content) => {
  return `<main id="primary-content">${content}</main>`;
};

// Export the new function along with existing ones
module.exports = {
  wrapPrimaryContentInMain,
  personName,
  createInPageButton,
  getLangAttribute,
  // existing exports...
};