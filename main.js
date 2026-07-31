/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */

// main.js entry point for Screeps
module.exports.loop = function () {
    'use strict';

    // Clean up dead creep memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Run each room's logic
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const structs = room.find(FIND_STRUCTURES);
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        if (!spawn) continue;

        // Build queue: spawn worker if possible
        const body = [WORK, CARRY, MOVE];
        const result = spawn.spawnCreep(body, `${Game.time}`, {
            memory: { role: 'harvester', working: false }
        });
        if (result !== OK) continue;

        // Assign roles
        for (const creepName in Game.creeps) {
            const creep = Game.creeps[creepName];
            if (creep.memory.role === 'harvester') {
                if (!creep.memory.targetId) {
                    const source = creep.pos.findClosestByPath(FIND_SOURCES);
                    if (source) creep.memory.targetId = source.id;
                }
                const target = Game.getObjectById(creep.memory.targetId);
                if (target) {
                    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
    }
};