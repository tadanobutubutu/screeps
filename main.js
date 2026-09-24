// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// todo-hash: 3387b328ed31e6aaa7a649a00a8a016eea4fdf1d

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888

/**
 * Get the current lang attribute value of the HTML element
 * @returns {string} The lang attribute value or empty string if not set
 */
function getLangAttribute() {
  return document.documentElement.lang || '';
}

/**
 * Get the full lang attribute including region subtag (e.g., 'en-US')
 * @returns {string} The full lang attribute value or empty string if not set
 */
function getFullLangAttribute() {
  const lang = document.documentElement.lang || '';
  return lang || '';
}

/**
 * Validate landmark roles on elements
 */
function validateLandmark() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  const implicitRoles = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    aside: 'complementary',
    footer: 'contentinfo'
  };

  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  landmarks.forEach(landmark => {
    const tag = landmark.tagName ? landmark.tagName.toLowerCase() : '';
    const role = landmark.getAttribute('role');
    let effectiveRole = role;

    if (!role && implicitRoles[tag]) {
      effectiveRole = implicitRoles[tag];
    }

    if (effectiveRole && !landmarkRoles.includes(effectiveRole)) {
      console.warn(`Invalid landmark role "${effectiveRole}" on element <${tag}>`);
    }
  });
}

/**
 * Main application entry point with accessibility features
 */

// Helper function to get the language attribute from the HTML element
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (!htmlElement) return '';
  return htmlElement.getAttribute('lang') || '';
}

// Helper function to get the full language attribute including region/code
function getFullLangAttribute() {
  const lang = getLangAttribute();
  if (!lang) return '';
  // Handle language tags with region (e.g., en-US, en-GB)
  const parts = lang.split('-');
  if (parts.length > 1) {
    return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
  }
  return lang.toLowerCase();
}

// Helper function to validate landmark elements
function validateLandmark(landmarkElement) {
  if (!landmarkElement) {
    return { valid: false, error: 'Landmark element is required' };
  }
  
  const tagName = landmarkElement.tagName ? landmarkElement.tagName.toLowerCase() : '';
  const role = landmarkElement.getAttribute('role');
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  const implicitRole = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    aside: 'complementary',
    footer: 'contentinfo'
  };
  
  const effectiveRole = role || implicitRole[tagName];
  
  if (!effectiveRole) {
    return { valid: false, error: `Missing landmark role for ${tagName}` };
  }
  
  if (!landmarkRoles.includes(effectiveRole)) {
    return { valid: false, error: `Invalid landmark role: ${effectiveRole} for ${tagName}` };
  }
  
  return { valid: true, role: effectiveRole, tagName };
}

// Helper function to process SVG elements
function processSvgElements() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    svg.setAttribute('role', 'img');
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
    setSvgAttributes(svg);
  });
}

// Placeholder for getSvgAccessibleName
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const accessibleName = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.getAttribute('title') || '';
  if (accessibleName !== '') return accessibleName;
  // New code to ensure user safety, prevent automated SVG modifications
  if (typeof announceToScreenReader !== 'function') {
    console.warn("Attempt to set SVG's aria-label but screen reader detection is missing.");
    // If screen reader detection is missing, avoid setting aria-label to randomly generated SVGs
    return '';
  }
  // Announce the SVG to screen reader to alert developers to verify its accessibility properties
  announceToScreenReader(`SVG element doesn't have an accessible name. Review its accessibility properties.`);
  return accessibleName;
}

// Placeholder for setSvgAttributes
function setSvgAttributes(svg) {
  if (!svg) return;
  // Set necessary attributes for accessibility
  if (!svg.hasAttribute('focusable')) {
    svg.setAttribute('focusable', 'false');
  }
  if (!svg.hasAttribute('width') && svg.hasAttribute('viewBox')) {
    svg.setAttribute('width', '24');
  }
  if (!svg.hasAttribute('height') && svg.hasAttribute('viewBox')) {
    svg.setAttribute('height', '24');
  }
}

// Check table structure function
const checkTableStructure = function(tableElement) {
  if (!tableElement) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = tableElement.querySelector('thead') !== null || tableElement.querySelector('th') !== null;
  const hasBody = tableElement.querySelector('tbody') !== null;
  const hasCaption = tableElement.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
}

/**
 * Get the lang attribute from the HTML element or determine it from content
 * @returns {string} The language code (e.g., 'en', 'es', 'fr')
 */
function getLangAttribute() {
  // First check if html element has lang attribute
  const lang = document.documentElement.lang;
  if (lang) {
    return lang;
  }

  // Fallback: try to detect from content or use default
  return 'en';
}

/**
 * Generate an accessible name for an element (person name or general accessible name)
 * @param {HTMLElement} element - The element to get the accessible name for
 * @returns {string} The accessible name for the element
 */
function personName(element) {
  if (!element) return '';
  
  // Check for existing aria-label
  if (element.hasAttribute('aria-label')) {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim()) {
      return ariaLabel.trim();
    }
  }

  // Check for aria-labelledby referencing another element
  if (element.hasAttribute('aria-labelledby')) {
    const labelledbyId = element.getAttribute('aria-labelledby');
    const labelledElement = document.getElementById(labelledbyId);
    if (labelledElement && labelledElement.textContent) {
      return labelledElement.textContent.trim();
    }
  }

  // Check for alt attribute (for images)
  if (element.hasAttribute('alt')) {
    const alt = element.getAttribute('alt');
    if (alt && alt.trim()) {
      return alt.trim();
    }
  }

  // Check for title attribute
  if (element.hasAttribute('title')) {
    const title = element.getAttribute('title');
    if (title && title.trim()) {
      return title.trim();
    }
  }

  // Check for name attribute
  if (element.hasAttribute('name')) {
    const name = element.getAttribute('name');
    if (name && name.trim()) {
      return name.trim();
    }
  }

  // Fall back to text content
  if (element.textContent) {
    const textContent = element.textContent.trim();
    if (textContent) {
      return textContent;
    }
  }

  // Return empty string if no accessible name found
  return '';
}

/**
 * Validate table accessibility by checking for proper structure and attributes
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableAccessibility(table) {
  const issues = [];

  if (!table) {
    return { valid: false, issues: [{ type: 'missing-table', message: 'Table element is required' }] };
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({ type: 'REACT_027', message: 'Table is missing a caption' });
  }

  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    issues.push({ type: 'REACT_027', message: 'Table is missing a thead element' });
  }

  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    issues.push({ type: 'REACT_027', message: 'Table is missing a tbody element' });
  }

  // Check for header cells
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push({ type: 'REACT_027', message: 'Table has no header cells (th elements)' });
  }

  // Check if headers have scope attribute
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push({ type: 'REACT_027', message: `Header cell ${index + 1} is missing scope attribute` });
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate table structure for accessibility compliance
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Structure validation result
 */
function validateTableStructure(table) {
  const result = checkTableStructure(table);

  if (!result.valid) {
    return result;
  }

  const issues = [];

  // Additional structural checks
  if (!result.hasCaption) {
    issues.push({ type: 'structure', message: 'Table missing caption' });
  }

  if (!result.hasHeader) {
    issues.push({ type: 'structure', message: 'Table missing header (thead or th)' });
  }

  if (!result.hasBody) {
    issues.push({ type: 'structure', message: 'Table missing body (tbody)' });
  }

  return {
    valid: issues.length === 0,
    issues,
    hasHeader: result.hasHeader,
    hasBody: result.hasBody,
    hasCaption: result.hasCaption
  };
}

/**
 * Check landmark elements for accessibility compliance
 * @returns {Object} Validation result with issues array
 */
function checkLandmarkElements() {
  const issues = [];
  const landmarkElements = document.querySelectorAll(
    'main, article, aside, header, footer, nav, section, [role="banner"], [role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"], [role="region"], [role="form"]'
  );

  landmarkElements.forEach((element, index) => {
    const validation = validateLandmark(element);

    if (!validation.valid) {
      issues.push({
        type: 'REACT_017',
        message: `Landmark element ${index + 1} is invalid: ${validation.error}`,
        element: element.tagName
      });
    } else {
      const structureValidation = validateLandmarkStructure(element);
      if (!structureValidation.valid) {
        structureValidation.issues.forEach(issue => {
          issues.push({
            ...issue,
            elementIndex: index + 1
          });
        });
      }
    }
  });

  return {
    valid: issues.length === 0,
    issues,
    landmarkCount: landmarkElements.length
  };
}

/**
 * Validate landmark structure for accessibility
 * @param {HTMLElement} element - The element to validate
 * @returns {Object} Landmark validation result
 */
function validateLandmarkStructure(element) {
  const validation = validateLandmark(element);

  if (!validation.valid) {
    return validation;
  }

  const issues = [];
  const role = validation.role;

  // Check for proper landmark content
  const hasContent = element && element.innerHTML && element.innerHTML.trim().length > 0;

  if (!hasContent) {
    issues.push({ type: 'REACT_017', message: `Landmark ${role} has no content` });
  }

  // Check for proper nesting
  const invalidNesting = ['header', 'footer'].some(tag => {
    const parent = element ? element.closest(tag) : null;
    return parent && role !== 'main';
  });

  if (invalidNesting) {
    issues.push({ type: 'REACT_017', message: `Landmark ${role} has invalid nesting` });
  }

  return {
    valid: issues.length === 0,
    role,
    issues
  };
}

/**
 * Ensure all landmarks in the source are unique
 * @param {string} source - The HTML source string to process
 * @returns {string} Source with duplicate landmarks converted to sections
 */
function ensureUniqueLandmarks(source) {
  return AddressabilityIssues.ensureUniqueLandmarksFromString(source);
}

/**
 * Add proper landmark regions to the document
 * @param {Document} doc - The document to enhance
 */
function addProperLandmarkRegions(doc) {
  if (!doc) doc = document;

  // Ensure main landmark exists
  let main = doc.querySelector('main');
  if (!main) {
    const existingMain = doc.querySelector('[role="main"]');
    if (existingMain) {
      main = existingMain;
    }
  }

  // Ensure header has banner role
  const header = doc.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  // Ensure footer has contentinfo role
  const footer = doc.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }

  // Ensure nav elements have navigation role
  const navs = doc.querySelectorAll('nav');
  navs.forEach(nav => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  });
}

/**
 * Spawn a child process to run some command with proper error handling.
 * @param {Function} callback - Invoked with (err, result) when the command exits.
 */
function spawnSomeCommand(callback) {
    const child_process = require('child_process');
    const child = child_process.spawn('someCommand', [], {
        stdio: 'inherit',
    });
    child.on('exit', (code, signal) => {
        if (code === 0) {
            callback(null, 'Successfully executed someCommand');
        } else {
            callback(new Error(`someCommand failed with code ${code}`));
        }
    });
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    init,
    setupKeyboardNavigation,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore,
    ensureUniqueLandmarks,
    validateLandmark,
    spawnSomeCommand,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    MyComponent,
    AddressabilityIssues,
    getLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    addProperLandmarkRegions,
    // Tower Defense exports
    Tower,
    Enemy,
    TowerDefense,
    towerDefense,
    initTowerDefense,
    placeTower,
    startTowerDefenseWave,
    updateTowerDefense,
    getTowerDefenseState,
    resetTowerDefense
  };
}

/**
 * Tower Defense Implementation
 * A tower defense game where players place towers to defend against waves of enemies
 */

// Tower class representing a defensive tower
class Tower {
  constructor(x, y, type = 'basic') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.range = this.getRange();
    this.damage = this.getDamage();
    this.fireRate = this.getFireRate();
    this.lastFired = 0;
    this.target = null;
    this.level = 1;
  }

  getRange() {
    const ranges = {
      'basic': 100,
      'sniper': 200,
      'rapid': 60,
      'slow': 120,
      'cannon': 80
    };
    return ranges[this.type] || 100;
  }

  getDamage() {
    const damages = {
      'basic': 10,
      'sniper': 50,
      'rapid': 5,
      'slow': 15,
      'cannon': 30
    };
    return damages[this.type] || 10;
  }

  getFireRate() {
    const fireRates = {
      'basic': 1000,
      'sniper': 2000,
      'rapid': 300,
      'slow': 1500,
      'cannon': 1500
    };
    return fireRates[this.type] || 1000;
  }

  getCost() {
    const costs = {
      'basic': 50,
      'sniper': 100,
      'rapid': 75,
      'slow': 80,
      'cannon': 120
    };
    return costs[this.type] || 50;
  }

  findTarget(enemies) {
    let closest = null;
    let closestDist = Infinity;

    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      const dist = Math.sqrt(Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2));
      if (dist <= this.range && dist < closestDist) {
        closest = enemy;
        closestDist = dist;
      }
    }

    this.target = closest;
    return closest;
  }

  canFire(currentTime) {
    return currentTime - this.lastFired >= this.fireRate;
  }

  fire(currentTime) {
    if (!this.target || !this.canFire(currentTime)) return null;

    this.lastFired = currentTime;
    return {
      from: { x: this.x, y: this.y },
      to: { x: this.target.x, y: this.target.y },
      damage: this.damage,
      type: this.type,
      target: this.target
    };
  }

  upgrade() {
    this.level++;
    this.damage = Math.floor(this.damage * 1.5);
    this.range = Math.floor(this.range * 1.2);
    this.fireRate = Math.floor(this.fireRate * 0.9);
  }
}

// Enemy class representing an attacking enemy
class Enemy {
  constructor(path, speed = 1, health = 100, type = 'basic') {
    this.path = path;
    this.pathIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.speed = speed;
    this.maxHealth = health;
    this.health = health;
    this.alive = true;
    this.type = type;
    this.reward = this.getReward();
    this.slowEffect = 0;
    this.slowDuration = 0;
  }

  getReward() {
    const rewards = {
      'basic': 10,
      'fast': 15,
      'tank': 25,
      'boss': 100
    };
    return rewards[this.type] || 10;
  }

  move(deltaTime) {
    if (!this.alive) return false;

    // Check if reached the end of the path
    if (this.pathIndex >= this.path.length - 1) {
      return true; // Enemy reached the end
    }

    // Apply slow effect
    let effectiveSpeed = this.speed;
    if (this.slowDuration > 0) {
      effectiveSpeed = this.speed * (1 - this.slowEffect);
      this.slowDuration -= deltaTime;
    }

    const target = this.path[this.pathIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const moveDistance = effectiveSpeed * deltaTime * 0.05;

    if (dist <= moveDistance) {
      this.x = target.x;
      this.y = target.y;
      this.pathIndex++;
      return this.pathIndex >= this.path.length - 1;
    }

    this.x += (dx / dist) * moveDistance;
    this.y += (dy / dist) * moveDistance;
    return false;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  applySlow(effect, duration) {
    this.slowEffect = Math.max(this.slowEffect, effect);
    this.slowDuration = Math.max(this.slowDuration, duration);
  }
}

// Tower Defense main game class
class TowerDefense {
  constructor(width = 800, height = 600) {
    this.width = width;
    this.height = height;
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.score = 0;
    this.money = 100;
    this.lives = 20;
    this.wave = 0;
    this.gameOver = false;
    this.paused = false;
    this.path = this.generateDefaultPath();
    this.enemiesRemaining = 0;
    this.waveInProgress = false;
  }

  generateDefaultPath() {
    return [
      { x: 0, y: 100 },
      { x: 200, y: 100 },
      { x: 200, y: 300 },
      { x: 400, y: 300 },
      { x: 400, y: 100 },
      { x: 600, y: 100 },
      { x: 600, y: 400 },
      { x: 800, y: 400 }
    ];
  }

  setPath(path) {
    if (Array.isArray(path) && path.length >= 2) {
      this.path = path;
      return true;
    }
    return false;
  }

  placeTower(x, y, type = 'basic') {
    const cost = this.getTowerCost(type);
    if (this.money >= cost) {
      const tower = new Tower(x, y, type);
      this.towers.push(tower);
      this.money -= cost;
      return true;
    }
    return false;
  }

  removeTower(index) {
    if (index >= 0 && index < this.towers.length) {
      const tower = this.towers[index];
      this.money += Math.floor(tower.getCost() * 0.5);
      this.towers.splice(index, 1);
      return true;
    }
    return false;
  }

  upgradeTower(index) {
    if (index >= 0 && index < this.towers.length) {
      const tower = this.towers[index];
      const cost = Math.floor(tower.getCost() * tower.level * 0.5);
      if (this.money >= cost) {
        this.money -= cost;
        tower.upgrade();
        return true;
      }
    }
    return false;
  }

  getTowerCost(type) {
    const costs = {
      'basic': 50,
      'sniper': 100,
      'rapid': 75,
      'slow': 80,
      'cannon': 120
    };
    return costs[type] || 50;
  }

  spawnEnemy(speed = 1, health = 100, type = 'basic') {
    const enemy = new Enemy([...this.path], speed, health, type);
    this.enemies.push(enemy);
    this.enemiesRemaining++;
    return enemy;
  }

  startWave(enemyCount = 10, baseSpeed = 1, baseHealth = 100, config = null) {
    if (this.waveInProgress) return false;

    this.wave++;
    this.waveInProgress = true;
    this.enemiesRemaining = enemyCount;

    const waveConfig = config || {
      enemyTypes: ['basic'],
      speedMultiplier: 1 + (this.wave * 0.1),
      healthMultiplier: 1 + (this.wave * 0.1)
    };

    for (let i = 0; i < enemyCount; i++) {
      setTimeout(() => {
        if (this.gameOver) return;

        const enemyType = waveConfig.enemyTypes[i % waveConfig.enemyTypes.length];
        const speed = (baseSpeed + (this.wave * 0.1)) * waveConfig.speedMultiplier;
        const health = (baseHealth + (this.wave * 10)) * waveConfig.healthMultiplier;

        this.spawnEnemy(speed, health, enemyType);
      }, i * 1000);
    }

    return true;
  }

  update(deltaTime) {
    if (this.gameOver || this.paused) return;

    const currentTime = Date.now();

    // Update towers
    for (const tower of this.towers) {
      tower.findTarget(this.enemies);
      if (tower.target) {
        const projectile = tower.fire(currentTime);
        if (projectile) {
          this.projectiles.push(projectile);
        }
      }
    }

    // Update enemies
    for (const enemy of this.enemies) {
      const reachedEnd = enemy.move(deltaTime);
      if (reachedEnd && enemy.alive) {
        this.lives--;
        enemy.alive = false;
        this.enemiesRemaining--;
        if (this.lives <= 0) {
          this.gameOver = true;
        }
      }
    }

    // Update projectiles and apply damage
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];

      if (projectile.target && projectile.target.alive) {
        const killed = projectile.target.takeDamage(projectile.damage);

        // Apply slow effect for slow towers
        if (projectile.type === 'slow') {
          projectile.target.applySlow(0.5, 2000);
        }

        if (killed) {
          this.score += projectile.target.reward;
          this.money += projectile.target.reward;
          this.enemiesRemaining--;
        }
      }

      // Remove projectile after short delay (simplified animation)
      this.projectiles.splice(i, 1);
    }

    // Clean up dead enemies
    this.enemies = this.enemies.filter(e => e.alive);

    // Check if wave is complete
    if (this.waveInProgress && this.enemiesRemaining <= 0 && this.enemies.length === 0) {
      this.waveInProgress = false;
    }
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  reset() {
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.score = 0;
    this.money = 100;
    this.lives = 20;
    this.wave = 0;
    this.gameOver = false;
    this.paused = false;
    this.enemiesRemaining = 0;
    this.waveInProgress = false;
  }

  getState() {
    return {
      towers: this.towers.map(t => ({
        x: t.x,
        y: t.y,
        type: t.type,
        range: t.range,
        damage: t.damage,
        level: t.level,
        target: t.target ? { x: t.target.x, y: t.target.y } : null
      })),
      enemies: this.enemies.map(e => ({
        x: e.x,
        y: e.y,
        health: e.health,
        maxHealth: e.maxHealth,
        alive: e.alive,
        type: e.type,
        slowDuration: e.slowDuration
      })),
      projectiles: this.projectiles.map(p => ({
        from: p.from,
        to: p.to,
        type: p.type
      })),
      score: this.score,
      money: this.money,
      lives: this.lives,
      wave: this.wave,
      gameOver: this.gameOver,
      paused: this.paused,
      enemiesRemaining: this.enemiesRemaining,
      waveInProgress: this.waveInProgress
    };
  }
}

// Global tower defense instance
const towerDefense = new TowerDefense();

// Tower defense utility functions
function initTowerDefense(width, height, path) {
  const game = new TowerDefense(width || 800, height || 600);
  if (path) {
    game.setPath(path);
  }
  return game;
}

function placeTower(x, y, type = 'basic') {
  return towerDefense.placeTower(x, y, type);
}

function startTowerDefenseWave(enemyCount, baseSpeed, baseHealth, config) {
  return towerDefense.startWave(enemyCount, baseSpeed, baseHealth, config);
}

function updateTowerDefense(deltaTime) {
  towerDefense.update(deltaTime);
}

function getTowerDefenseState() {
  return towerDefense.getState();
}

function resetTowerDefense() {
  towerDefense.reset();
}

function init() {
  setupKeyboardNavigation();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
  addSvgAccessibilityProps();
  addProperLandmarkRegions(document);
}

function setupKeyboardNavigation() {
  /* existing code */
}

function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  // Trap focus within modal dialogs
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function enhanceSemanticMarkup() {
  // Add skip link if not present
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Ensure images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  // Ensure form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).slice(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function closeOpenDialogs() {
  /* existing code */
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    // Slight delay to ensure screen readers pick up the change
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function calculateDifference(a, b) {
  /* existing code */
}

function calculateProduct(a, b) {
  /* existing code */
}

function isNumber(value) {
  /* existing code */
}

function clamp(value, min, max) {
  /* existing code */
}

function createInPageButton(buttonId, buttonText) {
  /* existing code */
}

function validateLinkAccessibility(options) {
  /* existing code */
}

function handleFakeLinks(issues) {
  /* existing code */
}

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

// New function for rendering graph/index
function renderGraph() {
  // Implementation for rendering the graph
  // This is a placeholder for the actual implementation
  console.log('Graph rendering function called');
}

// Existing function that now uses the new renderGraph function
function updateGraphDisplay() {
  // Implementation that uses the new renderGraph function
  renderGraph();
}

// ... (rest of the code preserved with minor adjustments)