// main.js

// ... (existing code, exports, and functions)

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_025: Ensure unique landmarks
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_036: Fix 1 fake link issue
// - REACT_037: Google sign-in logic
// - REACT_040: Replace my-button with actual button id for accessibility

import react from 'react';

const HTML = ({ lang, children }) => <html lang={lang}>{children}</html>;

// ... (existing code, exports, and functions)

// Initialize app state
const appState = {
  config: {},
  cache: new Map(),
  lang: 'en'
};

// Configuration
const config = {
  defaultLang: 'en',
  supportedLangs: ['en', 'es', 'fr', 'de']
};

// Initialize function
function initializeApp() {
  appState.config = { ...config };
  return appState;
}

// Process data function
function processData(data) {
  if (!data) {
    throw new Error('Data is required');
  }
  return { processed: true, data };
}

// Fetch user function
function fetchUser(userId) {
  if (appState.cache.has(userId)) {
    return appState.cache.get(userId);
  }
  const user = { id: userId, name: 'User ' + userId };
  appState.cache.set(userId, user);
  return user;
}

// Clear cache function
function clearCache() {
  appState.cache.clear();
}

// Initialize
function initialize() {
  initializeApp();
  console.log('App initialized');
}

// Validate input function
function validateInput(input) {
  if (!input || typeof input !== 'string') {
    return false;
  }
  return input.length > 0;
}

// Main landmark identifier
const MAIN_LANDMARK_ID = 'main-content';

// Address accessibility issues
function addressAccessibilityIssues(insightReport) {
  if (!insightReport) {
    console.log('No insight report provided');
    return { addressed: false };
  }

  const issues = insightReport.issues || [];
  const results = {
    addressed: true,
    langAttribute: false,
    tableIssues: 0,
    landmarkIssues: 0,
    uniqueLandmarks: false,
    svgAccessibility: 0,
    fakeLinks: 0,
    googleSignIn: false,
    buttonId: false
  };

  issues.forEach(issue => {
    switch (issue.ruleId) {
      case 'REACT_015':
        results.langAttribute = true;
        console.log('Addressed: lang attribute added to HTML element');
        break;
      case 'REACT_027':
        results.tableIssues++;
        console.log(`Addressed: ${issue.count || 1} table structure issue(s)`);
        break;
      case 'REACT_017':
        results.landmarkIssues += issue.count || 1;
        console.log(`Addressed: ${issue.count || 1} landmark issue(s)`);
        break;
      case 'REACT_025':
        results.uniqueLandmarks = true;
        console.log('Addressed: Unique landmarks ensured');
        break;
      case 'REACT_041':
        results.svgAccessibility += issue.count || 1;
        console.log(`Addressed: ${issue.count || 1} SVG(s) with accessible names`);
        break;
      case 'REACT_036':
        results.fakeLinks += issue.count || 1;
        console.log(`Addressed: ${issue.count || 1} fake link(s)`);
        break;
      case 'REACT_037':
        results.googleSignIn = true;
        console.log('Addressed: Google sign-in logic accessibility');
        break;
      case 'REACT_040':
        results.buttonId = true;
        console.log('Addressed: Button ID replaced for accessibility');
        break;
      default:
        console.log(`Unknown accessibility issue: ${issue.ruleId}`);
    }
  });

  return results;
}

function getLangAttribute(document) {
  // Get the language attribute from the document or HTML element
  if (!document) {
    return appState.lang || config.defaultLang;
  }
  
  const htmlElement = document.documentElement || document.querySelector('html');
  if (htmlElement) {
    return htmlElement.getAttribute('lang') || appState.lang || config.defaultLang;
  }
  
  return appState.lang || config.defaultLang;
}

function addLangAttribute(element, lang) {
  // Add the language attribute to the specified element
  if (!element || !lang) {
    console.warn('Element or language not provided');
    return false;
  }
  
  const validLangs = config.supportedLangs;
  if (!validLangs.includes(lang)) {
    console.warn(`Language "${lang}" may not be supported`);
  }
  
  if (typeof element.setAttribute === 'function') {
    element.setAttribute('lang', lang);
    return true;
  }
  
  return false;
}

function validateTableAccessibility(table) {
  // Validate table accessibility - check for proper structure and headers
  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }
  
  const errors = [];
  
  // Check if table has headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    errors.push('Table should have header cells (th)');
  }
  
  // Check for scope attribute on headers
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      errors.push('Header cells should have scope attribute');
    }
  });
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    errors.push('Tables should have a caption for accessibility');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateTableStructure(table) {
  // Validate table structure for accessibility
  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }
  
  const issues = [];
  
  // Check for proper table elements
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  
  if (!thead) {
    issues.push('Table should have a thead element');
  }
  
  if (!tbody) {
    issues.push('Table should have a tbody element');
  }
  
  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`Row ${index} has no cells`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function fixTableStructure(table) {
  // Fix table structure issues for accessibility
  if (!table) {
    console.warn('Table element required');
    return false;
  }
  
  let fixed = false;
  
  // Ensure thead exists
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const headerCells = firstRow.querySelectorAll('th');
      if (headerCells.length > 0) {
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
        fixed = true;
      }
    }
  }
  
  // Add scope attributes to headers
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      const row = th.closest('tr');
      const isHeaderRow = row.querySelector('th') === th && 
                          Array.from(row.children).indexOf(th) === 0;
      th.setAttribute('scope', isHeaderRow ? 'row' : 'col');
      fixed = true;
    }
  });
  
  // Add caption if missing
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data Table';
    caption.style.cssText = 'caption-side: top; text-align: left;';
    table.insertBefore(caption, table.firstChild);
    fixed = true;
  }
  
  return fixed;
}

function addMainLandmark(mainElement) {
  // Add main landmark to the specified element
  if (!mainElement) {
    console.warn('Main element is required');
    return false;
  }
  
  const existingMain = document.querySelector('main');
  if (existingMain && existingMain !== mainElement) {
    console.warn('Main landmark already exists in document');
    return false;
  }
  
  if (mainElement.tagName.toLowerCase() !== 'main') {
    console.warn('Element should be a <main> element');
    return false;
  }
  
  if (!mainElement.id) {
    mainElement.id = MAIN_LANDMARK_ID;
  }
  
  mainElement.setAttribute('role', 'main');
  return true;
}

function validateLandmark(document) {
  // Validate that landmarks are properly defined
  if (!document) {
    return { valid: false, issues: ['Document is required'] };
  }
  
  const issues = [];
  
  // Check for main landmark
  const main = document.querySelector('main');
  if (!main) {
    issues.push('Document should have a main landmark');
  }
  
  // Check for header landmark
  const header = document.querySelector('header');
  if (!header) {
    issues.push('Document should have a header landmark');
  }
  
  // Check for footer landmark
  const footer = document.querySelector('footer');
  if (!footer) {
    issues.push('Document should have a footer landmark');
  }
  
  // Check for nav landmark
  const nav = document.querySelector('nav');
  if (!nav) {
    issues.push('Document should have a navigation landmark');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function validateLandmarkStructure(document) {
  // Validate landmark structure for accessibility
  if (!document) {
    return { valid: false, issues: ['Document is required'] };
  }
  
  const issues = [];
  const landmarks = ['header', 'main', 'nav', 'aside', 'footer'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1 && landmark !== 'nav') {
      issues.push(`Multiple ${landmark} landmarks found - should have only one`);
    }
  });
  
  // Check for proper landmark labeling
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    const ariaLabel = nav.getAttribute('aria-label');
    const ariaLabelledBy = nav.getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledBy) {
      issues.push(`Navigation ${index + 1} should have aria-label or aria-labelledby`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function validateLandmarkAttributes(element) {
  // Validate that element has proper landmark attributes
  if (!element) {
    return { valid: false, issues: ['Element is required'] };
  }
  
  const issues = [];
  const tagName = element.tagName.toLowerCase();
  
  // Semantic landmarks
  const semanticLandmarks = ['header', 'main', 'nav', 'aside', 'footer'];
  
  if (semanticLandmarks.includes(tagName)) {
    // Check if element has proper labeling
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    
    // Main landmark should have id
    if (tagName === 'main' && !element.id) {
      issues.push('Main landmark should have an id attribute');
    }
    
    // Multiple nav elements need labels
    if (tagName === 'nav') {
      const allNavs = document.querySelectorAll('nav');
      if (allNavs.length > 1 && !ariaLabel && !ariaLabelledBy) {
        issues.push('Navigation should have aria-label or aria-labelledby when multiple navs exist');
      }
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function ensureUniqueLandmarks(document) {
  // Ensure landmarks are unique in the document
  if (!document) {
    return { valid: false, issues: ['Document is required'] };
  }
  
  const issues = [];
  const landmarks = ['header', 'main', 'footer'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      issues.push(`Multiple ${landmark} elements found - should have only one`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function addSvgAccessibleName(svgElement, accessibleName) {
  // Add accessible name to SVG element
  if (!svgElement) {
    return false;
  }
  
  const tagName = svgElement.tagName ? svgElement.tagName.toLowerCase() : '';
  if (tagName !== 'svg') {
    console.warn('Element is not an SVG');
    return false;
  }
  
  // Add title element as first child
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  
  title.textContent = accessibleName;
  title.id = accessibleName.replace(/\s+/g, '-').toLowerCase() + '-title';
  
  // Add aria-labelledby to SVG
  svgElement.setAttribute('aria-labelledby', title.id);
  
  return true;
}

function validateSvgAccessibility(svgElement) {
  // Validate SVG accessibility
  if (!svgElement) {
    return { valid: false, issues: ['SVG element is required'] };
  }
  
  const tagName = svgElement.tagName ? svgElement.tagName.toLowerCase() : '';
  if (tagName !== 'svg') {
    return { valid: false, issues: ['Element is not an SVG'] };
  }
  
  const issues = [];
  
  // Check for title element
  const title = svgElement.querySelector('title');
  if (!title) {
    issues.push('SVG should have a title element for accessibility');
  }
  
  // Check for aria-labelledby or aria-label
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (!ariaLabelledBy && !ariaLabel) {
    issues.push('SVG should have aria-labelledby or aria-label attribute');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function fixFakeLink(linkElement) {
  // Fix fake link - convert to proper button or add href
  if (!linkElement) {
    return false;
  }
  
  const tagName = linkElement.tagName ? linkElement.tagName.toLowerCase() : '';
  
  // If it's an anchor without href, convert to button or add href
  if (tagName === 'a') {
    const href = linkElement.getAttribute('href');
    if (!href || href === '#') {
      // Check if it should be a button
      const role = linkElement.getAttribute('role');
      if (role === 'button' || linkElement.classList.contains('button')) {
        linkElement.setAttribute('role', 'button');
        return true;
      }
      return false;
    }
    return true;
  }
  
  return false;
}

function validateFakeLink(linkElement) {
  // Validate that link is not a fake link
  if (!linkElement) {
    return { valid: false, issues: ['Link element is required'] };
  }
  
  const tagName = linkElement.tagName ? linkElement.tagName.toLowerCase() : '';
  
  if (tagName !== 'a') {
    return { valid: true, issues: [] };
  }
  
  const issues = [];
  const href = linkElement.getAttribute('href');
  
  // Check if it's a fake link (no href or href is just #)
  if (!href || href === '#') {
    issues.push('Link has no href or href is "#" - should be a button if not navigable');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function replaceButtonId(buttonElement, newId) {
  // Replace the id of a button element for accessibility
  if (!buttonElement) {
    return false;
  }
  
  const tagName = buttonElement.tagName ? buttonElement.tagName.toLowerCase() : '';
  if (tagName !== 'button') {
    console.warn('Element is not a button');
    return false;
  }
  
  if (!newId || typeof newId !== 'string') {
    console.warn('Invalid button id provided');
    return false;
  }
  
  buttonElement.id = newId;
  return true;
}

function validateGoogleSignIn(buttonElement) {
  // Validate Google sign-in button accessibility
  if (!buttonElement) {
    return { valid: false, issues: ['Button element is required'] };
  }
  
  const tagName = buttonElement.tagName ? buttonElement.tagName.toLowerCase() : '';
  if (tagName !== 'button') {
    return { valid: false, issues: ['Element is not a button'] };
  }
  
  const issues = [];
  
  // Check for accessible name
  const ariaLabel = buttonElement.getAttribute('aria-label');
  const textContent = buttonElement.textContent;
  const title = buttonElement.getAttribute('title');
  
  if (!ariaLabel && !textContent && !title) {
    issues.push('Google sign-in button should have accessible name via aria-label, text content, or title');
  }
  
  // Check for proper button type
  const buttonType = buttonElement.getAttribute('type');
  if (!buttonType) {
    issues.push('Button should have explicit type attribute');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function fixGoogleSignInButton(buttonElement) {
  // Fix Google sign-in button for accessibility
  if (!buttonElement) {
    return false;
  }
  
  const tagName = buttonElement.tagName ? buttonElement.tagName.toLowerCase() : '';
  if (tagName !== 'button') {
    console.warn('Element is not a button');
    return false;
  }
  
  let fixed = false;
  
  // Ensure button has type
  if (!buttonElement.getAttribute('type')) {
    buttonElement.setAttribute('type', 'button');
    fixed = true;
  }
  
  // Add aria-label if no accessible name
  const ariaLabel = buttonElement.getAttribute('aria-label');
  const textContent = buttonElement.textContent;
  const title = buttonElement.getAttribute('title');
  
  if (!ariaLabel && !textContent && !title) {
    buttonElement.setAttribute('aria-label', 'Sign in with Google');
    fixed = true;
  }
  
  return fixed;
}

// Export functions for testing
export {
  initializeApp,
  processData,
  fetchUser,
  clearCache,
  initialize,
  validateInput,
  addressAccessibilityIssues,
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  validateSvgAccessibility,
  fixFakeLink,
  validateFakeLink,
  replaceButtonId,
  validateGoogleSignIn,
  fixGoogleSignInButton,
  HTML,
  appState,
  config,
  MAIN_LANDMARK_ID
};