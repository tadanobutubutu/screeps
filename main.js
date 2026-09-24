// TODO: This is the existing code that needs to be preserved

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

/**
 * Parses module code to extract dependencies
 * @param {string} moduleCode - The module code to parse
 * @returns {string[]} Array of dependency names
 */
function parseModuleDependencies(moduleCode) {
  const dependencies = [];
  const requirePattern = /require\s*\(['"]([^'"]+)['"]\)/g;
  let match;
  
  while ((match = requirePattern.exec(moduleCode)) !== null) {
    dependencies.push(match[1]);
  }
  
  return dependencies;
}

/**
 * Builds a dependency graph from a collection of modules
 * @param {Object[]} modules - Array of module objects with id, name, and code properties
 * @returns {Object} Graph object containing nodes and edges
 */
function buildDependencyGraph(modules) {
  const graph = {
    nodes: [],
    edges: []
  };

  modules.forEach((module) => {
    const nodeId = module.id || module.name;

    graph.nodes.push({
      id: nodeId,
      name: module.name || nodeId,
      type: module.type || 'module'
    });

    const dependencies = parseModuleDependencies(module.code || '');
    dependencies.forEach((dep) => {
      graph.edges.push({
        from: nodeId,
        to: dep
      });
    });
  });

  return graph;
}

/**
 * Renders a dependency graph as a visual ASCII representation
 * @param {Object} graph - Graph object with nodes and edges
 * @returns {string} ASCII representation of the dependency graph
 */
function renderDependencyGraph(graph) {
  if (!graph.nodes || graph.nodes.length === 0) {
    return 'No modules found in dependency graph.';
  }

  let output = 'Dependency Graph:\n';
  output += '═'.repeat(60) + '\n';

  graph.nodes.forEach((node) => {
    const dependencies = graph.edges
      .filter((edge) => edge.from === node.id)
      .map((edge) => edge.to);

    const depsString = dependencies.length > 0 
      ? ` → [${dependencies.join(', ')}]` 
      : '';

    output += `📦 ${node.name}${depsString}\n`;
  });

  return output;
}

/**
 * Displays the module structure as a formatted tree for debugging
 * @param {Object[]} modules - Array of module objects
 * @param {Object} options - Optional display options
 * @returns {string} Formatted module structure tree
 */
function displayModuleStructure(modules, options = {}) {
  const showDetails = options.showDetails || false;

  if (!modules || modules.length === 0) {
    return 'No modules found.';
  }

  let output = 'Module Structure:\n';
  output += '═'.repeat(60) + '\n';

  modules.forEach((module, index) => {
    const prefix = index === modules.length - 1 ? '└── ' : '├── ';
    output += `${prefix}📁 ${module.name || module.id || `module-${index}`}`;

    if (showDetails && module.type) {
      output += ` (${module.type})`;
    }

    const dependencies = parseModuleDependencies(module.code || '');
    if (showDetails && dependencies.length > 0) {
      output += `\n    └── deps: ${dependencies.join(', ')}`;
    }

    output += '\n';
  });

  output += '═'.repeat(60);
  return output;
}

/**
 * Generates a summary report of the dependency graph
 * @param {Object} graph - Graph object with nodes and edges
 * @returns {string} Summary report string
 */
function generateGraphSummary(graph) {
  const nodeCount = graph.nodes ? graph.nodes.length : 0;
  const edgeCount = graph.edges ? graph.edges.length : 0;

  let report = 'Dependency Graph Summary:\n';
  report += '─'.repeat(40) + '\n';
  report += `Total Modules: ${nodeCount}\n`;
  report += `Total Dependencies: ${edgeCount}\n`;
  report += '─'.repeat(40);

  return report;
}