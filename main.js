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

/* ------------------------------------------------------------------
 *  New Creep Role: Autonomous Efficiency
 * ------------------------------------------------------------------ */
function autonomousEfficiency(creep) {
    // Implement autonomous efficiency logic here
    // This is a placeholder for the new role
    if (creep.store.getFreeCapacity() > 0) {
        // Find energy sources
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    } else {
        // Find structures that need energy
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // If no structures need energy, upgrade controller
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}

/* Export the test function and new role for running in tests */
if (typeof module !== 'undefined' && module.exports) {
    module.exports.testGlobalFunctions = testGlobalFunctions;
    module.exports.autonomousEfficiency = autonomousEfficiency;
}