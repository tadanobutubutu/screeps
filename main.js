// Import the required module
const _ = require('lodash');

// Configuration
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// Ensure keyboard navigation for interactive elements
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
  // Trap focus within modals for screen readers
  document.querySelectorAll('[role="dialog"]').forEach(modal => {
    modal.addEventListener('keydown', trapTabKey);
  });

  // Announce dynamic content changes to screen readers
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);

  // Add accessibility utilities for the bot
  addLandmarkIssues(document);
  addSvgAccessibleNames(document);
  ensureUniqueLandmarks(document);
  fixFakeLinkIssue(document);
}

/**
 * Trap Tab key within focusable elements
 * @param {KeyboardEvent} e - Keyboard event
 */
function trapTabKey(e) {
  if (e.key !== 'Tab') return;

  const focusableContent = e.target.querySelectorAll(focusableElements);
  const firstFocusable = focusableContent[0];
  const lastFocusable = focusableContent[focusableContent.length - 1];

  if (e.shiftKey && document.activeElement === firstFocusable) {
    e.preventDefault();
    lastFocusable.focus();
  } else if (!e.shiftKey && document.activeElement === lastFocusable) {
    e.preventDefault();
    firstFocusable.focus();
  }
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
  const liveRegion = document.querySelector('[role="status"]');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

// Validate a landmark object
function validateLandmark(landmark) {
  // Check if landmark exists
  if (!landmark) {
    return false;
  }

  // Validate name is present and non-empty
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }

  // Validate coordinates if present
  if (landmark.latitude !== undefined || landmark.longitude !== undefined) {
    if (typeof landmark.latitude !== 'number' || typeof landmark.longitude !== 'number') {
      return false;
    }
    // Validate latitude range (-90 to 90)
    if (landmark.latitude < -90 || landmark.latitude > 90) {
      return false;
    }
    // Validate longitude range (-180 to 180)
    if (landmark.longitude < -180 || landmark.longitude > 180) {
      return false;
    }
  }

  return true;
}

function initialize() {
  console.log('Application initialized');
  return true;
}

function processData(data) {
  if (!data) {
    throw new Error('No data provided');
  }
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0;
}

function addressAccessibilityIssues(insightReport) {
  if (insightReport && insightReport.issues) {
    insightReport.issues.forEach(issue => {
      console.log(`Accessibility issue detected: ${issue.message}`);
    });
  }
}

const isInitialized = (() => {
  if (!global.gameInitialized) {
    global.gameInitialized = true;
    initialize();
  }
  return global.gameInitialized;
})();

/**
 * Main game loop for the Screeps bot.
 * Runs every tick.
 */
export function loop() {
  if (!isInitialized) {
    initialize();
    isInitialized = true;
  }

  // Handle room-level operations
  handleRooms();

  // Render dashboard UI (if available)
  if (typeof Dashboard !== 'undefined' && Dashboard) {
    Dashboard.render();
  }
}

/**
 * Execute room-level logic: spawn management, creeps, construction, etc.
 * @param {Room} room - The room to process.
 */
function handleRoomLogic(room) {
    const roomName = room.roomName;
    const spawn = Game.spawns[Object.keys(Game.spawns).find(key => Game.spawns[key].room.name === roomName)];

    // Spawn creeps based on roles
    if (spawn && spawn.isActive()) {
        manageSpawning(room, spawn);
    }

    // Run all creep logic
    runCreeps(roomName);
}

/**
 * Manage creep spawning based on room needs.
 * @param {Room} room - The room to spawn in.
 * @param {StructureSpawn} spawn - The spawn structure.
 */
function manageSpawning(room, spawn) {
    const energyCapacity = room.energyCapacityAvailable;
    const body = energyCapacity >= 300 ? [WORK, CARRY, MOVE] : [WORK, MOVE];
    const role = room.energyAvailable < 150 ? 'harvester' : 'worker';

    if (!spawn.spawning && Object.values(Game.creeps).filter(c => c.memory.role === role).length < 3) {
        spawn.spawnCreep(body, `${role}_${Game.time}`, {
            memory: { role: role }
        });
    }
}

/**
 * Harvester: collects and transfers energy.
 * @param {Creep} creep
 */
function runHarvester(creep) {
    const sources = creep.room.find(FIND_SOURCES);
    const source = sources[0];
    if (source) {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

    if (creep.store.getFreeCapacity() === 0) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_SPAWN &&
                           s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        const target = targets[0];
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}

/**
 * Builder: repairs structures and builds construction sites.
 * @param {Creep} creep
 */
function runBuilder(creep) {
    let target = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
    if (!target) {
        target = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax
        })[0];
    }

    if (target) {
        if (target instanceof ConstructionSite) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}

/**
 * Default worker: harvests and upgrades controller.
 * @param {Creep} creep
 */
function runWorker(creep) {
    const sources = creep.room.find(FIND_SOURCES);
    const source = sources[0];
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }

    if (creep.store.getFreeCapacity() === 0 && creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}

function handleRooms() {
  for (const roomName in Game.rooms) {
    handleRoomLogic(Game.rooms[roomName]);
  }
}

function runCreeps(roomName) {
  const room = Game.rooms[roomName];
  if (!room) return;

  for (const name in room.creeps) {
    const creep = room.creeps[name];
    const role = creep.memory.role;

    switch (role) {
      case 'harvester':
        runHarvester(creep);
        break;
      case 'builder':
        runBuilder(creep);
        break;
      default:
        runWorker(creep);
    }
  }
}

// Placeholder for any missing exports
function missingExportPlaceholder() {}

// Accessibility-related helper functions used by initializeAccessibility
function addLandmarkIssues(doc) {
    // Implementation for adding landmark issues
}

function addSvgAccessibleNames(doc) {
    // Implementation for adding SVG accessible names
}

function ensureUniqueLandmarks(doc) {
    // Implementation for ensuring unique landmarks
}

function fixFakeLinkIssue(doc) {
    // Implementation for fixing fake link issues
}

function createInPageButton() {
    // Implementation for creating in-page button
}

function myNewFunction() {
    // New function placeholder
}

// CommonJS and ES Module exports
const accessibilityExports = {
  addLandmarkIssues,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  initializeAccessibility,
  createInPageButton,
  validateLandmark,
  myNewFunction,
  trapTabKey,
  announceToScreenReader
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initialize,
    processData,
    validateInput,
    addressAccessibilityIssues,
    config,
    missingExportPlaceholder,
    loop,
    validateLandmark,
    announceToScreenReader,
    initializeAccessibility,
    ...accessibilityExports
  };
}

if (typeof exports !== 'undefined') {
  exports.default = accessibilityExports;
}

// Auto-initialize accessibility when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}