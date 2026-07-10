'use strict';

// Helper to safely require modules. If the module cannot be loaded,
// the returned value is undefined and can be checked before use.
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        // Module does not exist or failed to load – just return undefined
        return undefined;
    }
}

/* ------------------------------------------------------------------
 *  Mock globals for testing environments (e.g., Jest)
 * ------------------------------------------------------------------ */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

const Game  = global.Game || {};
const Flags = global.Flags || {};

/* ------------------------------------------------------------------
 *  Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader   = safeRequire('role.upgrader');
const roleBuilder    = safeRequire('role.builder');
const roleMiner      = safeRequire('role.miner');
const roleCreep      = safeRequire('role.creep');
const roleMine       = safeRequire('role.mine');

/* ------------------------------------------------------------------
 *  Helper API – multiply
 * ------------------------------------------------------------------ */
function multiply(a, b) {
    return a * b;
}

/* ------------------------------------------------------------------
 *  Bot disentangled logic
 * ------------------------------------------------------------------ */
/* A placeholder for where the bot's primary loop or processing logic
 * would go. For now, we'll provide a simple status check and a stub
 * for role execution.
 */
function run() {
    // ... existing bot logic
}

/* ------------------------------------------------------------------
 *  Additional test helpers
 * ------------------------------------------------------------------ */
function gr(roleName) {
    switch (roleName) {
        case 'harvester': return roleHarvester;
        case 'upgrader': return roleUpgrader;
        case 'builder': return roleBuilder;
        case 'miner': return roleMiner;
        case 'creep': return roleCreep;
        case 'mine': return roleMine;
        default: return safeRequire('role.' + roleName);
    }
}

function evor(target) {
    if (!target) return undefined;
    const role = target.memory ? target.memory.role : target.role;
    const roleModule = gr(role);
    if (roleModule && typeof roleModule.run === 'function') {
        return roleModule.run(target);
    }
    return undefined;
}

// Expose helpers as globals for the test environment
if (typeof global.gr !== 'function') global.gr = gr;
if (typeof global.evor !== 'function') global.evor = evor;

// Assuming the issue is about adding additional test helpers, we can
// add a simple test helper function that returns a mock object with
// predefined properties to simulate a creep or other object. This can
// be helpful for testing functions that expect certain properties or
// methods on an object.

function mockCreep(id, role, homeRoom, targetRoom) {
    return {
        id: id,
        role: role,
        room: homeRoom,
        targetRoom: targetRoom,
        memory: {
            role: role,
            homeRoom: homeRoom,
            targetRoom: targetRoom
        },
        pos: {
            x: 25,
            y: 25
        },
        run: jest.fn(),
        say: jest.fn(),
        move: jest.fn(),
        attack: jest.fn(),
        heal: jest.fn(),
        attackController: jest.fn(),
        harvest: jest.fn(),
        upgradeController: jest.fn(),
        transferEnergy: jest.fn(),
        drop: jest.fn(),
        take: jest.fn(),
        claim: jest.fn(),
        repair: jest.fn(),
        rangedAttack: jest.fn(),
        rangedMassAttack: jest.fn(),
        attackFriend: jest.fn(),
        attackHostile: jest.fn(),
        rangedHeal: jest.fn(),
        towerAttack: jest.fn(),
        towerHeal: jest.fn(),
        // Add other methods that are expected to be on a Creep
        // based on the game API documentation
    };
}

// Expose the mockCreep function as a global
if (typeof global.mockCreep !== 'function') global.mockCreep = mockCreep;