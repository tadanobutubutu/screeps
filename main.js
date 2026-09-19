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
      result += `   Exports: ${module.exports}\n`;
    }
    
    result += '\n';
  });
  
  return result;
}

// ============================================
// REACT_025: Accessibility improvements as per insight report
// ============================================

// Screen reader live region container (for ARIA live announcements)
let liveRegionContainer = null;

/**
 * Creates or gets the ARIA live region for screen reader announcements
 * @returns {HTMLElement} The live region element
 */
function getLiveRegion() {
  if (!liveRegionContainer) {
    liveRegionContainer = document.createElement('div');
    liveRegionContainer.setAttribute('role', 'status');
    liveRegionContainer.setAttribute('aria-live', 'polite');
    liveRegionContainer.setAttribute('aria-atomic', 'true');
    liveRegionContainer.className = 'sr-only';
    liveRegionContainer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(liveRegionContainer);
  }
  return liveRegionContainer;
}

/**
 * Announces a message to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} [priority='polite'] - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const region = getLiveRegion();
  region.setAttribute('aria-live', priority);
  
  // Clear and set message to trigger announcement
  region.textContent = '';
  setTimeout(() => {
    region.textContent = message;
  }, 50);
  
  // Clean up after announcement
  setTimeout(() => {
    region.textContent = '';
  }, 1000);
}

/**
 * Traps focus within a specified element (for modals/dialogs)
 * @param {HTMLElement} element - The element to trap focus within
 * @returns {Function} Cleanup function to release focus trap
 */
function trapFocus(element) {
  if (!element) return () => {};

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown);
  
  // Focus the first focusable element
  if (firstFocusable) {
    firstFocusable.focus();
  }

  // Return cleanup function
  return function releaseFocus() {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Adds accessibility attributes to rendered content containers
 * @param {HTMLElement} container - The container element to enhance
 * @param {Object} options - Configuration options
 * @param {string} [options.label] - ARIA label for the container
 * @param {string} [options.role] - ARIA role for the container
 * @param {boolean} [options.labelled] - Whether to announce changes
 */
function enhanceAccessibility(container, options = {}) {
  if (!container) return;

  const { label, role, labelled = true } = options;

  if (label) {
    container.setAttribute('aria-label', label);
  }
  
  if (role) {
    container.setAttribute('role', role);
  }

  if (labelled) {
    container.setAttribute('aria-labelledby', label ? undefined : 'main-heading');
  }

  // Make focusable for keyboard navigation
  container.setAttribute('tabindex', '-1');
}

/**
 * Handles keyboard navigation for list-like structures
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Object[]} items - Array of items in the list
 * @param {Function} onSelect - Callback when item is selected
 * @param {number} currentIndex - Current selected index
 */
function handleListKeyboardNavigation(event, items, onSelect, currentIndex) {
  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowDown':
    case 'j':
      event.preventDefault();
      newIndex = Math.min(currentIndex + 1, items.length - 1);
      break;
    case 'ArrowUp':
    case 'k':
      event.preventDefault();
      newIndex = Math.max(currentIndex - 1, 0);
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = items.length - 1;
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      onSelect(items[newIndex], newIndex);
      return;
    default:
      return;
  }

  if (newIndex !== currentIndex) {
    onSelect(items[newIndex], newIndex);
  }
}

/**
 * Sets up skip link functionality for main content
 * @param {string} mainContentId - ID of the main content element
 */
function setupSkipLink(mainContentId = 'main-content') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${mainContentId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = 'position:absolute;top:-40px;left:0;background:#000;color:#fff;padding:8px;z-index:100;transition:top 0.3s;';
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Announces render completion to screen readers
 * @param {string} contentType - Type of content being rendered
 * @param {number} itemCount - Number of items rendered
 */
function announceRenderComplete(contentType, itemCount) {
  const message = itemCount > 0 
    ? `${contentType} rendered successfully. ${itemCount} items displayed.`
    : `${contentType} rendered. No items to display.`;
  
  announceToScreenReader(message, 'polite');
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
  renderDependencyList