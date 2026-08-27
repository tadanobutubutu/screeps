var React = require('react');

module.exports = {
  loop: function() {
    // Your Screeps game loop logic
    var role = Game.spawns['Spawn1'].memory.role;
    var creep = _.find(Game.creeps, {memory: {role: 'harvester'}});
    
    if (creep) {
      var harvest = creep.carry.energy < creep.carryCapacity;
      if (harvest) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      } else {
        if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.spawns['Spawn1']);
        }
      }
    }
    
    if (Memory.showStats === true) {
      return React.createElement('main', {role: 'main'}, 
        React.createElement('div', {className: 'stats'}, 
          'Energy: ' + Game.spawns['Spawn1'].energy + '/' + Game.spawns['Spawn1'].energyCapacity
        )
      );
    } else {
      return React.createElement('section', {'aria-label': 'game-stats'}, 
        React.createElement('div', null, 
          'Stats are hidden'
        )
      );
    }
  }
};