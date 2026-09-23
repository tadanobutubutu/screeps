// TODO: Add back any required exports that might have been?
// (This comment remains as-is)

/**
 * Main JavaScript module for landmark element validation
 * @module main
 */

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
 * Configuration for landmark checks */
const config = {
  requiredLandmarks: ['main', 'header', 'footer'],
  optionalLandmarks: ['nav', 'aside', 'section'],
  skipElements: ['script', 'style', 'meta', 'link']
};

/**
 * Checks if an element is a landmark element
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if the element is a landmark
 */
function isLandmark(element) {
  if (!element || !element.tagName) return false;
  const landmarkTags = ['HEADER', 'MAIN', 'NAV', 'ASIDE', 'SECTION', 'ARTICLE', 'FOOTER'];
  return landmarkTags.includes(element.tagName);
}

/**
 * Validates landmark elements in a document
 * @param {Document} doc - The document to validate
 * @returns {Object} Validation results
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
      tag: landmark.tagName ? landmark.tagName.toLowerCase() : 'unknown',
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
 * @returns {HTMLElement[]} Array of landmark elements
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

// Generalized accessibility functions

function setSvgAccessibleName(svg, name) {
  if (!svg) {
    throw new Error('SVG element is required');
  }
  if (!name || typeof name !== 'string') {
    throw new Error('Name must be a non-empty string');
  }
  svg.setAttribute('aria-label', name);
}

// Generalized accessibility functions remain unchanged

// REACT_015: Add lang attribute to HTML element
function getLangAttribute(element) {
  if (!element) return null;
  return element.getAttribute('lang') || document.documentElement.getAttribute('lang') || 'en';
}

function createInPageButton(options) {
  const { id, text, target, container } = options || {};
  const button = document.createElement('button');
  button.id = id || 'in-page-button';
  button.textContent = text || 'Skip to content';
  button.setAttribute('type', 'button');
  
  if (target) {
    button.setAttribute('data-target', target);
  }
  
  const lang = getLangAttribute(document.documentElement);
  button.setAttribute('lang', lang);
  
  if (container) {
    container.appendChild(button);
  }

  // Ensure all clickable elements are focusable
  const focusable = container.querySelectorAll('button, input, select, textarea, [tabindex]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

/**
 * Renders dependency graph content within a container
 * @param {HTMLElement} container - The container element
 */
function renderDependencyGraphContent(container) {
  if (!container) return;
  const elements = container.querySelectorAll('[data-dependency]');
  const dependencyMap = new Map();

  elements.forEach(el => {
    if (el.dataset) {
      // Process dependency data
      const depData = el.dataset.dependency;
      if (depData) {
        el.setAttribute('aria-describedby', 'dep-' + el.id);
      }
    }
  });

  dependencyMap.forEach((deps, key) => {
    const groupContainer = document.createElement('div');
    groupContainer.className = 'dependency-group';
    groupContainer.setAttribute('data-dependency-group', key);
    deps.forEach(dep => {
      const clonedEl = dep.cloneNode(true);
      clonedEl.setAttribute('data-processed', 'true');
      groupContainer.appendChild(clonedEl);
    });
    container.appendChild(groupContainer);
  });
}

/**
 * Ensures landmark uniqueness within elements
 * @param {HTMLElement[]} elements - Array of elements
 * @returns {HTMLElement[]} - Array of unique elements
 */
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

/**
 * Ensures landmark roles are unique in the document
 * Fixes duplicate landmark roles by removing redundant roles or adding aria labels
 * @returns {Object} - Result with fixed count and details
 */
function ensureUniqueLandmarks() {
  const results = {
    fixed: 0,
    errors: [],
    landmarksProcessed: 0
  };

  try {
    // Get all elements with landmark roles
    const landmarkRoleSelectors = [
      '[role="main"]',
      '[role="banner"]',
      '[role="contentinfo"]',
      '[role="navigation"]',
      '[role="complementary"]',
      '[role="search"]',
      '[role="form"]',
      '[role="region"]',
      'main',
      'header',
      'footer',
      'nav',
      'aside',
      'section',
      'article'
    ];

    const selector = landmarkRoleSelectors.join(', ');
    const landmarkElements = document.querySelectorAll(selector);

    // Track landmark roles we've seen
    const seenRoles = new Map(); // role -> element
    const roleCounts = {}; // role -> count

    landmarkElements.forEach(el => {
      results.landmarksProcessed++;
      
      // Determine the landmark role
      let role = el.getAttribute('role');
      if (!role) {
        // Map semantic elements to their implicit roles
        const tagName = el.tagName.toLowerCase();
        const implicitRoles = {
          'main': 'main',
          'header': 'banner',
          'footer': 'contentinfo',
          'nav': 'navigation',
          'aside': 'complementary',
          'section': 'region',
          'article': 'region'
        };
        role = implicitRoles[tagName] || 'region';
      }

      // Count roles
      roleCounts[role] = (roleCounts[role] || 0) + 1;

      // Check for duplicates of unique roles
      const uniqueRoles = ['main', 'banner', 'contentinfo'];
      if (uniqueRoles.includes(role)) {
        if (seenRoles.has(role)) {
          // Duplicate unique role found - fix it
          const existingEl = seenRoles.get(role);
          
          // Prefer the semantic element over the role attribute
          const existingIsSemantic = ['MAIN', 'HEADER', 'FOOTER'].includes(existingEl.tagName);
          const currentIsSemantic = ['MAIN', 'HEADER', 'FOOTER'].includes(el.tagName);
          
          if (currentIsSemantic && !existingIsSemantic) {
            // Current is semantic, existing has role attribute - remove role from existing
            existingEl.removeAttribute('role');
            results.fixed++;
            results.errors.push(`Removed duplicate ${role} role from non-semantic element`);
            seenRoles.set(role, el);
          } else if (!currentIsSemantic && existingIsSemantic) {
            // Existing is semantic, current has role attribute - remove role from current
            el.removeAttribute('role');
            results.fixed++;
            results.errors.push(`Removed duplicate ${role} role from non-semantic element`);
          } else {
            // Both same type - remove role from current (later in DOM)
            el.removeAttribute('role');
            results.fixed++;
            results.errors.push(`Removed duplicate ${role} role from element`);
          }
        } else {
          seenRoles.set(role, el);
        }
      } else {
        // For non-unique roles (navigation, complementary, search, form, region)
        // Ensure they have accessible names if there are multiples
        if (roleCounts[role] > 1) {
          if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
            // Generate a label based on context
            let label = '';
            if (el.id) {
              label = el.id;
            } else if (el.className) {
              label = el.className.split(' ')[0];
            } else {
              label = `${role}-${roleCounts[role]}`;
            }
            el.setAttribute('aria-label', label);
            results.fixed++;
            results.errors.push(`Added aria-label "${label}" to ${role} landmark`);
          }
        }
        if (!seenRoles.has(role)) {
          seenRoles.set(role, el);
        }
      }
    });

    // Validate required landmarks exist
    config.requiredLandmarks.forEach(required => {
      const roleMap = {
        'main': 'main',
        'header': 'banner',
        'footer': 'contentinfo'
      };
      const role = roleMap[required];
      if (!seenRoles.has(role)) {
        results.errors.push(`Required landmark "${required}" (role="${role}") not found`);
      }
    });

  } catch (error) {
    results.errors.push(`Error ensuring landmark uniqueness: ${error.message}`);
  }

  return results;
}

function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (svg && svg.querySelector) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      }
    }
  });
}

// REACT_017: Add/fix landmark issues
function validateLandmarkStructure(element) {
  const errors = [];
  
  if (!element) {
    errors.push('Element is required');
    return { valid: false, errors };
  }
  
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
  const role = element.getAttribute('role');
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  
  // Check for proper tag for the role
  if (role && !landmarkRoles.includes(role)) {
    errors.push(`Invalid role "${role}" for landmark`);
  }
  
  // Check that header/footer are not nested improperly
  if (tagName === 'header' && element.closest('header, footer, article')) {
    errors.push('Header should not be nested in article, header, or footer');
  }
  
  if (tagName === 'footer' && element.closest('header, footer, article')) {
    errors.push('Footer should not be nested in article, header, or footer');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Adds a lang attribute to the HTML element (REACT_015)
 * @param {string} lang - Language code (default 'en')
 */
function addLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', lang);
  }
}

function addressInsightIssues(insightReport) {
  const issues = insightReport && insightReport.issues ? insightReport.issues : [];
  const results = {
    addressed: [],
    failed: [],
    totalIssues: issues.length
  };

  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      // Use the return value of ensureUniqueLandmarks
      const result = ensureUniqueLandmarks();
      // Store the result for potential use
      issue.ensureUniqueLandmarksResult = result;
    }
    if (issue.code === 'REACT_017') {
      const affectedElements = issue.elements || [];
      affectedElements.forEach(el => {
        if (!el['aria-label'] && !el.label) {
          el.setAttribute('aria-label', el.id || 'unnamed-element');
        }
      });
    }
  });

  return results;
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
  if (!affectedElements || !Array.isArray(affectedElements) || affectedElements.length === 0) return;

  affectedElements.forEach(el => {
    if (el && el.tagName && !el.getAttribute('role')) {
      el.setAttribute('role', 'region');
    }
  });
  
  return fakeLinks.length;
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

// Accessibility issue resolution functions (REACT_015, REACT_017, REACT_025, REACT_036, REACT_041)

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the html element has a valid lang attribute for accessibility
 * @param {Document} doc - The document to check
 * @returns {Object} - Result object with valid status and any errors
 */
function addLangAttribute(doc) {
  const result = { valid: true, errors: [] };
  
  if (!doc || !doc.documentElement) {
    result.valid = false;
    result.errors.push('Document or documentElement not found');
    return result;
  }
  
  const htmlElement = doc.documentElement;
  const lang = htmlElement.getAttribute('lang');
  
  if (!lang || lang.trim() === '') {
    htmlElement.setAttribute('lang', 'en');
    result.errors.push('Added missing lang attribute with default value "en"');
  }
  
  return result;
}

/**
 * REACT_025: Ensure unique landmarks - fixes duplicate landmark IDs
 * @param {Document} doc - The document to validate
 * @returns {Object} - Object containing validation results and fixes applied
 */
function ensureUniqueLandmarksInDoc(doc) {
  const results = {
    valid: true,
    duplicates: [],
    fixes: []
  };
  
  if (!doc || !doc.body) {
    results.valid = false;
    results.errors = ['Document body not found'];
    return results;
  }
  
  const landmarkSelectors = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];
  const idMap = {};
  
  // Find all elements with IDs within landmark containers
  landmarkSelectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach(el => {
      if (el.id) {
        if (idMap[el.id]) {
          idMap[el.id].push(el);
        } else {
          idMap[el.id] = [el];
        }
      }
    });
  });
  
  // Identify duplicates
  Object.keys(idMap).forEach(id => {
    if (idMap[id].length > 1) {
      results.duplicates.push({ id, count: idMap[id].length, elements: idMap[id] });
      results.valid = false;
      
      // Fix duplicates by making IDs unique
      idMap[id].forEach((el, index) => {
        if (index > 0) {
          const newId = id + '-' + index;
          el.setAttribute('data-original-id', el.getAttribute('id'));
          el.id = newId;
          results.fixes.push({ 
            type: 'duplicate-id-fixed', 
            original: id, 
            new: newId, 
            element: el.tagName 
          });
        }
      });
    }
  });
  
  return results;
}

/**
 * REACT_036: Fix fake link issues - converts anchor elements without href to buttons
 * or adds proper href attributes to links that should be links
 * @param {Document} doc - The document to process
 * @returns {Object} - Object containing found fake links and fixes applied
 */
function fixFakeLinks(doc) {
  const results = {
    fakeLinks: [],
    fixes: []
  };
  
  if (!doc) {
    return results;
  }
  
  const anchors = doc.querySelectorAll ? doc.querySelectorAll('a') : [];
  
  anchors.forEach(anchor => {
    const href = anchor.getAttribute('href');
    const onclick = anchor.getAttribute('onclick');
    const role = anchor.getAttribute('role');
    
    // Check if it's a fake link (anchor without href)
    if (!href && (onclick || role === 'button')) {
      results.fakeLinks.push({
        element: anchor,
        tag: anchor.tagName,
        text: anchor.textContent,
        hasOnclick: !!onclick,
        hasRoleButton: role === 'button'
      });
      
      // Fix: Convert to button element for semantic correctness
      const button = doc.createElement('button');
      
      // Copy relevant attributes
      Array.from(anchor.attributes).forEach(attr => {
        if (attr.name !== 'href' && attr.name !== 'role') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      
      // Set button type to prevent form submission
      button.setAttribute('type', 'button');
      
      // Copy inner content
      button.innerHTML = anchor.innerHTML;
      
      // Copy class
      if (anchor.className) {
        button.className = anchor.className;
      }
      
      // Replace anchor with button
      if (anchor.parentNode) {
        anchor.parentNode.replaceChild(button, anchor);
        results.fixes.push({
          type: 'converted-to-button',
          originalText: button.textContent.substring(0, 50)
        });
      }
    }
  });
  
  return results;
}

/**
 * REACT_041: Add accessible names to SVG elements
 * @param {Document} doc - The document to process
 * @returns {Object} - Object containing SVGs processed and fixes applied
 */
function addSvgAccessibleNames(doc) {
  const results = {
    processed: 0,
    fixed: 0,
    fixes: []
  };
  
  if (!doc) {
    return results;
  }
  
  const svgs = doc.querySelectorAll ? doc.querySelectorAll('svg') : [];
  
  svgs.forEach((svg, index) => {
    results.processed++;
    
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
    const titleElement = svg.querySelector('title');
    
    // Skip if already has accessible name
    if (hasAriaLabel || hasAriaLabelledby) {
      return;
    }
    
    // Try to generate accessible name
    let accessibleName = null;
    
    // Check for existing title element
    if (titleElement && titleElement.textContent) {
      accessibleName = titleElement.textContent;
    }
    
    // Check for adjacent caption or desc
    const adjacentCaption = svg.parentElement?.querySelector('figcaption');
    if (adjacentCaption && !accessibleName) {
      accessibleName = adjacentCaption.textContent;
    }
    
    // Generate name if none found
    if (!accessibleName) {
      accessibleName = 'SVG graphic ' + (index + 1);
    }
    
    // If no title element exists, create one
    if (!titleElement) {
      const newTitle = doc.createElement('title');
      newTitle.textContent = accessibleName;
      newTitle.id = 'svg-title-' + index + '-' + Math.random().toString(36).substr(2, 9);
      svg.insertBefore(newTitle, svg.firstChild);
    }
    
    // Set aria-labelledby to reference the title
    const titleId = titleElement?.id || newTitle?.id;
    if (titleId) {
      svg.setAttribute('aria-labelledby', titleId);
      results.fixed++;
      results.fixes.push({
        type: 'added-accessible-name',
        name: accessibleName,
        method: titleElement ? 'aria-labelledby' : 'title-and-aria-labelledby'
      });
    }
  });
  
  return results;
}

/**
 * REACT_017: Add landmark roles and fix landmark issues
 * @param {Document} doc - The document to process
 * @returns {Object} - Object containing landmark fixes applied
 */
function addLandmarkRoles(doc) {
  const results = {
    fixes: [],
    errors: []
  };
  
  if (!doc || !doc.body) {
    results.errors.push('Document body not found');
    return results;
  }
  
  const landmarkElements = {
    'header': { role: 'banner', allowMultiple: false },
    'footer': { role: 'contentinfo', allowMultiple: false },
    'main': { role: 'main', allowMultiple: false },
    'nav': { role: 'navigation', allowMultiple: true },
    'aside': { role: 'complementary', allowMultiple: true },
    'section': { role: 'region', allowMultiple: true, requiresLabel: true },
    'article': { role: 'article', allowMultiple: true, requiresLabel: true }
  };
  
  Object.keys(landmarkElements).forEach(tag => {
    const config = landmarkElements[tag];
    const elements = doc.querySelectorAll(tag);
    
    elements.forEach((el, index) => {
      const currentRole = el.getAttribute('role');
      
      // Check if role is already set
      if (!currentRole) {
        el.setAttribute('role', config.role);
        results.fixes.push({
          element: tag,
          action: 'added-role',
          value: config.role,
          index: index
        });
      }
      
      // Add accessible name to sections and articles that need labels
      if (config.requiresLabel && !el.id && !el.getAttribute('aria-label')) {
        const label = 'section-' + tag + '-' + index;
        el.setAttribute('aria-label', label);
        results.fixes.push({
          element: tag,
          action: 'added-label',
          value: label,
          index: index
        });
      }
    });
  });
  
  return results;
}

/**
 * Comprehensive accessibility fix function that addresses all insight report issues
 * @param {Document} doc - The document to fix
 * @param {Object} insightReport - The insight report with specific issues to address
 * @returns {Object} - Summary of all fixes applied
 */
function fixAccessibilityIssues(doc, insightReport) {
  const summary = {
    REACT_015: null,
    REACT_017: null,
    REACT_025: null,
    REACT_036: null,
    REACT_041: null,
    errors: []
  };
  
  try {
    // REACT_015: Add lang attribute
    summary.REACT_015 = addLangAttribute(doc);
  } catch (e) {
    summary.errors.push({ issue: 'REACT_015', error: e.message });
  }
  
  try {
    // REACT_017: Add landmark roles
    summary.REACT_017 = addLandmarkRoles(doc);
  } catch (e) {
    summary.errors.push({ issue: 'REACT_017', error: e.message });
  }
  
  try {
    // REACT_025: Ensure unique landmarks
    summary.REACT_025 = ensureUniqueLandmarksInDoc(doc);
  } catch (e) {
    summary.errors.push({ issue: 'REACT_025', error: e.message });
  }
  
  try {
    // REACT_036: Fix fake links
    summary.REACT_036 = fixFakeLinks(doc);
  } catch (e) {
    summary.errors.push({ issue: 'REACT_036', error: e.message });
  }
  
  try {
    // REACT_041: Add accessible names to SVGs
    summary.REACT_041 = addSvgAccessibleNames(doc);
  } catch (e) {
    summary.errors.push({ issue: 'REACT_041', error: e.message });
  }
  
  return summary;
}

/**
 * New function3 logic
 */
function function3() {
  // Implementation of function3
  return 'function3 implemented';
}

// REACT_015: Add lang attribute to HTML element
function addLangToHtmlElement(doc, lang) {
  if (!doc) {
    doc = document;
  }
  const html = doc.documentElement;
  if (html) {
    html.setAttribute('lang', lang || 'en');
  }
}

// REACT_017: Add landmark roles and fix landmark issues
function addLandmarkRoles(container) {
  if (!container) {
    container = document.body;
  }
  
  const landmarks = container.querySelectorAll('header:not([role]), main:not([role]), nav:not([role]), aside:not([role]), section:not([role]), article:not([role]), footer:not([role])');
  
  landmarks.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (tagName === 'header' && !el.closest('main') && !el.closest('article')) {
      el.setAttribute('role', 'banner');
    } else if (tagName === 'main') {
      el.setAttribute('role', 'main');
    } else if (tagName === 'nav') {
      el.setAttribute('role', 'navigation');
    } else if (tagName === 'aside') {
      el.setAttribute('role', 'complementary');
    } else if (tagName === 'section') {
      el.setAttribute('role', 'region');
    } else if (tagName === 'article') {
      el.setAttribute('role', 'article');
    } else if (tagName === 'footer' && !el.closest('main') && !el.closest('article')) {
      el.setAttribute('role', 'contentinfo');
    }
  });
}

// REACT_041: Add accessible names to 2 SVGs
function addAccessibleNameToSvg(svg, name) {
  if (!svg || svg.tagName.toLowerCase() !== 'svg') {
    return false;
  }
  
  if (name) {
    svg.setAttribute('aria-label', name);
    return true;
  }
  
  // If no name provided, try to use title element
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    let titleId = title.id;
    if (!titleId) {
      titleId = 'svg-title-' + Math.random().toString(36).substring(2, 11);
      title.id = titleId;
    }
    svg.setAttribute('aria-labelledby', titleId);
    return true;
  }
  
  return false;
}

// REACT_025: Ensure unique landmarks
function fixDuplicateLandmarks(container) {
  if (!container) {
    container = document.body;
  }
  
  const idCount = {};
  const landmarks = container.querySelectorAll('[id]');
  
  landmarks.forEach(el => {
    const id = el.id;
    if (idCount[id]) {
      idCount[id]++;
    } else {
      idCount[id] = 1;
    }
  });
  
  Object.keys(idCount).forEach(id => {
    if (idCount[id] > 1) {
      const elements = container.querySelectorAll('#' + CSS.escape(id));
      let counter = 1;
      elements.forEach(el => {
        if (counter > 1) {
          el.id = id + '-' + counter;
        }
        counter++;
      });
    }
  });
}

// REACT_036: Fix fake link issues
function fixFakeLinks(container) {
  if (!container) {
    container = document.body;
  }
  
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '') {
      // Add role="button" and handle as button
      link.setAttribute('role', 'button');
    }
  });
  
  // Also check elements with onclick that should be buttons
  const elementsWithOnclick = container.querySelectorAll('[onclick]');
  elementsWithOnclick.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (tagName === 'a') {
      el.setAttribute('role', 'button');
    }
  });
}

// REACT_027: Add scope to th elements
function addScopeToThElements(container) {
  if (!container) {
    container = document.body;
  }
  
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    const thElements = table.querySelectorAll('th');
    const firstRow = table.querySelector('thead tr') || table.querySelector('tr');
    const firstRowCells = firstRow ? firstRow.querySelectorAll('th, td') : [];
    
    thElements.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        // Check if this th is in the first row
        const parentRow = th.closest('tr');
        if (parentRow && parentRow === firstRow) {
          th.setAttribute('scope', 'col');
        } else if (th.textContent && firstRowCells.length > 0 && index < firstRowCells.length) {
          // Check if this th corresponds to a row header
          th.setAttribute('scope', 'row');
        }
      }
    });
  });
}

// Comprehensive accessibility improvement function
function applyAccessibilityFixes(doc) {
  if (!doc) {
    doc = document;
  }
  
  addLangToHtmlElement(doc, 'en');
  addLandmarkRoles(doc.body);
  addScopeToThElements(doc.body);
  fixDuplicateLandmarks(doc.body);
  fixFakeLinks(doc.body);
}

// New function to address accessibility issue REACT_025: Landmarks must be unique
function ensureUniqueLandmarksFromReport(insightReport) {
  const issues = insightReport && insightReport.issues ? insightReport.issues : [];
  const landmarkElements = [];

  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      const affectedElements = issue.elements || [];
      affectedElements.forEach(el => {
        if (el && el.tagName && (el.tagName.toLowerCase() === 'main' || el.getAttribute('role'))) {
          landmarkElements.push(el);
        }
      });
    }
  });

  // Remove duplicate landmarks based on role/id
  const seenRoles = {};
  const uniqueLandmarks = landmarkElements.filter(el => {
    const role = el.getAttribute('role');
    const id = el.id || '';
    const identifier = role + '|' + id;

    if (seenRoles[identifier]) {
      return false;
    }
    seenRoles[identifier] = true;
    return true;
  });

  return uniqueLandmarks;
}

// New function to address accessibility issue REACT_017: Elements must have discernible text
function addAccessibleNames(insightReport) {
  const issues = insightReport && insightReport.issues ? insightReport.issues : [];

  issues.forEach(issue => {
    if (issue.code === 'REACT_017') {
      const affectedElements = issue.elements || [];
      affectedElements.forEach(el => {
        if (typeof el === 'object' && el !== null) {
          if (!el['aria-label'] && !el['aria-labelledby'] && !el.textContent) {
            el['aria-label'] = el.id || 'unnamed-element';
          }
        }
      });
    }
  });
}

module.exports = {
  validateLandmark,
  processLandmarks,
  config,
  isLandmark,
  validateLandmarks,
  getLandmarkElements,
  SomeModule,
  setSvgAccessibleName,
  setLangAttribute,
  improveAccessibility,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  // functionB: ensureUniqueLandmarks, // Add functionB export here if it is implemented
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  addLangAttribute,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  ensureUniqueLandmarksFromReport,
  addAccessibleNames
};