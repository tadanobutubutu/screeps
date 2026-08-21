// User Safety: safe

// Main game loop logic for Screeps
module.exports = function() {
    // Your code here
    _.forEach(Game.rooms, function(room) {
        var room = Game.rooms[room.name];
        var creeps = room.find(FIND_MY_CREEPS);
        
        _.forEach(creeps, function(creep) {
            if(creep.memory.role === 'harvester') {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
            if(creep.memory.role === 'builder') {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }
        });
    });
};