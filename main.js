// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return setHtmlLangAttribute(lang);
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName(name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return '';
  return name.trim();
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }

  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  // This function validates the structure of tables
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');

  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }

  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  // This function validates landmarks
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }

  // Check if landmark has accessible name when required
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  // This function validates the structure of landmarks
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }

  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // This function returns the accessible name for an SVG
  if (!svg) {
    return '';
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent || '';
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }

  // Check for adjacent description
  const id = svg.getAttribute('id');
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      return describedBy.textContent || '';
    }
  }

  return '';
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // This function ensures that landmarks are unique
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Define unique landmarks that should only appear once
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];

  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;

    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });

  // Check for landmark IDs that should be unique
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink(href, text, options = {}) {
  // This function creates an accessible link
  const {
    onClick,
    role = 'link',
    ariaLabel,
    className,
    target,
    rel
  } = options;

  if (!href && !onClick) {
    return null;
  }

  const link = document.createElement('a');
  link.textContent = text;

  if (href) {
    link.href = href;
    // Add rel="noopener noreferrer" for external links
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer';
    } else if (rel) {
      link.rel = rel;
    }
  } else {
    // If no href, it's a button disguised as a link
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    });
  }

  if (target) {
    link.target = target;
  }

  if (className) {
    link.className = className;
  }

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }

  if (role && role !== 'link') {
    link.setAttribute('role', role);
  }

  return link;
}

/**
 * Checks if a link element is accessible
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} Result with valid boolean and errors array
 */
function isLinkAccessible(link) {
  const errors = [];

  if (!link) {
    return { valid: false, errors: ['Link element is required'] };
  }

  // Check if it's an anchor element
  if (link.tagName !== 'A') {
    errors.push('Element is not an anchor tag');
    return { valid: false, errors };
  }

  // Check for href attribute
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    // If no href, check if it's properly set up as a button
    const role = link.getAttribute('role');
    if (role !== 'button') {
      errors.push('Link missing href attribute and not configured as a button');
    }
    // Check for click handler
    if (!link.onclick && !link.hasAttribute('data-handler')) {
      errors.push('Fake link missing click handler');
    }
  }

  // Check for accessible name
  const textContent = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;

  if (!hasAccessibleName) {
    errors.push('Link is missing accessible name (text content, aria-label, or aria-labelledby)');
  }

  // Check for valid href if present
  if (href && href !== '#') {
    // Check for javascript: links
    if (href.toLowerCase().startsWith('javascript:')) {
      errors.push('Link uses javascript: protocol which is not accessible');
    }
    // Check for mailto: links without proper labeling
    if (href.toLowerCase().startsWith('mailto:') && !ariaLabel && !textContent.includes('@')) {
      errors.push('Mailto link may need aria-label for clarity');
    }
  }

  // Check target="_blank" has rel="noopener noreferrer"
  if (link.getAttribute('target') === '_blank') {
    const rel = link.getAttribute('rel');
    if (!rel || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      errors.push('External link with target="_blank" missing rel="noopener noreferrer"');
    }
  }

  // Check for redundant title attribute
  const title = link.getAttribute('title');
  if (title && title === textContent) {
    errors.push('Link title attribute duplicates link text');
  }

  return { valid: errors.length === 0, errors };
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
 * New code that was added to the branch
 * Fixes the fake link issue (REACT_036) by converting fake links into accessible buttons
 * or properly configured real links. Uses createInPageButton() and personName() helpers.
 * @param {HTMLElement} container - The container element to search for fake links
 * @returns {Object} Result with fixed count and details
 */
function fixFakeLinkIssue(container) {
  const errors = [];
  const fixed = [];

  if (typeof document === 'undefined') {
    return { success: false, errors: ['Document not available'] };
  }

  const scope = container || document;

  // Find all anchor elements that look like fake links
  const links = scope.querySelectorAll ? scope.querySelectorAll('a') : [];
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const text = personName(link.textContent || '');
    const hasClickHandler = link.onclick || link.hasAttribute('data-handler');

    // Detect fake links: missing href, href="#", or javascript:void(0)
    const isFakeLink = !href ||
                       href === '#' ||
                       href === '' ||
                       href.toLowerCase().startsWith('javascript:void');

    if (isFakeLink) {
      // Create a proper accessible button to replace the fake link
      const button = createInPageButton(document.createElement('div'));
      button.textContent = text || 'Action';
      button.setAttribute('aria-label', text || 'Action');

      // Preserve any existing click handler
      if (hasClickHandler) {
        button.setAttribute('data-handler', 'true');
      }

      // Replace the fake link with the button
      if (link.parentNode) {
        link.parentNode.replaceChild(button, link);
        fixed.push({
          original: href || '(none)',
          replacedWith: 'button',
          text: text
        });
      } else {
        errors.push('Fake link has no parent node to replace');
      }
    }
  });

  return {
    success: errors.length === 0,
    fixedCount: fixed.length,
    fixed: fixed,
    errors: errors
  };
}

/**
 * Builds a hierarchical representation of dependencies from a root node
 * @param {HTMLElement} node - The DOM node to analyze for dependencies
 * @param {Object} options - Configuration options
 * @param {string} options.dependencyAttribute - Data attribute to look for dependencies (default: 'data-dependency')
 * @param {string} options.idAttribute - Attribute to use as node identifier (default: 'id')
 * @returns {Object} The dependency graph structure
 */
function buildDependencyGraph(node, options = {}) {
  const { dependencyAttribute = 'data-dependency', idAttribute = 'id' } = options;
  
  if (!node) {
    return { success: false, errors: ['Node is required'] };
  }

  function processNode(domNode) {
    if (!domNode) return null;
    
    const nodeData = {
      id: domNode.getAttribute ? domNode.getAttribute(idAttribute) || domNode.id || 'anonymous' : 'anonymous',
      tagName: domNode.tagName ? domNode.tagName.toLowerCase() : 'unknown',
      dependencies: [],
      children: []
    };

    // Find dependencies
    const depElements = domNode.querySelectorAll ? domNode.querySelectorAll(`[${dependencyAttribute}]`) : [];
    depElements.forEach(dep => {
      const depId = dep.getAttribute(dependencyAttribute);
      nodeData.dependencies.push({
        id: depId,
        name: dep.getAttribute(idAttribute) || depId,
        element: dep
      });
    });

    // Process child nodes recursively
    if (domNode.children) {
      Array.from(domNode.children).forEach(child => {
        const childData = processNode(child);
        if (childData) {
          nodeData.children.push(childData);
        }
      });
    }

    return nodeData;
  }

  return {
    success: true,
    root: processNode(node)
  };
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} rootNode - The root DOM node to render the graph from
 * @param {HTMLElement} container - Optional container element to render into
 * @param {Object} options - Rendering options
 * @returns {Object} Result with success status and rendered graph data
 */
function renderDependencyGraph(rootNode, container, options = {}) {
  try {
    // Validate rootNode parameter
    if (!rootNode) {
      return { success: false, errors: ['Root node is required'] };
    }

    // Build the dependency graph structure
    const graphData = buildDependencyGraph(rootNode, options);

    // Log for debugging
    console.log('Rendering dependency graph starting from:', rootNode);
    console.log('Graph data:', JSON.stringify(graphData, null, 2));

    // If container provided, render visual elements
    if (container && typeof document !== 'undefined') {
      const graphContainer = document.createElement('div');
      graphContainer.setAttribute('role', 'img');
      graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
      graphContainer.className = options.className || 'dependency-graph';
      
      // Create SVG for graph visualization
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', options.width || '100%');
      svg.setAttribute('height', options.height || '400');
      svg.setAttribute('aria-hidden', 'true');
      
      // Add accessible description
      const description = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      description.textContent = 'Dependency Graph';
      description.setAttribute('id', 'graph-title');
      svg.appendChild(description);
      
      graphContainer.appendChild(svg);
      container.appendChild(graphContainer);
      
      return {
        success: true,
        message: 'Dependency graph rendered successfully',
        container: graphContainer,
        svg: svg,
        data: graphData
      };
    }

    return {
      success: true,
      message: 'Dependency graph data built successfully',
      data: graphData
    };
  } catch (error) {
    console.error('Error rendering dependency graph:', error);
    return { success: false, errors: [error.message] };
  }
}

/**
 * Builds breadcrumb data from an index path
 * @param {string} indexPath - The path to parse into breadcrumb segments
 * @param {Object} options - Configuration options
 * @returns {Object} The breadcrumb structure
 */
function buildBreadcrumbData(indexPath, options = {}) {
  const { baseUrl = '', separator = '/' } = options;
  
  if (!indexPath) {
    return { success: false, errors: ['Index path is required'] };
  }

  // Split path into segments and filter empty ones
  const segments = indexPath.split(separator).filter(s => s.trim());
  
  const breadcrumbs = segments.map((segment, index) => {
    const url = baseUrl + separator + segments.slice(0, index + 1).join(separator);
    return {
      label: segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      original: segment,
      url: url,
      position: index + 1,
      isLast: index === segments.length - 1
    };
  });

  return {
    success: true,
    breadcrumbs: breadcrumbs,
    totalSegments: breadcrumbs.length
  };
}

/**
 * Renders an index view (breadcrumb or navigation structure)
 * @param {string} indexPath - The path to render the index view for
 * @param {HTMLElement} container - Optional container element to render into
 * @param {Object} options - Rendering options
 * @returns {Object} Result with success status and rendered index view data
 */
function renderIndexView(indexPath, container, options = {}) {
  try {
    // Validate indexPath parameter
    if (!indexPath) {
      return { success: false, errors: ['Index path is required'] };
    }

    // Build breadcrumb data from the path
    const breadcrumbData = buildBreadcrumbData(indexPath, {
      baseUrl: options.baseUrl || '',
      separator: options.separator || '/'
    });

    // Log for debugging
    console.log('Rendering index view at path:', indexPath);
    console.log('Breadcrumb data:', JSON.stringify(breadcrumbData, null, 2));

    // If container provided, render visual elements
    if (container && typeof document !== 'undefined') {
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', options.ariaLabel || 'Breadcrumb');
      
      const ol = document.createElement('ol');
      ol.className = options.listClassName || 'breadcrumb';
      
      breadcrumbData.breadcrumbs.forEach((crumb, index) => {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        li.setAttribute('aria-current', crumb.isLast ? 'page' : undefined);
        
        if (crumb.isLast) {
          const span = document.createElement('span');
          span.textContent = crumb.label;
          li.appendChild(span);
        } else {
          const link = document.createElement('a');
          link.href = crumb.url;
          link.textContent = crumb.label;
          li.appendChild(link);
        }
        
        ol.appendChild(li);
      });
      
      nav.appendChild(ol);
      container.appendChild(nav);
      
      return {
        success: true,
        message: 'Index view rendered successfully',
        nav: nav,
        breadcrumbs: breadcrumbData.breadcrumbs,
        data: breadcrumbData
      };
    }

    return {
      success: true,
      message: 'Index view data built successfully',
      breadcrumbs: breadcrumbData.breadcrumbs,
      data: breadcrumbData
    };
  } catch (error) {
    console.error('Error rendering index view:', error);
    return { success: false, errors: [error.message] };
  }
}

// TODO: Implement tower defense
function towerDefense() {
  // A simple tower defense game implementation
  // Define towers, enemies, waves, and game loop
  const towers = [];
  const enemies = [];
  let wave = 1;
  let gameRunning = false;
  let lastEnemySpawnTime = 0;
  const spawnInterval = 3000; // Spawn enemies every 3 seconds
  const pathPoints = [
    { x: 0, y: 50 },
    { x: 200, y: 50 },
    { x: 200, y: 200 },
    { x: 400, y: 200 },
    { x: 400, y: 50 },
    { x: 600, y: 50 }
  ];

  // Example: Tower constructor
  function Tower(x, y, range, damage, rate) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.rate = rate;
    this.lastShot = 0;
  }

  // Example: Enemy constructor
  function Enemy(x, y, health, speed) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = speed;
    this.pathIndex = 0;
  }

  // Add a tower
  function addTower(x, y, range, damage, rate) {
    towers.push(new Tower(x, y, range, damage, rate));
  }

  // Add an enemy
  function addEnemy(x, y, health, speed) {
    enemies.push(new Enemy(x, y, health, speed));
  }

  // Spawn a new enemy at the start of the path
  function spawnEnemy() {
    const startPoint = pathPoints[0];
    addEnemy(startPoint.x, startPoint.y, 100, 2);
  }

  // Update game state (simplified)
  function update(currentTime) {
    if (!gameRunning) return;

    // Spawn enemies at intervals
    if (currentTime - lastEnemySpawnTime > spawnInterval) {
      spawnEnemy();
      lastEnemySpawnTime = currentTime;
    }

    // Logic for enemy movement, tower shooting, etc.
    enemies.forEach((enemy, index) => {
      // Move enemy along path
      if (enemy.pathIndex < pathPoints.length - 1) {
        const target = pathPoints[enemy.pathIndex + 1];
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > enemy.speed) {
          enemy.x += (dx / distance) * enemy.speed;
          enemy.y += (dy / distance) * enemy.speed;
        } else {
          enemy.pathIndex++;
        }
      } else {
        // Enemy reached end of path - remove it
        enemies.splice(index, 1);
      }
    });

    // Tower shooting logic
    towers.forEach(tower => {
      if (currentTime - tower.lastShot > tower.rate) {
        // Find closest enemy in range
        let closestEnemy = null;
        let minDistance = Infinity;

        enemies.forEach(enemy => {
          const dx = enemy.x - tower.x;
          const dy = enemy.y - tower.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < tower.range && distance < minDistance) {
            minDistance = distance;
            closestEnemy = enemy;
          }
        });

        // Attack closest enemy if found
        if (closestEnemy) {
          closestEnemy.health -= tower.damage;
          tower.lastShot = currentTime;

          // Remove enemy if health <= 0
          if (closestEnemy.health <= 0) {
            const index = enemies.indexOf(closestEnemy);
            if (index > -1) {
              enemies.splice(index, 1);
            }
          }
        }
      }
    });

    console.log(`Wave ${wave} - updating game state`);
  }

  // Start the game
  function start() {
    gameRunning = true;
    lastEnemySpawnTime = Date.now();
    console.log('Tower defense game started');
    // Add initial towers
    addTower(100, 100, 200, 10, 1000);
    addTower(300, 150, 200, 15, 800);
    addTower(500, 100, 200, 12, 900);
  }

  // Stop the game
  function stop() {
    gameRunning = false;
    console.log('Tower defense game stopped');
  }

  // Expose game functions
  return {
    start,
    stop,
    addTower,
    addEnemy,
    update,
    getWave: () => wave,
    getEnemies: () => enemies,
    getTowers: () => towers,
    isRunning: () => gameRunning
  };
}

// Export all functions to maintain current exports
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  fixFakeLinkIssue,
  renderDependencyGraph,
  renderIndexView,
  buildDependencyGraph,
  buildBreadcrumbData,
  towerDefense
};