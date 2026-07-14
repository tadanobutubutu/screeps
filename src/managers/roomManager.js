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