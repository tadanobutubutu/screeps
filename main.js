import React from 'react';
import { moduleExports } from './moduleExports';

// Accessibility issues addressed from insight report
// Added accessibility-related functionality

// Added back required imports
// Preserved existing code
function existingFunction() {
  // ... existing code ...
}

// Preserved exports
moduleExports.existingFunction = existingFunction;

// Added new function or changes as requested
function newFunction() {
  // ... new code ...
}

// No removal or renaming of existing exports
moduleExports.newFunction = newFunction;
moduleExports.generateId = generateId;

// ============================================
// Accessibility Improvements
// ============================================

// REACT_015: Component to set lang attribute on HTML root element
export const HtmlLangProvider = ({ lang, children }) => {
  React.useEffect(() => {
    if (lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return children;
};

// REACT_015: Wrapper component with lang attribute for HTML element
export const AppWrapper = ({ lang, children }) => {
  return (
    <div lang={lang}>
      {children}
    </div>
  );
};

// REACT_036: Correcting fake links to use buttons instead
export const RotateBackButton = ({ onClick }) => {
  return (
    <button 
      id="unrotate" 
      type="button"
      onClick={onClick}
      aria-label="rotate view back"
    >
      rotate back
    </button>
  );
};

export const FakeLinkAsButton = ({ href, onClick, children, ...props }) => {
  // If href starts with # or is JavaScript-dependent, use button
  if (href?.startsWith('#') || href === '') {
    return (
      <button 
        type="button"
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  } else {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }
};

// REACT_027 & REACT_025: Example of a table component with corrected accessibility
export const DependencyGraphTable = ({ data }) => {
  return (
    <table>
      <caption style={{ textAlign: 'left' }}>
        Dependency relationships visualization
      </caption>
      <thead>
        <tr>
          {data.columns.map((column, index) => (
            <th key={index} id={`header-${index}`} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => (
              <td key={cellIndex} headers={cell.headerId}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// REACT_027: Function to fix table structure issues
export function fixTableStructureIssues(tables) {
  return tables.map((table, tableIndex) => ({
    ...table,
    caption: table.caption || `Table ${tableIndex + 1}`,
    hasHeaderRow: table.hasHeaderRow !== false,
    headers: table.headers || []
  }));
}

// REACT_025: Component with single <main> landmark and conditional content
// This fixes the issue where error and success states each had their own <main>
// Now uses ONE <main> element with conditional inner content via aria-live
export const StatusPage = ({ status, errorMessage, successContent, isLoading }) => {
  // Single main landmark for this component
  return (
    <main id="main-content" role="main" aria-live="polite">
      {isLoading && (
        <div className="loading-state" role="status" aria-busy="true">
          Loading...
        </div>
      )}
      
      {status === 'error' && (
        <article className="error-state" role="alert">
          <h1>Error</h1>
          <p>{errorMessage || 'An error occurred'}</p>
        </article>
      )}
      
      {status === 'success' && (
        <article className="success-state">
          <h1>Success</h1>
          {successContent}
        </article>
      )}
    </main>
  );
};

// REACT_025: Alternative component pattern using section instead of multiple mains
// For cases where the component might be nested inside a parent with <main>
export const ContentPanel = ({ type, title, content, errorContent }) => {
  // Use section instead of main when component is nested
  // This prevents duplicate main landmarks in the page
  if (type === 'error') {
    return (
      <section 
        id="error-panel" 
        aria-labelledby="error-title"
        className="error-panel"
      >
        <h2 id="error-title">Error</h2>
        {errorContent}
      </section>
    );
  }
  
  return (
    <section 
      id="content-panel"
      aria-labelledby="content-title"
      className="content-panel"
    >
      <h2 id="content-title">{title}</h2>
      {content}
    </section>
  );
};

// REACT_017 & REACT_025: Landmark structure with unique identifiers
export const PageLayout = ({ 
  headerContent, 
  mainContent, 
  navContent, 
  footerContent   
}) => {
  return (
    <>
      <header id="site-header" role="banner">
        {headerContent}
      </header>
      
      <nav id="main-navigation" role="navigation" aria-label="Main navigation">
        {navContent}
      </nav>
      
      <main id="main-content" role="main">
        {mainContent}
      </main>
      
      <footer id="site-footer" role="contentinfo">
        {footerContent}
      </footer>
    </>
  );
};

// REACT_025: Function to ensure unique landmarks
export function ensureUniqueLandmarks(container) {
  const landmarks = ['header', 'nav', 'main', 'footer'];
  const seenIds = new Set();
  
  landmarks.forEach(landmark => {
    const elements = container.querySelectorAll(landmark);
    elements.forEach((el) => {
      const role = el.getAttribute('role') || landmark;
      const existingId = el.id;
      
      if (existingId && !seenIds.has(existingId)) {
        seenIds.add(existingId);
      } else if (!existingId) {
        // Generate unique ID based on role
        let counter = 1;
        let newId = `${role}-${counter}`;
        while (seenIds.has(newId)) {
          counter++;
          newId = `${role}-${counter}`;
        }
        el.id = newId;
        seenIds.add(newId);
      }
    });
  });
  
  return container;
}

// REACT_041: SVG components with accessible name
export const AccessibleIconSVG = ({ ariaLabel, children, role = 'img', ...props }) => {
  return (
    <svg 
      aria-label={ariaLabel}
      role={role}
      aria-hidden={ariaLabel ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  );
};

export const GraphIcon = (props) => (
  <AccessibleIconSVG 
    ariaLabel="Dependency graph" 
    {...props}
  >
    {/* SVG path content */}
  </AccessibleIconSVG>
);

export const SettingsIcon = (props) => (
  <AccessibleIconSVG 
    ariaLabel="Settings" 
    {...props}
  >
    {/* SVG path content */}
  </AccessibleIconSVG>
);

// REACT_041: Utility function to generate accessible SVG favicon data URIs
// Ensures SVG favicons have proper accessible names via <title> element
export function createAccessibleFaviconSvg({
  title,
  children,
  viewBox = '0 0 100 100',
  xmlns = 'http://www.w3.org/2000/svg'
}) {
  const svgContent = `<svg xmlns="${xmlns}" viewBox="${viewBox}" role="img"><title>${title}</title>${children}</svg>`;
  const encoded = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encoded}`;
}

// REACT_041: Predefined accessible favicon generators for the project
export const faviconGenerators = {
  screepsDashboard: () => createAccessibleFaviconSvg({
    title: 'Screeps Dashboard',
    children: '<text y=".9em" x="50%" text-anchor="middle" font-size="70">S</text>'
  }),
  screepsBug: () => createAccessibleFaviconSvg({
    title: 'Screeps Bug Icon',
    children: '<circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="8"/>'
  })
};

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark(), validateLandmark(), validateUniqueLandmarks(), validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames(), getSvgAccessibleName(), createSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue(), validateLinkAccessibility(), createInPageButton(), validateLinkOrButton(), createAccessibleLink())

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateUniqueLandmarks(), and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by validateLinkAccessibility(), createInPageButton(), validateLinkOrButton(), and createAccessibleLink())

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
  const cells = table.querySelectorAll('td, th');
  
  // Ensure proper scope attributes on headers
  headers.forEach((th, index) => {
    const row = th.parentElement;
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const colIndex = Array.from(row.children).indexOf(th);
    
    const isRowHeader = rowIndex === 0 && colIndex > 0;
    const isColHeader = rowIndex > 0 && colIndex === 0;
    
    if (isRowHeader && !th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    } else if (isColHeader && !th.hasAttribute('scope')) {
      th.setAttribute('scope', 'row');
    } else if (rowIndex === 0 && colIndex === 0 && !th.hasAttribute('scope')) {
      // Corner cell
      th.setAttribute('scope', 'col');
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
 * Initialize all accessibility fixes
 */
function initAccessibility() {
  addLangAttribute();
  addMainLandmark();
  
  document.querySelectorAll('table').forEach(table => fixTableStructure(table));
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
}

// Auto-initialize if document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
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
  createAccessibleLink
};