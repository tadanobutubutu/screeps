const utilsMemory = require('./utils.memory');

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded objects can crash the AI.
 */
const MAX_ROOM_STATS = 50;

const StatsManager = {
    initMemory() {
        if (!Memory.stats) {
            Memory.stats = {};
        }

        const defaults = {
            totalEnergyProcessed: 0,
            totalEnergyUpgraded: 0,
            totalBuildProgress: 0,
            totalRepairDone: 0,
            roomStats: {},
            creepDeaths: 0,
            creepsBorn: 0,
            startTime: Game.time,
        };

        for (const key in defaults) {
            if (Memory.stats[key] === undefined) {
                Memory.stats[key] = defaults[key];
            }
        }
    },

    /**
     * Security: Validate amount to prevent corruption or DoS via massive/invalid values.
     */
    _isValidAmount(amount) {
        const numericAmount = Number(amount);
        return Number.isFinite(numericAmount) && numericAmount >= 0;
    },

    recordHarvest(amount) {
        this.initMemory();
        if (this._isValidAmount(amount)) {
            Memory.stats.totalEnergyProcessed += Number(amount);
        }
    },

    recordUpgrade(amount) {
        this.initMemory();
        if (this._isValidAmount(amount)) {
            Memory.stats.totalEnergyUpgraded += Number(amount);
        }
    },

    recordBuild(progress) {
        this.initMemory();
        if (this._isValidAmount(progress)) {
            Memory.stats.totalBuildProgress += Number(progress);
        }
    },

    recordRepair(progress) {
        this.initMemory();
        if (this._isValidAmount(progress)) {
            Memory.stats.totalRepairDone += Number(progress);
        }
    },

    recordCreepBirth() {
        this.initMemory();
        Memory.stats.creepsBorn++;
    },

    recordCreepDeath() {
        this.initMemory();
        Memory.stats.creepDeaths++;
    },

    /**
     * Security: Safe room statistics recording with key validation and capacity limits.
     */
    recordRoomStat(roomName, key, amount) {
        this.initMemory();

        if (!utilsMemory.isSafeKey(roomName) || !utilsMemory.isSafeKey(key)) {
            return;
        }

        if (!this._isValidAmount(amount)) {
            return;
        }

        if (!Memory.stats.roomStats[roomName]) {
            // Security: Enforce room count limit to prevent Memory DoS
            if (Object.keys(Memory.stats.roomStats).length >= MAX_ROOM_STATS) {
                return;
            }
            Memory.stats.roomStats[roomName] = {};
        }

        const roomStats = Memory.stats.roomStats[roomName];
        if (roomStats[key] === undefined) {
            // Security: Also limit keys per room (Defense in Depth)
            if (Object.keys(roomStats).length >= 10) {
                return;
            }
            roomStats[key] = 0;
        }

        roomStats[key] += Number(amount);
    },

    getStats() {
        this.initMemory();
        const uptime = Game.time - Memory.stats.startTime;
        return {
            uptime,
            energyProcessed: Memory.stats.totalEnergyProcessed,
            energyUpgraded: Memory.stats.totalEnergyUpgraded,
            buildProgress: Memory.stats.totalBuildProgress,
            repairDone: Memory.stats.totalRepairDone,
            creepDeaths: Memory.stats.creepDeaths,
            creepsBorn: Memory.stats.creepsBorn,
            avgEnergyPerTick:
                uptime > 0 ? (Memory.stats.totalEnergyProcessed / uptime).toFixed(2) : '0.00',
        };
    },

    displayStats() {
        const stats = this.getStats();
        const lines = [
            `📊 Empire Stats (${stats.uptime} ticks)`,
            `Energy Processed: ${stats.energyProcessed}`,
            `Energy Upgraded: ${stats.energyUpgraded}`,
            `Build Progress: ${stats.buildProgress}`,
            `Repair Done: ${stats.repairDone}`,
            `Creeps Born: ${stats.creepsBorn} | Deaths: ${stats.creepDeaths}`,
            `Avg Energy/tick: ${stats.avgEnergyPerTick}`,
        ];
        return lines;
    },
};

module.exports = StatsManager;
