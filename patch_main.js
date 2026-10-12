const fs = require('fs')

function runPatch () {
  const file = 'main.js'
  let content = fs.readFileSync(file, 'utf8') || ''

  const oldCategorizeRoomStructures = `function categorizeRoomStructures(room, allStructures) {
        // 3. 構造物の分類（1パスで実行）
        const myStructures = [];
        const deliveryTargets = [];
        const harvesterDeliveryTargets = [];
        const repairTargets = [];
        const containers = [];
        const fillableContainers = [];
        const withdrawalSources = [];
        const towers = [];
        const spawns = [];
        const freeSpawns = [];
        let minHitsRepairTarget = null;
        let minHits = Infinity;

        for (let i = 0; i < allStructures.length; i++) {
            const s = allStructures[i];
            const type = s.structureType;

            // ⚡ PERFORMANCE: Skip walls (most numerous) to reduce redundant checks and Proxy lookups.
            // Estimated impact: Reduces structure loop CPU overhead by ~30-50% in fortified rooms.
            if (type === STRUCTURE_WALL) {
                continue;
            }

            // ⚡ PERFORMANCE: Hoist hits and hitsMax to minimize Proxy lookups.
            const hits = s.hits;
            const hitsMax = s.hitsMax;
            const isDamaged = hits < hitsMax;

            // ⚡ PERFORMANCE: if-else if構造を使用して不要なチェックを回避
            if (s.my) {
                myStructures.push(s);

                // 防衛・スポーン・納品先の分類
                if (
                    type === STRUCTURE_EXTENSION ||
                    type === STRUCTURE_SPAWN ||
                    type === STRUCTURE_TOWER ||
                    type === STRUCTURE_LAB
                ) {
                    if (s.store && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        deliveryTargets.push(s);
                        if (type !== STRUCTURE_LAB) {
                            harvesterDeliveryTargets.push(s);
                        }
                    }

                    if (type === STRUCTURE_TOWER) {
                        towers.push(s);
                    } else if (type === STRUCTURE_SPAWN) {
                        spawns.push(s);
                        if (!s.spawning) {
                            freeSpawns.push(s);
                        }
                    }
                }
            } else if (type === STRUCTURE_CONTAINER) {
                containers.push(s);
                const store = s.store;
                if (store) {
                    if (store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        fillableContainers.push(s);
                    }
                    if (store[RESOURCE_ENERGY] > 0) {
                        withdrawalSources.push(s);
                    }
                }
            }

            // ⚡ PERFORMANCE: Consolidate repair logic to avoid redundant checks across branches.
            if (isDamaged) {
                repairTargets.push(s);
                if (hits < minHits) {
                    minHits = hits;
                    minHitsRepairTarget = s;
                }

                // ⚡ PERFORMANCE: Hoist critical structure detection (hits < 30%, excluding ramparts)
                // This matches defense.manager.js priority and avoids redundant per-tower searches.
                if (!room._criticalStructure && hits < hitsMax * 0.3 && type !== STRUCTURE_RAMPART) {
                    room._criticalStructure = s;
                }
            }
        }

        // ストレージを引出元に追加
        if (room.storage && room.storage.store[RESOURCE_ENERGY] > 1000) {
            withdrawalSources.push(room.storage);
        }

        room._myStructures = myStructures;
        room._myStructuresTick = Game.time;
        room._deliveryTargets = deliveryTargets;
        room._harvesterDeliveryTargets = harvesterDeliveryTargets;
        room._repairTargets = repairTargets;
        room._minHitsRepairTarget = minHitsRepairTarget;
        room._containers = containers;
        room._containersTick = Game.time;
        room._fillableContainers = fillableContainers;
        room._fillableContainersTick = Game.time;
        room._withdrawalSources = withdrawalSources;
        room._withdrawalSourcesTick = Game.time;
        room._towers = towers;
        room._towersTick = Game.time;
        room._spawns = spawns;
        room._spawnsTick = Game.time;
        room._freeSpawns = freeSpawns;
        room._freeSpawnsTick = Game.time;
    }`

  const newCategorizeRoomStructures = `function _categorizeMyStructure(s, type, state) {
        state.myStructures.push(s);

        if (
            type === STRUCTURE_EXTENSION ||
            type === STRUCTURE_SPAWN ||
            type === STRUCTURE_TOWER ||
            type === STRUCTURE_LAB
        ) {
            if (s.store && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                state.deliveryTargets.push(s);
                if (type !== STRUCTURE_LAB) {
                    state.harvesterDeliveryTargets.push(s);
                }
            }

            if (type === STRUCTURE_TOWER) {
                state.towers.push(s);
            } else if (type === STRUCTURE_SPAWN) {
                state.spawns.push(s);
                if (!s.spawning) {
                    state.freeSpawns.push(s);
                }
            }
        }
    }

    function _categorizeContainer(s, state) {
        state.containers.push(s);
        const store = s.store;
        if (store) {
            if (store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                state.fillableContainers.push(s);
            }
            if (store[RESOURCE_ENERGY] > 0) {
                state.withdrawalSources.push(s);
            }
        }
    }

    function _categorizeRepairTarget(s, type, hits, hitsMax, room, state) {
        state.repairTargets.push(s);
        if (hits < state.minHits) {
            state.minHits = hits;
            state.minHitsRepairTarget = s;
        }

        // ⚡ PERFORMANCE: Hoist critical structure detection (hits < 30%, excluding ramparts)
        // This matches defense.manager.js priority and avoids redundant per-tower searches.
        if (!room._criticalStructure && hits < hitsMax * 0.3 && type !== STRUCTURE_RAMPART) {
            room._criticalStructure = s;
        }
    }

    function categorizeRoomStructures(room, allStructures) {
        // 3. 構造物の分類（1パスで実行）
        const state = {
            myStructures: [],
            deliveryTargets: [],
            harvesterDeliveryTargets: [],
            repairTargets: [],
            containers: [],
            fillableContainers: [],
            withdrawalSources: [],
            towers: [],
            spawns: [],
            freeSpawns: [],
            minHitsRepairTarget: null,
            minHits: Infinity
        };

        for (let i = 0; i < allStructures.length; i++) {
            const s = allStructures[i];
            const type = s.structureType;

            // ⚡ PERFORMANCE: Skip walls (most numerous) to reduce redundant checks and Proxy lookups.
            // Estimated impact: Reduces structure loop CPU overhead by ~30-50% in fortified rooms.
            if (type === STRUCTURE_WALL) {
                continue;
            }

            // ⚡ PERFORMANCE: Hoist hits and hitsMax to minimize Proxy lookups.
            const hits = s.hits;
            const hitsMax = s.hitsMax;
            const isDamaged = hits < hitsMax;

            // ⚡ PERFORMANCE: if-else if構造を使用して不要なチェックを回避
            if (s.my) {
                _categorizeMyStructure(s, type, state);
            } else if (type === STRUCTURE_CONTAINER) {
                _categorizeContainer(s, state);
            }

            // ⚡ PERFORMANCE: Consolidate repair logic to avoid redundant checks across branches.
            if (isDamaged) {
                _categorizeRepairTarget(s, type, hits, hitsMax, room, state);
            }
        }

        // ストレージを抽出元に追加
        if (room.storage && room.storage.store[RESOURCE_ENERGY] > 1000) {
            state.withdrawalSources.push(room.storage);
        }

        room._myStructures = state.myStructures;
        room._myStructuresTick = Game.time;
        room._deliveryTargets = state.deliveryTargets;
        room._harvesterDeliveryTargets = state.harvesterDeliveryTargets;
        room._repairTargets = state.repairTargets;
        room._minHitsRepairTarget = state.minHitsRepairTarget;
        room._containers = state.containers;
        room._containersTick = Game.time;
        room._fillableContainers = state.fillableContainers;
        room._fillableContainersTick = Game.time;
        room._withdrawalSources = state.withdrawalSources;
        room._withdrawalSourcesTick = Game.time;
        room._towers = state.towers;
        room._towersTick = Game.time;
        room._spawns = state.spawns;
        room._spawnsTick = Game.time;
        room._freeSpawns = state.freeSpawns;
        room._freeSpawnsTick = Game.time;
    }`

  if (content) {
    content = content.replace(oldCategorizeRoomStructures, newCategorizeRoomStructures)
    fs.writeFileSync(file, content, 'utf8')
  }
}

if (require.main === module) {
  runPatch()
}

module.exports = runPatch
