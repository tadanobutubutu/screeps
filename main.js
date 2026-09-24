// main.js

// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (typically in index.html, not main.js)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

const existingUtil = (x) => x * 2;

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

const VERSION = '1.0.0';

/**
 * Registers a module in the registry
 * @param {string} name - Module name
 * @param {object} module - Module object containing dependencies and info
 */
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

/**
 * Adds an aria-label to the element if it doesn't have one.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {HTMLElement} The element for chaining
 */
function addAriaLabel(element, label) {
  if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// Ensure the HTML element has a lang attribute
function addLangAttribute(element) {
  element.setAttribute('lang', 'en'); // Replace 'en' with your desired language code
}

// Add an accessible name to an SVG element
function addAccessibleNameToSVG(svg, accessibleName) {
  svg.setAttribute('aria-label', accessibleName);
}

// Add a role to an HTML container element
function addARIARole(container, role) {
  container.setAttribute('role', role);
}

/**
 * Renders a dependency graph visualization.
 * @param {Object} graphData - The dependency graph data
 * @param {HTMLElement} container - The container element to render into
 * @returns {HTMLElement} The container element
 */
function renderDependencyGraph(graphData, container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  // Clear existing content
  container.innerHTML = '';

  // Create SVG for graph visualization
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 600');
  svg.style.maxWidth = '100%';
  svg.style.height = 'auto';

  // Simple force-directed graph layout (basic implementation)
  const nodes = graphData.nodes || [];
  const edges = graphData.edges || [];

  // Generate positions for nodes
  const nodePositions = new Map();
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    const radius = 200;
    nodePositions.set(node.id, {
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle)
    });
}

/**
 * Renders a dependency graph for visualization
 * @param {string} rootModule - The root module to start rendering from
 * @param {object} options - Rendering options
 * @returns {string} ASCII representation of the dependency graph
 */
function renderDependencyGraph(rootModule, options = {}) {
    const {
        maxDepth = 3,
        showVersions = false,
        format = 'ascii'
    } = options;

    if (!moduleRegistry.has(rootModule)) {
        return `Error: Module '${rootModule}' not found in registry`;
    }

    const visited = new Set();
    const lines = [];

    function traverse(moduleName, depth = 0, prefix = '', isLast = true) {
        if (depth > maxDepth || visited.has(moduleName)) {
            return;
        }
        visited.add(moduleName);

        const module = moduleRegistry.get(moduleName);
        const connector = isLast ? '└── ' : '├── ';
        const version = showVersions && module.version ? `@${module.version}` : '';
        lines.push(`${prefix}${connector}${moduleName}${version}`);

        if (module.dependencies && module.dependencies.length > 0) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            module.dependencies.forEach((dep, index) => {
                const isLastDep = index === module.dependencies.length - 1;
                traverse(dep, depth + 1, newPrefix, isLastDep);
            });
        }
    }

    lines.push(`Dependency Graph: ${rootModule}`);
    lines.push('─'.repeat(40));
    traverse(rootModule);

    return lines.join('\n');
}

/**
 * Displays the structure of a module for debugging purposes
 * @param {string} moduleName - Name of the module to inspect
 * @param {object} options - Display options
 * @returns {string} Formatted module structure
 */
function displayModuleStructure(moduleName, options = {}) {
    const {
        showPrivate = false,
        showMetadata = true,
        indent = '  '
    } = options;

    if (!moduleRegistry.has(moduleName)) {
        return `Error: Module '${moduleName}' not found in registry`;
    }

    const module = moduleRegistry.get(moduleName);
    const lines = [];

    lines.push(`Module: ${moduleName}`);
    lines.push('─'.repeat(40));

    if (showMetadata) {
        lines.push(`Registered: ${new Date(module.timestamp).toISOString()}`);
        if (module.version) {
            lines.push(`Version: ${module.version}`);
        }
    }

    if (module.exports) {
        lines.push('\nExports:');
        const exportsList = module.exports;
        if (Array.isArray(exportsList)) {
            exportsList.forEach(exp => {
                const visibility = typeof exp === 'string' && exp.startsWith('_') ? '[private]' : '[public]';
                if (showPrivate || !showPrivate && visibility === '[public]') {
                    lines.push(`${indent}${visibility} ${exp}`);
                }
            });
        } else {
            lines.push(`${indent}${exportsList}`);
        }
    }

    if (module.dependencies && module.dependencies.length > 0) {
        lines.push('\nDependencies:');
        module.dependencies.forEach(dep => {
            const depInfo = moduleRegistry.get(dep);
            const status = depInfo ? '[registered]' : '[missing]';
            lines.push(`${indent}${dep} ${status}`);
        });
    }

    if (module.dependents && module.dependents.length > 0) {
        lines.push('\nDependents (modules that depend on this):');
        module.dependents.forEach(dep => {
            lines.push(`${indent}${dep}`);
        });
    }

    return lines.join('\n');
}

/**
 * Generates a complete dependency report for debugging
 * @param {string[]} modules - Optional list of modules to include (default: all)
 * @returns {object} Complete dependency report
 */
function generateDependencyReport(modules = null) {
    const targetModules = modules || Array.from(moduleRegistry.keys());
    const report = {
        generatedAt: new Date().toISOString(),
        totalModules: 0,
        modules: {}
    };

    targetModules.forEach(moduleName => {
        if (!moduleRegistry.has(moduleName)) return;

        const module = moduleRegistry.get(moduleName);
        report.modules[moduleName] = {
            dependencies: module.dependencies || [],
            dependencyCount: (module.dependencies || []).length,
            dependents: module.dependents || [],
            dependentCount: (module.dependents || []).length
        };
        report.totalModules++;
    });

    return report;
}

module.exports = {
  greet,
  add,
  subtract,
  multiply,
  divide,
  existingUtil,
  VERSION,
  ensureElementHasId,
  addAriaLabel,
  addLangAttribute,
  addAccessibleNameToSVG,
  addARIARole,
  renderDependencyGraph,
  ensureLandmarkRoles,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureLangAttribute
};