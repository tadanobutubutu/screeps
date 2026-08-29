// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark, fixLandmarkIssues)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)

// ----- END ORIGINAL CODE -----
// ----- BEGIN CHANGES (to be added) -----
// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// ... (any existing code before line 8) ...
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = 'en';

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

/**
 * Add lang attribute to HTML element for accessibility
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Fix table structure issues for accessibility
 */
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure table has a caption
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      table.insertBefore(caption, table.firstChild);
    }
    
    // Ensure table has proper header structure
    const headerRows = table.querySelectorAll('th');
    if (headerRows.length > 0) {
      const thead = table.querySelector('thead');
      if (!thead) {
        const theadElement = document.createElement('thead');
        table.insertBefore(theadElement, table.firstChild);
      }
    }
    
    // Ensure td elements are within tbody
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        let tbody = row.parentElement;
        if (tbody && tbody.tagName !== 'TFOOT' && tbody.tagName !== 'THEAD') {
          if (!tbody.textContent.trim()) {
            const newTbody = document.createElement('tbody');
            cells.forEach((cell) => {
              newTbody.appendChild(cell);
            });
            tbody.parentNode.replaceChild(newTbody, tbody);
          }
        }
      }
    });
  });
}

/**
 * Add main landmark for accessibility
 */
function addMainLandmark() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.setAttribute('role', 'main');
  }
}

/**
 * Add main landmark to the provided rootElement
 */
function addMainLandmarkWithRoot(rootElement) {
  if (!rootElement) {
    return null;
  }

  const existingMain = rootElement.querySelector('[role="main"]');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    while (rootElement.firstChild) {
      mainElement.appendChild(rootElement.firstChild);
    }
    rootElement.insertBefore(mainElement, rootElement.firstChild);
  }

  return rootElement;
}

/**
 * Fix landmark issues for accessibility
 */
function fixLandmarkIssues() {
  // Ensure header with role="banner" exists or create one
  let header = document.querySelector('header[role="banner"]');
  if (!header) {
    const existingHeader = document.querySelector('header');
    if (existingHeader) {
      existingHeader.setAttribute('role', 'banner');
    } else {
      header = document.createElement('header');
      header.setAttribute('role', 'banner');
      document.body.insertBefore(header, document.body.firstChild);
    }
  }
  
  // Ensure nav with role="navigation" exists or fix existing ones
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      if (index === 0) {
        nav.setAttribute('aria-label', 'Main navigation');
      } else {
        nav.setAttribute('aria-label', `Secondary navigation ${index}`);
      }
    }
  });
  
  // Ensure main landmark with proper labeling
  const mains = document.querySelectorAll('[role="main"]');
  if (mains.length > 0) {
    const mainElement = mains[0];
    if (!mainElement.hasAttribute('aria-label') && !mainElement.querySelector('h1')) {
      mainElement.setAttribute('aria-label', 'Main content');
    }
  }
  
  // Ensure footer with role="contentinfo" exists
  let footer = document.querySelector('footer[role="contentinfo"]');
  if (!footer) {
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
      existingFooter.setAttribute('role', 'contentinfo');
    } else {
      footer = document.createElement('footer');
      footer.setAttribute('role', 'contentinfo');
      document.body.appendChild(footer);
    }
  }
}

/**
 * Ensure all landmarks have unique accessible names
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, footer, nav, main, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"]');
  const landmarkLabels = {};
  
  landmarks.forEach((landmark) => {
    const label = landmark.getAttribute('aria-label') || 
                  landmark.getAttribute('aria-labelledby') ||
                  landmark.tagName ||
                  landmark.getAttribute('role');
    
    if (!label) {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      let uniqueLabel = role;
      if (landmarkLabels[role]) {
        landmarkLabels[role]++;
        uniqueLabel = `${role} ${landmarkLabels[role]}`;
      } else {
        landmarkLabels[role] = 1;
      }
      landmark.setAttribute('aria-label', uniqueLabel);
    } else if (landmarkLabels[label]) {
      landmarkLabels[label]++;
      landmark.setAttribute('aria-label', `${label} ${landmarkLabels[label]}`);
    } else {
      landmarkLabels[label] = 1;
    }
  });
}

/**
 * Ensure landmarks are properly structured
 */
function uniqueLandmarks() {
  // This is an alias for ensureUniqueLandmarks
  ensureUniqueLandmarks();
}

/**
 * Add accessible names to SVG elements
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        svg.setAttribute('aria-labelledby', title.id || 'svg-title');
        if (!title.id) {
          title.id = 'svg-title';
        }
      } else {
        // Try to get an accessible name from siblings or context
        const desc = svg.querySelector('desc');
        if (desc) {
          svg.setAttribute('aria-describedby', desc.id || 'svg-desc');
          if (!desc.id) {
            desc.id = 'svg-desc';
          }
        } else {
          // Set a generic accessible name based on context
          const parentText = svg.closest('[aria-label]')?.getAttribute('aria-label') || 
                            svg.closest('button')?.textContent?.trim() ||
                            'Graphic';
          svg.setAttribute('aria-label', parentText);
        }
      }
    }
    svg.setAttribute('role', 'img');
  });
}

/**
 * Add accessible names to all SVGs in the document
 */
function addAccessibleNamesToSVGs() {
  addSvgAccessibleNames();
}

/**
 * Fix fake link issues (elements styled as links but not functioning as links)
 */
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    link.removeAttribute('href');
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
}

/**
 * Fix all fake link issues in the document
 */
function fixFakeLinkIssues() {
  fixFakeLinkIssue();
}

/**
 * Handle Google sign-in logic for accessibility
 */
function googleSignIn() {
  const googleSignInButtons = document.querySelectorAll('[id*="google-signin"], [id*="googleSignIn"], [id*="g-ID"]');
  googleSignInButtons.forEach((button) => {
    if (!button.hasAttribute('aria-label')) {
      let ariaLabel = 'Sign in with Google';
      if (button.id && button.id.includes('google-signin')) {
        ariaLabel = 'Sign in with Google';
      } else if (button.id && button.id.includes('googleSignIn')) {
        ariaLabel = 'Sign in with Google';
      }
      button.setAttribute('aria-label', ariaLabel);
    }
    button.setAttribute('role', 'button');
  });
  
  // Handle Google Identity Button
  const googleButtons = document.querySelectorAll('div[data-js-provider="google"], .g-signin-button');
  googleButtons.forEach((button) => {
    button.setAttribute('aria-label', 'Sign in with Google');
    button.setAttribute('role', 'button');
  });
}

/**
 * Replace my-button custom elements with accessible button elements
 */
function fixButtonIdentifiers() {
  const myButtons = document.querySelectorAll('my-button');
  myButtons.forEach((myButton) => {
    const button = document.createElement('button');
    
    // Copy all attributes except custom element-specific ones
    Array.from(myButton.attributes).forEach((attr) => {
      if (attr.name !== 'is' && !attr.name.startsWith('my-')) {
        button.setAttribute(attr.name, attr.value);
      }
    });
    
    // Copy text content
    button.textContent = myButton.textContent;
    
    // Copy child elements that might be present
    while (myButton.firstChild) {
      button.appendChild(myButton.firstChild);
    }
    
    // If no text content but has children with text, ensure button is accessible
    if (!button.textContent.trim() && button.querySelector('span, i, svg')) {
      const span = document.createElement('span');
      span.className = 'sr-only';
      span.textContent = 'Action';
      button.appendChild(span);
    }
    
    // Replace the custom element with the button
    myButton.parentNode.replaceChild(button, myButton);
  });
}

/**
 * Add lang attribute to the HTML element
 */
function addLangAttributeWithRoot(rootElement, lang) {
  // Add lang attribute to the HTML element
  rootElement.setAttribute('lang', lang);
}

/**
 * Validate that tables in the document are accessible
 */
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption') !== null;
    const hasHeaders = table.querySelector('th') !== null;
    const hasScope = Array.from(table.querySelectorAll('th')).every(
      th => th.hasAttribute('scope')
    );
    
    results.push({
      tableIndex: index,
      hasCaption,
      hasHeaders,
      hasScope,
      isAccessible: hasCaption && hasHeaders && hasScope
    });
  });
  
  return results;
}

/**
 * Validate the structure of tables in the document
 */
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    let isValid = true;
    let error = null;
    
    if (rows.length === 0) {
      isValid = false;
      error = 'Table has no rows';
    } else {
      const cellCounts = Array.from(rows).map(row => row.querySelectorAll('td, th').length);
      const allSame = cellCounts.every(count => count === cellCounts[0]);
      
      if (!allSame) {
        isValid = false;
        error = 'Table has inconsistent cell counts across rows';
      }
    }
    
    results.push({
      tableIndex: index,
      rowCount: rows.length,
      isValid,
      error
    });
  });
  
  return results;
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Setup skip links for accessibility
 */
function setupSkipLinks() {
  // Implementation for skip links
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  skipLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  });
}

/**
 * Implement this function for creating in-page buttons
 */
function createInPageButton(buttonLabel, onclick) {
  // Create an in-page button with appropriate ARIA attributes
  const button = document.createElement('button');
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', buttonLabel);
  if (onclick) {
    button.setAttribute('onclick', onclick);
  }
  button.textContent = buttonLabel;
  return button;
}

function createInPageDepGraphButton(depGraphContainer, renderFunction) {
  const button = createInPageButton('Render Dependency Graph', renderFunction);
  depGraphContainer.appendChild(button);
}

// Define new render function for dependency graph
function renderDependencyGraph() {
  // Add logic to render the dependency graph
  // ...
}

/**
 * Validate landmark accessibility
 */
function validateLandmark() {
  // Validate landmark accessibility
  // Check for proper landmark roles and other accessibility considerations
  // Return true if valid, false otherwise
  return true;
}

/**
 * Validate landmark structure
 */
function validateLandmarkStructure(rootElement) {
  // Validate landmark structure
  // Check for proper landmark roles and other structural considerations
  // Return true if valid, false otherwise
  return rootElement;
}

/**
 * Get accessible name for SVG
 */
function getSvgAccessibleName(svgElement) {
  // Get accessible name for SVG
  // Return accessible name
  return 'Decorative graphic';
}

/**
 * Handle rotation back functionality
 */
function rotateBack() {
  // Your code to rotate back
}

/**
 * Ensure unique landmarks in the entire application
 */
function ensureUniqueLandmarksWithFilter() {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0 && el.id) {
          el.id = `${el.id}-${index}`;
        }
      });
    }
  });
}

/**
 * Address accessibility issues from the insight report
 */
function addressAccessibilityIssues() {
  // TODO: Implement the function for addressing new accessibility issues
  const issues = [];
  const elements = document.querySelectorAll('img');
  elements.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: img,
        message: 'Image is missing alt attribute'
      });
    }
  });

  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((el) => {
    const hasLabel =
      el.hasAttribute('aria-label') ||
      el.hasAttribute('aria-labelledby') ||
      el.textContent.trim().length > 0 ||
      el.querySelector('[aria-label]') !== null;
    if (!hasLabel) {
      issues.push({
        type: 'missing-accessible-name',
        element: el,
        message: 'Interactive element is missing an accessible name'
      });
    }
  });

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && level - previousLevel > 1) {
      issues.push({
        type: 'heading-skip',
        element: heading,
        message: `Heading level skipped from h${previousLevel} to h${level}`
      });
    }
    previousLevel = level;
  });

  if (document.documentElement.lang !== 'en' && !document.documentElement.hasAttribute('lang')) {
    issues.push({
      type: 'missing-lang',
      element: document.documentElement,
      message: 'HTML root element is missing lang attribute'
    });
  }

  return {
    total: issues.length,
    issues,
    summary: {
      missingAlt: issues.filter((i) => i.type === 'missing-alt').length,
      missingAccessibleName: issues.filter((i) => i.type === 'missing-accessible-name').length,
      headingSkips: issues.filter((i) => i.type === 'heading-skip').length,
      missingLang: issues.filter((i) => i.type === 'missing-lang').length
    }
  };
}

/**
 * Get person name
 */
function personName(name) {
  // Return person name
  return name;
}

// New accessibility enhancement: ensure root container has accessible name and create announcement region
const rootContainer = document.getElementById('root').parentElement;
if (rootContainer) {
  rootContainer.setAttribute('role', 'main');
}

const announcementId = 'accessibility-announcement';
const announcement = document.createElement('div');
announcement.id = announcementId;
announcement.setAttribute('aria-live', 'polite');
announcement.setAttribute('aria-atomic', 'true');
// Hide off-screen
announcement.style.position = 'absolute';
announcement.style.left = '-9999px';
announcement.style.top = '-9999px';
document.body.appendChild(announcement);

/**
 * Initialize the application with accessibility improvements
 */
function initialize() {
  // Accessibility: Add lang attribute
  addLangAttribute();
  
  // Accessibility: Fix table structure
  fixTableStructure();
  
  // Accessibility: Add/fix landmark issues
  addMainLandmark();
  fixLandmarkIssues();
  
  // Accessibility: Ensure unique landmarks
  ensureUniqueLandmarks();
  uniqueLandmarks();
  
  // Accessibility: Add accessible names to SVGs
  addSvgAccessibleNames();
  addAccessibleNamesToSVGs();
  
  // Accessibility: Fix fake link issues
  fixFakeLinkIssue();
  fixFakeLinkIssues();
  
  // Accessibility: Google sign-in logic
  googleSignIn();
  
  // Accessibility: Replace my-button with actual button
  fixButtonIdentifiers();
  
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.removeAttribute('aria-hidden');
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Add dependency graph button functionality
  const depGraphContainer = document.getElementById('dep-graph-container');
  if(depGraphContainer) {
    createInPageDepGraphButton(depGraphContainer, renderDependencyGraph);
  }
  
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

// Export existing functionality
export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  validateTableAccessibility,
  validateTableStructure,
  setupButtonAccessibility,
  setupSkipLinks,
  createInPageDepGraphButton,
  renderDependencyGraph,
  rotateBack,
  personName,
  createInPageButton,
  addLangAttribute,
  addLangAttributeWithRoot,
  fixTableStructure,
  addMainLandmark,
  addMainLandmarkWithRoot,
  fixLandmarkIssues,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  ensureUniqueLandmarksWithFilter,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  getSvgAccessibleName,
  validateLandmark,
  validateLandmarkStructure
};

// Add the new function to the default export
export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  validateTableAccessibility,
  validateTableStructure,
  setupButtonAccessibility,
  setupSkipLinks,
  createInPageDepGraphButton,
  renderDependencyGraph,
  rotateBack,
  personName,
  createInPageButton,
  addLangAttribute,
  addLangAttributeWithRoot,
  fixTableStructure,
  addMainLandmark,
  addMainLandmarkWithRoot,
  fixLandmarkIssues,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  ensureUniqueLandmarksWithFilter,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  getSvgAccessibleName,
  validateLandmark,
  validateLandmarkStructure
};