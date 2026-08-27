// Main entry point for Screeps bot
// TODO: Identify and update specific functions that render dependency graphs or

const Game = require('game');
const creepManager = require('./creepManager');
const roomManager = require('./roomManager');

function init() {
  console.log('Initializing Screeps bot...');
  creepManager.setup();
  roomManager.setup();
}

function loop() {
  const startTime = Game.cpu.getUsed();
  
  init();
  
  // Run main game logic
  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    roomManager.processRoom(room);
  }
  
  // Assign creep roles
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    creepManager.assignRole(creep);
  }
  
  const endTime = Game.cpu.getUsed();
  console.log(`Loop completed in ${(endTime - startTime).toFixed(2)} CPU`);
}

function renderDependencyGraph() {
  const dependencies = {};
  
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (!dependencies[creep.room]) {
      dependencies[creep.room] = [];
    }
    dependencies[creep.room].push({
      name: creep.name,
      role: creep.memory.role
    });
  }
  
  return dependencies;
}

function visualizeGraph(data) {
  const nodes = [];
  const edges = [];
  
  for (const roomId in data) {
    nodes.push({ id: roomId, label: `Room ${roomId}` });
    
    const roomData = data[roomId];
    roomData.forEach(creep => {
      nodes.push({ id: creep.name, label: `${creep.role} (${creep.name})` });
      edges.push({ from: roomId, to: creep.name });
    });
  }
  
  return { nodes, edges };
}

module.exports = {
  init,
  loop,
  renderDependencyGraph,
  visualizeGraph
};