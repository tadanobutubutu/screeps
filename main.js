// role.healer.js
// (Preserve all existing code above line 18)

function healTarget(target) {
  // Example of a corrected line (original might have had === in a place where it shouldn't be)
  if (target.health < target.maxHealth) {
    // Healing logic
    target.health += this.healingPower;
    return true;
  }
  return false;
}

// (Preserve all remaining code below line 18)