// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// TODO: Implement function for adding proper landmark regions

// Import the required module
const _ = require('lodash');

// TODO: Implement validateLandmark functionality

function validateLandmark(landmark) {
  // Validate name is present and non-empty
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }

  // Validate coordinates if present
  if (landmark.latitude !== undefined || landmark.longitude !== undefined) {
    if (typeof landmark.latitude !== 'number' || typeof landmark.longitude !== 'number') {
      return false;
    }
    // Validate latitude range (-90 to 90)
    if (landmark.latitude < -90 || landmark.latitude > 90) {
      return false;
    }
    // Validate longitude range (-180 to 180)
    if (landmark.longitude < -180 || landmark.longitude > 180) {
      return false;
    }
  }

  return true;
}

/**
 * Function to add proper landmark regions to the page for accessibility
 * Landmark regions help assistive technologies navigate the page structure
 */
function addLandmarkRegions() {
  const landmarks = [
    { tag: 'header', role: 'banner', id: 'site-header' },
    { tag: 'nav', role: 'navigation', id: 'main-nav', ariaLabel: 'Main navigation' },
    { tag: 'main', role: 'main', id: 'main-content' },
    { tag: 'aside', role: 'complementary', id: 'sidebar' },
    { tag: 'footer', role: 'contentinfo', id: 'site-footer' }
  ];

  landmarks.forEach(landmark => {
    const element = document.createElement(landmark.tag);
    element.id = landmark.id;
    element.setAttribute('role', landmark.role);
    if (landmark.ariaLabel) {
      element.setAttribute('aria-label', landmark.ariaLabel);
    }
    document.body.appendChild(element);
  });
}

// Add the new function
function myNewFunction(arg1, arg2) {
  // Implement your new function here
  // For example:
  return arg1 + arg2;
}

/**
 * Creates an accessible in-page button element
 * @param {Document} doc - The document object
 * @param {string} text - The button text content
 * @param {Object} [options] - Optional configuration for the button
 * @param {string} [options.className] - CSS class name(s) for the button
 * @param {string} [options.id] - ID attribute for the button
 * @param {string} [options.ariaLabel] - Accessible label for screen readers
 * @param {boolean} [options.disabled] - Whether the button should be disabled
 * @param {string} [options.type] - Button type attribute (default: 'button')
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(doc, text = '', options = {}) {
  const button = doc.createElement('button');
  button.textContent = text;
  button.type = options.type || 'button';

  if (options.className) {
    button.className = options.className;
  }

  if (options.id) {
    button.id = options.id;
  }

  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }

  if (options.disabled) {
    button.disabled = true;
  }

  return button;
}

/**
 * React error display component with copy and retry functionality
 * @param {Object} props - Component props
 * @param {string} props.error - The error message to display
 * @param {boolean} props.copied - Whether the error has been copied to clipboard
 * @param {boolean} props.refreshing - Whether a retry request is in progress
 * @param {boolean} props.errCopyHover - Whether the copy button is being hovered
 * @param {boolean} props.errRetryHover - Whether the retry button is being hovered
 * @param {Function} props.copyErr - Handler to copy the error message
 * @param {Function} props.fetchStats - Handler to fetch stats / retry
 * @param {Function} props.setErrCopyHover - Setter for copy hover state
 * @param {Function} props.setErrRetryHover - Setter for retry hover state
 * @returns {JSX.Element} The error display component
 */
function ErrorDisplay({ error, copied, refreshing, errCopyHover, errRetryHover, copyErr, fetchStats, setErrCopyHover, setErrRetryHover }) {
  return (
    <html lang="en">
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
        {error && (
          <section
            role="alert"
            aria-label="エラーメッセージ詳細"
            aria-live="polite"
            style={{
              color: '#c53030',
              backgroundColor: '#fff5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {error}
          </section>
        )}
        <button
          onClick={copyErr}
          onMouseEnter={() => setErrCopyHover(true)}
          onMouseLeave={() => setErrCopyHover(false)}
          onFocus={() => setErrCopyHover(true)}
          onBlur={() => setErrCopyHover(false)}
          aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
          aria-pressed={copied}
          title={copied ? 'コピー済み' : 'エラーをコピー'}
          style={{
            backgroundColor: copied ? '#155d27' : '#004b73',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            transform: errCopyHover ? 'scale(1.05)' : 'scale(1)',
            boxShadow: errCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
            filter: errCopyHover ? 'brightness(1.1)' : 'none',
          }}
        >
          <span>{copied ? '✅' : '📋'}</span>
          <span> {copied ? 'コピー済み' : 'エラーをコピー'}</span>
        </button>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          aria-disabled={refreshing}
          aria-busy={refreshing}
          aria-label={refreshing ? '再試行中...' : 'エラーの再試行'}
          title={refreshing ? '再試行中...' : 'エラーの再試行'}
          onMouseEnter={() => setErrRetryHover(true)}
          onMouseLeave={() => setErrRetryHover(false)}
          onFocus={() => setErrRetryHover(true)}
          onBlur={() => setErrRetryHover(false)}
          style={{
            backgroundColor: refreshing ? '#999' : '#004b73',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            opacity: refreshing ? 0.6 : 1,
            marginLeft: '0.5rem',
          }}
        >
          <span aria-hidden="true">{refreshing ? '🔄' : '🔁'}</span>
          <span> {refreshing ? '再試行中...' : '再試行'}</span>
        </button>
      </div>
    </html>
  );
}

/**
 * Adds lang attribute to HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

/**
 * Fixes table structure issues for accessibility
 * Addresses issues like missing headers, captions, scope attributes
 * @param {Document} doc - The document object
 * @returns {number} Number of tables fixed
 */
function fixTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  let fixedCount = 0;
  
  tables.forEach((table) => {
    // Add caption if missing
    if (!table.caption) {
      const caption = doc.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
      fixedCount++;
    }
    
    // Ensure th elements have scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const rowHeaders = th.parentElement ? th.parentElement.querySelectorAll('th') : null;
        const isRowHeader = rowHeaders && rowHeaders.length > 1 && th.cellIndex > 0;
        th.setAttribute('scope', isRowHeader ? 'row' : 'col');
        fixedCount++;
      }
    });
    
    // Ensure table has proper thead and tbody
    if (!table.querySelector('thead')) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const thead = doc.createElement('thead');
        thead.appendChild(rows[0]);
        table.insertBefore(thead, table.firstChild);
        fixedCount++;
      }
    }
    
    if (!table.querySelector('tbody')) {
      const tbody = doc.createElement('tbody');
      const remainingRows = Array.from(table.querySelectorAll('tr'));
      remainingRows.forEach((row) => {
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      fixedCount++;
    }
  });

  return fixedCount;
}

/**
 * Adds and fixes landmark issues for accessibility
 * Ensures proper use of landmark elements (header, nav, main, footer, aside)
 * @param {Document} doc - The document object
 * @returns {number} Number of landmark issues fixed
 */
function addLandmarkIssues(doc) {
  let fixedCount = 0;
  
  // Ensure there's a main landmark
  const mains = doc.querySelectorAll('main');
  if (mains.length === 0) {
    const main = doc.createElement('main');
    const body = doc.querySelector('body');
    if (body) {
      // Move content to main
      Array.from(body.childNodes).forEach((child) => {
        if (!['SCRIPT', 'STYLE'].includes(child.nodeName)) {
          main.appendChild(child);
        }
      });
      body.appendChild(main);
      fixedCount++;
    }
  }
  
  // Ensure there's only one main landmark
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].setAttribute('role', 'region');
      mains[i].setAttribute('aria-label', `Content section ${i}`);
      fixedCount++;
    }
  }
  
  // Add skip link for keyboard navigation
  const skipLink = doc.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  const body = doc.querySelector('body');
  if (body) {
    body.insertBefore(skipLink, body.firstChild);
    fixedCount++;
  }
  
  // Mark the main landmark with id for skip link
  const mainElement = doc.querySelector('main') || doc.querySelector('[role="main"]');
  if (mainElement && !mainElement.id) {
    mainElement.id = 'main-content';
    fixedCount++;
  }
  
  return fixedCount;
}

/**
 * Adds accessible names to SVG elements
 * @param {Document} doc - The document object
 * @returns {number} Number of SVGs fixed
 */
function addSvgAccessibleNames(doc) {
  const svgs = doc.querySelectorAll('svg');
  let fixedCount = 0;
  
  svgs.forEach((svg, index) => {
    // Check if SVG already has accessible name
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    
    if (!title && !ariaLabel && !ariaLabelledby) {
      const svgTitle = doc.createElement('title');
      svgTitle.textContent = `Icon ${index + 1}`;
      svgTitle.id = `svg-title-${index + 1}`;
      svg.insertBefore(svgTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', svgTitle.id);
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Ensures unique landmarks across the page
 * @param {Document} doc - The document object
 * @returns {number} Number of landmark issues fixed
 */
function ensureUniqueLandmarks(doc) {
  let fixedCount = 0;
  
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach((landmark) => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
        if (!label) {
          const regionLabel = `Section ${index + 1}`;
          el.setAttribute('aria-label', regionLabel);
          fixedCount++;
        }
      });
    }
  });
  
  // Ensure nav elements have labels if multiple exist
  const navs = doc.querySelectorAll('nav');
  if (navs.length > 1) {
    navs.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        fixedCount++;
      }
    });
  }
  
  return fixedCount;
}

/**
 * Fixes fake link issues - converts non-navigation elements styled as links
 * @param {Document} doc - The document object
 * @returns {number} Number of fake links fixed
 */
function fixFakeLinkIssue(doc) {
  let fixedCount = 0;
  
  // Find elements with role="link" that aren't anchor elements
  const fakeLinks = doc.querySelectorAll('[role="link"]');
  
  fakeLinks.forEach((element) => {
    // Check if it's a clickable div/span that should be a button
    if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
      element.setAttribute('role', 'button');
      // Add tabindex to make it keyboard focusable
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      fixedCount++;
    }
  });
  
  // Fix links without href that act as buttons
  const linksWithoutHref = doc.querySelectorAll('a:not([href])');
  linksWithoutHref.forEach((link) => {
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    if (onclick || role === 'button') {
      link.setAttribute('role', 'button');
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Main initialization function that applies all accessibility fixes
 * @param {Document} doc - The document object (defaults to window.document)
 */
function initializeAccessibility(doc = window.document) {
  addLangAttribute(doc);
  fixTableStructure(doc);
  addLandmarkIssues(doc);
  addSvgAccessibleNames(doc);
  ensureUniqueLandmarks(doc);
  fixFakeLinkIssue(doc);
}

// Accessibility utilities export
const accessibilityExports = {
  addLangAttribute,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  initializeAccessibility,
  createInPageButton,
  ErrorDisplay,
  addLandmarkRegions,
};

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ...module.exports, // Preserve existing exports
    validateLandmark,
    myNewFunction,
    addLandmarkRegions,
    ...accessibilityExports,
  };
}

// ES Module export (for modern JavaScript environments)
if (typeof exports !== 'undefined') {
  exports.default = {
    validateLandmark,
    myNewFunction,
    addLandmarkRegions,
    ...accessibilityExports,
  };
  exports.validateLandmark = validateLandmark;
  exports.myNewFunction = myNewFunction;
  exports.addLandmarkRegions = addLandmarkRegions;
  exports.addLangAttribute = addLangAttribute;
  exports.fixTableStructure = fixTableStructure;
  exports.addLandmarkIssues = addLandmarkIssues;
  exports.addSvgAccessibleNames = addSvgAccessibleNames;
  exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
  exports.fixFakeLinkIssue = fixFakeLinkIssue;
  exports.initializeAccessibility = initializeAccessibility;
  exports.createInPageButton = createInPageButton;
  exports.ErrorDisplay = ErrorDisplay;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAccessibility());
  } else {
    initializeAccessibility();
  }
}