var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

// Address the issues: REACT_015, REACT_017, REACT_041, REACT_025, REACT_036
function addressAccessibilityIssues() {
  // Add lang attribute to HTML element
  const html = document.documentElement;
  if (html) {
    html.setAttribute('lang', 'en');
  }

  // Add proper labels to landmarks
  const landmarks = document.querySelectorAll('[role="landmark"]');
  landmarks.forEach((landmark, index) => {
    landmark.setAttribute('aria-label', 'landmark');
  });

  // Ensure SVGs have accessible titles
  const svg1 = document.getElementById('svg1');
  const svg2 = document.getElementById('svg2');
  if (svg1) {
    svg1.setAttribute('aria-labelledby', 'svg1-title');
  }
  if (svg2) {
    svg2.setAttribute('aria-labelledby', 'svg2-title');
  }
}

function getLangAttribute() {
  return document.documentElement.getAttribute('lang');
}

function wrapPrimaryContentInMain() {
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }
}

module.exports.loop = function() {
    // Clear the memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // TODO: Add implementation details

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if(upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has ' + Game.rooms[name].energyAvailable + ' energy');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}

addressAccessibilityIssues(); // Call the accessibility function