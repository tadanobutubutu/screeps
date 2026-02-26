const StatsManager = {
    initMemory() {
        if (!Memory.stats) {
            Memory.stats = {
                totalEnergyProcessed: 0,
                totalEnergyUpgraded: 0,
                totalBuildProgress: 0,
                totalRepairDone: 0,
                roomStats: {},
                creepDeaths: 0,
                creepsBorn: 0,
                startTime: Game.time,
            };
        }
    },

    recordHarvest(amount) {
        Memory.stats.totalEnergyProcessed += amount;
    },

    recordUpgrade(amount) {
        Memory.stats.totalEnergyUpgraded += amount;
    },

    recordBuild(progress) {
        Memory.stats.totalBuildProgress += progress;
    },

    recordRepair(progress) {
        Memory.stats.totalRepairDone += progress;
    },

    recordCreepBirth() {
        Memory.stats.creepsBorn++;
    },

    recordCreepDeath() {
        Memory.stats.creepDeaths++;
    },

    getStats() {
        const uptime = Game.time - Memory.stats.startTime;
        return {
            uptime,
            energyProcessed: Memory.stats.totalEnergyProcessed,
            energyUpgraded: Memory.stats.totalEnergyUpgraded,
            buildProgress: Memory.stats.totalBuildProgress,
            repairDone: Memory.stats.totalRepairDone,
            creepDeaths: Memory.stats.creepDeaths,
            creepsBorn: Memory.stats.creepsBorn,
            avgEnergyPerTick: (Memory.stats.totalEnergyProcessed / uptime).toFixed(2),
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
