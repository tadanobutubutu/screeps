// Main game loop for Screeps (TODO: Existing main.js content before the merge conflict...)

module.exports = {
  loop: function() {
    // Clean up memory of dead creeps
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    // Your game logic here
  },
  // Add the following functions
  validateLandmark: validateLandmark,
  fixAccessibleSVGs: fixAccessibleSVGs,
  fixFakeLinks: fixFakeLinks,
  googleSignIn: googleSignIn,

  // Assuming the file is located at ...
};

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - Object containing module dependencies
 * @param {Object} options - Configuration options for rendering
 * @returns {string} String representation of the dependency graph
 */
export const renderDependencyGraph = (dependencies = {}, options = {}) => {
  const {
    maxDepth = 3,
    showVersions = false,
    format = 'text'
  } = options;

  const visited = new Set();
  const lines = [];

  const formatNode = (name, version) => {
    const versionStr = showVersions && version ? `@${version}` : '';
    return `${name}${versionStr}`;
  };

  const traverse = (moduleName, depth = 0, parentPath = []) => {
    if (depth > maxDepth) return;
    if (visited.has(moduleName)) {
      lines.push(`${'  '.repeat(depth)}└── ${formatNode(moduleName, dependencies[moduleName]?.version)} (circular)`);
      return;
    }
    if (parentPath.includes(moduleName)) {
      lines.push(`${'  '.repeat(depth)}└── ${formatNode(moduleName, dependencies[moduleName]?.version)} (duplicate)`);
      return;
    }

    visited.add(moduleName);
    const prefix = '  '.repeat(depth);
    const nodeInfo = formatNode(moduleName, dependencies[moduleName]?.version);
    
    if (depth === 0) {
      lines.push(nodeInfo);
    } else {
      lines.push(`${prefix}└── ${nodeInfo}`);
    }

    const deps = dependencies[moduleName]?.dependencies || [];
    deps.forEach((dep, index) => {
      const isLast = index === deps.length - 1;
      const connector = isLast ? '    ' : '│   ';
      const depVersion = dependencies[dep]?.version;
      
      if (depth === 0) {
        lines.push(`${connector}└── ${formatNode(dep, depVersion)}`);
      } else {
        lines.push(`${prefix}${connector}└── ${formatNode(dep, depVersion)}`);
      }
      
      if (dependencies[dep] && depth < maxDepth) {
        const newVisited = new Set(visited);
        const newPath = [...parentPath, moduleName];
        traverse(dep, depth + 1, newPath);
        visited.delete(dep);
      }
    });
  };

  const rootModules = Object.keys(dependencies);
  rootModules.forEach((moduleName, index) => {
    if (index > 0) {
      lines.push('');
    }
    traverse(moduleName);
  });

  if (format === 'json') {
    return JSON.stringify(dependencies, null, 2);
  }

  return lines.join('\n');
};

/**
 * Displays module structure for debugging purposes
 * @param {Object} structure - Object containing module structure
 * @param {Object} options - Configuration options for display
 * @returns {string} String representation of the module structure
 */
export const displayModuleStructure = (structure, options = {}) => {
  const {
    maxDepth = 5,
    showHidden = false,
    showSizes = false,
    indentType = 'ascii'
  } = options;

  const indent = indentType === 'unicode' ? '  ' : '  ';
  const visited = new Set();
  const lines = [];

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const displayNode = (name, node, depth, path = []) => {
    if (depth > maxDepth) return;
    if (path.includes(name)) return;
    if (!showHidden && name.startsWith('.')) return;

    const currentPath = [...path, name];
    const prefix = indent.repeat(depth);
    
    let displayName = name;
    if (showSizes && node.size) {
      displayName = `${name} (${formatSize(node.size)})`;
    }
    if (node.type) {
      displayName = `${name} [${node.type}]`;
    }

    if (depth === 0) {
      lines.push(displayName);
    } else {
      lines.push(`${