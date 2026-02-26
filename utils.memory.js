// Memory Management Utilities
// Inspired by best practices from daily update 2026-02-20

module.exports = {
    // Clean up memory of dead creeps
    cleanMemory: function () {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },

    // Safe memory access with default values
    getRoomMemory: function (roomName, key, defaultValue) {
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }

        if (Memory.rooms[roomName][key] === undefined) {
            Memory.rooms[roomName][key] = defaultValue;
        }

        return Memory.rooms[roomName][key];
    },

    setRoomMemory: function (roomName, key, value) {
        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName][key] = value;
    },

    clearRoomMemory: function (roomName, key) {
        if (Memory.rooms[roomName]) {
            delete Memory.rooms[roomName][key];
        }
    },

    // Memoization helper for expensive calculations
    memoize: function (fn, cacheKey, ttl = 100) {
        if (!Memory.cache) {
            Memory.cache = {};
        }

        const cached = Memory.cache[cacheKey];
        if (cached && Game.time - cached.timestamp < ttl) {
            return cached.value;
        }

        const result = fn();
        Memory.cache[cacheKey] = {
            value: result,
            timestamp: Game.time,
        };

        return result;
    },

    // Clean up old cache entries
    cleanCache: function (maxAge = 500) {
        if (!Memory.cache) return;

        for (let key in Memory.cache) {
            if (Game.time - Memory.cache[key].timestamp > maxAge) {
                delete Memory.cache[key];
            }
        }
    },

    // Initialize creep memory with role defaults
    initCreepMemory: function (creep, role, extraData = {}) {
        if (!creep.memory.role) {
            creep.memory.role = role;
        }

        if (!creep.memory.working) {
            creep.memory.working = false;
        }

        for (let key in extraData) {
            if (creep.memory[key] === undefined) {
                creep.memory[key] = extraData[key];
            }
        }
    },

    // Get creep working state
    updateWorkingState: function (creep) {
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            return true;
        }

        if (creep.memory.working && creep.store.getUsedCapacity() === 0) {
            creep.memory.working = false;
            return false;
        }

        return creep.memory.working;
    },
};
