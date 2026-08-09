// role.healer.js
// (Preserving all existing code and structure)
function healTarget(creep) {
  // Find the target with the lowest health
  const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: (c) => c.hits < c.hitsMax
  });

  if (target) {
    // Use !== instead of === for comparison
    if (creep.heal(target) !== OK) {
      creep.rangedHeal(target);
    }
  }
}

// Other existing functions and exports remain unchanged