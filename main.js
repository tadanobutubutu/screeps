// Main entry point for Screeps bot
// This file is the entry point for the Screeps game loop

// Import modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleWallRepairer = require('role.wallRepairer');
const roleClaimer = require('role.claimer');
const roleMiner = require('role.miner');
const roleTransporter = require('role.transporter');
const roleRemoteHarvester = require('role.remoteHarvester');
const roleRemoteUpgrader = require('role.remoteUpgrader');
const roleRemoteBuilder = require('role.remoteBuilder');
const roleDefender = require('role.defender');
const roleHealer = require('role.healer');
const roleAttacker = require('role.attacker');
const roleScout = require('role.scout');
const roleSigner = require('role.signer');

const spawnManager = require('spawn.manager');
const towerManager = require('tower.manager');
const linkManager = require('link.manager');
const terminalManager = require('terminal.manager');
const labManager = require('lab.manager');
const marketManager = require('market.manager');
const powerManager = require('power.manager');
const factoryManager = require('factory.manager');
const nukeManager = require('nuke.manager');
const observerManager = require('observer.manager');
const intelManager = require('intel.manager');
const visualManager = require('visual.manager');
const statsManager = require('stats.manager');
const segmentManager = require('segment.manager');
const profiler = require('profiler');

// Enable profiler
profiler.enable();

module.exports.loop = function () {
    // Profiler wrap
    profiler.wrap(function () {
        // Clean up memory
        cleanupMemory();
        
        // Run managers
        spawnManager.run();
        towerManager.run();
        linkManager.run();
        terminalManager.run();
        labManager.run();
        marketManager.run();
        powerManager.run();
        factoryManager.run();
        nukeManager.run();
        observerManager.run();
        intelManager.run();
        visualManager.run();
        statsManager.run();
        segmentManager.run();
        
        // Run creeps
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
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
                    case 'transporter':
                        roleTransporter.run(creep);
                        break;
                    case 'remoteHarvester':
                        roleRemoteHarvester.run(creep);
                        break;
                    case 'remoteUpgrader':
                        roleRemoteUpgrader.run(creep);
                        break;
                    case 'remoteBuilder':
                        roleRemoteBuilder.run(creep);
                        break;
                    case 'defender':
                        roleDefender.run(creep);
                        break;
                    case 'healer':
                        roleHealer.run(creep);
                        break;
                    case 'attacker':
                        roleAttacker.run(creep);
                        break;
                    case 'scout':
                        roleScout.run(creep);
                        break;
                    case 'signer':
                        roleSigner.run(creep);
                        break;
                    default:
                        console.log(`Unknown role: ${creep.memory.role} for creep ${name}`);
                }
            } catch (e) {
                console.log(`Error in creep ${name}: ${e.stack}`);
            }
        }
    });
};

function cleanupMemory() {
    // Clean up dead creeps from memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Clean up old memory entries
    if (Memory.stats && Memory.stats.tick > Game.time - 1000) {
        // Keep stats for 1000 ticks
    } else if (Memory.stats) {
        delete Memory.stats;
    }
    
    // Clean up intel data older than 5000 ticks
    if (Memory.intel) {
        for (const roomName in Memory.intel) {
            if (Memory.intel[roomName].lastSeen < Game.time - 5000) {
                delete Memory.intel[roomName];
            }
        }
    }
}

// Global error handler
global.handleError = function (error, context = '') {
    console.log(`[ERROR] ${context}: ${error.message}`);
    console.log(error.stack);
    Game.notify(`Error in ${context}: ${error.message}`);
};