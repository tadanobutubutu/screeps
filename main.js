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

/* ------------------------------------------------------------------
 *  Constants – fallback for environments without Screeps API
 * ------------------------------------------------------------------ */
if (typeof global.OK === 'undefined') global.OK = 0;
if (typeof global.ERR_NOT_OWNER === 'undefined') global.ERR_NOT_OWNER = -1;
if (typeof global.ERR_NO_PATH === 'undefined') global.ERR_NO_PATH = -2;
if (typeof global.ERR_NOT_FOUND === 'undefined') global.ERR_NOT_FOUND = -3;
if (typeof global.ERR_NAME_EXISTS === 'undefined') global.ERR_NAME_EXISTS = -4;
if (typeof global.ERR_INVALID_ARGS === 'undefined') global.ERR_INVALID_ARGS = -5;
if (typeof global.ERR_TIRED === 'undefined') global.ERR_TIRED = -6;
if (typeof global.ERR_NOT_ENOUGH_ENERGY === 'undefined') global.ERR_NOT_ENOUGH_ENERGY = -9;
if (typeof global.ERR_NOT_ENOUGH_MASS === 'undefined') global.ERR_NOT_ENOUGH_MASS = -10;
if (typeof global.ERR_NOT_ENOUGH_RESOURCES === 'undefined') global.ERR_NOT_ENOUGH_RESOURCES = -10;
if (typeof global.ERR_FULL === 'undefined') global.ERR_FULL = -10;
if (typeof global.ERR_INTERNAL_ERROR === 'undefined') global.ERR_INTERNAL_ERROR = -999;
if (typeof global.ERR_GCL_NOT_ENOUGH === 'undefined') global.ERR_GCL_NOT_ENOUGH = -11;
if (typeof global.ERR_RCL_NOT_ENOUGH === 'undefined') global.ERR_RCL_NOT_ENOUGH = -12;
if (typeof global.ERR_TIRED === 'undefined') global.ERR_TIRED = -6;
if (typeof global.ERR_INVALID_TARGET === 'undefined') global.ERR_INVALID_TARGET = -6;
if (typeof global.ERR_BUSY === 'undefined') global.ERR_BUSY = -7;
if (typeof global.