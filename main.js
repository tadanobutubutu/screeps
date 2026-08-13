// role.healer.js
// (Your existing imports and code above line 18)

function healTarget(target) {
  // Example of a properly formatted function
  if (target.health < target.maxHealth) {
    // Healing logic
    target.health += 10;
    return true;
  }
  return false;
}

// (Your existing code below line 18)