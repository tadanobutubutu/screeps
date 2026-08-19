import { colors } from "./constants.js";

export class RoomManager {
  constructor(room) {
    /** @type {Room} */ this.room = room;
    /** @type {RoomVisual} */ this.visual = room.visual;
    /** @type {Obstacle} */ this.obstacle = new Obstacle(room);
    /** @type {SpawnManager} */ this.spawnManager = new SpawnManager(room);
    /** @type {TowerManager} */ this.towerManager = new TowerManager(room);
    /** @type {RoomManager} */ this.roomManager = this;
  }

  update() {
    this.spawnManager.update();
    this.towerManager.update();
    this.visualizeObstacles();
    this.visualizeRoom();
  }

  visualizeRoom() {
    // Draw room outline
    this.visual.line(
      new RoomPosition(0, 0, this.room.name),
      new RoomPosition(49, 49, this.room.name),
      { color: colors.grey }
    );
    this.visual.line(
      new RoomPosition(0, 49, this.room.name),
      new RoomPosition(49, 0, this.room.name),
      { color: colors.grey }
    );
  }

  visualizeObstacles() {
    this.obstacle.visualize();
  }
}

export class SpawnManager {
  constructor(room) {
    /** @type {Room} */ this.room = room;
    /** @type {RoomVisual} */ this.visual = room.visual;
    /** @type {RoomManager} */ this.roomManager = new RoomManager(room);
  }

  update() {
    // Implementation details
  }

  visualize() {
    this.visual.text("Spawn", new RoomPosition(25, 25, this.room.name), {
      font: "12px Arial",
      fill: colors.white,
      stroke: colors.black,
    });
  }
}

export class TowerManager {
  constructor(room) {
    /** @type {Room} */ this.room = room;
    /** @type {RoomVisual} */ this.visual = room.visual;
    /** @type {RoomManager} */ this.roomManager = new RoomManager(room);
  }

  update() {
    // Implementation details
  }

  visualize() {
    this.visual.text("Tower", new RoomPosition(25, 25, this.room.name), {
      font: 12,
      fill: colors.red,
      stroke: colors.darkred,
    });
  }
}

export class Obstacle {
  constructor(room) {
    /** @type {Room} */ this.room = room;
    /** @type {RoomVisual} */ this.visual = room.visual;
  }

  visualize() {
    // Implementation details
  }
}

export class Builder {
  constructor(room) {
    /** @type {Room} */ this.room = room;
    /** @type {RoomVisual} */ this.visual = room.visual;
  }

  update() {
    // Implementation details
  }

  work() {
    // Implementation details
  }
}

export class DependencyGraph {
  constructor() {
    /** @type {Map<string, string[]>} */ this.dependencies = new Map();
  }

  add(source, target) {
    if (!this.dependencies.has(source)) {
      this.dependencies.set(source, []);
    }
    const deps = this.dependencies.get(source);
    if (!deps.includes(target)) {
      deps.push(target);
    }
  }

  generateHTML() {
    let html = '<table class="dependency-table"><thead><tr>';
    const sources = Array.from(this.dependencies.keys());
    for (const source of sources) {
      html += `<th scope="col"><div>${source}</div></th>`;
    }
    html += "</tr></thead><tbody>";
    const targets = new Set();
    for (const [source, deps] of this.dependencies.entries()) {
      html += `<tr><td><div>${source}</div></td>`;
      for (const target of deps) {
        targets.add(target);
        html += `<td><div>${target}</div></td>`;
      }
      html += "</tr>";
    }
    html += "</tbody></table>";
    return html;
  }
}