// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// todo-hash: 3387b328ed31e6aaa7a649a00a8a016eea4fdf1d

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Main application entry point with accessibility features
 */

function addSvgAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach(svg => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

// Implement function for addressing accessibility issues from insight report
// TODO: Implement a function to count dependencies
function countDependencies() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function setSvgAttributes(svg) {
  if (!svg) return;
  if (!svg.hasAttribute('width') && svg.hasAttribute('viewBox')) {
    svg.setAttribute('width', '24');
  }
  if (!svg.hasAttribute('height') && svg.hasAttribute('viewBox')) {
    svg.setAttribute('height', '24');
  }
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = table.querySelector('thead') !== null || table.querySelector('th') !== null;
  const hasBody = table.querySelector('tbody') !== null;
  const hasCaption = table.querySelector('caption') !== null;

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
  const htmlElement = document.querySelector('html');
  if (htmlElement && htmlElement.hasAttribute('lang')) {
    return htmlElement.getAttribute('lang');
  }

  // Fallback: try to detect from content or use default
  return 'en';
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
    ensureUniqueLandmarksFromString,
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

// Utilities for addressing accessibility issues
const AddressabilityIssues = {
  addressAccessibilityIssues(insightReport) {
    /* existing code */
  },

  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      const points = scorePoints[issue.type] || scorePoints['other'];
      return score + points;
    }, 0);
  },

  ensureUniqueLandmarksFromString(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main([^>]*)>/, '<section$1>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

    if (!landmarkRole) {
      if (implicitLandmarks[tagName]) {
        landmarkRole = implicitLandmarks[tagName];
      } else {
        return { valid: false, error: 'No landmark role found' };
      }
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return { valid: false, error: `Invalid landmark role: ${landmarkRole}` };
    }

    return { valid: true, role: landmarkRole };
  }
};

// ... (other functions and comments preserved)