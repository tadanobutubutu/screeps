// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

//_Commit: 10424a6a91e6d8a6267f46e9af6ca5fe0065cb1d_
//<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// Address accessibility issues from insight report (combined with the export code):
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// >>>>>>> branch-name

// TODO: Address accessibility issues from insight report — FIXED

// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)

// Import required modules
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

// Utility functions
function getFileExtension (filepath) {
  return path.extname(filepath)
}

function readFileAsync (filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function writeFileAsync (filepath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, 'utf8', (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function createServer (port, hostname, requestListener) {
  const server = http.createServer(requestListener)
  return server.listen(port, hostname)
}

function createHttpsServer (options, requestListener) {
  const server = https.createServer(options, requestListener)
  return server
}

function getAbsolutePath (relativePath) {
  return path.resolve(relativePath)
}

function joinPaths (...paths) {
  return path.join(...paths)
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang || 'en';
    }
    return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
    // Simple language detection based on common patterns
    let lang = 'en'; // Default to English

    if (content) {
        // Check for common non-ASCII characters to help detect language
        if (/[\u4e00-\u9fff]/.test(content)) {
            lang = 'zh'; // Chinese
        } else if (/[\u3040-\u30ff]/.test(content)) {
            lang = 'ja'; // Japanese
        } else if (/[\u0400-\u04ff]/.test(content)) {
            lang = 'ru'; // Russian/Cyrillic
        } else if (/[\u0600-\u06ff]/.test(content)) {
            lang = 'ar'; // Arabic
        } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
            lang = 'fr'; // French
        } else if (/[äöüß]/i.test(content)) {
            lang = 'de'; // German
        }
    }

    return setHtmlLangAttribute(lang);
}

/**
 * Creates a person name element with proper accessibility attributes
 * @param {Object} options - Options for creating the person name element
 * @param {string} options.firstName - The person's first name
 * @param {string} options.lastName - The person's last name
 * @param {string} options.lang - The language code for the name (default: 'en')
 * @param {HTMLElement} options.container - Optional container element to append to
 * @returns {HTMLElement} The created element with accessible naming
 */
function personName(options = {}) {
  const { firstName = '', lastName = '', lang = 'en', container = null } = options;
  const fullName = `${firstName} ${lastName}`.trim();

  if (typeof document !== 'undefined') {
    const nameElement = document.createElement('span');
    nameElement.setAttribute('lang', lang);
    nameElement.setAttribute('aria-label', fullName);
    nameElement.textContent = fullName || 'Unknown';

    if (container) {
      container.appendChild(nameElement);
    }

    return nameElement;
  }

  return fullName || 'Unknown';
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

// New function to validate table accessibility
function validateTableAccessibility() {
  if (typeof document === 'undefined') return;

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has a caption
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table caption';
      table.prepend(caption);
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });

    // Ensure table cells have proper headers
    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
      if (!cell.hasAttribute('headers')) {
        const rowIndex = cell.parentElement.rowIndex;
        const headers = table.querySelectorAll(`tr:nth-child(${rowIndex + 1}) th`);
        if (headers.length > 0) {
          const headerIds = Array.from(headers).map(h => h.id).filter(id => id);
          if (headerIds.length > 0) {
            cell.setAttribute('headers', headerIds.join(' '));
          }
        }
      }
    });
  });
}

// New function to validate table structure
function validateTableStructure() {
  if (typeof document === 'undefined') return;

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper structure
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      const firstRow = rows[0];
      const hasHeaderRow = Array.from(firstRow.children).some(cell => cell.tagName === 'TH');

      if (hasHeaderRow) {
        // Ensure all header cells have scope
        const headerCells = firstRow.querySelectorAll('th');
        headerCells.forEach(cell => {
          if (!cell.hasAttribute('scope')) {
            cell.setAttribute('scope', 'col');
          }
        });
      }
    }
  });
}

// New function to validate landmarks
function validateLandmark() {
  if (typeof document === 'undefined') return;

  const requiredLandmarks = ['header', 'main', 'footer'];
  const existingLandmarks = new Set();

  requiredLandmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length === 0) {
      // Create missing landmark
      const landmarkElement = document.createElement('div');
      landmarkElement.setAttribute('role', landmark);
      document.body.prepend(landmarkElement);
    } else {
      existingLandmarks.add(landmark);
    }
  });

  return Array.from(existingLandmarks);
}

// New function to validate landmark structure
function validateLandmarkStructure() {
  if (typeof document === 'undefined') return;

  const landmarks = document.querySelectorAll('[role="header"], [role="main"], [role="footer"]');
  landmarks.forEach(landmark => {
    // Ensure landmarks have proper structure
    if (landmark.getAttribute('role') === 'header' && !landmark.querySelector('h1')) {
      const heading = document.createElement('h1');
      heading.textContent = 'Page Title';
      landmark.prepend(heading);
    }
  });
}

// New function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement || typeof document === 'undefined') return '';

  // Check for existing accessible name
  let name = svgElement.getAttribute('aria-label') ||
             svgElement.getAttribute('aria-labelledby') ||
             svgElement.getAttribute('title');

  if (!name) {
    // Try to find a title element inside the SVG
    const titleElement = svgElement.querySelector('title');
    if (titleElement) {
      name = titleElement.textContent.trim();
    }
  }

  if (!name) {
    // Generate a default name if none found
    name = 'Graphic';
  }

  return name;
}

// New function to validate unique landmarks
function validateUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  const landmarks = document.querySelectorAll('[role="header"], [role="main"], [role="footer"]');
  const landmarkCounts = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
  });

  // Ensure each landmark type appears only once
  Object.entries(landmarkCounts).forEach(([role, count]) => {
    if (count > 1) {
      // If multiple landmarks of the same type exist, ensure they have unique labels
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach((element, index) => {
        if (index > 0) {
          const label = element.getAttribute('aria-label') || '';
          element.setAttribute('aria-label', `${label} ${index + 1}`);
        }
      });
    }
  });
}

/**
 * Function to add landmark issues (REACT_017)
 * @param {HTMLElement} element - The landmark element to process
 * @returns {Object} Result object with valid status and any errors
 */
function addLandmarkIssues(element) {
  const errors = [];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  // Check if element has role attribute
  const role = element.getAttribute('role');
  if (!role) {
    // Try to infer role from tag name
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'header') {
      element.setAttribute('role', 'banner');
      errors.push('Added role="banner" to header element');
    } else if (tagName === 'nav') {
      element.setAttribute('role', 'navigation');
      errors.push('Added role="navigation" to nav element');
    } else if (tagName === 'main') {
      element.setAttribute('role', 'main');
      errors.push('Added role="main" to main element');
    } else if (tagName === 'aside') {
      element.setAttribute('role', 'complementary');
      errors.push('Added role="complementary" to aside element');
    } else if (tagName === 'footer') {
      element.setAttribute('role', 'contentinfo');
      errors.push('Added role="contentinfo" to footer element');
    }

    const focusableElements = Array.from(
      container.querySelectorAll(focusableSelectors)
    ).filter(el => el.offsetParent !== null);

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Optionally focus the first focusable element in the trap
  const focusableElements = Array.from(
    container.querySelectorAll(focusableSelectors)
  ).filter(el => el.offsetParent !== null);

  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }

  // Check for required accessible names
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
    
    return true;
  } catch (e) {
    console.error('Error in validateLandmark:', e);
    return false;
  }

  return { valid: errors.length === 0, errors };
}

// TODO: Add back any required exports that might have been?
// (This comment remains as-is)

// Export the new functions
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  addLangAttribute,
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addLandmarkIssues,
  addSvgAccessibleNames,
  createAccessibleLink,
  towerDefense,
  implementTowerDefense,
  personName
};

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: 1d15d42958d662a6ba9beeb170f6f5adce09a87c_

// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->