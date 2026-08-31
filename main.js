// ============================================
// NEW: Debug and visualization utilities
// ============================================

/**
 * Render a dependency graph visualization
 * @param {Object} dependencies - Object representing dependencies (e.g., {module: [dependent1, dependent2]})
 * @param {string|HTMLElement} container - CSS selector or container element to render the graph in
 * @param {Object} options - Optional rendering options
 * @returns {Object} The visualization instance with update/destroy methods
 */
const renderDependencyGraph = (dependencies, container, options = {}) => {
  if (typeof document === 'undefined') return null;
  
  const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
  if (!containerEl) return null;
  
  const {
    nodeColor = () => '#4CAF50',
    nodeStyle = 'default',
    animated = false
  } = options;
  
  // Create visualization container
  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph-container';
  graphContainer.style.position = 'relative';
  graphContainer.style.width = '100%';
  graphContainer.style.height = '400px';
  graphContainer.style.overflow = 'auto';
  graphContainer.style.border = '1px solid #ddd';
  graphContainer.style.borderRadius = '4px';
  graphContainer.style.padding = '10px';
  graphContainer.style.backgroundColor = '#f9f9f9';
  
  // Simple text-based visualization for debugging
  const visualization = document.createElement('div');
  visualization.className = 'dependency-graph';
  visualization.innerHTML = '<h4>Dependency Graph (Debug View)</h4>';
  
  Object.entries(dependencies).forEach(([module, deps]) => {
    const moduleDiv = document.createElement('div');
    moduleDiv.style.marginBottom = '10px';
    moduleDiv.style.padding = '8px';
    moduleDiv.style.border = '1px solid #ddd';
    moduleDiv.style.borderRadius = '4px';
    moduleDiv.style.backgroundColor = nodeColor(module);
    
    const moduleName = document.createElement('strong');
    moduleName.textContent = module;
    moduleDiv.appendChild(moduleName);
    
    if (deps && deps.length > 0) {
      const depsList = document.createElement('ul');
      depsList.style.marginTop = '5px';
      depsList.style.marginLeft = '0';
      depsList.style.paddingLeft = '20px';
      
      deps.forEach(dep => {
        const depItem = document.createElement('li');
        depItem.textContent = dep;
        depItem.style.marginBottom = '3px';
        depsList.appendChild(depItem);
      });
      
      moduleDiv.appendChild(depsList);
    }
    
    visualization.appendChild(moduleDiv);
  });
  
  graphContainer.appendChild(visualization);
  
  // Clear and append to container
  if (typeof container === 'string') {
    containerEl.innerHTML = '';
    containerEl.appendChild(graphContainer);
  } else {
    containerEl.innerHTML = '';
    containerEl.appendChild(graphContainer);
  }
  
  // Return API for the visualization
  return {
    /**
     * Update the dependency graph with new data
     * @param {Object} newDependencies - New dependency data
     */
    update: (newDependencies) => {
      if (typeof container === 'string') {
        const containerEl = document.querySelector(container);
        if (containerEl) {
          containerEl.innerHTML = '';
          renderDependencyGraph(newDependencies, container, options);
        }
      } else {
        container.innerHTML = '';
        renderDependencyGraph(newDependencies, container, options);
      }
    },
    
    /**
     * Destroy the visualization and clean up resources
     */
    destroy: () => {
      if (typeof container === 'string') {
        const containerEl = document.querySelector(container);
        if (containerEl) {
          containerEl.innerHTML = '';
        }
      } else {
        container.innerHTML = '';
      }
    },
    
    /**
     * Get the current visualization element
     * @returns {HTMLElement} The graph container element
     */
    getElement: () => graphContainer
  };
};

/**
 * Display module structure for debugging purposes
 * @param {Object} modules - Object representing modules and their properties
 * @param {string|HTMLElement} container - CSS selector or container element to display the structure in
 * @param {Object} options - Optional formatting options
 * @returns {Object} The structure display instance with update/filter/destroy methods
 */
const displayModuleStructure = (modules, container, options = {}) => {
  if (typeof document === 'undefined') return null;
  
  const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
  if (!containerEl) return null;
  
  const {
    showProperties = true,
    indentSize = 2,
    maxDepth = 3,
    showExports = true,
    highlightCircular = false,
    filter = () => true
  } = options;
  
  // Create structure container
  const structureContainer = document.createElement('div');
  structureContainer.className = 'module-structure-container';
  structureContainer.style.position = 'relative';
  structureContainer.style.width = '100%';
  structureContainer.style.height = '400px';
  structureContainer.style.overflow = 'auto';
  structureContainer.style.border = '1px solid #ddd';
  structureContainer.style.borderRadius = '4px';
  structureContainer.style.padding = '10px';
  structureContainer.style.backgroundColor = '#f9f9f9';
  structureContainer.style.fontFamily = 'monospace';
  structureContainer.style.fontSize = '12px';
  
  // Create structure visualization
  const structureVisualization = document.createElement('div');
  structureVisualization.className = 'module-structure';
  structureVisualization.innerHTML = '<h4>Module Structure (Debug View)</h4>';
  
  const renderModule = (moduleName, moduleInfo, depth = 0) => {
    if (depth > maxDepth) return '';
    
    const indent = ' '.repeat(indentSize * depth);
    const isCircular = highlightCircular && moduleInfo && moduleInfo.isCircular;
    
    let result = `<div class="module" style="${
      isCircular ? 'background-color: #ffcccc;' : ''
    }">${indent}<strong>${moduleName}</strong></div>`;
    
    if (showProperties && moduleInfo && typeof moduleInfo === 'object') {
      result += '<ul class="module-properties" style="list-style-type: none; padding-left: 20px;">';
      
      Object.entries(moduleInfo).forEach(([key, value]) => {
        if (filter(key, value)) {
          const displayKey = key === '__filename' ? 'filename' : 
                           key === '__dirname' ? 'dirname' : 
                           key === 'exports' ? 'exports' : 
                           key === 'dependencies' ? 'dependencies' : key;
          
          if (displayKey === 'exports' && showExports && value) {
            result += `<li><span style="color: #666;">${indent}  exports:</span> { ... }</li>`;
            if (depth < maxDepth - 1 && typeof value === 'object') {
              Object.keys(value).forEach(exportName => {
                result += renderModule(`${indent}  ${exportName}`, value[exportName], depth + 1);
              });
            }
          } else if (displayKey === 'dependencies' && value) {
            result += `<li><span style="color: #666;">${indent}  dependencies:</span> [${value.length}]</li>`;
            if (depth < maxDepth - 1 && Array.isArray(value)) {
              value.forEach(dep => {
                result += renderModule(`${indent}  ${dep}`, null, depth + 1);
              });
            }
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result += `<li><span style="color: #666;">${indent}  ${displayKey}:</span> { ... }</li>`;
            if (depth < maxDepth - 1) {
              result += renderModule(`${indent}  ${displayKey}.${Object.keys(value)[0] || 'value'}`, value, depth + 1);
            }
          } else if (Array.isArray(value)) {
            result += `<li><span style="color: #666;">${indent}  ${displayKey}:</span> [${value.length} items]</li>`;
          } else {
            const displayValue = value === null ? 'null' : 
                               value === undefined ? 'undefined' : 
                               typeof value === 'string' ? `"${value}"` : 
                               String(value);
            result += `<li><span style="color: #666;">${indent}  ${displayKey}:</span> ${displayValue}</li>`;
          }
        }
      });
      
      result += '</ul>';
    }
    
    return result;
  };
  
  Object.entries(modules).forEach(([moduleName, moduleInfo]) => {
    if (filter(moduleName, moduleInfo)) {
      structureVisualization.innerHTML += renderModule(moduleName, moduleInfo);
    }
  });
  
  structureContainer.appendChild(structureVisualization);
  
  // Clear and append to container
  if (typeof container === 'string') {
    containerEl.innerHTML = '';
    containerEl.appendChild(structureContainer);
  } else {
    container.innerHTML = '';
    container.appendChild(structureContainer);
  }
  
  // Return API for the structure display
  return {
    /**
     * Update the module structure display with new data
     * @param {Object} newModules - New module data
     */
    update: (newModules) => {
      if (typeof container === 'string') {
        const containerEl = document.querySelector(container);
        if (containerEl) {
          containerEl.innerHTML = '';
          displayModuleStructure(newModules, container, options);
        }
      } else {
        container.innerHTML = '';
        displayModuleStructure(newModules, container, options);
      }
    },
    
    /**
     * Update the filter function and refresh display
     * @param {Function} newFilter - New filter function
     */
    filter: (newFilter) => {
      options.filter = newFilter;
      if (typeof container === 'string') {
        const containerEl = document.querySelector(container);
        if (containerEl) {
          containerEl.innerHTML = '';
          displayModuleStructure(modules, container, options);
        }
      } else {
        container.innerHTML = '';
        displayModuleStructure(modules, container, options);
      }
    },
    
    /**
     * Destroy the structure display and clean up resources
     */
    destroy: () => {
      if (typeof container === 'string') {
        const containerEl = document.querySelector(container);
        if (containerEl) {
          containerEl.innerHTML = '';
        }
      } else {
        container.innerHTML = '';
      }
    },
    
    /**
     * Get the current structure element
     * @returns {HTMLElement} The structure container element
     */
    getElement: () => structureContainer,
    
    /**
     * Export the current module structure as JSON
     * @returns {string} JSON string of the module structure
     */
    exportAsJSON: () => {
      return JSON.stringify(modules, null, 2);
    }
  };
};

// Export all utilities
module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  // New accessibility functions
  getLangAttribute,
  setLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  addSvgAccessibleName,
  createInPageButton,
  // NEW: Functions for dependency graph and module structure visualization
  renderDependencyGraph,
  displayModuleStructure
};