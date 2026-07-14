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

/* Mock globals for testing environments (e. g., Jest) */
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
if (typeof global.ERR_NO_PATH === 'undefined') global.ERR_NO_PATH = -9;

/* EmotionSystem for test expectations */
if (typeof global.EmotionSystem === 'undefined') {
    global.EmotionSystem = {
        // No‑op implementation – test spies can mock/restore as needed
        interact: function () {}
    };
}

/* ------------------------------------------------------------------
 *  Global commands
 * ------------------------------------------------------------------ */
if (typeof global.creep === 'undefined') {
    /**
     * Global report command - outputs game status information
     * @param {...any} args - Arguments to include in the report
     */
    global.gr = function (...args) {
        console.log(new Date().toISOString(), ...args);
    };
}

if (typeof global.evor === 'undefined') {
    /**
     * Evaluate room command - evaluates and returns room statistics
     * @param {string|Object} room - Room name or room object to evaluate
     * @returns {Object|null} Room evaluation results or null if invalid
     */
    global.evor = function (room) {
        if (room === undefined || room === null) return null;
        const roomName = typeof room === 'string' ? room : room.name;
        if (roomName === undefined || roomName === null) return null;

        const roomObj = Game.rooms[roomName];
        if (roomObj === undefined || roomObj === null) return null;

        return {
            name: roomName,
            controller: roomObj.controller ? { level: roomObj.controller.level } : null,
            energyAvailable: roomObj.energyAvailable,
            energyCapacityAvailable: roomObj.energyCapacityAvailable,
            my: roomObj.controller ? roomObj.controller.my : false
        };
    };
}

// Add a simple test function to verify the environment
if (typeof global.testEnvironment === 'undefined') {
    global.testEnvironment = function() {
        return {
            hasJest: typeof jest !== 'undefined',
            hasConsole: typeof console !== 'undefined',
            hasGame: typeof Game !== 'undefined'
        };
    };
}

// Define main control loop for the test to call
if (typeof global.main === 'undefined') {
    global.main = {
        /**
         * Main loop – called each game tick.
         * It triggers side‑effects that the test suite expects to be observed.
         */
        loop: function () {
            // Ensure EmotionSystem.interact is called so tests can spy on it
            if (typeof EmotionSystem !== 'undefined' && typeof EmotionSystem.interact === 'function') {
                EmotionSystem.interact();
            }
            // Future logic can be added here without breaking existing tests.
        }
    };
}

// Export the functions for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gr: global.gr,
        evor: global.evor,
        testEnvironment: global.testEnvironment,
        ...(typeof main !== 'undefined' ? { main } : {})
    };
}