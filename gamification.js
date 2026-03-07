/**
 * Gamification System - ドーパミン爆発システム
 */

const vfx = require('visual.effects');

const gamification = {
    /**
     * 初期化
     */
    init: function () {
        if (!Memory.gamification) {
            Memory.gamification = {
                level: 1,
                xp: 0,
                xpToNext: 100,
                totalScore: 0,
                achievements: [],
                streakDays: 0,
                lastActiveDay: 0,
                combos: {},
                milestones: [],
            };
        }
    },

    /**
     * XP獲得
     */
    addXP: function (amount, reason) {
        reason = reason || '';
        this.init();

        Memory.gamification.xp += amount;
        Memory.gamification.totalScore += amount;

        console.log('✨ +' + amount + ' XP ' + (reason ? '(' + reason + ')' : ''));

        // レベルアップチェック
        this.checkLevelUp();
    },

    /**
     * レベルアップチェック
     */
    checkLevelUp: function () {
        const gm = Memory.gamification;

        while (gm.xp >= gm.xpToNext) {
            gm.xp -= gm.xpToNext;
            gm.level++;
            gm.xpToNext = Math.floor(gm.xpToNext * 1.5);

            console.log('🎉 LEVEL UP! Now level ' + gm.level + '!');

            // スポーンにエフェクト
            const spawn = Object.values(Game.spawns)[0];
            if (spawn) {
                vfx.levelUp(spawn.pos, gm.level);
            }

            // 達成通知
            this.unlockAchievement('level_' + gm.level, 'Reached Level ' + gm.level);
        }
    },

    /**
     * 達成解除
     */
    unlockAchievement: function (id, title, icon) {
        icon = icon || '🏆';
        this.init();

        if (!Memory.gamification.achievements.includes(id)) {
            Memory.gamification.achievements.push(id);

            console.log('🏆 ACHIEVEMENT UNLOCKED: ' + title);

            const spawn = Object.values(Game.spawns)[0];
            if (spawn) {
                vfx.achievement(spawn.pos, title, icon);
            }

            // ボーナスXP
            this.addXP(50, 'Achievement Bonus');
        }
    },

    /**
     * コンボシステム
     */
    addCombo: function (type) {
        this.init();

        if (!Memory.gamification.combos[type]) {
            Memory.gamification.combos[type] = {
                count: 0,
                lastTick: 0,
            };
        }

        const combo = Memory.gamification.combos[type];

        // 10ティック以内ならコンボ継続
        if (Game.time - combo.lastTick <= 10) {
            combo.count++;
        } else {
            combo.count = 1;
        }

        combo.lastTick = Game.time;

        if (combo.count >= 3) {
            const bonusXP = combo.count * 2;
            this.addXP(bonusXP, combo.count + 'x ' + type + ' combo!');
        }

        return combo.count;
    },

    /**
     * ストリーク更新
     */
    updateStreak: function () {
        this.init();

        const today = Math.floor(Game.time / 1000);
        const lastDay = Memory.gamification.lastActiveDay;

        if (today > lastDay) {
            if (today === lastDay + 1) {
                Memory.gamification.streakDays++;
            } else {
                Memory.gamification.streakDays = 1;
            }

            Memory.gamification.lastActiveDay = today;

            if (Memory.gamification.streakDays >= 7) {
                this.unlockAchievement('streak_7', '7 Day Streak!', '🔥');
            }
        }
    },

    /**
     * マイルストーンチェック
     */
    checkMilestones: function () {
        const creepCount = Object.keys(Game.creeps).length;
        const roomCount = Object.keys(Game.rooms).length;
        const gcl = Game.gcl.level;

        // Creepマイルストーン
        if (creepCount >= 10) {
            this.unlockAchievement('creeps_10', '10 Creeps!', '👥');
        }
        if (creepCount >= 20) {
            this.unlockAchievement('creeps_20', '20 Creeps!', '👥');
        }
        if (creepCount >= 50) {
            this.unlockAchievement('creeps_50', '50 Creeps!', '👥');
        }

        // GCLマイルストーン
        if (gcl >= 2) {
            this.unlockAchievement('gcl_2', 'GCL 2!', '⬆️');
        }
        if (gcl >= 3) {
            this.unlockAchievement('gcl_3', 'GCL 3!', '⬆️');
        }
        if (gcl >= 5) {
            this.unlockAchievement('gcl_5', 'GCL 5!', '⬆️');
        }
    },

    /**
     * ランク計算
     */
    getRank: function () {
        const level =
            Memory.gamification && Memory.gamification.level ? Memory.gamification.level : 1;

        if (level >= 20) {
            return 'Master';
        }
        if (level >= 15) {
            return 'Expert';
        }
        if (level >= 10) {
            return 'Advanced';
        }
        if (level >= 5) {
            return 'Intermediate';
        }
        if (level >= 2) {
            return 'Beginner';
        }
        return 'Newbie';
    },

    /**
     * ダッシュボード表示
     */
    showDashboard: function () {
        this.init();
        const gm = Memory.gamification;

        console.log('\n🎮 === GAMIFICATION DASHBOARD === 🎮');
        console.log('Level: ' + gm.level + ' | Rank: ' + this.getRank());
        console.log(
            'XP: ' +
                gm.xp +
                ' / ' +
                gm.xpToNext +
                ' (' +
                Math.floor((gm.xp / gm.xpToNext) * 100) +
                '%)'
        );
        console.log('Total Score: ' + gm.totalScore);
        console.log('Achievements: ' + gm.achievements.length);
        console.log('Streak: ' + gm.streakDays + ' days 🔥');

        // 最近の達成
        if (gm.achievements.length > 0) {
            console.log('\n🏆 Recent Achievements:');
            gm.achievements.slice(-5).forEach(function (a) {
                console.log('  - ' + a);
            });
        }
    },

    /**
     * ビジュアルダッシュボード
     */
    renderDashboard: function () {
        this.init();
        const gm = Memory.gamification;

        const spawn = Object.values(Game.spawns)[0];
        if (!spawn) {
            return;
        }

        const visual = spawn.room.visual;
        const x = spawn.pos.x + 5;
        const y = spawn.pos.y - 3;

        // 背景ボックス
        visual.rect(x - 3, y - 2, 6, 8, {
            fill: '#000000',
            opacity: 0.7,
            stroke: '#FFD700',
            strokeWidth: 0.1,
        });

        // タイトル
        visual.text('🎮 STATS 🎮', x, y - 1.3, {
            color: '#FFD700',
            font: 0.8,
            stroke: '#000000',
            strokeWidth: 0.05,
        });

        // レベル
        visual.text('Lv.' + gm.level, x - 2, y - 0.3, {
            color: '#00FF00',
            font: 0.7,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });

        // XPバー
        vfx.progressBar({ x: x, y: y + 0.5, roomName: spawn.room.name }, gm.xp, gm.xpToNext, 'XP');

        // スコア
        visual.text('Score: ' + gm.totalScore, x - 2, y + 1.3, {
            color: '#FFD700',
            font: 0.6,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });

        // 達成
        visual.text('🏆 ' + gm.achievements.length, x - 2, y + 2, {
            color: '#FFFFFF',
            font: 0.6,
            align: 'left',
            stroke: '#000000',
            strokeWidth: 0.05,
        });

        // ストリーク
        if (gm.streakDays > 0) {
            visual.text('🔥 ' + gm.streakDays + ' days', x - 2, y + 2.7, {
                color: '#FF69B4',
                font: 0.6,
                align: 'left',
                stroke: '#000000',
                strokeWidth: 0.05,
            });
        }

        // ランクバッジ
        vfx.rankBadge({ x: x + 1.5, y: y + 4, roomName: spawn.room.name }, this.getRank());
    },

    /**
     * Creepアクション追跡
     */
    trackAction: function (creep, action) {
        switch (action) {
            case 'harvest':
                this.addXP(1, 'harvest');
                const harvestCombo = this.addCombo('harvest');
                if (harvestCombo >= 5) {
                    vfx.combo(creep.pos, harvestCombo);
                }
                break;

            case 'build':
                this.addXP(3, 'build');
                vfx.scorePopup(creep.pos, 3, 'BUILD');
                break;

            case 'upgrade':
                this.addXP(2, 'upgrade');
                const upgradeCombo = this.addCombo('upgrade');
                if (upgradeCombo >= 3) {
                    vfx.combo(creep.pos, upgradeCombo);
                }
                break;

            case 'repair':
                this.addXP(2, 'repair');
                vfx.healEffect(creep.pos);
                break;

            case 'attack':
                this.addXP(10, 'attack');
                vfx.damageNumber(creep.pos, 10, true);
                break;
        }
    },

    /**
     * リセット
     */
    reset: function () {
        delete Memory.gamification;
        console.log('🔄 Gamification reset!');
    },
};

module.exports = gamification;
