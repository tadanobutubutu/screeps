var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

module.exports.loop = function() {
    var tower = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: function(structure) {
            return structure.structureType == STRUCTURE_TOWER;
        }
    });

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }

    if(tower.length > 0) {
        var closestDamagedStructure = tower[0].pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });

        if(closestDamagedStructure) {
            tower[0].repair(closestDamagedStructure);
        }

        var closestHostile = tower[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower[0].attack(closestHostile);
        }
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.7}
        );
    }

    var energy = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    var name = undefined;

    if(Game.rooms['W0N0'].memory.harvesters < 2) {
        name = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {role: 'harvester'});
        if(!(name < 0)) {
            Game.rooms['W0N0'].memory.harvesters += 1;
        }
    } else if(Game.rooms['W0N0'].memory.upgraders < 2) {
        name = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {role: 'upgrader'});
        if(!(name < 0)) {
            Game.rooms['W0N0'].memory.upgraders += 1;
        }
    } else if(Game.rooms['W0N0'].memory.builders < 2) {
        name = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {role: 'builder'});
        if(!(name < 0)) {
            Game.rooms['W0N0'].memory.builders += 1;
        }
    } else if(Game.rooms['W0N0'].memory.repairers < 2) {
        name = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {role: 'repairer'});
        if(!(name < 0)) {
            Game.rooms['W0N0'].memory.repairers += 1;
        }
    }

    if(name && name != ERR_NOT_ENOUGH_ENERGY && name < 0) {
        console.log('Error creating creep: ' + name);
    }
};