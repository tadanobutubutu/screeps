// main.js - Screeps AI Entry Point

function getBlockedUpdates() {
  const blocked = [];
  return blocked;
}

function loop() {
  // Clear dead creeps from memory
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      continue;
    }
  }

  // Get blocked updates
  const blocked = getBlockedUpdates();

  // Process each creep
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    // Creep logic here
  }
}

module.exports = { loop };