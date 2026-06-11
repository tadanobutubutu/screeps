'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const logger = require('../utils/logger');

// ============================================================
// メインループ
// ============================================================

/**
 * ルームの管理を実行する
 * @param {Room} room
 */
function run(room) {
    if (!room) {
        return;
    }

    // 定期的な建設タスク（50tickごと）
    if (Game.time % 50 === 0) {
        _planConstruction(room);
    }

    // 防衛・セーフモード管理（10tickごと）
    if (Game.time % 10 === 0) {
        _checkSafeMode(room);
    }

    // リンクネットワーク管理（毎tick）
    _manageLinkNetwork(room);
}

// ============================================================
// 建設・インフラ管理
// ============================================================

/**
 * インフラの建設計画を立てる
 * @param {Room} room
 */
function _planConstruction(room) {
    const controller = room.controller;
    if (!controller || !controller.my) {
        return;
    }

    const rcl = controller.level;

    // RCL1以上: ソース周囲のコンテナ、道路
    if (rcl >= 1) {
        _planSourceContainers(room);
        _planRoads(room);
    }

    // RCL2以上: エクステンションを配置
    if (rcl >= 2) {
        _planExtensions(room);
    }
}

/**
 * ソース周囲にコンテナを配置する
 * @param {Room} room
 */
function _planSourceContainers(room) {
    const sources = cache.getSources(room);
    const existingContainers = cache.getContainers(room);

    // コンテナの建設サイトをループ外で一度だけ取得
    // ⚡ PERFORMANCE OPTIMIZATION: Use for loop to avoid filter closure.
    const allSites = cache.getConstructionSites(room);
    const containerSites = [];
    for (let i = 0; i < allSites.length; i++) {
        const site = allSites[i];
        if (site.structureType === STRUCTURE_CONTAINER) {
            containerSites.push(site);
        }
    }

    for (const source of sources) {
        // すでに近くにコンテナがあれば skip
        let hasNearbyContainer = false;
        for (let i = 0; i < existingContainers.length; i++) {
            if (source.pos.getRangeTo(existingContainers[i]) <= 2) {
                hasNearbyContainer = true;
                break;
            }
        }
        if (hasNearbyContainer) {
            continue;
        }

        // コンテナの建設サイトがすでにあれば skip
        let hasNearbySite = false;
        for (let i = 0; i < containerSites.length; i++) {
            if (source.pos.getRangeTo(containerSites[i]) <= 2) {
                hasNearbySite = true;
                break;
            }
        }
        if (hasNearbySite) {
            continue;
        }

        // ソースの隣の空きタイルにコンテナを配置
        const pos = pathfinder.findNearestOpenTile(source.pos, 2);
        if (pos) {
            const result = room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
            if (result === OK) {
                logger.info(`[RoomManager] ソース ${source.id} 付近にコンテナを計画`);
                cache.invalidate(`construction_sites_${room.name}`);
            }
        }
    }
}

/**
 * 指定したルームの占有されているタイルをセットとして取得する
 * @param {Room} room
 * @returns {Set<number>}
 */
function _getOccupiedTiles(room) {
    const occupiedTiles = new Set();
    const structures = cache.getStructures(room);
    const sites = cache.getConstructionSites(room);

    for (let i = 0; i < structures.length; i++) {
        const s = structures[i];
        occupiedTiles.add(s.pos.x | (s.pos.y << 6));
    }
    for (let i = 0; i < sites.length; i++) {
        const s = sites[i];
        occupiedTiles.add(s.pos.x | (s.pos.y << 6));
    }
    return occupiedTiles;
}

/**
 * 与えられたパスに沿って道路の建設サイトを配置する
 * @param {Room} room
 * @param {Array} path
 * @param {Set<number>} occupiedTiles
 * @param {number} maxPlacements
 * @returns {number} 計画された道路の数
 */
function _createRoadSitesForPath(room, path, occupiedTiles, maxPlacements) {
    let planned = 0;
    for (let i = 0; i < path.length; i++) {
        const pos = path[i];
        // 既存の構造物や建設サイトがない場所にのみ道路を計画
        const isOccupied = occupiedTiles.has(pos.x | (pos.y << 6));

        if (!isOccupied) {
            const r = room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
            if (r === OK) {
                planned++;
                occupiedTiles.add(pos.x | (pos.y << 6)); // 新しく計画した場所も追加
                if (planned >= maxPlacements) {
                    break;
                } // 一度に最大数まで計画
            }
        }
    }
    return planned;
}

/**
 * スポーンからソース・コントローラーへの道路を計画する
 * @param {Room} room
 */
function _planRoads(room) {
    const spawns = cache.getSpawns(room);
    if (spawns.length === 0) {
        return;
    }

    const spawn = spawns[0];
    const sources = cache.getSources(room);
    const targets = [...sources, room.controller].filter(Boolean);

    // 既存の構造物と建設サイトを一度に取得し、Setにキャッシュして高速に判定する
    const occupiedTiles = _getOccupiedTiles(room);
    const MAX_ROADS_PER_CYCLE = 5;

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const result = pathfinder.findPath(spawn.pos, target);
        if (result.incomplete) {
            continue;
        }

        const planned = _createRoadSitesForPath(
            room,
            result.path,
            occupiedTiles,
            MAX_ROADS_PER_CYCLE
        );

        if (planned > 0) {
            logger.debug(`[RoomManager] 道路 ${planned} か所を計画`);
            cache.invalidate(`construction_sites_${room.name}`);
        }
    }
}

/**
 * 必要なエクステンションの数を計算する
 * @param {Room} room
 * @returns {number}
 */
function _getNeededExtensionCount(room) {
    const rcl = room.controller.level;
    const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][rcl] || 0;

    if (maxExtensions === 0) {
        return 0;
    }

    const existing = cache.getMyStructures(room, STRUCTURE_EXTENSION);
    // ⚡ PERFORMANCE OPTIMIZATION: Use for loop to avoid filter closure.
    const allSites = cache.getConstructionSites(room);
    let siteCount = 0;
    for (let i = 0; i < allSites.length; i++) {
        if (allSites[i].structureType === STRUCTURE_EXTENSION) {
            siteCount++;
        }
    }

    const currentCount = existing.length + siteCount;
    if (currentCount >= maxExtensions) {
        return 0;
    }

    return Math.min(5, maxExtensions - currentCount);
}

/**
 * スポーン周辺の障害物マップを作成する
 * @param {Room} room
 * @param {StructureSpawn} spawn
 * @returns {Set<string>}
 */
function _getBlockedMap(room, spawn) {
    const top = Math.max(2, spawn.pos.y - 6);
    const left = Math.max(2, spawn.pos.x - 6);
    const bottom = Math.min(47, spawn.pos.y + 6);
    const right = Math.min(47, spawn.pos.x + 6);
    const area = room.lookAtArea(top, left, bottom, right, true);

    const blockedMap = new Set();
    for (let i = 0; i < area.length; i++) {
        const item = area[i];
        if (item.type === LOOK_STRUCTURES || item.type === LOOK_CONSTRUCTION_SITES) {
            blockedMap.add(`${item.x},${item.y}`);
        }
    }
    return blockedMap;
}

/**
 * スパイラルパターンでエクステンションを配置する
 * @param {Room} room
 * @param {StructureSpawn} spawn
 * @param {number} needed
 * @param {Set<string>} blockedMap
 * @returns {number} 配置された数
 */
function _placeExtensions(room, spawn, needed, blockedMap) {
    let placed = 0;
    // スポーン周囲のスパイラルパターンでエクステンションを配置
    for (let radius = 2; radius <= 6 && placed < needed; radius++) {
        for (let dx = -radius; dx <= radius && placed < needed; dx++) {
            for (let dy = -radius; dy <= radius && placed < needed; dy++) {
                if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) {
                    continue;
                }

                const x = spawn.pos.x + dx;
                const y = spawn.pos.y + dy;
                if (x < 2 || x > 47 || y < 2 || y > 47) {
                    continue;
                }

                const terrain = room.getTerrain().get(x, y);
                if (terrain === TERRAIN_MASK_WALL) {
                    continue;
                }

                const isBlocked = blockedMap.has(`${x},${y}`);
                if (isBlocked) {
                    continue;
                }

                const r = room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                if (r === OK) {
                    placed++;
                }
            }
        }
    }
    return placed;
}

/**
 * スポーン周囲にエクステンションを配置する計画を立てる
 * @param {Room} room
 */
function _planExtensions(room) {
    const needed = _getNeededExtensionCount(room);
    if (needed === 0) {
        return;
    }

    const spawns = cache.getSpawns(room);
    if (spawns.length === 0) {
        return;
    }

    const spawn = spawns[0];
    const blockedMap = _getBlockedMap(room, spawn);
    const placed = _placeExtensions(room, spawn, needed, blockedMap);

    if (placed > 0) {
        logger.info(`[RoomManager] エクステンション ${placed} か所を計画`);
        cache.invalidate(`construction_sites_${room.name}`);
    }
}

// ============================================================
// セーフモード管理
// ============================================================

/**
 * セーフモード発動が必要か確認し、必要であれば発動する
 * @param {Room} room
 */
function _checkSafeMode(room) {
    const controller = room.controller;
    if (!controller || controller.safeMode || controller.safeModeAvailable === 0) {
        return;
    }

    const SAFE_MODE_TRIGGER_HOSTILES = 3;

    const enemies = cache.getEnemies(room);
    // ⚡ PERFORMANCE OPTIMIZATION: Use for loop to avoid filter closure.
    const dangerousEnemies = [];
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (
            e.getActiveBodyparts(ATTACK) > 0 ||
            e.getActiveBodyparts(RANGED_ATTACK) > 0 ||
            e.getActiveBodyparts(WORK) > 0
        ) {
            dangerousEnemies.push(e);
        }
    }

    if (dangerousEnemies.length >= SAFE_MODE_TRIGGER_HOSTILES) {
        // 自室のディフェンダー数
        // ⚡ PERFORMANCE OPTIMIZATION: Use getMyCreeps cache and standard for loop to avoid global Game.creeps iteration.
        let defenderCount = 0;
        const myCreeps = cache.getMyCreeps(room);
        for (let i = 0; i < myCreeps.length; i++) {
            const c = myCreeps[i];
            if (c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0) {
                defenderCount++;
            }
        }

        if (defenderCount < dangerousEnemies.length) {
            const result = controller.activateSafeMode();
            if (result === OK) {
                logger.warn(
                    `[RoomManager] セーフモード発動: ${room.name} 敵 ${dangerousEnemies.length} 体`
                );
            }
        }
    }
}

// ============================================================
// リンクネットワーク管理
// ============================================================

/**
 * リンクネットワークを管理する
 * ソースリンク（エネルギーが高い）からシンクリンク（コントローラー付近）へ転送
 * @param {Room} room
 */
function _manageLinkNetwork(room) {
    const links = cache.getLinks(room);
    if (links.length < 2) {
        return;
    }

    const controller = room.controller;
    if (!controller) {
        return;
    }

    const LINK_TRANSFER_THRESHOLD = 0.8;

    // ソースリンク: ソース付近のリンク（エネルギーが溜まる）
    // ⚡ PERFORMANCE OPTIMIZATION: Use for loop to avoid filter closure.
    const sourceLinks = [];
    for (let i = 0; i < links.length; i++) {
        const l = links[i];
        if (
            l.store[RESOURCE_ENERGY] >=
                l.store.getCapacity(RESOURCE_ENERGY) * LINK_TRANSFER_THRESHOLD &&
            l.cooldown === 0
        ) {
            sourceLinks.push(l);
        }
    }

    // シンクリンク: コントローラー付近またはスポーン付近
    const spawns = cache.getSpawns(room);
    const spawnPos = spawns.length > 0 ? spawns[0].pos : null;

    // ⚡ PERFORMANCE OPTIMIZATION: Use for loop to avoid filter closure.
    const sinkLinks = [];
    for (let i = 0; i < links.length; i++) {
        const l = links[i];
        if (
            l.store[RESOURCE_ENERGY] < l.store.getCapacity(RESOURCE_ENERGY) * 0.5 &&
            (controller.pos.getRangeTo(l) <= 5 || (spawnPos && spawnPos.getRangeTo(l) <= 5))
        ) {
            sinkLinks.push(l);
        }
    }

    if (sourceLinks.length === 0 || sinkLinks.length === 0) {
        return;
    }

    for (let i = 0; i < sourceLinks.length; i++) {
        const sourceLink = sourceLinks[i];
        const sink = pathfinder.closest(sourceLink.pos, sinkLinks);
        if (!sink) {
            continue;
        }

        const result = sourceLink.transferEnergy(sink);
        if (result === OK) {
            logger.debug(`[RoomManager] リンク転送: ${sourceLink.pos} → ${sink.pos}`);
        }
    }
}

// ============================================================
// ルーム統計
// ============================================================

/**
 * クリープの統計を取得するヘルパー関数
 * @param {Room} room
 * @returns {Object} { creepCounts, totalCreeps }
 */
function _getCreepStats(room) {
    // ⚡ PERFORMANCE OPTIMIZATION: Prioritize fresh volatile room cache populated in main.js
    if (room._roleCounts && room._myCreepsTick === Game.time) {
        return {
            creepCounts: room._roleCounts,
            totalCreeps: room._myCreeps.length,
        };
    }

    // ⚡ PERFORMANCE OPTIMIZATION: Fallback to getMyCreeps cache and standard for loop to avoid global Game.creeps iteration.
    const creepCounts = Object.create(null);
    const myCreeps = cache.getMyCreeps(room);
    for (let i = 0; i < myCreeps.length; i++) {
        const creep = myCreeps[i];
        if (!creep) continue;
        const role = creep.memory.role || 'unknown';
        if (cache.isSafeKey(role)) {
            creepCounts[role] = (creepCounts[role] || 0) + 1;
        }
    }
    return {
        creepCounts,
        totalCreeps: myCreeps.length,
    };
}

/**
 * ルームの詳細統計を返す
 * @param {Room} room
 * @returns {Object}
 */
function getStats(room) {
    const storage = cache.getStorage(room);
    const towers = cache.getMyStructures(room, STRUCTURE_TOWER);
    const enemies = cache.getEnemies(room);

    const { creepCounts, totalCreeps } = _getCreepStats(room);

    return {
        name: room.name,
        rcl: room.controller ? room.controller.level : 0,
        controllerProgress: room.controller
            ? (room.controller.progress / (room.controller.progressTotal || 1)) * 100
            : 0,
        energy: room.energyAvailable,
        energyCapacity: room.energyCapacityAvailable,
        storageEnergy: storage ? storage.store[RESOURCE_ENERGY] : 0,
        creepCounts,
        totalCreeps,
        constructionSites: cache.getConstructionSites(room).length,
        towers: towers.length,
        enemies: enemies.length,
        safeMode: room.controller ? !!room.controller.safeMode : false,
    };
}

/**
 * ルーム統計をコンソールに表示する
 * @param {Room} room
 */
function showStats(room) {
    const stats = getStats(room);
    const statParts = [
        `[Room: ${stats.name}] RCL${stats.rcl}`,
        `Energy: ${stats.energy}/${stats.energyCapacity}`,
        `Creeps: ${stats.totalCreeps}`,
        `Sites: ${stats.constructionSites}`,
        `Enemies: ${stats.enemies}`
    ];
    logger.info(statParts.join(' | '));

    if (stats.storageEnergy > 0) {
        logger.info(`  Storage: ${stats.storageEnergy.toLocaleString()} energy`);
    }

    const roles = Object.keys(stats.creepCounts);
    if (roles.length > 0) {
        const breakdown = roles.map((r) => `${r}:${stats.creepCounts[r]}`).join(' ');
        logger.info(`  Roles: ${breakdown}`);
    }
}

/**
 * ルームの状態をビジュアルに表示する
 * @param {Room} room
 */
function showVisuals(room) {
    const stats = getStats(room);
    const controller = room.controller;

    if (controller) {
        const progress = stats.controllerProgress.toFixed(1);
        room.visual.text(`RCL${stats.rcl} (${progress}%)`, controller.pos.x, controller.pos.y - 1, {
            color: '#00bfff',
            font: 0.5,
            align: 'center',
        });
    }

    // エネルギー情報を左上に表示
    room.visual.text(`⚡ ${stats.energy}/${stats.energyCapacity}`, 2, 2, {
        color: '#ffaa00',
        font: 0.6,
        align: 'left',
    });
    room.visual.text(`👥 ${stats.totalCreeps}体`, 2, 3, {
        color: '#ffffff',
        font: 0.6,
        align: 'left',
    });
    if (stats.enemies > 0) {
        room.visual.text(`⚠️ 敵${stats.enemies}体`, 2, 4, {
            color: '#ff4444',
            font: 0.6,
            align: 'left',
        });
    }
}

module.exports = {
    run,
    getStats,
    showStats,
    showVisuals,
};
