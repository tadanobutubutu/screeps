// Main module

// TODO: Implement divide function that handles division with proper error handling (from HEAD)
// TODO: Any additional changes requested in the issue

/**
 * Calculates the depth of dependency tree
 * @param {Object} dependencies - The dependency object
 * @param {string} currentKey - Current key being processed
 * @returns {number} Maximum depth of the dependency tree
 */
function getDependencyDepth(dependencies, currentKey = '') {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0;
  }

  let maxDepth = 0;
  const keys = Object.keys(dependencies);

  keys.forEach(key => {
    const value = dependencies[key];
    if (typeof value === 'object' && value !== null) {
      const nestedDepth = getDependencyDepth(value, key);
      maxDepth = Math.max(maxDepth, nestedDepth + 1);
    }
  });

  return maxDepth;
}

/**
 * Renders a dependency graph as ASCII art for debugging purposes.
 * @param {Object} dependencies - The dependency object
 * @param {string} prefix - Current prefix for indentation
 * @param {boolean} isLast - Whether this is the last item at current level
 * @returns {string} ASCII representation of the dependency graph
 */
function renderDependencyGraph(dependencies, prefix = '', isLast = true) {
  if (!dependencies || typeof dependencies !== 'object') {
    return '';
  }

  let output = '';
  const keys = Object.keys(dependencies);

  keys.forEach((key, index) => {
    const isLastItem = index === keys.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const value = dependencies[key];

    output += `${prefix}${connector}${key}`;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      output += '/\\n';
      const extension = isLast ? '    ' : '│   ';
      output += renderDependencyGraph(value, prefix + extension, isLastItem);
    } else {
      output += ` -> ${value}\\n`;
    }
  });

  return output;
}

// Function to resolve the merge conflict for the divide function
function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }

  // Merge the signature from the HEAD and apply any additional changes requested in the issue
  const result = a / b;

  // Add any necessary changes related to the divide function, such as error handling or logging
  // ...

  return result;
}

module.exports = { divide, getDependencyDepth, renderDependencyGraph };