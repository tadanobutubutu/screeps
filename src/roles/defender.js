/**
 * src/roles/defender.js
 * 防衛クリープ（Defender）の制御モジュール
 *
 * ディフェンダーはルーム内の敵クリープ・敵のパワークリープを攻撃し、
 * 自分のランパートの防衛を補助する。
 * 敵がいない場合はルーム内をパトロールする。
 */

'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const logger = require('../utils/logger');
const { MEMORY_KEYS } = require('../constants');

// ============================================================
// 定数
// ============================================================

/** パトロールポイントのメモリキー */
const PATROL_INDEX_KEY = 'patrolIndex';

/** 近距離攻撃範囲 */
const MELEE_RANGE = 1;

/** 遠距離攻撃範囲 */
const RANGED_RANGE = 3;

/** 安全HP率（これ以下になったら撤退） */
const RETREAT_THRESHOLD = 0.3;

// ============================================================
// メイン制御
// ============================================================

/**
 * ディフェンダークリープのメインロジックを実行する
 * @param {Creep} creep
 */
function run(creep) {
    try {
        const enemies = cache.getEnemies(creep.room);

        if (enemies.length > 0) {
            _attack(creep, enemies);
        } else {
            _patrol(creep);
        }

        // 自己修復（HEALパーツがある場合）
        if (creep.getActiveBodyparts(HEAL) > 0 &&
            creep.hits < creep.hitsMax * 0.9) {
            creep.heal(creep);
        }
    } catch (e) {
        logger.error(`[${creep.name}] ディフェンダーエラー`, e);
    }
}

// ============================================================
// 攻撃ロジック
// ============================================================

/**
 * 最優先の敵を攻撃する
 * @param {Creep} creep
 * @param {Creep[]} enemies
 */
function _attack(creep, enemies) {
    // HPが最も低い敵を優先ターゲットにする
    const target = _selectTarget(creep, enemies);
    if (!target) return;

    const hasRanged = creep.getActiveBodyparts(RANGED_ATTACK) > 0;
    const hasMelee = creep.getActiveBodyparts(ATTACK) > 0;

    const dist = creep.pos.getRangeTo(target);

    if (hasRanged) {
        if (dist <= RANGED_RANGE) {
            creep.rangedAttack(target);
            // 近すぎる場合は距離を取る（kiting）
            if (dist <= 1 && hasMelee) {
                creep.attack(target);
            } else if (dist <= 1) {
                _fleeFrom(creep, target.pos);
                return;
            }
        } else {
            pathfinder.moveTo(creep, target, { range: RANGED_RANGE });
        }
    } else if (hasMelee) {
        if (dist <= MELEE_RANGE) {
            creep.attack(target);
        } else {
            pathfinder.moveTo(creep, target, { range: MELEE_RANGE });
        }
    }

    // 攻撃対象をビジュアル表示
    creep.room.visual.line(creep.pos, target.pos, {
        color: '#ff4444',
        width: 0.15,
        opacity: 0.5,
        lineStyle: 'dashed',
    });
}

/**
 * 攻撃対象を選択する
 * 優先度: HPが低い → 攻撃力が高い → 距離が近い
 * @param {Creep} creep
 * @param {Creep[]} enemies
 * @returns {Creep|null}
 */
function _selectTarget(creep, enemies) {
    if (enemies.length === 0) return null;

    return enemies.reduce((best, enemy) => {
        if (!best) return enemy;

        const bestScore = _calcThreatScore(creep, best);
        const enemyScore = _calcThreatScore(creep, enemy);

        return enemyScore > bestScore ? enemy : best;
    }, null);
}

/**
 * 敵クリープの脅威スコアを計算する（高いほど優先）
 * @param {Creep} attacker
 * @param {Creep} enemy
 * @returns {number}
 */
function _calcThreatScore(attacker, enemy) {
    const hpRatio = 1 - enemy.hits / enemy.hitsMax; // HPが低いほど高スコア
    const distance = attacker.pos.getRangeTo(enemy);
    const distScore = Math.max(0, 10 - distance) / 10;

    const attackParts = enemy.getActiveBodyparts(ATTACK) +
        enemy.getActiveBodyparts(RANGED_ATTACK) * 0.8;
    const threatBonus = attackParts * 0.5;

    return hpRatio * 3 + distScore * 2 + threatBonus;
}

/**
 * 指定位置から逃げる（逆方向に移動）
 * @param {Creep} creep
 * @param {RoomPosition} from
 */
function _fleeFrom(creep, from) {
    const dx = creep.pos.x - from.x;
    const dy = creep.pos.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const targetX = Math.min(48, Math.max(1, Math.round(creep.pos.x + (dx / len) * 3)));
    const targetY = Math.min(48, Math.max(1, Math.round(creep.pos.y + (dy / len) * 3)));

    try {
        const fleePos = new RoomPosition(targetX, targetY, creep.room.name);
        pathfinder.moveTo(creep, fleePos, { range: 0 });
    } catch (e) {
        // 位置が無効な場合は無視
    }
}

// ============================================================
// パトロールロジック
// ============================================================

/**
 * ルーム内をパトロールする
 * @param {Creep} creep
 */
function _patrol(creep) {
    const points = _getPatrolPoints(creep.room);
    if (points.length === 0) return;

    if (creep.memory[PATROL_INDEX_KEY] === undefined) {
        creep.memory[PATROL_INDEX_KEY] = 0;
    }

    const idx = creep.memory[PATROL_INDEX_KEY];
    const target = points[idx % points.length];

    if (creep.pos.getRangeTo(target.x, target.y) <= 2) {
        creep.memory[PATROL_INDEX_KEY] = (idx + 1) % points.length;
    }

    pathfinder.moveTo(
        creep,
        new RoomPosition(target.x, target.y, creep.room.name),
        { range: 1 }
    );
}

/**
 * ルームのパトロールポイントを生成する
 * ランパート・外壁付近を周回するポイントを自動生成する
 * @param {Room} room
 * @returns {Array<{ x: number, y: number }>}
 */
function _getPatrolPoints(room) {
    // ランパートがあればその周囲を巡回
    const ramparts = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_RAMPART },
    });

    if (ramparts.length > 0) {
        // ランパートを等間隔で選択
        const step = Math.max(1, Math.floor(ramparts.length / 6));
        return ramparts
            .filter((_, i) => i % step === 0)
            .map((r) => ({ x: r.pos.x, y: r.pos.y }));
    }

    // ランパートがなければルームの角付近をパトロール
    return [
        { x: 5, y: 5 },
        { x: 44, y: 5 },
        { x: 44, y: 44 },
        { x: 5, y: 44 },
        { x: 25, y: 25 }, // 中央
    ];
}

// ============================================================
// ボディ生成
// ============================================================

/**
 * 利用可能エネルギーに応じた最適なボディを返す
 * @param {number} energy
 * @param {boolean} [ranged=false] - 遠距離攻撃型にするか
 * @returns {string[]}
 */
function getBody(energy, ranged) {
    if (ranged) {
        // 遠距離攻撃型
        if (energy >= 870) {
            return [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, HEAL];
        }
        if (energy >= 420) {
            return [TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE];
        }
        return [RANGED_ATTACK, MOVE];
    }

    // 近距離攻撃型
    if (energy >= 730) {
        return [TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE];
    }
    if (energy >= 390) {
        return [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE];
    }
    if (energy >= 190) {
        return [TOUGH, ATTACK, MOVE, MOVE];
    }
    return [ATTACK, MOVE];
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * ルームへの敵の侵入を検知する
 * @param {Room} room
 * @returns {{ detected: boolean, count: number, strongestHp: number }}
 */
function detectInvasion(room) {
    const enemies = cache.getEnemies(room);
    const hostileCreeps = enemies.filter(
        (e) =>
            e.getActiveBodyparts(ATTACK) > 0 ||
            e.getActiveBodyparts(RANGED_ATTACK) > 0 ||
            e.getActiveBodyparts(CLAIM) > 0
    );

    const strongestHp = hostileCreeps.reduce(
        (max, e) => Math.max(max, e.hitsMax),
        0
    );

    return {
        detected: hostileCreeps.length > 0,
        count: hostileCreeps.length,
        strongestHp,
    };
}

/**
 * セーフモードを発動すべき状況か判定する
 * @param {Room} room
 * @returns {boolean}
 */
function shouldActivateSafeMode(room) {
    if (!room.controller || !room.controller.my) return false;
    if (room.controller.safeMode) return false;
    if (room.controller.safeModeAvailable === 0) return false;

    const invasion = detectInvasion(room);
    if (!invasion.detected) return false;

    // 自室のディフェンダー数
    const defenders = Object.values(Game.creeps).filter(
        (c) =>
            c.room.name === room.name &&
            c.memory.role === 'defender' &&
            c.getActiveBodyparts(ATTACK) + c.getActiveBodyparts(RANGED_ATTACK) > 0
    );

    // 敵が3体以上でディフェンダーが少ない場合はセーフモード発動
    return invasion.count >= 3 && defenders.length < invasion.count;
}

module.exports = {
    run,
    getBody,
    detectInvasion,
    shouldActivateSafeMode,
};
