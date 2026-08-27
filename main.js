// User Safety: safe

// Merge conflict resolved - keeping both implementations with proper checking
const myFunction = (arg) => {
  // Implementation
  return arg * 2;
};

// Fix the method call syntax - add dot notation
if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
  creep.moveTo(creep.room.controller);
}

// Ensure no duplicate declarations exist
function processCreep(creep) {
  if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller);
  }
}

// Additional helper functions
function harvestEnergy(creep) {
  const sources = creep.room.find(FIND_SOURCES);
  if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
    creep.moveTo(sources[0]);
  }
}

function buildStructure(creep, target) {
  if (creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target);
  }
}

function transferEnergy(creep, target) {
  if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target);
  }
}

// Main role assignment
Creep.prototype.work = function() {
  if (this.memory.role === 'harvester') {
    harvestEnergy(this);
  } else if (this.memory.role === 'builder') {
    const targets = this.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
      buildStructure(this, targets[0]);
    }
  } else if (this.memory.role === 'upgrader') {
    if (this.upgradeController(this.room.controller) === ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller);
    }
  }
};

// Export modules
module.exports = {
  myFunction,
  processCreep,
  harvestEnergy,
  buildStructure,
  transferEnergy
};