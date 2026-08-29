'use strict';

/**
 * Screeps main loop module.
 *
 * Wires together role modules and utility functions for the Screeps AI bot.
 */

// Lazily load role/utility modules with graceful fallback so the file
// can be imported in a Jest environment without the Screeps runtime.
function loadModule(name) {
  try {
    return require(name);
  } catch (e) {
    return null;
  }
}

const roleHarvester = loadModule('role.harvester');
const roleUpgrader = loadModule('role.upgrader');
const roleBuilder = loadModule('role.builder');
const roleRepairer = loadModule('role.repairer');
const towerManager = loadModule('tower.manager');

const loadedModules = {
  'role.harvester': roleHarvester,
  'role.upgrader': roleUpgrader,
  'role.builder': roleBuilder,
  'role.repairer': roleRepairer,
  'tower.manager': towerManager,
};

// Configuration constants
const CONFIG = {
  minimumHarvesters: 4,
  minimumUpgraders: 2,
  minimumBuilders: 2,
  minimumRepairers: 1,
  logLevel: 'info',
};

// Clean up memory for creeps that no longer exist
function cleanCreepMemory() {
  if (typeof Memory === 'undefined' || !Memory.creeps) return;
  for (const name in Memory.creeps) {
    if (typeof Game === 'undefined' || !Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
}

// Run a role module for each creep in the provided list
function runRole(roleModule, creeps) {
  if (!creeps || creeps.length === 0) return;
  if (!roleModule || typeof roleModule.run !== 'function') return;
  for (const creep of creeps) {
    roleModule.run(creep);
  }
}

// Main game loop logic
function runMainLoop() {
  cleanCreepMemory();

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
  const repairers = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer');

  runRole(roleHarvester, harvesters);
  runRole(roleUpgrader, upgraders);
  runRole(roleBuilder, builders);
  runRole(roleRepairer, repairers);

  if (towerManager && typeof towerManager.run === 'function') {
    towerManager.run();
  }
}

// Implement functions to render dependency graphs and display module structure for debugging purposes.

/**
 * Build a dependency graph from a map of loaded modules.
 *
 * Each module may optionally expose a `dependencies` array describing which
 * other modules it depends on. The resulting graph contains a list of node
 * names and a list of directed edges [from, to].
 *
 * @param {Object} modules - Map of module name to module object.
 * @returns {Object} Graph object with `nodes` (string[]) and `edges` ([string, string][]).
 */
function buildDependencyGraph(modules) {
  const graph = { nodes: [], edges: [] };
  if (!modules) return graph;

  for (const name of Object.keys(modules)) {
    graph.nodes.push(name);
    const mod = modules[name];
    if (mod && typeof mod === 'object' && Array.isArray(mod.dependencies)) {
      for (const dep of mod.dependencies) {
        if (modules[dep]) {
          graph.edges.push([name, dep]);
        }
      }
    }
  }

  return graph;
}

/**
 * Render a dependency graph as a text-based adjacency list for debugging.
 *
 * @param {Object} graph - Graph object produced by buildDependencyGraph.
 * @returns {string} Multi-line string representation of the graph.
 */
function renderDependencyGraph(graph) {
  if (!graph || !graph.nodes) return '';

  const adjacency = {};
  for (const node of graph.nodes) {
    adjacency[node] = [];
  }
  for (const edge of graph.edges) {
    adjacency[edge[0]].push(edge[1]);
  }

  const lines = [];
  for (const node of graph.nodes) {
    const deps = adjacency[node].length > 0 ? adjacency[node].join(', ') : '(none)';
    lines.push(node + ' -> ' + deps);
  }

  return lines.join('\n');
}

/**
 * Inspect loaded modules and return a structured description of their exports.
 *
 * @param {Object} modules - Map of module name to module object.
 * @returns {Object} Map of module name to an object with `exports` (string[]) and `type` (string).
 */
function displayModuleStructure(modules) {
  const structure = {};
  if (!modules) return structure;

  for (const name of Object.keys(modules)) {
    const mod = modules[name];
    if (mod === null || mod === undefined) {
      structure[name] = { exports: [], type: typeof mod };
      continue;
    }
    const exportKeys = [];
    for (const key of Object.keys(mod)) {
      exportKeys.push(key);
    }
    structure[name] = {
      exports: exportKeys,
      type: typeof mod,
    };
  }

  return structure;
}

/**
 * Render the module structure as a formatted string for debugging output.
 *
 * @param {Object} modules - Map of module name to module object.
 * @returns {string} Formatted multi-line string describing each module's exports.
 */
function renderModuleStructure(modules) {
  const structure = displayModuleStructure(modules);
  const lines = ['Module Structure:'];

  for (const name of Object.keys(structure)) {
    const info = structure[name];
    lines.push('  ' + name + ' (' + info.type + '): [' + info.exports.join(', ') + ']');
  }

  return lines.join('\n');
}

module.exports = {
  CONFIG,
  loadedModules,
  cleanCreepMemory,
  runRole,
  runMainLoop,
  buildDependencyGraph,
  renderDependencyGraph,
  displayModuleStructure,
  renderModuleStructure,
  loop: function () {
    runMainLoop();
  },
};