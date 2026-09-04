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

// This section was preserved
const books = [];
const safetyCategory = "User Safety: safe";

// New functions for accessibility and networking
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
  const { spawn } = require('child_process');
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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

const config = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};