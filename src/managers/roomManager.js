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

    // コンテナ建設サイトを一度だけまとめて取得
    const allSites = cache.getConstructionSites(room);
    const containerSites = [];
    for (let i = 0; i < allSites.length; i++) {
        const site = allSites[i];
        if (site.structureType === STRUCTURE_CONTAINER) {
            containerSites.push(site);
        }
    }

    for (const source of sources) {
        // 既に近くにコンテナがあるか確認
        let hasNearbyContainer = false;
        for (let i = 0; i < existingContainers.length; i++) {
            const container = existingContainers[i];
            if (source.pos.getRangeTo(container) <= 2) {
                hasNearbyContainer = true;
                break;
            }
        }
        if (hasNearbyContainer) continue;

        for (let i = 0; i < containerSites.length; i++) {
            const site = containerSites[i];
            if (source.pos.getRangeTo(site) <= 2) {
                hasNearbyContainer = true;
                break;
            }
        }
        if (hasNearbyContainer) continue;

        // 配置可能なタイルを見つけて建設サイトを作成
        const spot = pathfinder.findNearestOpenTile(room, source.pos);
        if (spot) {
            room.createConstructionSite(spot.x, spot.y, STRUCTURE_CONTAINER);
        }
    }
}