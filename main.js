import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// Implemented validateLandmark functionality
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
  } else if (typeof landmark.longitude !== 'number' || ... {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = ...
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// ... (previous and updated code remains as it is)

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if ... {
          ... = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// Tower Defense Implementation
//_Commit: bad5330fc7d42473c58ae7d9b7d0980a74df168a_
//<!-- todo-hash: d1097831dd6a988f88055560e8a736fe74c86e3e -->

const towerDefenseState = {
    gold: 100,
    lives: 10,
    wave: 0,
    score: 0,
    towers: [],
    enemies: [],
    projectiles: [],
    isRunning: false,
    gameSpeed: 1,
    mapWidth: 800,
    mapHeight: 600,
    path: [
        { x: 0, y: 300 },
        { x: 200, y: 300 },
        { x: 200, y: 100 },
        { x: 400, y: 100 },
        { x: 400, y: 500 },
        { x: 600, y: 500 },
        { x: 600, y: 300 },
        { x: 800, y: 300 }
    ]
};

const TOWER_TYPES = {
    BASIC: {
        name: 'Basic Tower',
        cost: 50,
        damage: 10,
        range: 100,
        fireRate: 1,
        color: '#4a90d9'
    },
    CANNON: {
        name: 'Cannon Tower',
        cost: 100,
        damage: 30,
        range: 80,
        fireRate: 0.5,
        color: '#d94a4a'
    },
    ARCHER: {
        name: 'Archer Tower',
        cost: 75,
        damage: 15,
        range: 150,
        fireRate: 2,
        color: '#4ad94a'
    },
    ICE: {
        name: 'Ice Tower',
        cost: 125,
        damage: 5,
        range: 120,
        fireRate: 1.5,
        slowAmount: 0.5,
        slowDuration: 2000,
        color: '#4ad9d9'
    }
};

const ENEMY_TYPES = {
    BASIC: {
        name: 'Basic Enemy',
        health: 30,
        speed: 1,
        reward: 10,
        color: '#ff6b6b'
    },
    FAST: {
        name: 'Fast Enemy',
        health: 20,
        speed: 2,
        reward: 15,
        color: '#ffd93d'
    },
    TANK: {
        name: 'Tank Enemy',
        health: 100,
        speed: 0.5,
        reward: 25,
        color: '#6c5ce7'
    },
    BOSS: {
        name: 'Boss Enemy',
        health: 500,
        speed: 0.3,
        reward: 100,
        color: '#a55eea'
    }
};

/**
 * Creates a new tower at the specified position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Tower type key
 * @returns {object|null} Created tower object or null if invalid
 */
function createTower(x, y, type = 'BASIC') {
    const towerType = TOWER_TYPES[type];
    if (!towerType) {
        return null;
    }
    
    if (towerDefenseState.gold < towerType.cost) {
        return null;
    }
    
    if (x < 0 || x > towerDefenseState.mapWidth || y < 0 || y > towerDefenseState.mapHeight) {
        return null;
    }
    
    const tower = {
        id: Date.now() + Math.random(),
        x,
        y,
        type,
        ...towerType,
        lastFired: 0,
        target: null
    };
    
    towerDefenseState.gold -= towerType.cost;
    towerDefenseState.towers.push(tower);
    
    return tower;
}

/**
 * Creates an enemy at the start of the path
 * @param {string} type - Enemy type key
 * @returns {object} Created enemy object
 */
function createEnemy(type = 'BASIC') {
    const enemyType = ENEMY_TYPES[type];
    if (!enemyType) {
        return null;
    }
    
    const path = towerDefenseState.path;
    const startPos = path[0];
    
    const enemy = {
        id: Date.now() + Math.random(),
        type,
        ...enemyType,
        currentHealth: enemyType.health,
        maxHealth: enemyType.health,
        x: startPos.x,
        y: startPos.y,
        pathIndex: 0,
        progress: 0,
        slowedUntil: 0
    };
    
    towerDefenseState.enemies.push(enemy);
    return enemy;
}

/**
 * Creates a projectile from a tower to an enemy
 * @param {object} tower - The tower firing the projectile
 * @param {object} enemy - The target enemy
 * @returns {object} Created projectile object
 */
function createProjectile(tower, enemy) {
    const dx = enemy.x - tower.x;
    const dy = enemy.y - tower.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 5;
    
    const projectile = {
        id: Date.now() + Math.random(),
        x: tower.x,
        y: tower.y,
        targetId: enemy.id,
        damage: tower.damage,
        speed,
        vx: (dx / distance) * speed,
        vy: (dy / distance) * speed,
        slowAmount: tower.slowAmount || 0,
        slowDuration: tower.slowDuration || 0
    };
    
    towerDefenseState.projectiles.push(projectile);
    return projectile;
}

/**
 * Gets the distance between two points
 * @param {number} x1 - First point X
 * @param {number} y1 - First point Y
 * @param {number} x2 - Second point X
 * @param {number} y2 - Second point Y
 * @returns {number} Distance between points
 */
function getDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Finds the closest enemy within tower range
 * @param {object} tower - The tower to find targets for
 * @returns {object|null} Closest enemy or null
 */
function findTarget(tower) {
    let closest = null;
    let closestDist = tower.range;
    
    for (const enemy of towerDefenseState.enemies) {
        const dist = getDistance(tower.x, tower.y, enemy.x, enemy.y);
        if (dist < closestDist) {
            closestDist = dist;
            closest = enemy;
        }
    }
    
    return closest;
}

/**
 * Moves an enemy along the path
 * @param {object} enemy - The enemy to move
 * @param {number} deltaTime - Time since last update
 */
function moveEnemy(enemy, deltaTime) {
    const path = towerDefenseState.path;
    
    // Check if slowed
    const now = Date.now();
    let speedMultiplier = 1;
    if (enemy.slowedUntil && enemy.slowedUntil > now) {
        speedMultiplier = enemy.slowAmount || 0.5;
    }
    
    const effectiveSpeed = enemy.speed * speedMultiplier * towerDefenseState.gameSpeed;
    
    if (enemy.pathIndex >= path.length - 1) {
        // Enemy reached the end
        towerDefenseState.lives--;
        towerDefenseState.enemies = towerDefenseState.enemies.filter(e => e.id !== enemy.id);
        return;
    }
    
    const currentPoint = path[enemy.pathIndex];
    const nextPoint = path[enemy.pathIndex + 1];
    
    const segmentDist = getDistance(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
    const progressIncrement = (effectiveSpeed * deltaTime) / segmentDist;
    
    enemy.progress += progressIncrement;
    
    if (enemy.progress >= 1) {
        enemy.pathIndex++;
        enemy.progress = 0;
        
        if (enemy.pathIndex < path.length - 1) {
            const newCurrent = path[enemy.pathIndex];
            enemy.x = newCurrent.x;
            enemy.y = newCurrent.y;
        }
    } else {
        // Interpolate position
        enemy.x = currentPoint.x + (nextPoint.x -