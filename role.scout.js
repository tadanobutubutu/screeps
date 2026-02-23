const roleScout = {
  run: function(creep) {
    if (!creep.memory.targetRoom) {
      const rooms = Object.keys(Game.map.describeExits(creep.room.name));
      if (rooms.length > 0) {
        creep.memory.targetRoom = rooms[Math.floor(Math.random() * rooms.length)];
      }
    }

    if (creep.memory.targetRoom) {
      if (creep.room.name !== creep.memory.targetRoom) {
        const exitDir = Game.map.findExit(creep.room.name, creep.memory.targetRoom);
        const exit = creep.room.findExitTo(creep.memory.targetRoom);
        if (exitDir !== ERR_NO_PATH && exit !== ERR_NO_PATH) {
          creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom));
        }
      } else {
        creep.say('🔍');

        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        const resources = creep.room.find(FIND_DROPPED_RESOURCES);
        const structures = creep.room.find(FIND_STRUCTURES);

        if (!creep.memory.visited) {
          creep.memory.visited = {};
        }

        if (!creep.memory.visited[creep.room.name]) {
          creep.memory.visited[creep.room.name] = {
            time: Game.time,
            hostiles: hostiles.length,
            resources: resources.length,
            structures: structures.length,
          };
          console.log(`🗺️ Scout visited ${creep.room.name}: hostiles=${hostiles.length}, resources=${resources.length}, structures=${structures.length}`);
        }

        creep.memory.targetRoom = undefined;
      }
    }
  }
};

module.exports = roleScout;
