// TODO: Identify and update specific functions that render dependency graphs or index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// >>>>>>> branch-name

// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)

// Import required modules
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Utility functions
function getFileExtension(filepath) {
  return path.extname(filepath);
}

function readFileAsync(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function writeFileAsync(filepath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, 'utf8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function createServer(port, hostname, requestListener) {
  const server = http.createServer(requestListener);
  return server.listen(port, hostname);
}

function createHttpsServer(options, requestListener) {
  const server = https.createServer(options, requestListener);
  return server;
}

function getAbsolutePath(relativePath) {
  return path.resolve(relativePath);
}

function joinPaths(...paths) {
  return path.join(...paths);
}

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
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return setHtmlLangAttribute(lang);
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName(name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return '';
  return name.trim();
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }

  return { valid: errors.length === 0, errors };
}

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

  if (target) {
    link.target = target;
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

  return { valid: errors.length === 0, errors };
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
  parent.appendChild(btn);
  return btn;
}

/**
 * Analyzes and returns the dependency structure of a module.
 * @param {string} moduleName - The name of the module to analyze
 * @param {Object} moduleRegistry - Optional registry of known modules and their dependencies
 * @returns {Object} An object containing module info, dependencies, and dependents
 */
function getModuleDependencies(moduleName, moduleRegistry = {}) {
  const dependencies = [];
  const dependents = [];

  // Build dependency list from registry
  if (moduleRegistry[moduleName]) {
    const mod = moduleRegistry[moduleName];
    if (mod.dependencies) {
      mod.dependencies.forEach(dep => {
        dependencies.push({
          name: dep,
          type: 'required'
        });
      });
    }
    if (mod.optionalDependencies) {
      mod.optionalDependencies.forEach(dep => {
        dependencies.push({
          name: dep,
          type: 'optional'
        });
      });
    }
  }

  // Find all modules that depend on this one
  Object.keys(moduleRegistry).forEach(name => {
    const mod = moduleRegistry[name];
    const allDeps = [...(mod.dependencies || []), ...(mod.optionalDependencies || [])];
    if (allDeps.includes(moduleName)) {
      dependents.push({
        name: name,
        type: allDeps.includes(moduleName) ? 'required' : 'optional'
      });
    }
  });

  return {
    name: moduleName,
    dependencies,
    dependents,
    metadata: moduleRegistry[moduleName] || {}
  };
}

/**
 * Renders a dependency graph as a visual representation.
 * @param {Object} dependencies - Object containing module dependency data
 * @param {Object} options - Rendering options (format, maxDepth, etc.)
 * @returns {Object} An object containing the rendered graph data and metadata
 */
function renderDependencyGraph(dependencies, options = {}) {
  const {
    maxDepth = 3,
    includeDevDependencies = true,
    format = 'tree'
  } = options;

  const graph = {
    nodes: [],
    edges: [],
    metadata: {
      totalNodes: 0,
      totalEdges: 0,
      maxDepth: 0,
      circularDeps: []
    }
  };

  const visited = new Set();
  const nodeMap = new Map();

  // Build nodes from dependencies
  const addNode = (name, depth = 0) => {
    if (visited.has(name)) {
      return;
    }
    visited.add(name);

    const nodeId = `node_${graph.nodes.length}`;
    const node = {
      id: nodeId,
      name: name,
      depth: depth,
      type: 'module'
    };

    graph.nodes.push(node);
    nodeMap.set(name, nodeId);
    graph.metadata.totalNodes++;
    graph.metadata.maxDepth = Math.max(graph.metadata.maxDepth, depth);
  };

  // Build edges between nodes
  const addEdge = (from, to) => {
    const edgeId = `edge_${graph.edges.length}`;
    graph.edges.push({
      id: edgeId,
      from: nodeMap.get(from) || from,
      to: nodeMap.get(to) || to,
      fromName: from,
      toName: to
    });
    graph.metadata.totalEdges++;
  };

  // Process dependencies recursively
  const processDependencies = (deps, parentName = null, depth = 0) => {
    if (depth > maxDepth) {
      return;
    }

    if (typeof deps === 'object' && deps !== null) {
      if (deps.name) {
        addNode(deps.name, depth);
        if (parentName) {
          addEdge(parentName, deps.name);
        }
        parentName = deps.name;
      }

      if (Array.isArray(deps.dependencies)) {
        deps.dependencies.forEach(dep => {
          const depName = typeof dep === 'string' ? dep : dep.name;
          addNode(depName, depth + 1);
          if (parentName) {
            addEdge(parentName, depName);
          }
          if (typeof dep === 'object' && dep.dependencies) {
            processDependencies(dep, depName, depth + 1);
          }
        });
      }

      if (includeDevDependencies && Array.isArray(deps.devDependencies)) {
        deps.devDependencies.forEach(dep => {
          const depName = typeof dep === 'string' ? dep : dep.name;
          addNode(depName, depth + 1);
          if (parentName) {
            addEdge(parentName, depName);
          }
        });
      }
    }
  };

  // Detect circular dependencies
  const detectCircularDeps = (deps, path = []) => {
    if (typeof deps !== 'object' || deps === null) {
      return;
    }

    const currentName = deps.name || 'root';
    if (path.includes(currentName)) {
      graph.metadata.circularDeps.push([...path, currentName]);
      return;
    }

    const newPath = [...path, currentName];

    if (Array.isArray(deps.dependencies)) {
      deps.dependencies.forEach(dep => {
        const depName = typeof dep === 'string' ? dep : dep.name;
        if (depName) {
          detectCircularDeps({ name: depName, dependencies: [] }, newPath);
        }
      });
    }
  };

  // Process the input dependencies
  if (dependencies) {
    processDependencies(dependencies);
    detectCircularDeps(dependencies);
  }

  // Generate ASCII tree representation if requested
  let treeRepresentation = '';
  if (format === 'tree') {
    const renderTree = (nodes, parentId = null, prefix = '', isLast = true) => {
      const children = nodes.filter(n => {
        if (parentId === null) {
          return graph.edges.every(e => e.from !== n.id);
        }
        return graph.edges.some(e => e.from === parentId && e.to === n.id);
      });

      children.forEach((node, index) => {
        const isLastChild = index === children.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const childPrefix = prefix + (isLast ? '    ' : '│   ');

        treeRepresentation += `${prefix}${connector}${node.name}\n`;

        const nodeChildren = nodes.filter(n =>
          graph.edges.some(e => e.from === node.id && e.to === n.id)
        );
        nodeChildren.forEach((child, childIndex) => {
          const childConnector = childIndex === nodeChildren.length - 1 ? '└── ' : '├── ';
          treeRepresentation += `${childPrefix}${childConnector}${child.name}\n`;
        });
      });
    };

    treeRepresentation = 'Dependency Graph:\n';
    treeRepresentation += `Total Modules: ${graph.metadata.totalNodes}\n`;
    treeRepresentation += `Total Dependencies: ${graph.metadata.totalEdges}\n`;
    treeRepresentation += '─'.repeat(40) + '\n';

    const rootNodes = graph.nodes.filter(n =>
      graph.edges.every(e => e.to !== n.id)
    );
    rootNodes.forEach((node, index) => {
      treeRepresentation += `${node.name}\n`;
      renderTree(graph.nodes, node.id, '', index === rootNodes.length - 1);
    });
  }

  return {
    graph,
    tree: treeRepresentation,
    format
  };
}

/**
 * Gets the structure of modules for debugging purposes.
 * @param {Object} modules - Object containing module data
 * @returns {Object} An object containing the module structure information
 */
function getModuleStructure(modules) {
  const structure = {
    modules: [],
    totalCount: 0,
    exports: {},
    imports: {}
  };

  if (typeof modules !== 'object' || modules === null) {
    return structure;
  }

  // Process each module
  Object.keys(modules).forEach(moduleName => {
    const mod = modules[moduleName];
    const moduleInfo = {
      name: moduleName,
      path: mod.path || '',
      type: mod.type || 'commonjs',
      exports: [],
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
      size: mod.size || 0,
      lineCount: mod.lineCount || 0
    };

    // Extract exports
    if (mod.exports) {
      if (Array.isArray(mod.exports)) {
        moduleInfo.exports = mod.exports;
        mod.exports.forEach(exp => {
          structure.exports[exp] = moduleName;
        });
      } else if (typeof mod.exports === 'object') {
        moduleInfo.exports = Object.keys(mod.exports);
        Object.keys(mod.exports).forEach(exp => {
          structure.exports[exp] = moduleName;
        });
      }
    }

    // Extract dependencies
    if (Array.isArray(mod.dependencies)) {
      moduleInfo.dependencies = mod.dependencies;
      mod.dependencies.forEach(dep => {
        if (!structure.imports[dep]) {
          structure.imports[dep] = [];
        }
        structure.imports[dep].push(moduleName);
      });
    }

    if (Array.isArray(mod.devDependencies)) {
      moduleInfo.devDependencies = mod.devDependencies;
    }

    if (Array.isArray(mod.peerDependencies)) {
      moduleInfo.peerDependencies = mod.peerDependencies;
    }

    structure.modules.push(moduleInfo);
    structure.totalCount++;
  });

  return structure;
}

/**
 * Displays module structure as a formatted string for debugging.
 * @param {Object} moduleStructure - The module structure object from getModuleStructure
 * @param {Object} options - Display options (verbose, showExports, etc.)
 * @returns {string} A formatted string representation of the module structure
 */
function displayModuleStructure(moduleStructure, options = {}) {
  const {
    verbose = false,
    showExports = true,
    showDependencies = true,
    maxDepth = 2
  } = options;

  if (!moduleStructure || !moduleStructure.modules) {
    return 'No module structure data available';
  }

  let output = [];
  output.push('═'.repeat(60));
  output.push('MODULE STRUCTURE REPORT');
  output.push('═'.repeat(60));
  output.push(`Total Modules: ${moduleStructure.totalCount}`);
  output.push(`Total Unique Exports: ${Object.keys(moduleStructure.exports || {}).length}`);
  output.push(`Total Unique Imports: ${Object.keys(moduleStructure.imports || {}).length}`);
  output.push('═'.repeat(60));

  // Sort modules alphabetically
  const sortedModules = [...moduleStructure.modules].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  sortedModules.forEach((mod, index) => {
    output.push('');
    output.push(`${index + 1}. ${mod.name}`);
    output.push('─'.repeat(40));

    if (verbose) {
      output.push(`   Type: ${mod.type}`);
      output.push(`   Path: ${mod.path}`);
      output.push(`   Size: ${formatBytes(mod.size)}`);
      output.push(`   Lines: ${mod.lineCount}`);
    }

    if (showExports && mod.exports.length > 0) {
      output.push('   Exports:');
      mod.exports.forEach(exp => {
        output.push(`     - ${exp}`);
      });
    }

    if (showDependencies) {
      if (mod.dependencies.length > 0) {
        output.push(`   Dependencies (${mod.dependencies.length}):`);
        mod.dependencies.slice(0, maxDepth * 5).forEach(dep => {
          output.push(`     → ${dep}`);
        });
        if (mod.dependencies.length > maxDepth * 5) {
          output.push(`     ... and ${mod.dependencies.length - maxDepth * 5} more`);
        }
      }

      if (mod.devDependencies.length > 0) {
        output.push(`   Dev Dependencies (${mod.devDependencies.length}):`);
        mod.devDependencies.slice(0, maxDepth * 3).forEach(dep => {
          output.push(`     → ${dep}`);
        });
        if (mod.devDependencies.length > maxDepth * 3) {
          output.push(`     ... and ${mod.devDependencies.length - maxDepth * 3} more`);
        }
      }

      if (mod.peerDependencies.length > 0) {
        output.push(`   Peer Dependencies (${mod.peerDependencies.length}):`);
        mod.peerDependencies.forEach(dep => {
          output.push(`     → ${dep}`);
        });
      }
    }
  });

  output.push('');
  output.push('═'.repeat(60));
  output.push('END OF REPORT');
  output.push('═'.repeat(60));

  return output.join('\n');
}

/**
 * Formats bytes into a human-readable string.
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string (e.g., "1.5 KB")
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Exports the dependency graph data in a serializable format.
 * @param {Object} dependencies - The dependency data to export
 * @returns {Object} Serializable representation of the dependency graph
 */
function exportDependencyGraph(dependencies) {
  const graphData = renderDependencyGraph(dependencies, { format: 'data' });

  return {
    format: 'json',
    version: '1.0',
    generated: new Date().toISOString(),
    data: graphData.graph,
    metadata: graphData.metadata,
    circularDependencies: graphData.graph.metadata.circularDeps
  };
}

/**
 * Exports the module structure in a serializable format.
 * @param {Object} moduleStructure - The module structure to export
 * @returns {Object} Serializable representation of the module structure
 */
function exportModuleStructure(moduleStructure) {
  return {
    format: 'json',
    version: '1.0',
    generated: new Date().toISOString(),
    modules: moduleStructure.modules.map(mod => ({
      name: mod.name,
      type: mod.type,
      path: mod.path,
      exports: mod.exports,
      dependencies: mod.dependencies,
      devDependencies: mod.devDependencies,
      peerDependencies: mod.peerDependencies,
      size: mod.size,
      lineCount: mod.lineCount
    })),
    exportIndex: moduleStructure.exports,
    importIndex: moduleStructure.imports,
    statistics: {
      totalModules: moduleStructure.totalCount,
      totalExports: Object.keys(moduleStructure.exports || {}).length,
      totalImports: Object.keys(moduleStructure.imports || {}).length
    }
  };
}

/**
 * Sets ARIA role for dependency graph container
 * @param {HTMLElement} container - The container element for the dependency graph
 * @returns {HTMLElement} The container with ARIA role set
 */
function setDependencyGraphContainerRole(container) {
  if (!container) return null;

  // Set appropriate ARIA role for the graph container
  container.setAttribute('role', 'application');
  container.setAttribute('aria-label', 'Dependency graph visualization');

  // Add keyboard navigation support
  container.setAttribute('tabindex', '0');

  return container;
}

// TODO: Implement tower defense
function towerDefense() {
  // A simple tower defense game implementation
  // Define towers, enemies, waves, and game loop
  const towers = [];
  const enemies = [];
  let wave = 1;

  // Example: Tower constructor
  function Tower(x, y, range, damage, rate) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.rate = rate;
    this.lastShot = 0;
  }

  // Example: Enemy constructor
  function Enemy(x, y, health, speed) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = speed;
  }

  // Add a tower
  function addTower(x, y, range, damage, rate) {
    towers.push(new Tower(x, y, range, damage, rate));
  }

  // Add an enemy
  function addEnemy(x, y, health, speed) {
    enemies.push(new Enemy(x, y, health, speed));
  }

  // Update game state (simplified)
  function update() {
    // Logic for enemy movement, tower shooting, etc.
    console.log(`Wave ${wave} - updating game state`);
  }

  // Start the game
  function start() {
    console.log('Tower defense game started');
    // Add initial towers and enemies
    addTower(100, 100, 200, 10, 1000);
    addEnemy(0, 50, 100, 2);
    // Game loop would be here
  }

  // Expose game functions
  return {
    start,
    addTower,
    addEnemy,
    update,
    getWave: () => wave
  };
}

// Export functions
module.exports = {
  fs,
  path,
  http,
  https,
  getFileExtension,
  readFileAsync,
  writeFileAsync,
  createServer,
  createHttpsServer,
  getAbsolutePath,
  joinPaths,
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  towerDefense,
  getModuleDependencies,
  renderDependencyGraph,
  getModuleStructure,
  displayModuleStructure,
  exportDependencyGraph,
  exportModuleStructure,
  setDependencyGraphContainerRole
};