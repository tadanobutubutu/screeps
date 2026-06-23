import sys

def refactor():
    with open('main.js', 'r') as f:
        content = f.read()

    # 1. Refactor categorizeRoomStructures to reduce complexity
    # We'll extract the loop body into _processStructure
    old_categorize = """function categorizeRoomStructures(room, allStructures) {
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
}"""

    new_helper = """function _processStructure(s, room, state) {
    const type = s.structureType;
    if (type === STRUCTURE_WALL) return;

    const isRoad = type === STRUCTURE_ROAD;
    const hits = s.hits;
    const hitsMax = s.hitsMax;
    const isDamaged = hits < hitsMax;

    if (isRoad) {
        // Road needs no special categorization
    } else if (type === STRUCTURE_CONTAINER) {
        _categorizeContainer(s, state);
    } else if (s.my) {
        _categorizeMyStructure(s, type, state);
    }

    if (isDamaged) {
        _categorizeRepairTarget(s, type, hits, hitsMax, room, state);
    }
}

function categorizeRoomStructures(room, allStructures) {
    const state = {
        myStructures: [], myStructuresByType: Object.create(null),
        deliveryTargets: [], harvesterDeliveryTargets: [],
        repairTargets: [], containers: [], fillableContainers: [],
        withdrawalSources: [], towers: [], spawns: [],
        freeSpawns: [], minHitsRepairTarget: null, minHits: Infinity,
    };

    for (let i = 0; i < allStructures.length; i++) {
        _processStructure(allStructures[i], room, state);
    }

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
}"""

    content = content.replace(old_categorize, new_helper)

    # 2. Refactor loop to reduce complexity
    old_loop_start = """module.exports.loop = function () {
    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) { delete Memory.creeps[name]; }
        }
        Memory.lastCleanup = Game.time;
    }

    // Smart Spawn Priority (Auto-added)
    if (!Memory.spawnPriority) {
        Memory.spawnPriority = ['harvester', 'upgrader', 'builder', 'repairer'];
    }
    // Auto-adjust priority based on current needs
    if (Game.time % 500 === 0) {
        const counts = {};
        Object.values(Game.creeps).forEach(c => {
            counts[c.memory.role] = (counts[c.memory.role] || 0) + 1;
        });
        Memory.spawnPriority.sort((a, b) => (counts[a] || 0) - (counts[b] || 0));
    }

    // Path Cache Cleanup (Auto-added)
    if (!Memory.pathCache) Memory.pathCache = {};
    if (Game.time % 1000 === 0) {
        const oldPaths = Object.keys(Memory.pathCache).filter(
            (key) => Memory.pathCache[key].tick < Game.time - 1000
        );
        oldPaths.forEach((key) => delete Memory.pathCache[key]);
        if (oldPaths.length > 0) {
            }
    }"""

    new_loop_helpers = """function _cleanDeadCreeps() {
    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) { delete Memory.creeps[name]; }
        }
        Memory.lastCleanup = Game.time;
    }
}

function _updateSpawnPriority() {
    if (!Memory.spawnPriority) {
        Memory.spawnPriority = ['harvester', 'upgrader', 'builder', 'repairer'];
    }
    if (Game.time % 500 === 0) {
        const counts = {};
        Object.values(Game.creeps).forEach(c => {
            counts[c.memory.role] = (counts[c.memory.role] || 0) + 1;
        });
        Memory.spawnPriority.sort((a, b) => (counts[a] || 0) - (counts[b] || 0));
    }
}

function _cleanupPathCache() {
    if (!Memory.pathCache) Memory.pathCache = {};
    if (Game.time % 1000 === 0) {
        const oldPaths = Object.keys(Memory.pathCache).filter(
            (key) => Memory.pathCache[key].tick < Game.time - 1000
        );
        oldPaths.forEach((key) => delete Memory.pathCache[key]);
    }
}

module.exports.loop = function () {
    _cleanDeadCreeps();
    _updateSpawnPriority();
    _cleanupPathCache();"""

    content = content.replace(old_loop_start, new_loop_helpers)

    with open('main.js', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    refactor()
