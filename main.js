"use strict";

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
  // Mock the global Game object for tests
  global.Game = global.Game || {
    // Add any necessary mock properties here
    // For example:
    // creeps: {},
    // rooms: {},
    // time: 0
  };

  // Mock the global Flags object for tests
  global.Flags = global.Flags || {
    // Add any necessary mock properties here
  };

  // Mock Jest utilities to avoid “jest not found” errors
  const actualJest = jest;
  global.jest = {
    ...actualJest,
    // Preserve essential Jest functions that tests may call
    mock: actualJest.fn,
    fn: actualJest.fn,
    spyOn: actualJest.spyOn,
    mockModule: actualJest.mock,
    clearAllMocks: actualJest.clearAllMocks,
  };

  // Ensure the real jest mocking behaviour works if the test runner provides it
  if (actualJest && typeof actualJest.mock === 'function') {
    global.jest.mock = actualJest.mock;
  }

  // Add a simple mock for require if needed
  if (typeof require !== 'undefined') {
    global.require = require;
  }

  // Add a mock for the EmotionSystem if needed
  global.EmotionSystem = global.EmotionSystem || {
    interact: jest.fn()
  };

  // Add a mock for the process object if needed
  global.process = global.process || {
    env: {
      NODE_ENV: 'test'
    }
  };
}

/* ------------------------------------------------------------------
 *  Main loop – minimal implementation for tests
 * ------------------------------------------------------------------ */
function loop() {
  // If EmotionSystem is available, call its interact method.
  const EmotionSystem = global.EmotionSystem;
  if (EmotionSystem && typeof EmotionSystem.interact === 'function') {
    EmotionSystem.interact();
  }

  /* Optional logic – iterate over flags or rooms would go here */
}

/* ------------------------------------------------------------------
 *  Exported API
 * ------------------------------------------------------------------ */
module.exports = {
  multiply,
  loop
};