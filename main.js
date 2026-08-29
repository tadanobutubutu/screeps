// main.js

// Helper function to render dependency graph visualization
function renderDependencyGraph(dependencies, options = {}) {
  const {
    format = 'text',
    includeVersion = false,
    maxDepth = Infinity,
    groupBy = null
  } = options;

  if (format === 'text') {
    return generateTextGraph(dependencies, { includeVersion, maxDepth, groupBy });
  } else if (format === 'json') {
    return generateJsonGraph(dependencies, { includeVersion, maxDepth });
  } else if (format === 'dot') {
    return generateDotGraph(dependencies, { includeVersion, maxDepth });
  }
  
  return null;
}

// Helper function to display module structure for debugging
function displayModuleStructure(moduleMap, options = {}) {
  const {
    verbose = false,
    showHidden = false,
    showInternal = false,
    sortBy = 'name'
  } = options;

  const structure = {
    modules: [],
    totalCount: 0,
    warnings: []
  };

  for (const [moduleName, moduleData] of Object.entries(moduleMap)) {
    if (!showHidden && moduleName.startsWith('.')) continue;
    if (!showInternal && moduleName.startsWith('_')) continue;

    structure.modules.push({
      name: moduleName,
      exports: Object.keys(moduleData.exports || {}),
      dependencies: moduleData.dependencies || [],
      size: moduleData.size || 0
    });

    structure.totalCount++;
  }

  // Sort modules
  structure.modules.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'size') return b.size - a.size;
    return 0;
  });

  if (verbose) {
    structure.warnings = detectStructureIssues(structure.modules);
  }

  return structure;
}

// Generate text-based dependency graph
function generateTextGraph(dependencies, options) {
  const lines = [];
  const { includeVersion, maxDepth, groupBy } = options;

  for (const [pkg, deps] of Object.entries(dependencies)) {
    const versionInfo = includeVersion && deps.version ? `@${deps.version}` : '';
    lines.push(`${pkg}${versionInfo}`);

    if (deps.dependencies && deps.dependencies.length > 0) {
      const deptLimit = Math.min(deps.dependencies.length, maxDepth);
      for (let i = 0; i < deptLimit; i++) {
        const dep = deps.dependencies[i];
        lines.push(`  └── ${dep.name}${includeVersion && dep.version ? `@${dep.version}` : ''}`);
      }
      if (deps.dependencies.length > maxDepth) {
        lines.push(`  └── ... and ${deps.dependencies.length - maxDepth} more`);
      }
    }
  }

  return lines.join('\n');
}

// Generate JSON dependency graph
function generateJsonGraph(dependencies, options) {
  const { includeVersion, maxDepth } = options;
  
  const graph = {
    nodes: [],
    edges: [],
    metadata: {
      generated: new Date().toISOString(),
      totalPackages: Object.keys(dependencies).length
    }
  };

  for (const [pkg, data] of Object.entries(dependencies)) {
    const node = {
      id: pkg,
      label: pkg,
      version: includeVersion ? data.version : undefined
    };
    graph.nodes.push(node);

    if (data.dependencies) {
      const deptLimit = Math.min(data.dependencies.length, maxDepth);
      for (let i = 0; i < deptLimit; i++) {
        const dep = data.dependencies[i];
        graph.edges.push({
          from: pkg,
          to: dep.name,
          version: includeVersion ? dep.version : undefined
        });
      }
    }
  }

  return JSON.stringify(graph, null, 2);
}

// Generate DOT format graph for Graphviz
function generateDotGraph(dependencies, options) {
  const { includeVersion, maxDepth } = options;
  const lines = ['digraph dependencies {', '  rankdir=LR;', '  node [shape=box];'];

  for (const [pkg, data] of Object.entries(dependencies)) {
    const label = includeVersion && data.version ? `${pkg}\\n(${data.version})` : pkg;
    lines.push(`  "${pkg}" [label="${label}"];`);

    if (data.dependencies) {
      const deptLimit = Math.min(data.dependencies.length, maxDepth);
      for (let i = 0; i < deptLimit; i++) {
        const dep = data.dependencies[i];
        lines.push(`  "${pkg}" -> "${dep.name}";`);
      }
    }
  }

  lines.push('}');
  return lines.join('\n');
}

// Detect potential issues in module structure
function detectStructureIssues(modules) {
  const warnings = [];

  // Check for circular dependencies
  const checked = new Set();
  for (const mod of modules) {
    if (checked.has(mod.name)) continue;
    checked.add(mod.name);

    for (const dep of mod.dependencies || []) {
      const depModule = modules.find(m => m.name === dep.name);
      if (depModule && depModule.dependencies?.includes(mod.name)) {
        warnings.push(`Circular dependency detected: ${mod.name} <-> ${dep.name}`);
      }
    }
  }

  // Check for unused modules
  const allDeps = new Set();
  for (const mod of modules) {
    for (const dep of mod.dependencies || []) {
      allDeps.add(dep.name);
    }
  }

  for (const mod of modules) {
    if (!allDeps.has(mod.name) && mod.dependencies?.length > 0) {
      warnings.push(`Potentially unused module: ${mod.name}`);
    }
  }

  return warnings;
}

// Export functions for external use
module.exports = {
  renderDependencyGraph,
  displayModuleStructure,
  generateTextGraph,
  generateJsonGraph,
  generateDotGraph,
  detectStructureIssues
};

// TODO: Identify and update specific functions that render dependency graphs or display module structure for debugging purposes.
// Note: Functions above (renderDependencyGraph, displayModuleStructure, generateTextGraph, generateJsonGraph, 
// generateDotGraph, detectStructureIssues) provide comprehensive dependency graph rendering and module structure 
// visualization capabilities for debugging purposes.