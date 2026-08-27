// Main game loop - Screeps

// Helper function to get language attribute
function getLangAttribute(creep) {
  return creep.memory.lang || 'en';
}

// Helper function to get full language attribute
function getFullLangAttribute(creep) {
  var lang = getLangAttribute(creep);
  return 'lang-' + lang;
}

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
  }
};