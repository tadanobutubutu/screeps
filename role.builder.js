// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_UPGRADE = { visualizePathStyle: { stroke: '#ffffff' } };
const PATH_STYLE_BUILD = { visualizePathStyle: { stroke: '#0000ff' } };
const PATH_STYLE_HARVEST = { visualizePathStyle: { stroke: '#ffaa00' } };

const roleBuilder = {
    run: function (creep) {
        this._updateState(creep);

        if (creep.memory.building) {
            this._buildOrUpgrade(creep);
        } else {
            this._harvestEnergy(creep);
        }
    },

    _updateState: function (creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('⚡ harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🛠 build');
        }
    },

    _buildOrUpgrade: function (creep) {
        // 建設サイトを探す
        // ⚡ PERFORMANCE: Use pre-warmed room cache for construction sites.
        const targets = creep.room._myConstructionSites || [];

        if (targets.length > 0) {
            this._buildTarget(creep, targets);
        } else {
            delete creep.memory.buildTargetId;
            // 建設サイトがなければアップグレードモードに
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, PATH_STYLE_UPGRADE);
            }
        }
    },

    _buildTarget: function (creep, targets) {
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
            creep.moveTo(target, PATH_STYLE_BUILD);
        }
    },

    _harvestEnergy: function (creep) {
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
                    creep.moveTo(target, PATH_STYLE_HARVEST);
                }
            }
        }
    },
};

module.exports = roleBuilder;
