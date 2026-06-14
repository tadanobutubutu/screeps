/**
 * Visual Effects System - Z世代向けドーパミン爆発ビジュアル
 */

const adaptiveSystem = require('system.adaptive');

// ⚡ PERFORMANCE: Per-tick cache for visual effects enablement
let _isVfxEnabledTick = -1;
let _isVfxEnabledValue = true;

// ⚡ PERFORMANCE: Per-tick cache for RoomVisual objects
let _visualsCache = {};
let _visualsTick = -1;

// ⚡ PERFORMANCE: Volatile cache for rainbow trail positions to avoid Memory serialization overhead.
// Using a Map for O(1) lookups by creep ID.
let _trailCache = new Map();

/**
 * Checks if visual effects are enabled, with per-tick caching.
 */
function isVfxEnabled() {
    if (typeof Game !== 'undefined' && Game.time !== _isVfxEnabledTick) {
        _isVfxEnabledTick = Game.time;
        _isVfxEnabledValue = adaptiveSystem.isEnabled('visualEffects');
    }
    return _isVfxEnabledValue;
}

/**
 * Gets a RoomVisual object for the specified room, using a per-tick cache
 * to avoid redundant object allocations.
 */
function getVisual(roomName) {
    if (typeof Game !== 'undefined' && Game.time !== _visualsTick) {
        _visualsTick = Game.time;
        _visualsCache = {};
    }

    if (!_visualsCache[roomName]) {
        _visualsCache[roomName] = new RoomVisual(roomName);
    }

    return _visualsCache[roomName];
}

// ⚡ PERFORMANCE: Hoisted constants to avoid per-call allocation
const SUCCESS_COLORS = ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#00FFFF'];
const RAINBOW_COLORS = [
    '#FF0000',
    '#FF7F00',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#4B0082',
    '#9400D3',
];
const STAR_EMOJIS = ['⭐', '✨', '🌟', '💫'];
const RANK_BADGE_CONFIG = {
    Newbie: { icon: '🌱', color: '#90EE90' },
    Beginner: { icon: '🔰', color: '#87CEEB' },
    Intermediate: { icon: '⚡', color: '#FFD700' },
    Advanced: { icon: '🌟', color: '#FF69B4' },
    Expert: { icon: '💎', color: '#00CED1' },
    Master: { icon: '👑', color: '#FFD700' },
};

// ⚡ PERFORMANCE: Hoisted constant visual styles to reduce per-tick object allocation.
const STYLE_PARTICLE_DEFAULT = { opacity: 0.8 };
const STYLE_SUCCESS_RING = { fill: 'transparent', strokeWidth: 0.1 };
const STYLE_SUCCESS_LINE = { width: 0.15, opacity: 0.8 };
const STYLE_SUCCESS_STAR = { color: '#FFD700', font: 1.5 };
const STYLE_LEVEL_UP_RING = { fill: 'transparent', strokeWidth: 0.15, opacity: 0.7 };
const STYLE_LEVEL_UP_TEXT_1 = { color: '#FFD700', font: 1.2, stroke: '#000000', strokeWidth: 0.1 };
const STYLE_LEVEL_UP_TEXT_2 = { color: '#00FF00', font: 2, stroke: '#000000', strokeWidth: 0.15 };
const STYLE_COMBO_TEXT = { stroke: '#000000', strokeWidth: 0.1 };
const STYLE_ACHIEVEMENT_BG = { fill: '#000000', opacity: 0.8, stroke: '#FFD700', strokeWidth: 0.1 };
const STYLE_ACHIEVEMENT_TITLE = { color: '#FFD700', font: 0.8, align: 'left' };
const STYLE_ACHIEVEMENT_SUB = { color: '#FFFFFF', font: 0.5, align: 'left' };
const STYLE_PROGRESS_BG_OUTER = { fill: '#000000', opacity: 0.5, stroke: 'transparent' };
const STYLE_PROGRESS_BG_INNER = { fill: '#333333', stroke: '#FFFFFF', strokeWidth: 0.05 };
const STYLE_PROGRESS_BAR_OPACITY = { opacity: 0.8 };
const STYLE_PROGRESS_TEXT = { color: '#FFFFFF', font: 0.45, stroke: '#000000', strokeWidth: 0.05 };
const STYLE_TRAIL_CIRCLE = { radius: 0.2 };
const STYLE_DAMAGE_TEXT = { stroke: '#000000', strokeWidth: 0.1 };
const STYLE_STREAK_TEXT = { font: 1.2, stroke: '#000000', strokeWidth: 0.1 };
const STYLE_SCORE_TEXT = { color: '#FFD700', font: 1, stroke: '#000000', strokeWidth: 0.1 };
const STYLE_SCORE_LABEL = { color: '#FFFFFF', font: 0.6 };
const STYLE_RANK_TEXT = { font: 0.7, stroke: '#000000', strokeWidth: 0.05 };

const visualEffects = {
    /**
     * 派手なパーティクルエフェクト
     */
    particles: function (pos, color = '#FFD700', count = 20) {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const distance = 0.5 + Math.random() * 0.5;
            const x = pos.x + Math.cos(angle) * distance;
            const y = pos.y + Math.sin(angle) * distance;

            visual.circle(x, y, {
                radius: 0.1 + Math.random() * 0.2,
                fill: color,
                ...STYLE_PARTICLE_DEFAULT,
            });
        }
    },

    /**
     * 成功時の爆発エフェクト
     */
    successExplosion: function (pos) {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        // 外側の輪
        for (let ring = 1; ring <= 3; ring++) {
            visual.circle(pos.x, pos.y, {
                radius: ring * 0.5,
                stroke: SUCCESS_COLORS[ring % SUCCESS_COLORS.length],
                opacity: 1 - ring * 0.2,
                ...STYLE_SUCCESS_RING,
            });
        }

        // スターバースト
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const endX = pos.x + Math.cos(angle) * 1.5;
            const endY = pos.y + Math.sin(angle) * 1.5;

            visual.line(pos.x, pos.y, endX, endY, {
                color: SUCCESS_COLORS[i % SUCCESS_COLORS.length],
                ...STYLE_SUCCESS_LINE,
            });
        }

        // 中心の星
        visual.text('⭐', pos.x, pos.y, STYLE_SUCCESS_STAR);
    },

    /**
     * レベルアップエフェクト
     */
    levelUp: function (pos, level) {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        // 虹色の輪
        for (let i = 0; i < RAINBOW_COLORS.length; i++) {
            visual.circle(pos.x, pos.y, {
                radius: 2 + i * 0.2,
                stroke: RAINBOW_COLORS[i],
                ...STYLE_LEVEL_UP_RING,
            });
        }

        // LEVEL UP!
        visual.text('LEVEL UP!', pos.x, pos.y - 1.5, STYLE_LEVEL_UP_TEXT_1);

        visual.text(`Lv.${level}`, pos.x, pos.y + 1.5, STYLE_LEVEL_UP_TEXT_2);
    },

    /**
     * コンボカウンター
     */
    combo: function (pos, count) {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        let color;
        if (count >= 10) {
            color = '#FF0000';
        } else if (count >= 5) {
            color = '#FF69B4';
        } else {
            color = '#FFD700';
        }

        visual.text(`${count}x COMBO!`, pos.x, pos.y, {
            color: color,
            font: 1 + count * 0.05,
            ...STYLE_COMBO_TEXT,
        });

        // 炎エフェクト
        if (count >= 5) {
            visual.text('🔥', pos.x - 2, pos.y, { font: 1 });
            visual.text('🔥', pos.x + 2, pos.y, { font: 1 });
        }
    },

    /**
     * 達成通知
     */
    achievement: function (pos, title, icon = '🏆') {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        // 背景ボックス
        visual.rect(pos.x - 3, pos.y - 1, 6, 2, STYLE_ACHIEVEMENT_BG);

        // アイコン
        visual.text(icon, pos.x - 2, pos.y, STYLE_SUCCESS_STAR);

        // タイトル
        visual.text(title, pos.x + 0.5, pos.y - 0.3, STYLE_ACHIEVEMENT_TITLE);

        visual.text('Achievement Unlocked!', pos.x + 0.5, pos.y + 0.5, STYLE_ACHIEVEMENT_SUB);
    },

    /**
     * プログレスバー
     */
    progressBar: function (pos, current, max, label = '') {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);
        const width = 3;
        const height = 0.3;
        const progress = max > 0 ? Math.min(current / max, 1) : 0;
        const percent = Math.floor(progress * 100);

        // 全体の背景（視認性向上）
        visual.rect(
            pos.x - width / 2 - 0.1,
            pos.y - 1.0,
            width + 0.2,
            1.4,
            STYLE_PROGRESS_BG_OUTER
        );

        // 背景
        visual.rect(pos.x - width / 2, pos.y - height / 2, width, height, STYLE_PROGRESS_BG_INNER);

        // プログレス
        let color;
        if (progress >= 1.0) {
            color = '#FFD700'; // Gold (Completed)
        } else if (progress >= 0.8) {
            color = '#00FF00'; // Green (Near Completion)
        } else if (progress >= 0.5) {
            color = '#FFFF00'; // Yellow (Midway)
        } else {
            color = '#FF0000'; // Red (Just Started)
        }

        visual.rect(pos.x - width / 2, pos.y - height / 2, width * progress, height, {
            fill: color,
            ...STYLE_PROGRESS_BAR_OPACITY,
        });

        // テキスト
        visual.text(`${label} ${percent}%`, pos.x, pos.y - 0.65, STYLE_PROGRESS_TEXT);
    },

    /**
     * レインボートレイル
     */
    rainbowTrail: function (creep) {
        // ⚡ PERFORMANCE: Periodic cleanup of the volatile trail cache (every 1500 ticks)
        // This prevents memory leaks from creeps that have died.
        if (Game.time % 1500 === 0 && _trailCache.size > 0) {
            _trailCache.clear();
        }

        if (!isVfxEnabled()) {
            if (creep.memory.trailPositions) {
                delete creep.memory.trailPositions;
            }
            _trailCache.delete(creep.id);
            return;
        }

        // ⚡ PERFORMANCE: Migrate from Memory to volatile cache if existing data is found.
        if (creep.memory.trailPositions) {
            _trailCache.set(creep.id, creep.memory.trailPositions);
            delete creep.memory.trailPositions;
        }

        let positions = _trailCache.get(creep.id);
        if (positions === undefined || positions === null) {
            positions = [];
            _trailCache.set(creep.id, positions);
        }

        // ⚡ PERFORMANCE: Only update the trail if the creep has actually moved or if we need to drain the trail.
        // This avoids redundant pushes and allows the trail to catch up to stationary creeps.
        const lastPos = positions.length > 0 ? positions[positions.length - 1] : null;
        const hasMoved = !lastPos || lastPos.x !== creep.pos.x || lastPos.y !== creep.pos.y;

        if (hasMoved) {
            positions.push({ x: creep.pos.x, y: creep.pos.y });
            if (positions.length > 10) {
                positions.shift();
            }
        } else if (positions.length > 0) {
            // Stationary: Drain the trail to avoid static visuals and reduce redundant loop iterations.
            positions.shift();
        }

        // ⚡ PERFORMANCE: Skip drawing loop entirely if no positions remain.
        if (positions.length === 0) {
            return;
        }

        const visual = getVisual(creep.room.name);
        for (let i = 0; i < positions.length; i++) {
            const trailPos = positions[i];
            visual.circle(trailPos.x, trailPos.y, {
                fill: RAINBOW_COLORS[i % RAINBOW_COLORS.length],
                opacity: 0.3 + i * 0.07,
                ...STYLE_TRAIL_CIRCLE,
            });
        }
    },

    /**
     * ダメージ数字
     */
    damageNumber: function (pos, amount, isCritical = false) {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        const color = isCritical ? '#FF0000' : '#FFA500';
        const size = isCritical ? 1.5 : 1;
        const text = isCritical ? `${amount} CRIT!` : `${amount}`;

        visual.text(text, pos.x, pos.y - 1, {
            color: color,
            font: size,
            ...STYLE_DAMAGE_TEXT,
        });

        if (isCritical) {
            visual.text('💥', pos.x - 0.5, pos.y - 1, { font: 1 });
            visual.text('💥', pos.x + 0.5, pos.y - 1, { font: 1 });
        }
    },

    /**
     * エネルギー回復エフェクト
     */
    healEffect: function (pos) {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const distance = 0.3 + (Game.time % 10) * 0.05;
            const x = pos.x + Math.cos(angle) * distance;
            const y = pos.y + Math.sin(angle) * distance;

            visual.text('💚', x, y, {
                font: 0.5,
                opacity: 1 - (Game.time % 10) * 0.1,
            });
        }
    },

    /**
     * スターエフェクト
     */
    stars: function (pos, count = 5) {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Game.time * 0.05;
            const distance = 0.8;
            const x = pos.x + Math.cos(angle) * distance;
            const y = pos.y + Math.sin(angle) * distance;

            visual.text(STAR_EMOJIS[i % STAR_EMOJIS.length], x, y, {
                font: 0.6,
            });
        }
    },

    /**
     * ストリークカウンター
     */
    streak: function (pos, days) {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        visual.text(`🔥 ${days} DAY STREAK! 🔥`, pos.x, pos.y, {
            color: days >= 7 ? '#FF0000' : days >= 3 ? '#FF69B4' : '#FFD700',
            ...STYLE_STREAK_TEXT,
        });
    },

    /**
     * スコアポップアップ
     */
    scorePopup: function (pos, points, label = 'POINTS') {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        visual.text(`+${points}`, pos.x, pos.y - 0.5, STYLE_SCORE_TEXT);

        visual.text(label, pos.x, pos.y + 0.5, STYLE_SCORE_LABEL);
    },

    /**
     * ランクバッジ
     */
    rankBadge: function (pos, rank) {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        const badge = RANK_BADGE_CONFIG[rank] || RANK_BADGE_CONFIG['Newbie'];

        visual.text(badge.icon, pos.x, pos.y, {
            font: 1.5,
        });

        visual.text(rank, pos.x, pos.y + 1, {
            color: badge.color,
            ...STYLE_RANK_TEXT,
        });
    },

    /**
     * Resets the visual effects system (used for testing).
     */
    reset: function () {
        _visualsCache = {};
        _visualsTick = -1;
        _isVfxEnabledTick = -1;
        _trailCache.clear();
    },
};

module.exports = visualEffects;
