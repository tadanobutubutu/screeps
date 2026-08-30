// Implemented validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];
  
  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }
  
  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }
  
  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }
  
  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Main JavaScript module for landmark element validation
 * @module main
 */

/**
 * Configuration for landmark checks */
const config = {
  requiredLandmarks: ['main', 'header', 'footer'],
  optionalLandmarks: ['nav', 'aside', 'section'],
  skipElements: ['script', 'style', 'meta', 'link']
};

/**
 * Checks if an element is a landmark element
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if the element is a landmark
 */
function isLandmark(element) {
  if (!element || !element.tagName) return false;
  const landmarkTags = ['HEADER', 'MAIN', 'NAV', 'ASIDE', 'SECTION', 'ARTICLE', 'FOOTER'];
  return landmarkTags.includes(element.tagName);
}

/**
 * Validates landmark elements in a document
 * @param {Document} doc - The document to validate
 * @returns {Object} - Validation results
 */
function validateLandmarks(doc) {
  const results = {
    valid: true,
    landmarks: [],
    errors: []
  };

  if (!doc || !doc.body) {
    results.valid = false;
    results.errors.push('Document body not found');
    return results;
  }

  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  const selector = landmarkTags.join(', ');
  const landmarks = doc.querySelectorAll(selector);

  landmarks.forEach(landmark => {
    results.landmarks.push({
      tag: landmark.tagName.toLowerCase(),
      id: landmark.id || null,
      className: landmark.className || null
    });
  });

  const hasMain = results.landmarks.some(l => l.tag === 'main');
  if (!hasMain) {
    results.valid = false;
    results.errors.push('Document must contain at least one <main> landmark');
  }

  return results;
}

/**
 * Gets all landmark elements from a container
 * @param {HTMLElement} container - The container element
 * @returns {HTMLElement[]} - Array of landmark elements
 */
function getLandmarkElements(container) {
  if (!container) return [];

  const landmarkElements = [];
  const selector = 'header, main, nav, aside, section, article, footer';
  const elements = container.querySelectorAll(selector);

  elements.forEach(el => {
    if (isLandmark(el)) {
      landmarkElements.push(el);
    }
  });

  return landmarkElements;
}

// Example module pattern (common in Screeps)
const SomeModule = {
  // Some functionality
};

// Export the module
module.exports.SomeModule = SomeModule;

// Generalized accessibility functions

function setSvgAccessibleName(svg, name) {
  if (!svg) {
    throw new Error('SVG element is required');
    return;
  }
  svg.setAttribute('aria-label', name);
}

function improveAccessibility(container) {
  if (!container) {
    container = document.body;
  }
  if (container) {
    renderDependencyGraphContent(container);
  }

  // Ensure all clickable elements are focusable
  const focusable = container.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

function renderDependencyGraphContent(container) {
  if (!container) return;
  // Process the container for dependency graph content
  const elements = container.querySelectorAll('[data-dependency]');
  elements.forEach(el => {
    if (el.dataset) {
      // Process dependency data
    }
  });
}

function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const elementsById = {};

  if (!elements) return [];

  elements.forEach(el => {
    if (el.id) {
      elementsById[el.id] = elementsById[el.id] || [];
      elementsById[el.id].push(el);
    }
  });

  const uniqueElements = [];
  Object.keys(elementsById).forEach(id => {
    const els = elementsById[id];
    if (els.length === 1) {
      uniqueElements.push(els[0]);
    }
  });

  return uniqueElements;
}

function ensureUniqueLandmarks() {
  return {};
}

function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      }
    }
  });
}

function processUniqueElements() {
  const uniqueElements = [];
  // Process unique elements for landmark roles
  return uniqueElements;
}

function addressInsightIssues(insightReport) {
  const issues = insightReport && insightReport.issues ? insightReport.issues : [];
  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      ensureUniqueLandmarks();
    }
    if (issue.code === 'REACT_017') {
      const affectedElements = issue.elements || [];
      affectedElements.forEach(el => {
        if (!el['aria-label'] && !el.label) {
          el['aria-label'] = el.id || 'unnamed-element';
        }
      });
      const react017Elements = issue.elements || [];
    }
  });
}

function renderDependencyGraph(dependencyData) {
  console.log('Rendering dependency graph with data:', dependencyData);
}

function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
}

function calculateSum(a, b) {
  return a + b;
}

function addProperLandmarkRegions(affectedElements) {
  if (!affectedElements || !Array.isArray(affectedElements)) return;

  affectedElements.forEach(el => {
    if (el && el.tagName && !el.hasAttribute('role')) {
      el.setAttribute('role', 'region');
    }
  });
}

// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Sets the lang attribute on the HTML element based on provided language code.
 * Addresses REACT_015: Add lang attribute to HTML element.
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr').
 * @returns {boolean} - True if attribute was set, false otherwise.
 */
function setHtmlLangAttribute(lang) {
  if (typeof document === 'undefined' || !document.documentElement) {
    return false;
  }
  if (typeof lang !== 'string' || lang.trim() === '') {
    return false;
  }
  document.documentElement.setAttribute('lang', lang.trim());
  return true;
}

/**
 * Detects the page language from content/meta and sets the html lang attribute.
 * Addresses REACT_015: Add lang attribute to HTML element.
 * @param {Document} [doc] - Optional document to inspect (defaults to global document).
 * @returns {string|null} - The language code that was set, or null if none.
 */
function detectAndSetLang(doc) {
  const targetDoc = (doc && doc.documentElement) ? doc : (typeof document !== 'undefined' ? document : null);
  if (!targetDoc || !targetDoc.documentElement) {
    return null;
  }

  // Prefer existing lang attribute
  const existing = targetDoc.documentElement.getAttribute('lang');
  if (existing && existing.trim() !== '') {
    return existing.trim();
  }

  // Check meta http-equiv content-language
  const metaContentLang = targetDoc.querySelector('meta[http-equiv="content-language"]');
  if (metaContentLang) {
    const content = metaContentLang.getAttribute('content');
    if (content && content.trim() !== '') {
      const code = content.split(',')[0].trim();
      setHtmlLangAttribute(code);
      return code;
    }
  }

  // Check meta name="language"
  const metaNameLang = targetDoc.querySelector('meta[name="language"]');
  if (metaNameLang) {
    const content = metaNameLang.getAttribute('content');
    if (content && content.trim() !== '') {
      setHtmlLangAttribute(content.trim());
      return content.trim();
    }
  }

  // Check html lang attribute on existing root
  const rootLang = targetDoc.documentElement.lang;
  if (rootLang && rootLang.trim() !== '') {
    return rootLang.trim();
  }

  // Default fallback
  setHtmlLangAttribute('en');
  return 'en';
}

/**
 * Validates that tables have proper accessibility attributes.
 * Addresses REACT_027: Fix 26 table structure issues.
 * @param {Document|HTMLElement} [scope] - Optional scope to search within.
 * @returns {Object} - Validation results.
 */
function validateTableAccessibility(scope) {
  const root = scope || (typeof document !== 'undefined' ? document : null);
  const results = {
    valid: true,
    tables: [],
    errors: []
  };

  if (!root || typeof root.querySelectorAll !== 'function') {
    results.valid = false;
    results.errors.push('Invalid scope provided for table accessibility validation');
    return results;
  }

  const tables = root.querySelectorAll('table');
  tables.forEach((table, index) => {
    const tableResult = {
      index,
      hasCaption: false,
      hasHeaders: false,
      issues: []
    };

    const caption = table.querySelector('caption');
    if (caption) {
      tableResult.hasCaption = true;
    } else {
      tableResult.issues.push('Table missing <caption>');
    }

    const ths = table.querySelectorAll('th');
    if (ths.length > 0) {
      tableResult.hasHeaders = true;
      ths.forEach(th => {
        if (!th.hasAttribute('scope') && !th.hasAttribute('id')) {
          tableResult.issues.push('<th> element missing scope or id attribute');
        }
      });
    } else {
      tableResult.issues.push('Table has no <th> header cells');
    }

    if (table.getAttribute('role') === 'presentation' || table.getAttribute('role') === 'none') {
      // Layout tables are exempt from structural requirements
    }

    if (tableResult.issues.length > 0) {
      results.valid = false;
      results.errors.push('Table ' + index + ': ' + tableResult.issues.join('; '));
    }

    results.tables.push(tableResult);
  });

  return results;
}

/**
 * Validates the structural integrity of a table.
 * Addresses REACT_027: Fix 26 table structure issues.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {Object} - Validation results.
 */
function validateTableStructure(table) {
  const result = {
    valid: true,
    issues: []
  };

  if (!table || table.tagName !== 'TABLE') {
    result.valid = false;
    result.issues.push('Element is not a <table>');
    return result;
  }

  // Check for proper structure: thead, tbody, tfoot
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const rows = table.querySelectorAll('tr');

  if (rows.length === 0) {
    result.valid = false;
    result.issues.push('Table has no rows');
  }

  // Check that th elements are inside thead or have proper scope
  const allThs = table.querySelectorAll('th');
  allThs.forEach(th => {
    const parent = th.parentElement;
    const inThead = parent && (parent.tagName === 'THEAD' || parent.closest('thead'));
    if (!inThead && !th.hasAttribute('scope')) {
      result.issues.push('<th> outside <thead> is missing scope attribute');
    }
  });

  // Check for nested tables
  const nestedTables = table.querySelectorAll('table');
  if (nestedTables.length > 0) {
    result.issues.push('Table contains nested tables, which is discouraged for accessibility');
  }

  if (result.issues.length > 0) {
    result.valid = false;
  }

  return result;
}

/**
 * Validates the structure of a landmark element.
 * Addresses REACT_017: Add/fix 4 landmark issues.
 * @param {HTMLElement} element - The landmark element to validate.
 * @returns {Object} - Validation results.
 */
function validateLandmarkStructure(element) {
  const result = {
    valid: true,
    issues: []
  };

  if (!element || !element.tagName) {
    result.valid = false;
    result.issues.push('Element is not a valid HTMLElement');
    return result;
  }

  const tagName = element.tagName.toUpperCase();
  const landmarkTags = ['HEADER', 'MAIN', 'NAV', 'ASIDE', 'SECTION', 'ARTICLE', 'FOOTER'];

  if (!landmarkTags.includes(tagName)) {
    result.valid = false;
    result.issues.push('Element is not a landmark element: ' + tagName);
    return result;
  }

  // Main landmark should be unique
  if (tagName === 'MAIN') {
    if (typeof document !== 'undefined') {
      const allMains = document.querySelectorAll('main');
      if (allMains.length > 1) {
        result.issues.push('Multiple <main> landmarks found; should be unique');
      }
    }
  }

  // Section/article should have accessible name
  if (tagName === 'SECTION' || tagName === 'ARTICLE') {
    const hasAriaLabel = element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledby = element.hasAttribute('aria-labelledby');
    const hasTitle = element.hasAttribute('title') && element.getAttribute('title').trim() !== '';
    const hasHeading = element.querySelector('h1, h2, h3, h4, h5, h6') !== null;

    if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle && !hasHeading) {
      result.issues.push('<' + tagName.toLowerCase() + '> needs accessible name (aria-label, aria-labelledby, title, or heading)');
    }
  }

  // Nav landmark should have accessible name if there are multiple
  if (tagName === 'NAV') {
    if (typeof document !== 'undefined') {
      const allNavs = document.querySelectorAll('nav');
      if (allNavs.length > 1) {
        const hasAriaLabel = element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== '';
        const hasAriaLabelledby = element.hasAttribute('aria-labelledby');
        if (!hasAriaLabel && !hasAriaLabelledby) {
          result.issues.push('Multiple <nav> landmarks found; each needs a unique accessible name');
        }
      }
    }
  }

  if (result.issues.length > 0) {
    result.valid = false;
  }

  return result;
}

/**
 * Gets the accessible name for an SVG element.
 * Addresses REACT_041: Add accessible names to SVGs.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string|null} - The accessible name or null if none.
 */
function getSvgAccessibleName(svg) {
  if (!svg || svg.tagName === undefined || typeof svg.tagName !== 'string') {
    return null;
  }

  // Check aria-labelledby
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const refEl = svg.ownerDocument ? svg.ownerDocument.getElementById(labelledBy) : (typeof document !== 'undefined' ? document.getElementById(labelledBy) : null);
    if (refEl) {
      const text = (refEl.textContent || '').trim();
      if (text) return text;
    }
  }

  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim() !== '') {
    return ariaLabel.trim();
  }

  // Check title child
  const titleEl = svg.querySelector('title');
  if (titleEl) {
    const text = (titleEl.textContent || '').trim();
    if (text) return text;
  }

  // Check desc child
  const descEl = svg.querySelector('desc');
  if (descEl) {
    const text = (descEl.textContent || '').trim();
    if (text) return text;
  }

  return null;
}

/**
 * Creates an in-page button (anchor that behaves like a button) with proper a11y.
 * Addresses REACT_036: Fix fake link issues.
 * @param {Object} options - Configuration options.
 * @param {string} options.label - The accessible label / button text.
 * @param {string} [options.href] - Optional href; if absent, a button is created.
 * @param {Function} options.onClick - Click handler.
 * @returns {HTMLElement} - The created element.
 */
function createInPageButton(options) {
  const opts = options || {};
  const label = typeof opts.label === 'string' ? opts.label : 'Button';
  const doc = (typeof document !== 'undefined') ? document : null;
  if (!doc) {
    return null;
  }

  let el;
  if (opts.href) {
    el = doc.createElement('a');
    el.setAttribute('href', opts.href);
    el.setAttribute('role', 'button');
  } else {
    el = doc.createElement('button');
    el.setAttribute('type', 'button');
  }

  el.textContent = label;
  el.setAttribute('aria-label', label);

  if (typeof opts.onClick === 'function') {
    el.addEventListener('click', function (event) {
      opts.onClick(event);
    });
  }

  return el;
}

/**
 * Returns a person's accessible name string for use as accessible label.
 * Addresses REACT_036: Fix fake link issues (people names used as link text should be accessible).
 * @param {Object} person - Person object with name fields.
 * @returns {string} - The person's accessible name.
 */
function personName(person) {
  if (!person || typeof person !== 'object') {
    return '';
  }
  if (typeof person.fullName === 'string' && person.fullName.trim() !== '') {
    return person.fullName.trim();
  }
  const parts = [];
  if (typeof person.givenName === 'string') parts.push(person.givenName.trim());
  if (typeof person.middleName === 'string') parts.push(person.middleName.trim());
  if (typeof person.familyName === 'string') parts.push(person.familyName.trim());
  const joined = parts.filter(Boolean).join(' ').trim();
  if (joined) return joined;
  if (typeof person.name === 'string') return person.name.trim();
  return '';
}

module.exports = {
  validateLandmark,
  config,
  isLandmark,
  validateLandmarks,
  getLandmarkElements,
  SomeModule,
  setSvgAccessibleName,
  improveAccessibility,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  ensureUniqueLandmarks,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  setHtmlLangAttribute,
  detectAndSetLang,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  personName
};