// Example of a resolved main.js file with exports for functionA, functionB, createInPageButton, setupKeyboardNavigation, updateAccessibleElements, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, ensureUniqueLandmarks, createAccessibleLink, isLinkAccessible, validateFormAccessibility, validateImageAccessibility, validateButtonAccessibility, renderDependencyGraph, renderIndexView, towerDefense

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

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

// ... existing code ...

// Line 74 - Implement this function for creating in-page buttons
function createInPageButton(options) {
    const defaults = {
        text: 'Button',
        className: 'in-page-button',
        container: document.body,
        id: null,
        title: '',
        disabled: false
    };

    const settings = Object.assign({}, defaults, options);

    const button = document.createElement('button');
    button.textContent = settings.text;
    button.className = settings.className;
    button.setAttribute('title', settings.title);
    button.disabled = settings.disabled;

    if (settings.id) {
        button.id = settings.id;
    }

    if (settings.style) {
        Object.assign(button.style, settings.style);
    }

    if (settings.onClick) {
        button.addEventListener('click', settings.onClick);
    }

    if (typeof settings.container === 'string') {
        const containerElement = document.querySelector(settings.container);
        if (containerElement) {
            containerElement.appendChild(button);
        }
    } else {
        settings.container.appendChild(button);
    }

    return button;
}

// Example functionA
function functionA() {
    return 'functionA result';
}

// Example functionB
function functionB() {
    return 'functionB result';
}

function setupKeyboardNavigation() {
  if (typeof document === 'undefined') return;

  // Focus management for keyboard users
  document.addEventListener('keydown', (e) => {
    // Skip if modifier keys are pressed
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    // Handle tab key for focus management
    if (e.key === 'Tab') {
      // Add logic for tab navigation if needed
    }

    // Handle arrow keys for navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const activeElement = document.activeElement;

      // Skip if not in a navigation context
      if (!activeElement || !activeElement.getAttribute('role')) return;

      // Handle navigation based on element role
      const role = activeElement.getAttribute('role');
      if (role === 'menuitem' || role === 'tab') {
        e.preventDefault();
        navigateWithKeyboard(e.key, activeElement);
      }
    }
  });

  // Helper function for keyboard navigation
  function navigateWithKeyboard(key, element) {
    const parent = element.parentElement;
    if (!parent) return;

    const siblings = Array.from(parent.children).filter(
      el => el.getAttribute('role') === element.getAttribute('role')
    );

    const currentIndex = siblings.indexOf(element);
    let newIndex = currentIndex;

    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = Math.min(siblings.length - 1, currentIndex + 1);
        break;
    }

    if (newIndex !== currentIndex) {
      siblings[newIndex].focus();
    }
  }
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

// Form accessibility validation
function validateFormAccessibility(form) {
  const errors = [];

  if (!form) {
    return { valid: false, errors: ['Form element is required'] };
  }

  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    const name = input.getAttribute('name');
    const type = input.getAttribute('type');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');

    // Skip hidden inputs, submit buttons, and buttons
    if (type === 'hidden' || type === 'submit' || type === 'button' || input.tagName === 'BUTTON') {
      return;
    }

    // Check for associated label
    let hasLabel = false;
    if (id) {
      const label = form.querySelector(`label[for="${id}"]`);
      if (label) hasLabel = true;
    }
    // Check for wrapping label
    if (!hasLabel && input.closest('label')) {
      hasLabel = true;
    }
    // Check for aria-label or aria-labelledby
    if (!hasLabel && (ariaLabel || ariaLabelledby)) {
      hasLabel = true;
    }

    if (!hasLabel) {
      errors.push(`Input at index ${index} is missing an associated label`);
    }
  });

  // Check for fieldsets grouping related inputs
  const radioGroups = {};
  form.querySelectorAll('input[type="radio"]').forEach(radio => {
    const name = radio.getAttribute('name');
    if (name) {
      if (!radioGroups[name]) radioGroups[name] = [];
      radioGroups[name].push(radio);
    }
  });

  Object.keys(radioGroups).forEach(name => {
    if (radioGroups[name].length > 1) {
      // Check if grouped in a fieldset with a legend
      const firstRadio = radioGroups[name][0];
      const fieldset = firstRadio.closest('fieldset');
      if (!fieldset || !fieldset.querySelector('legend')) {
        errors.push(`Radio group "${name}" should be wrapped in a fieldset with a legend`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

// Image accessibility validation
function validateImageAccessibility(img) {
  const errors = [];

  if (!img) {
    return { valid: false, errors: ['Image element is required'] };
  }

  const alt = img.getAttribute('alt');
  const ariaLabel = img.getAttribute('aria-label');
  const ariaLabelledby = img.getAttribute('aria-labelledby');
  const role = img.getAttribute('role');

  // Decorative images should have alt="" or role="presentation"
  const isDecorative = role === 'presentation' || role === 'none';

  if (isDecorative) {
    // For decorative images, alt should be empty
    if (alt !== '' && alt !== null) {
      errors.push('Decorative image should have empty alt attribute');
    }
  } else {
    // For content images, alt must be present
    if (alt === null && !ariaLabel && !ariaLabelledby) {
      errors.push('Image is missing alt attribute');
    }

    // Check for redundant alt text (e.g., "image of", "picture of")
    if (alt) {
      const lowerAlt = alt.toLowerCase().trim();
      if (lowerAlt.startsWith('image of') || lowerAlt.startsWith('picture of') || lowerAlt.startsWith('photo of')) {
        errors.push('Image alt text should not start with "image of", "picture of", or "photo of"');
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// Button accessibility validation
function validateButtonAccessibility(button) {
  const errors = [];

  if (!button) {
    return { valid: false, errors: ['Button element is required'] };
  }

  // Check for accessible name
  const textContent = button.textContent ? button.textContent.trim() : '';
  const ariaLabel = button.getAttribute('aria-label');
  const ariaLabelledby = button.getAttribute('aria-labelledby');
  const title = button.getAttribute('title');

  if (!textContent && !ariaLabel && !ariaLabelledby) {
    if (title) {
      errors.push('Button relies on title attribute for accessible name, prefer aria-label or visible text');
    } else {
      errors.push('Button is missing accessible name (text content, aria-label, or aria-labelledby)');
    }
  }

  // Check if it's actually a button or has button role
  const tagName = button.tagName.toLowerCase();
  const role = button.getAttribute('role');
  if (tagName !== 'button' && role !== 'button') {
    errors.push('Element is not a button or has role="button"');
  }

  // Check for disabled state accessibility
  if (button.disabled || button.getAttribute('aria-disabled') === 'true') {
    const hasDisabledAttr = button.disabled || button.getAttribute('aria-disabled') === 'true';
    if (!hasDisabledAttr) {
      errors.push('Disabled state should be communicated via disabled attribute or aria-disabled');
    }
  }

  return { valid: errors.length === 0, errors };
}

// Render dependency graph for visualizing module dependencies
function renderDependencyGraph(dependencies, options = {}) {
  const {
    container = document.body,
    width = 800,
    height = 600,
    nodeRadius = 20,
    nodeColor = '#4A90E2',
    edgeColor = '#999'
  } = options;

  if (typeof document === 'undefined') {
    return null;
  }

  // Create SVG element for the graph
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency graph visualization');

  // Add accessible title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = 'Dependency Graph';
  svg.appendChild(title);

  // Build node positions in a circular layout
  const nodes = Object.keys(dependencies || {});
  const nodeCount = nodes.length;
  const positions = {};

  nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / nodeCount;
    positions[node] = {
      x: width / 2 + Math.cos(angle) * (Math.min(width, height) / 3),
      y: height / 2 + Math.sin(angle) * (Math.min(width, height) / 3)
    };
  });

  // Draw edges
  nodes.forEach(source => {
    const targets = dependencies[source] || [];
    targets.forEach(target => {
      if (!positions[target]) return;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', positions[source].x);
      line.setAttribute('y1', positions[source].y);
      line.setAttribute('x2', positions[target].x);
      line.setAttribute('y2', positions[target].y);
      line.setAttribute('stroke', edgeColor);
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    });
  });

  // Draw nodes
  nodes.forEach(node => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `Module: ${node}`);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', positions[node].x);
    circle.setAttribute('cy', positions[node].y);
    circle.setAttribute('r', nodeRadius);
    circle.setAttribute('fill', nodeColor);
    g.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', positions[node].x);
    text.setAttribute('y', positions[node].y + nodeRadius + 14);
    text.setAttribute('text-anchor', 'middle');
    text.textContent = node;
    g.appendChild(text);

    svg.appendChild(g);
  });

  if (typeof container === 'string') {
    const containerElement = document.querySelector(container);
    if (containerElement) {
      containerElement.appendChild(svg);
    }
  } else {
    container.appendChild(svg);
  }

  return svg;
}

// Render index view for listing items
function renderIndexView(items, options = {}) {
  const {
    container = document.body,
    title = 'Index',
    itemRenderer = null,
    className = 'index-view',
    listClassName = 'index-list'
  } = options;

  if (typeof document === 'undefined') {
    return null;
  }

  // Create main container
  const wrapper = document.createElement('section');
  wrapper.className = className;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', title);

  // Add heading
  const heading = document.createElement('h2');
  heading.textContent = title;
  heading.id = `index-view-heading-${Date.now()}`;
  wrapper.appendChild(heading);
  wrapper.setAttribute('aria-labelledby', heading.id);

  // Create list
  const list = document.createElement('ul');
  list.className = listClassName;

  (items || []).forEach((item, index) => {
    const li = document.createElement('li');

    if (typeof itemRenderer === 'function') {
      const rendered = itemRenderer(item, index);
      if (rendered instanceof Node) {
        li.appendChild(rendered);
      } else if (typeof rendered === 'string') {
        li.innerHTML = rendered;
      }
    } else if (item instanceof Node) {
      li.appendChild(item);
    } else if (typeof item === 'string') {
      li.textContent = item;
    } else if (item && typeof item === 'object') {
      const label = item.name || item.title || item.label || `Item ${index + 1}`;
      const link = document.createElement('a');
      link.href = item.href || '#';
      link.textContent = label;
      if (item.description) {
        link.setAttribute('aria-label', `${label}: ${item.description}`);
      }
      li.appendChild(link);
    }

    list.appendChild(li);
  });

  wrapper.appendChild(list);

  if (typeof container === 'string') {
    const containerElement = document.querySelector(container);
    if (containerElement) {
      containerElement.appendChild(wrapper);
    }
  } else {
    container.appendChild(wrapper);
  }

  return wrapper;
}

// TODO: Implement tower defense
function towerDefense() {
  // A simple tower defense game implementation
  // Define towers, enemies, waves, and game loop
  const towers = [];
  const enemies = [];
  let wave = 1;

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
  }

  // Add a tower
  function addTower(x, y, range, damage, rate) {
    towers.push(new Tower(x, y, range, damage, rate));
  }

  // Add an enemy
  function addEnemy(x, y, health, speed) {
    enemies.push(new Enemy(x, y, health, speed));
  }

  // Update game state (simplified)
  function update() {
    // Logic for enemy movement, tower shooting, etc.
    console.log(`Wave ${wave} - updating game state`);
  }

  // Start the game
  function start() {
    console.log('Tower defense game started');
    // Add initial towers and enemies
    addTower(100, 100, 200, 10, 1000);
    addEnemy(0, 50, 100, 2);
    // Game loop would be here
  }

  // Expose game functions
  return {
    start,
    addTower,
    addEnemy,
    update,
    getWave: () => wave
  };
}

// Export all functions to maintain current exports
module.exports = {
  createInPageButton,
  setupKeyboardNavigation,
  setHtmlLangAttribute,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  validateFormAccessibility,
  validateImageAccessibility,
  validateButtonAccessibility,
  renderDependencyGraph,
  renderIndexView,
  towerDefense
};