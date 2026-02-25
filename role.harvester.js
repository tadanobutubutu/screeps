const gamification = require('gamification');
const vfx = require('visual.effects');

var roleHarvester = {

    run: function(creep) {
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
            // 最も近いソースから採取
            const sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (sources.length > 0) {
                const result = creep.harvest(sources[0]);
                
                if (result === OK) {
                    // 採取成功！
                    gamification.trackAction(creep, 'harvest');
                    
                    // 偶数tickでエフェクト
                    if (Game.time % 5 === 0) {
                        vfx.particles(sources[0].pos, '#FFFF00', 8);
                    }
                } else if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        } else {
            // エネルギーをスポーンまたはエクステンション・タワーに渡す
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (
                    s.structureType === STRUCTURE_SPAWN ||
                    s.structureType === STRUCTURE_EXTENSION ||
                    s.structureType === STRUCTURE_TOWER
                ) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            
            if (targets.length > 0) {
                const result = creep.transfer(targets[0], RESOURCE_ENERGY);
                
                if (result === OK) {
                    // 配達成功！
                    vfx.scorePopup(creep.pos, 5, 'DELIVERY');
                    gamification.addXP(5, 'Energy delivery');
                    
                    // ターゲットに星エフェクト
                    if (Game.time % 3 === 0) {
                        vfx.stars(targets[0].pos, 4);
                    }
                } else if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // 満杯な時はコンテナに充電
                const containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_CONTAINER
                        && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                });
                
                if (containers.length > 0) {
                    const result = creep.transfer(containers[0], RESOURCE_ENERGY);
                    
                    if (result === OK) {
                        vfx.scorePopup(creep.pos, 3, 'STORAGE');
                    } else if (result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffffff' } });
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
                        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;
