const gamification = require('gamification');
const vfx = require('visual.effects');

const roleHarvester = {
    run: function (creep) {
        // レインボートレイル
        if (Game.time % 2 === 0) {
            vfx.rainbowTrail(creep);
        }

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

        if (creep.memory.harvesting) {
            // ⚡ PERFORMANCE: Use centralized room cache for active sources.
            if (creep.room._activeSourcesTick !== Game.time) {
                creep.room._activeSources = creep.room.find(FIND_SOURCES_ACTIVE);
                creep.room._activeSourcesTick = Game.time;
            }
            const sources = creep.room._activeSources;

            if (sources && sources.length > 0) {
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
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        } else {
            // エネルギーをスポーンまたはエクステンション・タワーに渡す
            // ⚡ PERFORMANCE: Use centralized room cache for my structures and filter in JS.
            if (creep.room._myStructuresTick !== Game.time) {
                creep.room._myStructures = creep.room.find(FIND_MY_STRUCTURES);
                creep.room._myStructuresTick = Game.time;
            }
            const targets = creep.room._myStructures.filter(
                (s) =>
                    (s.structureType === STRUCTURE_SPAWN ||
                        s.structureType === STRUCTURE_EXTENSION ||
                        s.structureType === STRUCTURE_TOWER) &&
                    s.store &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );

            if (targets && targets.length > 0) {
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
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // 満杯な時はコンテナに充電
                // ⚡ PERFORMANCE: Use centralized room cache for all structures and filter in JS.
                if (creep.room._allStructuresTick !== Game.time) {
                    creep.room._allStructures = creep.room.find(FIND_STRUCTURES);
                    creep.room._allStructuresTick = Game.time;
                }
                const containers = creep.room._allStructures.filter(
                    (s) =>
                        s.structureType === STRUCTURE_CONTAINER &&
                        s.store &&
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );

                if (containers && containers.length > 0) {
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
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else {
                    // それ以外はコントローラアップグレード
                    const result = creep.upgradeController(creep.room.controller);

                    if (result === OK) {
                        gamification.trackAction(creep, 'upgrade');

                        if (Game.time % 10 === 0) {
                            vfx.particles(creep.room.controller.pos, '#00FF00', 10);
                        }
                    } else if (result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {
                            visualizePathStyle: { stroke: '#ffffff' },
                        });
                    }
                }
            }
        }
    },
};

module.exports = roleHarvester;
