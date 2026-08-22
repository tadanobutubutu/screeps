/**
 * Screeps Bot Main Entry Point
 * This is the main loop that runs every game tick
 */

// Import required modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleWallRepairer = require('role.wallRepairer');
const roleClaimer = require('role.claimer');
const roleMiner = require('role.miner');
const roleHauler = require('role.hauler');
const roleRemoteHarvester = require('role.remoteHarvester');
const roleRemoteHauler = require('role.remoteHauler');
const roleDefender = require('role.defender');
const roleScout = require('role.scout');
const roleSigner = require('role.signer');

const spawnManager = require('manager.spawn');
const towerManager = require('manager.tower');
const linkManager = require('manager.link');
const terminalManager = require('manager.terminal');
const marketManager = require('manager.market');
const powerManager = require('manager.power');
const nukeManager = require('manager.nuke');
const visualManager = require('manager.visual');
const statsManager = require('manager.stats');
const profiler = require('profiler');

/**
 * Main game loop - runs every tick
 * @param {void}
 */
module.exports.loop = function () {
    // Initialize profiler for CPU tracking
    profiler.wrap(() => {
        try {
            // Clean up memory for dead creeps
            cleanupMemory();

            // Run spawn manager to handle creep spawning
            spawnManager.run();

            // Run tower manager for defense
            towerManager.run();

            // Run link manager for energy transfer
            linkManager.run();

            // Run terminal manager for resource balancing
            terminalManager.run();

            // Run market manager for trading
            marketManager.run();

            // Run power manager for power processing
            powerManager.run();

            // Run nuke manager for nuke defense/offense
            nukeManager.run();

            // Run visual manager for room visuals
            visualManager.run();

            // Run stats manager for statistics tracking
            statsManager.run();

            // Run all creeps
            runCreeps();

        } catch (error) {
            console.log(`<font color="#FF0000">Main loop error: ${error.stack}</font>`);
            Game.notify(`Main loop error: ${error.message}`);
        }
    });
};

/**
 * Clean up memory for dead creeps and old data
 */
function cleanupMemory() {
    // Remove memory for dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Clean up old room intelligence data (older than 5000 ticks)
    const currentTick = Game.time;
    if (Memory.rooms) {
        for (const roomName in Memory.rooms) {
            const roomMemory = Memory.rooms[roomName];
            if (roomMemory.lastSeen && currentTick - roomMemory.lastSeen > 5000) {
                delete Memory.rooms[roomName];
            }
        }
    }

    // Clean up old market history (older than 1000 ticks)
    if (Memory.market && Memory.market.history) {
        Memory.market.history = Memory.market.history.filter(entry => currentTick - entry.tick < 1000);
    }
}

/**
 * Run all creep roles
 */
function runCreeps() {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        try {
            // Run profiler on each creep for detailed CPU tracking
            profiler.wrap(() => {
                switch (creep.memory.role) {
                    case 'harvester':
                        roleHarvester.run(creep);
                        break;
                    case 'upgrader':
                        roleUpgrader.run(creep);
                        break;
                    case 'builder':
                        roleBuilder.run(creep);
                        break;
                    case 'repairer':
                        roleRepairer.run(creep);
                        break;
                    case 'wallRepairer':
                        roleWallRepairer.run(creep);
                        break;
                    case 'claimer':
                        roleClaimer.run(creep);
                        break;
                    case 'miner':
                        roleMiner.run(creep);
                        break;
                    case 'hauler':
                        roleHauler.run(creep);
                        break;
                    case 'remoteHarvester':
                        roleRemoteHarvester.run(creep);
                        break;
                    case 'remoteHauler':
                        roleRemoteHauler.run(creep);
                        break;
                    case 'defender':
                        roleDefender.run(creep);
                        break;
                    case 'scout':
                        roleScout.run(creep);
                        break;
                    case 'signer':
                        roleSigner.run(creep);
                        break;
                    default:
                        // Unknown role - log for debugging
                        if (Game.time % 100 === 0) {
                            console.log(`Creep ${name} has unknown role: ${creep.memory.role}`);
                        }
                }
            }, `creep.${creep.memory.role}.${name}`);
        } catch (error) {
            console.log(`<font color="#FF0000">Creep ${name} error: ${error.stack}</font>`);
        }
    }
}

// Global error handler for uncaught exceptions
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment (for testing)
    process.on('uncaughtException', (error) => {
        console.log(`Uncaught Exception: ${error.stack}`);
    });
}