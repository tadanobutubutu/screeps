const roleTransporter = {
  run: function(creep) {
    creep.say('🚚');

    if (creep.memory.transporting && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.transporting = false;
    }
    if (!creep.memory.transporting && creep.store.getFreeCapacity() === 0) {
      creep.memory.transporting = true;
    }

    if (creep.memory.transporting) {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: s => (
          (s.structureType === STRUCTURE_SPAWN ||
           s.structureType === STRUCTURE_EXTENSION ||
           s.structureType === STRUCTURE_TOWER ||
           s.structureType === STRUCTURE_LAB) &&
          s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        )
      });

      if (targets.length > 0) {
        const closest = creep.pos.findClosestByRange(targets);
        if (creep.transfer(closest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(closest, { visualizePathStyle: { stroke: '#00ffff' } });
        }
      }
    } else {
      const containers = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
      });

      const storage = creep.room.storage;
      const sources = [];

      if (storage && storage.store[RESOURCE_ENERGY] > 1000) {
        sources.push(storage);
      }
      sources.push(...containers);

      if (sources.length > 0) {
        const closest = creep.pos.findClosestByRange(sources);
        if (creep.withdraw(closest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(closest, { visualizePathStyle: { stroke: '#ffff00' } });
        }
      }
    }
  }
};

module.exports = roleTransporter;
