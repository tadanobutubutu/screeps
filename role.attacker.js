/**
 * role.attacker.js
 * Attacker creep role: attacks hostile creeps and structures.
 * Body: [TOUGH, MOVE, ATTACK, ATTACK, MOVE, TOUGH]
 */

const roleAttacker = {
  /**
   * Main run function called every tick.
   * @param {Creep} creep
   */
  run(creep) {
    // Heal self if damaged and healer not available
    if (creep.hits < creep.hitsMax * 0.5) {
      const healTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (c) => c.getActiveBodyparts(HEAL) > 0,
      });
      if (healTarget) {
        creep.moveTo(healTarget, { visualizePathStyle: { stroke: '#00ff00' } });
        return;
      }
    }

    // Priority 1: Attack hostile creeps in range
    const hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostileCreep) {
      if (creep.attack(hostileCreep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(hostileCreep, {
          visualizePathStyle: { stroke: '#ff0000' },
          reusePath: 3,
        });
      }
      return;
    }

    // Priority 2: Attack invader core or hostile structures
    const hostileStructure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
      filter: (s) =>
        s.structureType === STRUCTURE_INVADER_CORE ||
        s.structureType === STRUCTURE_TOWER ||
        s.structureType === STRUCTURE_SPAWN,
    });
    if (hostileStructure) {
      if (creep.attack(hostileStructure) === ERR_NOT_IN_RANGE) {
        creep.moveTo(hostileStructure, {
          visualizePathStyle: { stroke: '#ff4400' },
          reusePath: 3,
        });
      }
      return;
    }

    // Priority 3: Patrol flag or room center when idle
    const flag = Game.flags['attack'] || Game.flags['Attack'];
    if (flag) {
      creep.moveTo(flag, { visualizePathStyle: { stroke: '#ffaa00' } });
    } else {
      // Move to room controller area as default patrol point
      const controller = creep.room.controller;
      if (controller) {
        creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffaa00' }, range: 5 });
      }
    }
  },
};

module.exports = roleAttacker;
