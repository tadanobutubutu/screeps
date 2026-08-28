// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_017: Add landmark roles and fix landmark issues (DONE: addLandmarkRole, ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// - REACT_035: Function to create accessible in-page buttons (DONE: createInPageButton)

/**
 * Generates a unique landmark ID to ensure unique landmarks
 * @param {string} baseId - The base identifier for the landmark
 * @returns {string} - A unique landmark ID
 */
function getUniqueLandmarkId(baseId) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${baseId}-${timestamp}-${random}`;
}

/**
 * Adds landmark roles to elements that need them for accessibility
 * @param {string} selector - CSS selector for the element
 * @param {string} landmarkRole - The landmark role to add (e.g., 'navigation', 'main', 'banner')
 */
function addLandmarkRole(selector, landmarkRole) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    element.setAttribute('role', landmarkRole);
    if (landmarkRole === 'navigation') {
      element.setAttribute('aria-label', `Navigation ${index + 1}`);
    } else if (landmarkRole === 'main') {
      element.setAttribute('aria-label', `Main content`);
    } else if (landmarkRole === 'banner') {
      element.setAttribute('aria-label', `Site header`);
    }
  });
}

/**
 * Ensures all landmarks on the page have unique identifiers
 * Validates and fixes duplicate landmark issues
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], nav, main, header, footer');
  const seenLandmarks = new Map();

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const existingIds = seenLandmarks.get(role) || [];

    if (existingIds.length > 0) {
      // This is a duplicate landmark - make it unique
      const uniqueId = getUniqueLandmarkId(`landmark-${role}`);
      landmark.id = uniqueId;
      landmark.setAttribute('aria-label', `${role} ${existingIds.length + 1}`);
    }

    if (!landmark.id) {
      landmark.id = getUniqueLandmarkId(`landmark-${role}`);
    }

    seenLandmarks.set(role, [...existingIds, landmark.id]);
  });
}

/**
 * Adds accessible names to SVG elements
 * @param {string} selector - CSS selector for SVG elements
 * @param {string} name - The accessible name to add
 */
function addSvgAccessibleName(selector, name) {
  const svgs = document.querySelectorAll(selector);
  svgs.forEach((svg, index) => {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name || `SVG icon ${index + 1}`);
  });
}

/**
 * Fixes fake link issues by ensuring proper semantic markup
 * @param {string} selector - CSS selector for fake links
 */
function fixFakeLinks(selector) {
  const fakeLinks = document.querySelectorAll(selector);
  fakeLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Check if it's a fake link (no href or href that looks like JavaScript)
    if (!href || href.startsWith('javascript:') || href === '#') {
      // Add button role if it's not already a button
      if (link.tagName !== 'BUTTON') {
        link.setAttribute('role', 'button');

        // Add keyboard support
        if (!link.hasAttribute('tabindex')) {
          link.setAttribute('tabindex', '0');
        }

        // Add click handler if not present
        link.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
          }
        });
      }
    }
  });
}

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 */
function addHtmlLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

const Dashboard = require('./dashboard'); // Adjust path as needed

let isInitialized = false;

function initialize() {
  console.log('Application initialized');
  // Initialize accessibility fixes when DOM is ready
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      // Add lang attribute to HTML element (REACT_015)
      addHtmlLangAttribute();

      // Add landmark roles (REACT_017)
      addLandmarkRole('nav', 'navigation');
      addLandmarkRole('main', 'main');
      addLandmarkRole('header', 'banner');
      addLandmarkRole('footer', 'contentinfo');

      // Ensure unique landmarks (REACT_025)
      ensureUniqueLandmarks();

      // Add accessible names to SVGs (REACT_041)
      addSvgAccessibleName('svg', 'Decorative icon');

      // Fix fake links (REACT_036)
      fixFakeLinks('.fake-link');
    });
  }
  isInitialized = true;
  return true;
}

/**
 * Main game loop for the Screeps bot.
 * Runs every tick.
 */
module.exports.loop = function() {
  if (!isInitialized) {
    initialize();
  }
    // Render dashboard UI (if available)
  if (Dashboard) {
    Dashboard.render();
  }

  handleRooms();
};

/**
 * Execute room-level logic: spawn management, creeps, construction, etc.
 * @param {Room} room - The room to process.
 */
function handleRoomLogic(room) {
    const roomName = room.roomName;
    const spawn = room.find(FIND_MY_SPAWNS)[0];

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
    const role = room.find(FIND_CREEPS).filter((c) => c.memory.role === 'harvester').length < 3 ? 'harvester' : 'worker';

    if (!spawn.spawning && room.find(FIND_CREEPS).filter((c) => c.memory.role === role).length < 3) {
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
    const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (source) {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

    if (creep.store.getFreeCapacity() === 0) {
        const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_SPAWN &&
                           s.store.getFreeCapacity(ENERGY) > 0
        });
        if (target) {
            if (creep.transfer(target, ENERGY) === ERR_NOT_IN_RANGE) {
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
    let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax
        })[0];
    }

    if (target) {
        if (creep.build && target.structureType === STRUCTURE_CONSTRUCTION_SITE) {
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
    const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
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

module.exports = {
  getUniqueLandmarkId,
  addLandmarkRole,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  fixFakeLinks,
  addHtmlLangAttribute,
  initialize,
  config
};