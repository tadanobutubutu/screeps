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
            // ⚡ PERFORMANCE: Use pre-filtered room-level repair targets.
            const targets = creep.room._repairTargets || [];

            if (targets && targets.length > 0) {
                // ⚡ PERFORMANCE: Cache target ID to avoid redundant O(N) scans every tick
                let target = Game.getObjectById(creep.memory.repairTargetId);

                // If target is invalid or fully repaired, find a new one
                if (!target || target.hits === target.hitsMax) {
                    // ⚡ PERFORMANCE: Find target with minimum hits in O(N)
                    target = targets[0];
                    let minHits = target.hits;

                    for (let i = 1; i < targets.length; i++) {
                        if (targets[i].hits < minHits) {
                            target = targets[i];
                            minHits = target.hits;
                        }
                    }

                    if (target) {
                        creep.memory.repairTargetId = target.id;
                    } else {
                        delete creep.memory.repairTargetId;
                    }
                }

                if (target && creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00' } });
                }
            } else {
                delete creep.memory.repairTargetId;
                // 修理対象がない場合はアップグレード
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {
                        visualizePathStyle: { stroke: '#ffffff' },
                    });
                }
            }
        } else {
            // エネルギーを採取
            // ⚡ PERFORMANCE: Use pre-warmed room cache for active sources.
            const sources = creep.room._activeSources || [];

            if (sources.length > 0) {
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
            }
        }
    },
};

module.exports = roleRepairer;
