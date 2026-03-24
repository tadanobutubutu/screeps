const utilsMemory = require('./utils.memory');

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded arrays can crash the AI.
 */
const MAX_MISSIONS_COUNT = 20;
const MAX_STRING_LENGTH = 100;

const MissionSystem = {
    initMemory() {
        if (!Memory.missions) {
            Memory.missions = {
                active: [],
                completed: 0,
            };
        }
    },

    createMission(type, target, reward) {
        this.initMemory();

        // Security: Sanitize and truncate type and target to prevent Memory DoS.
        // If a key is unsafe, use a fallback to ensure we don't return null and crash callers.
        const safeType = utilsMemory.isSafeKey(type) ? type : 'unknown';
        const safeTarget = utilsMemory.isSafeKey(target) ? target : 'unknown';

        const sanitizedType = String(safeType).substring(0, MAX_STRING_LENGTH);
        const sanitizedTarget = String(safeTarget).substring(0, MAX_STRING_LENGTH);

        // Security: Enforce mission count limit to prevent Memory DoS (2MB limit)
        if (Memory.missions.active.length >= MAX_MISSIONS_COUNT) {
            // Attempt to evict the oldest completed mission first
            let evictIndex = Memory.missions.active.findIndex((m) => m.status === 'completed');

            // If no completed missions, evict the oldest active mission (first in array)
            if (evictIndex === -1) {
                evictIndex = 0;
            }

            Memory.missions.active.splice(evictIndex, 1);
        }

        const mission = {
            id: Math.random().toString(36).substr(2, 9),
            type: sanitizedType,
            target: sanitizedTarget,
            reward: reward || 0,
            createdAt: Game.time,
            status: 'active',
        };

        Memory.missions.active.push(mission);
        return mission;
    },

    getMissionsForCreep(creep) {
        return Memory.missions.active.filter((m) => m.status === 'active');
    },

    completeMission(missionId) {
        const mission = Memory.missions.active.find((m) => m.id === missionId);
        if (mission) {
            mission.status = 'completed';
            Memory.missions.completed++;
        }
    },

    getActiveMissions() {
        return Memory.missions.active.filter((m) => m.status === 'active');
    },

    createRandomMission() {
        const types = ['scout', 'harvest_boost', 'defense_patrol', 'build_sprint'];
        const type = types[Math.floor(Math.random() * types.length)];

        const targets = Object.values(Game.rooms)[0];
        const rewards = [100, 250, 500];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];

        return this.createMission(type, targets ? targets.name : 'sim', reward);
    },
};

module.exports = MissionSystem;
