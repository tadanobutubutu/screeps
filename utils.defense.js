const DefenseManager = {
  findTowerTargets(room) {
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_TOWER
    });

    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const damagedStructures = room.find(FIND_STRUCTURES, {
      filter: s => s.hits && s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
    });
    const damagedWalls = room.find(FIND_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_WALL && s.hits < 100000
    });

    towers.forEach(tower => {
      if (hostiles.length > 0) {
        tower.attack(hostiles[0]);
      } else if (damagedStructures.length > 0) {
        tower.repair(damagedStructures[0]);
      } else if (damagedWalls.length > 0) {
        tower.repair(damagedWalls[0]);
      }
    });
  },

  getDefenseStatus(room) {
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_TOWER
    });
    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const ramparts = room.find(FIND_MY_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_RAMPART
    });

    return {
      towers: towers.length,
      hostiles: hostiles.length,
      ramparts: ramparts.length,
      underAttack: hostiles.length > 0,
    };
  },
};

module.exports = DefenseManager;
