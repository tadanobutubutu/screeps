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
if (typeof global.ERR_BUSY === 'undefined') global.ERR_BUSY = -3;
if (typeof global.ERR_NOT_ENOUGH_RESOURCES === 'undefined') global.ERR_NOT_ENOUGH_RESOURCES = -4;
if (typeof global.ERR_NOT_ENOUGH_ENERGY === 'undefined') global.ERR_NOT_ENOUGH_ENERGY = -5;
if (typeof global.ERR_INVALID_TARGET === 'undefined') global.ERR_INVALID_TARGET = -6;
if (typeof global.ERR_FULL === 'undefined') global.ERR_FULL = -9;
if (typeof global.ERR_NOT_IN_RANGE === 'undefined') global.ERR_NOT_IN_RANGE = -10;
if (typeof global.ERR_NO_BODYPART === 'undefined') global.ERR_NO_BODYPART = -11;
if (typeof global.ERR_BUSY === 'undefined') global.ERR_BUSY = -3;
if (typeof global.ERR_NOT_ENOUGH_ENERGY === 'undefined') global.ERR_NOT_ENOUGH_ENERGY = -5;
if (typeof global.ERR_INVALID_ARGS === 'undefined') global.ERR_INVALID_ARGS = -12;
if (typeof global.ERR_TIRED === 'undefined') global.ERR_TIRED = -15;
if (typeof global.ERR_NAME_EXISTS === 'undefined') global.ERR_NAME_EXISTS = - 0;
if (typeof global.ERR_RCL_NOT_ENOUGH === 'undefined') global.ERR_RCL_NOT_ENOUGH = - 1;
if (typeof global.ERR_INVALID_ARGS === 'undefined') global.ERR_INVALID_ARGS = -12;
if (typeof global.ERR_NOT_ENOUGH_RESOURCES === 'undefined') global.ERR_NOT_ENOUGH_RESOURCES = -4;

function createRoom() {
    const room = {
        name: 'W0N0',
        controller: { level: 1 },
    };
    global.Game.rooms = { W0N0: room };
}

createRoom();

let creeps = global.Game.creeps;

// define a simple movement logic
function moveAgent(ag) {
    // just a log
    console.log(`${ag.name} moving`);
}

// New function to navigate to a target
function navToTarget(targetPos) {
    // Ensure that the creep has a move body part
    if (!ag.hasMove) {
        console.log(`${ag.name} is missing the move body part`);
        return;
    }

    // Ensure the target is within range
    if (ag.pos.inRangeTo(targetPos, 1)) {
        // Move towards the target
        ag.move(targetPos);
    } else {
        // Pathfind to the target if not in range
        const path = PathFinder.findPath(ag.pos, targetPos, {
            roomCallback: (roomName) => {
                if (!Game.rooms[roomName]) return 0;
                return Game.map.getRoomLinearIndex(roomName);
            }
        });

        if (path.length > 0) {
            ag.move(path[0]);
        } else {
            console.log(`${ag.name} failed to find path to ${targetPos}`);
        }
    }
}

// Example usage of navToTarget
const targetPosition = new RoomPosition(25, 25, 'W0N0');
navToTarget(targetPosition);

// Solution end.