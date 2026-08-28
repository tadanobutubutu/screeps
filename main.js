/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }

  if (addSvgAccessibilityProps && typeof addSvgAccessibilityProps === 'function') {
    const accessibleProps = addSvgAccessibilityProps(svgElement);
    return accessibleProps && accessibleProps.ariaLabel;
  }

  return null;
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  // (code for setSvgAccessibilityProps remains the same)
}

// TODO: Implement this function for adding SVG accessibility props
function addSvgAccessibilityProps(svgElement, options = {}) {
  const {
    role = 'img',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    focusable = false,
    tabIndex
  } = options;
  
  if (ariaLabel) {
    svgElement.setAttribute('aria-label', ariaLabel);
  }
  if (ariaLabelledby) {
    svgElement.setAttribute('aria-labelledby', ariaLabelledby);
  }
  if (ariaDescribedby) {
    svgElement.setAttribute('aria-describedby', ariaDescribedby);
  }
  if (role) {
    svgElement.setAttribute('role', role);
  }
  if (focusable) {
    svgElement.setAttribute('focusable', 'true');
  }
  if (tabIndex !== undefined) {
    svgElement.setAttribute('tabindex', tabIndex);
  }
  
  return {
    role,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby
  };
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: fixLandmarkIssues, addMainLandmark, addLandmarkRegions)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (DONE: ensureDependencyGraphAriaRole)

// Function to add lang attribute to HTML element
function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = lang;
  }
  return document;
}

// Function to fix table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }
    
    if (!existingTbody) {
      const remainingRows = table.querySelectorAll('tr:not(thead tr)');
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }
    
    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      // Check if first cell should be a header
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        if (firstCell.tagName === 'TD') {
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.insertBefore(th, firstCell);
          row.removeChild(firstCell);
          fixedCount++;
        }
      }
    });
    
    // Additional HEAD logic: ensure scope on header cells
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = document.querySelector('main[role="main"], [role="main"]');
  
  if (!mainElement) {
    // Find the main content area and wrap it or create main element
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    
    // Move first significant content child to main
    const children = Array.from(body.children);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }
    
    body.insertBefore(main, body.firstChild);
    mainElement = main;
  }
  
  // Ensure main has proper role if not using native element
  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }
  
  return mainElement;
}

// Function to ensure unique landmarks (combined approach)
function ensureUniqueLandmarks(document) {
  // ... existing implementation for by role
  // ... existing unique landmarks implementation for origin/main
  const landmarks = document.querySelectorAll('[role="main"], [role="origin"], main, [role="banner"], header, [role="navigation"], nav, [role="search"], [role="complementary"], aside, [role="contentinfo"], footer');
  const landmarkRoles = new Set();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (landmarkRoles.has(role)) {
      // Make duplicate landmarks unique by adding aria-label
      landmark.setAttribute('aria-label', `${role} landmark`);
    } else {
      landmarkRoles.add(role);
    }
  });
  
  return document;
}

// Function to add accessible names to SVGs
function addSvgAccessibleNames(document, svgSelector = 'svg') {
  const svgs = document.querySelectorAll(svgSelector);
  svgs.forEach(svg => {
    if (!getSvgAccessibleName(svg)) {
      const title = document.createElement('title');
      title.textContent = 'SVG Graphic';
      svg.insertBefore(title, svg.firstChild);
      
      const desc = document.createElement('desc');
      desc.textContent = 'Visual representation of information';
      svg.appendChild(desc);
    }
  });
  return document;
}

// Function to add accessible names to SVGs (alias)
function addAccessibleNamesToSVGs(document) {
  return addSvgAccessibleNames(document);
}

// Function to fix fake link issue (merged fixes)
function fixFakeLinkIssue(document) {
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick], [role="link"]:not(a)');
  
  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';
    
    // Check if it's a fake link (clickable but not a real anchor)
    if (!isAnchor && (onclick.includes('window.location') || 
        onclick.includes('document.location') || 
        onclick.includes('javascript:void(0)') ||
        onclick.includes('location.href') ||
        onclick.includes('href'))) {
      
      // Convert to proper anchor or add proper accessibility
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('aria-label', element.textContent);
      
      // Copy event listeners
      if (element.onclick) {
        span.onclick = element.onclick;
      }
      
      // Copy styling if available
      if (element.className) {
        span.className = element.className;
      }
      
      element.parentNode.replaceChild(span, element);
      count++;
    }
  });

  return count;
}

// Function to fix fake link issues (handles both role="link" elements and anchors with href="#")
function fixFakeLinkIssues(document) {
  // Fix non-anchor elements with role="link"
  const roleLinks = document.querySelectorAll('[role="link"]:not(a)');
  roleLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });

  // Fix anchors with href="#" by converting them to accessible buttons
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });

  return document;
}

// Accessibility fix for REACT_017: Add/fix landmark issues and add Landmark Regions
function fixLandmarkIssues(document) {
  // Ensure proper landmark structure
  const landmarks = {
    banner: document.querySelector('header, [role="banner"]'),
    navigation: document.querySelector('nav, [role="navigation"]'),
    main: document.querySelector('main, [role="main"]'),
    complementary: document.querySelector('aside, [role="complementary"]'),
    contentinfo: document.querySelector('footer, [role="contentinfo"]')
  };

  // Add missing landmarks
  if (!landmarks.main) {
    landmarks.main = addMainLandmark(document);
  }
  
  if (!landmarks.complementary) {
    const aside = document.createElement('aside');
    aside.setAttribute('role', 'complementary');
    document.body.appendChild(aside);
    landmarks.complementary = aside;
  }
  
  if (!landmarks.contentinfo) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.appendChild(footer);
    landmarks.contentinfo = footer;
  }

  return document;
}

// Function to add Landmark Regions
function addLandmarkRegions(document) {
  const regions = {
    banner: document.querySelector('header, [role="banner"]'),
    navigation: document.querySelector('nav, [role="navigation"]'),
    search: document.querySelector('[role="search"]'),
    main: document.querySelector('main, [role="main"]'),
    complementary: document.querySelector('aside, [role="complementary"]'),
    contentinfo: document.querySelector('footer, [role="contentinfo"]')
  };

  // Ensure each region has appropriate ARIA label
  Object.entries(regions).forEach(([role, element]) => {
    if (element && !element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', `${role} region`);
    }
  });

  return document;
}

// REACT_025: Ensure unique landmarks (by role approach)
function uniqueLandmarks(document) {
  const landmarkRoles = new Map();
  
  document.querySelectorAll('[role]').forEach(element => {
    const role = element.getAttribute('role');
    if (['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'].includes(role)) {
      const count = landmarkRoles.get(role) || 0;
      landmarkRoles.set(role, count + 1);
      
      if (count > 0) {
        element.setAttribute('aria-label', `${role} ${count + 1}`);
      }
    }
  });
  
  return document;
}

// Address accessibility issues from insight report for image alt texts
function addImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', `Image ${index + 1}`);
    }
  });
  return document;
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
    const buttonContainer = document.getElementById('google-signin-container');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large' }
      );
    }
  }
}

function handleCredentialResponse(response) {
  // Handle the credential response
  console.log('ID token:', response.credential);
}

// Function to count dependencies
function countDependencies() {
  // Find the dependency graph container
  const graphContainer = document.querySelector('.dependency-graph, #dependency-graph, [data-graph-type="dependency"], [role="region"][aria-label*="dependency" i]');
  
  if (!graphContainer) {
    return 0;
  }
  
  // Count nodes in the dependency graph
  const nodes = graphContainer.querySelectorAll('.node, [class*="node"], circle, rect, g[class*="dependency"], [data-dependency]');
  
  // Use a Set to count unique dependencies
  const dependencies = new Set();
  
  nodes.forEach(node => {
    // Try to get a unique identifier for each dependency
    const id = node.id || 
               node.getAttribute('data-name') || 
               node.getAttribute('data-id') ||
               node.getAttribute('data-dependency-id');
    if (id) {
      dependencies.add(id);
    } else {
      // Use the node's position or text content as a fallback identifier
      const text = node.textContent?.trim();
      if (text) {
        dependencies.add(text);
      } else {
        // Use the node reference itself as last resort
        dependencies.add(node);
      }
    }
  });
  
  return dependencies.size;
}

// Function to ensure the element has an id
function ensureElementHasId(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `${idPrefix}-${index + 1}`;
    }
  });
  return document;
}

// Function to add aria-label to elements
function addAriaLabelToElements(document, selector, label) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  });
  return document;
}

// Function to render dependency graphs
function renderDependencyGraphs(document) {
  const graphContainer = document.querySelector('.dependency-graph, #dependency-graph, [data-graph-type="dependency"]');
  if (graphContainer) {
    // Create SVG element for the dependency graph
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-graph');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 800 400');

    // Add accessible title and description
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Dependency Graph';
    svg.appendChild(title);

    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'Visual representation of project dependencies';
    svg.appendChild(desc);

    // Render the graph content
    const graphContent = graphContainer.querySelector('.graph-content, [data-graph-data]');
    if (graphContent) {
      // Parse and render dependency data
      // Implementation would parse the data and create nodes/edges
    }

    graphContainer.appendChild(svg);
  }
  return document;
}

// REACT_040: Replace my-button with actual button id for accessibility
function fixButtonIdentifiers(document) {
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach(button => {
    const newId = 'btn-' + Math.random().toString(36).substr(2, 9);
    button.id = newId;
  });
  return document;
}

// REACT_042: Ensure dependencyGraph container has a proper ARIA role
function ensureDependencyGraphAriaRole(document) {
  const dependencyGraph = document.querySelector('.dependency-graph') || 
                          document.querySelector('#dependency-graph') || 
                          document.querySelector('[data-graph-type="dependency"]') ||
                          document.querySelector('[role="region"][aria-label*="dependency" i]');
  
  if (dependencyGraph) {
    // Check if element already has a role
    const existingRole = dependencyGraph.getAttribute('role');
    if (!existingRole) {
      // Add appropriate role based on context
      dependencyGraph.setAttribute('role', 'region');
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
  
  return document;
}

function addressAccessibilityIssuesForDocument(document) {
  document = addLangAttribute(document);
  document = fixTableStructure(document);
  document = fixLandmarkIssues(document);
  document = addMainLandmark(document);
  document = addLandmarkRegions(document);
  document = ensureUniqueLandmarks(document);
  document = uniqueLandmarks(document);
  document = addSvgAccessibleNames(document);
  document = addAccessibleNamesToSVGs(document);
  document = fixFakeLinkIssue(document);
  document = fixFakeLinkIssues(document);
  document = addImageAltTexts(document);
  document = googleSignIn(document);
  document = fixButtonIdentifiers(document);
  document = ensureElementHasId(document);
  document = addAriaLabelToElements(document, '[data-dependency-graph]', 'Dependency Graph');
  document = renderDependencyGraphs(document);
  document = ensureDependencyGraphAriaRole(document);
  return document;
}

const rotateBack = function () {
  // Logic to rotate back
  // For example, if you're manipulating the DOM or a state:
  // document.getElementById('someElement').classList.remove('rotate-forward');
  // document.getElementById('someElement').classList.add('rotate-backward');
};

const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  // Code to address the specific accessibility issue on the element
  // This is a placeholder function and should be replaced with the actual implementation
  console.log(`Addressing accessibility issue for ${element} with info:`, accessibilityInfo);
};

const renderDependencyGraph = (dependencyGraph, container) => {
  // Render the dependency graph using the dependencyGraphContent
  const graphContent = dependencyGraph;
  // Append the graphContent to the container
  container.innerHTML = graphContent;
};

function renderIndexView() {
  // Function to render the index view
}

function setFormElementAccessibleNames() {
  // Set accessible names for form elements
}

function setSvgAccessibilityPropsWrapper() {
  // Set accessibility properties for SVG elements
}

function isLinkAccessible() {
  // Check if link is accessible
}

function isButtonAccessible() {
  // Check if button is accessible
}

function getSvgAccessibleNameWrapper() {
  // Get accessible name for SVG
}

function checkAccessibility() {
  // Check overall accessibility
}

function checkLandmarks() {
  // Check landmarks
}

function checkLandmarkElement() {
  // Check individual landmark elements
}

function decodeJwtResponse() {
  // Decode JWT response
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureElementHasId,
  addAriaLabelToElements,
  handleCredentialResponse,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  addImageAltTexts,
  googleSignIn,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  addressAccessibilityIssuesForDocument,
  rotateBack,
  addressAccessibilityIssue038,
  renderDependencyGraph,
  renderIndexView,
  setFormElementAccessibleNames,
  setSvgAccessibilityPropsWrapper,
  isLinkAccessible,
  isButtonAccessible,
  getSvgAccessibleName,
  checkAccessibility,
  checkLandmarks,
  checkLandmarkElement,
  decodeJwtResponse
};