/**
 * role.attacker.js
 * Attacker creep role: attacks hostile creeps and structures.
 * Body: [TOUGH, MOVE, ATTACK, ATTACK, MOVE, TOUGH]
 */

// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_HEAL = { visualizePathStyle: { stroke: '#00ff00' } };
const PATH_STYLE_ATTACK = { visualizePathStyle: { stroke: '#ff0000' }, reusePath: 3 };
const PATH_STYLE_STRUCTURE = { visualizePathStyle: { stroke: '#ff4400' }, reusePath: 3 };
const PATH_STYLE_PATROL = { visualizePathStyle: { stroke: '#ffaa00' } };
const PATH_STYLE_PATROL_CONTROLLER = { visualizePathStyle: { stroke: '#ffaa00' }, range: 5 };

// ⚡ PERFORMANCE: Hoisted filter function to reduce per-tick closure creation.
const STRUCTURE_FILTER = (s) =>
    s.structureType === STRUCTURE_INVADER_CORE ||
    s.structureType === STRUCTURE_TOWER ||
    s.structureType === STRUCTURE_SPAWN;

const roleAttacker = {
    /**
     * Main run function called every tick.
     * @param {Creep} creep
     */
    run(creep) {
        // Heal self if damaged and healer not available
        if (creep.hits < creep.hitsMax * 0.5) {
            // ⚡ PERFORMANCE: Use pre-warmed cache to avoid expensive room.find inside findClosestByRange
            const myCreeps = creep.room._myCreeps || creep.room.find(FIND_MY_CREEPS);
            const healers = [];
            for (let i = 0; i < myCreeps.length; i++) {
                if (myCreeps[i].getActiveBodyparts(HEAL) > 0) {
                    healers.push(myCreeps[i]);
                }
            }

            const healTarget = healers.length > 0 ? creep.pos.findClosestByRange(healers) : null;
            if (healTarget) {
                creep.moveTo(healTarget, PATH_STYLE_HEAL);
                return;
            }
        }

        // Priority 1: Attack hostile creeps in range
        // ⚡ PERFORMANCE: Use pre-warmed room cache for hostile creeps.
        const hostiles = creep.room._hostileCreeps || creep.room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0) {
            // ⚡ PERFORMANCE: Cache target ID to avoid re-searching every tick
            let hostileCreep = Game.getObjectById(creep.memory.targetId);

            // ⚡ PERFORMANCE: O(1) check for target validity instead of O(N) search
            if (!hostileCreep || hostileCreep.room.name !== creep.room.name) {
                hostileCreep = creep.pos.findClosestByRange(hostiles);
                if (hostileCreep) {
                    creep.memory.targetId = hostileCreep.id;
                } else {
                    delete creep.memory.targetId;
                }
            }

            if (hostileCreep) {
                if (creep.attack(hostileCreep) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileCreep, PATH_STYLE_ATTACK);
                }
                return;
            }
        }

        // Priority 2: Attack invader core or hostile structures
        // ⚡ PERFORMANCE: Implement target ID caching for structures
        let hostileStructure = Game.getObjectById(creep.memory.structureTargetId);

        if ( === undefined ||  === null) {
            let hostileStructures;
            if (creep.room._allStructures) {
                hostileStructures = creep.room._allStructures.filter(
                    (s) => !s.my && s.structureType && STRUCTURE_FILTER(s)
                );
            } else {
                hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES, {
                    filter: STRUCTURE_FILTER,
                });
            }

            hostileStructure = creep.pos.findClosestByRange(hostileStructures);

            if (hostileStructure) {
                creep.memory.structureTargetId = hostileStructure.id;
            }
        }

        if (hostileStructure) {
            if (creep.attack(hostileStructure) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostileStructure, PATH_STYLE_STRUCTURE);
            }
            return;
        } else {
            delete creep.memory.structureTargetId;
        }

        // Priority 3: Patrol flag or room center when idle
        const flag = Game.flags['attack'] || Game.flags['Attack'];
        if (flag) {
            creep.moveTo(flag, PATH_STYLE_PATROL);
        } else {
            // Move to room controller area as default patrol point
            const controller = creep.room.controller;
            if (controller) {
                creep.moveTo(controller, PATH_STYLE_PATROL_CONTROLLER);
            }
        }
    },
};

module.exports = roleAttacker;
