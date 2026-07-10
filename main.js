'use strict';

// Helper to safely require modules. If the module cannot be loaded,
// the returned value is undefined and can be checked before use.
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        // Module does not exist or failed to load – ignore.
        return undefined;
    }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

const Game = global.Game || {};
const Flags = global.Flags || {};

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
const Controller = safeRequire('./controller');
const Defender = safeRequire('./defender');
const Builder = safeRequire('./builder');

/* ----------------- Jest for Testing ------------------ */
// Add jest to the environment globals for test mocking
let jest;
try {
    jest = require('jest');
    global.jest = jest;
    try {
        jest.mock('screeps');
    } catch (e) {
        // If mocking fails, likely running in production; ignore
    }
} catch (e) {
    // Jest not available, likely running in production; ignore
}

/**
 * Main loop called by the Screeps engine once per tick.
 * Placeholder for further implementation.
 */
function main() {
    // Get all creeps
    const creeps = Object.values(Game.creeps);

    // Assign roles to creeps
    creeps.forEach((creep) => {
        // Initial role assignment based on proximity to the spawn or other heuristics
        if (!creep.memory.role) {
            if (creep.pos.isNearTo(Game.spawn.pos, 1)) {
                creep.memory.role = 'harvester';
                creep.memory.target = Game.spawn.name;
            } else if (creep.carry.energy === 0) {
                creep.memory.role = 'harvester';
            } else {
                // Default fallback, can be customized per strategy
                creep.memory.role = 'upgrader';
            }
        }

        // Execute role behavior if module exists
        switch (creep.memory.role) {
            case 'harvester':
                if (roleHarvester) roleHarvester.run(creep);
                break;
            case 'upgrader':
                if (roleUpgrader) roleUpgrader.run(creep);
                break;
            case 'builder':
                if (roleBuilder) roleBuilder.run(creep);
                break;
            case 'miner':
                if (roleMiner) roleMiner.run(creep);
                break;
            case 'creep':
                if (roleCreep) roleCreep.run(creep);
                break;
            case 'mine':
                if (roleMine) roleMine.run(creep);
                break;
            default:
                // Unknown role – clean up memory
                delete creep.memory