const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development'
};

function helperFunction() {
  return 'helper result';
}

class ServiceClass {
  constructor() {
    this.name = 'Service';
  }

  getName() {
    return this.name;
  }
}

const CONSTANTS = {
  VERSION: '1.0.0',
  MAX_RETRIES: 3
};

// Accessibility functions from insight report
function getLangAttribute() {
  return 'en';
}

function getFullLangAttribute(lang) {
  return lang || 'en';
}

function validateTableAccessibility(tableElement) {
  return true;
}

function validateTableStructure(tableElement) {
  return true;
}

function validateLandmark(element) {
  // Assuming the element has a role attribute
  return element.hasAttribute('role');
}

function validateLandmarkStructure(element) {
  // Assuming the landmark element has a unique id
  return element.id;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  // Check for aria-label attribute
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent) return title.textContent;
  return '';
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text || 'Button';
  button.setAttribute('type', 'button');
  if (onClick && typeof onClick === 'function') {
    button.onclick = onClick;
  }
  return button;
}

function createAccessibleLink(href, text, isFakeLink) {
  const link = document.createElement('a');
  link.href = href || '#';
  link.textContent = text || 'Link';
  if (isFakeLink) {
    link.setAttribute('role', 'button');
    link.setAttribute('tabIndex', '0'); // Add tabIndex for focusable elements
  }
  return link;
}

// Export all required items
module.exports = {
  config,
  helperFunction,
  ServiceClass,
  CONSTANTS,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink
};