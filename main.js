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

/**
 * Renders a dependency graph visualization for debugging purposes
 * @param {Object} dependencyData - The dependency data to visualize
 * @param {Object} options - Rendering options
 * @returns {string|HTMLElement} - The rendered graph representation
 */
function renderDependencyGraph(dependencyData, options = {}) {
  if (!dependencyData) {
    console.warn('No dependency data provided');
    return null;
  }

  const {
    format = 'text',
    maxDepth = 3,
    showDependencies = true,
    showDependents = false
  } = options;

  // Build graph structure
  const graph = buildDependencyGraph(dependencyData, maxDepth);

  if (format === 'text') {
    return renderTextGraph(graph, showDependencies, showDependents);
  } else if (format === 'json') {
    return JSON.stringify(graph, null, 2);
  } else if (format === 'dom' && typeof document !== 'undefined') {
    return renderDomGraph(graph, showDependencies, showDependents);
  }

  console.log('Rendering dependency graph with data:', dependencyData);
  return graph;
}

/**
 * Builds a dependency graph from raw data
 * @param {Object} data - The dependency data
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Object} - Graph structure
 */
function buildDependencyGraph(data, maxDepth = 3) {
  const graph = {
    nodes: new Map(),
    edges: [],
    root: data.root || 'app'
  };

  // Process modules and their dependencies
  function processModule(moduleName, depth = 0, visited = new Set()) {
    if (depth > maxDepth || visited.has(moduleName)) return;
    
    visited.add(moduleName);
    
    if (!graph.nodes.has(moduleName)) {
      graph.nodes.set(moduleName, {
        id: moduleName,
        name: moduleName,
        dependencies: [],
        dependents: [],
        level: depth
      });
    }

    const module = data.modules && data.modules[moduleName];
    if (module && module.dependencies) {
      module.dependencies.forEach(dep => {
        const depName = typeof dep === 'string' ? dep : dep.name;
        
        // Add edge
        graph.edges.push({
          from: moduleName,
          to: depName,
          type: dep.type || 'dependency'
        });

        // Update node relationships
        const node = graph.nodes.get(moduleName);
        if (!node.dependencies.includes(depName)) {
          node.dependencies.push(depName);
        }

        if (!graph.nodes.has(depName)) {
          graph.nodes.set(depName, {
            id: depName,
            name: depName,
            dependencies: [],
            dependents: [],
            level: depth + 1
          });
        }

        const depNode = graph.nodes.get(depName);
        if (!depNode.dependents.includes(moduleName)) {
          depNode.dependents.push(moduleName);
        }

        // Recursively process dependencies
        processModule(depName, depth + 1, visited);
      });
    }
  }

  processModule(graph.root);
  
  return {
    nodes: Array.from(graph.nodes.values()),
    edges: graph.edges,
    root: graph.root
  };
}

/**
 * Renders graph as text representation
 * @param {Object} graph - The graph structure
 * @param {boolean} showDependencies - Show dependencies
 * @param {boolean} showDependents - Show dependents
 * @returns {string} - Text representation
 */
function renderTextGraph(graph, showDependencies = true, showDependents = false) {
  let output = `Dependency Graph (Root: ${graph.root})\n`;
  output += '='.repeat(50) + '\n\n';

  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));

  function renderNode(nodeId, visited = new Set(), prefix = '', isLast = true) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) return;

    const connector = isLast ? '└── ' : '├── ';
    output += `${prefix}${connector}${node.name} (level ${node.level})\n`;

    const children = [];
    if (showDependencies && node.dependencies) {
      children.push(...node.dependencies.map(dep => ({ id: dep, type: 'dependency' })));
    }
    if (showDependents && node.dependents) {
      children.push(...node.dependents.map(dep => ({ id: dep, type: 'dependent' })));
    }

    if (children.length > 0) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      children.forEach((child, index) => {
        const childIsLast = index === children.length - 1;
        renderNode(child.id, visited, newPrefix, childIsLast);
      });
    }
  }

  renderNode(graph.root);
  return output;
}

/**
 * Renders graph as DOM elements (browser only)
 * @param {Object} graph - The graph structure
 * @param {boolean} showDependencies - Show dependencies
 * @param {boolean} showDependents - Show dependents
 * @returns {HTMLElement} - Container element with graph
 */
function renderDomGraph(graph, showDependencies = true, showDependents = false) {
  if (typeof document === 'undefined') {
    throw new Error('DOM rendering requires a browser environment');
  }

  const container = document.createElement('div');
  container.className = 'dependency-graph';
  container.style.cssText = 'font-family: monospace; padding: 10px; border: 1px solid #ccc;';

  const title = document.createElement('h3');
  title.textContent = `Dependency Graph (Root: ${graph.root})`;
  container.appendChild(title);

  const graphContainer = document.createElement('div');
  graphContainer.className = 'graph-container';
  container.appendChild(graphContainer);

  // Simple circular rendering
  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));
  const centerX = 200;
  const centerY = 150;
  const radius = Math.max(50, graph.nodes.length * 10);

  graph.nodes.forEach((node, index) => {
    const angle = (index / graph.nodes.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const nodeEl = document.createElement('div');
    nodeEl.textContent = node.name;
    nodeEl.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      padding: 5px 10px;
      background: #e0e0e0;
      border: 1px solid #999;
      border-radius: 10px;
      font-size: 12px;
      white-space: nowrap;
    `;
    graphContainer.appendChild(nodeEl);
  });

  return container;
}

/**
 * Displays module structure for debugging purposes
 * @param {Object} moduleData - The module data to display
 * @param {Object} options - Display options
 * @returns {string|HTMLElement} - The rendered module structure
 */
function renderIndexView(moduleData, options = {}) {
  if (!moduleData) {
    console.warn('No module data provided');
    return null;
  }

  const {
    format = 'text',
    showExports = true,
    showImports = true,
    showSize = false
  } = options;

  // Process module data
  const processedData = processModuleData(moduleData, { showExports, showImports, showSize });

  if (format === 'text') {
    return renderModuleText(processedData);
  } else if (format === 'json') {
    return JSON.stringify(processedData, null, 2);
  } else if (format === 'dom' && typeof document !== 'undefined') {
    return renderModuleDom(processedData);
  }

  console.log('Rendering index view with data:', moduleData);
  return processedData;
}

/**
 * Processes module data for display
 * @param {Object} moduleData - Raw module data
 * @param {Object} options - Processing options
 * @returns {Object} - Processed module structure
 */
function processModuleData(moduleData, options = {}) {
  const { showExports = true, showImports = true, showSize = false } = options;

  const structure = {
    modules: [],
    totalModules: 0,
    totalExports: 0,
    totalImports: 0
  };

  const modules = moduleData.modules || moduleData || {};
  
  Object.keys(modules).forEach(moduleName => {
    const module = modules[moduleName];
    const moduleInfo = {
      name: moduleName,
      path: module.path || moduleName,
      exports: [],
      imports: [],
      size: module.size || 0
    };

    if (showExports && module.exports) {
      moduleInfo.exports = module.exports.map(exp => ({
        name: exp.name || exp,
        type: exp.type || 'function'
      }));
      structure.totalExports += moduleInfo.exports.length;
    }

    if (showImports && module.imports) {
      moduleInfo.imports = module.imports.map(imp => ({
        name: imp.name || imp,
        from: imp.from || imp.module || 'unknown'
      }));
      structure.totalImports += moduleInfo.imports.length;
    }

    structure.modules.push(moduleInfo);
  });

  structure.totalModules = structure.modules.length;
  return structure;
}

/**
 * Renders module structure as text
 * @param {Object} structure - Processed module structure
 * @returns {string} - Text representation
 */
function renderModuleText(structure) {
  let output = `Module Structure\n`;
  output += '='.repeat(50) + '\n\n';
  output += `Total Modules: ${structure.totalModules}\n`;
  output += `Total Exports: ${structure.totalExports}\n`;
  output += `Total Imports: ${structure.totalImports}\n\n`;

  structure.modules.forEach(module => {
    output += `📦 ${module.name}\n`;
    if (module.path && module.path !== module.name) {
      output += `   Path: ${module.path}\n`;
    }
    if (module.size) {
      output += `   Size: ${module.size} bytes\n`;
    }

    if (module.exports.length > 0) {
      output += `   📤 Exports:\n`;
      module.exports.forEach(exp => {
        output += `      - ${exp.name} (${exp.type})\n`;
      });
    }

    if (module.imports.length > 0) {
      output += `   📥 Imports:\n`;
      module.imports.forEach(imp => {
        output += `      - ${imp.name} from ${imp.from}\n`;
      });
    }

    output += '\n';
  });

  return output;
}

/**
 * Renders module structure as DOM elements
 * @param {Object} structure - Processed module structure
 * @returns {HTMLElement} - Container element with module structure
 */
function renderModuleDom(structure) {
  if (typeof document === 'undefined') {
    throw new Error('DOM rendering requires a browser environment');
  }

  const container = document.createElement('div');
  container.className = 'module-structure';
  container.style.cssText = 'font-family: monospace; padding: 10px;';

  const title = document.createElement('h2');
  title.textContent = 'Module Structure';
  container.appendChild(title);

  const stats = document.createElement('div');
  stats.innerHTML = `
    <p>Total Modules: ${structure.totalModules}</p>
    <p>Total Exports: ${structure.totalExports}</p>
    <p>Total Imports: ${structure.totalImports}</p>
  `;
  container.appendChild(stats);

  structure.modules.forEach(module => {
    const moduleDiv = document.createElement('div');
    moduleDiv.style.cssText = 'margin: 10px 0; padding: 10px; border: 1px solid #ddd;';

    const moduleName = document.createElement('h3');
    moduleName.textContent = `📦 ${module.name}`;
    moduleDiv.appendChild(moduleName);

    if (module.path && module.path !== module.name) {
      const path = document.createElement('p');
      path.textContent = `Path: ${module.path}`;
      moduleDiv.appendChild(path);
    }

    if (module.size) {
      const size = document.createElement('p');
      size.textContent = `Size: ${module.size} bytes`;
      moduleDiv.appendChild(size);
    }

    if (module.exports.length > 0) {
      const exportsTitle = document.createElement('strong');
      exportsTitle.textContent = '📤 Exports:';
      moduleDiv.appendChild(exportsTitle);

      const exportsList = document.createElement('ul');
      module.exports.forEach(exp => {
        const li = document.createElement('li');
        li.textContent = `${exp.name} (${exp.type})`;
        exportsList.appendChild(li);
      });
      moduleDiv.appendChild(exportsList);
    }

    if (module.imports.length > 0) {
      const importsTitle = document.createElement('strong');
      importsTitle.textContent = '📥 Imports:';
      moduleDiv.appendChild(importsTitle);

      const importsList = document.createElement('ul');
      module.imports.forEach(imp => {
        const li = document.createElement('li');
        li.textContent = `${imp.name} from ${imp.from}`;
        importsList.appendChild(li);
      });
      moduleDiv.appendChild(importsList);
    }

    container.appendChild(moduleDiv);
  });

  return container;
}

/**
 * Displays comprehensive debug information including dependency graphs and module structure
 * @param {Object} debugData - The debug data containing modules, dependencies, and other info
 * @param {Object} options - Display options
 * @returns {Object} - Object containing various representations
 */
function displayDebugInfo(debugData, options = {}) {
  const {
    showDependencyGraph = true,
    showModuleStructure = true,
    format = 'text'
  } = options;

  const results = {};

  if (showDependencyGraph && debugData.dependencies) {
    results.dependencyGraph = renderDependencyGraph(debugData.dependencies, { format, ...options });
  }

  if (showModuleStructure && debugData.modules) {
    results.moduleStructure = renderIndexView(debugData.modules, { format, ...options });
  }

  // Add summary information
  results.summary = {
    timestamp: new Date().toISOString(),
    totalModules: Object.keys(debugData.modules || {}).length,
    hasDependencies: !!debugData.dependencies,
    format
  };

  // Log to console for immediate feedback
  if (format === 'text') {
    console.log('=== DEBUG INFORMATION ===');
    if (results.dependencyGraph) {
      console.log('\n--- Dependency Graph ---');
      console.log(results.dependencyGraph);
    }
    if (results.moduleStructure) {
      console.log('\n--- Module Structure ---');
      console.log(results.moduleStructure);
    }
    console.log('\n--- Summary ---');
    console.log(results.summary);
  }

  return results;
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
  // New enhanced functions for debugging
  buildDependencyGraph,
  renderTextGraph,
  renderDomGraph,
  processModuleData,
  renderModuleText,
  renderModuleDom,
  displayDebugInfo
};