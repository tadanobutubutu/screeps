// Main game logic for Screeps

const main = {
  loop: function() {
    // Game loop
    for (const name in Game.rooms) {
      const room = Game.rooms[name];
      const controller = room.controller;
      if (controller && controller.my) {
        this.manageRoom(room);
      }
    }
    
    // Implement harvest and upgrade logic
    for (const creep of Game.creeps) {
      if (creep.memory.role === 'harvester') {
        this.harvest(creep);
      } else if (creep.memory.role === 'upgrader') {
        this.upgrade(creep);
      }
    }
    
    // Implement tower defense
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      const towers = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
      });
      const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
      
      if (hostileCreeps.length > 0) {
        towers.forEach(tower => {
          tower.attack(hostileCreeps[0]);
        });
      }
    }
    
    // Implement spawning logic
    if (Game.time % 5 === 0) { // Check to spawn a creep every 5 ticks
      this.spawnCreep();
    }
  },
  
  manageRoom: function(room) {
    // Room management
    const sources = room.find(FIND_SOURCES);
    const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    
    if (hostileCreeps.length > 0) {
      this.defendRoom(room, hostileCreeps);
    }
  },
  
  defendRoom: function(room, hostiles) {
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });
    
    towers.forEach(tower => {
      tower.attack(hostiles[0]);
    });
  },
  
  harvest: function(creep) {
    const target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (target) {
      if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  },
  
  upgrade: function(creep) {
    if (creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  },
  
  spawnCreep: function() {
    const spawn = this.getClosestSpawn();
    if (spawn && spawn.spawning === null) {
      const creepBody = [WORK, CARRY, MOVE];
      const creepMemory = { role: 'harvester' };
      const result = spawn.spawnCreep(creepBody, 'Harvester' + Game.time, { memory: creepMemory });
      if (result === OK) {
        console.log('Spawning new harvester creep');
      }
    }
  },
  
  getClosestSpawn: function() {
    let closestSpawn = null;
    let closestDistance = Infinity;
    for (const spawn of Game.spawns) {
      const distance = spawn.pos.getRangeTo(Game.creeps[0].pos);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSpawn = spawn;
      }
    }
    return closestSpawn;
  }
};

module.exports = main;