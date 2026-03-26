const roleTransporter = {
    run: function (creep) {
        creep.say('🚚');

        if (creep.memory.transporting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.transporting = false;
        }
        if (!creep.memory.transporting && creep.store.getFreeCapacity() === 0) {
            creep.memory.transporting = true;
        }

        if (creep.memory.transporting) {
            // ⚡ PERFORMANCE: Per-tick caching of energy delivery targets
            if (creep.room._deliveryTargetsTick !== Game.time) {
                creep.room._deliveryTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) =>
                        (s.structureType === STRUCTURE_SPAWN ||
                            s.structureType === STRUCTURE_EXTENSION ||
                            s.structureType === STRUCTURE_TOWER ||
                            s.structureType === STRUCTURE_LAB) &&
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
                });
                creep.room._deliveryTargetsTick = Game.time;
            }
            const targets = creep.room._deliveryTargets;

            if (targets.length > 0) {
                // ⚡ PERFORMANCE: ターゲットIDをキャッシュして毎ティックの再探索を回避
                let target = Game.getObjectById(creep.memory.deliveryTargetId);

                // ⚡ PERFORMANCE: O(1) check for delivery target validity instead of O(N) .some()
                if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                    target = creep.pos.findClosestByRange(targets);
                    if (target) {
                        creep.memory.deliveryTargetId = target.id;
                    } else {
                        delete creep.memory.deliveryTargetId;
                    }
                }

                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff' } });
                    }
                }
            } else {
                delete creep.memory.deliveryTargetId;
            }
        } else {
            // ⚡ PERFORMANCE: Per-tick caching of withdrawal containers
            if (creep.room._withdrawalContainersTick !== Game.time) {
                creep.room._withdrawalContainers = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) =>
                        s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
                });
                creep.room._withdrawalContainersTick = Game.time;
            }
            const containers = creep.room._withdrawalContainers;

            // ⚡ PERFORMANCE: 部屋全体の引き出し元リストをキャッシュして、クリープごとの重複計算を回避
            if (creep.room._withdrawalSourcesTick !== Game.time) {
                const storage = creep.room.storage;
                const sources = [];

                if (storage && storage.store[RESOURCE_ENERGY] > 1000) {
                    sources.push(storage);
                }
                sources.push(...containers);

                creep.room._withdrawalSources = sources;
                creep.room._withdrawalSourcesTick = Game.time;
            }
            const sources = creep.room._withdrawalSources;

            if (sources.length > 0) {
                // ⚡ PERFORMANCE: ターゲットIDをキャッシュ
                let target = Game.getObjectById(creep.memory.withdrawalTargetId);

                // ⚡ PERFORMANCE: O(1) check for withdrawal target validity instead of O(N) .some()
                if (!target || target.store[RESOURCE_ENERGY] === 0) {
                    target = creep.pos.findClosestByRange(sources);
                    if (target) {
                        creep.memory.withdrawalTargetId = target.id;
                    } else {
                        delete creep.memory.withdrawalTargetId;
                    }
                }

                if (target) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00' } });
                    }
                }
            } else {
                delete creep.memory.withdrawalTargetId;
            }
        }
    },
};

module.exports = roleTransporter;
