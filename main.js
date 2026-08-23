// main.js - Application entry point

// Initialize the application
function initApp() {
  const canvas = document.getElementById('canvas');
  const unrotateBtn = document.getElementById('unrotate');
  
  // Rotate functionality
  let rotation = 0;
  
  function rotate() {
    rotation += 90;
    canvas.style.transform = `rotate(${rotation}deg)`;
  }
  
  function resetRotation() {
    rotation = 0;
    canvas.style.transform = `rotate(${rotation}deg)`;
  }
  
  // Attach event listeners
  canvas.addEventListener('click', rotate);
  
  // Fixed: Changed <a href="#"> to <button> for accessibility (REACT_036)
  // Using button element for in-page actions ensures proper keyboard 
  // and screen reader behavior
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', resetRotation);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initApp };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}

// Screeps AI Script - Main Entry Point
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function() {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    
    if (harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    
    if (upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }
    
    if (builders.length < 2) {
        var newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'builder'}});
    }
    
    for (var name in Game.rooms) {
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
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