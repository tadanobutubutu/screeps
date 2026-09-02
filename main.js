import React from 'react';

module.exports = {
  wrapPrimaryContentInMain: (content) => `<main id="primary-content">${content}</main>`,
  setHtmlLangAttribute,
  detectAndSetLang,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  createInPageButton,
  personName,
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  meetsContrastRequirement,
  validateHeadingHierarchy,
  validateFormLabels,
  getImageAltText,
  validateImageAltText,
  validateAriaAttributes,
  focusElement,
  runAccessibilityAudit
};

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

function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}