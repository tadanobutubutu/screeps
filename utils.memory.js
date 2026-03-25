// Memory Management Utilities
// Inspired by best practices from daily update 2026-02-20

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded objects can crash the AI.
 */
const MAX_KEY_LENGTH = 256;
const MAX_CACHE_ENTRIES = 50;

/**
 * Security: Validates that a key is safe to use for object access.
 * Prevents Prototype Pollution attacks by blocking special properties.
 * Also enforces length limits to prevent Memory DoS.
 * Defined as a local constant to avoid 'this' context issues during destructuring.
 */
const isSafeKey = (key) => {
    // Numbers are always safe keys in JavaScript objects
    if (typeof key === 'number') return true;
    // Only allow safe strings and block dangerous properties
    const dangerousKeys = [
        '__proto__',
        'constructor',
        'prototype',
        '__defineGetter__',
        '__defineSetter__',
        '__lookupGetter__',
        '__lookupSetter__',
        'toString',
        'valueOf',
        'hasOwnProperty',
        'toLocaleString',
        'isPrototypeOf',
        'propertyIsEnumerable',
    ];
    return typeof key === 'string' && key.length <= MAX_KEY_LENGTH && !dangerousKeys.includes(key);
};

module.exports = {
    // Clean up memory of dead creeps
    cleanMemory: function () {
        if (!Memory.creeps) return 0;
        let cleaned = 0;
        for (const name in Memory.creeps) {
            // Security: Use isSafeKey and hasOwnProperty to prevent prototype pollution during iteration
            if (
                isSafeKey(name) &&
                Object.prototype.hasOwnProperty.call(Memory.creeps, name) &&
                !Game.creeps[name]
            ) {
                delete Memory.creeps[name];
                cleaned++;
            }
        }
        return cleaned;
    },

    // Exported version of isSafeKey
    isSafeKey: isSafeKey,

    // Safe memory access with default values
    getRoomMemory: function (roomName, key, defaultValue) {
        // Security: Validate roomName and key to prevent prototype pollution
        if (!isSafeKey(roomName) || !isSafeKey(key)) {
            return defaultValue;
        }

        if (!Memory.rooms) {
            Memory.rooms = {};
        }

        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }

        if (Memory.rooms[roomName][key] === undefined) {
            Memory.rooms[roomName][key] = defaultValue;
        }

        return Memory.rooms[roomName][key];
    },

    setRoomMemory: function (roomName, key, value) {
        // Security: Validate roomName and key to prevent prototype pollution
        if (!isSafeKey(roomName) || !isSafeKey(key)) {
            return;
        }

        if (!Memory.rooms) {
            Memory.rooms = {};
        }

        if (!Memory.rooms[roomName]) {
            Memory.rooms[roomName] = {};
        }
        Memory.rooms[roomName][key] = value;
    },

    clearRoomMemory: function (roomName, key) {
        // Security: Validate roomName and key to prevent prototype pollution
        if (!isSafeKey(roomName) || !isSafeKey(key)) {
            return;
        }

        if (!Memory.rooms) {
            return;
        }

        if (Memory.rooms[roomName]) {
            delete Memory.rooms[roomName][key];
        }
    },

    // Memoization helper for expensive calculations
    memoize: function (fn, cacheKey, ttl = 100) {
        // Security: Validate cacheKey to prevent prototype pollution
        if (!isSafeKey(cacheKey)) {
            return fn();
        }

        if (!Memory.cache) {
            Memory.cache = {};
        }

        const cached = Memory.cache[cacheKey];
        if (cached && Game.time - cached.timestamp < ttl) {
            return cached.value;
        }

        // Security: Cap the number of cache entries to prevent Memory DoS
        if (!cached && Object.keys(Memory.cache).length >= MAX_CACHE_ENTRIES) {
            return fn();
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
        if (!Memory.cache) {
            return;
        }

        for (const key in Memory.cache) {
            // Security: Use isSafeKey and hasOwnProperty to prevent prototype pollution during iteration
            if (isSafeKey(key) && Object.prototype.hasOwnProperty.call(Memory.cache, key)) {
                if (Game.time - Memory.cache[key].timestamp > maxAge) {
                    delete Memory.cache[key];
                }
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

        for (const key in extraData) {
            // Security: Use isSafeKey and hasOwnProperty when merging extraData
            if (
                isSafeKey(key) &&
                Object.prototype.hasOwnProperty.call(extraData, key) &&
                creep.memory[key] === undefined
            ) {
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
