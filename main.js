"use strict";
/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes. */
/* global describe, test, expect */

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(name) {
  try {
    return require(name);
  } catch (_) {
    return undefined; // module missing / failed to load
  }
}

// ----------------- Imports ----------------------------
const Game = global.Game || {};
const Flags = global.Flags || {};

// Roles
const roleHarvester = require('role.harvester');
const roleUpgrader   = require('role.upgrader');
const roleBuilder    = require('role.builder');
const awayHarvester = require('role.awayHarvester'); // New import
const spawner = require('role.spawner'); // New import
const controllerDefault = require('role.controllerDefault'); // New import

// Optional modules
const Controller = safeRequire("./controller");
const Defender   = safeRequire("./defender");
const Builder    = safeRequire("./builder");

/* ----------------- Jest for Testing ------------------ */
// Add jest to the environment globals for test mocking
global.jest = require('jest');
try {
    jest.mock('screeps');
} catch (e) {
    // If mocking fails, likely running in production; ignore
}

// Ensure jest is installed and available in the environment
const jestPath = safeRequire('jest');

if (!jestPath) {
    throw new Error('Jest is not installed. Please install Jest in your project.');
}

/**
 * Main loop called by the Screeps engine once per tick.
 * Placeholder for further implementation. */
module.exports.loop = function() {
    // ... existing code ...

    // Example of a simple status check
    if (Game.time % 10 === 0) {
        console.log('Status:', Game.time, 'ticks passed.');
    }

    // ... existing code ...
};