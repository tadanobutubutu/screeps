const utilsMemory = require('./utils.memory');

const AIHelper = {
    /**
     * Security: Safely initialize and validate AI state.
     * Prevents NaN propagation and DoS from corrupted memory.
     */
    initMemory() {
        if (!Memory.aiState) {
            Memory.aiState = {};
        }

        const defaults = {
            phase: 'expansion',
            priority: 'energy',
        };

        for (const key in defaults) {
            if (!Memory.aiState[key] || !utilsMemory.isSafeKey(Memory.aiState[key])) {
                Memory.aiState[key] = defaults[key];
            } else if (typeof Memory.aiState[key] === 'string') {
                // Security: Limit string length to avoid Memory DoS
                Memory.aiState[key] = Memory.aiState[key].substring(0, 100);
            }
        }
    },

    getAIDecision(room) {
        this.initMemory();

        const creeps = room.find(FIND_MY_CREEPS);
        const structures = room.find(FIND_MY_STRUCTURES);
        const hostiles = room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0) {
            return { phase: 'defense', priority: 'survival' };
        }

        const rcl = room.controller ? room.controller.level : 0;
        const energyRatio =
            room.energyCapacityAvailable > 0
                ? room.energyAvailable / room.energyCapacityAvailable
                : 0;
        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);

        if (rcl < 3) {
            return { phase: 'early_game', priority: 'expansion' };
        }

        if (energyRatio < 0.5) {
            return { phase: 'farming', priority: 'energy' };
        }

        if (constructionSites.length > 5) {
            return { phase: 'building', priority: 'construction' };
        }

        if (rcl < 8) {
            return { phase: 'growth', priority: 'upgrade' };
        }

        return { phase: 'endgame', priority: 'optimization' };
    },

    suggestCreepCount(room) {
        const decision = this.getAIDecision(room);

        const suggestions = {
            early_game: { harvester: 5, upgrader: 2, builder: 1, repairer: 0 },
            farming: { harvester: 6, upgrader: 1, builder: 1, repairer: 0 },
            expansion: { harvester: 4, upgrader: 2, builder: 2, repairer: 1 },
            building: { harvester: 3, upgrader: 1, builder: 3, repairer: 1 },
            growth: { harvester: 2, upgrader: 4, builder: 1, repairer: 1 },
            defense: { harvester: 1, upgrader: 0, builder: 0, repairer: 0 },
            endgame: { harvester: 1, upgrader: 2, builder: 1, repairer: 1 },
            optimization: { harvester: 1, upgrader: 1, builder: 1, repairer: 1 },
        };

        // Security: Use hasOwnProperty and isSafeKey to prevent Prototype Pollution
        const phase = decision.phase;
        if (utilsMemory.isSafeKey(phase) && Object.prototype.hasOwnProperty.call(suggestions, phase)) {
            return suggestions[phase];
        }

        return suggestions.expansion;
    },

    shouldBuildStructure(room) {
        const decision = this.getAIDecision(room);

        if (decision.phase === 'defense') {
            return false;
        }
        if (decision.phase === 'early_game') {
            return false;
        }

        const structures = room.find(FIND_MY_STRUCTURES);
        const structureCount = structures.length;
        const rcl = room.controller ? room.controller.level : 0;

        const maxStructures = {
            1: 0,
            2: 5,
            3: 10,
            4: 20,
            5: 30,
            6: 40,
            7: 50,
            8: 60,
        };

        // Security: Use hasOwnProperty and isSafeKey for dynamic lookup
        if (utilsMemory.isSafeKey(rcl) && Object.prototype.hasOwnProperty.call(maxStructures, rcl)) {
            return structureCount < maxStructures[rcl];
        }

        return false;
    },
};

module.exports = AIHelper;
