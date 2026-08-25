// main.js - Screeps Game Logic

/*
 * Add ARIA role and labels for roles to improve screen reader accessibility
 */
var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // ARIA role for roleHarvester
        creep.A11yRole = 'SCREEPS_HARVESTER';

        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

/*
 * Add ARIA role for roleUpgrader
 */
var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // ARIA role for roleUpgrader
        creep.A11yRole = 'SCREEPS_UPGRADER';

        if(creep.store.getFreeCapacity() === 0) {
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = {
    roleHarvester: roleHarvester,
    roleUpgrader: roleUpgrader
};