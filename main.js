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

/* expose mock globals in local scope for easier access */
const Game = global.Game || {};
const Flags = global.Flags || {};

/* Initialize global commands as functions (empty placeholders) */
if (typeof global.gr === 'undefined') global.gr = function () {};
if (typeof global.evor === 'undefined') global.evor = function () {};

/* ------------------------------------------------------------------
 *  Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
// Optional role modules – imported if available
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder = safeRequire('role.builder');
const roleMiner = safeRequire('role.miner');
const roleCreep = safeRequire('role.creep');
const roleMine = safeRequire('role.mine');
const EmotionSystem = safeRequire('emotion.system');

/* ------------------------------------------------------------------
 * Optional modules
 * ------------------------------------------------------------------ */
function multiply(a, b) {
    return a * b;
}

/* ------------------------------------------------------------------
 * Test helpers for Jest testing environment
 * ------------------------------------------------------------------ */
function createMockCreep(overrides = {}) {
    return {
        id: 'mock-creeps-' + Math.random().toString(36).substr(2, 9),
        name: 'MockCreep',
        body: [{ type: 'WORK', weight: 100 }, { type: 'MOVE', weight: 50 }, { type: 'CARRY', weight: 50 }],
        memory: { role: 'harvester', controller: 1 },
        hits: 200,
        hitsMax: 200,
        carry: { energy: 0, capacity: 100 },
        carryCapacity: 100,
        pos: { x: 25, y: 25, roomName: 'W1N1' },
        room: { name: 'W1N1', memory: {} },
        store: { energy: 0, capacity: 100 },
        storeCapacity: 100,
        ...overrides
    };
}

function createMockRoom(overrides = {}) {
    return {
        name: 'W1N1',
        memory: {},
        find: function(type) {
            return [];
        },
        createConstructionSite: function(pos, structureType) {
            return 0;
        },
        remove: function() {
            return true;
        },
        ...overrides
    };
}

function createMockFlag(overrides = {}) {
    return {
        name: 'MockFlag',
        color: [1, 1],
        secondaryColor: 1,
        position: { x: 25, y: 25, roomName: 'W1N1' },
        ...overrides
    };
}

function resetGlobalState() {
    global.Game = { creeps: {} };
    global.Flags = {};
    for (let key in global) {
        if (typeof global[key] === 'function' && key.length === 0) {
            global[key]();
        }
    }
}

function setupTestEnvironment(options = {}) {
    const { creeps = [], flags = [], rooms = [] } = options;
    
    global.Game = { creeps: {} };
    global.Flags = {};
    
    creeps.forEach(creep => {
        global.Game.creeps[creep.name || creep.id] = createMockCreep(creep);
    });
    
    flags.forEach(flag => {
        global.Flags[flag.name || 'flag'] = createMockFlag(flag);
    });
    
    return { Game: global.Game, Flags: global.Flags };
}

/* Export test helpers for use in tests */
module.exports = {
    multiply,
    createMockCreep,
    createMockRoom,
    createMockFlag,
    resetGlobalState,
    setupTestEnvironment
};

/* ------------------------------------------------