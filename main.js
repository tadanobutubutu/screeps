import { dependencyGraphContent, indexContent } from './content';

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

// Assuming this is what your main.js might look like before the implementation
// You'll need to integrate this with your actual main.js content

// Existing code would be here...

/**
 * Renders a dependency graph visualization for debugging purposes
 * @param {Object} dependencies - Object containing module dependencies
 * @param {string} [format='tree'] - Output format ('tree', 'list', 'json')
 * @returns {string} Formatted dependency graph
 */
function renderDependencyGraph(dependencies, format = 'tree') {
  if (!dependencies || typeof dependencies !== 'object') {
    return 'Invalid dependencies object';
  }

  switch (format) {
    case 'tree':
      return renderDependencyTree(dependencies);
    case 'list':
      return renderDependencyList(dependencies);
    case 'json':
      return JSON.stringify(dependencies, null, 2);
    default:
      return 'Unsupported format';
  }
}

/**
 * Helper function to render dependencies in tree format
 * @param {Object} dependencies - Object containing module dependencies
 * @returns {string} Tree-formatted dependency graph
 */
function renderDependencyTree(dependencies) {
  let result = 'Dependency Graph:\n';
  
  function traverse(obj, prefix = '') {
    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      const prefixCurrent = isLast ? '└── ' : '├── ';
      const prefixNext = isLast ? '    ' : '│   ';
      
      result += prefix + prefixCurrent + key + '\n';
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        traverse(obj[key], prefix + prefixNext);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, i) => {
          const isLastItem = i === obj[key].length - 1;
          const itemPrefix = isLastItem ? '└── ' : '├── ';
          result += prefix + prefixNext + itemPrefix + item + '\n';
        });
      } else {
        result += prefix + prefixNext + '└── ' + obj[key] + '\n';
      }
    });
  }
  
  traverse(dependencies);
  return result;
}

/**
 * Helper function to render dependencies in list format
 * @param {Object} dependencies - Object containing module dependencies
 * @returns {string} List-formatted dependency graph
 */
function renderDependencyList(dependencies) {
  let result = 'Dependency List:\n';
  let counter = 1;
  
  function traverse(obj, parentKey = '') {
    const keys = Object.keys(obj);
    keys.forEach(key => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        traverse(obj[key], fullKey);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          const arrayKey = `${fullKey}[${index}]`;
          result += `${counter++}. ${arrayKey}: ${item}\n`;
        });
      } else {
        result += `${counter++}. ${fullKey}: ${obj[key]}\n`;
      }
    });
  }
  
  traverse(dependencies);
  return result;
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
  result += `Total modules: ${Object.keys(modules).length}\n\n`;
  
  Object.keys(modules).forEach((moduleName, index) => {
    const module = modules[moduleName];
    result += `${index + 1}. Module: ${moduleName}\n`;
    
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

export {
  renderDependencyGraph,
  renderDependencyTree,
  renderDependencyList