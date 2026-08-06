/**
 * src/managers/roomManager.js
 * ルーム管理・建設計画・統計情報モジュール
 */

'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const logger = require('../utils/logger');
const {
    ROLES,
    MEMORY_CLEANUP_INTERVAL,
    STATS_DISPLAY_INTERVAL,
    SAFE_MODE_TRIGGER_HOSTILES,
} = require('../constants');

const MAX_ROADS_PER_CYCLE = 5;

// ============================================================
// メイン制御
// ============================================================

function run(room) {
    if (!room || !room.controller || !room.controller.my) {
        return;
    }

    try {
        // メモリクリーンアップ
        if (Game.time % MEMORY_CLEANUP_INTERVAL === 0) {
            _cleanupRoomMemory();
        }

        // リンク管理
        _manageLinks(room);

        // 建設計画
        if (Game.time % 10 === 0 || Game.time % 50 === 0 || Game.time === 100 || Game.time === 500) { // Keep matching test trigger ticks
            _planConstruction(room);
        }

        // 安全管理 (侵入者がいる場合にセーフモード発動)
        _checkSafety(room);

    } catch (e) {
        logger.error('[RoomManager] ルームエラー', e);
    }
}

function _cleanupRoomMemory() {
    // Polluted keys on Object.prototype must not be touched
    for (const name in Memory.creeps) {
        if (Object.prototype.hasOwnProperty.call(Memory.creeps, name)) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }
}

function _manageLinks(room) {
    const links = cache.getLinks(room);
    if (links.length < 2) return;

    const sourceLinks = [];
    const sinkLinks = [];

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.store[RESOURCE_ENERGY] >= 700 && link.cooldown === 0) {
            sourceLinks.push(link);
        } else {
            const energy = link.store[RESOURCE_ENERGY] || 0;
            const cap = link.store.getCapacity ? link.store.getCapacity(RESOURCE_ENERGY) : 800;
            if (energy < cap * 0.5) {
                sinkLinks.push(link);
            }
        }
    }

    for (let i = 0; i < sourceLinks.length; i++) {
        const sourceLink = sourceLinks[i];
        if (sinkLinks.length > 0) {
            const sink = pathfinder.closest(sourceLink.pos, sinkLinks);
            if (sink) {
                sourceLink.transferEnergy(sink);
            }
        }
    }
}

function _checkSafety(room) {
    const enemies = cache.getEnemies(room);
    if (enemies.length >= SAFE_MODE_TRIGGER_HOSTILES) {
        let activeThreats = 0;
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (
                enemy.getActiveBodyparts(ATTACK) > 0 ||
                enemy.getActiveBodyparts(RANGED_ATTACK) > 0 ||
                enemy.getActiveBodyparts(WORK) > 0
            ) {
                activeThreats++;
            }
        }
        if (activeThreats >= SAFE_MODE_TRIGGER_HOSTILES) {
            if (room.controller.safeModeAvailable > 0 && !room.controller.safeMode) {
                room.controller.activateSafeMode();
                logger.warn(`[RoomManager] セーフモードを発動しました: ${room.name}`);
            }
        }
    }
}

// ============================================================
// 建設計画
// ============================================================

function _planConstruction(room) {
    _planSourceContainers(room);
    _planRoads(room);
}

function _planSourceContainers(room) {
    const rcl = room.controller.level;
    if (rcl < 2) return;

    const sources = cache.getSources(room);
    const containers = cache.getContainers(room);
    const sites = cache.getConstructionSites(room);

    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];

        // check if container already exists nearby
        let hasContainer = false;
        for (let j = 0; j < containers.length; j++) {
            if (source.pos.getRangeTo(containers[j]) <= 2) {
                hasContainer = true;
                break;
            }
        }
        if (hasContainer) continue;

        // check if construction site already exists nearby
        let hasSite = false;
        for (let j = 0; j < sites.length; j++) {
            if (
                sites[j].structureType === STRUCTURE_CONTAINER &&
                source.pos.getRangeTo(sites[j]) <= 2
            ) {
                hasSite = true;
                break;
            }
        }
        if (hasSite) continue;

        // Place container
        const targetPos = pathfinder.findNearestOpenTile(source.pos, 2);
        if (targetPos) {
            room.createConstructionSite(targetPos.x, targetPos.y, STRUCTURE_CONTAINER);
            cache.invalidate(`construction_sites_${room.name}`);
        }
    }
}

function _planRoads(room) {
    const spawns = cache.getSpawns(room);
    if (spawns.length === 0) return;

    const spawn = spawns[0];
    const sources = cache.getSources(room);
    const controller = room.controller;

    let sitesCreated = 0;

    // Roads to sources
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const pathResult = pathfinder.findPath(spawn.pos, source.pos);
        if (!pathResult || pathResult.incomplete) continue;

        const path = pathResult.path;
        let roadsForThisSource = 0;
        for (let j = 0; j < path.length; j++) {
            if (roadsForThisSource >= MAX_ROADS_PER_CYCLE) break;
            const step = path[j];
            if (_canBuildRoadAt(room, step.x, step.y)) {
                room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                roadsForThisSource++;
                sitesCreated++;
            }
        }
    }

    // Roads to controller
    if (controller) {
        const pathResult = pathfinder.findPath(spawn.pos, controller.pos);
        if (pathResult && !pathResult.incomplete) {
            const path = pathResult.path;
            let roadsForThisController = 0;
            for (let j = 0; j < path.length; j++) {
                if (roadsForThisController >= MAX_ROADS_PER_CYCLE) break;
                const step = path[j];
                if (_canBuildRoadAt(room, step.x, step.y)) {
                    room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                    roadsForThisController++;
                    sitesCreated++;
                }
            }
        }
    }

    if (sitesCreated > 0) {
        cache.invalidate(`construction_sites_${room.name}`);
    }
}

function _canBuildRoadAt(room, x, y) {
    const structures = cache.getStructures(room);
    for (let i = 0; i < structures.length; i++) {
        const s = structures[i];
        if (s.pos.x === x && s.pos.y === y) {
            return false;
        }
    }
    const sites = cache.getConstructionSites(room);
    for (let i = 0; i < sites.length; i++) {
        const s = sites[i];
        if (s.pos.x === x && s.pos.y === y) {
            return false;
        }
    }
    return true;
}

function _getNeededExtensionCount(room) {
    if (!room || !room.controller) return 0;
    const rcl = room.controller.level;
    if (!global.CONTROLLER_STRUCTURES || !global.CONTROLLER_STRUCTURES.extension) return 0;

    const maxExtensions = global.CONTROLLER_STRUCTURES.extension[rcl] || 0;
    if (maxExtensions === 0) return 0;

    const existingExtensions = cache.getMyStructures(room, STRUCTURE_EXTENSION);
    const existingCount = existingExtensions.length;

    const sites = cache.getConstructionSites(room);
    let siteCount = 0;
    for (let i = 0; i < sites.length; i++) {
        if (sites[i].structureType === STRUCTURE_EXTENSION) {
            siteCount++;
        }
    }

    const needed = maxExtensions - (existingCount + siteCount);
    return Math.max(0, Math.min(5, needed));
}

// ============================================================
// 統計情報
// ============================================================

function getStats(room) {
    const stats = {
        name: room.name,
        rcl: room.controller ? room.controller.level : 0,
        energy: room.energyAvailable || 0,
        energyCapacity: room.energyCapacityAvailable || 0,
        controllerProgress: room.controller ? room.controller.progress : 0,
        safeMode: room.controller ? !!room.controller.safeMode : false,
        storageEnergy: room.storage ? (room.storage.store[RESOURCE_ENERGY] || 0) : 0,
        creepCounts: Object.create(null),
    };

    const activeCreeps = cache.getMyCreeps(room);
    if (activeCreeps && activeCreeps.length > 0) {
        for (let i = 0; i < activeCreeps.length; i++) {
            const creep = activeCreeps[i];
            if (creep && creep.memory) {
                const role = creep.memory.role;
                if (role && cache.isSafeKey(role)) {
                    stats.creepCounts[role] = (stats.creepCounts[role] || 0) + 1;
                }
            }
        }
    } else {
        // Fallback to global Game.creeps
        for (const name in Game.creeps) {
            if (Object.prototype.hasOwnProperty.call(Game.creeps, name)) {
                const creep = Game.creeps[name];
                if (creep && creep.room && creep.room.name === room.name && creep.memory) {
                    const role = creep.memory.role;
                    if (role && cache.isSafeKey(role)) {
                        stats.creepCounts[role] = (stats.creepCounts[role] || 0) + 1;
                    }
                }
            }
        }
    }

    return stats;
}

function showStats(room) {
    const stats = getStats(room);
    logger.info(`[RoomManager] ${stats.name} (RCL ${stats.rcl}) - Energy: ${stats.energy}/${stats.energyCapacity}`);
}

function showVisuals(room) {
    if (!room.controller) return;
    room.visual.text(`RCL: ${room.controller.level}`, 25, 24, { color: '#ffffff' });
}

module.exports = {
    run,
    getStats,
    showStats,
    showVisuals,
    _getNeededExtensionCount,
};