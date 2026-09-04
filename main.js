Here is the resolved version of the `main.js` file:

```javascript
// main.js - Screeps bot main loop

const books = [];
const safetyCategory = "User Safety: unsafe";
const CONFIG = {
  // ... Preserved config properties
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data',
  maxLandmarks: 50,
  allowedRoles: ['region', 'main', 'navigation', 'banner', 'complementary', 'contentinfo']
};

// ... Preserved functions for books management

// Landmark validation configuration (merged)
const config = {
  dataPath: './data',
  maxResults: 100
};

// Helper functions (merged)
function isValidLandmark(landmark) {
  return landmark && landmark.id && landmark.role;
}

function loadLandmarks() {
  try {
    const filePath = path.join(config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, config.maxResults);
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(landmark.id)) {
      return false;
    }
    seen.add(landmark.id);
    return true;
  });
}

// New functions to write the generated report to a file (merged)
function writeReport(report) {
  const reportFile = path.join(__dirname, 'report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Additional helper functions from the safe version (merged)
function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

// ... Rest of the original main.js code, if any.

// Exporting all preserved and new functions:
module.exports = {
  books,
  safetyCategory,
  CONFIG,
  utilFunctions,
  axe,
  express,
  fs,
  path,
  accessiblyHelper,
  processAccessibilityReport,
  loadLandmarks,
  processLandmarks,
  isValidLandmark,
  validateLandmark,
  validateInput,
  processData,
  getLangAttribute,
  getSvgAccessibleName,
  setSvgAttributes,
  validateTableAccessibility,
  validateTableStructure,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  createAccessibleLinks,
  getLangAttributeEl,
  addLangAttributeEl,
  createInPageButtonEl,
  validateLandmarkElCheck,
  getSvgAccessibleNameEl,
  ensureUniqueLandmarksFn,
  initialize,
  initializeApp,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  ensureElementHasId,
  addAriaLabel
};

module.exports.loop = function () {
  // Clean up memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Spawn creeps if needed
  const harvesterCount = _.filter(Game.creeps, c => c.memory.role === 'harvester').length;
  if (harvesterCount < 2 && Game.spawns['Spawn1'].spawning === null) {
    const newName = 'Harvester' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'harvester' }
    });
  }

  // Run creep roles
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      runHarvester(creep);
    }
  }
};

function runHarvester(creep) {
  if (creep.carry.energy < creep.carryCapacity) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (source) {
      creep.harvest(source);
    }
  } else {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN
    });
    if (target) {
      creep.transfer(target, RESOURCE_ENERGY);
    }
  }
}
```