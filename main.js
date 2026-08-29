// main.js - Accessibility Checker Module

/**
 * Checks accessibility of links and buttons within a given container
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(container) {
  const issues = [];
  
  // Check links for accessibility
  const links = container.querySelectorAll('a');
  links.forEach((link, index) => {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    
    if (!text && !ariaLabel && !title) {
      issues.push({
        type: 'link',
        index,
        element: link,
        message: 'Link is missing accessible text content. Add visible text, aria-label, or title attribute.'
      });
    }
  });
  
  // Check buttons for accessibility
  const buttons = container.querySelectorAll('button, [role="button"]');
  buttons.forEach((button, index) => {
    const text = button.textContent.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    const title = button.getAttribute('title');
    
    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      issues.push({
        type: 'button',
        index,
        element: button,
        message: 'Button is missing accessible name. Add visible text, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });
  
  return issues;
}

/**
 * Checks if the html element has a lang attribute
 * @returns {Object|null} - Returns an issue object if lang attribute is missing, null otherwise
 */
function checkLangAttribute() {
  const htmlElement = document.querySelector('html');
  
  if (!htmlElement) {
    return null;
  }
  
  const langAttribute = htmlElement.getAttribute('lang');
  
  if (!langAttribute) {
    return {
      type: 'language',
      element: htmlElement,
      message: 'HTML element is missing lang attribute. Add lang attribute to specify the page language (e.g., lang="en").'
    };
  }
  
  return null;
}

/**
 * Checks images for alt attributes
 * @param {HTMLElement} container - The container element to check for images
 * @returns {Array} - Array of accessibility issues found
 */
function checkImageAltAccessibility(container) {
  const issues = [];
  
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    const altAttribute = img.getAttribute('alt');
    
    // Empty alt is acceptable for decorative images with aria-hidden="true"
    const isDecorative = img.getAttribute('aria-hidden') === 'true';
    
    if (altAttribute === null && !isDecorative) {
      issues.push({
        type: 'image',
        index,
        element: img,
        message: 'Image is missing alt attribute. Add alt attribute describing the image content, or use empty alt="" for decorative images.'
      });
    }
  });
  
  return issues;
}

/**
 * Checks form elements for proper labels
 * @param {HTMLElement} container - The container element to check for form elements
 * @returns {Array} - Array of accessibility issues found
 */
function checkFormLabelAccessibility(container) {
  const issues = [];
  const checkedInputs = new Set();
  
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    if (checkedInputs.has(input)) return;
    
    // Check for implicit label (input wrapped in label)
    const parentLabel = input.parentElement && input.parentElement.tagName.toLowerCase() === 'label';
    
    // Check for explicit label
    const id = input.getAttribute('id');
    const explicitLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
    
    // Check for aria-label
    const ariaLabel = input.getAttribute('aria-label');
    
    // Check for aria-labelledby
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    
    // Check for title attribute
    const title = input.getAttribute('title');
    
    const hasLabel = parentLabel || explicitLabel || ariaLabel || ariaLabelledby || title;
    
    if (!hasLabel) {
      issues.push({
        type: 'form',
        index,
        element: input,
        message: 'Form element is missing accessible label. Add a label element, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });
  
  return issues;
}

/**
 * Performs comprehensive accessibility check on the document
 * @param {HTMLElement} [container=document] - The container element to check (defaults to entire document)
 * @returns {Array} - Array of accessibility issues found
 */
function checkAccessibility(container) {
  if (!container) {
    container = document;
  }
  
  const issues = [];
  
  // Check language attribute
  const langIssue = checkLangAttribute();
  if (langIssue) {
    issues.push(langIssue);
  }
  
  // Check links and buttons
  const linkButtonIssues = checkLinkAndButtonAccessibility(container);
  issues.push(...linkButtonIssues);
  
  // Check images
  const imageIssues = checkImageAltAccessibility(container);
  issues.push(...imageIssues);
  
  // Check form labels
  const formIssues = checkFormLabelAccessibility(container);
  issues.push(...formIssues);
  
  return issues;
}

// Example usage and export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    checkLinkAndButtonAccessibility,
    checkLangAttribute,
    checkImageAltAccessibility,
    checkFormLabelAccessibility,
    checkAccessibility
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
  window.checkLangAttribute = checkLangAttribute;
  window.checkImageAltAccessibility = checkImageAltAccessibility;
  window.checkFormLabelAccessibility = checkFormLabelAccessibility;
  window.checkAccessibility = checkAccessibility;
}