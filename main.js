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

/**
 * Creates an accessible web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
 * @param {string} text - The button label text
 * @param {string} [url] - The URL to navigate to (optional)
 * @param {string} [icon] - Optional icon identifier
 * @param {string} [className] - Optional CSS class
 * @returns {HTMLElement} An accessible button element
 */
function createAccessibleButton(text, url = '', icon = '', className = '') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = text;
  
  if (url) {
    btn.href = url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
  }
  
  if (icon) {
    // Placeholder for icon implementation - could use an SVG or image
  }
  
  if (className) {
    btn.className = className;
  }

  const landmarks = root.querySelectorAll(
    'header, nav, main, footer, aside, section, ' +
    '[role="banner"], [role="navigation"], [role="main"], ' +
    '[role="contentinfo"], [role="complementary"], [role="region"], ' +
    '[role="search"], [role="form"]'
  );

  const issues = [];
  const roleCounts = {};
  const labelledRoles = {}; // Maps role -> Set of labels

  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const label = landmark.getAttribute('aria-label') ||
                  (landmark.getAttribute('aria-labelledby') ?
                    `#${landmark.getAttribute('aria-labelledby')}` : '');

    // Count roles
    roleCounts[role] = (roleCounts[role] || 0) + 1;

    // Track labelled roles for uniqueness check
    if (label) {
      if (!labelledRoles[role]) labelledRoles[role] = new Set();
      labelledRoles[role].add(label);
      
      // Check for duplicate labels within the same role
      if (labelledRoles[role].has(label)) {
        issues.push({
          type: 'duplicate_labeled_landmark',
          element: landmark,
          role,
          message: `Duplicate label "${label}" for landmark with role "${role}"`
        });
      } else {
        labelledRoles[role].add(label);
      }
    } else {
      // Unlabelled landmarks - check for duplicates
      if (roleCounts[role] > 1) {
        issues.push({
          type: 'duplicate_unlabelled_landmark',
          element: landmark,
          role,
          message: `Multiple <${role}> landmarks without unique labels`
        });
      }
    }
  });

  // Check for required landmarks
  const requiredRoles = ['main'];
  requiredRoles.forEach(role => {
    if (!roleCounts[role]) {
      issues.push({
        type: 'missing_required_landmark',
        role,
        message: `Required landmark "${role}" is missing`
      });
    }
  });

  return {
    valid: issues.length === 0,
    roleCounts,
    labelledRoles,
    issues
  };
}

/**
 * Gets an accessible name for an SVG element
 * @param {SVGElement|string} svg - SVG element or selector
 * @returns {Object} Accessible name information
 */
function getSvgAccessibleName(svg) {
  const element = typeof svg === 'string'
    ? (typeof document !== 'undefined' ? document.querySelector(svg) : null)
    : svg;

  if (!element) {
    return {
      name: '',
      hasName: false,
      method: 'none',
      issues: [{ type: 'element_not_found', message: 'SVG element not found' }]
    };
  }

  // Check for various accessible name sources in priority order
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return { name: ariaLabel, hasName: true, method: 'aria-label' };
  }

  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy && typeof document !== 'undefined') {
    const labelEl = document.getElementById(ariaLabelledBy);
    if (labelEl) {
      return { name: labelEl.textContent.trim(), hasName: true, method: 'aria-labelledby' };
    }
  }

  const titleEl = element.querySelector('title');
  if (titleEl && titleEl.textContent.trim()) {
    return { name: titleEl.textContent.trim(), hasName: true, method: 'title_element' };
  }

  const descEl = element.querySelector('desc');
  if (descEl && descEl.textContent.trim()) {
    return { name: descEl.textContent.trim(), hasName: true, method: 'desc_element' };
  }

  // Check for role="img" with no name
  const role = element.getAttribute('role');
  if (role === 'img') {
    return {
      name: '',
      hasName: false,
      method: 'none',
      issues: [{ type: 'missing_accessible_name', message: 'SVG with role="img" requires an accessible name' }]
    };
  }

  return { name: '', hasName: false, method: 'none' };
}

// Main validation function for web accessibility
function validateWebAccessibility(url) {
    if (!url) {
        throw new Error('URL is required');
    }
    
    console.log(`Validating: ${url}`);
    
    const results = {
        accessibility: null,
        structure: null,
        errors: [],
        warnings: []
    };
    
    try {
        results.accessibility = validateTableAccessibility(url);
        results.structure = validateTableStructure(url);
    } catch (error) {
        results.errors.push(error.message);
    }
    
    return results;
}

function sayHello(name) {
  return greeting(name);
}

function sayGoodbye(name) {
  return `Goodbye, ${name}!`;
}

function getDate() {
  return new Date().toISOString();
}

// Get table headers
function getTableHeaders(table) {
    return table.querySelectorAll('th');
}

// Get table rows
function getTableRows(table) {
    return table.querySelectorAll('tr');
}

// Validate table accessibility
function validateTableAccessibility(tableOrUrl) {
    const tables = typeof tableOrUrl === 'string' 
        ? document.querySelectorAll('table') 
        : [tableOrUrl];
    
    const accessibilityResults = {
        hasHeaders: true,
        hasScope: true,
        hasIdOrHeaders: true,
        contrast: true,
        issues: [],
        score: 100
    };
    
    tables.forEach((table, index) => {
        const headers = table.querySelectorAll('th');
        
        // Check if table has headers
        if (headers.length === 0) {
            accessibilityResults.issues.push({
                table: index,
                type: 'missing_headers',
                message: `Table ${index + 1}: Missing table headers (th elements)`
            });
            accessibilityResults.hasHeaders = false;
            accessibilityResults.score -= 20;
        }
        
        // Check for scope attributes
        headers.forEach((header, hIndex) => {
            if (!header.hasAttribute('scope')) {
                accessibilityResults.issues.push({
                    table: index,
                    header: hIndex,
                    type: 'missing_scope',
                    message: `Table ${index + 1}, Header ${hIndex + 1}: Missing scope attribute`
                });
                accessibilityResults.hasScope = false;
                accessibilityResults.score -= 10;
            }
        });
        
        // Check for proper associations (id/headers)
        const cells = table.querySelectorAll('td');
        if (cells.length > 0 && headers.length > 0) {
            const hasProperAssociation = headers[0].hasAttribute('id') || 
                cells[0].hasAttribute('headers');
            if (!hasProperAssociation) {
                accessibilityResults.issues.push({
                    table: index,
                    type: 'missing_association',
                    message: `Table ${index + 1}: Tables with headers should use id/headers attributes for proper association`
                });
                accessibilityResults.hasIdOrHeaders = false;
                accessibilityResults.score -= 15;
            }
        }
    });
    
    return accessibilityResults;
}

// Validate table structure
function validateTableStructure(tableOrUrl) {
    const tables = typeof tableOrUrl === 'string' 
        ? document.querySelectorAll('table') 
        : [tableOrUrl];
    
    const structureResults = {
        hasCaption: true,
        hasSummary: true,
        consistentColumns: true,
        hasThead: true,
        hasTbody: true,
        issues: [],
        score: 100
    };
    
    tables.forEach((table, index) => {
        // Check for caption
        const caption = table.querySelector('caption');
        if (!caption) {
            structureResults.issues.push({
                table: index,
                type: 'missing_caption',
                message: `Table ${index + 1}: Missing caption element`
            });
            structureResults.hasCaption = false;
            structureResults.score -= 15;
        }
        
        // Check for summary (via aria-describedby or summary attribute)
        const hasSummaryAttr = table.hasAttribute('summary');
        const hasAriaDescription = table.hasAttribute('aria-describedby');
        if (!hasSummaryAttr && !hasAriaDescription) {
            structureResults.issues.push({
                table: index,
                type: 'missing_summary',
                message: `Table ${index + 1}: Missing summary (use summary attribute or aria-describedby)`
            });
            structureResults.hasSummary = false;
            structureResults.score -= 10;
        }
        
        // Check for thead
        const thead = table.querySelector('thead');
        if (!thead) {
            structureResults.issues.push({
                table: index,
                type: 'missing_thead',
                message: `Table ${index + 1}: Missing thead element`
            });
            structureResults.hasThead = false;
            structureResults.score -= 10;
        }
        
        // Check for tbody
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            structureResults.issues.push({
                table: index,
                type: 'missing_tbody',
                message: `Table ${index + 1}: Missing tbody element`
            });
            structureResults.hasTbody = false;
            structureResults.score -= 10;
        }
        
        // Check column consistency
        const rows = table.querySelectorAll('tr');
        if (rows.length > 1) {
            const firstRowCells = rows[0].querySelectorAll('th, td').length;
            let inconsistent = false;
            
            rows.forEach((row, rIndex) => {
                const cellCount = row.querySelectorAll('th, td').length;
                if (cellCount !== firstRowCells) {
                    inconsistent = true;
                }
            });
            
            if (inconsistent) {
                structureResults.issues.push({
                    table: index,
                    type: 'inconsistent_columns',
                    message: `Table ${index + 1}: Inconsistent number of columns across rows`
                });
                structureResults.consistentColumns = false;
                structureResults.score -= 20;
            }
        }
    });
    
    return structureResults;
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

/**
 * Validates the accessibility of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object') return true;
  
  // Check if table has proper caption or summary
  const caption = table.querySelector('caption');
  const summary = table.getAttribute('summary');
  
  // Check if headers have proper associations
  const headers = table.querySelectorAll('th');
  const hasProperHeaders = Array.from(headers).every(th => {
    return th.hasAttribute('scope') || th.hasAttribute('id');
  });
  
  // Return true if accessible (has caption/summary OR proper header associations)
  return !!(caption || summary || hasProperHeaders);
}

/**
 * Validates the structure of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table structure is valid
 */
function validateTableStructure(table) {
  if (!table || typeof table !== 'object') return true;
  
  // Check for proper table structure: thead, tbody, tfoot
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  // Check if first row contains only th elements (header row)
  const firstRow = table.querySelector('tr');
  if (firstRow) {
    const cells = firstRow.querySelectorAll('th, td');
    const hasHeaderCells = Array.from(cells).some(cell => cell.tagName === 'TH');
    if (hasHeaderCells && !thead) {
      return false; // Should have thead when using th elements
    }
  }
  
  // Table should have at least one tbody
  if (!tbody && table.querySelector('tr')) {
    return false;
  }
  
  return true;
}

/**
 * Validates a landmark element for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark is valid
 */
function validateLandmark(element) {
  if (!element || typeof element !== 'object') return true;
  
  // Check if element has a valid landmark role
  const role = element.getAttribute('role');
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  // If no role attribute, check if it's a semantic landmark element
  const isSemanticLandmark = ['header', 'nav', 'main', 'aside', 'footer'].includes(element.tagName.toLowerCase());
  
  // Check if label is provided for landmarks that need it
  if (role === 'navigation' || role === 'search' || role === 'form') {
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledby) {
      return false; // Navigation, search, and form landmarks should have labels
    }
  }
  
  return true;
}

/**
 * Validates the structure of landmark elements
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark structure is valid
 */
function validateLandmarkStructure(element) {
  if (!element || typeof element !== 'object') return true;
  
  // Check for unique landmarks
  if (element.tagName) {
    const tagName = element.tagName.toLowerCase();
    
    // Only one main landmark should exist
    if (tagName === 'main' || element.getAttribute('role') === 'main') {
      const allMains = document.querySelectorAll('main, [role="main"]');
      if (allMains.length > 1) {
        return false; // Multiple main landmarks found
      }
    }
    
    // Only one contentinfo (footer) landmark should exist
    if (tagName === 'footer' || element.getAttribute('role') === 'contentinfo') {
      const allFooters = document.querySelectorAll('footer, [role="contentinfo"]');
      if (allFooters.length > 1) {
        return false; // Multiple contentinfo landmarks found
      }
    }
    
    // Only one banner (header) landmark should exist
    if (tagName === 'header' || element.getAttribute('role') === 'banner') {
      const allHeaders = document.querySelectorAll('header:not([role]), header[role="banner"], [role="banner"]');
      if (allHeaders.length > 1) {
        return false; // Multiple banner landmarks found
      }
    }
  }
  
  return true;
}

/**
 * Gets the accessible name from an SVG element
 * @param {SVGSVGElement} svg - The SVG element
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svg) {
  if (!svg || typeof svg !== 'object') return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title')?.textContent || svg.getAttribute('title') || '';
}

/**
 * Validates that a link is not a fake link (looks like a link but isn't)
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} Whether the link is a proper accessible link
 */
function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') return true;
  
  const tagName = link.tagName ? link.tagName.toLowerCase() : '';
  
  // Check if it's an anchor or link element
  if (tagName === 'a' || tagName === 'area') {
    const href = link.getAttribute('href');
    // Valid links should have an href attribute
    if (!href || href === '#' || href === '') {
      return false; // Fake link detected
    }
    return true;
  }
  
  // Check if it has a button role but looks like a link
  const role = link.getAttribute('role');
  if (role === 'button' && (tagName !== 'button' && tagName !== 'input')) {
    // Check if it has proper button semantics
    const tabIndex = link.getAttribute('tabindex');
    const onClick = link.getAttribute('onclick');
    if (!tabIndex && !onClick) {
      return false;
    }
  }
  
  return true;
}

/**
 * Renders the main index view combining dependency graph and accessibility information
 * @param {Object} [dependencyInfo] - The dependency information from countDependencies()
 * @param {Object} [accessibilityInfo] - The accessibility validation results
 * @returns {string} Combined index view string
 */
function renderIndexView(dependencyInfo, accessibilityInfo) {
    const lines = [];
    
    if (dependencyInfo) {
        lines.push(renderDependencyGraph(dependencyInfo));
    }
    
    if (accessibilityInfo) {
        lines.push("Accessibility Validation Results");
        lines.push("=".repeat(25));
        lines.push("");
        lines.push("- Accessibility Issues: " + (accessibilityInfo.issues ? accessibilityInfo.issues.length : 0));
        lines.push("- Score: " + (accessibilityInfo.score || 0));
        lines.push("");
        
        if (accessibilityInfo.issues && accessibilityInfo.issues.length > 0) {
            lines.push("Issues:");
            accessibilityInfo.issues.forEach((issue, idx) => {
                lines.push(`  ${idx + 1}. ${issue.message}`);
            });
        }
    }
    
    return lines.join("\n");
}

/**
 * Renders the main view combining dependency graph information only
 * @param {Object} [dependencyInfo] - The dependency information from countDependencies()
 * @returns {string} Main view string
 */
function renderMainView(dependencyInfo) {
    const lines = [];
    
    if (dependencyInfo) {
        lines.push(renderDependencyGraph(dependencyInfo));
    }
    
    return lines.join("\n");
}

// TODO: Update the existing function using the new functions for rendering graph/index
function renderMainContent() {
    const dependencyInfo = countDependencies();
    
    return renderMainView(dependencyInfo);
}

/**
 * Generates a full report combining dependency and accessibility information
 * @param {Object} [dependencyInfo] - The dependency information from countDependencies()
 * @param {Object} [accessibilityInfo] - The accessibility validation results
 * @returns {string} Full report string
 */
function generateFullReport(dependencyInfo, accessibilityInfo) {
    return renderIndexView(dependencyInfo, accessibilityInfo);
}

/**
 * Calculates a discount based on price and discount percentage
 * @param {number} price - The original price
 * @param {number} discountPercent - The discount percentage (0-100)
 * @returns {Object} An object containing the discount amount and final price
 */
function calculateDiscount(price, discountPercent) {
    if (typeof price !== 'number' || typeof discountPercent !== 'number') {
        throw new Error('Price and discountPercent must be numbers');
    }
    if (price < 0) {
        throw new Error('Price cannot be negative');
    }
    if (discountPercent < 0 || discountPercent > 100) {
        throw new Error('Discount percentage must be between 0 and 100');
    }
    const discountAmount = price * (discountPercent / 100);
    const finalPrice = price - discountAmount;
    return {
        originalPrice: price,
        discountPercent: discountPercent,
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalPrice: Math.round(finalPrice * 100) / 100
    };
}

/**
 * Addresses accessibility issues from an insight report
 * @param {Object|Array} insightReport - The insight report containing accessibility issues
 * @param {Object} [options] - Options for handling the issues
 * @param {boolean} autoFix - Whether to attempt automatic fixes
 * @param {boolean} verbose - Whether to log detailed information
 * @returns {Object} A report of addressed issues
 */
function addressAccessibilityIssuesFromInsight(insightReport, options = {}) {
    return addressAccessibilityIssues(insightReport, options);
}

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