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
                opacity: 0.8,
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
                fill: 'transparent',
                stroke: SUCCESS_COLORS[ring % SUCCESS_COLORS.length],
                strokeWidth: 0.1,
                opacity: 1 - ring * 0.2,
            });
        }

        // スターバースト
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const endX = pos.x + Math.cos(angle) * 1.5;
            const endY = pos.y + Math.sin(angle) * 1.5;

            visual.line(pos.x, pos.y, endX, endY, {
                color: SUCCESS_COLORS[i % SUCCESS_COLORS.length],
                width: 0.15,
                opacity: 0.8,
            });
        }

        // 中心の星
        visual.text('⭐', pos.x, pos.y, {
            color: '#FFD700',
            font: 1.5,
        });
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
                fill: 'transparent',
                stroke: RAINBOW_COLORS[i],
                strokeWidth: 0.15,
                opacity: 0.7,
            });
        }

        // LEVEL UP!
        visual.text('LEVEL UP!', pos.x, pos.y - 1.5, {
            color: '#FFD700',
            font: 1.2,
            stroke: '#000000',
            strokeWidth: 0.1,
        });

        visual.text(`Lv.${level}`, pos.x, pos.y + 1.5, {
            color: '#00FF00',
            font: 2,
            stroke: '#000000',
            strokeWidth: 0.15,
        });
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
            stroke: '#000000',
            strokeWidth: 0.1,
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
        visual.rect(pos.x - 3, pos.y - 1, 6, 2, {
            fill: '#000000',
            opacity: 0.8,
            stroke: '#FFD700',
            strokeWidth: 0.1,
        });

        // アイコン
        visual.text(icon, pos.x - 2, pos.y, {
            font: 1.5,
        });

        // タイトル
        visual.text(title, pos.x + 0.5, pos.y - 0.3, {
            color: '#FFD700',
            font: 0.8,
            align: 'left',
        });

        visual.text('Achievement Unlocked!', pos.x + 0.5, pos.y + 0.5, {
            color: '#FFFFFF',
            font: 0.5,
            align: 'left',
        });
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
        visual.rect(pos.x - width / 2 - 0.1, pos.y - 1.0, width + 0.2, 1.4, {
            fill: '#000000',
            opacity: 0.5,
            stroke: 'transparent',
        });

        // 背景
        visual.rect(pos.x - width / 2, pos.y - height / 2, width, height, {
            fill: '#333333',
            stroke: '#FFFFFF',
            strokeWidth: 0.05,
        });

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
            opacity: 0.8,
        });

        // テキスト
        visual.text(`${label} ${percent}%`, pos.x, pos.y - 0.65, {
            color: '#FFFFFF',
            font: 0.45,
            stroke: '#000000',
            strokeWidth: 0.05,
        });
    },

    /**
     * レインボートレイル
     */
    rainbowTrail: function (creep) {
        if (!isVfxEnabled()) {
            if (creep.memory.trailPositions) {
                delete creep.memory.trailPositions;
            }
            return;
        }
        const visual = getVisual(creep.room.name);

        if (!creep.memory.trailPositions) {
            creep.memory.trailPositions = [];
        }

        creep.memory.trailPositions.push({ x: creep.pos.x, y: creep.pos.y });

        if (creep.memory.trailPositions.length > 10) {
            creep.memory.trailPositions.shift();
        }

        for (let i = 0; i < creep.memory.trailPositions.length; i++) {
            const trailPos = creep.memory.trailPositions[i];
            visual.circle(trailPos.x, trailPos.y, {
                radius: 0.2,
                fill: RAINBOW_COLORS[i % RAINBOW_COLORS.length],
                opacity: 0.3 + i * 0.07,
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
            stroke: '#000000',
            strokeWidth: 0.1,
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
            font: 1.2,
            stroke: '#000000',
            strokeWidth: 0.1,
        });
    },

    /**
     * スコアポップアップ
     */
    scorePopup: function (pos, points, label = 'POINTS') {
        if (!isVfxEnabled()) return;
        const visual = getVisual(pos.roomName);

        visual.text(`+${points}`, pos.x, pos.y - 0.5, {
            color: '#FFD700',
            font: 1,
            stroke: '#000000',
            strokeWidth: 0.1,
        });

        visual.text(label, pos.x, pos.y + 0.5, {
            color: '#FFFFFF',
            font: 0.6,
        });
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
            font: 0.7,
            stroke: '#000000',
            strokeWidth: 0.05,
        });
    },

    /**
     * Resets the visual effects system (used for testing).
     */
    reset: function () {
        _visualsCache = {};
        _visualsTick = -1;
        _isVfxEnabledTick = -1;
    },
};

module.exports = visualEffects;
