// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// TODO: Implement tower defense
class Tower {
  constructor(name, damage, range) {
    this.name = name;
    this.damage = damage;
    this.range = range;
  }

  attack() {
    return this.damage;
  }
}

class TowerDefenseGame {
  constructor() {
    this.towers = [];
    this.enemies = [];
  }

  addTower(tower) {
    this.towers.push(tower);
  }

  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  simulateTurn() {
    this.enemies.forEach((enemy) => {
      this.towers.forEach((tower) => {
        if (enemy.distanceToTower(tower) <= tower.range) {
          enemy.takeDamage(tower.attack());
        }
      });
      if (enemy.health <= 0) {
        this.enemies = this.enemies.filter(e => e !== enemy);
      }
    });
  }
}

// Exported functions
export function calculateSum(a, b) {
  return a + b;
}

export function calculateProduct(a, b) {
  return a * b;
}