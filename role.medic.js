const roleMedic = {
    run: function (creep) {
        creep.say('💊');

        // ⚡ PERFORMANCE: Per-tick caching of my creeps (using unique tick key to avoid collisions)
        if (creep.room._myCreepsTick !== Game.time) {
            creep.room._myCreeps = creep.room.find(FIND_MY_CREEPS);
            creep.room._myCreepsTick = Game.time;
        }

        // ⚡ PERFORMANCE: Per-tick caching of injured creeps
        if (creep.room._injuredCreepsTick !== Game.time) {
            creep.room._injuredCreeps = creep.room._myCreeps.filter((c) => c.hits < c.hitsMax);
            creep.room._injuredCreepsTick = Game.time;
        }
        const injured = creep.room._injuredCreeps;

        // ⚡ PERFORMANCE: Per-tick caching of active sources (shared across roles)
        if (creep.room._activeSourcesTick !== Game.time) {
            creep.room._activeSources = creep.room.find(FIND_SOURCES_ACTIVE);
            creep.room._activeSourcesTick = Game.time;
        }
        const sources = creep.room._activeSources;

        // State machine: Gather energy or Heal
        if (creep.memory.healing && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.healing = false;
            creep.say('⚡ harvest');
        }
        if (!creep.memory.healing && creep.store.getFreeCapacity() === 0) {
            creep.memory.healing = true;
            creep.say('💊 heal');
        }

        if (creep.memory.healing) {
            if (injured.length > 0) {
                // ⚡ PERFORMANCE: Cache heal target ID and use closest by range
                let target = Game.getObjectById(creep.memory.healTargetId);

                // If target is invalid or fully healed, find a new one
                if (!target || target.hits === target.hitsMax) {
                    target = creep.pos.findClosestByRange(injured);
                    if (target) {
                        creep.memory.healTargetId = target.id;
                    } else {
                        delete creep.memory.healTargetId;
                    }
                }

                if (target) {
                    if (creep.pos.isNearTo(target)) {
                        creep.heal(target);
                    } else {
                        creep.rangedHeal(target);
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
                    }
                }
            } else {
                delete creep.memory.healTargetId;
                // No one to heal: Move to idle position
                const idlePos = creep.room.controller
                    ? creep.room.controller.pos
                    : new RoomPosition(25, 25, creep.room.name);
                if (!creep.pos.inRangeTo(idlePos, 3)) {
                    creep.moveTo(idlePos, {
                        visualizePathStyle: { stroke: '#ffffff', opacity: 0.2 },
                    });
                }
            }
        } else {
            // Gathering mode
            const canHarvest = creep.getActiveBodyparts(WORK) > 0;
            if (canHarvest && sources.length > 0) {
                // ⚡ PERFORMANCE: Cache harvest target ID and use closest by range
                let target = Game.getObjectById(creep.memory.harvestTargetId);

                if (!target || target.energy === 0) {
                    target = creep.pos.findClosestByRange(sources);
                    if (target) {
                        creep.memory.harvestTargetId = target.id;
                    } else {
                        delete creep.memory.harvestTargetId;
                    }
                }

                if (target) {
                    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            } else if (injured.length > 0) {
                // ⚡ PERFORMANCE: Use heal target cache for secondary healing too
                let target = Game.getObjectById(creep.memory.healTargetId);

                if (!target || target.hits === target.hitsMax) {
                    target = creep.pos.findClosestByRange(injured);
                    if (target) {
                        creep.memory.healTargetId = target.id;
                    } else {
                        delete creep.memory.healTargetId;
                    }
                }

                if (target && creep.store[RESOURCE_ENERGY] > 0) {
                    if (creep.pos.isNearTo(target)) {
                        creep.heal(target);
                    } else {
                        creep.rangedHeal(target);
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
                    }
                }
            } else {
                delete creep.memory.healTargetId;
            }
        }
    },
};

module.exports = roleMedic;
