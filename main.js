// Main module entry point

// Function 1: Simple greeting
function greet(name) {
    return `Hello, ${name}!`;
}

// Function 2: Calculate sum
function sum(a, b) {
    return a + b;
}

// Function 3: Check if even
function isEven(num) {
    return num % 2 === 0;
}

// Function 4: Get current timestamp
function getTimestamp() {
    return Date.now();
}

const VERSION = '1.0.0';
const APP_NAME = 'MyApp';

// Existing function
function hello() {
  return 'Hello, World!';
}

// Existing function
function getConfig() {
  return { version: VERSION, name: APP_NAME };
}

// Additional helper functions
function isValid(value) {
  return value !== null && value !== undefined;
}

function capitalize(str) {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

// Original rendering functions from HEAD
function renderDependencyGraph(graph) {
    if (!graph || typeof graph !== 'object') {
        return '';
    }

    const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
    const edges = Array.isArray(graph.edges) ? graph.edges : [];

    const nodeSet = new Set(nodes.map(n => n && n.id).filter(Boolean));
    const validEdges = edges.filter(e => nodeSet.has(e.from) && nodeSet.has(e.to));

    const lines = [];
    lines.push('digraph dependencies {');
    lines.push('  rankdir=LR;');
    lines.push('  node [shape=box, style=filled, fillcolor="#eef"];');

    for (const node of nodes) {
        if (node && node.id) {
            const label = (node.label || node.id).replace(/"/g, '\\"');
            lines.push(`  "${node.id}" [label="${label}"];`);
        }
    }

    for (const edge of validEdges) {
        lines.push(`  "${edge.from}" -> "${edge.to}";`);
    }

    lines.push('}');
    return lines.join('\n');
}

function renderIndexView(items) {
    if (!Array.isArray(items)) {
        return '';
    }

    const lines = [];
    lines.push('# Index');
    lines.push('');

    items.forEach((item, index) => {
        if (!item) {
            return;
        }
        const title = item.title || item.name || `Item ${index + 1}`;
        const id = item.id !== undefined ? item.id : index;
        lines.push(`- [${title}](#item-${id})`);
    });

    lines.push('');
    return lines.join('\n');
}

function updateDependencyGraph(view, graph) {
    if (!view) {
        return null;
    }
    const rendered = renderDependencyGraph(graph);
    view.graphSource = rendered;
    view.lastUpdated = new Date().toISOString();
    return view;
}

function updateIndexView(view, items) {
    if (!view) {
        return null;
    }
    view.indexSource = renderIndexView(items);
    view.lastUpdated = new Date().toISOString();
    return view;
}

// Accessibility functions
function addLangAttributeToElement(element) {
    if (element && element.nodeType === Node.ELEMENT_NODE) {
        element.setAttribute('lang', 'en'); // Example: Set language to English
    }
}

function addLandmarkRolesAndFixIssues(element, role) {
    if (element && element.nodeType === Node.ELEMENT_NODE) {
        element.setAttribute('role', role);
    }
}

function addAccessibleNamesToSVGs(svgElements) {
    svgElements.forEach(svg => {
        if (svg && svg instanceof SVGElement) {
            const accessibleName = svg.getAttribute('name') || svg.getAttribute('title');
            if (accessibleName) {
                svg.setAttribute('aria-label', accessibleName);
            }
        }
    });
}

function ensureUniqueLandmarks(elements) {
    const landmarks = new Set();
    elements.forEach(element => {
        const role = element.getAttribute('role');
        if (role && landmarks.has(role)) {
            // Handle duplicate landmark role, e.g., throw error or log a warning
        } else {
            landmarks.add(role);
        }
    });
}

function fixFakeLinkIssues(links) {
    links.forEach(link => {
        if (link && link.href) {
            const text = link.textContent || link.innerText || '';
            if (text.trim() === link.href) {
                // The link text is the same as the URL, which might be a fake link.
                // Here we add an aria-label for accessibility.
                link.setAttribute('aria-label', 'Click to go to the link');
            }
        }
    });
}

function addScopeToTableHeaders(thElements) {
    thElements.forEach(th => {
        if (th && th.nodeType === Node.ELEMENT_NODE) {
            th.setAttribute('scope', 'col'); // or 'row' if applicable
        }
    });
}

// Export all functions and constants
module.exports = {
  // Constants
  VERSION,
  APP_NAME,
  // Existing functions
  hello,
  getConfig,
  // Accessibility functions
  addLangAttributeToElement,
  addLandmarkRolesAndFixIssues,
  addAccessibleNamesToSVGs,
  ensureUniqueLandmarks,
  fixFakeLinkIssues,
  addScopeToTableHeaders,
  // Existing functions from HEAD
  isValid,
  capitalize,
  greet,
  formatDate,
  renderDependencyGraph,
  renderIndexView,
  updateDependencyGraph,
  updateIndexView,
  sum,
  isEven,
  getTimestamp
};