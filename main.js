module.exports.loop = function() {
    var creep = Game.creeps['Harvester1'];
    
    if(creep == undefined) {
        if(Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Harvester1') == 0) {
            console.log('Spawning Harvester1');
        }
    }
    
    if(creep != undefined) {
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
};