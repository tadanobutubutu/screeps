// No changes needed to main.js for HTML landmark structure - the accessibility 
// issue about missing <main> landmarks should be fixed in the HTML files (docs/index.html).
// However, this file provides utility functions that can be applied to fix accessibility 
// issues in web documents dynamically when needed.

// If this is a React project, the <main> landmark should be added in the component files
// or HTML templates, not in main.js.

/**
 * Add lang attribute to the HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (default: 'en')
 */
function addLangAttribute(doc = document, lang = 'en') {
  const htmlElement = doc.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

/**
 * Fix table structure issues for accessibility
 * Ensures proper table headers, captions, and structure
 * @param {Document} doc - The document object
 */
function fixTableStructure(doc = document) {
  const tables = doc.querySelectorAll('table');
  let fixedCount = 0;
  
  tables.forEach((table) => {
    // Add scope attribute to header cells if missing
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const rows = table.querySelectorAll('tr');
        const thIndex = Array.from(th.parentNode.children).indexOf(th);
        const isRowHeader = rows.every((row) => {
          const cells = row.querySelectorAll('td, th');
          return cells[thIndex] === th || cells[thIndex]?.textContent === th.textContent;
        });
        th.setAttribute('scope', isRowHeader ? 'row' : 'col');
      }
    });
    
    // Add caption if missing
    if (!table.querySelector('caption') && table.rows.length > 0) {
      const caption = doc.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
    
    fixedCount++;
  });
  
  return { tablesProcessed: fixedCount };
}

/**
 * Add main landmark to the document
 * @param {Document} doc - The document object
 */
function addMainLandmark(doc = document) {
  let mainElement = doc.querySelector('main');
  
  if (!mainElement) {
    // Look for the main content area and wrap or convert it
    const possibleMain = doc.querySelector('[role="main"]') || 
                         doc.querySelector('.main-content') ||
                         doc.querySelector('#main-content') ||
                         doc.querySelector('#content');
    
    if (possibleMain) {
      if (possibleMain.tagName !== 'MAIN') {
        possibleMain.setAttribute('role', 'main');
        possibleMain.id = possibleMain.id || 'main-content';
      }
      mainElement = possibleMain.tagName === 'MAIN' ? possibleMain : null;
    }
  }
  
  return mainElement;
}

/**
 * Fix landmark issues - ensure proper landmark elements
 * @param {Document} doc - The document object
 */
function fixLandmarkIssues(doc = document) {
  const issues = [];
  
  // Ensure banner/header landmark
  const header = doc.querySelector('header');
  if (header && !doc.querySelector('banner')) {
    header.setAttribute('role', 'banner');
  }
  
  // Ensure contentinfo/footer landmark
  const footer = doc.querySelector('footer');
  if (footer && !doc.querySelector('contentinfo')) {
    footer.setAttribute('role', 'contentinfo');
  }
  
  // Ensure navigation landmarks have labels
  const navElements = doc.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      const label = nav.closest('header') ? 'Header navigation' : 
                    nav.closest('footer') ? 'Footer navigation' : 
                    `Navigation ${index + 1}`;
      nav.setAttribute('aria-label', label);
    }
  });
  
  return { issuesFixed: issues.length };
}

/**
 * Ensure all landmarks have unique identifiers
 * @param {Document} doc - The document object
 */
function ensureUniqueLandmarks(doc = document) {
  return uniqueLandmarks(doc);
}

/**
 * Alias for ensureUniqueLandmarks
 * @param {Document} doc - The document object
 */
function uniqueLandmarks(doc = document) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const landmarkCounts = {};
  
  landmarks.forEach((tag) => {
    landmarkCounts[tag] = 0;
    const elements = doc.querySelectorAll(tag);
    
    elements.forEach((el, index) => {
      landmarkCounts[tag]++;
      const role = el.getAttribute('role') || tag;
      
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        const label = `${role.charAt(0).toUpperCase() + role.slice(1)} ${landmarkCounts[tag]}`;
        el.setAttribute('aria-label', label);
      }
    });
  });
  
  return landmarkCounts;
}

/**
 * Add accessible names to SVG elements
 * @param {Document} doc - The document object
 */
function addSvgAccessibleNames(doc = document) {
  return addAccessibleNamesToSVGs(doc);
}

/**
 * Add accessible names to all SVG elements
 * @param {Document} doc - The document object
 */
function addAccessibleNamesToSVGs(doc = document) {
  const svgs = doc.querySelectorAll('svg');
  let count = 0;
  
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && 
        !svg.hasAttribute('aria-labelledby') && 
        !svg.querySelector('title')) {
      
      const title = doc.createElement('title');
      title.textContent = `SVG icon ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
      count++;
    }
  });
  
  return { svgsProcessed: count };
}

/**
 * Fix fake link issues - convert links that should be buttons
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssue(doc = document) {
  return fixFakeLinkIssues(doc);
}

/**
 * Fix all fake link issues
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssues(doc = document) {
  const fakeLinks = doc.querySelectorAll('a[href="#"][onclick], a[href="javascript:void(0)"]');
  let count = 0;
  
  fakeLinks.forEach((link) => {
    const hasClickHandler = link.hasAttribute('onclick') || 
                           link.href === 'javascript:void(0)' ||
                           link.href === '#';
    
    if (hasClickHandler && !link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      
      // Add keyboard support
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
      
      count++;
    }
  });
  
  return { fakeLinksFixed: count };
}

/**
 * Initialize Google sign-in with proper accessibility
 * @param {Object} config - Google sign-in configuration
 */
function googleSignIn(config = {}) {
  const { buttonId = 'google-signin-button', callback } = config;
  
  const button = document.getElementById(buttonId);
  if (button) {
    // Ensure button has proper accessible name
    if (!button.hasAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Sign in with Google');
    }
    
    // Add loading state handling
    button.addEventListener('click', () => {
      button.setAttribute('aria-busy', 'true');
      button.setAttribute('aria-disabled', 'true');
      
      // Simulate the sign-in process
      if (callback) {
        callback()
          .finally(() => {
            button.setAttribute('aria-busy', 'false');
            button.setAttribute('aria-disabled', 'false');
          });
      }
    });
  }
  
  return button;
}

/**
 * Fix button identifiers - replace my-button with proper IDs
 * @param {Document} doc - The document object
 */
function fixButtonIdentifiers(doc = document) {
  const myButtons = doc.querySelectorAll('[id="my-button"], [class*="my-button"]');
  let count = 0;
  
  myButtons.forEach((button, index) => {
    if (button.id === 'my-button') {
      button.id = `action-button-${index + 1}`;
    }
    
    // Remove my-button from classes and add proper class
    if (button.classList.contains('my-button')) {
      button.classList.remove('my-button');
      button.classList.add(`accessible-button-${index + 1}`);
    }
    
    // Ensure accessible name
    if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', `Action button ${index + 1}`);
    }
    
    count++;
  });
  
  return { buttonsProcessed: count };
}

/**
 * Run all accessibility fixes
 * @param {Document} doc - The document object
 */
function runAccessibilityFixes(doc = document) {
  return {
    lang: addLangAttribute(doc),
    tables: fixTableStructure(doc),
    mainLandmark: addMainLandmark(doc),
    landmarks: fixLandmarkIssues(doc),
    uniqueLandmarks: ensureUniqueLandmarks(doc),
    svgs: addSvgAccessibleNames(doc),
    fakeLinks: fixFakeLinkIssues(doc),
    buttons: fixButtonIdentifiers(doc)
  };
}

// Auto-initialize on DOM ready if in browser environment
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => runAccessibilityFixes());
  } else {
    runAccessibilityFixes();
  }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    fixLandmarkIssues,
    ensureUniqueLandmarks,
    uniqueLandmarks,
    addSvgAccessibleNames,
    addAccessibleNamesToSVGs,
    fixFakeLinkIssue,
    fixFakeLinkIssues,
    googleSignIn,
    fixButtonIdentifiers,
    runAccessibilityFixes
  };
}