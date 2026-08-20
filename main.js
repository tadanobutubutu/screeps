// Main game loop for Screeps
module.exports.loop = function() {
    // Spawn basic harvester if we have enough energy
    if (Game.spawns['Spawn1'] && Game.spawns['Spawn1'].energy >= 200) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
    }
    
    // Iterate through all creeps and perform actions based on role
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if (creep.memory.role === 'harvester') {
            // Find dropped energy and pick it up
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
    
    // Clean up dead creeps from memory
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
};