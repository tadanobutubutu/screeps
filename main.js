var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

StructureSpawn.prototype.createCustomCreep =
    function(energy, roleName) {
        var body = [];
        for (var i = 0; i < Math.floor(energy / 150); i++) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }
        
        if (body.length > 0) {
            return this.createCreep(body, undefined, { role: roleName });
        }
        return ERR_NOT_ENOUGH_RESOURCES;
    };

module.exports.loop = function() {
    var tower = Game.getObjectById('TOWER_ID');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure) {
                return structure.hits < structure.hitsMax;
            }
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
};