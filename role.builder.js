const roleBuilder = {
    run: function (creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('⚡ harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🛠 build');
        }

        if (creep.memory.building) {
            // 建設サイトを探す
            // ⚡ PERFORMANCE: Use centralized room cache for construction sites.
            // Switch to FIND_MY_CONSTRUCTION_SITES for engine-level optimization.
            if (creep.room._myConstructionSitesTick !== Game.time) {
                creep.room._myConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                creep.room._myConstructionSitesTick = Game.time;
            }
            const targets = creep.room._myConstructionSites;

            if (targets && targets.length > 0) {
                // ⚡ PERFORMANCE: Cache target ID to avoid re-searching every tick
                let target = Game.getObjectById(creep.memory.buildTargetId);

                // If target is invalid or no longer exists in construction sites, find a new one
                // ⚡ PERFORMANCE: O(1) check for construction site validity instead of O(N) .some()
                if (!target) {
                    // ⚡ PERFORMANCE: Use findClosestByRange (O(N)) instead of findClosestByPath (O(N*Pathfinding))
                    target = creep.pos.findClosestByRange(targets);
                    if (target) {
                        creep.memory.buildTargetId = target.id;
                    } else {
                        delete creep.memory.buildTargetId;
                    }
                }

                if (target && creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#0000ff' } });
                }
            } else {
                delete creep.memory.buildTargetId;
                // 建設サイトがなければアップグレードモードに
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {
                        visualizePathStyle: { stroke: '#ffffff' },
                    });
                }
            }
        } else {
            // エネルギーを採取
            // ⚡ PERFORMANCE: Use centralized room cache for active sources.
            if (creep.room._activeSourcesTick !== Game.time) {
                creep.room._activeSources = creep.room.find(FIND_SOURCES_ACTIVE);
                creep.room._activeSourcesTick = Game.time;
            }
            const sources = creep.room._activeSources;

            if (sources && sources.length > 0) {
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

module.exports = roleBuilder;
