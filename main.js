// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// existing code...

const dependencyGraphContent = require('./dependencyGraph');

const rotateBack = function () {
  // Logic to rotate back
  // For example, if you're manipulating the DOM or a state:
  // ...
  // ...
};
module.exports.rotateBack = rotateBack;

const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  // Code to address the specific accessibility issue on the element
  // This is a placeholder function and should be replaced with the actual implementation
  console.log(`Addressing accessibility issue for ${element} with info:`, accessibilityInfo);
};

const exportedAddressAccessibilityIssue038 = addressAccessibilityIssue038;

const renderDependencyGraph = (dependencyGraph, container) => {
  // Render the dependency graph using the dependencyGraphContent
  const graphContent = dependencyGraphContent;
  // Append the graphContent to the container
  container.innerHTML = graphContent;
};

module.exports.renderDependencyGraph = renderDependencyGraph;

// Function to ensure unique landmarks
function ensureUniqueLandmarks(document) {
  let fixedCount = 0;

  // Get all landmark elements by role
  const landmarkRoles = [
    'banner', 'navigation', 'main', 'definition', 'article',
    'aside', 'complementary', 'contentinfo', 'search', 'form'
  ];

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      // Keep the first element, remove role from others
      for (let i = 1; i < elements.length; i++) {
        elements[i].removeAttribute('role');
        elements[i].setAttribute('aria-hidden', 'true');
        fixedCount++;
      }
    }
  });

  // Handle native landmark elements
  const nativeLandmarks = {
    'header': ['banner'],
    'nav': ['navigation'],
    'main': ['main'],
    'footer': ['contentinfo'],
    'aside': ['complementary'],
    'section': ['region']
  };

  Object.keys(nativeLandmarks).forEach(tagName => {
    const expectedRole = nativeLandmarks[tagName][0];
    const elements = document.querySelectorAll(tagName);
    const landmarksWithRole = Array.from(elements).filter(el => 
      el.getAttribute('role') === expectedRole || 
      (tagName === 'header' && !el.querySelector('nav, main, footer, aside'))
    );

    if (landmarksWithRole.length > 1) {
      for (let i = 1; i < landmarksWithRole.length; i++) {
        const el = landmarksWithRole[i];
        // Convert to generic section with region role if not a primary landmark
        if (tagName === 'header') {
          el.setAttribute('role', 'banner');
        } else if (tagName === 'footer') {
          el.setAttribute('role', 'contentinfo');
        } else if (tagName === 'nav') {
          el.setAttribute('role', 'navigation');
        } else if (tagName === 'aside') {
          el.setAttribute('role', 'complementary');
        } else {
          el.setAttribute('role', 'region');
          if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
            el.setAttribute('aria-label', 'Section');
          }
        }
        fixedCount++;
      }
    }
  });

  return report;
};

exports.ensureUniqueLandmarks = ensureUniqueLandmarks;

// Function to add main landmark
function addMainLandmark(document) {
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    // Find the main content area and wrap it or create main element
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');

    // Move first significant content child to main
    const children = Array.from(body.children);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' &&
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }

    body.insertBefore(main, body.firstChild);
    mainElement = main;
  }

  // Ensure main has proper role if not using native element
  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }

  return mainElement;
}

// Function to handle credential response from Google Sign-In
function handleCredentialResponse(response) {
  // TODO: Implement credential response handling
  console.log('Credential response received:', response);
}

// Function to add accessible names to SVGs
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `Graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
  });
  return document;
}

// Function to add accessible names to SVGs (alias)
function addAccessibleNamesToSVGs(document) {
  return addSvgAccessibleNames(document);
}

// Function to fix fake link issue (merged fixes)
function fixFakeLinkIssue(document) {
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick]');

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';

    // Check if it's a fake link (clickable but not a real anchor)
    if (!isAnchor && (onclick.includes('window.location') ||
        onclick.includes('document.location') ||
        onclick.includes('href'))) {

      // Convert to proper anchor or add proper accessibility
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      element.setAttribute('onclick', '');
      span.onclick = element.onclick;

      // Copy styling if available
      if (element.className) {
        span.className = element.className;
      }

      element.parentNode.replaceChild(span, element);
      count++;
    }
  });

  return count;
}

// Function to fix fake link issues (handles both role="link" elements and anchors with href="#")
function fixFakeLinkIssues(document) {
  // Fix non-anchor elements with role="link"
  const roleLinks = document.querySelectorAll('[role="link"]');
  roleLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });

  // Fix anchors with href="#" by converting them to accessible buttons
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });

  return document;
}

// Accessibility fix for REACT_017: Add/fix landmark issues and add Landmark Regions
function fixLandmarkIssues(document) {
  let fixedCount = 0;

  // Ensure only one main landmark
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    for (let i = 1; i < mainElements.length; i++) {
      mainElements[i].setAttribute('role', 'region');
      if (!mainElements[i].hasAttribute('aria-label') && !mainElements[i].hasAttribute('aria-labelledby')) {
        mainElements[i].setAttribute('aria-label', 'Secondary content');
      }
      fixedCount++;
    }
  }

  // Ensure only one banner landmark
  const headers = document.querySelectorAll('header');
  headers.forEach((header, index) => {
    if (header.tagName === 'HEADER') {
      if (index > 0 || document.querySelectorAll('header[role="banner"]').length > 1) {
        if (header.getAttribute('role') !== 'banner') {
          header.setAttribute('role', 'complementary');
          fixedCount++;
        }
      }
    }
  });

  // Ensure only one navigation landmark
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (index > 0 || document.querySelectorAll('nav[role="navigation"]').length > 1) {
      if (nav.getAttribute('role') !== 'navigation') {
        nav.setAttribute('role', 'complementary');
        fixedCount++;
      }
    }
  });

  return fixedCount;
}

function addLandmarkRegions(document) {
  const main = document.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }

  return document;
}

// REACT_025: Ensure unique landmarks (by role approach)
function uniqueLandmarks(document) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'article', 'aside', 'complementary', 'contentinfo', 'search', 'form'];

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      for (let i = 1; i < elements.length; i++) {
        elements[i].setAttribute('aria-hidden', 'true');
      }
    }
  });

  return document;
}

// Address accessibility issues from insight report for image alt texts
function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });
  return document;
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
  }
  
  // Check for landmark issues
  const landmarks = document.querySelectorAll('[role="main"], main');
  if (landmarks.length === 0) {
    issues.push({
      id: 'REACT_017',
      severity: 'high',
      message: 'Add landmark roles and fix landmark issues',
      element: document.body,
      fix: () => addMainLandmark()
    });
  }
  
  // Check for SVGs without accessible names
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  if (svgs.length > 0) {
    issues.push({
      id: 'REACT_041',
      severity: 'medium',
      message: `Add accessible names to ${svgs.length} SVGs`,
      elements: Array.from(svgs),
      fix: () => addSvgAccessibleNames()
    });
  }
  
  // Check for duplicate landmarks
  const landmarkElements = document.querySelectorAll('header, nav, main, aside, footer');
  const landmarkCounts = {};
  landmarkElements.forEach(el => {
    const tag = el.tagName.toLowerCase();
    landmarkCounts[tag] = (landmarkCounts[tag] || 0) + 1;
    if (landmarkCounts[tag] > 1) {
      issues.push({
        id: 'REACT_025',
        severity: 'high',
        message: `Ensure unique landmarks - ${tag} appears ${landmarkCounts[tag]} times`,
        element: el,
        fix: () => ensureUniqueLandmarks()
      });
    }
  });
  return document;
}

// Function to add aria-label to elements
function addAriaLabel(document, selector, label) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  });
  return document;
}

// Function to render dependency graphs
function renderDependencyGraphs(document) {
  const graphContainer = document.querySelector('[data-dependency-graph]');
  if (graphContainer) {
    // Create SVG element for the dependency graph
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-graph');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Dependency graph visualization');
    graphContainer.appendChild(svg);

    // Render the graph content
    if (dependencyGraphContent) {
      const graphContent = typeof dependencyGraphContent === 'string'
        ? dependencyGraphContent
        : JSON.stringify(dependencyGraphContent);
      const parser = new DOMParser();
      const doc = parser.parseFromString(graphContent, 'image/svg+xml');
      const svgContent = doc.documentElement;
      while (svgContent.firstChild) {
        svg.appendChild(svgContent.firstChild);
      }
    }
  }
  
  return {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues: issues,
    summary: {
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length
    }
  };
}

const a11yStore = {
  init() {
    this.setupSkipLinks();
    this.fixFakeLinks();
    this.initAccessibility();
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    // ... onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('dialog');
    dialog.id = id;
    // ... ('dialog');
    // ... `${id}-title`);
    // ... 'true');

    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;

    const closeButton = document.createElement('button');
    // ... closeLabel, () => {
    //   dialog.hidden = true;
    //   // ... ('true');
    // });

    dialog.appendChild(titleEl);
    dialog.appendChild(content);
    dialog.appendChild(closeButton);

    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    // ... priority);
    // ... ('true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    // ...
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // ... (e) => {
    //   if (e.key === 'Tab') {
    //     if (e.shiftKey && document.activeElement === firstElement) {
    //       e.preventDefault();
    //       // ...
    //     } else if (!e.shiftKey && document.activeElement === lastElement) {
    //       e.preventDefault();
    //       // ...
    //     }
    //   }
    // });
  },

  initAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('main-content');
        if (target) {
          target.tabIndex = -1;
          target.focus();
          this.announce('Skipped to main content');
        }
      });
    }

    document.querySelectorAll('img').forEach((img) => {
      if (!img.alt) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    // ... select, textarea', ... => {
    //   if (!input.id && input.name) {
    //     input.id = input.name;
    //   }
    //   const label = document.querySelector(`label[for="${input.id}"]`);
    //   if (!label && input.type !== 'hidden') {
    //     input.setAttribute('aria-label', input.name || 'Form input');
    //   }
    // });
  },

  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    // ... ('polite');
    // ... ('true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    // ...
    this.liveRegion = region;
  },

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    // ... priority);
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

  ... {
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

  addSvgAccessibility() {
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
    // Example: if (issue.type === 'landmark') { ... }
  });
}

function renderIndexView() {
  // Function to render the index view
}

function setFormElementAccessibleNames() {
  // Set accessible names for form elements
}

function setSvgAccessibilityProps() {
  // Set accessibility properties for SVG elements
}

function isLinkAccessible() {
  // Check if link is accessible
}

function isButtonAccessible() {
  // Check if button is accessible
}

function getSvgAccessibleName() {
  // Get accessible name for SVG
}

function checkAccessibility() {
  // Check overall accessibility
}

function checkLandmarks() {
  // Check landmarks
}

function checkLandmarkElement() {
  // Check individual landmark elements
}

function decodeJwtResponse() {
  // Decode JWT response
}

function fixButtonIdentifiers() {
  // Fix button identifiers
}

function addMainLandmarkToIndex() {
  // Add main landmark to index
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by imported components/index.html)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

// Export all functions and utilities
exports.addLangAttribute = addLangAttribute;
exports.addMainLandmark = addMainLandmark;
exports.addSvgAccessibleNames = addSvgAccessibleNames;
exports.checkAccessibility = checkAccessibility;
exports.checkLandmarks = checkLandmarks;
exports.checkLandmarkElement = checkLandmarkElement;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.fixFakeLinkIssue = fixFakeLinkIssue;
exports.fixFakeLinkIssues = fixFakeLinkIssues;
exports.fixLandmarkIssues = fixLandmarkIssues;
exports.addLandmarkRegions = addLandmarkRegions;
exports.uniqueLandmarks = uniqueLandmarks;
exports.fixImageAltTexts = fixImageAltTexts;
exports.googleSignIn = googleSignIn;
exports.handleCredentialResponse = handleCredentialResponse;