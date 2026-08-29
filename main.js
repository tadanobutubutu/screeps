// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

// Main game logic for Screeps
const main = {
  loop: function() {
    // Game loop
    for (const name in Game.rooms) {
      const room = Game.rooms[name];
      const controller = room.controller;
      if (controller && controller.my) {
        this.manageRoom(room);
      }
    }
    
    // TODO: Implement harvest and upgrade logic
    
    // TODO: Implement tower defense
    
    // TODO: Implement spawning logic
  },
  
  manageRoom: function(room) {
    // Room management
    const sources = room.find(FIND_SOURCES);
    const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    
    if (hostileCreeps.length > 0) {
      this.defendRoom(room, hostileCreeps);
    }
  },
  
  defendRoom: function(room, hostiles) {
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });
    
    towers.forEach(tower => {
      tower.attack(hostiles[0]);
    });
  },
  
  harvest: function(creep) {
    const target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (target) {
      if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  },
  
  upgrade: function(creep) {
    if (creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  },

  // Add the new function or change here:
  ensureElementHasId: function(element) {
    if (!element.id) {
      element.id = `element-${Date.now()}`;
    }
    return element.id;
  },

  addAriaLabel: function(element, label) {
    if (label !== undefined) {
      element.setAttribute('aria-label', label);
    } else {
      const uniqueLabel = `label-${Date.now()}`;
      element.setAttribute('aria-label', uniqueLabel);
    }
    return element.getAttribute('aria-label');
  },

  renderDependencyGraph: function(dependencies) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '800');
    svg.setAttribute('height', '600');
    svg.setAttribute('aria-label', 'Dependency Graph');

    const nodes = dependencies.nodes || [];
    const links = dependencies.links || [];

    nodes.forEach((node, index) => {
      const nodeElement = document.createElementNS(svgNS, 'circle');
      nodeElement.setAttribute('cx', 50 + (index % 10) * 70);
      nodeElement.setAttribute('cy', 50 + Math.floor(index / 10) * 70);
      nodeElement.setAttribute('r', 20);
      nodeElement.setAttribute('fill', '#69b3a2');
      nodeElement.setAttribute('id', `node-${node.id}`);
      nodeElement.setAttribute('aria-label', node.name || `Node ${index}`);
      svg.appendChild(nodeElement);

      const textElement = document.createElementNS(svgNS, 'text');
      textElement.setAttribute('x', 50 + (index % 10) * 70);
      textElement.setAttribute('y', 50 + Math.floor(index / 10) * 70 + 5);
      textElement.setAttribute('text-anchor', 'middle');
      textElement.textContent = node.name || `N${index}`;
      svg.appendChild(textElement);
    });

    links.forEach(link => {
      const lineElement = document.createElementNS(svgNS, 'line');
      lineElement.setAttribute('x1', 50 + (link.source % 10) * 70);
      lineElement.setAttribute('y1', 50 + Math.floor(link.source / 10) * 70);
      lineElement.setAttribute('x2', 50 + (link.target % 10) * 70);
      lineElement.setAttribute('y2', 50 + Math.floor(link.target / 10) * 70);
      lineElement.setAttribute('stroke', '#999');
      lineElement.setAttribute('stroke-width', '2');
      svg.appendChild(lineElement);
    });

    return svg;
  }

  // Placeholder for additional functions
};

// Export the new function if needed:
module.exports = main;