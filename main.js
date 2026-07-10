"use strict";
/* Main entry point for the Screeps bot. */
/* This file contains all imports and logic from both branches. */
/* A simple status check is added for monitoring purposes. */
/* global describe, test, expect */

// ----------------- Imports ----------------------------
const Game = global.Game;
const Flags = global.Flags;

// Roles
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const awayHarvester = require('role.awayHarvester'); // New import
const spawner = require('role.spawner'); // New import
const controllerDefault = require('role.controllerDefault'); // New import

// Optional modules
const Controller = require("./controller");
const Defender = require("./defender");
const Builder = require("./builder");

// ----------------- Bot Logic --------------------------

// Add new functions
function spawnCreeps() {
    const spawns = Object.values(Game.spawns);
    for (const spawn of spawns) {
        const room = spawn.room;
        if (!spawn.spawning) {
            if (room.energyAvailable >= 200) {
                spawn.createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester' });
            }
            if (room.energyAvailable >= 150) {
                spawn.createCreep([WORK, CARRY, MOVE], undefined, { role: 'upgrader' });
            }
            if (room.energyAvailable >= 400) {
                spawn.createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'builder' });
            }
            if (room.energyAvailable >= 50) {
                spawn.createCreep([WORK, CARRY, CARRY, MOVE], undefined, { role: 'awayHarvester' });
            }
            if (room.energyAvailable >= 50) {
                const existing = Memory.spawnerJobs || {};
                existing[spawn.id] = (existing[spawn.id] || 0) + 1;
                Memory.spawnerJobs = existing;
                console.log(`Scheduling spawner job for ${spawn.id}`);
            }
            if (room.energyAvailable >= 100) {
                spawn.createCreep([WORK, CARRY, CARRY, MOVE], undefined, { role: 'controllerDefault' });
                delete Memory.spawnerJobs[spawn.id];
            }
        }
    }
}

function runSpawnJobs() {
    const spawns = Object.values(Game.spawns);
    for (const spawn of spawns) {
        if (Memory.spawnerJobs && Memory.spawnerJobs[spawn.id]) {
            const count = Memory.spawnerJobs[spawn.id];
            if (count > 0 && spawn.spawning === null && spawn.room.energyAvailable >= 50) {
                spawn.createCreep([WORK, CARRY, CARRY, MOVE], undefined, { role: 'controllerDefault' });
                Memory.spawnerJobs[spawn.id] = count - 1;
            }
        }
    }
}

// Main loop called by the Screeps engine once per tick
function mainLoop() {
    runSpawnJobs();
    Controller.run();
    // Run main controller logic
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (!creep || !creep.memory || !creep.memory.role) {
            continue;
        }
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
            case 'awayHarvester':
                awayHarvester.run(creep);
                break;
            case 'spawner':
                spawner.run(creep);
                break;
            case 'controllerDefault':
                controllerDefault.run(creep);
                break;
            default:
                // Additional roles could be handled here
                break;
        }
    }
}

// Export loop and status check module
module.exports.loop = mainLoop;
module.exports.checkStatus = function () {
    return 'OK';
};
module.exports.spawnCreeps = spawnCreeps;
module.exports.runSpawnJobs = runSpawnJobs;