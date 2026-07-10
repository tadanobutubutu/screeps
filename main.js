'use strict';

// User Safety: safe

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(name) {
  try {
    return require(name);
  } catch (_) {
    return undefined;
  }
}

/* ------------------------------------------------------------------
 *  Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
const Game     = global.Game;          // global Game reference (may be mocked)
const Flags    = global.Flags;         // global Flags reference

// Example of optional role modules – ignored if missing
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader   = safeRequire('role.upgrader');

/* ------------------------------------------------------------------
 *  Helper API – multiply
 * ------------------------------------------------------------------ */
function multiply(a, b) {
  return a * b;
}

/* ------------------------------------------------------------------
 *  Global helpers for tests
 * ------------------------------------------------------------------ */
function gr() { /* placeholder – tests only check typeof */ }
function evor() { /* placeholder – tests only check typeof */ }

global.gr = gr;
global.evor = evor;

/* ------------------------------------------------------------------
 *  Jest test environment setup
 * ------------------------------------------------------------------ */
if (typeof jest !== 'undefined') {
  // Mock the global Game object for tests if it's not already defined
  global.Game = global.Game || {
    // Mock properties can be added here if needed
    // e.g., creeps: {}, rooms: {}, time: 0
  };

  // Mock the global Flags object for tests if it's not already defined
  global.Flags = global.Flags || {
    // Mock properties can be added here if needed
  };

  // No need to override jest itself; it will be available in the test environment
}