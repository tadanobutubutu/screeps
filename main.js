// Main game loop - Screeps
module.exports = {
  loop: function() {
    // Existing game logic
    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var roleBuilder = require('role.builder');
    
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.role === 'harvester') {
        roleHarvester.run(creep);
      }
      if(creep.memory.role === 'upgrader') {
        roleUpgrader.run(creep);
      }
      if(creep.memory.role === 'builder') {
        roleBuilder.run(creep);
      }
    }
    
    // Memory cleanup
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
    
    // Conditional rendering logic for Dashboard component
    // Assuming the Dashboard component is conditionally rendered based on some state
    // This is a placeholder for the conditional rendering logic, which should be handled within the component itself
    // and not in the main.js file.
  }
};