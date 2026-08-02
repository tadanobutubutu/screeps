var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

StructureSpawn.prototype.createCustomCreep = function(energy) {
    var body = [];
    var totalEnergy = this.room.energyCapacityAvailable;
    var cost = 0;
    
    if (totalEnergy >= 300) {
        // Large harvester
        body = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
    } else if (totalEnergy >= 200) {
        // Medium harvester
        body = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
    } else {
        // Small harvester based on available energy
        var workCount = Math.floor(energy / 200);
        var carryCount = 1;
        var moveCount = Math.ceil((workCount + carryCount) / 2);
        
        for (var i = 0; i < workCount; i++) {
            body.push(WORK);
        }
        body.push(CARRY);
        for (var j = 0; j < moveCount; j++) {
            body.push(MOVE);
        }
    }
    
    var creepName = 'Harvester' + Game.time;
    var result = this.createCreep(body, creepName, { role: 'harvester' });
    
    if (result === OK || result === name) {
        console.log('Spawned new harvester: ' + creepName);
    } else {
        console.log('Failed to spawn harvester: ' + result);
    }
    
    return result;
};

module.exports = {
    createCustomCreep: StructureSpawn.prototype.createCustomCreep
};