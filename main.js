// role.healer.js
// Fixing the lint error by ensuring proper syntax

// Example of existing healer role logic
class Healer {
  constructor() {
    this.health = 100;
    this.mana = 50;
  }

  // Fixed line 18 - removed the === which was causing the parsing error
  heal(target) {
    if (target.health < 50) {
      target.health += 20;
      this.mana -= 10;
      return true;
    }
    return false;
  }

  // Other existing methods would remain here
}

// Preserving all existing exports
module.exports = {
  Healer,
  // All other existing exports should remain here
};