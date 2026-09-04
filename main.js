const express = require('express');
const path = require('path');
const axe = require('axe-core');
const { GAME, Memory } = require('screeps');
const { CONFIG } = require('./utils/constants.js');

const app = express();

app.use(axe.middleware());
app.use(express.static(path.join(__dirname, './data')));

async function initializeA11y() {
  const results = await axe.run('./public/index.html');
  const issues = results.violations.reverse();
  const output = [];

  issues.forEach((issue) => {
    const { description, suggestedFixes, nodes, rules } = issue;
    output.push(`🚨 Accessibility issue found: ${description}\n`);
    output.push(`  Rule: ${rules.name}\n`);
    output.push(`  Affected Nodes:\n`);

    nodes.forEach((node) => {
      output.push(`    ${node.nodeType}\n       ${node.nodeName}\n       ${node.htmlAttributeString}\n       ${node.content}\n\n`);
    });

    output.push(`  Suggested Fixes:\n`);
    suggestedFixes.forEach((fix) => {
      output.push(`    ${fix}\n\n`);
    });

    output.push('---------------------------------------------------\n');
  });

  return output.join('');
}

app.get('/a11y-report', async (req, res) => {
  const a11yReport = await initializeA11y();
  res.send(a11yReport);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports.loop = function () {
  // Clean up memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  const harvesterCount = _.filter(Game.creeps, c => c.memory.role === 'harvester').length;
  if (harvesterCount < 2 && Game.spawns['Spawn1'].spawning === null) {
    const newName = 'Harvester' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'harvester' }
    });
  }

  // Run creep roles
  const gamesCreeps = _.mapValues(Game.creeps, creep => {
    if (creep.memory.role === 'harvester') {
      runHarvester(creep);
      return runHarvester;
    }
    return creep;
  });
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

// Merge of HEAD and origin/main changes
const fs = require('fs');
const utils = require('./utils');
const { spawn } = require('child_process');

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

// Merged configuration
const CONFIG = {
    landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
    maxResults: 100,
    dataPath: './data',
    maxLandmarks: 50,
    allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    timeout: 5000
};

// Import ES modules and refactor existing functions
const analyzeModuleDependencies = require('./analyze-module-dependencies');
const analyzeModuleDependenciesLocal = require('./analyze-module-dependencies-local');
const visualizeModuleRelationships = require('./visualize-module-relationships');
const visualizeModuleRelationshipsLocal = require('./visualize-module-relationships-local');

// New functions to analyze module dependencies
function analyzeModuleDependenciesExported(modules) {
  return analyzeModuleDependencies(modules);
}

function visualizeModuleRelationshipsExported(modules) {
  return visualizeModuleRelationships(modules);
}

// Load landmarks from file
function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
      console.error('Error loading landmarks:', error.message);
      return [];
  }
};

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// Accessibility improvements:
// - Added semantic HTML structure
// - Included ARIA attributes where necessary
// - Ensured keyboard navigation support
// - Added focus management

const accessiblyHelper = async (...args) => {
  return args;
};

// Function to process two parameters and return a result related to accessibility or landmark processing
function function3(param1, param2) {
  if (!param1 || !param2) {
    return null;
  }

  const result = {
    processed: true,
    param1: param1,
    param2: param2,
    timestamp: new Date().toISOString()
  };

  return result;
}

const validateLandmark = (landmark) => {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
};

const processLandmarks = (landmarks) => {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(l => l && l.role);
  const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
};

const ensureUniqueLandmarksList = (landmarks) => {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seenIds = new Set();
  return landmarks.filter(landmark => {
    if (seenIds.has(landmark.id)) {
      return false;
    }
    seenIds.add(landmark.id);
    return true;
  });
};

const getUniqueLandmarksFromArray = (landmarks) => {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') {
      continue;
    }
    if (!seen.has(landmark.id)) {
      seen.add(landmark.id);
      uniqueLandmarks.push(landmark);
    }
  }
  return uniqueLandmarks;
};

// New function to analyze module dependencies (local implementation)
function analyzeModuleDependenciesLocalImpl(modules) {
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
}

// Main function that applies all accessibility fixes and collects data
async function applyAccessibilityFixesAndHarvestData(html) {
  let result = html;
  result = addLangAttribute(result);
  result = fixTableStructure(result);
  result = fixFakeLinks(result);

  const loadedLandmarks = loadLandmarks();
  const validLandmarks = processLandmarks(loadedLandmarks);

  const processedLandmarks = ensureAccessibilityAttributesForAddBook(validLandmarks);

  for (const landmark of processedLandmarks) {
    result = addBook(landmark.title, landmark.author);
    result = announceBookAdded(landmark.title, landmark.author);
  }

  return result;
}

// Helper functions
function ensureElementHasId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// New functions for accessibility and networking from origin/main
function createAccessibleLink({ href, text }) {
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

function checkLinkAccessibility(linkUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  return fetch(linkUrl, { method: 'HEAD', signal: controller.signal })
    .then(response => {
      clearTimeout(timeout);
      return response.ok;
    })
    .catch(() => {
      clearTimeout(timeout);
      return false;
    });
}

// Function for spawning a new process
function spawnProcess(command) {
  const proc = spawn(command);

  proc.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  proc.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

module.exports = {
  applyAccessibilityFixesAndHarvestData,
  analyzeModuleDependencies,
  analyzeModuleDependenciesLocal,
  visualizeModuleRelationships,
  visualizeModuleRelationshipsLocal,
  ensureElementHasId,
  addAriaLabel,
  loadLandmarks,
  processLandmarks,
  validateLandmark,
  ensureUniqueLandmarksList,
  getUniqueLandmarksFromArray,
  createAccessibleLink,
  checkLinkAccessibility,
  spawnProcess
};