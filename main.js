import { dependencyGraphContent, indexContent } from './content';

// TODO: Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
// export function calculateSum(a, b) { return a + b; }

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

/**
 * Creates an in-page button element with proper accessibility attributes
 * @param {string} text - Button text/label
 * @param {Function} onClick - Click event handler
 * @param {Object} [options={}] - Additional button options
 * @param {string} [options.type='button'] - Button type ('button', 'submit', 'reset')
 * @param {string} [options.className] - CSS class name(s) for styling
 * @param {string} [options.id] - Button ID attribute
 * @param {boolean} [options.disabled=false] - Whether button is initially disabled
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  
  // Set button type (default to 'button')
  button.type = options.type || 'button';
  
  // Set button text/label
  button.textContent = text;
  
  // Set click handler
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Set CSS class if provided
  if (options.className) {
    button.className = options.className;
  }
  
  // Set ID if provided
  if (options.id) {
    button.id = options.id;
  }
  
  // Set disabled state if provided
  if (options.disabled) {
    button.disabled = true;
  }
  
  // Add accessibility attributes
  button.setAttribute('aria-label', options['aria-label'] || text);
  
  // Ensure keyboard accessibility
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.click();
    }
  });
  
  return button;
}

// Assuming this is what your main.js might look like before the implementation

// Existing code would be here...

// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
  // Placeholder implementation, this should be replaced with actual logic
  console.log('Checking landmark elements...');
  // Example: You might query the DOM for landmark elements and check their presence or properties
  // const landmarkElements = document.querySelectorAll('landmark');
  // landmarkElements.forEach(element => {
  //   console.log(`Found landmark element: ${element.id}`);
  // });
}

/**
 * Validates landmark elements for accessibility compliance
 * @param {Object} landmarkData - Object containing landmark information to validate
 * @returns {Object} Validation result with isValid flag and any errors found
 */
function validateLandmark(landmarkData) {
  const errors = [];
  
  if (!landmarkData || typeof landmarkData !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid landmark data provided']
    };
  }
  
  // Check for required landmarks
  const requiredLandmarks = ['main'];
  requiredLandmarks.forEach(landmark => {
    if (!landmarkData[landmark]) {
      errors.push(`Missing required landmark: ${landmark}`);
    }
  });
  
  // Check for proper landmark naming
  if (landmarkData.nav && !landmarkData.nav.name && !landmarkData.nav.ariaLabel) {
    errors.push('Navigation landmark should have an accessible name');
  }
  
  if (landmarkData.aside && !landmarkData.aside.name && !landmarkData.aside.ariaLabel) {
    errors.push('Complementary landmark (aside) should have an accessible name');
  }
  
  // Check for landmark conflicts
  if (landmarkData.header) {
    const headerCount = Array.isArray(landmarkData.header) 
      ? landmarkData.header.length 
      : 1;
    if (headerCount > 1) {
      errors.push('Multiple header landmarks detected - consider using one header with nested elements');
    }
  }
  
  // Validate landmark hierarchy
  if (landmarkData.main && landmarkData.main.nestedLandmarks) {
    const invalidNesting = landmarkData.main.nestedLandmarks.filter(
      nested => ['header', 'footer', 'main'].includes(nested)
    );
    if (invalidNesting.length > 0) {
      errors.push(`Invalid landmark nesting in main: ${invalidNesting.join(', ')} should not be nested inside main`);
    }
  }
  
  // Check for landmark redundancy
  if (landmarkData.nav && landmarkData.nav.isRedundant) {
    errors.push('Navigation landmark may be redundant if it is the only nav element');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Renders a dependency graph visualization for debugging purposes
 * @param {Object} dependencies - Object containing module dependencies
 * @param {string} [format='tree'] - Output format ('tree', 'list', 'json')
 * @returns {string} Formatted dependency graph
 */
function renderDependencyGraph(dependencies, format = 'tree') {
  // existing code for rendering dependency graph
}

/**
 * Helper function to render dependencies in tree format
 * @param {Object} dependencies - Object containing module dependencies
 * @returns {string} Tree-formatted dependency graph
 */
function renderDependencyTree(dependencies) {
  // existing code for rendering dependency tree
}

/**
 * Helper function to render dependencies in list format
 * @param {Object} dependencies - Object containing module dependencies
 * @returns {string} List-formatted dependency graph
 */
function renderDependencyList(dependencies) {
  // existing code for rendering dependency list
}

/**
 * Displays the module structure for debugging purposes
 * @param {Object} modules - Object describing module structure
 * @returns {string} Formatted module structure
 */
function displayModuleStructure(modules) {
  if (!modules || typeof modules !== 'object') {
    return 'Invalid modules object';
  }

  let result = 'Module Structure:\n';
  result += `Total modules: ${Object.keys(modules).length}\n`;
  
  Object.entries(modules).forEach(([moduleName, module]) => {
    const moduleIndex = Object.keys(modules).indexOf(moduleName) + 1;
    result += `${moduleIndex}. Module: ${moduleName}\n`;
    
    if (module.description) {
      result += `   Description: ${module.description}\n`;
    }
    
    if (module.version) {
      result += `   Version: ${module.version}\n`;
    }
    
    if (module.dependencies && Object.keys(module.dependencies).length > 0) {
      result += `   Dependencies: ${Object.keys(module.dependencies).join(', ')}\n`;
    }
    
    if (module.exports) {
      result += `   Exports: ${Array.isArray(module.exports) ? module.exports.join(', ') : module.exports}\n`;
    }
    
    result += '\n';
  });
  
  return result;
}

renderDependencyGraph(dependencyGraphContent);

// Calculate sum function (added back as per TODO)
export function calculateSum(a, b) { return a + b; }

/**
 * Spawns a child process with the given configuration
 * @param {Object} config - Configuration for spawning
 * @param {string} config.command - The command to execute
 * @param {string[]} [config.args] - Arguments to pass to the command
 * @param {Object} [config.options] - Options to pass to child_process.spawn
 * @param {Function} [config.onData] - Callback for stdout data
 * @param {Function} [config.onError] - Callback for stderr data
 * @returns {Promise<{exitCode: number, stdout: string, stderr: string}>} Spawn result
 */
async function spawnProcess(config) {
  const { command, args = [], options = {}, onData, onError } = config;
  
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    
    let stdout = '';
    let stderr = '';
    
    const child = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options
    });
    
    if (onData && child.stdout) {
      child.stdout.on('data', (data) => {
        const chunk = data.toString();
        stdout += chunk;
        onData(chunk);
      });
    }
    
    if (onError && child.stderr) {
      child.stderr.on('data', (data) => {
        const chunk = data.toString();
        stderr += chunk;
        onError(chunk);
      });
    }
    
    child.on('close', (exitCode) => {
      resolve({ exitCode, stdout, stderr });
    });
    
    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Spawns a process synchronously
 * @param {string} command - The command to execute
 * @param {string[]} [args] - Arguments to pass to the command
 * @param {Object} [options] - Options to pass to child_process.spawnSync
 * @returns {Object} Spawn result with exitCode, stdout, stderr, and error properties
 */
function spawnProcessSync(command, args = [], options = {}) {
  const { spawnSync } = require('child_process');
  
  const result = spawnSync(command, args, {
    stdio: ['pipe', 'pipe', 'pipe'],
    ...options
  });
  
  return {
    exitCode: result.status,
    stdout: result.stdout ? result.stdout.toString() : '',
    stderr: result.stderr ? result.stderr.toString() : '',
    error: result.error
  };
}

/**
 * Pools and manages spawned worker processes
 * @param {number} [maxWorkers=4] - Maximum number of concurrent workers
 */
class WorkerPool {
  constructor(maxWorkers = 4) {
    this.maxWorkers = maxWorkers;
    this.activeWorkers = [];
    this.taskQueue = [];
  }
  
  /**
   * Adds a task to the worker pool
   * @param {Function} taskFn - Async function to execute in worker
   * @param {*} taskData - Data to pass to the task function
   * @returns {Promise<*>} Result of the task
   */
  async addTask(taskFn, taskData) {
    return new Promise((resolve, reject) => {
      const task = { taskFn, taskData, resolve, reject };
      
      if (this.activeWorkers.length < this.maxWorkers) {
        this._startWorker(task);
      } else {
        this.taskQueue.push(task);
      }
    });
  }
  
  /**
   * @private
   */
  _startWorker(task) {
    this.activeWorkers.push(task);
    
    Promise.resolve()
      .then(() => task.taskFn(task.taskData))
      .then((result) => {
        task.resolve(result);
        this._finishWorker();
      })
      .catch((error) => {
        task.reject(error);
        this._finishWorker();
      });
  }
  
  /**
   * @private
   */
  _finishWorker() {
    const index = this.activeWorkers.indexOf(this.activeWorkers.find(w => w.resolve === this.activeWorkers[this.activeWorkers.length - 1]?.resolve));
    if (index > -1) {
      this.activeWorkers.splice(index, 1);
    }
    
    if (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue.shift();
      this._startWorker(nextTask);
    }
  }
  
  /**
   * Waits for all pending tasks to complete
   * @returns {Promise<void>}
   */
  async drain() {
    while (this.activeWorkers.length > 0 || this.taskQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

// Export the new functions if needed
module.exports = {
  // ... existing exports would go here
  renderDependencyGraph,
  renderDependencyTree,
  renderDependencyList,
  displayModuleStructure,
  createInPageButton
};