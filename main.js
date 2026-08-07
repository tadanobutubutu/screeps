// role.healer.js
// This is a template - replace with your actual code but fix the syntax error

// Example of a correctly formatted healer role
class Healer {
  constructor() {
    this.health = 100;
    this.energy = 50;
  }

  heal(target) {
    if (target.health < 100 && this.energy >= 10) {
      target.health += 10;
      this.energy -= 10;
      return true;
    }
    return false;
  }

  // Fixed line 18 example (if the error was a comparison)
  canHeal(target) {
    return target.health < 100 && this.energy >= 10;
  }
}

module.exports = Healer;