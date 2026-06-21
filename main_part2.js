
    return allStructures;
}

function _categorizeMyStructure(s, type, state) {
    state.myStructures.push(s);

    // ⚡ PERFORMANCE: Index owned structures by type for O(1) lookup.
    if (!state.myStructuresByType[type]) {
        state.myStructuresByType[type] = [];
    }
    state.myStructuresByType[type].push(s);

    if (
        type === STRUCTURE_EXTENSION ||
        type === STRUCTURE_SPAWN ||
        type === STRUCTURE_TOWER ||
        type === STRUCTURE_LAB
    ) {
        // ⚡ PERFORMANCE: Hoist store to reduce Proxy property lookups.
        const store = s.store;
        if (store && store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
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

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Refactored to use positional arguments instead of object destructuring.
 * Passing a single object literal `{ s, type, hits, hitsMax, room, state }` in a high-frequency loop
 * (once per damaged structure) triggers per-tick object allocation and increased GC pressure.
 * Switching to positional arguments eliminates these allocations.
 * Expected Impact: ~10-20% reduction in loop overhead in rooms with many damaged structures.
 */
function _categorizeRepairTarget(s, type, hits, hitsMax, room, state) {
    state.repairTargets.push(s);
    // ⚡ PERFORMANCE: Track target with min hits for O(1) lookup.
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
        myStructuresByType: Object.create(null),
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
        minHits: Infinity,
    };

    for (let i = 0; i < allStructures.length; i++) {
        const s = allStructures[i];
        const type = s.structureType;

        // ⚡ PERFORMANCE: Skip walls and roads (most numerous) early to reduce redundant checks and Proxy lookups.
        // Wall is most numerous in fortified rooms, Road is most numerous in developed rooms.
        // s.my incurs a cross-boundary Proxy lookup, so we check non-owned types first.
        if (type === STRUCTURE_WALL) {
            continue;
        }

        const isRoad = type === STRUCTURE_ROAD;

        // ⚡ PERFORMANCE: Hoist hits and hitsMax to minimize Proxy lookups.
        const hits = s.hits;
        const hitsMax = s.hitsMax;
        const isDamaged = hits < hitsMax;

        // ⚡ PERFORMANCE: if-else if構造を使用して不要なチェックを回避。
        // 一般的な非所有構造物（Road, Container）を先にチェックし、高コストな s.my Proxy ルックアップを回避。
        if (isRoad) {
            // Roadは所有物ではないため、個別の分類は不要（修理チェックのみ後に実行）
        } else if (type === STRUCTURE_CONTAINER) {
            _categorizeContainer(s, state);
        } else if (s.my) {
            _categorizeMyStructure(s, type, state);
        }

        // ⚡ PERFORMANCE: Consolidate repair logic to avoid redundant checks across branches.
        if (isDamaged) {
            _categorizeRepairTarget(s, type, hits, hitsMax, room, state);
        }
    }

    // ストレージを引出元に追加
    if (room.storage && room.storage.store[RESOURCE_ENERGY] > 1000) {
        state.withdrawalSources.push(room.storage);
    }

    room._myStructures = state.myStructures;
    room._myStructuresByType = state.myStructuresByType;
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
}

function warmRoomCache(room) {
    const allStructures = initializeRoomBasicCache(room);
    categorizeRoomStructures(room, allStructures);
}

function processCreeps(rooms, creeps, sites, isLoggingEnabled, isEmotionsEnabled) {
    const creepCounts = Object.create(null);

    // ⚡ PERFORMANCE: 部屋ごとのキャッシュ初期化と構造物のスキャンを一括で行う
    for (let i = 0; i < rooms.length; i++) {
        warmRoomCache(rooms[i]);
    }

    // ⚡ PERFORMANCE: 建設サイトの処理
    for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        if (site.my && site.room) {
            site.room._myConstructionSites.push(site);
        }
    }

    // Pass 1: データ収集
    // ⚡ PERFORMANCE: 以前の creepsToProcess 配列の作成を回避し、
    // 中間オブジェクトの割り当てをなくす。
    for (let i = 0; i < creeps.length; i++) {
        const creep = creeps[i];
        const memory = creep.memory;
        let role = memory.role;

        if (role === undefined || role === null) {
            role = memory.role = 'harvester';
            if (isLoggingEnabled) {
                logger.warn('Creep ' + creep.name + ' had no role, set to harvester');
            }
        }
        // ⚡ PERFORMANCE: Cache role as a volatile property to avoid second Proxy lookup in Pass 2.
        creep._role = role;
        creepCounts[role] = (creepCounts[role] || 0) + 1;

        const room = creep.room;
        if (room) {
            room._myCreeps.push(creep);
            if (room._roleCounts[role] !== undefined) {
                room._roleCounts[role]++;
            }
            if (creep.hits < creep.hitsMax) {
                room._injuredCreeps.push(creep);
