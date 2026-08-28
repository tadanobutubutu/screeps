// main.js

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse');

/**
 * Counts dependencies for a given module file or code content
 * @param {string} input - File path or code content
 * @param {object} options - Options object
 * @param {boolean} options.isFilePath - Whether input is a file path (default: true)
 * @returns {number} The number of dependencies found
 */
function countDependencies(input, options = { isFilePath: true }) {
  let code;
  
  if (options.isFilePath) {
    try {
      code = fs.readFileSync(input, 'utf8');
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      return 0;
    }
  } else {
    code = input;
  }

  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['importMeta', 'topLevelAwait']
    });

    let dependencyCount = 0;

    traverse(ast, {
      ImportDeclaration(path) {
        dependencyCount++;
      },
      CallExpression(path) {
        if (path.node.callee.name === 'require' && 
            path.node.arguments.length > 0 &&
            path.node.arguments[0].type === 'StringLiteral') {
          dependencyCount++;
        }
      },
      ExportNamedDeclaration(path) {
        if (path.node.source) {
          dependencyCount++;
        }
      },
      ExportAllDeclaration(path) {
        if (path.node.source) {
          dependencyCount++;
        }
      }
    });

    return dependencyCount;
  } catch (error) {
    console.error(`Error parsing code: ${error.message}`);
    return 0;
  }
}

// If this is being run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const result = countDependencies(args[0]);
    console.log(`Dependencies found: ${result}`);
  }
}

module.exports = { countDependencies };