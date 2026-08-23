/**
 * src/managers/roomManager.js
 * ルーム管理モジュール
 *
 * 自分のルームの状態を管理し、各サブシステムを統合・調整する。
 * - クリープカウントの監視
 * - 建設計画の管理（道路・コンテナ・エクステンションの自動配置）
 * - リンクネットワークの管理
 * - ストレージのエネルギー最適化
 * - 定期的なメモリクリーンアップ
 */

'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const logger = require('../utils/logger');
const {
    ROLES,
    CACHE_TTL,
    MEMORY_CLEANUP_INTERVAL,
    STATS_DISPLAY_INTERVAL,
    SAFE_MODE_TRIGGER_HOSTILES,
} = require('../constants');

// ============================================================
// 定数
// ============================================================

/** 建設自動化を行う間隔（ティック数） */
const BUILD_PLAN_INTERVAL = 500;

/** セーフモードチェック間隔（ティック数） */
const SAFE_MODE_CHECK_INTERVAL = 10;

/** リンクエネルギー転送の閾値 */
const LINK_TRANSFER_THRESHOLD = 0.8;

/** 建設計画1サイクルで配置する最大道路数 */
const MAX_ROADS_PER_CYCLE = 5;

// ============================================================
// メイン制御
// ============================================================

/**
 * ルーム管理のメインロジックを実行する
 * @param {Room} room
 */
function run(room) {
    if (!room.controller || !room.controller.my) return;

    try {
        // 定期タスク
        if (Game.time % MEMORY_CLEANUP_INTERVAL === 0) {
            _cleanupRoomMemory(room);
        }

        if (Game.time % BUILD_PLAN_INTERVAL === 0) {
            _planConstruction(room);
        }

        if (Game.time % SAFE_MODE_CHECK_INTERVAL === 0) {
            _checkSafeMode(room);
        }

        // リンクネットワーク管理（毎ティック）
        _manageLinkNetwork(room);

        // キャッシュクリーンアップ（定期的に）
        if (Game.time % 50 === 0) {
            cache.cleanup();
        }

    } catch (e) {
        logger.error(`[RoomManager] ルーム ${room.name} でエラー`, e);
    }
}

// ============================================================
// メモリクリーンアップ
// ============================================================

/**
 * 死亡したクリープのメモリを削除する
 * @param {Room} room
 */
function _cleanupRoomMemory(room) {
    // 死亡クリープのメモリ削除
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            logger.debug(`[RoomManager] クリープメモリ削除: ${name}`);
            delete Memory.creeps[name];
        }
    }

    // 不要なフラグのクリーンアップ
    for (const flagName in Game.flags) {
        const flag = Game.flags[flagName];
        if (flag.room && flag.room.name !== room.name) continue;

        // 古いパトロールフラグを削除（1000ティック以上）
        if (flagName.startsWith('patrol_') && flag.memory && flag.memory.createdAt) {
            if (Game.time - flag.memory.createdAt > 1000) {
                flag.remove();
            }
        }
    }
}

// ============================================================
// 建設計画
// ============================================================

/**
 * ルームの建設計画を実行する
 * RCLに応じた構造物を自動的に建設サイトとして配置する
 * @param {Room} room
 */
function _planConstruction(room) {
    const rcl = room.controller.level;

    // RCL2以上: ソース周囲にコンテナを配置
    if (rcl >= 2) {
        _planSourceContainers(room);
    }

    // RCL2以上: 主要経路に道路を計画
    if (rcl >= 2) {
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

    for (const source of sources) {
        // すでに近くにコンテナがあれば skip
        const nearby = existingContainers.filter(
            (c) => source.pos.getRangeTo(c) <= 2
        );
        if (nearby.length > 0) continue;

        // コンテナの建設サイトがすでにあれば skip
        const existingSites = room.find(FIND_CONSTRUCTION_SITES, {
            filter: (s) =>
                s.structureType === STRUCTURE_CONTAINER &&
                source.pos.getRangeTo(s) <= 2,
        });
        if (existingSites.length > 0) continue;

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
 * スポーンからソース・コントローラーへの道路を計画する
 * @param {Room} room
 */
function _planRoads(room) {
    const spawns = cache.getSpawns(room);
    if (spawns.length === 0) return;

    const spawn = spawns[0];
    const targets = [
        ...cache.getSources(room),
        room.controller,
    ].filter(Boolean);

    for (const target of targets) {
        const result = pathfinder.findPath(spawn.pos, target);
        if (result.incomplete) continue;

        let planned = 0;
        for (const pos of result.path) {
            // 既存の構造物や建設サイトがない場所にのみ道路を計画
            const structures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
            const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, pos.x, pos.y);

            if (structures.length === 0 && sites.length === 0) {
                const r = room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
                if (r === OK) {
                    planned++;
                    if (planned >= MAX_ROADS_PER_CYCLE) break; // 一度に最大 MAX_ROADS_PER_CYCLE か所まで計画
                }
            }
        }

        if (planned > 0) {
            logger.debug(`[RoomManager] 道路 ${planned} か所を計画`);
            cache.invalidate(`construction_sites_${room.name}`);
        }
    }
}

/**
 * スポーン周囲にエクステンションを配置する計画を立てる
 * @param {Room} room
 */
function _planExtensions(room) {
    const rcl = room.controller.level;
    const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][rcl] || 0;

    if (maxExtensions === 0) return;

    const existing = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION },
    });
    const sites = room.find(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_EXTENSION },
    });

    const currentCount = existing.length + sites.length;
    if (currentCount >= maxExtensions) return;

    const spawns = cache.getSpawns(room);
    if (spawns.length === 0) return;

    const spawn = spawns[0];
    const needed = Math.min(5, maxExtensions - currentCount);
    let placed = 0;

    // スポーン周囲のスパイラルパターンでエクステンションを配置
    for (let radius = 2; radius <= 6 && placed < needed; radius++) {
        for (let dx = -radius; dx <= radius && placed < needed; dx++) {
            for (let dy = -radius; dy <= radius && placed < needed; dy++) {
                if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

                const x = spawn.pos.x + dx;
                const y = spawn.pos.y + dy;
                if (x < 2 || x > 47 || y < 2 || y > 47) continue;

                const terrain = room.getTerrain().get(x, y);
                if (terrain === TERRAIN_MASK_WALL) continue;

                const at = room.lookAt(x, y);
                const blocked = at.some(
                    (item) =>
                        item.type === LOOK_STRUCTURES ||
                        item.type === LOOK_CONSTRUCTION_SITES
                );
                if (blocked) continue;

                const r = room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                if (r === OK) {
                    placed++;
                }
            }
        }
    }

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
    if (!controller || controller.safeMode || controller.safeModeAvailable === 0) return;

    const enemies = cache.getEnemies(room);
    const dangerousEnemies = enemies.filter(
        (e) =>
            e.getActiveBodyparts(ATTACK) > 0 ||
            e.getActiveBodyparts(RANGED_ATTACK) > 0 ||
            e.getActiveBodyparts(WORK) > 0 // WORKでウォール破壊
    );

    if (dangerousEnemies.length >= SAFE_MODE_TRIGGER_HOSTILES) {
        // 自室のディフェンダー数
        const defenders = Object.values(Game.creeps).filter(
            (c) =>
                c.room.name === room.name &&
                (c.getActiveBodyparts(ATTACK) > 0 ||
                    c.getActiveBodyparts(RANGED_ATTACK) > 0)
        );

        if (defenders.length < dangerousEnemies.length) {
            const result = controller.activateSafeMode();
            if (result === OK) {
                logger.warn(`[RoomManager] セーフモード発動: ${room.name} 敵 ${dangerousEnemies.length} 体`);
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
    if (links.length < 2) return;

    const controller = room.controller;
    if (!controller) return;

    // ソースリンク: ソース付近のリンク（エネルギーが溜まる）
    const sourceLinks = links.filter(
        (l) =>
            l.store[RESOURCE_ENERGY] >= l.store.getCapacity(RESOURCE_ENERGY) * LINK_TRANSFER_THRESHOLD &&
            l.cooldown === 0
    );

    // シンクリンク: コントローラー付近またはスポーン付近
    const spawns = cache.getSpawns(room);
    const spawnPos = spawns.length > 0 ? spawns[0].pos : null;

    const sinkLinks = links.filter(
        (l) =>
            l.store[RESOURCE_ENERGY] < l.store.getCapacity(RESOURCE_ENERGY) * 0.5 &&
            (controller.pos.getRangeTo(l) <= 5 ||
                (spawnPos && spawnPos.getRangeTo(l) <= 5))
    );

    if (sourceLinks.length === 0 || sinkLinks.length === 0) return;

    for (const sourceLink of sourceLinks) {
        const sink = pathfinder.closest(sourceLink.pos, sinkLinks);
        if (!sink) continue;

        const result = sourceLink.transferEnergy(sink);
        if (result === OK) {
            logger.debug(
                `[RoomManager] リンク転送: ${sourceLink.pos} → ${sink.pos}`
            );
        }
    }
}

// ============================================================
// ルーム統計
// ============================================================

/**
 * ルームの詳細統計を返す
 * @param {Room} room
 * @returns {Object}
 */
function getStats(room) {
    const creepCounts = {};
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.room.name !== room.name) continue;
        const role = creep.memory.role || 'unknown';
        creepCounts[role] = (creepCounts[role] || 0) + 1;
    }

    const storage = cache.getStorage(room);
    const towers = cache.getMyStructures(room, STRUCTURE_TOWER);
    const enemies = cache.getEnemies(room);

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
        totalCreeps: Object.keys(Game.creeps).filter((n) => Game.creeps[n].room.name === room.name).length,
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
    logger.info(`[Room: ${stats.name}] RCL${stats.rcl} | Energy: ${stats.energy}/${stats.energyCapacity} | Creeps: ${stats.totalCreeps} | Sites: ${stats.constructionSites} | Enemies: ${stats.enemies}`);

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
        room.visual.text(
            `RCL${stats.rcl} (${progress}%)`,
            controller.pos.x,
            controller.pos.y - 1,
            { color: '#00bfff', font: 0.5, align: 'center' }
        );
    }

    // エネルギー情報を左上に表示
    room.visual.text(
        `⚡ ${stats.energy}/${stats.energyCapacity}`,
        2, 2,
        { color: '#ffaa00', font: 0.6, align: 'left' }
    );
    room.visual.text(
        `👥 ${stats.totalCreeps}体`,
        2, 3,
        { color: '#ffffff', font: 0.6, align: 'left' }
    );
    if (stats.enemies > 0) {
        room.visual.text(
            `⚠️ 敵${stats.enemies}体`,
            2, 4,
            { color: '#ff4444', font: 0.6, align: 'left' }
        );
    }
}

module.exports = {
    run,
    getStats,
    showStats,
    showVisuals,
};
