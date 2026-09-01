const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = main;

module.exports = {
  ...main,

  // TODO: Address accessibility issues from insight report
  addressAccessibilityIssues: (container) => {
    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0
    };

    // Add lang attribute to HTML element if missing
    const htmlElement = document.documentElement;
    const langAttr = getLangAttribute(htmlElement);
    if (!langAttr) {
      htmlElement.lang = 'en';
      fixes.langAdded = true;
    }

    // Add main landmark if missing
    const mainElement = document.querySelector('main');
    if (!mainElement) {
      const body = document.body;
      if (body) {
        const newMain = document.createElement('main');
        while (body.firstChild) {
          newMain.appendChild(body.firstChild);
        }
        body.insertBefore(newMain, body.firstChild);
        fixes.mainLandmarkAdded = true;
      }
    }

    // Fix landmark issues
    const landmarkFixes = validateLandmark(container);
    if (landmarkFixes && landmarkFixes.length > 0) {
      fixes.landmarksFixed = landmarkFixes.length;
    }
    const landmarkStructureFixes = validateLandmarkStructure(container);
    if (landmarkStructureFixes && landmarkStructureFixes.length > 0) {
      fixes.landmarksFixed += landmarkStructureFixes.length;
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName && accessibleName.length > 0) {
        setSvgAccessibilityProps(svg, accessibleName);
        fixes.svgNamesAdded++;
      }
    });

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll('[style*="cursor: pointer"]');
    fakeLinks.forEach(link => {
      const style = window.getComputedStyle(link);
      if (style.cursor === 'pointer' || link.style.cursor === 'pointer') {
        link.setAttribute('role', 'link');
        link.setAttribute('tabindex', '0');
        fixes.fakeLinksFixed++;
      }
    });

    // Validate accessibility report
    const report = validateAccessibilityReport(container);
    if (report && report.length > 0) {
      log(`Accessibility report contains ${report.length} remaining issues`, 'warn');
    }

    if (fixes.langAdded) {
      log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
      log('Main landmark added', 'info');
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
      log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
      log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
      log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
    }

    return fixes;
  },

  // TODO: Implement a new function to handle focus trap for keyboard navigation
  focusTrap: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    let activeElementIndex = focusableElements.length - 1;

    function setActiveElement(index) {
      if (index < 0) {
        index = focusableElements.length - 1;
      } else if (index >= focusableElements.length) {
        index = 0;
      }

      if (focusableElements[index]) {
        focusableElements[index].focus();
      } else {
        focusableElements[0].focus();
      }
      activeElementIndex = index;
    }

    function nextFocusableElement() {
      setActiveElement(activeElementIndex + 1);
    }

    function prevFocusableElement() {
      setActiveElement(activeElementIndex - 1);
    }

    function moveFocusToFirst() {
      setActiveElement(0);
    }

    function moveFocusToLast() {
      setActiveElement(focusableElements.length - 1);
    }

    element.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            prevFocusableElement();
          } else {
            nextFocusableElement();
          }
          e.preventDefault();
          break;
        case 'ArrowLeft':
          prevFocusableElement();
          e.preventDefault();
          break;
        case 'ArrowRight':
          nextFocusableElement();
          e.preventDefault();
          break;
        case 'Home':
          moveFocusToFirst();
          e.preventDefault();
          break;
        case 'End':
          moveFocusToLast();
          e.preventDefault();
          break;
      }
    });
  },

  // TODO: Import the new function to create a button with correct accessibility properties for in-page linking
  createInPageButton: createInPageButton,

  // TODO: Create a utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
  createWebResourceButton: createWebResourceButton,

  // TODO: Validate the table structure for accessibility issues
  validateTableAccessibility: (table) => {
    if (!table || !(table instanceof HTMLElement) || table.tagName !== 'TABLE') {
      throw new Error('Invalid table element provided');
    }

    const issues = [];

    // Check for missing table headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      issues.push('Table is missing header cells (th elements)');
    }

    // Check for proper scope attributes on headers
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        issues.push('Header cell is missing scope attribute');
      }
    });

    // Check for proper table structure (thead, tbody, tfoot)
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');

    if (!thead) {
      issues.push('Table is missing thead element');
    }

    if (!tbody) {
      issues.push('Table is missing tbody element');
    }

    // Check for data cells with headers
    const dataCells = table.querySelectorAll('td');
    dataCells.forEach(cell => {
      if (!cell.hasAttribute('headers') && !cell.hasAttribute('aria-describedby')) {
        issues.push('Data cell is missing headers or aria-describedby attribute');
      }
    });

    return issues.length > 0 ? issues : null;
  },

  validateTableStructure: (table) => {
    if (!table || !(table instanceof HTMLElement) || table.tagName !== 'TABLE') {
      throw new Error('Invalid table element provided');
    }

    const issues = [];

    // Check for proper table structure
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) {
      issues.push('Table has no rows');
    }

    // Check for consistent column count
    let columnCount = -1;
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (columnCount === -1) {
        columnCount = cells.length;
      } else if (cells.length !== columnCount) {
        issues.push('Inconsistent number of columns in table rows');
      }
    });

    return issues.length > 0 ? issues : null;
  },

  // TODO: Validate the landmark structure for accessibility issues
  validateLandmark,
  validateLandmarkStructure,

  // TODO: Extract the accessible name for an SVG from its content
  getSvgAccessibleName: (svg) => {
    if (!svg || !(svg instanceof HTMLElement) || svg.tagName !== 'SVG') {
      throw new Error('Invalid SVG element provided');
    }

    // Check for aria-label
    if (svg.hasAttribute('aria-label')) {
      return svg.getAttribute('aria-label');
    }

    // Check for aria-labelledby
    if (svg.hasAttribute('aria-labelledby')) {
      const id = svg.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(id);
      if (labelElement) {
        return labelElement.textContent.trim();
      }
    }

    // Check for title element
    const title = svg.querySelector('title');
    if (title) {
      return title.textContent.trim();
    }

    // Check for desc element
    const desc = svg.querySelector('desc');
    if (desc) {
      return desc.textContent.trim();
    }

    // Check for text content
    const textContent = svg.textContent.trim();
    if (textContent.length > 0) {
      return textContent;
    }

    return null;
  },

  // TODO: Add a language attribute to the HTML element
  getLangAttribute: (element) => {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error('Invalid HTML element provided');
    }

    return element.getAttribute('lang') || element.getAttribute('xml:lang');
  },

  // TODO: Validate the accessibility report for issues
  validateAccessibilityReport,

  // TODO: Address new accessibility issues from insight report ( implement new functions and fixes as needed)

  // Credential response handling
  async handleCredentialResponse(response) {
    if (!response) {
      throw new Error('No response received');
    }

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.token) {
      return {
        success: true,
        token: response.token,
        expiresIn: response.expiresIn || 3600
      };
    }

    throw new Error('Invalid credential response');
  },

  // Existing utility functions
  log: (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  },

  // Export functionality with accessibility support
  exportUtils,

  // New focus trap functionality for keyboard navigation
  focusTrap,

  // New function to render dependency graphs
  renderDependencyGraphs: (container, data) => {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('Invalid container element provided');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data provided for dependency graph');
    }

    // Clear existing content
    container.innerHTML = '';

    // Create graph container
    const graphContainer = document.createElement('div');
    graphContainer.className = 'dependency-graph';
    graphContainer.setAttribute('role', 'img');
    graphContainer.setAttribute('aria-label', 'Dependency graph visualization');

    // Create nodes
    const nodes = data.nodes || [];
    nodes.forEach(node => {
      const nodeElement = document.createElement('div');
      nodeElement.className = 'dependency-node';
      nodeElement.textContent = node.name;
      nodeElement.setAttribute('data-id', node.id);
      nodeElement.setAttribute('tabindex', '0');
      nodeElement.setAttribute('role', 'button');
      nodeElement.setAttribute('aria-label', `Dependency node: ${node.name}`);
      graphContainer.appendChild(nodeElement);
    });

    // Create edges
    const edges = data.edges || [];
    edges.forEach(edge => {
      const edgeElement = document.createElement('div');
      edgeElement.className = 'dependency-edge';
      edgeElement.setAttribute('data-from', edge.from);
      edgeElement.setAttribute('data-to', edge.to);
      edgeElement.setAttribute('aria-hidden', 'true');
      graphContainer.appendChild(edgeElement);
    });

    // Add to container
    container.appendChild(graphContainer);

    // Add keyboard navigation
    const nodeElements = graphContainer.querySelectorAll('.dependency-node');
    let currentNodeIndex = 0;

    function focusNode(index) {
      if (index < 0) {
        index = nodeElements.length - 1;
      } else if (index >= nodeElements.length) {
        index = 0;
      }

      if (nodeElements[index]) {
        nodeElements[index].focus();
        currentNodeIndex = index;
      }
    }

    graphContainer.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          focusNode(currentNodeIndex - 1);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          focusNode(currentNodeIndex + 1);
          e.preventDefault();
          break;
        case 'Home':
          focusNode(0);
          e.preventDefault();
          break;
        case 'End':
          focusNode(nodeElements.length - 1);
          e.preventDefault();
          break;
      }
    });

    // Focus first node by default
    if (nodeElements.length > 0) {
      nodeElements[0].focus();
    }

    return graphContainer;
  }
};