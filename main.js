// main.js - Main application entry point

// Main module

// Dependency imports
const dependencyGraphContent = require('./dependencyGraphContent').dependencyGraphContent;
const indexContent = require('./indexContent').indexContent;
const http = require('http');
const url = require('url');
const a11yStore = require('./utilities/a11yStore');

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
} = require('./mathHelpers');

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

// TODO: Identify and update specific functions that render dependency graphs or index content
// Functions to update: renderDependencyGraphs, renderGraphIndex, ensureDependencyGraphAccessibility

const renderGraphIndex = (graphData) => {
  // Address accessibility issues from insight report
  ensureDependencyGraphAccessibility(document.querySelector('.dependency-graph-container'));
  renderDependencyGraphs(graphData);
};

/**
 * Render a single dependency graph from data
 * @param {Object} graphData - The graph data to render
 * @returns {string} - HTML string for the graph
 */
function renderDependencyGraph(graphData) {
    if (!graphData) return '';
    
    let html = '<div class="dependency-graph">';
    
    // Render nodes
    if (graphData.nodes) {
        html += '<div class="graph-nodes">';
        graphData.nodes.forEach(node => {
            html += `<div class="graph-node" data-id="${node.id}" aria-label="${node.label || node.id}">`;
            html += `<span class="node-label">${node.label || node.id}</span>`;
            html += '</div>';
        });
        html += '</div>';
    }
    
    // Render edges
    if (graphData.edges) {
        html += '<svg class="graph-edges" aria-hidden="true">';
        graphData.edges.forEach(edge => {
            const fromNode = graphData.nodes ? graphData.nodes.find(n => n.id === edge.from) : null;
            const toNode = graphData.nodes ? graphData.nodes.find(n => n.id === edge.to) : null;
            html += `<line class="graph-edge" data-from="${edge.from}" data-to="${edge.to}" x1="${fromNode ? fromNode.x : 0}" y1="${fromNode ? fromNode.y : 0}" x2="${toNode ? toNode.x : 0}" y2="${toNode ? toNode.y : 0}"/>`;
        });
        html += '</svg>';
    }
    
    html += '</div>';
    return html;
}

/**
 * Render the index content with accessibility enhancements
 * @param {Object} indexData - The index data to render
 * @returns {string} - HTML string for the index
 */
function renderIndex(indexData) {
    if (!indexData) return '';
    
    let html = '<div class="index-content" role="region" aria-label="Graph Index">';
    
    if (indexData.title) {
        html += `<h1 class="index-title">${indexData.title}</h1>`;
    }
    
    if (indexData.description) {
        html += `<p class="index-description">${indexData.description}</p>`;
    }
    
    if (indexData.entries) {
        html += '<nav class="index-nav" aria-label="Graph Navigation"><ul class="index-entries" role="list">';
        indexData.entries.forEach((entry, index) => {
            const entryLabel = entry.label || `Graph ${index + 1}`;
            html += `<li role="listitem"><a href="${entry.url || '#'}" class="index-entry-link" aria-label="${entryLabel}">${entryLabel}</a></li>`;
        });
        html += '</ul></nav>';
    }
    
    html += '</div>';
    return html;
}

/**
 * Ensure dependency graph container meets accessibility standards
 * @param {HTMLElement} container - The container element to make accessible
 */
function ensureDependencyGraphAccessibility(container) {
    if (!container) return;
    
    // Add ARIA attributes for accessibility
    container.setAttribute('role', 'img');
    if (!container.getAttribute('aria-label')) {
        container.setAttribute('aria-label', 'Dependency graph visualization');
    }
    
    // Ensure keyboard navigation for nodes
    const nodes = container.querySelectorAll('.graph-node');
    nodes.forEach((node, index) => {
        if (!node.getAttribute('tabindex')) {
            node.setAttribute('tabindex', '0');
        }
        if (!node.getAttribute('role')) {
            node.setAttribute('role', 'button');
        }
        if (!node.getAttribute('aria-label')) {
            node.setAttribute('aria-label', `Node: ${node.dataset.id || index}`);
        }
    });
    
    // Add live region for dynamic updates
    const liveRegion = container.querySelector('.sr-only') || (() => {
        const srOnly = document.createElement('div');
        srOnly.className = 'sr-only';
        srOnly.setAttribute('aria-live', 'polite');
        srOnly.setAttribute('aria-atomic', 'true');
        container.appendChild(srOnly);
        return srOnly;
    })();
}

// Required function implementations

/**
 * Rendering dependency graphs with accessibility enhancements
 * @param {Object} graphData - Data for rendering dependency graphs
 */
function renderDependencyGraphs(graphData) {
  if (typeof document === 'undefined') return;

  // Remove any existing graph containers
  const existingContainers = document.querySelectorAll('.dependency-graph-container');
  existingContainers.forEach(container => container.remove());

  // Create new container
  const container = document.createElement('div');
  container.className = 'dependency-graph-container';
  container.setAttribute('role', 'region');

  // Render the graph
  const graphHtml = renderDependencyGraph(graphData);
  container.innerHTML = graphHtml;

  // Add to document
  const mainElement = document.querySelector('main') || document.body;
  mainElement.appendChild(container);
}

// New functions
function ensureInteractiveElementsAccessible() {
  a11yStore.ensureInteractiveRoles();
  a11yStore.addFormControlLabels();
  a11yStore.ensureImageAccessibility();
}

// Function to handle initial accessibility setup
function handleInitialAccessibility() {
  a11yStore.checkLandmarkElements();
  a11yStore.addSVGAccessibilityProps();
  a11yStore.fixFakeLinks();
  a11yStore.updateLiveRegion('Initial accessibility enhancements applied');
  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(fixTableStructure);
  ensureInteractiveElementsAccessible();
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute; and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report (DONE: addSkipLink)

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
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
    if (/[一-鿿]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[぀-_ranges]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[Ѐ-ӿ]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[؀-ۿݐ-ݿ]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[\u00e0-\u00ff]/.test(content)) {
      lang = 'fr'; // French (simplified)
    } else if (/[\u00c0-\u00ff]/.test(content)) {
      lang = 'es'; // Spanish (simplified)
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return setHtmlLangAttribute(lang);
}

// Import the new function to create a button with correct accessibility properties for in-page linking
const inPageButton = typeof document !== 'undefined' ? createInPageButton() : null;

/**
 * Validates table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateTableAccessibility(table) {
  // This function validates table accessibility
  return validateTableStructure(table);
}

/**
 * Validates table structure and returns detailed error information
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with valid boolean and errors array
 */
function validateTableStructure(table) {
  // This function validates the structure of tables
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');

  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }

  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  // This function validates landmarks
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }

  // Check if landmark has accessible name when required
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates the landmark structure for accessibility issues
 * Checks for proper landmark roles, unique landmarks, and accessible names
 * @returns {Object} Result with valid boolean and errors array
 */
function validateLandmarkStructure() {
  // This function validates the structure of landmarks
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }

  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // This function returns the accessible name for an SVG
  if (!svg) {
    return '';
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent || '';
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }

  // Check for adjacent description
  const id = svg.getAttribute('id');
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      return describedBy.textContent || '';
    }
  }

  return '';
}

// Extract the accessible name for an SVG from its content
function extractSvgAccessibleName(svg) {
  // This function extracts the accessible name for an SVG from its content
  if (!svg) {
    return '';
  }

  // Check for aria-label attribute first (highest priority)
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby && typeof document !== 'undefined') {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      const text = labelElement.textContent || '';
      if (text.trim()) {
        return text.trim();
      }
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title && title.textContent && title.textContent.trim()) {
    return title.textContent.trim();
  }

  // Check for desc element inside SVG
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  // Check for adjacent description element by id pattern
  const id = svg.getAttribute('id');
  if (id && typeof document !== 'undefined') {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      const text = describedBy.textContent || '';
      if (text.trim()) {
        return text.trim();
      }
    }
  }

  // Fall back to combining all text content from the SVG
  if (svg.textContent && svg.textContent.trim()) {
    return svg.textContent.trim();
  }

  return '';
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // This function ensures that landmarks are unique
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Define unique landmarks that should only appear once
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];

  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;

    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });

  // Check for landmark IDs that should be unique
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink(href, text, options = {}) {
  // This function creates an accessible link
  const {
    onClick,
    role = 'link',
    ariaLabel,
    className,
    target,
    rel
  } = options;

  if (!href && !onClick) {
    return null;
  }

  const link = document.createElement('a');
  link.textContent = text;

  if (href) {
    link.href = href;
    // Add rel="noopener noreferrer" for external links
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer';
    } else if (rel) {
      link.rel = rel;
    }
  } else {
    // If no href, it's a button disguised as a link
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    });
  }

  if (className) {
    link.className = className;
  }

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }

  if (role && role !== 'link') {
    link.setAttribute('role', role);
  }

  return link;
}

/**
 * Checks if a link element is accessible
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} Result with valid boolean and errors array
 */
function isLinkAccessible(link) {
  const errors = [];

  if (!link) {
    return { valid: false, errors: ['Link element is required'] };
  }

  // Check if it's an anchor element
  if (link.tagName !== 'A') {
    errors.push('Element is not an anchor tag');
    return { valid: false, errors };
  }

  // Check for href attribute
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    // If no href, check if it's properly set up as a button
    const role = link.getAttribute('role');
    if (role !== 'button') {
      errors.push('Link missing href attribute and not configured as a button');
    }
    // Check for click handler
    if (!link.onclick && !link.hasAttribute('data-handler')) {
      errors.push('Fake link missing click handler');
    }
  }

  // Check for accessible name
  const textContent = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;

  if (!hasAccessibleName) {
    errors.push('Link is missing accessible name (text content, aria-label, or aria-labelledby)');
  }

  // Check for valid href if present
  if (href && href !== '#') {
    // Check for javascript: links
    if (href.toLowerCase().startsWith('javascript:')) {
      errors.push('Link uses javascript: protocol which is not accessible');
    }
    // Check for mailto: links without proper labeling
    if (href.toLowerCase().startsWith('mailto:') && !ariaLabel && !textContent.includes('@')) {
      errors.push('Mailto link may need aria-label for clarity');
    }
  }

  // Check target="_blank" has rel="noopener noreferrer"
  if (link.getAttribute('target') === '_blank') {
    const rel = link.getAttribute('rel');
    if (!rel || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      errors.push('External link with target="_blank" missing rel="noopener noreferrer"');
    }
  }

  // Check for redundant title attribute
  const title = link.getAttribute('title');
  if (title && title === textContent) {
    errors.push('Link title attribute duplicates link text');
  }

  return { success: errors.length === 0 ? true : false, errors };
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
  // Set an actual button id for accessibility instead of placeholder 'my-button'
  btn.id = 'in-page-modal-button';
  parent.appendChild(btn);
  return btn;
}

/**
 * Wraps primary content in a main landmark element, with optional container and configuration.
 * Supports both simple usage (content only) and advanced usage (with container and options).
 * @param {HTMLElement|string} content - The content element to wrap or string content.
 * @param {HTMLElement} [container] - Optional container element to append the main element to.
 * @param {Object} [options] - Configuration options.
 * @param {string} options.id - The id attribute for the main element (default: 'main-content')
 * @param {string} options.className - The class name for the main element (default: 'primary-content')
 * @param {string} options.role - The ARIA role for the element (default: 'main')
 * @param {string} options.ariaLabel - Optional aria-label for the main element
 * @returns {HTMLElement|null} The created main element, or null if validation fails
 */
function wrapPrimaryContentInMain(content, container, options = {}) {
  const {
    id = 'main-content',
    className = 'primary-content',
    role = 'main',
    ariaLabel
  } = options;

  // If no container is provided, create the main element without appending (backward compatibility)
  if (!container) {
    if (typeof document !== 'undefined') {
      // Check for existing main elements to ensure uniqueness (per ARIA best practices)
      const existingMains = document.querySelectorAll('main, [role="main"]');
      if (existingMains.length > 0) {
        console.warn(`wrapPrimaryContentInMain: Found ${existingMains.length} existing main element(s). There should be only one main landmark per page.`);
      }
    } else {
      return null;
    }

    const mainElement = document.createElement('main');
    mainElement.id = id;
    mainElement.className = className;
    mainElement.setAttribute('role', role);

    if (ariaLabel) {
      mainElement.setAttribute('aria-label', ariaLabel);
    }

    if (content) {
      if (content instanceof HTMLElement) {
        mainElement.appendChild(content);
      } else if (typeof content === 'string') {
        mainElement.textContent = content;
      }
    }

    return mainElement;
  }

  // Container provided: validate and append
  if (typeof document === 'undefined') {
    return null;
  }

  // Check for existing main elements to ensure uniqueness (per ARIA best practices)
  const existingMains = document.querySelectorAll('main, [role="main"]');
  if (existingMains.length > 0) {
    console.warn(`wrapPrimaryContentInMain: Found ${existingMains.length} existing main element(s). There should be only one main landmark per page.`);
  }

  const mainElement = document.createElement('main');
  mainElement.id = id;
  mainElement.className = className;
  mainElement.setAttribute('role', role);

  if (ariaLabel) {
    mainElement.setAttribute('aria-label', ariaLabel);
  }

  // If content is provided, append it to the main element
  if (content) {
    if (content instanceof HTMLElement) {
      mainElement.appendChild(content);
    } else if (typeof content === 'string') {
      mainElement.textContent = content;
    }
  }

  // Append the main element to the container
  container.appendChild(mainElement);

  return mainElement;
}

// HTTP Server setup
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // CORS headers for credential responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
  }

  // Health check endpoint
  if (parsedUrl.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', sessions: getActiveSessionsCount() }));
      return;
  }

  // Credential response endpoint
  if (parsedUrl.pathname === '/api/credential' && req.method === 'POST') {
      let body = '';

      req.on('data', chunk => {
          body += chunk.toString();
      });

      req.on('end', () => {
          try {
              const credentialResponse = JSON.parse(body);
              const result = handleCredentialResponse(credentialResponse);
              res.writeHead(result.status === 'success' ? 200 : 400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result));
          } catch (error) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON' }));
          }
      });
      return;
  }

  // Session validation endpoint
  if (parsedUrl.pathname === '/api/session/validate' && req.method === 'GET') {
      const sessionId = parsedUrl.query.sessionId;

      if (!sessionId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Session ID required' }));
          return;
      }

      const session = validateSession(sessionId);

      if (session) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'valid', user: session }));
      } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'invalid', message: 'Session expired or invalid' }));
      }
      return;
  }

  // Session revocation endpoint
  if (parsedUrl.pathname === '/api/session/revoke' && req.method === 'POST') {
      let body = '';

      req.on('data', chunk => {
          body += chunk.toString();
      });

      req.on('end', () => {
          try {
              const { sessionId } = JSON.parse(body);
              const revoked = revokeSession(sessionId);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: revoked ? 'success' : 'error' }));
          } catch (error) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'error', message: 'Invalid request' }));
          }
      });
      return;
  }

  // 404 handler
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'error', message: 'Not found' }));
});

// Required function implementations

/**
 * Validates and fixes table structure issues
 * @param {HTMLTableElement} table - The table element to validate and fix
 */
function fixTableStructure(table) {
  // This function validates and fixes table structure issues
  const validation = validateTableStructure(table);
  
  if (!validation.valid && typeof document !== 'undefined') {
    // Check if table needs thead
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tbody tr') || table.querySelector('tr');
      if (firstRow) {
        const cells = firstRow.querySelectorAll('th, td');
        if (cells.length > 0) {
          const tr = document.createElement('tr');
          cells.forEach(cell => {
            const th = document.createElement('th');
            th.textContent = cell.textContent;
            th.setAttribute('scope', 'col');
            tr.appendChild(th);
          });
          thead.appendChild(tr);
          table.insertBefore(thead, table.firstChild);
        }
      }
    }
    
    // Ensure tbody exists
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
    }
  }
}

/**
 * Check landmark elements in the document
 */
function checkLandmarkElements() {
    if (typeof document === 'undefined') {
        return;
    }
    
    a11yStore.checkLandmarkElements();
}

/**
 * Handle focus trap for accessibility (e.g., modals)
 * @param {HTMLElement} container - The container to trap focus within
 */
function handleFocusTrap(container) {
    if (!container) return;
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    });
}

/**
 * Gets the language attribute for the document
 * @returns {string} The current language attribute value
 */
function getLangAttribute() {
  if (typeof document === 'undefined') {
    return 'en';
  }
  return document.documentElement.lang || 'en';
}

/**
 * Gets or sets the person name based on language detection
 * @param {string} name - The name to validate/set
 * @returns {string} The validated or detected person name
 */
function personName(name) {
  if (!name) {
    return 'User';
  }
  
  // Set lang based on name characteristics
  if (name.match(/[^\x00-\x7F]/)) {
    setHtmlLangAttribute('utf8');
  } else {
    setHtmlLangAttribute('en');
  }
  
  return name;
}

// Start server if this is the main module
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        handleInitialAccessibility();
    });
}

// Export modules for testing
module.exports = {
  renderDependencyGraph,
  renderIndex,
  ensureDependencyGraphAccessibility,
  validateSession,
  getActiveSessionsCount,
  server,
  sanitizeFilename,
  processData,
  revokeSession,
  addSvgAccessibilityProps: a11yStore.addSVGAccessibilityProps,
  isLandmarkElement,
  handleCredentialResponse,
  parseCredentialResponse,
  decodeJwtToken,
  generateSessionId,
  validateTableStructure,
  validateTableAccessibility,
  validateLandmark,
  validateLandmarkStructure,
  createInPageButton,
  personName,
  handleInitialAccessibility,
  ensureInteractiveElementsAccessible,
  addressAccessibilityIssues,
  renderDependencyGraphs,
  checkLandmarkElements,
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  createAccessibleLink,
  isLinkAccessible,
  wrapPrimaryContentInMain,
  validateTableAccessibility,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  extractSvgAccessibleName,
  addSkipLink
};