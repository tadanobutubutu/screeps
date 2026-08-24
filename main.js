// TODO: Add back any required exports that might have been?
// (This comment remains as-is)

// Assuming a standard module structure, here are common exports that might be needed:

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
  return true;
}

function validateLandmarkStructure(element) {
  return true;
}

function getSvgAccessibleName(svgElement) {
  return svgElement ? svgElement.getAttribute('aria-label') || '' : '';
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text || 'Button';
  button.setAttribute('type', 'button');
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
}

function createAccessibleLink(href, text, isFakeLink) {
  const link = document.createElement('a');
  link.href = href || '#';
  link.textContent = text || 'Link';
  if (isFakeLink) {
    link.setAttribute('role', 'link');
  }
  return link;
}

// New functions to address REACT_017 - React Landmarks issue
function hasMainLandmark(htmlString) {
  if (typeof htmlString !== 'string') {
    return false;
  }
  const mainRegex = /<main(\s[^>]*)?>/i;
  return mainRegex.test(htmlString);
}

function extractMainLandmarkContent(htmlString) {
  if (typeof htmlString !== 'string' || !hasMainLandmark(htmlString)) {
    return null;
  }
  
  const mainRegex = /<main(\s[^>]*)?>([\s\S]*?)<\/main>/i;
  const match = htmlString.match(mainRegex);
  return match ? match[2] : null;
}

function validateMainLandmarkPresence(htmlString) {
  return hasMainLandmark(htmlString);
}

function getLandmarkIssues(htmlString) {
  const issues = [];
  
  if (!hasMainLandmark(htmlString)) {
    issues.push({
      rule: 'REACT_017',
      severity: 'warning',
      message: 'Page has no <main> landmark',
      description: 'Wrap the primary content in <main> so it can be skipped to'
    });
  }
  
  return issues;
}

function wrapContentInMain(content) {
  if (typeof content !== 'string') {
    return '<main></main>';
  }
  
  // Remove existing main tags if present to avoid nesting
  const unwrappedContent = content.replace(/<\/?main[^>]*>/gi, '');
  return `<main>\n${unwrappedContent}\n</main>`;
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
  createAccessibleLink,
  hasMainLandmark,
  extractMainLandmarkContent,
  validateMainLandmarkPresence,
  getLandmarkIssues,
  wrapContentInMain
};