const roleMedic = {
  run: function(creep) {
    creep.say('💊');

    if (creep.memory.healing && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.healing = false;
    }
    if (!creep.memory.healing && creep.store.getFreeCapacity() === 0) {
      creep.memory.healing = true;
    }

    if (creep.memory.healing) {
      const injured = creep.room.find(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax
      });

      if (injured.length > 0) {
        const target = injured[0];
        if (creep.heal(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
        }
      } else {
        const sources = creep.room.find(FIND_SOURCES_ACTIVE);
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
          }
        }
      }
    } else {
      const injured = creep.room.find(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax
      });

      if (injured.length > 0) {
        const target = injured[0];
        if (creep.rangedHeal(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
        }
      }
    }
  }
};

module.exports = roleMedic;
