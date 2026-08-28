var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports = {
  loop: function() {
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(structure) {
          return structure.hits < structure.hitsMax;
        }
      });
      if(closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }
      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(closestHostile) {
        tower.attack(closestHostile);
      }
    }

    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    var harvesters = _.filter(Game.creeps, function(creep) {
      return creep.memory.role == 'harvester';
    });
    if(harvesters.length < 2) {
      var newName = 'Harvester' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
        {memory: {role: 'harvester'}});
    }

    var upgraders = _.filter(Game.creeps, function(creep) {
      return creep.memory.role == 'upgrader';
    });
    if(upgraders.length < 1) {
      var newName = 'Upgrader' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
        {memory: {role: 'upgrader'}});
    }

    var builders = _.filter(Game.creeps, function(creep) {
      return creep.memory.role == 'builder';
    });
    if(builders.length < 1) {
      var newName = 'Builder' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
        {memory: {role: 'builder'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
      var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
      Game.spawns['Spawn1'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn1'].pos.x + 1,
        Game.spawns['Spawn1'].pos.y,
        {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.role == 'harvester') {
        roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
        roleUpgrader.run(creep);
      }
      if(creep.memory.role == 'builder') {
        roleBuilder.run(creep);
      }
    }
  }
};