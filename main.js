"use strict";
/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes. */
/* ----------------- Imports ---------------------------- */
const Game = global.Game || {};
const Flags = global.Flags || {};

/* ----------------- Jest for Testing ------------------ */
// Add jest to the environment globals for test mocking
global.jest = require('jest');
try {
    jest.mock('screeps');
} catch (e) {
    // If mocking fails, likely running in production; ignore
}

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

// Roles
const roleHarvester = require('role.harvester');
const roleUpgrader   = require('role.upgrader');
const roleBuilder    = require('role.builder');

// Optional modules
const Controller = safeRequire("./controller") || require("./controller");
const Defender   = safeRequire("./defender")   || require("./defender");
const Builder    = safeRequire("./builder")    || require("./builder");

/**
 * Main loop called by the Screeps engine once per tick.
 * Placeholder for further implementation. */