// main.js - Screeps AI Script
// Accessible table structure with proper scope attributes

const profile = require('profile');

// Table structure with accessibility attributes
function getTableHTML() {
  return `
  <table>
    <thead>
      <tr>
        <th scope="col">Source</th>
        <th scope="col">Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">src/constants.js</th>
        <td>${profile.constants}</td>
      </tr>
    </tbody>
  </table>
  `;
}

function loop() {
  const towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
  
  for (const tower of towers) {
    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    } else {
      const closestDamaged = tower.pos.findClosestByRange(
        FIND_STRUCTURES,
        { filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL }
      );
      if (closestDamaged) {
        tower.repair(closestDamaged);
      }
    }
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
    if (creep.memory.role === 'upgrader') {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  }

  // Spawn logic
  const harvesters = _.filter(Game.creeps, c => c.memory.role === 'harvester').length;
  const upgraders = _.filter(Game.creeps, c => c.memory.role === 'upgrader').length;

  if (harvesters < 2) {
    const newName = 'Harvester' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } });
  } else if (upgraders < 1) {
    const newName = 'Upgrader' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'upgrader' } });
  }
}

module.exports = {
  loop: loop,
  getTableHTML: getTableHTML
};