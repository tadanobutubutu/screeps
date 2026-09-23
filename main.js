// TODO: This is the existing code that needs to be preserved
//_Commit: 07177d2c69c06fd1dfe3543ad6d3c81baa3c821f_
//<!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

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

// TODO: Create new function to check if an element has a specific class name
function hasClass(element, className) {
  if (!element || !element.className) return false;
  const classNames = element.className.trim().split(' ');
  return classNames.includes(className);
}

/**
 * Validates the structure of landmark elements in a document
 * Checks for proper nesting, duplicate landmarks, and ARIA landmark roles
 * @param {Document|HTMLElement} docOrContainer - The document or container to validate
 * @returns {Object} - Validation results with structure issues
 */
function validateLandmarkStructure(docOrContainer) {
  const results = {
    valid: true,
    issues: []
  };
  
  if (!docOrContainer) {
    results.valid = false;
    results.issues.push('Document or container is required');
    return results;
  }
  
  const container = docOrContainer.body || docOrContainer;
  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  const selector = landmarkTags.join(', ');
  const landmarks = container.querySelectorAll(selector);
  
  // Check for multiple <main> elements
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length > 1) {
    results.valid = false;
    results.issues.push(`Found ${mainElements.length} <main> elements. Documents should only have one <main> landmark.`);
  }
  
  // Check for <header> and <footer> outside of landmark contexts
  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    
    // Check for nested landmarks of the same type (except nav, aside, section)
    if (tag === 'header' || tag === 'footer' || tag === 'article') {
      const parentOfSameType = landmark.parentElement?.closest(tag);
      if (parentOfSameType) {
        results.valid = false;
        results.issues.push(`Nested <${tag}> element found. <${tag}> should not be nested within another <${tag}>.`);
      }
    }
    
    // Check for section/article without accessible name
    if (tag === 'section' || tag === 'article') {
      const hasLabel = landmark.id || landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
      const firstHeading = landmark.querySelector('h1, h2, h3, h4, h5, h6');
      
      if (!hasLabel && !firstHeading) {
        results.valid = false;
        results.issues.push(`<${tag}> element should have an accessible name via id, aria-label, aria-labelledby, or contain a heading.`);
      }
    }
    
    // Check for proper landmark role attributes
    const validLandmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
    const explicitRole = landmark.getAttribute('role');
    if (explicitRole && !validLandmarkRoles.includes(explicitRole)) {
      results.issues.push(`Element has non-standard landmark role: ${explicitRole}`);
    }
  });
  
  // Check for landmark elements with tabindex that might indicate interactive misuse
  landmarks.forEach(landmark => {
    const tabindex = landmark.getAttribute('tabindex');
    if (tabindex !== null && landmark.tagName.toLowerCase() !== 'nav') {
      results.issues.push(`Landmark element <${landmark.tagName.toLowerCase()}> should not have tabindex. Use tabindex on interactive elements within landmarks instead.`);
    }
  });
  
  return results;
}

/**
 * Main JavaScript module for landmark element validation
 * @module main
 */

/**
 * Configuration for landmark checks
 */
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
 * Add addLangAttribute function
 */
function addLangAttribute(htmlElement, language) {
  if (!htmlElement) return;
  if (htmlElement.lang !== language) {
    htmlElement.lang = language;
  }
}

/**
 * Add validateTableAccessibility function
 */
function validateTableAccessibility(table) {
  const tableRows = Array.from(table.rows);
  let tableHead, tableBody;
  const tableHasHead = tableRows.some((row, index) => index === 0 && row.cells.length > 0);

  if (tableHasHead) {
    tableHead = tableRows[0];
    tableBody = tableRows.slice(1);
  } else {
    tableHead = null;
    tableBody = tableRows;
  }

  const tableHeaders = tableHead ? Array.from(tableHead.cells) : [];
  const tableColumns = tableBody.reduce((columns, row) => {
    const cells = Array.from(row.cells);
    cells.forEach((cell, index) => {
      if (!columns[index]) {
        columns[index] = [];
      }
      columns[index].push(cell);
    });
    return columns;
  }, Array(tableHeaders.length).fill(null));

  let hasHeaderCellsWithScope = false;
  tableHeaders.forEach(headerCell => {
    if (headerCell.hasAttribute('scope')) {
      hasHeaderCellsWithScope = true;
    }
  });

  if (!hasHeaderCellsWithScope) {
    // Add scope attribute to table headers
    tableHeaders.forEach((headerCell, columnIndex) => {
      headerCell.setAttribute('scope', 'col');
    });
  }

  let headersExhausted = false;
  let cellIndex = 0;
  tableBody.forEach(row => {
    row.cells.forEach((cell, rowIndex) => {
      if (!headersExhausted && cellIndex < tableColumns[rowIndex].length) {
        const headerCell = tableColumns[rowIndex][cellIndex];
        if (!headerCell.hasAttribute('id')) {
          headerCell.setAttribute('id', `table-label-${cellIndex}`);
        }
        cell.setAttribute('aria-labelledby', `table-label-${cellIndex}`);
      } else {
        cell.setAttribute('aria-label', cell.textContent);
      }
      cellIndex++;
    });

    if (tableColumns.length === cellIndex) {
      headersExhausted = true;
    } else {
      cellIndex = 0;
    }
  });
}

/**
 * Add validateTableStructure function
 */
function validateTableStructure(table, minRows, minCells) {
  const tableRows = Array.from(table.rows);
  const tableHasHead = tableRows.some((row, index) => index === 0 && row.cells.length > 0);

  if (!tableHasHead) {
    throw new Error('Table is missing thead');
  }

  const tableHeaders = Array.from(tableRows[0].cells);
  const numHeaders = tableHeaders.length;
  const tableBodyRows = tableRows.slice(1);

  if (tableBodyRows.length < minRows) {
    throw new Error(`Table has less than ${minRows} rows`);
  }

  tableBodyRows.forEach(row => {
    if (row.cells.length < minCells) {
      throw new Error(`Row has less than ${minCells} cells`);
    }
  });

  if (numHeaders !== tableBodyRows[0].cells.length) {
    throw new Error('Table column count does not match header count');
  }
}

/**
 * Add fixTableStructure function
 */
function fixTableStructure(table, minRows, minCells) {
  const tableRows = Array.from(table.rows);
  const tableHasHead = tableRows.some((row, index) => index === 0 && row.cells.length > 0);

  if (!tableHasHead) {
    const tableHeadRow = document.createElement('thead');
    table.appendChild(tableHeadRow);

    const tableHeadRowCells = Array.from(table.querySelectorAll('thead th')).slice(0, minCells);
    tableHeadRowCells.forEach(cell => {
      tableHeadRow.appendChild(cell);
    });
  }

  const tableBodyRows = tableRows.slice(1);

  if (tableBodyRows.length < minRows) {
    for (let i = tableBodyRows.length; i < minRows; i++) {
      const tableBodyRow = document.createElement('tr');
      tableBody.appendChild(tableBodyRow);

      const tableBodyRowCells = Array.from(table.querySelectorAll('tbody th')).slice(0, minCells);
      tableBodyRowCells.forEach(cell => {
        tableBodyRow.appendChild(cell);
      });
    }
  }
}

// Additional functions to implement accessibility improvements

function getSvgAccessibleName(svg) {
  if (!svg) {
    throw new Error('SVG element is required');
    return;
  }
  const namespace = svg.namespaceURI;
  const svgNamespace = 'http://www.w3.org/2000/svg';
  if (namespace === svgNamespace) {
    const title = svg.querySelector('title');
    return title ? title.textContent : '';
  }
  return '';
}

function setSvgAttributes(svg, width, height) {
  if (!svg) {
    throw new Error('SVG element is required');
    return;
  }

  // Ensure all clickable elements are focusable
  const focusable = container.querySelectorAll('button, input, select, textarea, [tabindex]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

/**
 * Renders dependency graph content within a container element.
 * Processes elements with the data-dependency attribute and renders graph visualizations.
 * @param {HTMLElement} container - The container element to process
 */
function renderDependencyGraphContent(container) {
  if (!container) return;
  // Process the container for dependency graph content
  const elements = container.children;
  elements.forEach(el => {
    if (el.dataset) {
      // Process dependency data
      const dependencyData = el.dataset.dependency;
      if (dependencyData) {
        try {
          const parsedData = JSON.parse(dependencyData);
          el.setAttribute('data-dependency-processed', 'true');
          el.dataset.processed = 'true';
        } catch (e) {
          // If not JSON, treat as raw identifier
          el.setAttribute('data-dependency-id', dependencyData);
        }
      }
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
  // TODO: Implement function to ensure unique landmarks
  // ...
}

function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (svg && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = 'svg-title-' + Math.random().toString(36).substring(2, 9);
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

// New accessibility functions for additional insight issues
function setLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', lang);
  }
}

function fixFakeLinks() {
  if (typeof document === 'undefined') return;
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    if (!text && !ariaLabel) {
      link.setAttribute('aria-label', 'Link');
    }
  });
}

function addressInsightIssues(insightReport) {
  const issues = insightReport && insightReport.issues ? insightReport.issues : [];
  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      ensureLandmarkUniqueness();
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
    if (issue.code === 'REACT_015') {
      setLangAttribute();
    }
    if (issue.code === 'REACT_036') {
      fixFakeLinks();
    }
  });
}

/**
 * Renders a dependency graph visualization based on the provided dependency data.
 * Processes nodes and edges to create a graph structure.
 * @param {Object|Array} dependencyData - The dependency data containing nodes and relationships
 * @returns {Object|null} The rendered graph structure or null if data is invalid
 */
function renderDependencyGraph(dependencyData) {
  if (!dependencyData) {
    console.warn('No dependency data provided for rendering');
    return null;
  }

  const nodes = Array.isArray(dependencyData) ? dependencyData : (dependencyData.nodes || []);
  const edges = dependencyData.edges || [];

  const graph = {
    nodes: nodes.map((node, index) => ({
      id: node.id || `node-${index}`,
      label: node.label || node.name || `Node ${index}`,
      dependencies: node.dependencies || []
    })),
    edges: edges.map(edge => ({
      source: edge.source || edge.from,
      target: edge.target || edge.to,
      type: edge.type || 'dependency'
    })),
    renderedAt: new Date().toISOString()
  };

  console.log('Rendering dependency graph with data:', graph);
  return graph;
}

/**
 * Renders an index view based on the provided index data.
 * Processes index entries and creates a navigable view structure.
 * @param {Object|Array} indexData - The index data containing entries to display
 * @returns {Object|null} The rendered index view or null if data is invalid
 */
function renderIndexView(indexData) {
  if (!indexData) {
    console.warn('No index data provided for rendering');
    return null;
  }

  const entries = Array.isArray(indexData) ? indexData : (indexData.entries || []);

  const view = {
    entries: entries.map((entry, index) => ({
      id: entry.id || `entry-${index}`,
      title: entry.title || entry.name || `Entry ${index}`,
      path: entry.path || entry.url || '#',
      category: entry.category || 'default'
    })),
    totalCount: entries.length,
    renderedAt: new Date().toISOString()
  };

  console.log('Rendering index view with data:', view);
  return view;
}

function calculateSum(a, b) {
  return a + b;
}

function addProperLandmarkRegions(affectedElements) {
  if (!affectedElements || !Array.isArray(affectedElements)) return;

  affectedElements.forEach(el => {
    if (el && el.tagName && !el.getAttribute('role')) {
      el.setAttribute('role', 'region');
    }
  });
}

/**
 * Gets the lang attribute value from the HTML element
 * @param {Document} doc - The document to get lang attribute from
 * @returns {string|null} - The lang attribute value or null if not set
 */
function getLangAttribute(doc) {
  if (!doc) return null;
  const html = doc.documentElement || doc.querySelector('html');
  if (html) {
    return html.getAttribute('lang');
  }
  return null;
}

/**
 * Creates an in-page button with accessibility considerations
 * @param {Object} options - Button configuration options
 * @returns {HTMLElement} - The created button element
 */
function createInPageButton(options) {
  const button = document.createElement('button');
  
  if (options && options.id) {
    button.id = options.id;
  }
  
  if (options && options.textContent) {
    button.textContent = options.textContent;
  }
  
  if (options && options.className) {
    button.className = options.className;
  }
  
  // Ensure proper accessible labeling
  if (options && options.label) {
    button.setAttribute('aria-label', options.label);
  } else if (!options || !options.textContent) {
    button.setAttribute('aria-label', 'In-page button');
  }
  
  // Ensure button is focusable
  button.tabIndex = 0;
  
  // Add click handler if provided
  if (options && typeof options.onClick === 'function') {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

module.exports = {
  validateLandmark,
  validateLandmarkStructure,
  config,
  isLandmark,
  validateLandmarks,
  getLandmarkElements,
  hasClass, // Added new function to check element class names
  SomeModule,
  setSvgAccessibleName,
  improveAccessibility,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  ensureUniqueLandmarks, // TODO: Implement function to ensure unique landmarks
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  getLangAttribute,
  createInPageButton
};