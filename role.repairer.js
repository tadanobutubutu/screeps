const roleRepairer = {
    run: function (creep) {
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.repairing = false;
            creep.say('⚡ harvest');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
            creep.memory.repairing = true;
            creep.say('🔧 repair');
        }

        if (creep.memory.repairing) {
            // ⚡ PERFORMANCE: Per-tick caching of damaged structures
            if (creep.room._damagedStructuresTick !== Game.time) {
                creep.room._damagedStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL,
                });
                creep.room._damagedStructuresTick = Game.time;
            }

            const targets = creep.room._damagedStructures;

            if (targets && targets.length > 0) {
                // ⚡ PERFORMANCE: Find target with minimum hits in O(N)
                let target = targets[0];
                let minHits = target.hits;

                for (let i = 1; i < targets.length; i++) {
                    if (targets[i].hits < minHits) {
                        target = targets[i];
                        minHits = target.hits;
                    }
                }

                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00' } });
                }
            } else {
                // 修理対象がない場合はアップグレード
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {
                        visualizePathStyle: { stroke: '#ffffff' },
                    });
                }
            }
        } else {
            // エネルギーを採取
            // ⚡ PERFORMANCE: Per-tick caching of active sources (consistent across roles)
            if (creep.room._activeSourcesTick !== Game.time) {
                creep.room._activeSources = creep.room.find(FIND_SOURCES_ACTIVE);
                creep.room._activeSourcesTick = Game.time;
            }
            const sources = creep.room._activeSources;

            if (sources.length > 0) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    },
};

module.exports = roleRepairer;
