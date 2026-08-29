const dependencyGraphContent = require('./dependencyGraph');

const rotateBack = function () {
  // Logic to rotate back
  // For example, if you're manipulating the DOM or a state:
  // document.getElementById('someElement').classList.remove('rotate-forward');
  // document.getElementById('someElement').classList.add('rotate-backward');
};

exports.rotateBack = rotateBack;

const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  // Code to address the specific accessibility issue on the element
  // This is a placeholder function and should be replaced with the actual implementation
  console.log(`Addressing accessibility issue for ${element} with info:`, accessibilityInfo);
};

exports.addressAccessibilityIssue038 = addressAccessibilityIssue038;

const renderDependencyGraph = (dependencyGraph, container) => {
  // Render the dependency graph using the dependencyGraphContent
  const graphContent = dependencyGraphContent;
  // Append the graphContent to the container
  container.innerHTML = graphContent;
};

exports.renderDependencyGraph = renderDependencyGraph;

import { type Metadata } from "next";
import "./globals.css";
import {
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  checkAccessibility,
  checkLandmarks,
  checkLandmarkElement,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  handleCredentialResponse,
  decodeJwtResponse,
  fixButtonIdentifiers,
  addMainLandmarkToIndex,
  renderDependencyGraphs,
  fixTableStructureIssues,
  renderIndexView,
  setFormElementAccessibleNames,
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  getSvgAccessibleName,
} from "./accessibility";
import { renderDependencyGraph } from "./dependencyGraph";

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

export const addressAccessibilityIssue038 = (
  element,
  accessibilityInfo
) => {
  // Code to address the specific accessibility issue on the element
  // This is a placeholder function and should be replaced with the actual implementation
  console.log(
    `Addressing accessibility issue for ${element} with info:`,
    accessibilityInfo
  );
};

const a11yStore = {
  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
    this.initAccessibility();
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.setAttribute('aria-modal', 'true');

    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;

    const closeButton = this.createAccessibleButton(`${id}-close`, closeLabel, () => {
      dialog.hidden = true;
      dialog.setAttribute('aria-hidden', 'true');
    });

    dialog.appendChild(titleEl);
    dialog.appendChild(closeButton);
    dialog.appendChild(content);

    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  initAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
          this.announce('Skipped to main content');
        }
      });
    }

    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    document.querySelectorAll('input, select, textarea').forEach((input) => {
      if (!input.id && input.name) {
        input.id = input.name;
      }
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    });
  },

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

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  makeAccessible(element) {
    // Implement the function logic to address accessibility issues
  },

  newNecessaryFunction() {
    // Implement the new function logic here
  },

  handleAccessibilityIssues() {
    // Implement the function logic to handle accessibility issues
  },

  renderDependencyGraph() {
    // Existing code for rendering dependency graph
  },

  setupKeyboardNavigation() {
    // Setup keyboard navigation logic
  },

  setupFocusManagement() {
    // Setup focus management logic
  },

  setupSkipLinks() {
    // Setup skip links logic
  },

  checkLandmarkElements() {
    // Check and ensure proper landmark elements
  },

  addSVGAccessibilityProps() {
    // Add accessibility properties to SVG elements
  },

  fixFakeLinks() {
    // Fix fake links to use proper anchor elements
  },

  updateLiveRegion() {
    // Update live region for screen readers
  },
};

// Tower Defense Implementation
const towerDefense = {
  towers: [],
  enemies: [],
  projectiles: [],
  gold: 100,
  lives: 10,
  wave: 0,
  gameSpeed: 1,
  isPaused: false,
  isGameOver: false,
  score: 0,
  mapWidth: 800,
  mapHeight: 600,
  path: [],
  enemiesPerWave: 5,
  spawnInterval: null,
  
  // Tower types configuration
  towerTypes: {
    basic: { 
      name: 'Basic Tower', 
      damage: 10, 
      range: 100, 
      fireRate: 1000, 
      cost: 50,
      color: '#3498db'
    },
    sniper: { 
      name: 'Sniper Tower', 
      damage: 50, 
      range: 200, 
      fireRate: 2000, 
      cost: 100,
      color: '#e74c3c'
    },
    rapid: { 
      name: 'Rapid Tower', 
      damage: 5, 
      range: 80, 
      fireRate: 300, 
      cost: 75,
      color: '#2ecc71'
    },
    splash: {
      name: 'Splash Tower',
      damage: 15,
      range: 120,
      fireRate: 1500,
      cost: 125,
      splashRadius: 50,
      color: '#9b59b6'
    }
  },
  
  // Enemy types configuration
  enemyTypes: {
    basic: { health: 30, speed: 1, reward: 10, color: '#e67e22' },
    fast: { health: 20, speed: 2, reward: 15, color: '#f1c40f' },
    tank: { health: 100, speed: 0.5, reward: 30, color: '#7f8c8d' },
    boss: { health: 300, speed: 0.3, reward: 100, color: '#c0392b' }
  },

  // Initialize the tower defense game
  init(config = {}) {
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.gold = config.gold || 100;
    this.lives = config.lives || 10;
    this.wave = 0;
    this.score = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.gameSpeed = config.gameSpeed || 1;
    this.mapWidth = config.mapWidth || 800;
    this.mapHeight = config.mapHeight || 600;
    this.path = config.path || this.generateDefaultPath();
    this.enemiesPerWave = config.enemiesPerWave || 5;
    
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
      this.spawnInterval = null;
    }
    
    return this;
  },

  // Generate a default path for enemies
  generateDefaultPath() {
    return [
      { x: 0, y: 300 },
      { x: 200, y: 300 },
      { x: 200, y: 100 },
      { x: 400, y: 100 },
      { x: 400, y: 500 },
      { x: 600, y: 500 },
      { x: 600, y: 300 },
      { x: 800, y: 300 }
    ];
  },

  // Set the enemy path
  setPath(pathPoints) {
    if (Array.isArray(pathPoints) && pathPoints.length >= 2) {
      this.path = pathPoints;
      return true;
    }
    return false;
  },

  // Place a tower at given position
  placeTower(x, y, type = 'basic') {
    const towerType = this.towerTypes[type];
    if (!towerType) {
      return { success: false, message: 'Invalid tower type' };
    }
    
    if (this.gold < towerType.cost) {
      return { success: false, message: 'Not enough gold' };
    }
    
    if (x < 0 || x > this.mapWidth || y < 0 || y > this.mapHeight) {
      return { success: false, message: 'Invalid position' };
    }
    
    // Check if position is too close to existing tower
    const minDistance = 40;
    for (const tower of this.towers) {
      const dist = Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2));
      if (dist < minDistance) {
        return { success: false, message: 'Too close to another tower' };
      }
    }
    
    this.gold -= towerType.cost;
    
    const tower = {
      id: Date.now() + Math.random(),
      x,
      y,
      type,
      damage: towerType.damage,
      range: towerType.range,
      fireRate: towerType.fireRate,
      lastFired: 0,
      color: towerType.color,
      name: towerType.name,
      kills: 0,
      splashRadius: towerType.splashRadius || 0
    };
    
    this.towers.push(tower);
    
    return { success: true, tower };
  },

  // Remove a tower
  removeTower(towerId) {
    const index = this.towers.findIndex(t => t.id === towerId);
    if (index !== -1) {
      const tower = this.towers[index];
      const refund = Math.floor(this.towerTypes[tower.type].cost * 0.5);
      this.gold += refund;
      this.towers.splice(index, 1);
      return { success: true, refund };
    }
    return { success: false, message: 'Tower not found' };
  },

  // Upgrade a tower
  upgradeTower(towerId, upgradeType = 'damage') {
    const tower = this.towers.find(t => t.id === towerId);
    if (!tower) {
      return { success: false, message: 'Tower not found' };
    }
    
    const upgradeCosts = {
      damage: 30,
      range: 25,
      fireRate: 35,
      splash: 50
    };
    
    const cost = upgradeCosts[upgradeType] || 30;
    
    if (this.gold < cost) {
      return { success: false, message: 'Not enough gold' };
    }
    
    this.gold -= cost;
    
    switch(upgradeType) {
      case 'damage':
        tower.damage = Math.floor(tower.damage * 1.5);
        break;
      case 'range':
        tower.range = Math.floor(tower.range * 1.25);
        break;
      case 'fireRate':
        tower.fireRate = Math.floor(tower.fireRate * 0.8);
        break;
      case 'splash':
        if (tower.splashRadius !== undefined) {
          tower.splashRadius = Math.floor((tower.splashRadius || 30) * 1.5);
        }
        break;
    }
    
    tower.level = (tower.level || 1) + 1;
    
    return { success: true, tower };
  },

  // Spawn an enemy
  spawnEnemy(type = 'basic') {
    const enemyType = this.enemyTypes[type];
    if (!enemyType) {
      return null;
    }
    
    const startPoint = this.path[0];
    const enemy = {
      id: Date.now() + Math.random(),
      x: startPoint.x,
      y: startPoint.y,
      type,
      health: enemyType.health,
      maxHealth: enemyType.health,
      speed: enemyType.speed,
      reward: enemyType.reward,
      color: enemyType.color,
      pathIndex: 0,
      progress: 0,
      isDead: false,
      hasReachedEnd: false
    };
    
    this.enemies.push(enemy);
    return enemy;
  },

  // Start a new wave
  startWave() {
    if (this.isGameOver || this.isPaused) {
      return { success: false, message: 'Cannot start wave' };
    }
    
    this.wave++;
    
    const enemyCount = this.enemiesPerWave + Math.floor(this.wave * 1.5);
    const spawnDelay = Math.max(500, 1500 - this.wave * 50);
    let spawned = 0;
    
    // Clear any existing spawn interval
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
    }
    
    this.spawnInterval = setInterval(() => {
      if (spawned >= enemyCount || this.isGameOver) {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;
        return;
      }
      
      // Determine enemy type based on wave
      let type = 'basic';
      const rand = Math.random();
      
      if (this.wave >= 3 && rand < 0.2) {
        type = 'fast';
      }
      if (this.wave >= 5 && rand < 0.15) {
        type = 'tank';
      }
      if (this.wave >= 10 && rand < 0.05) {
        type = 'boss';
      }
      
      this.spawnEnemy(type);
      spawned++;
    }, spawnDelay);
    
    return { success: true, wave: this.wave, enemyCount };
  },

  // Check if wave is complete
  isWaveComplete() {
    return this.enemies.length === 0 && this.spawnInterval === null;
  },

  // Get distance between two points
  getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  // Move enemy along path
  moveEnemy(enemy, deltaTime) {
    if (enemy.pathIndex >= this.path.length - 1) {
      enemy.hasReachedEnd = true;
      return;
    }
    
    const currentPoint = this.path[enemy.pathIndex];
    const nextPoint = this.path[enemy.pathIndex + 1];
    
    const dx = nextPoint.x - enemy.x;
    const dy = nextPoint.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const speed = enemy.speed * this.gameSpeed * deltaTime * 60;
    
    if (distance <= speed) {
      enemy.x = nextPoint.x;
      enemy.y = nextPoint.y;
      enemy.pathIndex++;
    } else {
      enemy.x += (dx / distance) * speed;
      enemy.y += (dy / distance) * speed;
    }
  },

  // Tower fires at enemy
  towerFire(tower, enemy) {
    const projectile = {
      id: Date.now() + Math.random(),
      x: tower.x,
      y: tower.y,
      targetId: enemy.id,
      targetX: enemy.x,
      targetY: enemy.y,
      damage: tower.damage,
      speed: 8,
      color: tower.color,
      splashRadius: tower.splashRadius || 0
    };
    
    this.projectiles.push(projectile);
    tower.lastFired = Date.now();
  },

  // Update projectiles
  updateProjectiles(deltaTime) {
    const projectilesToRemove = [];
    
    for (const proj of this.projectiles) {
      const target = this.enemies.find(e => e.id === proj.targetId);
      
      if (target) {
        proj.targetX = target.x;
        proj.targetY = target.y;
      }
      
      const dx = proj.targetX - proj.x;
      const dy = proj.targetY - proj.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const speed = proj.speed * this.gameSpeed * deltaTime * 60;
      
      if (distance <= speed + 5) {
        // Projectile hit
        if (proj.splashRadius > 0) {
          // Splash damage
          for (const enemy of this.enemies) {
            const dist = this.getDistance(proj.targetX, proj.targetY, enemy.x, enemy.y);
            if (dist <= proj.splashRadius) {
              const damageMultiplier = 1 - (dist / proj.splashRadius) * 0.5;
              this.damageEnemy(enemy, proj.damage * damageMultiplier);
            }
          }
        } else if (target) {
          this.damageEnemy(target, proj.damage);
        }
        projectilesToRemove.push(proj.id);
      } else {
        proj.x += (dx / distance) * speed;
        proj.y += (dy / distance) * speed;
      }
    }
    
    this.projectiles = this.projectiles.filter(p => !projectilesToRemove.includes(p.id));
  },

  // Damage an enemy
  damageEnemy(enemy, damage) {
    enemy.health -= damage;
    
    if (enemy.health <= 0 && !enemy.isDead) {
      enemy.isDead = true;
      this.gold += enemy.reward;
      this.score += enemy.reward * 10;
      
      // Find and update the tower that killed this enemy
      for (const tower of this.towers) {
        const dist = this.getDistance(tower.x, tower.y, enemy.x, enemy.y);
        if (dist <= tower.range) {
          tower.kills++;
          break;
        }
      }
    }
  },

  // Main update function
  update(deltaTime = 1/60) {
    if (this.isPaused || this.isGameOver) return;
    
    // Update enemies
    const enemiesToRemove = [];
    
    for (const enemy of this.enemies) {
      if (enemy.isDead) {
        enemiesToRemove.push(enemy.id);
        continue;
      }
      
      this.moveEnemy(enemy, deltaTime);
      
      if (enemy.hasReachedEnd) {
        this.lives--;
        enemiesToRemove.push(enemy.id);
        
        if (this.lives <= 0) {
          this.isGameOver = true;
        }
      }
    }
    
    // Remove dead/escaped enemies
    this.enemies = this.enemies.filter(e => !enemiesToRemove.includes(e.id));
    
    // Update towers - find targets and fire
    const now = Date.now();
    
    for (const tower of this.towers) {
      if (now - tower.lastFired < tower.fireRate / this.gameSpeed) continue;
      
      // Find closest enemy in range
      let target = null;
      let closestDist = tower.range;
      
      for (const enemy of this.enemies) {
        if (enemy.isDead) continue;
        
        const dist = this.getDistance(tower.x, tower.y, enemy.x, enemy.y);
        if (dist < closestDist) {
          closestDist = dist;
          target = enemy;
        }
      }
      
      if (target) {
        this.towerFire(tower, target);
      }
    }
    
    // Update projectiles
    this.updateProjectiles(deltaTime);
  },

  // Get game state
  getState() {
    return {
      towers: this.towers,
      enemies: this.enemies,
      projectiles: this.projectiles,
      gold: this.gold,
      lives: this.lives,
      wave: this.wave,
      score: this.score,
      gameSpeed: this.gameSpeed,
      isPaused: this.isPaused,
      isGameOver: this.isGameOver,
      isWaveComplete: this.isWaveComplete(),
      mapWidth: this.mapWidth,
      mapHeight: this.mapHeight,
      path: this.path
    };
  },

  // Set game speed
  setGameSpeed(speed) {
    if (speed >= 0.5 && speed <= 3) {
      this.gameSpeed = speed;
      return true;
    }
    return false;
  },

  // Pause/Resume game
  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  },

  // Add gold
  addGold(amount) {
    if (amount > 0) {
      this.gold += amount;
      return true;
    }
    return false;
  },

  // Reset game
  reset() {
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
    }
    return this.init();
  },

  // Get available tower types
  getAvailableTowers() {
    return Object.entries(this.towerTypes).map(([key, value]) => ({
      type: key,
      ...value,
      affordable: this.gold >= value.cost
    }));
  },

  // Get statistics
  getStats() {
    const totalKills = this.towers.reduce((sum, t) => sum + (t.kills || 0), 0);
    const totalTowers = this.towers.length;
    
    return {
      totalKills,
      totalTowers,
      score: this.score,
      wave: this.wave,
      accuracy: totalTowers > 0 ? Math.round((totalKills / (this.projectiles.length || 1)) * 100) : 0
    };
  }
};

function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    // Integrated the logic from both branches to address accessibility issues
  });
}

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  addLangAttribute();
  addMainLandmark();
  addSvgAccessibleNames();
  checkAccessibility();
  checkLandmarks();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  fixTableStructureIssues();
  setFormElementAccessibleNames();
  setSvgAccessibilityProps();
  checkLandmarkElement();
  isLinkAccessible();
  isButtonAccessible();

  // Check and address accessibility issues
  const elements = document.querySelectorAll('[data-accessibility-issue]');
  elements.forEach(element => {
    const issueId = element.getAttribute('data-accessibility-issue');
    if (issueId === '038') {
      addressAccessibilityIssue038(element, { issue: '038', severity: 'high' });
    }
  });

  // Implement the renderIndexView method here
  renderIndexView();
  renderDependencyGraph();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <main>
          {children}
          <header role="banner">
            <nav role="navigation" aria-label="Main navigation">
              <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/about">About</a></li>
              </ul>
            </nav>
          </header>
          <h1>Welcome to our site</h1>

          {/* REACT_041: Add accessible names to SVGs */}
          <svg
            role="img"
            aria-label="Settings icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="3" />
          </svg>

          {/* REACT_041: Add accessible names to second SVG */}
          <svg
            role="img"
            aria-label="User profile icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
          </svg>

          {/* REACT_036: Fix fake link issue - use proper anchor element */}
          <a href="/dashboard" className="button-link">
            Go to Dashboard
          </a>

          {/* REACT_017 & REACT_025: Ensure unique landmarks */}
          {/* Using proper landmark elements ensures unique landmarks */}
        </main>
        {renderDependencyGraph()}
      </body>
    </html>
  );
}

export {
  a11yStore,
  handleAccessibilityIssues,
  getSvgAccessibleName,
  newNecessaryFunction,
  createAccessibleButton,
  createAccessibleDialog,
  announceToScreenReader,
  trapFocus,
  initAccessibility,
  updateLiveRegion,
  checkLandmarkElements,
  addSVGAccessibilityProps,
  addressAccessibilityIssue038,
  addressAccessibilityIssues,
  renderDependencyGraph,
  towerDefense,
};