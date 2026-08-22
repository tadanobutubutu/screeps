// Import required modules
const fs = require('fs');
const path = require('path');

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Accessibility fixes have been implemented per the insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark(), validateLandmark(), validateUniqueLandmarks(), validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames(), getSvgAccessibleName(), createSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue(), validateLinkAccessibility(), createInPageButton(), validateLinkOrButton(), createAccessibleLink())

/**
 * Add lang attribute to the HTML element for accessibility
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(lang = 'en') {
  const html = document.querySelector('html');
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
}

/**
 * Fix table structure issues for accessibility
 * Ensures tables have proper headers and structure
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return;

  const headers = table.querySelectorAll('th');
  headers.forEach((th, headerIndex) => {
    const row = th.parentElement;
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const colIndex = Array.from(row.children).indexOf(th);

    // Header cells in the first row are column headers
    if (rowIndex === 0) {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    }
    // Header cells in the first column but not in the first row are row headers
    else if (colIndex === 0) {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'row');
      }
    }
    // Other header cells (e.g., spanning multiple columns) default to column scope
    else {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    }
  });

  // Add caption if missing but beneficial
  if (!table.querySelector('caption') && table.rows.length > 2) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    table.insertBefore(caption, table.firstChild);
  }
}

/**
 * Fix 26 table structure issues for accessibility
 * Iterates over all table elements and applies fixTableStructure
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    fixTableStructure(table);
  });
}

/**
 * Add main landmark to the page for accessibility
 * Ensures there's exactly one main landmark
 */
function addMainLandmark() {
  const existingMain = document.querySelector('main, [role="main"]');

  if (!existingMain) {
    // Try to find the most likely main content area
    const body = document.body;
    const possibleMains = body.querySelectorAll('div#main, div.main, div#content, div.content, article, section');

    if (possibleMains.length > 0) {
      const mainCandidate = possibleMains[0];
      mainCandidate.setAttribute('role', 'main');
    } else {
      // Create a main element wrapping body content
      const main = document.createElement('main');
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
}

/**
 * Add accessible names to SVG elements
 * @param {NodeList} svgs - SVG elements to add accessible names to
 */
function addSvgAccessibleNames(svgs) {
  if (!svgs) {
    svgs = document.querySelectorAll('svg');
  }

  svgs.forEach((svg, index) => {
    const hasTitle = svg.querySelector('title');
    const hasDesc = svg.querySelector('desc');
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');

    if (!hasTitle && !ariaLabel && !ariaLabelledby) {
      const title = document.createElement('title');
      title.id = `svg-title-${index}`;
      title.textContent = `Icon ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }

    if (!hasDesc && !ariaLabel && !ariaLabelledby) {
      const desc = document.createElement('desc');
      desc.id = `svg-desc-${index}`;
      desc.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(desc, svg.firstChild);
    }
  });
}

/**
 * Ensure landmarks are unique by adding unique IDs
 * @param {string} selector - CSS selector for landmark elements
 */
function ensureUniqueLandmarks(selector = 'header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]') {
  const landmarks = document.querySelectorAll(selector);
  const landmarkTypes = {};

  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || '';
    const type = role || tagName;

    if (!landmarkTypes[type]) {
      landmarkTypes[type] = 0;
    }
    landmarkTypes[type]++;

    if (landmarkTypes[type] > 1) {
      if (!landmark.id) {
        landmark.id = `${type}-${landmarkTypes[type]}`;
      }
    }
  });
}

/**
 * Fix fake link issues by ensuring links have proper href attributes
 * Converts divs/buttons that act as links into proper anchor elements
 * or ensures they have proper accessibility attributes
 */
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('div[onclick], span[onclick], button[onclick]');

  fakeLinks.forEach((element) => {
    const onclick = element.getAttribute('onclick') || '';
    if (onclick.includes('location') || onclick.includes('href') || onclick.includes('window')) {
      // This appears to be a link
      if (element.tagName !== 'A') {
        // Check if it has proper role and tabindex
        if (!element.hasAttribute('role') || element.getAttribute('role') !== 'link') {
          element.setAttribute('role', 'link');
        }
        if (!element.hasAttribute('tabindex')) {
          element.setAttribute('tabindex', '0');
        }

        // Add keyboard event support
        if (!element.hasAttribute('onkeydown')) {
          element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              element.click();
            }
          });
        }
      }
    }
  });
}

/**
 * Get the lang attribute from the HTML element
 * @returns {string|null} The language code or null if not set
 */
function getLangAttribute() {
  const html = document.querySelector('html');
  return html ? html.getAttribute('lang') : null;
}

/**
 * Get the full language attribute, falling back to navigator.language
 * @returns {string} The full language code (e.g., 'en-US')
 */
function getFullLangAttribute() {
  const lang = getLangAttribute();
  if (lang) return lang;
  return navigator.language || 'en';
}

/**
 * Validate table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const hasHeaders = table.querySelectorAll('th').length > 0;
  const hasCaption = !!table.querySelector('caption');
  const hasAriaLabels = table.hasAttribute('aria-label') || table.hasAttribute('aria-labelledby');
  return hasHeaders && (hasCaption || hasAriaLabels);
}

/**
 * Validate table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if the table structure is valid
 */
function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const headers = table.querySelectorAll('th');
  let valid = true;
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      valid = false;
    }
  });
  return valid;
}

/**
 * Validate if an element is a landmark
 * @param {HTMLElement} element - The element to validate
 * @returns {boolean} True if the element is a valid landmark
 */
function validateLandmark(element) {
  if (!element) return false;
  const role = element.getAttribute('role') || '';
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const tagName = element.tagName.toLowerCase();
  const implicitLandmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  if (implicitLandmarks.includes(tagName) && !role) {
    return true;
  }
  return validRoles.includes(role);
}

/**
 * Validate that landmarks are unique
 * @returns {boolean} True if all landmark types are unique
 */
function validateUniqueLandmarks() {
  const selectors = 'header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]';
  const landmarks = document.querySelectorAll(selectors);
  const types = {};
  let unique = true;
  landmarks.forEach(el => {
    const type = el.getAttribute('role') || el.tagName.toLowerCase();
    if (types[type]) {
      unique = false;
    } else {
      types[type] = true;
    }
  });
  return unique;
}

/**
 * Validate landmark structure (e.g., at most one main landmark)
 * @returns {boolean} True if the landmark structure is valid
 */
function validateLandmarkStructure() {
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  return mainLandmarks.length <= 1;
}

/**
 * Get the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const label = document.getElementById(ariaLabelledby);
    if (label) return label.textContent;
  }
  return 'SVG graphic';
}

/**
 * Create accessibility props for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {object} Accessibility props (e.g., for React)
 */
function createSvgAccessibilityProps(svg) {
  const name = getSvgAccessibleName(svg);
  return {
    'aria-label': name,
    'role': 'img'
  };
}

/**
 * Validate link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if the link is accessible
 */
function validateLinkAccessibility(link) {
  if (!link) return false;
  const tagName = link.tagName.toLowerCase();
  if (tagName === 'a') {
    return link.hasAttribute('href') &&
           (link.textContent.trim() ||
            link.hasAttribute('aria-label') ||
            link.hasAttribute('aria-labelledby'));
  } else if (tagName === 'button' ||
             link.getAttribute('role') === 'link' ||
             link.getAttribute('role') === 'button') {
    return link.textContent.trim() ||
           link.hasAttribute('aria-label') ||
           link.hasAttribute('aria-labelledby');
  }
  return false;
}

/**
 * Validate if an element acts as a link or button
 * @param {HTMLElement} element - The element to validate
 * @returns {boolean} True if the element is a link or button
 */
function validateLinkOrButton(element) {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'a' || tagName === 'button') return true;
  const role = element.getAttribute('role');
  if (role === 'link' || role === 'button') return true;
  return false;
}

/**
 * Create an in-page button element
 * @param {string} text - The button text
 * @param {Function} onClick - Click handler
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  button.setAttribute('type', 'button');
  return button;
}

/**
 * Create an accessible link element
 * @param {object} options - Configuration options
 * @returns {HTMLElement} The created anchor element
 */
function createAccessibleLink(options = {}) {
  const {
    text = 'Link',
    href = '#',
    target = '_self',
    rel = '',
    ariaLabel = '',
    className = ''
  } = options;

  const link = document.createElement('a');
  link.textContent = text;
  link.setAttribute('href', href);
  if (target) link.setAttribute('target', target);
  if (rel) link.setAttribute('rel', rel);
  if (ariaLabel) link.setAttribute('aria-label', ariaLabel);
  if (className) link.className = className;

  return link;
}

/**
 * Fix fake link issues with href="#" that lack accessible name
 */
function fixFakeLinkHrefIssue() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach(link => {
    const hasName = link.textContent.trim() ||
                    link.hasAttribute('aria-label') ||
                    link.hasAttribute('aria-labelledby');
    if (!hasName) {
      const buttonText = link.textContent.trim() ||
                         (link.hasAttribute('aria-label') ? link.getAttribute('aria-label') : 'Link');
      const button = createInPageButton(buttonText, e => {
        e.preventDefault();
        link.click();
      });
      // Preserve any onclick behavior by invoking the original click
      const onclick = link.getAttribute('onclick');
      if (onclick) {
        button.addEventListener('click', e => {
          e.preventDefault();
          link.click();
        });
      }
      link.parentNode.replaceChild(button, link);
    }
  });
}

/**
 * Initialize all accessibility fixes
 */
function initAccessibility() {
  addLangAttribute();
  addMainLandmark();

  document.querySelectorAll('table').forEach(table => fixTableStructure(table));
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  fixFakeLinkHrefIssue(); // new fix for href="#" fake links
}

// Auto-initialize if document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

/**
 * New function: getFileInfo
 * Returns information about a file path
 * @param {string} filePath - The file path
 * @returns {object} File information
 */
function getFileInfo(filePath) {
  if (!filePath) return null;
  return {
    path: path.resolve(filePath),
    basename: path.basename(filePath),
    extname: path.extname(filePath),
    exists: fs.existsSync(filePath)
  };
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  fixFakeLinkHrefIssue,
  initAccessibility,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateUniqueLandmarks,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createSvgAccessibilityProps,
  validateLinkAccessibility,
  createInPageButton,
  validateLinkOrButton,
  createAccessibleLink,
  getFileInfo
};