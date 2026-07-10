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

/* Initialize global commands as functions */
if (typeof global.gr === 'undefined') global.gr = function () {}; // Function placeholder
if (typeof global.evor === 'undefined') global.evor = function () {}; // Function placeholder

/*
 **Support Pollinations.AI:

 🌸 **Ad 🌸
 Powered by Pollinations.AI free text APIs. [Support our mission](https://pollinations.ai/redirect/kofi) to keep AI accessible for everyone.
*/

/* ------------------------------------------------------------------
 * Role modules (hypothetical paths)
 * ------------------------------------------------------------------ */
const roleHarvester = safeRequire('./role.harvester');
const roleUpgrader   = safeRequire('./role.upgrader');
const roleBuilder    = safeRequire('./role.builder');

/* ------------------------------------------------------------------
 * Test Helpers
 * ------------------------------------------------------------------ */
function createMockEmotionSystem() {
    return {
        interact: jest.fn(),
        // Add other methods that might be called in tests
        update: jest.fn(),
        getEmotion: jest.fn().mockReturnValue('neutral')
    };
}

function createMockGame() {
    return {
        creeps: {},
        spawns: {},
        rooms: {},
        time: 0,
        cpu: {
            getUsed: jest.fn().mockReturnValue(0),
            limit: 100
        },
        // Add other Game properties that might