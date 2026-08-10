/**
 * src/managers/roomManager.js
 * ルーム管理・インフラ計画・防衛・リンク制御モジュール
 *
 * ⚡ PERFORMANCE OPTIMIZATION: Refactored with fast-path caches, single-pass loops,
 * and O(1) Coordinate Sets to minimize CPU cycles and memory churn in hot paths.
 */

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
    if (!room || !room.controller || !room.controller.my) {
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

    // RCL1以上: ソース周囲 of コンテナ、道路
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
    const sources = cache.getSources(room) || [];
    const existingContainers = cache.getContainers(room) || [];
    const constructionSites = cache.getConstructionSites(room) || [];

    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        if (!source || !source.pos) continue;

        // 既に近くにコンテナがあるか確認
        let hasNearbyContainer = false;
        for (let j = 0; j < existingContainers.length; j++) {
            const container = existingContainers[j];
            if (container && container.pos && source.pos.getRangeTo(container) <= 2) {
                hasNearbyContainer = true;
                break;
            }
        }
        if (hasNearbyContainer) continue;

        // 既にコンテナの建設サイトが近くにあるか確認
        for (let j = 0; j < constructionSites.length; j++) {
            const site = constructionSites[j];
            if (site && site.structureType === STRUCTURE_CONTAINER && site.pos) {
                if (source.pos.getRangeTo(site) <= 2) {
                    hasNearbyContainer = true;
                    break;
                }
            }
        }
        if (hasNearbyContainer) continue;

        // 配置可能なタイルを検索して建設サイト作成
        const openTile = pathfinder.findNearestOpenTile(source.pos);
        if (openTile) {
            const res = room.createConstructionSite(openTile.x, openTile.y, STRUCTURE_CONTAINER);
            if (res === OK) {
                cache.invalidate(`construction_sites_${room.name}`);
            }
        }
    }
}

/**
 * 道路の建設計画を立てる
 * @param {Room} room
 */
function _planRoads(room) {
    const spawns = cache.getSpawns(room) || [];
    if (spawns.length === 0) return;

    const sources = cache.getSources(room) || [];
    const controller = room.controller;
    let createdAny = false;

    // Use a Set for O(1) occupied coordinate check to prevent nested loop bottlenecks
    const occupied = new Set();
    const structures = cache.getStructures(room) || [];
    for (let i = 0; i < structures.length; i++) {
        const s = structures[i];
        if (s && s.pos) {
            occupied.add(`${s.pos.x},${s.pos.y}`);
        }
    }
    const sites = cache.getConstructionSites(room) || [];
    for (let i = 0; i < sites.length; i++) {
        const s = sites[i];
        if (s && s.pos) {
            occupied.add(`${s.pos.x},${s.pos.y}`);
        }
    }

    // スポーンから各ソースへの道路
    for (let i = 0; i < spawns.length; i++) {
        const spawn = spawns[i];
        if (!spawn || !spawn.pos) continue;
        for (let j = 0; j < sources.length; j++) {
            const source = sources[j];
            if (!source || !source.pos) continue;
            const pathResult = pathfinder.findPath(spawn.pos, source.pos, { range: 1 });
            if (pathResult && pathResult.incomplete === false && pathResult.path) {
                let placedInPath = 0;
                for (let k = 0; k < pathResult.path.length; k++) {
                    if (placedInPath >= 5) break;
                    const pos = pathResult.path[k];
                    if (!occupied.has(`${pos.x},${pos.y}`)) {
                        const res = room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
                        if (res === OK) {
                            placedInPath++;
                            occupied.add(`${pos.x},${pos.y}`);
                            createdAny = true;
                        }
                    }
                }
            }
        }
    }

    // スポーンからコントローラーへの道路
    if (controller && controller.pos) {
        for (let i = 0; i < spawns.length; i++) {
            const spawn = spawns[i];
            if (!spawn || !spawn.pos) continue;
            const pathResult = pathfinder.findPath(spawn.pos, controller.pos, { range: 3 });
            if (pathResult && pathResult.incomplete === false && pathResult.path) {
                let placedInPath = 0;
                for (let k = 0; k < pathResult.path.length; k++) {
                    if (placedInPath >= 5) break;
                    const pos = pathResult.path[k];
                    if (!occupied.has(`${pos.x},${pos.y}`)) {
                        const res = room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
                        if (res === OK) {
                            placedInPath++;
                            occupied.add(`${pos.x},${pos.y}`);
                            createdAny = true;
                        }
                    }
                }
            }
        }
    }

    if (createdAny) {
        cache.invalidate(`construction_sites_${room.name}`);
    }
}

/**
 * エクステンションの建設計画を立てる
 * @param {Room} room
 */
function _planExtensions(room) {
    const needed = _getNeededExtensionCount(room);
    if (needed <= 0) return;

    const spawns = cache.getSpawns(room) || [];
    if (spawns.length === 0) return;

    const spawn = spawns[0];
    if (!spawn || !spawn.pos) return;

    // Use a Set for O(1) occupied coordinate check to prevent nested loop bottlenecks
    const occupied = new Set();
    const structures = cache.getStructures(room) || [];
    for (let i = 0; i < structures.length; i++) {
        const s = structures[i];
        if (s && s.pos) {
            occupied.add(`${s.pos.x},${s.pos.y}`);
        }
    }
    const sites = cache.getConstructionSites(room) || [];
    for (let i = 0; i < sites.length; i++) {
        const s = sites[i];
        if (s && s.pos) {
            occupied.add(`${s.pos.x},${s.pos.y}`);
        }
    }

    let countPlacements = 0;

    for (let r = 2; r <= 5; r++) {
        for (let dx = -r; dx <= r; dx++) {
            for (let dy = -r; dy <= r; dy++) {
                if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
                const x = spawn.pos.x + dx;
                const y = spawn.pos.y + dy;
                if (x < 2 || x > 47 || y < 2 || y > 47) continue;

                if (room.getTerrain().get(x, y) === TERRAIN_MASK_WALL) continue;
                if (occupied.has(`${x},${y}`)) continue;

                const res = room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                if (res === OK) {
                    countPlacements++;
                    occupied.add(`${x},${y}`); // Mark as occupied
                    if (countPlacements >= needed) {
                        cache.invalidate(`construction_sites_${room.name}`);
                        return;
                    }
                }
            }
        }
    }
}

/**
 * 必要なエクステンションの残数を取得する
 * @param {Room} room
 * @returns {number}
 */
function _getNeededExtensionCount(room) {
    const controller = room.controller;
    if (!controller) return 0;

    const level = controller.level;
    const maxExtensions =
        global.CONTROLLER_STRUCTURES && global.CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION]
            ? global.CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level] || 0
            : 0;
    if (maxExtensions === 0) return 0;

    const extensions = cache.getMyStructures(room, STRUCTURE_EXTENSION) || [];
    const existingCount = extensions.length;

    const sites = cache.getConstructionSites(room) || [];
    let siteCount = 0;
    for (let i = 0; i < sites.length; i++) {
        if (sites[i] && sites[i].structureType === STRUCTURE_EXTENSION) {
            siteCount++;
        }
    }

    const currentTotal = existingCount + siteCount;
    if (currentTotal >= maxExtensions) return 0;

    return Math.min(5, maxExtensions - currentTotal);
}

// ============================================================
// 防衛・セーフモード管理
// ============================================================

/**
 * ルームの侵入者を監視し、必要ならセーフモードを発動する
 * @param {Room} room
 */
function _checkSafeMode(room) {
    const controller = room.controller;
    if (
        !controller ||
        !controller.my ||
        controller.safeMode ||
        controller.safeModeAvailable === 0
    ) {
        return;
    }

    const enemies = cache.getEnemies(room) || [];
    let hostileCount = 0;
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (
            e &&
            (e.getActiveBodyparts(ATTACK) > 0 ||
                e.getActiveBodyparts(RANGED_ATTACK) > 0 ||
                e.getActiveBodyparts(CLAIM) > 0)
        ) {
            hostileCount++;
        }
    }

    if (hostileCount >= 3) {
        let defenderCount = 0;
        const myCreeps = cache.getMyCreeps(room) || [];
        for (let i = 0; i < myCreeps.length; i++) {
            const c = myCreeps[i];
            if (
                c &&
                c.room &&
                c.room.name === room.name &&
                c.memory &&
                c.memory.role === 'defender' &&
                (c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0)
            ) {
                defenderCount++;
            }
        }

        if (defenderCount < hostileCount) {
            controller.activateSafeMode();
        }
    }
}

// ============================================================
// リンクネットワーク管理
// ============================================================

/**
 * リンクネットワークによるエネルギー転送を管理する
 * @param {Room} room
 */
function _manageLinkNetwork(room) {
    const links = cache.getLinks(room) || [];
    if (links.length < 2) return;

    const senders = [];
    const receivers = [];
    const virtualEnergy = new Map();

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (!link || !link.store) continue;
        const energy = link.store[RESOURCE_ENERGY] || 0;
        virtualEnergy.set(link, energy);

        if (energy >= 400 && (!link.cooldown || link.cooldown === 0)) {
            senders.push(link);
        } else if (energy < 400) {
            receivers.push(link);
        }
    }

    if (senders.length === 0 || receivers.length === 0) return;

    for (let i = 0; i < senders.length; i++) {
        const sender = senders[i];
        const target = pathfinder.closest(sender.pos, receivers);
        if (target) {
            const senderEnergy = virtualEnergy.get(sender) || 0;
            if (senderEnergy < 400) continue;

            const targetEnergy = virtualEnergy.get(target) || 0;
            const targetCapacity =
                typeof target.store.getCapacity === 'function'
                    ? target.store.getCapacity(RESOURCE_ENERGY)
                    : target.store.getCapacity || 800;
            const targetFree = targetCapacity - targetEnergy;
            if (targetFree <= 0) continue;

            const res = sender.transferEnergy(target);
            if (res === OK) {
                const transferred = Math.min(senderEnergy, targetFree);
                virtualEnergy.set(sender, senderEnergy - transferred);
                virtualEnergy.set(target, targetEnergy + transferred);

                if (targetEnergy + transferred >= 400) {
                    const idx = receivers.indexOf(target);
                    if (idx !== -1) {
                        receivers.splice(idx, 1);
                    }
                }
            }
        }
        if (receivers.length === 0) break;
    }
}

// ============================================================
// 統計・ダッシュボード
// ============================================================

/**
 * ルームの統計情報を返す
 * @param {Room} room
 * @returns {Object}
 */
function getStats(room) {
    const controller = room.controller;
    const storage = cache.getStorage(room) || room.storage;
    const stats = {
        name: room.name,
        rcl: controller ? controller.level : 0,
        energy: room.energyAvailable || 0,
        energyCapacity: room.energyCapacityAvailable || 0,
        controllerProgress: controller ? controller.progress || 0 : 0,
        safeMode: controller ? !!controller.safeMode : false,
        storageEnergy: storage && storage.store ? storage.store[RESOURCE_ENERGY] || 0 : 0,
        creepCounts: Object.create(null),
    };

    const creeps = cache.getMyCreeps(room) || [];
    for (let i = 0; i < creeps.length; i++) {
        const creep = creeps[i];
        if (creep && creep.room && creep.room.name === room.name && creep.memory) {
            const role = creep.memory.role;
            if (role) {
                stats.creepCounts[role] = (stats.creepCounts[role] || 0) + 1;
            }
        }
    }

    return stats;
}

/**
 * 統計情報をコンソールに出力する
 * @param {Room} room
 */
function showStats(room) {
    const stats = getStats(room);
    logger.info(
        `[RoomManager] Room: ${stats.name}, RCL: ${stats.rcl}, Energy: ${stats.energy}/${stats.energyCapacity}`
    );
}

/**
 * ダッシュボードをルームビジュアルに表示する
 * @param {Room} room
 */
function showVisuals(room) {
    if (!room || !room.controller) return;
    room.visual.text(`RCL: ${room.controller.level}`, 25, 2, {
        color: '#ffffff',
        font: 1,
        align: 'center',
    });
}

module.exports = {
    run,
    getStats,
    showStats,
    showVisuals,
    _getNeededExtensionCount,
    _planSourceContainers,
    _planRoads,
};
