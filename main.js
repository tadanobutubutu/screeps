// TODO: Identify and update specific functions that render dependency graphs or

/**
 * Main game loop for Screeps
 * This function is called every tick
 */
function loop() {
    // Get current creep memory and state
    const creeps = Object.values(Game.creeps);
    
    // Process each creep
    creeps.forEach(creep => {
        // Check if creep is working
        if (creep.memory.working && creep.store.getUsedCapacity() === 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        
        // Execute creep role based on memory
        if (creep.memory.role === 'harvester') {
            if (!creep.memory.working) {
                const sources = creep.room.find(FIND_SOURCES);
                if (sources.length > 0) {
                    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            } else {
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION ||
                                structure.structureType === STRUCTURE_SPAWN ||
                                structure.structureType === STRUCTURE_TOWER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    });
}

// Export the loop function for Screeps
module.exports = {
    loop: loop
};