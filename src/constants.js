/**
 * src/constants.js
 * Screeps AI 定数定義モジュール
 * ゲーム全体で使用する定数・設定値を一元管理する
 */

'use strict';

// Screeps Global Constants (Testing environment fallback)
if (typeof MOVE === 'undefined') global.MOVE = 'move';
if (typeof WORK === 'undefined') global.WORK = 'work';
if (typeof CARRY === 'undefined') global.CARRY = 'carry';
if (typeof ATTACK === 'undefined') global.ATTACK = 'attack';
if (typeof RANGED_ATTACK === 'undefined') global.RANGED_ATTACK = 'ranged_attack';
if (typeof HEAL === 'undefined') global.HEAL = 'heal';
if (typeof CLAIM === 'undefined') global.CLAIM = 'claim';
if (typeof TOUGH === 'undefined') global.TOUGH = 'tough';
if (typeof STRUCTURE_ROAD === 'undefined') global.STRUCTURE_ROAD = 'road';
if (typeof STRUCTURE_CONTAINER === 'undefined') global.STRUCTURE_CONTAINER = 'container';
if (typeof STRUCTURE_RAMPART === 'undefined') global.STRUCTURE_RAMPART = 'rampart';
if (typeof STRUCTURE_WALL === 'undefined') global.STRUCTURE_WALL = 'constructedWall';
if (typeof STRUCTURE_SPAWN === 'undefined') global.STRUCTURE_SPAWN = 'spawn';
if (typeof STRUCTURE_EXTENSION === 'undefined') global.STRUCTURE_EXTENSION = 'extension';
if (typeof STRUCTURE_TOWER === 'undefined') global.STRUCTURE_TOWER = 'tower';
if (typeof STRUCTURE_STORAGE === 'undefined') global.STRUCTURE_STORAGE = 'storage';
if (typeof STRUCTURE_LINK === 'undefined') global.STRUCTURE_LINK = 'link';
if (typeof STRUCTURE_LAB === 'undefined') global.STRUCTURE_LAB = 'lab';


// ============================================================
// クリープロール定数
// ============================================================

/** クリープロール識別子 */
const ROLES = {
    HARVESTER: 'harvester',
    UPGRADER: 'upgrader',
    BUILDER: 'builder',
    REPAIRER: 'repairer',
    DEFENDER: 'defender',
    MINER: 'miner',
    TRANSPORTER: 'transporter',
    SCOUT: 'scout',
    CLAIMER: 'claimer',
    REMOTE_HARVESTER: 'remoteHarvester',
};

// ============================================================
// ボディパーツコスト（Screeps公式値）
// ============================================================

/** 各ボディパーツのエネルギーコスト */
// Security: Use Object.create(null) to avoid prototype pollution issues
const BODY_COSTS = Object.assign(Object.create(null), {
    [MOVE]: 50,
    [WORK]: 100,
    [CARRY]: 50,
    [ATTACK]: 80,
    [RANGED_ATTACK]: 150,
    [HEAL]: 250,
    [CLAIM]: 600,
    [TOUGH]: 10,
});

// ============================================================
// ボディ構成プリセット
// ============================================================

/** ロール別ボディ構成（コスト昇順）*/
const BODY_PRESETS = {
    [ROLES.HARVESTER]: [
        { body: [WORK, CARRY, MOVE], cost: 200 },
        { body: [WORK, WORK, CARRY, MOVE], cost: 300 },
        { body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], cost: 500 },
        { body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], cost: 750 },
    ],
    [ROLES.UPGRADER]: [
        { body: [WORK, CARRY, MOVE], cost: 200 },
        { body: [WORK, WORK, CARRY, MOVE], cost: 350 },
        { body: [WORK, WORK, WORK, CARRY, MOVE, MOVE], cost: 550 },
        { body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], cost: 800 },
    ],
    [ROLES.BUILDER]: [
        { body: [WORK, CARRY, MOVE], cost: 200 },
        { body: [WORK, CARRY, CARRY, MOVE, MOVE], cost: 350 },
        { body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], cost: 500 },
    ],
    [ROLES.REPAIRER]: [
        { body: [WORK, CARRY, MOVE], cost: 200 },
        { body: [WORK, CARRY, CARRY, MOVE], cost: 300 },
    ],
    [ROLES.DEFENDER]: [
        { body: [TOUGH, ATTACK, MOVE], cost: 140 },
        { body: [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE], cost: 280 },
        { body: [TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], cost: 420 },
        { body: [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], cost: 420 },
    ],
    [ROLES.MINER]: [
        { body: [WORK, WORK, MOVE], cost: 250 },
        { body: [WORK, WORK, WORK, MOVE], cost: 350 },
        { body: [WORK, WORK, WORK, WORK, WORK, MOVE], cost: 550 },
    ],
    [ROLES.TRANSPORTER]: [
        { body: [CARRY, CARRY, MOVE, MOVE], cost: 200 },
        { body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], cost: 400 },
        { body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], cost: 600 },
    ],
    [ROLES.SCOUT]: [
        { body: [MOVE], cost: 50 },
    ],
    [ROLES.CLAIMER]: [
        { body: [CLAIM, MOVE], cost: 650 },
    ],
    [ROLES.REMOTE_HARVESTER]: [
        { body: [WORK, CARRY, MOVE, MOVE], cost: 250 },
        { body: [WORK, WORK, CARRY, MOVE, MOVE], cost: 400 },
        { body: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], cost: 600 },
    ],
};

// ============================================================
// スポーン優先度
// ============================================================

/** ロールごとのスポーン優先度（低い数値 = 高優先度）*/
// Security: Use Object.create(null) to avoid prototype pollution issues
const SPAWN_PRIORITY = Object.assign(Object.create(null), {
    [ROLES.HARVESTER]: 1,
    [ROLES.UPGRADER]: 2,
    [ROLES.BUILDER]: 3,
    [ROLES.REPAIRER]: 4,
    [ROLES.TRANSPORTER]: 5,
    [ROLES.MINER]: 6,
    [ROLES.DEFENDER]: 7,
    [ROLES.SCOUT]: 8,
    [ROLES.CLAIMER]: 9,
    [ROLES.REMOTE_HARVESTER]: 10,
});

// ============================================================
// RCL別ターゲットクリープ数
// ============================================================

/**
 * RCL（Room Controller Level）に応じた各ロールのターゲット数
 * キーはRCLレベル（1〜8）
 */
const TARGET_CREEPS_BY_RCL = {
    1: {
        [ROLES.HARVESTER]: 2,
        [ROLES.UPGRADER]: 1,
        [ROLES.BUILDER]: 0,
        [ROLES.REPAIRER]: 0,
        [ROLES.MINER]: 0,
        [ROLES.TRANSPORTER]: 0,
        [ROLES.DEFENDER]: 0,
    },
    2: {
        [ROLES.HARVESTER]: 2,
        [ROLES.UPGRADER]: 2,
        [ROLES.BUILDER]: 1,
        [ROLES.REPAIRER]: 1,
        [ROLES.MINER]: 0,
        [ROLES.TRANSPORTER]: 0,
        [ROLES.DEFENDER]: 1,
    },
    3: {
        [ROLES.HARVESTER]: 2,
        [ROLES.UPGRADER]: 2,
        [ROLES.BUILDER]: 2,
        [ROLES.REPAIRER]: 1,
        [ROLES.MINER]: 2,
        [ROLES.TRANSPORTER]: 1,
        [ROLES.DEFENDER]: 1,
    },
    4: {
        [ROLES.HARVESTER]: 1,
        [ROLES.UPGRADER]: 3,
        [ROLES.BUILDER]: 2,
        [ROLES.REPAIRER]: 1,
        [ROLES.MINER]: 2,
        [ROLES.TRANSPORTER]: 2,
        [ROLES.DEFENDER]: 2,
    },
    5: {
        [ROLES.HARVESTER]: 1,
        [ROLES.UPGRADER]: 3,
        [ROLES.BUILDER]: 2,
        [ROLES.REPAIRER]: 1,
        [ROLES.MINER]: 2,
        [ROLES.TRANSPORTER]: 2,
        [ROLES.DEFENDER]: 2,
    },
    6: {
        [ROLES.HARVESTER]: 1,
        [ROLES.UPGRADER]: 2,
        [ROLES.BUILDER]: 2,
        [ROLES.REPAIRER]: 1,
        [ROLES.MINER]: 2,
        [ROLES.TRANSPORTER]: 3,
        [ROLES.DEFENDER]: 2,
    },
    7: {
        [ROLES.HARVESTER]: 1,
        [ROLES.UPGRADER]: 2,
        [ROLES.BUILDER]: 2,
        [ROLES.REPAIRER]: 1,
        [ROLES.MINER]: 2,
        [ROLES.TRANSPORTER]: 3,
        [ROLES.DEFENDER]: 3,
    },
    8: {
        [ROLES.HARVESTER]: 1,
        [ROLES.UPGRADER]: 1,
        [ROLES.BUILDER]: 1,
        [ROLES.REPAIRER]: 1,
        [ROLES.MINER]: 2,
        [ROLES.TRANSPORTER]: 3,
        [ROLES.DEFENDER]: 3,
    },
};

// ============================================================
// メモリキー
// ============================================================

/** Memory オブジェクト内のキー名 */
const MEMORY_KEYS = {
    ROLE: 'role',
    SOURCE_ID: 'sourceId',
    TARGET_ID: 'targetId',
    HOME_ROOM: 'homeRoom',
    WORKING: 'working',
    PATH: 'path',
    PATH_EXPIRY: 'pathExpiry',
    LAST_ACTIVE: 'lastActive',
    TASK: 'task',
    TASK_DATA: 'taskData',
};

// ============================================================
// キャッシュTTL（単位: ティック）
// ============================================================

/** 各種キャッシュの有効期限（ティック数） */
const CACHE_TTL = {
    SOURCES: 100,
    STRUCTURES: 50,
    ENEMIES: 5,
    CONSTRUCTION_SITES: 20,
    DROPPED_RESOURCES: 3,
    ROOM_OBJECTS: 30,
    PATH: 20,
    SPAWN_QUEUE: 10,
};

// ============================================================
// 修復関連定数
// ============================================================

/** 修復対象となるHP率の閾値 */
// Security: Use Object.create(null) to avoid prototype pollution issues.
// Fix: Use computed property names with Screeps constants for correct lookups.
const REPAIR_THRESHOLD = Object.assign(Object.create(null), {
    [STRUCTURE_ROAD]: 0.5,
    [STRUCTURE_CONTAINER]: 0.5,
    [STRUCTURE_WALL]: 0.0001,
    [STRUCTURE_RAMPART]: 0.001,
    OTHER: 0.75,
});

/** ウォール・ランパートの最大HP目標値（RCL別） */
const WALL_HP_TARGET = {
    1: 1000,
    2: 5000,
    3: 20000,
    4: 100000,
    5: 500000,
    6: 1000000,
    7: 5000000,
    8: 10000000,
};

// ============================================================
// タワー関連定数
// ============================================================

/** タワーが優先的に攻撃するHP閾値（低いほど優先） */
const TOWER_ATTACK_PRIORITY_HP = 200;

/** タワーが修復を開始するHP率 */
const TOWER_REPAIR_THRESHOLD = 0.8;

/** タワーが修復を停止するHP率 */
const TOWER_REPAIR_STOP_THRESHOLD = 0.95;

/** タワーが癒しを行うHP率 */
const TOWER_HEAL_THRESHOLD = 0.9;

/** タワーのエネルギー補充優先度（この割合以下になったら補充優先） */
const TOWER_ENERGY_PRIORITY = 0.5;

// ============================================================
// エネルギー閾値
// ============================================================

/** コンテナ・ストレージからエネルギーを引き出す閾値 */
const ENERGY_WITHDRAW_THRESHOLD = {
    CONTAINER: 100,
    STORAGE: 10000,
    LINK: 200,
};

// ============================================================
// パスファインダー設定
// ============================================================

/** PathFinder オプションのデフォルト値 */
const PATHFINDER_DEFAULTS = {
    /** ルート再計算の間隔（ティック数） */
    REUSE_PATH: 20,
    /** 道路をコスト1で通過（平地コスト2の半分） */
    PLAIN_COST: 2,
    SWAMP_COST: 10,
    ROAD_COST: 1,
    /** 最大検索距離 */
    MAX_ROOMS: 1,
    /** 近傍タイル検索の最大範囲 */
    MAX_SEARCH_RANGE: 10,
};

// ============================================================
// ログレベル
// ============================================================

/** ログ出力レベル */
const LOG_LEVEL = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
};

/** デフォルトログレベル */
const DEFAULT_LOG_LEVEL = LOG_LEVEL.INFO;

// ============================================================
// ゲームプレイ設定
// ============================================================

/** 緊急モード移行CPU閾値（この値を超えたら非必須処理を停止） */
const CPU_EMERGENCY_THRESHOLD = 0.9;

/** 通常動作CPU閾値 */
const CPU_NORMAL_THRESHOLD = 0.7;

/** メモリクリーンアップ実行間隔（ティック数） */
const MEMORY_CLEANUP_INTERVAL = 100;

/** 統計情報表示間隔（ティック数） */
const STATS_DISPLAY_INTERVAL = 100;

/** セーフモードの発動条件（侵入者数） */
const SAFE_MODE_TRIGGER_HOSTILES = 3;

/** ルームの有効座標範囲（壁を除く） */
const ROOM_BOUNDS = {
    MIN: 1,
    MAX: 48,
};

module.exports = {
    ROLES,
    BODY_COSTS,
    BODY_PRESETS,
    SPAWN_PRIORITY,
    TARGET_CREEPS_BY_RCL,
    MEMORY_KEYS,
    CACHE_TTL,
    REPAIR_THRESHOLD,
    WALL_HP_TARGET,
    TOWER_ATTACK_PRIORITY_HP,
    TOWER_REPAIR_THRESHOLD,
    TOWER_REPAIR_STOP_THRESHOLD,
    TOWER_HEAL_THRESHOLD,
    TOWER_ENERGY_PRIORITY,
    ENERGY_WITHDRAW_THRESHOLD,
    PATHFINDER_DEFAULTS,
    LOG_LEVEL,
    DEFAULT_LOG_LEVEL,
    CPU_EMERGENCY_THRESHOLD,
    CPU_NORMAL_THRESHOLD,
    MEMORY_CLEANUP_INTERVAL,
    STATS_DISPLAY_INTERVAL,
    SAFE_MODE_TRIGGER_HOSTILES,
    ROOM_BOUNDS,
};
