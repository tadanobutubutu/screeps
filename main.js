// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: b8ad7986d07c9a084d54347d2b890045530741c8_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

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
    if (svg && svg.querySelector) {
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
    if (el && el.tagName) {
      el.setAttribute('role', 'region');
    }
  });
}

// Accessibility issue remediation functions

/**
 * REACT_015: Adds lang attribute to HTML element
 * @param {Document} doc - The document to add lang attribute to
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {boolean} - True if lang attribute was added successfully
 */
function addLangToHtmlElement(doc, lang) {
  if (!doc || !doc.documentElement) {
    return false;
  }
  
  const htmlElement = doc.documentElement;
  const validLang = lang && typeof lang === 'string' && lang.length > 0 ? lang : 'en';
  
  htmlElement.setAttribute('lang', validLang);
  return true;
}

/**
 * REACT_027: Adds scope="col" or scope="row" to <th> elements in tables
 * @param {HTMLElement|Document} container - The container or document to search in
 * @returns {Object} - Results of the scope addition operation
 */
function addScopeToTableHeaders(container) {
  const results = {
    totalHeaders: 0,
    headersUpdated: 0,
    errors: []
  };

  const target = container && container.querySelectorAll ? container : document;
  const thElements = target.querySelectorAll('th');

  if (!thElements || thElements.length === 0) {
    results.errors.push('No <th> elements found');
    return results;
  }

  thElements.forEach(th => {
    results.totalHeaders++;
    
    // Skip if already has scope attribute
    if (th.hasAttribute('scope')) {
      return;
    }

    // Determine if this is a column header or row header
    const parent = th.parentElement;
    if (!parent) return;

    const parentTagName = parent.tagName ? parent.tagName.toUpperCase() : '';
    
    if (parentTagName === 'TR') {
      // Check if this is in the first column (row header) or other columns (column header)
      const siblings = Array.from(parent.querySelectorAll('th'));
      const index = siblings.indexOf(th);
      
      if (index === 0) {
        // First cell in row is typically a row header
        th.setAttribute('scope', 'row');
        results.headersUpdated++;
      } else {
        // Other cells in row are column headers
        th.setAttribute('scope', 'col');
        results.headersUpdated++;
      }
    }
  });

  return results;
}

/**
 * REACT_036: Fixes fake links - elements that look like links but lack href
 * A fake link is typically a link element without href, or an element with role="link" but no accessible action
 * @param {HTMLElement|Document} container - The container or document to search in
 * @param {boolean} addHref - Whether to add href="#" as a fallback
 * @returns {Object} - Results of the fake link fixes
 */
function fixFakeLinks(container, addHref) {
  const results = {
    fakeLinksFound: 0,
    fakeLinksFixed: 0,
    elements: []
  };

  const target = container && container.querySelectorAll ? container : document;
  
  // Find anchor elements without href
  const anchorsWithoutHref = target.querySelectorAll('a:not([href])');
  anchorsWithoutHref.forEach(el => {
    results.fakeLinksFound++;
    results.elements.push({
      element: el,
      type: 'anchor_without_href',
      tagName: el.tagName
    });

    if (addHref) {
      el.setAttribute('href', '#');
      results.fakeLinksFixed++;
    }
  });

  // Find elements with role="link" but no accessible name
  const roleLinks = target.querySelectorAll('[role="link"]');
  roleLinks.forEach(el => {
    const hasAccessibleName = el.getAttribute('aria-label') || 
                              el.getAttribute('aria-labelledby') || 
                              el.textContent.trim();
    
    if (!hasAccessibleName) {
      results.fakeLinksFound++;
      results.elements.push({
        element: el,
        type: 'role_link_without_name',
        tagName: el.tagName
      });
    }
  });

  return results;
}

/**
 * REACT_041: Adds accessible names to SVGs that are missing them
 * @param {HTMLElement|Document} container - The container or document to search in
 * @returns {Object} - Results of the SVG accessibility fixes
 */
function addAccessibleNamesToSvgs(container) {
  const results = {
    totalSvgs: 0,
    svgsUpdated: 0,
    errors: []
  };

  const target = container && container.querySelectorAll ? container : document;
  const svgs = target.querySelectorAll('svg');

  if (!svgs || svgs.length === 0) {
    results.errors.push('No SVG elements found');
    return results;
  }

  svgs.forEach(svg => {
    results.totalSvgs++;
    
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title');

    if (!hasAriaLabel && !hasAriaLabelledby) {
      if (hasTitle) {
        // If there's a title, link to it via aria-labelledby
        const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
        hasTitle.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
        results.svgsUpdated++;
      } else {
        // Add a generic accessible name based on id or class
        const accessibleName = svg.id || svg.getAttribute('class') || 'svg-image';
        svg.setAttribute('aria-label', accessibleName);
        results.svgsUpdated++;
      }
    }
  });

  return results;
}

/**
 * REACT_017: Fixes landmark issues by adding proper labels and roles
 * @param {HTMLElement|Document} container - The container or document to search in
 * @returns {Object} - Results of the landmark fixes
 */
function fixLandmarkIssues(container) {
  const results = {
    landmarksFixed: 0,
    errors: [],
    details: []
  };

  const target = container && container.querySelectorAll ? container : document;
  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  const selector = landmarkTags.join(', ');
  const landmarks = target.querySelectorAll(selector);

  landmarks.forEach(landmark => {
    const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';
    const needsLabel = !landmark.getAttribute('aria-label') && 
                       !landmark.getAttribute('aria-labelledby') &&
                       !landmark.id;

    if (needsLabel) {
      // Add aria-label based on landmark type
      const label = tagName.charAt(0).toUpperCase() + tagName.slice(1) + ' landmark';
      landmark.setAttribute('aria-label', landmark.id || label);
      results.landmarksFixed++;
      results.details.push({
        tag: tagName,
        action: 'added_aria_label',
        value: landmark.id || label
      });
    }

    // Fix semantic landmark issues
    if (tagName === 'section' || tagName === 'article') {
      if (!landmark.id && !landmark.getAttribute('aria-label')) {
        const regionId = 'region-' + Math.random().toString(36).substr(2, 9);
        landmark.id = regionId;
        landmark.setAttribute('aria-label', tagName + ' region');
        results.landmarksFixed++;
        results.details.push({
          tag: tagName,
          action: 'added_id_and_label',
          value: regionId
        });
      }
    }
  });

  return results;
}

/**
 * REACT_025: Ensures all landmarks have unique identifiers
 * @param {HTMLElement|Document} container - The container or document to search in
 * @returns {Object} - Results of the uniqueness check
 */
function ensureAllLandmarksUnique(container) {
  const results = {
    totalLandmarks: 0,
    duplicatesFound: 0,
    duplicatesFixed: 0,
    details: []
  };

  const target = container && container.querySelectorAll ? container : document;
  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  const selector = landmarkTags.join(', ');
  const landmarks = target.querySelectorAll(selector);
  
  const idCount = {};

  // First pass: count occurrences of each id
  landmarks.forEach(landmark => {
    results.totalLandmarks++;
    if (landmark.id) {
      idCount[landmark.id] = idCount[landmark.id] || 0;
      idCount[landmark.id]++;
    }
  });

  // Second pass: fix duplicates
  landmarks.forEach(landmark => {
    if (landmark.id && idCount[landmark.id] > 1) {
      results.duplicatesFound++;
      const newId = landmark.id + '-' + Math.random().toString(36).substr(2, 9);
      landmark.id = newId;
      results.duplicatesFixed++;
      results.details.push({
        action: 'renamed_duplicate_id',
        oldId: landmark.id,
        newId: newId
      });
    }
  });

  return results;
}

/**
 * Comprehensive function to address all accessibility issues from insight report
 * @param {Document} doc - The document to fix
 * @param {Object} insightReport - The insight report with issues
 * @returns {Object} - Summary of all fixes applied
 */
function addressAllAccessibilityIssues(doc, insightReport) {
  const summary = {
    issuesAddressed: [],
    results: {}
  };

  if (!doc) {
    summary.error = 'Document is required';
    return summary;
  }

  // REACT_015: Add lang attribute to HTML element
  const langCode = (insightReport && insightReport.lang) ? insightReport.lang : 'en';
  const langResult = addLangToHtmlElement(doc, langCode);
  summary.results['REACT_015'] = langResult;
  if (langResult) {
    summary.issuesAddressed.push('REACT_015');
  }

  // REACT_017: Add/fix landmark issues
  summary.results['REACT_017'] = fixLandmarkIssues(doc);
  summary.issuesAddressed.push('REACT_017');

  // REACT_041: Add accessible names to SVGs
  summary.results['REACT_041'] = addAccessibleNamesToSvgs(doc);
  summary.issuesAddressed.push('REACT_041');

  // REACT_025: Ensure unique landmarks
  summary.results['REACT_025'] = ensureAllLandmarksUnique(doc);
  summary.issuesAddressed.push('REACT_025');

  // REACT_036: Fix fake link issues
  summary.results['REACT_036'] = fixFakeLinks(doc, true);
  summary.issuesAddressed.push('REACT_036');

  // REACT_027: Add scope to table headers
  summary.results['REACT_027'] = addScopeToTableHeaders(doc);
  summary.issuesAddressed.push('REACT_027');

  return summary;
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
  addLangToHtmlElement,
  addScopeToTableHeaders,
  fixFakeLinks,
  addAccessibleNamesToSvgs,
  fixLandmarkIssues,
  ensureAllLandmarksUnique,
  addressAllAccessibilityIssues
};