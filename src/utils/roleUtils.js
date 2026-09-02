
'use strict';

const cache = require('./cache');
const pathfinder = require('./pathfinder');
const { MEMORY_KEYS } = require('../constants');

/**
 * Common storage energy retrieval logic
 * @param {Creep} creep
 * @param {Room} room
 * @param {number} minEnergy
 * @param {string} targetKey Memory key to store the target ID
 * @returns {boolean}
 */
function getEnergyFromStorage(creep, room, minEnergy = 500, targetKey = MEMORY_KEYS.TARGET_ID) {
    // ⚡ PERFORMANCE OPTIMIZATION: Check if cached storage target in memory is still valid before performing cache lookup
    const savedId = creep.memory[targetKey];
    if (savedId) {
        const target = Game.getObjectById(savedId);
        if (target && target.structureType === STRUCTURE_STORAGE && target.store && target.store[RESOURCE_ENERGY] >= minEnergy) {
            if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                pathfinder.moveTo(creep, target, { range: 1 });
            }
            return true;
        }
    }

    const storage = cache.getStorage(room);
    if (storage && storage.store && storage.store[RESOURCE_ENERGY] >= minEnergy) {
        creep.memory[targetKey] = storage.id;
        if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, storage, { range: 1 });
        }
        return true;
    }
    return false;
}

module.exports = {
    getEnergyFromStorage
};
