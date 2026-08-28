// TODO: Address accessibility issues from insight report: add aria attributes

/* Your existing code */

// Function to create an alert (example)
function showAlert(message) {
  /* Your existing code */
}

// Add the accessibility enhancement
function showAccessibleAlert(message) {
  const alertContainer = document.createElement('div');
  alertContainer.textContent = message;
  alertContainer.setAttribute('role', 'alert');
  alertContainer.setAttribute('aria-live', 'polite'); // updated
  document.body.appendChild(alertContainer);

  /* Add a timeout and remove the alert container, update the implementation as needed */
}

// Dependency Graph Analyzer Module
const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { getUserData, calculateTotalPrice } = require('./utils.js');

// TODO: Add any updates related to new functions
// TODO: Identify and update specific functions that render dependency graphs or
// index views.

/**
 * Parses a JavaScript file and extracts dependency information
 * @param {string} filePath - Path to the JavaScript file
 * @returns {Array} - Array of dependency paths found in the file
 */
function parseDependencies(filePath) {
    const dependencies = [];
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const ast = parse(content, {
            sourceType: 'module',
            plugins: ['import', 'export']
        });
        
        traverse(ast, {
            ImportDeclaration: function(path) {
                dependencies.push({
                    type: 'import',
                    source: path.node.source.value,
                    specifiers: path.node.specifiers.map(s => s.local.name)
                });
            },
            ExportNamedDeclaration: function(path) {
                if (path.node.source) {
                    dependencies.push({
                        type: 'export',
                        source: path.node.source.value
                    });
                }
            },
            CallExpression: function(path) {
                if (path.node.callee.name === 'require') {
                    dependencies.push({
                        type: 'require',
                        source: path.node.arguments[0].value
                    });
                }
            }
        });
    } catch (error) {
        console.error(`Error parsing ${filePath}:`, error.message);
    }
    
    return dependencies;
}

/**
 * Generates a dependency graph from a directory of files
 * @param {string} directory - Root directory to analyze
 * @returns {Object} - Graph data structure representing dependencies
 */
function generateDependencyGraph(directory) {
    const graph = {
        nodes: [],
        edges: [],
        metadata: {
            createdAt: new Date().toISOString(),
            rootPath: directory
        }
    };
    
    const processedFiles = new Set();
    
    function processFile(filePath, relativePath) {
        if (processedFiles.has(filePath)) {
            return;
        }
        processedFiles.add(filePath);
        
        if (!graph.nodes.find(n => n.id === relativePath)) {
            graph.nodes.push({
                id: relativePath,
                path: filePath,
                type: path.extname(filePath)
            });
        }
        
        const deps = parseDependencies(filePath);
        
        deps.forEach(dep => {
            let resolvedPath;
            try {
                resolvedPath = require.resolve(dep.source, { paths: [path.dirname(filePath)] });
                const depRelativePath = path.relative(directory, resolvedPath);
                
                if (!graph.nodes.find(n => n.id === depRelativePath)) {
                    graph.nodes.push({
                        id: depRelativePath,
                        path: resolvedPath,
                        type: path.extname(resolvedPath)
                    });
                }
                
                graph.edges.push({
                    source: relativePath,
                    target: depRelativePath,
                    type: dep.type
                });
                
                processFile(resolvedPath, depRelativePath);
            } catch (e) {
                // External dependency, skip
            }
        });
    }
    
    const jsFiles = getJavaScriptFiles(directory);
    jsFiles.forEach(file => {
        const relativePath = path.relative(directory, file);
        processFile(file, relativePath);
    });
    
    return graph;
}

/**
 * Renders dependency graph to ASCII representation
 * @param {Object} graph - Graph data structure
 * @returns {string} - ASCII representation of the graph
 */
function renderDependencyGraph(graph) {
    let output = 'Dependency Graph\n';
    output += '================\n\n';
    
    graph.nodes.forEach(node => {
        const outgoing = graph.edges.filter(e => e.source === node.id);
        const incoming = graph.edges.filter(e => e.target === node.id);
        
        output += `📄 ${node.id}\n`;
        
        if (incoming.length > 0) {
            output += '   ↑ Dependencies:\n';
            incoming.forEach(edge => {
                output += `   └── ${edge.source} (${edge.type})\n`;
            });
        }
        
        if (outgoing.length > 0) {
            output += '   ↓ Dependents:\n';
            outgoing.forEach(edge => {
                output += `   └── ${edge.target}\n`;
            });
        }
        
        output += '\n';
    });
    
    return output;
}

/**
 * Renders dependency graph as JSON for visualization
 * @param {Object} graph - Graph data structure
 * @returns {string} - JSON representation for visualization tools
 */
function renderDependencyGraphJSON(graph) {
    return JSON.stringify({
        nodes: graph.nodes.map(n => ({
            id: n.id,
            label: path.basename(n.id, path.extname(n.id)),
            type: n.type
        })),
        edges: graph.edges.map(e => ({
            source: e.source,
            target: e.target,
            label: e.type
        })),
        metadata: graph.metadata
    }, null, 2);
}

/**
 * Gets all JavaScript files from a directory recursively
 * @param {string} directory - Directory to search
 * @returns {Array} - Array of file paths
 */
function getJavaScriptFiles(directory) {
    const jsFiles = [];
    
    function walk(dir) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                walk(filePath);
            } else if (/\.js$/.test(file) && !file.startsWith('.')) {
                jsFiles.push(filePath);
            }
        });
    }
    
    walk(directory);
    return jsFiles;
}

/**
 * Analyzes and reports circular dependencies in the graph
 * @param {Object} graph - Graph data structure
 * @returns {Array} - Array of circular dependency chains
 */
function detectCircularDependencies(graph) {
    const cycles = [];
    const visited = new Set();
    const recursionStack = new Set();
    
    function dfs(nodeId, path) {
        if (recursionStack.has(nodeId)) {
            const cycleStart = path.indexOf(nodeId);
            if (cycleStart !== -1) {
                cycles.push([...path.slice(cycleStart), nodeId]);
            }
            return;
        }
        
        if (visited.has(nodeId)) {
            return;
        }
        
        visited.add(nodeId);
        recursionStack.add(nodeId);
        path.push(nodeId);
        
        const outgoing = graph.edges.filter(e => e.source === nodeId);
        outgoing.forEach(edge => {
            dfs(edge.target, [...path]);
        });
        
        recursionStack.delete(nodeId);
    }
    
    graph.nodes.forEach(node => {
        dfs(node.id, []);
    });
    
    return cycles;
}

/**
 * Generates a DOT representation for Graphviz
 * @param {Object} graph - Graph data structure
 * @returns {string} - DOT format string
 */
function renderDependencyGraphDOT(graph) {
    let dot = 'digraph dependencies {\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [shape=box];\n\n';
    
    graph.nodes.forEach(node => {
        const label = node.id.replace(/\\/g, '/');
        dot += `  "${node.id}" [label="${label}"];\n`;
    });
    
    dot += '\n';
    
    graph.edges.forEach(edge => {
        dot += `  "${edge.source}" -> "${edge.target}" [label="${edge.type}"];\n`;
    });
    
    dot += '}\n';
    
    return dot;
}

/**
 * Renders an index view
 * @param {Array} items - The items to display in the index
 * @returns {string} The rendered index view
 */
function renderIndexView(items) {
  // Implementation for rendering index views
  return '';
}

function initializeApp() {
  // Initialize the application
  console.log('App initialized');
}

function setupEventListeners() {
  // Setup all event listeners
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
  });
}

function handleButtonClick(event) {
  const target = event.target;
  // Handle button clicks
  if (target.id === 'checkout') {
    processCheckout();
  } else if (target.classList.contains('add-to-cart')) {
    addToCart(target.dataset productId);
  }
}

function addToCart(productId) {
  console.log('Adding to cart:', productId);
  const product = getProductById(productId);
  if (product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }
}

function removeFromCart(productId) {
  console.log('Removing from cart:', productId);
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Expose all functions, including both alert functions and dependency analyzer
module.exports = {
    showAlert,
    showAccessibleAlert,
    parseDependencies,
    generateDependencyGraph,
    renderDependencyGraph,
    renderDependencyGraphJSON,
    renderDependencyGraphDOT,
    detectCircularDependencies,
    getJavaScriptFiles,
    renderIndexView,
    initializeApp,
    setupEventListeners,
    handleButtonClick,
    addToCart,
    removeFromCart
};

// CLI execution
if (require.main === module) {
    const targetDir = process.argv[2] || process.cwd();
    console.log(`Analyzing dependencies in: ${targetDir}\n`);
    
    const graph = generateDependencyGraph(targetDir);
    console.log(renderDependencyGraph(graph));
    
    const cycles = detectCircularDependencies(graph);
    if (cycles.length > 0) {
        console.log('⚠️ Circular Dependencies Detected:');
        cycles.forEach((cycle, i) => {
            console.log(`  ${i + 1}. ${cycle.join(' → ')}`);
        });
    }
}