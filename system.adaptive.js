/**
 * System Adaptive - Adapts AI operations based on CPU and memory usage
 */

const MODE = {
    EMERGENCY: 0,
    MINIMAL: 1,
    NORMAL: 2,
    FULL: 3,
};

const MODE_NAMES = {
    0: 'emergency',
    1: 'minimal',
    2: 'normal',
    3: 'full',
};

const adaptiveSystem = {
    MODE,

    init: function () {
        if (!Memory.adaptive) {
            Memory.adaptive = {
                currentMode: MODE.NORMAL,
                lastCheck: (global.Game && global.Game.time) || 0,
            };
        }
    },

    evaluate: function () {
        this.init();
        const bucket = (global.Game && global.Game.cpu && global.Game.cpu.bucket) ?? 10000;
        let mode = MODE.NORMAL;
        if (bucket < 1000) {
            mode = MODE.EMERGENCY;
        } else if (bucket < 3000) {
            mode = MODE.MINIMAL;
        } else if (bucket >= 9000) {
            mode = MODE.FULL;
        }
        Memory.adaptive.currentMode = mode;
        Memory.adaptive.lastCheck = (global.Game && global.Game.time) || 0;
        return mode;
    },

    getModeName: function (mode) {
        return MODE_NAMES[mode] || 'unknown';
    },

    isEnabled: function (feature) {
        this.init();
        const currentMode = Memory.adaptive.currentMode;
        if (currentMode === MODE.EMERGENCY) {
            return feature === 'core';
        }
        if (currentMode === MODE.MINIMAL) {
            return feature !== 'visualEffects';
        }
        return true;
    },

    setMode: function (mode) {
        this.init();
        if (Object.values(MODE).includes(mode)) {
            Memory.adaptive.currentMode = mode;
        } else {
            console.log(`Invalid mode: ${mode}`);
        }
    },

    reset: function () {
        delete Memory.adaptive;
    },

    emergencyCleanup: function () {
        delete Memory.evolution;
        delete Memory.backups;
        delete Memory.timeMachine;
        delete Memory.gamification;
        if (Memory.creeps) {
            for (const name in Memory.creeps) {
                if (Memory.creeps[name]) {
                    delete Memory.creeps[name].diary;
                    delete Memory.creeps[name].emotions;
                    delete Memory.creeps[name].trailPositions;
                }
            }
        }
    },

    logModeChange: function (oldMode, newMode, stats) {
        console.log('\n🔄 === ADAPTIVE SYSTEM MODE CHANGE === 🔄');
        console.log(`From: ${this.getModeName(oldMode).toUpperCase()} → To: ${this.getModeName(newMode).toUpperCase()}`);
        console.log(`CPU Usage: ${stats.cpuUsagePercent}%`);
        console.log(`CPU Bucket: ${stats.cpuBucket}/10000`);
        console.log(`Memory Usage: ${stats.memoryUsagePercent}%`);
    },

    getModeChangeReason: function (oldMode, cpuPercent, bucket, memPercent) {
        return `CPU: ${cpuPercent}%, Bucket: ${bucket}, Memory: ${memPercent}%`;
    },
};

module.exports = adaptiveSystem;
