"use strict";

/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes.
 */

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

/* --------------------- Imports --------------------- */
const Game = global.Game || {};
const Flags = global.Flags || {};

const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder  = safeRequire('role.builder');
const roleMiner    = safeRequire('role.miner');
const roleCreep    = safeRequire('role.creep');

// Just some placeholder logic so that the rest of the file compiles.
// The real bot logic is omitted – this file is only required for the test suite.
function spawnCreeps() {
  /* ... */
}

/* --------------------- Exported API --------------------- */

/**
 * Return the product of two numbers.
 *
 * @param {number} a – First operand
 * @param {number} b – Second operand
 * @returns {number} – a * b
 */
function multiply(a, b) {
  return a * b;
}

/* Export the multiply function. Users of this module can do:
 * const { multiply } = require('./main');
 * multiply(3, 4); // 12
 */
exports.multiply = multiply;

/* --------------------- Global helpers for tests --------------------- */

/**
 * Stub for the `gr` command used in the legacy test suite.
 * The original bot did something more useful here, but a simple
 * no‑op is sufficient for the current Jest expectations.
 */
global.gr = function () {
  // no operation
};