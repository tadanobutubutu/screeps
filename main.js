'use strict';

// User Safety: safe

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        return undefined;
    }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

/* ------------------------------------------------------------------
 *  Ensure Jest is available for CI test runs; install if missing
 * ------------------------------------------------------------------ */
function ensureJestForTests() {
  try {
    // Attempt to load jest; if it resolves, we are good
    require('jest');
  } catch (_) {
    // If jest is not installed, install it locally as a dev dependency
    const { execSync } = require('child_process');
    // Use npm to install jest; --save-dev marks it as a devDependency
    execSync('npm install jest --save-dev', { stdio: 'inherit' });
    // After installation, try to require jest again
    require('jest');
  }
}

// If this file is the entry point (e.g., run directly or via jest), bootstrap jest
if (require.main === module) {
  ensureJestForTests();
}

/* ------------------------------------------------------------------
 *  Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
const Game     = global.Game;          // global Game reference (may be mocked)
const Flags    = global.Flags;         // global Flags reference

/* Initialize global commands as functions */
if (typeof global.gr === 'undefined') global.gr = function () {}; // Function placeholder
if (typeof global.evor === 'undefined') global.evor = function () {}; // Function placeholder

/* ------------------------------------------------------------------
 * Test helpers for Jest testing environment
 * ------------------------------------------------------------------ */
function createMockCreep(overrides = {}) {
    return {
        id: `mockCreep-${Date.now()}`,
        name: 'MockCreep',
        memory: {},
        room: {
            controller: { level: 1 },
            name: 'MockRoom',
        },
        getActiveBodyparts: () => 0,
        getRangeTo: () => 1,
        ...overrides,
    };
}

function provideSimulatedCreep(_creep, mock) {
    if (!mock) {
        return;
    }
    const mockCreep = createMockCreep();
    for (let key in mock) {
        mockCreep[key] = mock[key];
    }
    // @ts-ignore
    Game.creeps[mockCreep.id] = mockCreep;
}

function mockCreep(body, name) {
    return {
        body,
        name: name || `${Math.random().toString(36).slice(2, 12)}`,
    };
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------------
 *  BOT logic
 * ------------------------------------------------------------------ */
module.exports = function() {
    const botGame = global.Game;
    const botFlags = global.Flags;
    const botGr    = global.gr;
    const botEvor  = global.evor;

    // Placeholder for real bot logic
    console.log('Bot running with Game:', typeof botGame, 'Flags:', typeof botFlags);

    /* Example flag handling */
    Object.values(botFlags)
        .filter(f => f)
        .forEach(flag => {
            console.log(`Handling flag: ${flag.name}`);
        });

    /* Example of interacting with global commands */
    botGr('example command');
    botEvor('example data');

    return true;
};