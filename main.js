// Screeps Bot Main Entry Point
// This file is the entry point for the Screeps game engine.
// It exports a `loop` function that is called every game tick.

// Import core modules and configuration
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleWallRepairer = require('role.wallRepairer');
const roleClaimer = require('role.claimer');
const roleMiner = require('role.miner');
const roleHauler = require('role.hauler');
const roleDefender = require('role.defender');
const roleRangedAttacker = require('role.rangedAttacker');
const roleHealer = require('role.healer');
const roleScout = require('role.scout');
const roleRemoteHarvester = require('role.remoteHarvester');
const roleRemoteHauler = require('role.remoteHauler');
const roleRemoteReserver = require('role.remoteReserver');

const creepManager = require('manager.creepManager');
const roomManager = require('manager.roomManager');
const spawnManager = require('manager.spawnManager');
const towerManager = require('manager.towerManager');
const linkManager = require('manager.linkManager');
const terminalManager = require('manager.terminalManager');
const marketManager = require('manager.marketManager');
const powerManager = require('manager.powerManager');
const visualManager = require('manager.visualManager');
const profiler = require('screeps-profiler');

const constants = require('constants');
const utils = require('utils');
const cache = require('cache');
const intel = require('intel');
const os = require('os');

// Initialize profiler if enabled
if (constants.PROFILER_ENABLED) {
    profiler.enable();
}

/**
 * Main game loop - executed every tick
 */
module.exports.loop = function () {
    const startCpu = Game.cpu.getUsed();
    
    try {
        // Update global cache and intel
        cache.update();
        intel.update();
        
        // Run room-level management
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (room.controller && room.controller.my) {
                roomManager.run(room);
                spawnManager.run(room);
                towerManager.run(room);
                linkManager.run(room);
                terminalManager.run(room);
            }
        }
        
        // Run global managers
        creepManager.run();
        marketManager.run();
        powerManager.run();
        visualManager.run();
        
        // Run all creeps
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.spawning) continue;
            
            try {
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
                    case 'defender':
                        roleDefender.run(creep);
                        break;
                    case 'rangedAttacker':
                        roleRangedAttacker.run(creep);
                        break;
                    case 'healer':
                        roleHealer.run(creep);
                        break;
                    case 'scout':
                        roleScout.run(creep);
                        break;
                    case 'remoteHarvester':
                        roleRemoteHarvester.run(creep);
                        break;
                    case 'remoteHauler':
                        roleRemoteHauler.run(creep);
                        break;
                    case 'remoteReserver':
                        roleRemoteReserver.run(creep);
                        break;
                    default:
                        utils.log(`Unknown creep role: ${creep.memory.role} for creep ${name}`, 'WARNING');
                }
            } catch (creepError) {
                utils.log(`Error running creep ${name} (${creep.memory.role}): ${creepError.stack}`, 'ERROR');
            }
        }
        
        // Cleanup dead creep memory
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        
        // Garbage collection hint
        if (Game.time % 100 === 0) {
            global.gc && global.gc();
        }
        
    } catch (error) {
        utils.log(`Critical error in main loop: ${error.stack}`, 'CRITICAL');
        Game.notify(`Critical error: ${error.message}`);
    }
    
    // CPU profiling
    if (constants.PROFILER_ENABLED) {
        profiler.wrap(() => {});
    }
    
    const elapsed = Game.cpu.getUsed() - startCpu;
    if (elapsed > constants.CPU_WARNING_THRESHOLD) {
        utils.log(`High CPU usage: ${elapsed.toFixed(2)}`, 'WARNING');
    }
    
    // Log CPU stats periodically
    if (Game.time % 100 === 0) {
        utils.log(`Tick ${Game.time}: CPU ${elapsed.toFixed(2)}/${Game.cpu.limit} (bucket: ${Game.cpu.bucket})`, 'INFO');
    }
};

// Initialize global prototypes
require('prototype.creep');
require('prototype.room');
require('prototype.structure');
require('prototype.spawn');
require('prototype.source');