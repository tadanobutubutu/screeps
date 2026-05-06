const gamification = require('gamification');
const vfx = require('visual.effects');

const STATE_HARVESTING = 'harvesting';
const STATE_DELIVERING = 'delivering';
const STATE_CONTAINER = 'container';
const STATE_UPGRADING = 'upgrading';

// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_HARVEST = { visualizePathStyle: { stroke: '#ffaa00' } };
const PATH_STYLE_DELIVER = { visualizePathStyle: { stroke: '#ffffff' } };

const roleHarvester = {
    run: function (creep) {
        // レインボートレイル
        if (Game.time % 2 === 0) {
            vfx.rainbowTrail(creep);
        }

        this.updateState(creep);

        switch (this.getState(creep)) {
            case STATE_HARVESTING:
                this.handleHarvesting(creep);
                break;
            case STATE_DELIVERING:
                this.handleDelivering(creep);
                break;
            case STATE_CONTAINER:
                this.handleContainer(creep);
                break;
            case STATE_UPGRADING:
                this.handleUpgrading(creep);
                break;
        }
    },

    getState: function (creep) {
        if (creep.memory.harvesting) {
            return STATE_HARVESTING;
        }

        const targets = creep.room._harvesterDeliveryTargets || [];
        if (targets.length > 0) {
            return STATE_DELIVERING;
        }

        const containers = creep.room._fillableContainers || [];
        if (containers.length > 0) {
            return STATE_CONTAINER;
        }

        return STATE_UPGRADING;
    },

    updateState: function (creep) {
        // エネルギーの満タンチェック
        if (creep.memory.harvesting && creep.store.getFreeCapacity() === 0) {
            creep.memory.harvesting = false;
            creep.say('📦 deliver');
            vfx.particles(creep.pos, '#FFD700', 15);
        }
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.harvesting = true;
            creep.say('⚡ harvest');
        }
    },

    handleHarvesting: function (creep) {
        // ⚡ PERFORMANCE: Use pre-warmed room cache for active sources.
        const sources = creep.room._activeSources || [];

        if (sources.length > 0) {
            // ⚡ PERFORMANCE: Cache source ID to avoid re-searching every tick and use closest by range
            let source = Game.getObjectById(creep.memory.harvestTargetId);

            // ⚡ PERFORMANCE: O(1) check for source validity instead of O(N) .some()
            if (!source || source.energy === 0) {
                source = creep.pos.findClosestByRange(sources);
                if (source) {
                    creep.memory.harvestTargetId = source.id;
                } else {
                    delete creep.memory.harvestTargetId;
                }
            }

            const result = creep.harvest(source);

            if (result === OK) {
                // 採取成功！
                gamification.trackAction(creep, 'harvest');

                // 偶数tickでエフェクト
                if (Game.time % 5 === 0) {
                    vfx.particles(source.pos, '#FFFF00', 8);
                }
            } else if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, PATH_STYLE_HARVEST);
            }
        }
    },

    handleDelivering: function (creep) {
        const targets = creep.room._harvesterDeliveryTargets || [];
        // ⚡ PERFORMANCE: Cache delivery target ID to avoid re-searching every tick and use closest by range
        let target = Game.getObjectById(creep.memory.deliverTargetId);

        // ⚡ PERFORMANCE: O(1) check for target validity instead of O(N) .some()
        if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            target = creep.pos.findClosestByRange(targets);
            if (target) {
                creep.memory.deliverTargetId = target.id;
            } else {
                delete creep.memory.deliverTargetId;
            }
        }

        const result = creep.transfer(target, RESOURCE_ENERGY);

        if (result === OK) {
            // 配達成功！
            vfx.scorePopup(creep.pos, 5, 'DELIVERY');
            gamification.addXP(5, 'Energy delivery');

            // ターゲットに星エフェクト
            if (Game.time % 3 === 0) {
                vfx.stars(target.pos, 4);
            }
        } else if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, PATH_STYLE_DELIVER);
        }
    },

    handleContainer: function (creep) {
        const containers = creep.room._fillableContainers || [];
        // ⚡ PERFORMANCE: Cache container ID to avoid re-searching every tick and use closest by range
        let target = Game.getObjectById(creep.memory.containerTargetId);

        // ⚡ PERFORMANCE: O(1) check for container validity instead of O(N) .some()
        if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            target = creep.pos.findClosestByRange(containers);
            if (target) {
                creep.memory.containerTargetId = target.id;
            } else {
                delete creep.memory.containerTargetId;
            }
        }

        const result = creep.transfer(target, RESOURCE_ENERGY);

        if (result === OK) {
            vfx.scorePopup(creep.pos, 3, 'STORAGE');
        } else if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, PATH_STYLE_DELIVER);
        }
    },

    handleUpgrading: function (creep) {
        const result = creep.upgradeController(creep.room.controller);

        if (result === OK) {
            gamification.trackAction(creep, 'upgrade');

            if (Game.time % 10 === 0) {
                vfx.particles(creep.room.controller.pos, '#00FF00', 10);
            }
        } else if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, PATH_STYLE_DELIVER);
        }
    },
};

module.exports = roleHarvester;
