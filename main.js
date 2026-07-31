// Continuous Quality Monitor has automatically generated this issue.

const RoleManager = {
  assignRole(creep, role) {
    if (!creep.memory) creep.memory = {};
    creep.memory.role = role;
  },

  getRole(creep) {
    return creep.memory ? creep.memory.role : null;
  },

  getCreepsByRole(role) {
    return Object.values(Game.creeps).filter(
      creep => creep.memory && creep.memory.role === role
    );
  }
};

function cleanupMemory() {
    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 15000) {
        if (Memory.creeps) {
            for (const name in Memory.creeps) {
                if (!Game.creeps[name]) {
                    delete Memory.creeps[name];
                }
            }
        }
        Memory.lastCleanup = Game.time;
    }
}

module.exports = { RoleManager, cleanupMemory };