function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Configuration for landmark checks */
const config = {
  requiredLandmarks: ['main', 'header', 'footer'],
  optionalLandmarks: ['nav', 'aside', 'section'],
  skipElements: ['script', 'style', 'meta', 'link']
};

/**
 * Checks if an element is a landmark element
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if the element is a landmark
 */
function isLandmark(element) {
  if (!element || !element.tagName) return false;
  const landmarkTags = ['HEADER', 'MAIN', 'NAV', 'ASIDE', 'SECTION', 'ARTICLE', 'FOOTER'];
  return landmarkTags.includes(element.tagName);
}

/**
 * Validates landmark elements in a document
 * @param {Document} doc - The document to validate
 * @returns {Object} Validation results
 */
function validateLandmarks(doc) {
  const results = {
    valid: true,
    landmarks: [],
    errors: []
  };

  if (!doc || !doc.body) {
    results.valid = false;
    results.errors.push('Document body not found');
    return results;
  }

  const landmarkTags = ['header', 'main', 'nav', 'aside', 'section', 'article', 'footer'];
  const selector = landmarkTags.join(', ');
  const landmarks = doc.querySelectorAll(selector);

  landmarks.forEach(landmark => {
    results.landmarks.push({
      tag: landmark.tagName.toLowerCase(),
      id: landmark.id || null,
      className: landmark.className || null
    });
  });

  const hasMain = results.landmarks.some(l => l.tag === 'main');
  if (!hasMain) {
    results.valid = false;
    results.errors.push('Document must contain at least one <main> landmark');
  }

  return results;
}

/**
 * Gets all landmark elements from a container
 * @param {HTMLElement} container - The container element
 * @returns {HTMLElement[]} Array of landmark elements
 */
function getLandmarkElements(container) {
  if (!container) return [];

  const landmarkElements = [];
  const selector = 'header, main, nav, aside, section, article, footer';
  const elements = container.querySelectorAll(selector);

  elements.forEach(el => {
    if (isLandmark(el)) {
      landmarkElements.push(el);
    }
  });

  return landmarkElements;
}

// Example module pattern (common in Screeps)
const SomeModule = {
  // Some functionality
};

// Generalized accessibility functions

function setSvgAccessibleName(svg, name) {
  if (!svg) {
    throw new Error('SVG element is required');
  }
  setSvgTitle(svg);
  setSvgAccessibleName(svg, svg.title || svg.id || 'Untitled');
}

// Generalized accessibility functions remain unchanged

// REACT_015: Add lang attribute to HTML element
function getLangAttribute(element) {
  if (!element) return null;
  return element.getAttribute('lang') || document.documentElement.getAttribute('lang') || 'en';
}

function createInPageButton(options) {
  const { id, text, target, container } = options || {};
  const button = document.createElement('button');
  button.id = id || 'in-page-button';
  button.textContent = text || 'Skip to content';
  button.setAttribute('type', 'button');
  
  if (target) {
    button.setAttribute('data-target', target);
  }
  
  const lang = getLangAttribute(document.documentElement);
  button.setAttribute('lang', lang);
  
  if (container) {
    container.appendChild(button);
  }

  // Ensure all clickable elements are focusable
  const focusable = container.querySelectorAll('button, input, select, textarea, [tabindex]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

function renderDependencyGraphContent(container) {
  if (!container) return;
  // Process the container for dependency graph content
  const elements = container.querySelectorAll('*');
  elements.forEach(el => {
    if (el.dataset) {
      // Process dependency data
      const dependency = el.dataset.dependency;
      el.setAttribute('data-processed', 'true');
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const elementsById = {};

  if (!elements) return [];

  elements.forEach(el => {
    if (el.id) {
      elementsById[el.id] = elementsById[el.id] || [];
      elementsById[el.id].push(el);
    }
  });

  const uniqueElements = [];
  Object.keys(elementsById).forEach(id => {
    const els = elementsById[id];
    if (els.length === 1) {
      uniqueElements.push(els[0]);
    }
  });

  return uniqueElements;
}

/**
 * Ensures landmark roles are unique in the document
 * Fixes duplicate landmark roles by removing redundant roles or adding aria labels
 * @returns {Object} - Result with fixed count and details
 */
function ensureUniqueLandmarks() {
  const results = {
    fixed: 0,
    errors: [],
    landmarksProcessed: 0
  };

  try {
    // Get all elements with landmark roles
    const landmarkRoleSelectors = [
      '[role="main"]',
      '[role="banner"]',
      '[role="contentinfo"]',
      '[role="navigation"]',
      '[role="complementary"]',
      '[role="search"]',
      '[role="form"]',
      '[role="region"]',
      'main',
      'header',
      'footer',
      'nav',
      'aside',
      'section',
      'article'
    ];

    const selector = landmarkRoleSelectors.join(', ');
    const landmarkElements = document.querySelectorAll(selector);

    // Track landmark roles we've seen
    const seenRoles = new Map(); // role -> element
    const roleCounts = {}; // role -> count

    landmarkElements.forEach(el => {
      results.landmarksProcessed++;
      
      // Determine the landmark role
      let role = el.getAttribute('role');
      if (!role) {
        // Map semantic elements to their implicit roles
        const tagName = el.tagName.toLowerCase();
        const implicitRoles = {
          'main': 'main',
          'header': 'banner',
          'footer': 'contentinfo',
          'nav': 'navigation',
          'aside': 'complementary',
          'section': 'region',
          'article': 'region'
        };
        role = implicitRoles[tagName] || 'region';
      }

      // Count roles
      roleCounts[role] = (roleCounts[role] || 0) + 1;

      // Check for duplicates of unique roles
      const uniqueRoles = ['main', 'banner', 'contentinfo'];
      if (uniqueRoles.includes(role)) {
        if (seenRoles.has(role)) {
          // Duplicate unique role found - fix it
          const existingEl = seenRoles.get(role);
          
          // Prefer the semantic element over the role attribute
          const existingIsSemantic = ['MAIN', 'HEADER', 'FOOTER'].includes(existingEl.tagName);
          const currentIsSemantic = ['MAIN', 'HEADER', 'FOOTER'].includes(el.tagName);
          
          if (currentIsSemantic && !existingIsSemantic) {
            // Current is semantic, existing has role attribute - remove role from existing
            existingEl.removeAttribute('role');
            results.fixed++;
            results.errors.push(`Removed duplicate ${role} role from non-semantic element`);
            seenRoles.set(role, el);
          } else if (!currentIsSemantic && existingIsSemantic) {
            // Existing is semantic, current has role attribute - remove role from current
            el.removeAttribute('role');
            results.fixed++;
            results.errors.push(`Removed duplicate ${role} role from non-semantic element`);
          } else {
            // Both same type - remove role from current (later in DOM)
            el.removeAttribute('role');
            results.fixed++;
            results.errors.push(`Removed duplicate ${role} role from element`);
          }
        } else {
          seenRoles.set(role, el);
        }
      } else {
        // For non-unique roles (navigation, complementary, search, form, region)
        // Ensure they have accessible names if there are multiples
        if (roleCounts[role] > 1) {
          if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
            // Generate a label based on context
            let label = '';
            if (el.id) {
              label = el.id;
            } else if (el.className) {
              label = el.className.split(' ')[0];
            } else {
              label = `${role}-${roleCounts[role]}`;
            }
            el.setAttribute('aria-label', label);
            results.fixed++;
            results.errors.push(`Added aria-label "${label}" to ${role} landmark`);
          }
        }
        if (!seenRoles.has(role)) {
          seenRoles.set(role, el);
        }
      }
    });

    // Validate required landmarks exist
    config.requiredLandmarks.forEach(required => {
      const roleMap = {
        'main': 'main',
        'header': 'banner',
        'footer': 'contentinfo'
      };
      const role = roleMap[required];
      if (!seenRoles.has(role)) {
        results.errors.push(`Required landmark "${required}" (role="${role}") not found`);
      }
    });

  } catch (error) {
    results.errors.push(`Error ensuring landmark uniqueness: ${error.message}`);
  }

  return results;
}

function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (svg && !svg.getAttribute('aria-label')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = 'svg-title-' + Math.random().toString(36).substring(2, 9);
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_017: Add/fix landmark issues
function validateLandmarkStructure(element) {
  const errors = [];
  
  if (!element) {
    errors.push('Element is required');
    return { valid: false, errors };
  }
  
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
  const role = element.getAttribute('role');
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  
  // Check for proper tag for the role
  if (role && !landmarkRoles.includes(role)) {
    errors.push(`Invalid role "${role}" for landmark`);
  }
  
  // Check that header/footer are not nested improperly
  if (tagName === 'header' && element.closest('header, footer, article')) {
    errors.push('Header should not be nested in article, header, or footer');
  }
  
  if (tagName === 'footer' && element.closest('header, footer, article')) {
    errors.push('Footer should not be nested in article, header, or footer');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Adds a lang attribute to the HTML element (REACT_015)
 * @param {string} lang - Language code (default 'en')
 */
function addLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', lang);
  }
}

function addressInsightIssues(insightReport) {
  const issues = insightReport && insightReport.issues ? insightReport.issues : [];
  const results = {
    addressed: [],
    failed: [],
    totalIssues: issues.length
  };

  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      // Use the return value of ensureUniqueLandmarks
      const result = ensureUniqueLandmarks();
      // Store the result for potential use
      issue.ensureUniqueLandmarksResult = result;
    }
    if (issue.code === 'REACT_017') {
      const affectedElements = issue.elements || [];
      affectedElements.forEach(el => {
        if (!el['aria-label'] && !el.label) {
          el.setAttribute('aria-label', el.id || 'unnamed-element');
        }
      });
    }
  });

  return results;
}

function renderDependencyGraph(dependencyData) {
  if (!dependencyData) {
    console.log('No dependency data provided');
    return;
  }
  
  console.log('%cDependency Graph', 'color: blue; font-weight: bold');
  console.log('==================');
  
  // Process and display dependency data
  if (typeof dependencyData === 'object') {
    Object.keys(dependencyData).forEach(module => {
      const deps = dependencyData[module];
      console.log(`%c${module}`, 'color: green');
      if (Array.isArray(deps)) {
        deps.forEach(dep => {
          console.log(`  └─ ${dep}`);
        });
      } else if (typeof deps === 'object' && deps !== null) {
        Object.keys(deps).forEach(dep => {
          console.log(`  └─ ${dep}: ${deps[dep]}`);
        });
      }
    });
  } else {
    console.log(dependencyData);
  }
}

function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
}

function calculateSum(a, b) {
  return a + b;
}

function addProperLandmarkRegions(affectedElements) {
  if (!affectedElements || !Array.isArray(affectedElements)) return;

  affectedElements.forEach(el => {
    if (el && el.tagName) {
      el.setAttribute('role', 'region');
    }
  });
  
  return fakeLinks.length;
}

/**
 * REACT_015: Adds lang attribute to the document HTML element
 * @param {Document} doc - The document to add lang attribute to
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 * @returns {boolean} - True if lang attribute was set successfully
 */
function addLangAttribute(doc, langCode) {
  if (!doc || !doc.documentElement) {
    return false;
  }
  
  if (!langCode || typeof langCode !== 'string' || langCode.trim() === '') {
    return false;
  }
  
  const normalizedLang = langCode.trim().toLowerCase();
  doc.documentElement.setAttribute('lang', normalizedLang);
  return true;
}

/**
 * Displays module structure for debugging purposes
 * @param {Object|Array} modules - Module data to display
 * @param {Object} options - Display options
 */
function displayModuleStructure(modules, options = {}) {
  if (!modules) {
    console.log('No modules data provided');
    return;
  }
  
  const {
    showDependencies = true,
    showExports = true,
    showPath = false
  } = options;
  
  console.log('%cModule Structure', 'color: purple; font-weight: bold');
  console.log('==================');
  
  // Handle array of modules
  if (Array.isArray(modules)) {
    modules.forEach((module, index) => {
      const isLast = index === modules.length - 1;
      const prefix = isLast ? '└─' : '├─';
      const moduleName = module.name || module.id || `Module ${index + 1}`;
      console.log(`${prefix} ${moduleName}`);
      
      if (showPath && module.path) {
        console.log(`    Path: ${module.path}`);
      }
      
      if (showDependencies && module.dependencies && Array.isArray(module.dependencies)) {
        module.dependencies.forEach((dep, depIndex) => {
          const isLastDep = depIndex === module.dependencies.length - 1;
          const depPrefix = isLast ? '   ' : '│  ';
          const depConnector = isLastDep ? '└─' : '├─';
          console.log(`${depPrefix}${depConnector} depends on: ${dep}`);
        });
      }
      
      if (showExports && module.exports) {
        const exports = Array.isArray(module.exports) ? module.exports : Object.keys(module.exports);
        exports.forEach((exp, expIndex) => {
          const isLastExp = expIndex === exports.length - 1;
          const expPrefix = isLast ? '   ' : '│  ';
          const expConnector = isLastExp ? '└─' : '├─';
          const expName = typeof exp === 'string' ? exp : JSON.stringify(exp);
          console.log(`${expPrefix}${expConnector} exports: ${expName}`);
        });
      }
    });
  } 
  // Handle object with module names as keys
  else if (typeof modules === 'object') {
    Object.keys(modules).forEach(moduleName => {
      const module = modules[moduleName];
      console.log(`%c${moduleName}`, 'color: green');
      
      if (showDependencies) {
        if (module.dependencies) {
          console.log('  Dependencies:');
          if (Array.isArray(module.dependencies)) {
            module.dependencies.forEach(dep => {
              console.log(`    - ${dep}`);
            });
          } else if (typeof module.dependencies === 'object') {
            Object.keys(module.dependencies).forEach(dep => {
              console.log(`    - ${dep}: ${module.dependencies[dep]}`);
            });
          }
        }
      }
      
      if (showExports && module.exports) {
        console.log('  Exports:');
        if (Array.isArray(module.exports)) {
          module.exports.forEach(exp => {
            console.log(`    - ${exp}`);
          });
        } else if (typeof module.exports === 'object') {
          Object.keys(module.exports).forEach(key => {
            console.log(`    - ${key}: ${module.exports[key]}`);
          });
        }
      }
      
      if (showPath && module.path) {
        console.log(`  Path: ${module.path}`);
      }
    });
  }
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang) {
  const language = lang || 'en';
  if (document && document.documentElement) {
    document.documentElement.setAttribute('lang', language);
    return true;
  }
  return false;
}

// REACT_027: Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  const fixedCount = { tablesProcessed: 0, issuesFixed: 0 };

  tables.forEach(table => {
    fixedCount.tablesProcessed++;
    // Ensure table has a caption or aria-label
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
      fixedCount.issuesFixed++;
    }
    // Ensure all rows have th or td cells properly
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      cells.forEach(cell => {
        if (cell.tagName === 'TD' && !cell.hasAttribute('role')) {
          // Cells are valid, no change needed
        }
      });
    });
    // Ensure thead and tbody exist
    if (!table.querySelector('thead') && table.querySelector('tbody')) {
      const firstRow = table.querySelector('tbody tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.querySelector('tbody'));
        fixedCount.issuesFixed++;
      }
    }
  });

  return fixedCount;
}

// REACT_017: Fix landmark issues
function fixLandmarkIssues() {
  const issues = [];
  // Ensure main landmark exists
  const main = document.querySelector('main');
  if (!main) {
    issues.push('Missing main landmark');
  }
  // Ensure landmarks have accessible names where needed
  const landmarks = document.querySelectorAll('header, footer, nav, aside, section');
  landmarks.forEach(landmark => {
    if (landmark.tagName === 'SECTION' || landmark.tagName === 'ASIDE' || landmark.tagName === 'NAV') {
      if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
        issues.push('Landmark missing accessible name: ' + landmark.tagName);
      }
    }
  });
  return { issues, count: issues.length };
}

// REACT_017: Add main landmark
function addMainLandmark() {
  let main = document.querySelector('main');
  if (!main && document.body) {
    main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    // Wrap body content in main
    while (document.body.firstChild) {
      main.appendChild(document.body.firstChild);
    }
    document.body.appendChild(main);
    return true;
  }
  return false;
}

// REACT_017: Add landmark regions
function addLandmarkRegions() {
  const sections = document.querySelectorAll('div.section, section');
  let addedCount = 0;
  sections.forEach(section => {
    if (!section.hasAttribute('role')) {
      section.setAttribute('role', 'region');
      addedCount++;
    }
  });
  return addedCount;
}

// REACT_025: Get unique landmarks
function uniqueLandmarks(elements) {
  const seen = new Set();
  const unique = [];
  if (!elements || !Array.isArray(elements)) return unique;
  elements.forEach(el => {
    if (el && el.tagName) {
      const key = el.tagName + (el.id ? '#' + el.id : '');
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(el);
      }
    }
  });
  return unique;
}

// REACT_041: Add accessible names to SVGs (plural)
function addAccessibleNamesToSVGs(svgList) {
  const svgs = svgList || document.querySelectorAll('svg');
  let count = 0;
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const name = svg.getAttribute('title') || 'Decorative icon ' + (index + 1);
      svg.setAttribute('aria-label', name);
      count++;
    }
  });
  return count;
}

// REACT_041: Add accessible names to SVGs (function alias)
function addSvgAccessibleNames(svgList) {
  return addAccessibleNamesToSVGs(svgList);
}

// REACT_036: Fix fake link issue (singular)
function fixFakeLinkIssue(element) {
  if (!element) return false;
  // Convert fake link (div/span with click handler) to actual link or button
  if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
    const link = document.createElement('a');
    link.setAttribute('href', element.getAttribute('data-href') || '#');
    link.setAttribute('role', 'link');
    link.innerHTML = element.innerHTML;
    element.parentNode.replaceChild(link, element);
    return true;
  }
  return false;
}

// REACT_036: Fix fake link issues (plural)
function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('div[onclick], span[onclick], div[data-href], span[data-href]');
  let fixedCount = 0;
  fakeLinks.forEach(el => {
    if (fixFakeLinkIssue(el)) {
      fixedCount++;
    }
  });
  return fixedCount;
}

// REACT_037: Google sign-in logic
function googleSignIn() {
  // Initialize Google sign-in flow
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleGoogleSignIn
    });
    return true;
  }
  return false;
}

function handleGoogleSignIn(response) {
  // Handle the Google sign-in response
  console.log('Google sign-in response:', response);
}

// REACT_040: Fix button identifiers
function fixButtonIdentifiers() {
  const buttons = document.querySelectorAll('button#my-button, [id="my-button"]');
  let fixedCount = 0;
  buttons.forEach(btn => {
    if (btn.id === 'my-button') {
      btn.id = 'actual-button-' + Math.random().toString(36).substr(2, 9);
      fixedCount++;
    }
  });
  return fixedCount;
}

// REACT_042: Ensure dependencyGraph container has proper ARIA role
function fixDependencyGraphRole(container) {
  const graphContainer = container || document.querySelector('#dependencyGraph');
  if (graphContainer) {
    if (!graphContainer.hasAttribute('role')) {
      graphContainer.setAttribute('role', 'img');
    }
    if (!graphContainer.hasAttribute('aria-label')) {
      graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
    }
    return true;
  }
  return false;
}

// NEW: Implement a new function to handle focus trap for keyboard navigation
/**
 * Sets up a focus trap within the given container element.
 * @param {HTMLElement} container - The container element to trap focus within.
 */
function newFocusTrap(container) {
  if (!container) {
    console.error('Container element is required for focus trap');
    return;
  }

  // Get all focusable elements inside the container
  const focusableElements = container.querySelectorAll(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
  );

  // Convert NodeList to array for easier handling
  const focusableElsArray = Array.from(focusableElements);

  if (focusableElsArray.length === 0) {
    // If there are no focusable elements, we cannot trap focus
    return;
  }

  const firstFocusable = focusableElsArray[0];
  const lastFocusable = focusableElsArray[focusableElsArray.length - 1];

  // Function to handle keydown events
  function handleKeyDown(e) {
    // Check if we are trapping focus (this function is only called when the trap is active)
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  // Add the event listener
  container.addEventListener('keydown', handleKeyDown);
}

// TODO: Implement this function for accessibility checks on tables

/**
 * Validates accessibility features for table elements
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} - Validation results with valid status and errors array
 */
function validateTableAccessibility(table) {
  const results = {
    valid: true,
    errors: []
  };

  if (!table) {
    results.valid = false;
    results.errors.push('Table element is required');
    return results;
  }

  // Check for caption element
  const caption = table.querySelector('caption');
  if (!caption) {
    results.valid = false;
    results.errors.push('Table should have a <caption> element describing its purpose');
  }

  // Check for proper use of header cells
  const headerCells = table.querySelectorAll('th');
  if (headerCells.length === 0) {
    results.valid = false;
    results.errors.push('Table should use <th> elements for header cells');
  }

  // Check scope attributes on header cells
  headerCells.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      results.valid = false;
      results.errors.push(`Table header at position ${index + 1} should have a scope attribute (col, row, colgroup, or rowgroup)`);
    }
  });

  // Check for aria-label or aria-labelledby as alternative to caption
  if (!results.valid && !caption) {
    if (!table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
      results.errors.push('Table should have either a <caption>, aria-label, or aria-labelledby attribute');
    }
  }

  return results;
}

/**
 * Counts the number of elements with a data-dependency attribute in the given container.
 * @param {HTMLElement|Document} [container] - The container to search in. Defaults to document.body.
 * @returns {number} - The count of elements with data-dependency attribute.
 */
function countDependencies(container) {
  if (!container) {
    container = document.body;
  }
  if (!container) {
    return 0;
  }
  const elements = container.querySelectorAll('[data-dependency]');
  return elements.length;
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: 6d7dd2e9a0a736e9934b4e22154f408c108c5042_

// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

module.exports = {
  validateLandmark,
  config,
  isLandmark,
  validateLandmarks,
  getLandmarkElements,
  SomeModule,
  setSvgAccessibleName,
  setLangAttribute,
  improveAccessibility,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  // functionB: ensureUniqueLandmarks, // Add functionB export here if it is implemented
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  addLangAttribute,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions
};

// New accessibility functions

function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || navigator.language || 'en';
  }
  return 'en';
}

function personName(person) {
  if (!person) return 'Unknown';
  return person.name || person.fullName || 'Unknown';
}

function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, errors: ['Invalid table element'] };
  }
  const errors = [];
  const hasCaption = !!table.querySelector('caption');
  const hasHeaders = !!table.querySelectorAll('th').length;
  if (!hasCaption) errors.push('Table missing caption');
  if (!hasHeaders) errors.push('Table missing header cells');
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, errors: ['Invalid table element'] };
  }
  const errors = [];
  const hasThead = !!table.querySelector('thead');
  const hasTbody = !!table.querySelector('tbody') || table.querySelectorAll('tr').length > 0;
  if (!hasThead) errors.push('Table missing thead');
  if (!hasTbody) errors.push('Table missing tbody');
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure(landmark) {
  if (!landmark) {
    return { valid: false, errors: ['Landmark element required'] };
  }
  const errors = [];
  const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
  const validRoles = ['main', 'header', 'footer', 'nav', 'aside', 'section', 'article'];
  if (!validRoles.includes(role)) {
    errors.push('Invalid landmark role');
  }
  if (!landmark.id && !landmark.getAttribute('aria-label')) {
    errors.push('Landmark should have an id or aria-label');
  }
  return { valid: errors.length === 0, errors };
}

function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.setAttribute('aria-label', label);
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
}

function newFocusTrap(container) {
  if (!container) return null;
  const focusableElements = container.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  if (focusableElements.length === 0) return null;
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(event) {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  return {
    destroy: () => {
      container.removeEventListener('keydown', handleKeyDown);
    }
  };
}

// Export new functions
module.exports.getLangAttribute = getLangAttribute;
module.exports.personName = personName;
module.exports.validateTableAccessibility = validateTableAccessibility;
module.exports.validateTableStructure = validateTableStructure;
module.exports.validateLandmarkStructure = validateLandmarkStructure;
module.exports.createInPageButton = createInPageButton;
module.exports.newFocusTrap = newFocusTrap;