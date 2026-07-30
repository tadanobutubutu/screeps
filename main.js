// Spawn new harvesters if needed
if (harvesters.length < 2) {
  const newName = 'Harvester' + Game.time;
  Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
    memory: { role: 'harvester' },
  });
}

// Run role logic for each creep
for (const name in Game.creeps) {
  const creep = Game.creeps[name];
  if (creep.memory.role === 'harvester') {
    roleHarvester.run(creep);
  }
  if (creep.memory.role === 'upgrader') {
    roleUpgrader.run(creep);
  }
};

function init() {
  // initialization logic
}

function cleanup() {
  // cleanup logic
}