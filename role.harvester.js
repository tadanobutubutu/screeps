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
            // ⚡ PERFORMANCE: Per-tick caching of active sources
            if (creep.room._activeSourcesTick !== Game.time) {
                creep.room._activeSources = creep.room.find(FIND_SOURCES_ACTIVE);
                creep.room._activeSourcesTick = Game.time;
            }
            const sources = creep.room._activeSources;

            if (sources.length > 0) {
                const source = sources[0];
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
            // ⚡ PERFORMANCE: Per-tick caching of energy targets
            if (creep.room._energyTargetsTick !== Game.time) {
                creep.room._energyTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) =>
                        (s.structureType === STRUCTURE_SPAWN ||
                            s.structureType === STRUCTURE_EXTENSION ||
                            s.structureType === STRUCTURE_TOWER) &&
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
                });
                creep.room._energyTargetsTick = Game.time;
            }
            const targets = creep.room._energyTargets;

            if (targets.length > 0) {
                const target = targets[0];
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
                // ⚡ PERFORMANCE: Per-tick caching of container targets
                if (creep.room._containerTargetsTick !== Game.time) {
                    creep.room._containerTargets = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) =>
                            s.structureType === STRUCTURE_CONTAINER &&
                            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
                    });
                    creep.room._containerTargetsTick = Game.time;
                }
                const containers = creep.room._containerTargets;

                if (containers.length > 0) {
                    const target = containers[0];
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
