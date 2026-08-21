const loop = () => {
  for (const name in Game.rooms) {
    const room = Game.rooms[name];
    const controller = room.controller;
    if (controller && controller.my) {
      // Spawn creeps if we have fewer than 5
      if (Object.keys(Game.creeps).length < 5) {
        const body = [WORK, CARRY, MOVE];
        const name = `Harvester${Game.time}`;
        Game.spawns.Spawn1.spawnCreep(body, name);
      }
    }
  }
};