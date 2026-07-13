'use strict';

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
if (typeof global.Animats === 'undefined') global.Animats = {};
if (typeof global.ConstructionSites === 'undefined') global.ConstructionSites = {};
if (typeof global.Creep === 'undefined') global.Creep = function () {};
if (typeof global.Flag === 'undefined') global.Flag = function () {};
if (typeof global.Game === 'undefined') {
    global.Game = { creeps: {}, flags: {}, rooms: {}, spawns: {} };
}
if (typeof global.Map === 'undefined') global.Map = {};
if (typeof global.Memory === 'undefined') global.Memory = {};
if (typeof global.PathFinder === 'undefined') global.PathFinder = {};
if (typeof global.RawMemory === 'undefined') global.RawMemory = {};
if (typeof global.Room === 'undefined') global.Room = function () {};
if (typeof global.RoomPosition === 'undefined') global.RoomPosition = function () {};
if (typeof global.Structure === 'undefined') global.Structure = function () {};
if (typeof global.StructureContainer === 'undefined') global.StructureContainer = function () {};
if (typeof global.StructureController === 'undefined') global.StructureController = function () {};
if (typeof global.StructureExtension === 'undefined') global.StructureExtension = function () {};
if (typeof global.StructureRampart === 'undefined') global.StructureRampart = function () {};
if (typeof global.StructureRoad === 'undefined') global.StructureRoad = function () {};
if (typeof global.StructureSpawn === 'undefined') global.StructureSpawn = function () {};
if (typeof global.StructureTower === 'undefined') global.StructureTower = function () {};
if (typeof global.StructureWall === 'undefined') global.StructureWall = function () {};
if (typeof global.OK === 'undefined') global.OK = 0;
if (typeof global.ERR_NOT_OWNER === 'undefined') global.ERR_NOT_OWNER = -1;
if (typeof global.ERR_NO_PATH === 'undefined') global.ERR_NO_PATH = -2;

/* ------------------------------------------------------------------
 *  Helper – safely require Jest for testing
 * ------------------------------------------------------------------ */
function safeRequireJest() {
    try {
        // Try to require Jest directly
        return require('jest');
    } catch (e) {
        try {
            // Try to require Jest from node_modules
            return require('./node_modules/jest');
        } catch (e) {
            // If Jest isn't available, return a mock object
            return {
                run: function () {
                    return Promise.resolve({ success: false });
                },
            };
        }
    }
}

// Export the safeRequireJest function for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        safeRequire,
        safeRequireJest,
    };
}

/* ------------------------------------------------------------------
 *  New helper function for testing
 * ------------------------------------------------------------------ */
function testGlobalFunctions() {
    // Ensure global functions are defined
    expect(typeof global.Creep).toBe('function');
    expect(typeof global.Flag).toBe('function');
    expect(typeof global.PathFinder).toBe('function');
    expect(typeof global.RawMemory).toBe('object');
    expect(typeof global.RoomPosition).toBe('function');
    expect(typeof global.Structure).toBe('function');
    expect(typeof global.OK).toBe('number');
    expect(typeof global.ERR_NOT_OWNER).toBe('number');
    expect(typeof global.ERR_NO_PATH).toBe('number');
}

/* Export the test function for running in tests */
if (typeof module !== 'undefined' && module.exports) {
    module.exports.testGlobalFunctions = testGlobalFunctions;
}