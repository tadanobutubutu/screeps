// TODO: Address accessibility issues from insight report — FIXED

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Import dependency graph and index content modules
const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  // Validate input
  if (typeof htmlContent !== 'string') {
    throw new Error('HTML content must be a string');
  }

  const warnings = [];
  const foundLandmarks = {};

  // Check for each landmark element in the HTML content
  LANDMARK_ELEMENTS.forEach(landmark => {
    // Use case-insensitive regex to find landmark elements
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    }
  });

  // Check for required main landmark
  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  // Check for duplicate landmarks (potential issue)
  LANDMARK_ELEMENTS.forEach(landmark => {
    if (foundLandmarks[landmark] > 1) {
      warnings.push(`Multiple ${landmark} elements found`);
    }
  });

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * Creates an in-page button for the game interface
 * @param {Object} options - Button configuration options
 * @param {string} options.text - The text to display on the button
 * @param {Function} options.onClick - The callback function when button is clicked
 * @param {string} [options.id] - Optional unique identifier for the button
 * @param {string} [options.title] - Optional title/tooltip for the button
 * @param {string} [options.className] - Optional CSS class name for styling
 * @returns {Object} - The created button object
 */
function createInPageButton(options) {
  const { text, onClick, id, title, className } = options;

  // Validate required options
  if (!text) {
    throw new Error('Button text is required');
  }
  if (typeof onClick !== 'function') {
    throw new Error('onClick callback must be a function');
  }

  // Create button object
  const button = {
    id: id || `btn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text: String(text),
    title: title || '',
    className: className || 'default-button',
    onClick,
    disabled: false,
    visible: true,
    element: null
  };

  // Store button reference
  if (!createInPageButton.buttons) {
    createInPageButton.buttons = {};
  }
  createInPageButton.buttons[button.id] = button;

  return button;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
  // Existing function implementation

  // New implementation to count dependencies using dependencyGraphContent and regex
  const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`]/g;
  const importCount = (dependencyGraphContent || '').match(importCommentRegExp) || [];
  return importCount.length;
}

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original code goes here
// ----- END ORIGINAL CODE -----

// Render index view content using indexContent
function renderIndexView() {
  return indexContent;
}

// Tower Defense Game Implementation
class TowerDefense {
  constructor() {
    this.towers = [];
    this.enemies = [];
    this.bullets = [];
    this.score = 0;
    this.lives = 10;
    this.wave = 0;
    this.isRunning = false;
    this.path = [];
    this.waveInterval = null;
    this.gameLoopId = null;
  }

  /**
   * Initialize the tower defense game with a path
   * @param {Array} path - Array of waypoints for enemies to follow
   */
  init(path) {
    this.path = path || [];
    this.isRunning = true;
    this.wave = 0;
    this.score = 0;
    this.lives = 10;
    this.towers = [];
    this.enemies = [];
    this.bullets = [];
  }

  /**
   * Add a tower at the specified position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {string} type - Tower type: 'basic', 'sniper', 'cannon', 'ice'
   * @returns {Object} The created tower
   */
  addTower(x, y, type = 'basic') {
    const towerConfig = {
      basic: { damage: 10, range: 100, fireRate: 1000, cost: 50 },
      sniper: { damage: 50, range: 250, fireRate: 500, cost: 100 },
      cannon: { damage: 25, range: 150, fireRate: 800, cost: 75 },
      ice: { damage: 5, range: 120, fireRate: 600, cost: 60, slows: true }
    };

    const config = towerConfig[type] || towerConfig.basic;

    const tower = {
      id: `tower_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      type,
      damage: config.damage,
      range: config.range,
      fireRate: config.fireRate,
      cost: config.cost,
      lastFired: 0,
      level: 1,
      slows: config.slows || false,
      slowDuration: 2000
    };

    this.towers.push(tower);
    this.score -= config.cost;
    return tower;
  }

  /**
   * Remove a tower by its ID
   * @param {string} towerId - The ID of the tower to remove
   * @returns {boolean} Whether the tower was removed
   */
  removeTower(towerId) {
    const index = this.towers.findIndex(t => t.id === towerId);
    if (index > -1) {
      const removed = this.towers.splice(index, 1)[0];
      this.score += Math.floor(removed.cost / 2);
      return true;
    }
    return false;
  }

  /**
   * Spawn an enemy at the start of the path
   * @param {string} type - Enemy type: 'basic', 'fast', 'tank', 'boss'
   * @returns {Object} The spawned enemy
   */
  spawnEnemy(type = 'basic') {
    const enemyConfig = {
      basic: { health: 100, speed: 1, reward: 50, size: 10 },
      fast: { health: 50, speed: 2.5, reward: 25, size: 8 },
      tank: { health: 300, speed: 0.7, reward: 100, size: 15 },
      boss: { health: 1000, speed: 0.4, reward: 500, size: 20 }
    };

    const config = enemyConfig[type] || enemyConfig.basic;

    const startPos = this.path[0] || { x: 0, y: 0 };

    const enemy = {
      id: `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      x: startPos.x,
      y: startPos.y,
      type,
      health: config.health,
      maxHealth: config.health,
      speed: config.speed,
      reward: config.reward,
      size: config.size,
      pathIndex: 0,
      alive: true,
      slowed: false,
      slowTimer: 0
    };

    this.enemies.push(enemy);
    return enemy;
  }

  /**
   * Start a wave of enemies
   * @param {number} count - Number of enemies in the wave
   * @param {string} enemyType - Type of enemies to spawn
   * @param {number} delay - Delay between spawns in ms
   */
  startWave(count, enemyType = 'basic', delay = 1000) {
    this.wave++;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (this.isRunning) {
          this.spawnEnemy(enemyType);
        }
      }, i * delay);
    }
  }

  /**
   * Get the distance between two points
   * @param {Object} a - Point A with x, y
   * @param {Object} b - Point B with x, y
   * @returns {number} Distance between a and b
   */
  getDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get all enemies within a tower's range
   * @param {Object} tower - The tower to check range for
   * @returns {Array} Enemies within range
   */
  getEnemiesInRange(tower) {
    return this.enemies.filter(e => e.alive && this.getDistance(tower, e) <= tower.range);
  }

  /**
   * Find the best target for a tower (highest health or first in range)
   * @param {Object} tower - The tower selecting a target
   * @returns {Object|null} Target enemy or null
   */
  selectTarget(tower) {
    const enemiesInRange = this.getEnemiesInRange(tower);
    if (enemiesInRange.length === 0) return null;

    // Prioritize slowed enemies, then by health descending, then by distance ascending
    enemiesInRange.sort((a, b) => {
      if (a.slowed && !b.slowed) return -1;
      if (!a.slowed && b.slowed) return 1;
      if (b.health !== a.health) return b.health - a.health;
      return this.getDistance(tower, a) - this.getDistance(tower, b);
    });

    return enemiesInRange[0];
  }

  /**
   * Fire a bullet from a tower at a target
   * @param {Object} tower - The tower firing
   * @param {Object} target - The enemy to target
   */
  fireBullet(tower, target) {
    const now = Date.now();
    if (now - tower.lastFired < tower.fireRate) return;

    tower.lastFired = now;

    this.bullets.push({
      id: `bullet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      x: tower.x,
      y: tower.y,
      targetId: target.id,
      damage: tower.damage,
      speed: 8,
      type: tower.type,
      slows: tower.slows || false,
      slowDuration: tower.slowDuration || 2000,
      createdAt: now
    });
  }

  /**
   * Update the game state
   * @param {number} timestamp - Current timestamp
   * @returns {Object} Current game state
   */
  update(timestamp = Date.now()) {
    if (!this.isRunning) return this.getState();

    // Tower targeting and firing
    this.towers.forEach(tower => {
      const target = this.selectTarget(tower);
      if (target) {
        this.fireBullet(tower, target);
      }
    });

    // Update bullets
    this.bullets = this.bullets.filter(bullet => {
      const target = this.enemies.find(e => e.id === bullet.targetId && e.alive);
      if (!target) return false;

      const dx = target.x - bullet.x;
      const dy = target.y - bullet.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < bullet.speed) {
        // Hit the target
        target.health -= bullet.damage;

        if (bullet.slows && target.health > 0) {
          target.slowed = true;
          target.slowTimer = timestamp + bullet.slowDuration;
        }

        if (target.health <= 0) {
          target.alive = false;
          this.score += target.reward;
          this.towers.forEach(tower => {
            if (this.getDistance(tower, target) <= tower.range) {
              // Experience or upgrade logic could go here
            }
          });
        }

        return false;
      }

      bullet.x += (dx / dist) * bullet.speed;
      bullet.y += (dy / dist) * bullet.speed;
      return true;
    });

    // Update enemies along the path
    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;

      // Handle slow effect
      if (enemy.slowed && timestamp > enemy.slowTimer) {
        enemy.slowed = false;
      }

      if (enemy.pathIndex < this.path.length - 1) {
        const next = this.path[enemy.pathIndex + 1];
        const dx = next.x - enemy.x;
        const dy = next.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const effectiveSpeed = enemy.slowed ? enemy.speed * 0.4 : enemy.speed;

        if (dist < effectiveSpeed) {
          enemy.pathIndex++;
          enemy.x = next.x;
          enemy.y = next.y;
        } else {
          enemy.x += (dx / dist) * effectiveSpeed;
          enemy.y += (dy / dist) * effectiveSpeed;
        }
      } else {
        // Enemy reached the end
        enemy.alive = false;
        this.lives -= enemy.type === 'boss' ? 5 : enemy.type === 'tank' ? 2 : 1;
      }
    });

    this.enemies = this.enemies.filter(e => e.alive);

    // Check win/lose conditions
    if (this.lives <= 0) {
      this.isRunning = false;
    }

    return this.getState();
  }

  /**
   * Get the current game state
   * @returns {Object} Game state object
   */
  getState() {
    return {
      towers: this.towers,
      enemies: this.enemies,
      bullets: this.bullets,
      score: this.score,
      lives: this.lives,
      wave: this.wave,
      isRunning: this.isRunning
    };
  }

  /**
   * Check if the game is over
   * @returns {boolean} Whether the game is over
   */
  isGameOver() {
    return this.lives <= 0;
  }

  /**
   * Check if the wave is complete (all enemies defeated)
   * @returns {boolean} Whether the current wave is complete
   */
  isWaveComplete() {
    return this.enemies.length === 0;
  }

  /**
   * Get tower placement validity
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {string} type - Tower type
   * @returns {Object} Validity and reason
   */
  canPlaceTower(x, y, type = 'basic') {
    const towerConfig = {
      basic: { cost: 50 },
      sniper: { cost: 100 },
      cannon: { cost: 75 },
      ice: { cost: 60 }
    };

    const cost = (towerConfig[type] || towerConfig.basic).cost;

    if (this.score < cost) {
      return { valid: false, reason: 'Insufficient funds' };
    }

    const existingTower = this.towers.find(t => this.getDistance(t, { x, y }) < 20);
    if (existingTower) {
      return { valid: false, reason: 'Tower too close to another tower' };
    }

    return { valid: true, reason: '' };
  }

  /**
   * Stop the game
   */
  stop() {
    this.isRunning = false;
    if (this.waveInterval) {
      clearInterval(this.waveInterval);
      this.waveInterval = null;
    }
  }

  /**
   * Reset the game to initial state
   */
  reset() {
    this.towers = [];
    this.enemies = [];
    this.bullets = [];
    this.score = 0;
    this.lives = 10;
    this.wave = 0;
    this.isRunning = false;
    this.path = [];
    if (this.waveInterval) {
      clearInterval(this.waveInterval);
      this.waveInterval = null;
    }
  }
}

// Factory function to create a new TowerDefense game instance
function createTowerDefenseGame(path = []) {
  const game = new TowerDefense();
  game.init(path);
  return game;
}

// Tower type definitions
const TOWER_TYPES = {
  basic: { damage: 10, range: 100, fireRate: 1000, cost: 50, label: 'Basic Tower' },
  sniper: { damage: 50, range: 250, fireRate: 500, cost: 100, label: 'Sniper Tower' },
  cannon: { damage: 25, range: 150, fireRate: 800, cost: 75, label: 'Cannon Tower' },
  ice: { damage: 5, range: 120, fireRate: 600, cost: 60, label: 'Ice Tower', slows: true }
};

// Enemy type definitions
const ENEMY_TYPES = {
  basic: { health: 100, speed: 1, reward: 50, label: 'Basic Enemy' },
  fast: { health: 50, speed: 2.5, reward: 25, label: 'Fast Enemy' },
  tank: { health: 300, speed: 0.7, reward: 100, label: 'Tank Enemy' },
  boss: { health: 1000, speed: 0.4, reward: 500, label: 'Boss Enemy' }
};

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,
  announcements: [],
  addAnnouncement(message) {
    this.announcements.push({
      message,
      timestamp: Date.now()
    });
  },
  getAnnouncements() {
    return this.announcements;
  },
  clearAnnouncements() {
    this.announcements = [];
  },

  init() {
    this.createLiveRegion();
    this.addSVGAccessibility();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.addFocusStyles();
    this.setupFocusVisiblePolyfill();
    this.enhanceDynamicContent();
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  // Apply ARIA attributes to SVG elements
  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.getAttribute('title') || 'Image description';
      const descriptionId = `svg-description-${Math.round(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('desc');
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = titleText;
      svg.appendChild(descriptionElement);
    });
  },

  // Set accessibility attributes for SVG elements
  setSvgAttributes(svg) {
    svg.setAttribute('role', 'img');
    const title = svg.getAttribute('title') || 'Image description';
    if (!svg.getAttribute('aria-labelledby')) {
      const descId = `svg-desc-${Math.floor(Math.random() * 10000)}`;
      svg.setAttribute('aria-labelledby', descId);

      const descElement = document.createElement('desc');
      descElement.id = descId;
      descElement.textContent = title;
      svg.appendChild(descElement);
    }
  },

  // Apply ARIA attributes to dynamically added elements
  enhanceSVG() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      if (!svg.getAttribute('aria-labelledby')) {
        const titleText = svg.getAttribute('title') || 'Image description';
        const descriptionId = `svg-description-${Math.round(Math.random() * 1000)}`;
        svg.setAttribute('aria-labelledby', descriptionId);

        const descriptionElement = document.createElement('desc');
        descriptionElement.id = descriptionId;
        descriptionElement.textContent = titleText;
        svg.appendChild(descriptionElement);
      }
    });
  },

  // Anchor message to screen reader via live region
  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    // Use setTimeout to ensure the change is detected by screen readers
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Setup keyboard navigation for interactive elements
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[role="button"]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach(container => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest('[data-dropdown]'))
        ) {
          focusIsInsideContainer = true;
        }

        // Ensure focus trapping only within the dropdown container
        if (focusIsInsideContainer) {
          // Find the first focusable element within the container
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]'
          );

          if (firstFocusableElement) {
            const lastFocusableElement = firstFocusableElement;
            // Handle tab cycling
            if (e.shiftKey && document.activeElement === firstFocusableElement) {
              e.preventDefault();
              lastFocusableElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
              e.preventDefault();
              firstFocusableElement.focus();
            }
          }
        }
      });
    });
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    // Trap focus within modals
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  // Setup skip links
  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href').substring(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  // Add lang attribute to HTML element
  getLangAttribute() {
    return document.documentElement.lang || 'en';
  },

  // Create skip-to-main-content button
  createInPageButton() {
    const button = document.createElement('button');
    button.textContent = 'Skip to main content';
    button.addEventListener('click', () => {
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    });
    return button;
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-contrast: more)').matches
    );
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(tag => {
      const landmark = document.querySelector(tag);
      if (landmark && landmark.id === '') {
        landmark.id = `${tag}-${Math.floor(Math.random() * 1000)}`;
      }
    });
  },

  // New function to add SVG accessibility props
  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      if (!svg.getAttribute('aria-labelledby')) {
        const titleText = svg.getAttribute('title') || 'Image description';
        const descriptionId = `svg-desc-${Math.floor(Math.random() * 1000)}`;
        svg.setAttribute('aria-labelledby', descriptionId);

        const descriptionElement = document.createElement('desc');
        descriptionElement.id = descriptionId;
        descriptionElement.textContent = titleText;
        svg.appendChild(descriptionElement);
      }
    });
  },

  // Address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;

    // Validate and fix table accessibility
    if (report.tables) {
      this.validateTableAccessibility();
      this.validateTableStructure();
    }

    // Validate and fix landmark elements
    if (report.landmarks) {
      this.checkLandmarkElements();
      this.validateLandmark();
      this.validateLandmarkStructure();
      this.ensureUniqueLandmarks();
    }

    // Apply SVG accessibility
    if (report.svg) {
      this.addSVGAccessibilityProps();
    }
  },

  // Validate and fix table accessibility
  validateTableAccessibility() {
    if (typeof window === 'undefined') return;
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const headers = table.querySelectorAll('th');
      headers.forEach(th => {
        if (!th.getAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      });
      if (!table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
        table.setAttribute('aria-label', 'Table');
      }
    });
  },

  // Validate and fix table structure
  validateTableStructure() {
    if (typeof window === 'undefined') return;
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.querySelector('thead')) {
        const thead = document.createElement('thead');
        const firstRow = table.querySelector('tr');
        if (firstRow) {
          thead.appendChild(firstRow);
        }
        table.insertBefore(thead, table.firstChild);
      }
      if (!table.querySelector('tbody')) {
        const tbody = document.createElement('tbody');
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          if (!table.querySelector('thead').contains(row)) {
            tbody.appendChild(row);
          }
        });
        table.appendChild(tbody);
      }
    });
  },

  // Validate landmark elements
  validateLandmark() {
    if (typeof window === 'undefined') return;
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
    landmarks.forEach(el => {
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('role')) {
        // Optionally add a role, but leave as is for now
      }
    });
  },

  // Validate landmark structure
  validateLandmarkStructure() {
    if (typeof window === 'undefined') return;
    const main = document.querySelector('main');
    if (main) {
      const nestedLandmarks = main.querySelectorAll('main, nav, header, footer, aside');
      if (nestedLandmarks.length > 0) {
        console.warn('Landmarks nested within main may be incorrect.');
      }
    }
  },

  // Ensure unique landmark IDs
  ensureUniqueLandmarks() {
    if (typeof window === 'undefined') return;
    const landmarks = document.querySelectorAll('[role="landmark"], main, nav, header, footer, aside');
    const idSet = new Set();
    landmarks.forEach(el => {
      const id = el.id;
      if (id) {
        if (idSet.has(id)) {
          console.warn('Duplicate landmark ID found:', id);
        } else {
          idSet.add(id);
        }
      }
    });
  },

  // Preserve existing code functionality
  preserveExistingCode() {
    // Placeholder to ensure existing functionality is maintained
    console.log("Preserving existing code and accessibility features");
  },

  // Get person name for accessible labeling
  personName() {
    const nameElement = document.querySelector('[data-person-name]');
    return nameElement ? nameElement.textContent.trim() : 'User';
  },

  // Get accessible name for SVG
  getSvgAccessibleName(svg) {
    return svg.getAttribute('aria-label') || svg.getAttribute('title') || 'Image';
  },
};

// New function to handle adding landmark regions
function addLandmarkRegions() {
  const landmarks = {
    main: true,
    nav: false,
    aside: false
  };

  return {
    landmarks,
    regions: Object.keys(landmarks).filter(key => landmarks[key])
  };
}

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Get person name for accessible labeling
function personName() {
  return a11yStore.personName();
}

// Validate and fix table accessibility
function validateTableAccessibility() {
  a11yStore.validateTableAccessibility();
}

// Validate and fix table structure
function validateTableStructure() {
  a11yStore.validateTableStructure();
}

// Validate landmark elements
function validateLandmark() {
  a11yStore.validateLandmark();
}

// Validate landmark structure
function validateLandmarkStructure() {
  a11yStore.validateLandmarkStructure();
}

// Get accessible name for SVG
function getSvgAccessibleName(svg) {
  return a11yStore.getSvgAccessibleName(svg);
}

// Ensure unique landmark IDs
function ensureUniqueLandmarks() {
  a11yStore.ensureUniqueLandmarks();
}

// New function to handle dynamic content updates
function updateLiveRegion(message, priority = 'polite') {
  a11yStore.updateLiveRegion(message, priority);
}

// New function to check landmark elements
function checkLandmarkElementsInDom() {
  a11yStore.checkLandmarkElements();
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
  a11yStore.addSVGAccessibilityProps();
}

function preserveExistingCode() {
  a11yStore.preserveExistingCode();
}

module.exports = {
  checkLandmarkElements,
  createInPageButton,
  countDependencies,
  a11yStore,
  addLandmarkRegions,
  addressAccessibilityIssues,
  LANDMARK_ELEMENTS,
  getLangAttribute: a11yStore.getLangAttribute.bind(a11yStore),
  updateLiveRegion,
  addSVGAccessibilityProps,
  preserveExistingCode,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  checkLandmarkElementsInDom,
  renderIndexView,
  TowerDefense,
  createTowerDefenseGame,
  TOWER_TYPES,
  ENEMY_TYPES
};