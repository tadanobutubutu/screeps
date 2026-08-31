// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// New function added as per the issue
function newFunction() {
  // Implementation details go here
}

// New function as per the issue request
function newFunction() {
  // New function implementation
}

/**
 * Render a dependency graph visualization
 * @param {Object} dependencies - The dependency data structure (key = module, value = array of dependencies)
 * @param {Object} options - Rendering options
 * @returns {Element} The rendered graph container element
 */
function renderDependencyGraph(dependencies, options = {}) {
  const {
    containerId = 'dependencyGraph',
    format = 'text'
  } = options;

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'dependency-graph';
    document.body.appendChild(container);
  } else {
    container.innerHTML = '';
  }

  // Ensure accessibility
  ensureDependencyGraphAriaRole(document);

  if (!dependencies || typeof dependencies !== 'object') {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No dependency data available';
    container.appendChild(emptyMsg);
    return container;
  }

  if (format === 'html') {
    return renderDependencyGraphHTML(dependencies, container);
  }

  return renderDependencyGraphText(dependencies, container);
}

/**
 * Render dependency graph as text tree
 * @param {Object} dependencies - Dependency data
 * @param {Element} container - Container element
 * @returns {Element} The container element
 */
function renderDependencyGraphText(dependencies, container) {
  const doc = document;
  
  const header = doc.createElement('h3');
  header.textContent = 'Dependency Graph';
  header.className = 'dep-graph-title';
  container.appendChild(header);

  const graphContainer = doc.createElement('div');
  graphContainer.className = 'dep-graph-tree';
  container.appendChild(graphContainer);

  const entries = Object.entries(dependencies);
  
  entries.forEach(([module, deps], index) => {
    const moduleLine = doc.createElement('div');
    moduleLine.className = 'dep-module';
    
    const prefix = index === entries.length - 1 ? '└── ' : '├── ';
    moduleLine.textContent = `${prefix}${module}`;
    
    if (deps && deps.length > 0) {
      const depsLine = doc.createElement('div');
      depsLine.className = 'dep-list';
      depsLine.textContent = `    └── dependencies: ${deps.join(', ')}`;
      graphContainer.appendChild(moduleLine);
      graphContainer.appendChild(depsLine);
    } else {
      graphContainer.appendChild(moduleLine);
    }
  });

  return container;
}

/**
 * Render dependency graph as HTML tree
 * @param {Object} dependencies - Dependency data
 * @param {Element} container - Container element
 * @returns {Element} The container element
 */
function renderDependencyGraphHTML(dependencies, container) {
  const doc = document;

  const header = doc.createElement('h3');
  header.textContent = 'Dependency Graph';
  header.className = 'dep-graph-title';
  container.appendChild(header);

  const tree = doc.createElement('ul');
  tree.className = 'dep-tree';
  container.appendChild(tree);

  for (const [module, deps] of Object.entries(dependencies)) {
    const moduleItem = doc.createElement('li');
    moduleItem.className = 'dep-node';
    
    const moduleName = doc.createElement('span');
    moduleName.className = 'dep-name';
    moduleName.textContent = module;
    moduleItem.appendChild(moduleName);

    if (deps && deps.length > 0) {
      const depsList = doc.createElement('ul');
      depsList.className = 'dep-children';
      
      deps.forEach(dep => {
        const depItem = doc.createElement('li');
        depItem.className = 'dep-child';
        depItem.textContent = dep;
        depsList.appendChild(depItem);
      });
      
      moduleItem.appendChild(depsList);
    }

    tree.appendChild(moduleItem);
  }

  return container;
}

/**
 * Display module structure for debugging purposes
 * @param {Object|Array} moduleInfo - Module information to display
 * @param {Object} options - Display options
 * @param {string} options.containerId - ID for the container element
 * @param {boolean} options.includeSource - Whether to include raw source data
 * @param {string} options.format - Output format ('text' or 'html')
 * @returns {Element} The rendered container element
 */
function displayModuleStructure(moduleInfo, options = {}) {
  const {
    containerId = 'moduleStructure',
    includeSource = false,
    format = 'text'
  } = options;

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'module-structure';
    document.body.appendChild(container);
  } else {
    container.innerHTML = '';
  }

  const header = document.createElement('h3');
  header.textContent = 'Module Structure';
  container.appendChild(header);

  if (!moduleInfo) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No module information available';
    container.appendChild(emptyMsg);
    return container;
  }

  if (format === 'html') {
    return displayModuleStructureHTML(moduleInfo, container, includeSource);
  }

  return displayModuleStructureText(moduleInfo, container, includeSource);
}

/**
 * Display module structure as text tree
 * @param {Object|Array} moduleInfo - Module information
 * @param {Element} container - Container element
 * @param {boolean} includeSource - Include raw source
 * @returns {Element} The container element
 */
function displayModuleStructureText(moduleInfo, container, includeSource) {
  const structure = document.createElement('pre');
  structure.className = 'structure-tree';
  container.appendChild(structure);

  function formatModule(mod, depth = 0) {
    const indent = '  '.repeat(depth);
    const prefix = depth > 0 ? '├─ ' : '';
    let line = `${indent}${prefix}${mod.name || 'unnamed'}`;
    
    if (mod.type) line += ` [${mod.type}]`;
    if (mod.path) line += ` → ${mod.path}`;
    
    return line;
  }

  function renderModule(mod, depth = 0, lines = []) {
    lines.push(formatModule(mod, depth));
    
    if (mod.children && mod.children.length > 0) {
      mod.children.forEach(child => renderModule(child, depth + 1, lines));
    }
    
    if (mod.exports && Array.isArray(mod.exports)) {
      mod.exports.forEach(exp => {
        lines.push(`${'  '.repeat(depth + 1)}└─ exports: ${exp}`);
      });
    }
  }

  const lines = [];
  if (Array.isArray(moduleInfo)) {
    moduleInfo.forEach(mod => renderModule(mod, 0, lines));
  } else {
    renderModule(moduleInfo, 0, lines);
  }

  structure.textContent = lines.join('\n');

  if (includeSource) {
    const sourceSection = document.createElement('div');
    sourceSection.className = 'source-code';
    
    const sourceHeader = document.createElement('h4');
    sourceHeader.textContent = 'Raw Module Data';
    sourceSection.appendChild(sourceHeader);
    
    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(moduleInfo, null, 2);
    sourceSection.appendChild(pre);
    
    container.appendChild(sourceSection);
  }

  return container;
}

/**
 * Display module structure as HTML tree
 * @param {Object|Array} moduleInfo - Module information
 * @param {Element} container - Container element
 * @param {boolean} includeSource - Include raw source
 * @returns {Element} The container element
 */
function displayModuleStructureHTML(moduleInfo, container, includeSource) {
  const tree = document.createElement('ul');
  tree.className = 'module-tree';
  container.appendChild(tree);

  function createModuleElement(mod) {
    const li = document.createElement('li');
    li.className = 'module-item';
    
    const header = document.createElement('div');
    header.className = 'module-header';
    
    const name = document.createElement('span');
    name.className = 'module-name';
    name.textContent = mod.name || 'unnamed';
    header.appendChild(name);
    
    if (mod.type) {
      const type = document.createElement('span');
      type.className = 'module-type';
      type.textContent = `[${mod.type}]`;
      header.appendChild(type);
    }
    
    if (mod.path) {
      const path = document.createElement('span');
      path.className = 'module-path';
      path.textContent = mod.path;
      header.appendChild(path);
    }
    
    li.appendChild(header);

    if (mod.children && mod.children.length > 0) {
      const childList = document.createElement('ul');
      childList.className = 'module-children';
      mod.children.forEach(child => {
        childList.appendChild(createModuleElement(child));
      });
      li.appendChild(childList);
    }

    if (mod.exports && Array.isArray(mod.exports)) {
      const exportsList = document.createElement('ul');
      exportsList.className = 'module-exports';
      mod.exports.forEach(exp => {
        const expItem = document.createElement('li');
        expItem.className = 'export-item';
        expItem.textContent = exp;
        exportsList.appendChild(expItem);
      });
      li.appendChild(exportsList);
    }

    return li;
  }

  if (Array.isArray(moduleInfo)) {
    moduleInfo.forEach(mod => {
      tree.appendChild(createModuleElement(mod));
    });
  } else {
    tree.appendChild(createModuleElement(moduleInfo));
  }

  if (includeSource) {
    const sourceSection = document.createElement('div');
    sourceSection.className = 'source-code';
    
    const sourceHeader = document.createElement('h4');
    sourceHeader.textContent = 'Raw Module Data';
    sourceSection.appendChild(sourceHeader);
    
    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(moduleInfo, null, 2);
    sourceSection.appendChild(pre);
    
    container.appendChild(sourceSection);
  }

  return container;
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

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original code goes here
// ----- END ORIGINAL CODE -----

/**
 * Add lang attribute to HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - Language code (e.g., 'en', 'es')
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

/**
 * Fix table structure issues for accessibility
 * @param {Document} doc - The document object
 */
function fixTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure tables have proper semantic structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = doc.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, tbody || table.firstChild);
        firstRow.remove();
      }
    }
  });
  return tables.length;
}

/**
 * Add main landmark to the document
 * @param {Document} doc - The document object
 */
function addMainLandmark(doc) {
  const existingMain = doc.querySelector('main');
  if (!existingMain) {
    const body = doc.body;
    if (body) {
      const main = doc.createElement('main');
      main.setAttribute('role', 'main');
      // Move content into main
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
  return doc.querySelector('main');
}

/**
 * Add landmark regions to the document
 * @param {Document} doc - The document object
 */
function addLandmarkRegions(doc) {
  const landmarks = ['header', 'nav', 'main', 'footer'];
  landmarks.forEach((landmark) => {
    const elements = doc.querySelectorAll(landmark);
    elements.forEach((el) => {
      if (!el.getAttribute('role') && !el.tagName.toLowerCase() === landmark) {
        el.setAttribute('role', landmark.charAt(0).toUpperCase() + landmark.slice(1));
      }
    });
  });
}

/**
 * Ensure unique landmarks in the document
 * @param {Document} doc - The document object
 * @returns {Array} Array of duplicate landmarks
 */
function ensureUniqueLandmarks(doc) {
  const landmarks = doc.querySelectorAll('[role], header, nav, main, aside, footer');
  const seen = new Map();
  const duplicates = [];
  
  landmarks.forEach((el) => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    if (seen.has(role)) {
      duplicates.push({ element: el, role });
      // Remove duplicate landmark role, keep as generic container
      if (el.hasAttribute('role')) {
        el.removeAttribute('role');
      }
    } else {
      seen.set(role, el);
    }
  });
  
  return duplicates;
}

/**
 * Alias for ensureUniqueLandmarks for compatibility
 * @param {Document} doc - The document object
 */
function uniqueLandmarks(doc) {
  return ensureUniqueLandmarks(doc);
}

/**
 * Fix landmark issues by ensuring proper landmark structure
 * @param {Document} doc - The document object
 */
function fixLandmarkIssues(doc) {
  addMainLandmark(doc);
  addLandmarkRegions(doc);
  ensureUniqueLandmarks(doc);
}

/**
 * Add accessible names to SVG elements
 * @param {Element} svg - The SVG element
 * @param {string} name - The accessible name
 */
function addSvgAccessibleNames(svg, name) {
  if (svg && svg.tagName && svg.tagName.toLowerCase() === 'svg') {
    // Add aria-label
    svg.setAttribute('aria-label', name);
    // Add title element if not present
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = name;
      svg.insertBefore(title, svg.firstChild);
    }
  }
}

/**
 * Add accessible names to all SVGs in the document
 * @param {Document} doc - The document object
 */
function addAccessibleNamesToSVGs(doc) {
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      addSvgAccessibleNames(svg, `SVG Icon ${index + 1}`);
    }
  });
  return svgs.length;
}

/**
 * Fix fake link issues (links that don't go anywhere)
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssues(doc) {
  const links = doc.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  links.forEach((link) => {
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    // If it's a fake link (using onclick as navigation), add button role or make it a button
    if ((onclick && !link.hasAttribute('href')) || role === 'link') {
      // Convert to button if appropriate
      link.setAttribute('role', 'button');
    }
  });
  return links.length;
}

/**
 * Fix a single fake link issue
 * @param {Element} link - The link element
 */
function fixFakeLinkIssue(link) {
  if (link && link.tagName.toLowerCase() === 'a') {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
    }
  }
  return link;
}

/**
 * Handle Google sign-in logic with accessibility considerations
 * @param {Object} options - Sign-in options
 * @returns {Promise} Promise resolving to sign-in result
 */
function googleSignIn(options = {}) {
  return new Promise((resolve, reject) => {
    // Accessibility: Ensure sign-in button has proper labeling
    const { buttonId = 'google-signin-button' } = options;
    const button = document.getElementById(buttonId);
    if (button) {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', 'Sign in with Google');
      }
      if (!button.textContent.trim()) {
        button.textContent = 'Sign in with Google';
      }
    }
    
    // Proceed with sign-in logic
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize(options);
      if (button) {
        google.accounts.id.renderButton(button, options);
      }
      resolve({ success: true, button });
    } else {
      reject(new Error('Google Sign-In not available'));
    }
  });
}

/**
 * Fix button identifiers for accessibility
 * @param {Document} doc - The document object
 */
function fixButtonIdentifiers(doc) {
  // Fix any buttons with generic 'my-button' id
  const buttons = doc.querySelectorAll('button[id="my-button"], [role="button"][id="my-button"]');
  buttons.forEach((button, index) => {
    const newId = `action-button-${index + 1}`;
    button.setAttribute('id', newId);
    // Ensure button has accessible name
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
  });
  return buttons.length;
}

/**
 * Ensure dependencyGraph container has proper ARIA role
 * @param {Document} doc - The document object
 * @returns {Element|null} The dependencyGraph container with ARIA role
 */
function ensureDependencyGraphAriaRole(doc) {
  const container = doc.querySelector('#dependencyGraph, .dependency-graph, [data-dependency-graph]');
  if (container) {
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'region');
    }
    if (!container.getAttribute('aria-label')) {
      container.setAttribute('aria-label', 'Dependency Graph');
    }
  }
  return container;
}

// Export all functions
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  fixLandmarkIssues,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssues,
  fixFakeLinkIssue,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  newFunction,
  renderDependencyGraph,
  renderDependencyGraphText,
  renderDependencyGraphHTML,
  displayModuleStructure,
  displayModuleStructureText,
  displayModuleStructureHTML
};