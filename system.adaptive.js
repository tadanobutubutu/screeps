/**
 * Adaptive System - CPU/メモリ使用率に応じた機能制御
 * 負荷が高い時は自動的に機能を制限し、余裕がある時は全機能を有効化
 */

const utilsMemory = require('./utils.memory');
const logger = require('./utils.logging');

/**
 * System modes:
 * 0: EMERGENCY - Minimal functionality to survive.
 * 1: MINIMAL - Basic features only.
 * 2: NORMAL - Standard operations.
 * 3: FULL - All features enabled.
 */
const MODES = {
    EMERGENCY: 0,
    MINIMAL: 1,
    NORMAL: 2,
    FULL: 3,
};

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted constants to reduce per-tick allocation and O(1) lookups.
 */
const ADAPTIVE_DEFAULTS = {
    currentMode: MODES.NORMAL,
    lastCheck: 0,
    modeHistory: [],
    stats: {
        emergencyCount: 0,
        minimalCount: 0,
        normalCount: 0,
        fullCount: 0,
    },
};

const VALID_MODES = new Set([MODES.EMERGENCY, MODES.MINIMAL, MODES.NORMAL, MODES.FULL]);

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted feature configuration.
 * Moving this object literal outside of the `isEnabled` function prevents
 * redundant object allocation on every call (called many times per tick).
 */
const FEATURE_CONFIG = {
    [MODES.EMERGENCY]: {
        basicRoles: true,
        spawn: true,
        memoryCleanup: true,
    },
    [MODES.MINIMAL]: {
        basicRoles: true,
        spawn: true,
        memoryCleanup: true,
        defense: true,
        logging: true,
    },
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

// ⚡ PERFORMANCE: Per-tick cache for feature configuration
let _currentConfig = null;
let _configTick = -1;

const adaptiveSystem = {
    /**
     * システムモード
     */
    MODE: MODES,

    /**
     * 初期化
     */
    init: function () {
        if (!Memory.adaptive) {
            Memory.adaptive = {};
            // ⚡ PERFORMANCE: Reset cache when Memory is re-initialized (important for tests)
            _currentConfig = null;
            _configTick = -1;
        }

        // ⚡ PERFORMANCE: Use hoisted defaults to avoid per-tick object literal creation.
        for (const key in ADAPTIVE_DEFAULTS) {
            if (Memory.adaptive[key] === undefined) {
                const defaultValue = ADAPTIVE_DEFAULTS[key];
                // For arrays and objects, we must create new copies to avoid shared references
                if (Array.isArray(defaultValue)) {
                    Memory.adaptive[key] = [...defaultValue];
                } else if (typeof defaultValue === 'object' && defaultValue !== null) {
                    Memory.adaptive[key] = { ...defaultValue };
                } else {
                    Memory.adaptive[key] = defaultValue;
                }
            }
        }
    },

    /**
     * 現在のシステム状態を評価
     */
    evaluate: function () {
        // ⚡ PERFORMANCE: Implement fast-path return. Skip full init and validation on 90% of ticks.
        // evaluate() is called once per tick in main.js, so this saving is significant.
        if (Memory.adaptive && Game.time - (Memory.adaptive.lastCheck || 0) < 10) {
            const currentMode = Memory.adaptive.currentMode;
            return VALID_MODES.has(currentMode) ? currentMode : MODES.NORMAL;
        }

        this.init();

        // Security: Validate currentMode to prevent DoS crashes in downstream systems.
        // If the mode is missing or invalid, reset it to NORMAL.
        // ⚡ PERFORMANCE: Use hoisted Set for O(1) lookup instead of Array.includes (O(N)).
        if (!VALID_MODES.has(Memory.adaptive.currentMode)) {
            Memory.adaptive.currentMode = MODES.NORMAL;
        }

        Memory.adaptive.lastCheck = Game.time;

        const cpuUsed = Game.cpu.getUsed();
        const cpuLimit = Game.cpu.limit;
        const cpuBucket = Game.cpu.bucket;
        const cpuUsagePercent = (cpuUsed / cpuLimit) * 100;

        const memorySize = RawMemory.get().length;
        const memoryLimit = 2048 * 1024; // 2MB in bytes
        const memoryUsagePercent = (memorySize / memoryLimit) * 100;

        const newMode = this._determineTargetMode(cpuBucket, cpuUsagePercent, memoryUsagePercent);

        // モード変更時にログ出力
        if (newMode !== Memory.adaptive.currentMode) {
            this._applyModeChange(newMode, cpuUsagePercent, cpuBucket, memoryUsagePercent);
        }

        // 統計更新
        this._updateStats(newMode);

        return newMode;
    },

    /**
     * Determine target mode based on load
     */
    _determineTargetMode: function (cpuBucket, cpuUsagePercent, memoryUsagePercent) {
        // EMERGENCY: CPU bucket < 1000 または メモリ > 95%
        if (cpuBucket < 1000 || memoryUsagePercent > 95) {
            return this.MODE.EMERGENCY;
        }
        // MINIMAL: CPU bucket < 3000 または メモリ > 85% または CPU使用率 > 80%
        if (cpuBucket < 3000 || memoryUsagePercent > 85 || cpuUsagePercent > 80) {
            return this.MODE.MINIMAL;
        }
        // NORMAL: CPU bucket < 7000 または メモリ > 70% または CPU使用率 > 60%
        if (cpuBucket < 7000 || memoryUsagePercent > 70 || cpuUsagePercent > 60) {
            return this.MODE.NORMAL;
        }
        // FULL: 余裕あり
        return this.MODE.FULL;
    },

    /**
     * Apply mode change side effects
     */
    _applyModeChange: function (newMode, cpuUsagePercent, cpuBucket, memoryUsagePercent) {
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

        // ⚡ PERFORMANCE: Update cache immediately on mode change
        _currentConfig = FEATURE_CONFIG[newMode];
        _configTick = Game.time;
    },

    /**
     * Update usage stats for current mode
     */
    _updateStats: function (mode) {
        const modeName = this.getModeName(mode);
        if (modeName) {
            Memory.adaptive.stats[modeName + 'Count'] =
                (Memory.adaptive.stats?.[modeName + 'Count'] ?? 0) + 1;
        }
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
     *
     * Security: Returns a safe fallback string for unknown modes to prevent
     * ".toUpperCase() of null" type crashes (Denial of Service).
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
                return 'unknown';
        }
    },

    /**
     * モード変更ログ
     */
    logModeChange: function (oldMode, newMode, stats) {
        // Security: Escape mode names to prevent console injection
        const oldName = logger.escapeHTML(this.getModeName(oldMode));
        const newName = logger.escapeHTML(this.getModeName(newMode));

        logger.info('Adaptive Mode Change: ' + oldName.toUpperCase() + ' → To: ' + newName.toUpperCase());
        logger.info('Stats - CPU: ' + stats.cpuUsagePercent.toFixed(1) + '%, Bucket: ' + stats.cpuBucket);
        logger.info('Memory: ' + stats.memoryUsagePercent.toFixed(1) + '%');
    },

    /**
     * 機能が有効かチェック
     * ⚡ PERFORMANCE OPTIMIZATION: Removed redundant `this.init();` call.
     * `init()` is already called at the start of the loop in `main.js` via `evaluate()`.
     * Estimated impact: Reduces CPU overhead in a high-frequency function.
     */
    isEnabled: function (feature) {
        // ⚡ PERFORMANCE: Use per-tick cache to avoid redundant Memory lookups
        if (_configTick !== Game.time || !_currentConfig) {
            const mode = Memory.adaptive ? Memory.adaptive.currentMode : MODES.NORMAL;
            _currentConfig = FEATURE_CONFIG[mode];
            _configTick = Game.time;
        }
        return _currentConfig?.[feature] === true;
    },

    /**
     * 緊急クリーンアップ実行
     * ⚡ SECURITY: Enhanced DoS mitigation by clearing more memory-intensive structures.
     */
    emergencyCleanup: function () {
        // Delete heavy root structures
        delete Memory.evolution;
        delete Memory.backups;
        delete Memory.timeMachine;
        delete Memory.leaderboard;
        delete Memory.cache;
        delete Memory.memorySnapshots;

        // Clean up per-creep memory (non-essential features)
        if (Memory.creeps) {
            for (const name in Memory.creeps) {
                // Security: Use isSafeKey to prevent prototype pollution during iteration
                if (
                    utilsMemory.isSafeKey(name) &&
                    Object.prototype.hasOwnProperty.call(Memory.creeps, name)
                ) {
                    const creepMemory = Memory.creeps[name];
                    if (creepMemory) {
                        delete creepMemory.diary;
                        delete creepMemory.emotions;
                        delete creepMemory.trailPositions;
                    }
                }
            }
        }

        // Truncate gamification achievements to save space
        if (Memory.gamification && Array.isArray(Memory.gamification.achievements)) {
            Memory.gamification.achievements = Memory.gamification.achievements.slice(-5);
        }

        // Delete any other suspected heavy structures
        delete Memory.emotions; // Root-level emotions (if any)
        delete Memory.diary; // Root-level diary

        },

    /**
     * ダッシュボード表示
     */
    _printResourceUsage: function (modeName) {
        const cpuUsed = Game.cpu.getUsed();
        const cpuLimit = Game.cpu.limit;
        const cpuBucket = Game.cpu.bucket;
        const memorySize = RawMemory.get().length;
        const memoryLimit = 2048 * 1024;

        logger.info('Mode: ' + modeName);
        logger.info(
            'CPU: ' +
                cpuUsed.toFixed(2) +
                '/' +
                cpuLimit +
                ' (' +
                ((cpuUsed / cpuLimit) * 100).toFixed(1) +
                '%)'
        );
        logger.info('Bucket: ' + cpuBucket + ' (' + ((cpuBucket / 10000) * 100).toFixed(1) + '%)');
        logger.info(
            'Memory: ' +
                (memorySize / 1024).toFixed(1) +
                ' KB / 2048 KB (' +
                ((memorySize / memoryLimit) * 100).toFixed(1) +
                '%)'
        );
    },

    _printEnabledFeatures: function () {
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
        },

    _printModeStatistics: function () {
        const stats = Memory.adaptive.stats;
        const total =
            stats.emergencyCount + stats.minimalCount + stats.normalCount + stats.fullCount;
        if (total > 0) {
            logger.info('Emergency: ' + ((stats.emergencyCount / total) * 100).toFixed(1) + '%');
            logger.info('Minimal: ' + ((stats.minimalCount / total) * 100).toFixed(1) + '%');
            logger.info('Normal: ' + ((stats.normalCount / total) * 100).toFixed(1) + '%');
            logger.info('Full: ' + ((stats.fullCount / total) * 100).toFixed(1) + '%');
        }
    },

    _printRecentHistory: function () {
        if (Memory.adaptive.modeHistory.length > 0) {
            const recentHistory = Memory.adaptive.modeHistory.slice(-5);
            for (let i = 0; i < recentHistory.length; i++) {
                const h = recentHistory[i];
                // Security: Escape all dynamic strings before console output
                const fromName = logger.escapeHTML(this.getModeName(h.from));
                const toName = logger.escapeHTML(this.getModeName(h.to));
                const reason = logger.escapeHTML(h.reason);
                logger.info('History: ' + fromName + ' -> ' + toName + ' (' + reason + ')');
            }
        }
    },

    /**
     * ダッシュボード表示
     */
    showDashboard: function () {
        this.init();
        const mode = Memory.adaptive.currentMode;
        // Security: Escape mode name to prevent console injection
        const modeName = logger.escapeHTML(this.getModeName(mode)).toUpperCase();

        this._printResourceUsage(modeName);
        this._printEnabledFeatures();
        this._printModeStatistics();
        this._printRecentHistory();
    },

    /**
     * 強制モード変更
     */
    setMode: function (mode) {
        this.init();

        // Security: Boundary validation and type check for manual mode override
        const numericMode = Number(mode);
        if (
            !Number.isInteger(numericMode) ||
            numericMode < this.MODE.EMERGENCY ||
            numericMode > this.MODE.FULL
        ) {
            logger.warn('Invalid mode: ' + mode);
            return;
        }

        Memory.adaptive.currentMode = numericMode;

        // ⚡ PERFORMANCE: Update cache immediately on manual mode change
        _currentConfig = FEATURE_CONFIG[numericMode];
        _configTick = Game.time;

        logger.info('Mode manually set to: ' + this.getModeName(numericMode).toUpperCase());
    },

    /**
     * リセット
     */
    reset: function () {
        delete Memory.adaptive;
        // ⚡ PERFORMANCE: Reset cache when system is reset
        _currentConfig = null;
        _configTick = -1;
        },
};

module.exports = adaptiveSystem;
