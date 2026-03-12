/**
 * Adaptive System - CPU/メモリ使用率に応じた機能制御
 * 負荷が高い時は自動的に機能を制限し、余裕がある時は全機能を有効化
 */

/**
 * システムモード
 */
const MODES = {
    EMERGENCY: 0,
    MINIMAL: 1,
    NORMAL: 2,
    FULL: 3,
};

/**
 * 各モードで有効な機能を定義
 * モジュールレベルで定義することで、高頻度で呼ばれるisEnabledでのメモリ割り当てを削減
 */
const FEATURES = {
    // EMERGENCY: 最小限
    [MODES.EMERGENCY]: {
        basicRoles: true,
        spawn: true,
        memoryCleanup: true,
    },

    // MINIMAL: 基本機能
    [MODES.MINIMAL]: {
        basicRoles: true,
        spawn: true,
        memoryCleanup: true,
        defense: true,
        logging: true,
    },

    // NORMAL: 通常機能
    [MODES.NORMAL]: {
        basicRoles: true,
        spawn: true,
        memoryCleanup: true,
        defense: true,
        logging: true,
        gamification: true,
        emotions: true,
        memoryVisualizer: true,
    },

    // FULL: 全機能
    [MODES.FULL]: {
        basicRoles: true,
        spawn: true,
        memoryCleanup: true,
        defense: true,
        logging: true,
        gamification: true,
        emotions: true,
        memoryVisualizer: true,
        visualEffects: true,
        autoEvolution: true,
        tutorial: true,
        socialInteractions: true,
        advancedRoles: true,
    },
};

const adaptiveSystem = {
    /**
     * システムモード (後方互換性のために保持)
     */
    MODE: MODES,

    /**
     * 初期化
     */
    init: function () {
        if (!Memory.adaptive) {
            Memory.adaptive = {
                currentMode: this.MODE.NORMAL,
                lastCheck: 0,
                modeHistory: [],
                stats: {
                    emergencyCount: 0,
                    minimalCount: 0,
                    normalCount: 0,
                    fullCount: 0,
                },
            };
        }
    },

    /**
     * 現在のシステム状態を評価
     */
    evaluate: function () {
        this.init();

        // 10ティックごとにチェック
        if (Game.time - Memory.adaptive.lastCheck < 10) {
            return Memory.adaptive.currentMode;
        }

        Memory.adaptive.lastCheck = Game.time;

        const cpuUsed = Game.cpu.getUsed();
        const cpuLimit = Game.cpu.limit;
        const cpuBucket = Game.cpu.bucket;
        const cpuUsagePercent = (cpuUsed / cpuLimit) * 100;

        const memorySize = RawMemory.get().length;
        const memoryLimit = 2048 * 1024; // 2MB in bytes
        const memoryUsagePercent = (memorySize / memoryLimit) * 100;

        let newMode = this.MODE.FULL;

        // EMERGENCY: CPU bucket < 1000 または メモリ > 95%
        if (cpuBucket < 1000 || memoryUsagePercent > 95) {
            newMode = this.MODE.EMERGENCY;
        }
        // MINIMAL: CPU bucket < 3000 または メモリ > 85% または CPU使用率 > 80%
        else if (cpuBucket < 3000 || memoryUsagePercent > 85 || cpuUsagePercent > 80) {
            newMode = this.MODE.MINIMAL;
        }
        // NORMAL: CPU bucket < 7000 または メモリ > 70% または CPU使用率 > 60%
        else if (cpuBucket < 7000 || memoryUsagePercent > 70 || cpuUsagePercent > 60) {
            newMode = this.MODE.NORMAL;
        }
        // FULL: 余裕あり
        else {
            newMode = this.MODE.FULL;
        }

        // モード変更時にログ出力
        if (newMode !== Memory.adaptive.currentMode) {
            this.logModeChange(Memory.adaptive.currentMode, newMode, {
                cpuUsagePercent: cpuUsagePercent,
                cpuBucket: cpuBucket,
                memoryUsagePercent: memoryUsagePercent,
            });

            // モード履歴に追加
            Memory.adaptive.modeHistory.push({
                time: Game.time,
                from: Memory.adaptive.currentMode,
                to: newMode,
                reason: this.getModeChangeReason(
                    newMode,
                    cpuUsagePercent,
                    cpuBucket,
                    memoryUsagePercent
                ),
            });

            // 履歴は最新20件まで
            if (Memory.adaptive.modeHistory.length > 20) {
                Memory.adaptive.modeHistory.shift();
            }

            Memory.adaptive.currentMode = newMode;
        }

        // 統計更新
        const modeName = this.getModeName(newMode);
        if (modeName) {
            Memory.adaptive.stats[modeName + 'Count']++;
        }

        return newMode;
    },

    /**
     * モード変更理由を取得
     */
    getModeChangeReason: function (mode, cpuUsage, cpuBucket, memoryUsage) {
        if (mode === this.MODE.EMERGENCY) {
            if (cpuBucket < 1000) {
                return 'CPU bucket critical';
            }
            if (memoryUsage > 95) {
                return 'Memory critical';
            }
        }
        if (mode === this.MODE.MINIMAL) {
            if (cpuBucket < 3000) {
                return 'CPU bucket low';
            }
            if (memoryUsage > 85) {
                return 'Memory high';
            }
            if (cpuUsage > 80) {
                return 'CPU usage high';
            }
        }
        if (mode === this.MODE.NORMAL) {
            return 'Moderate load';
        }
        return 'System healthy';
    },

    /**
     * モード名取得
     */
    getModeName: function (mode) {
        switch (mode) {
            case this.MODE.EMERGENCY:
                return 'emergency';
            case this.MODE.MINIMAL:
                return 'minimal';
            case this.MODE.NORMAL:
                return 'normal';
            case this.MODE.FULL:
                return 'full';
            default:
                return null;
        }
    },

    /**
     * モード変更ログ
     */
    logModeChange: function (oldMode, newMode, stats) {
        const oldName = this.getModeName(oldMode);
        const newName = this.getModeName(newMode);

        console.log('\n🔄 === ADAPTIVE SYSTEM MODE CHANGE === 🔄');
        console.log('From: ' + oldName.toUpperCase() + ' → To: ' + newName.toUpperCase());
        console.log('CPU Usage: ' + stats.cpuUsagePercent.toFixed(1) + '%');
        console.log('CPU Bucket: ' + stats.cpuBucket + '/10000');
        console.log('Memory Usage: ' + stats.memoryUsagePercent.toFixed(1) + '%');
    },

    /**
     * 機能が有効かチェック
     * 高頻度で呼ばれるため、最適化済み
     */
    isEnabled: function (feature) {
        if (!Memory.adaptive) return false;
        const mode = Memory.adaptive.currentMode;
        return FEATURES[mode] && FEATURES[mode][feature] === true;
    },

    /**
     * 緊急クリーンアップ実行
     */
    emergencyCleanup: function () {
        console.log('🚨 Emergency cleanup triggered!');

        // 重いメモリ構造を削除
        delete Memory.evolution;
        delete Memory.memorySnapshots;
        delete Memory.backup;
        delete Memory.diary;

        // emotionsとgamificationは縮小
        if (Memory.emotions && Memory.emotions.history) {
            Memory.emotions.history = Memory.emotions.history.slice(-10);
        }

        if (Memory.gamification && Memory.gamification.achievements) {
            // 最近の成果のみ保持
            Memory.gamification.achievements = Memory.gamification.achievements.slice(-5);
        }

        console.log('✅ Emergency cleanup completed');
    },

    /**
     * ダッシュボード表示
     */
    showDashboard: function () {
        this.init();
        const mode = Memory.adaptive.currentMode;
        const modeName = this.getModeName(mode).toUpperCase();

        const cpuUsed = Game.cpu.getUsed();
        const cpuLimit = Game.cpu.limit;
        const cpuBucket = Game.cpu.bucket;
        const memorySize = RawMemory.get().length;
        const memoryLimit = 2048 * 1024;

        console.log('\n⚡ === ADAPTIVE SYSTEM DASHBOARD === ⚡');
        console.log('Current Mode: ' + modeName);
        console.log('');
        console.log(
            'CPU Used: ' +
                cpuUsed.toFixed(2) +
                '/' +
                cpuLimit +
                ' (' +
                ((cpuUsed / cpuLimit) * 100).toFixed(1) +
                '%)'
        );
        console.log('CPU Bucket: ' + cpuBucket + '/10000 (' + (cpuBucket / 100).toFixed(1) + '%)');
        console.log(
            'Memory: ' +
                (memorySize / 1024).toFixed(1) +
                ' KB / 2048 KB (' +
                ((memorySize / memoryLimit) * 100).toFixed(1) +
                '%)'
        );
        console.log('');

        // 有効機能リスト
        console.log('Enabled Features:');
        const allFeatures = [
            'basicRoles',
            'spawn',
            'defense',
            'logging',
            'gamification',
            'emotions',
            'memoryVisualizer',
            'visualEffects',
            'autoEvolution',
            'tutorial',
            'socialInteractions',
            'advancedRoles',
        ];

        let enabledCount = 0;
        for (let i = 0; i < allFeatures.length; i++) {
            if (this.isEnabled(allFeatures[i])) {
                enabledCount++;
            }
        }
        console.log('  ' + enabledCount + '/' + allFeatures.length + ' features active');

        // 統計
        console.log('');
        console.log('Mode Statistics:');
        const stats = Memory.adaptive.stats;
        const total =
            stats.emergencyCount + stats.minimalCount + stats.normalCount + stats.fullCount;
        if (total > 0) {
            console.log('  Emergency: ' + ((stats.emergencyCount / total) * 100).toFixed(1) + '%');
            console.log('  Minimal: ' + ((stats.minimalCount / total) * 100).toFixed(1) + '%');
            console.log('  Normal: ' + ((stats.normalCount / total) * 100).toFixed(1) + '%');
            console.log('  Full: ' + ((stats.fullCount / total) * 100).toFixed(1) + '%');
        }

        // 最近のモード変更履歴
        if (Memory.adaptive.modeHistory.length > 0) {
            console.log('');
            console.log('Recent Mode Changes:');
            const recentHistory = Memory.adaptive.modeHistory.slice(-5);
            for (let i = 0; i < recentHistory.length; i++) {
                const h = recentHistory[i];
                console.log(
                    '  [' +
                        h.time +
                        '] ' +
                        this.getModeName(h.from) +
                        ' → ' +
                        this.getModeName(h.to) +
                        ' (' +
                        h.reason +
                        ')'
                );
            }
        }
    },

    /**
     * 強制モード変更
     */
    setMode: function (mode) {
        this.init();

        if (mode < this.MODE.EMERGENCY || mode > this.MODE.FULL) {
            console.log('❌ Invalid mode. Use 0-3.');
            return;
        }

        Memory.adaptive.currentMode = mode;
        console.log('✅ Mode set to: ' + this.getModeName(mode).toUpperCase());
    },

    /**
     * リセット
     */
    reset: function () {
        delete Memory.adaptive;
        console.log('🔄 Adaptive system reset!');
    },
};

module.exports = adaptiveSystem;
