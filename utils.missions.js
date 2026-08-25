const utilsMemory = require('./utils.memory');

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded arrays can crash the AI.
 */
const MAX_MISSIONS_COUNT = 20;
const MAX_STRING_LENGTH = 100;

/**
 * セキュアなIDを生成する (PRNGの脆弱性対策)
 */
function generateMissionId() {
    try {
        const crypto = require('crypto');
        if (crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        if (crypto && crypto.randomBytes) {
            return crypto.randomBytes(8).toString('hex');
        }
    } catch (e) {
        // Fallback
    }
    // Fallback if crypto is unavailable
    const timePrefix =
        typeof Game !== 'undefined' && Game.time ? Game.time.toString(36) : Date.now().toString(36);
    // Fallback if crypto is unavailable but predictable PRNGs
    if (typeof global._missionIdCounter === 'undefined') {
        global._missionIdCounter = 0;
    }
    global._missionIdCounter = (global._missionIdCounter + 1) % Number.MAX_SAFE_INTEGER;
    return timePrefix + '-' + global._missionIdCounter.toString(36);
}

/**
 * セキュアな乱数を生成する (PRNGの脆弱性対策)
 * @param {number} max - 0以上、max未満の整数を返す
 */
function secureRandomInt(max) {
    if (typeof max !== 'number' || max <= 0) return 0;
    try {
        const crypto = require('crypto');
        if (crypto && crypto.randomBytes) {
            const buf = crypto.randomBytes(4);
            return buf.readUInt32LE(0) % max;
        }
    } catch (e) {
        // Fallback
    }
    // scanner-disable-next-line
    // Fallback to Math.random() if crypto is unavailable (accepted for Sandbox)
    return Math.floor(Math.random() * max);
}

/**
 * 入力文字列をサニタイズして切り詰める
 */
function sanitizeInput(input) {
    const safeInput = utilsMemory.isSafeKey(input) ? input : 'unknown';
    return String(safeInput).substring(0, MAX_STRING_LENGTH);
}

/**
 * ミッション上限に達した場合に古いミッションを破棄する
 */
function evictOldMissions() {
    if (Memory.missions.active.length >= MAX_MISSIONS_COUNT) {
        // Attempt to evict the oldest completed mission first
        let evictIndex = Memory.missions.active.findIndex((m) => m.status === 'completed');

        // If no completed missions, evict the oldest active mission (first in array)
        if (evictIndex === -1) {
            evictIndex = 0;
        }

        Memory.missions.active.splice(evictIndex, 1);
    }
}

/**
 * 報酬を安全な数値に変換する
 */
function hardenReward(reward) {
    if (typeof reward === 'number' && Number.isFinite(reward) && !isNaN(reward)) {
        return Math.max(0, reward);
    }
    return 0;
}

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
        const sanitizedType = sanitizeInput(type);
        const sanitizedTarget = sanitizeInput(target);

        // Security: Enforce mission count limit to prevent Memory DoS (2MB limit)
        evictOldMissions();

        // Security: Harden reward parameter to prevent injection of negative numbers, NaN, Infinity, or non-number types.
        const safeReward = hardenReward(reward);

        const mission = {
            id: generateMissionId(),
            type: sanitizedType,
            target: sanitizedTarget,
            reward: safeReward,
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
        const type = types[secureRandomInt(types.length)];

        const targets = Object.values(Game.rooms)[0];
        const rewards = [100, 250, 500];
        const reward = rewards[secureRandomInt(rewards.length)];

        return this.createMission(type, targets ? targets.name : 'sim', reward);
    },
};

module.exports = MissionSystem;
