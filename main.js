// main.js
// Entry point of the application

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

function getAppInfo() {
  return {
    name: 'SampleApp',
    version: '1.0.0',
    description: 'A sample application'
  };
}

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

function renderDependencyGraph(graph) {
  if (!graph || typeof graph !== 'object') {
    throw new Error('Invalid graph provided');
  }

  const nodes = Object.keys(graph);
  let output = 'Dependency Graph:\n';
  output += '================\n';

  nodes.forEach((node) => {
    const dependencies = Array.isArray(graph[node]) ? graph[node] : [];
    if (dependencies.length === 0) {
      output += `${node} -> (no dependencies)\n`;
    } else {
      output += `${node} -> ${dependencies.join(', ')}\n`;
    }
  });

  return output;
}

function displayModuleStructure(modules) {
  if (!Array.isArray(modules)) {
    throw new Error('Modules must be provided as an array');
  }

  let output = 'Module Structure:\n';
  output += '=================\n';

  modules.forEach((module, index) => {
    const name = module && module.name ? module.name : `Module ${index + 1}`;
    const path = module && module.path ? module.path : 'unknown';
    const exports = module && Array.isArray(module.exports) ? module.exports : [];

    output += `\n[${name}]\n`;
    output += `  Path: ${path}\n`;

    if (exports.length === 0) {
      output += `  Exports: (none)\n`;
    } else {
      output += `  Exports: ${exports.join(', ')}\n`;
    }
  });

  return output;
}

function buildDependencyMap(modules) {
  if (!Array.isArray(modules)) {
    throw new Error('Modules must be provided as an array');
  }

  const map = {};
  modules.forEach((module) => {
    if (module && module.name) {
      map[module.name] = Array.isArray(module.dependencies) ? module.dependencies : [];
    }
  });
  return map;
}

module.exports = {
  greet,
  add,
  subtract,
  multiply,
  divide,
  getAppInfo,
  renderDependencyGraph,
  displayModuleStructure,
  buildDependencyMap
};