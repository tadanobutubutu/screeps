// main.js - Screeps bot entry point
// This file was automatically generated - do not edit directly
// Any changes should be made to the source template

const { run: runRoles } = require('roles');
const { run: runTowers } = require('towers');
const { run: runLinks } = require('links');
const { run: runTerminals } = require('terminals');
const { run: runLabs } = require('labs');
const { run: runPower } = require('power');
const { run: runFactory } = require('factory');
const { run: runMarket } = require('market');
const { run: runCreeps } = require('creeps');
const { run: runRooms } = require('rooms');
const { run: runStats } = require('stats');
const { run: runVisuals } = require('visuals');
const { init: initMemory, cleanup: cleanupMemory } = require('memory');
const { init: initProfiler } = require('profiler');

module.exports = {
  main: function () {
    // Initialize profiler if enabled
    if (Game.cpu.bucket > 5000) {
      initProfiler();
    }

    // Initialize memory structures
    initMemory();

    // Run room-level logic
    runRooms();

    // Run creep logic
    runCreeps();

    // Run role logic
    runRoles();

    // Run structure logic
    runTowers();
    runLinks();
    runTerminals();
    runLabs();
    runPower();
    runFactory();

    // Run market logic
    runMarket();

    // Run statistics and visuals
    runStats();
    runVisuals();

    // Cleanup memory
    cleanupMemory();

    // CPU reporting
    if (Game.time % 100 === 0) {
      console.log(`CPU: ${Game.cpu.getUsed().toFixed(2)} | Bucket: ${Game.cpu.bucket} | Creeps: ${Object.keys(Game.creeps).length}`);
    }
  },

  loop: function () {
    try {
      this.main();
    } catch (error) {
      console.log(`Error in main loop: ${error.stack}`);
      Game.notify(`Error in main loop: ${error.message}`);
    }
  }
};

// Tutorial configuration for new players
module.exports.tutorial = {
  enabled: false,
  steps: [
    'spawn_first_creep',
    'build_extension',
    'upgrade_controller',
    'build_spawn'
  ]
};