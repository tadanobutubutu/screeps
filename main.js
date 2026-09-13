const fs = require('fs');
const path = require('path');

// Import accessibility helper functions
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibility');

/**
 * Gets the accessible name of an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name from.
 * @returns {string|null} The accessible name or null if not found.
 */
function checkLandmarks(htmlContent) {
  const result = {
    landmarks: [],
    warnings: []
  };

  LANDMARK_ELEMENTS.forEach(element => {
    const regex = new RegExp(`<${element}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      result.landmarks.push({
        element: element,
        count: matches.length
      });
    }
  });

  return result;
}

function countDependencies() {
  // Existing function implementation

  // New implementation to count dependencies using Document and regex
  const importCommentRegExp = /import\s+.*?from\s+['"].*?['"]/g;
  const importCount = (document.body.textContent || '').match(importCommentRegExp) || [];
  return importCount;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  // Existing code
  announcements: [],

  // New property to count dependencies
  countDependencies,

  // Method to add announcements for screen readers
  announce(message) {
    this.announcements.push({
      message,
      timestamp: Date.now()
    });
  },

  // Get current announcements
  getAnnouncements() {
    return this.announcements;
  },

  // Clear announcements
  clearAnnouncements() {
    this.announcements = [];
  }
};

// ... (Existing code with the TODO comments remains the same)

export function MainApp() {
  return (
    <div lang="en">
      // React code for MainApp component
    </div>
  );
}

// Update scope attributes in all .html files in the views directory
const viewsDir = path.join(__dirname, 'views');
if (fs.existsSync(viewsDir)) {
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      updateThScopeAttribute(filePath, content);
    });
}

function checkLandmarks(htmlContent) {
  // Existing function implementation
  return {
    main: '<main role="main"></main>',
    nav: '<nav role="navigation" aria-label="Main navigation"></nav>',
    header: '<header role="banner"></header>',
    footer: '<footer role="contentinfo"></footer>'
  };
}

/**
 * Renders the index view with game status dashboard
 * @returns {Object} - Object containing the rendered view data
 */
function renderIndexView() {
  const viewData = {
    timestamp: Date.now(),
    gameTime: Game.time,
    stats: {
      cpu: {
        limit: Game.cpu.limit,
        used: Game.cpu.getUsed(),
        bucket: Game.cpu.bucket
      },
      memory: {
        usage: JSON.stringify(Memory).length
      },
      gcl: {
        level: Game.gcl.level,
        progress: Game.gcl.progress,
        progressTotal: Game.gcl.progressTotal
      },
      mysql: {
        level: Game.MYSQL ? Game.MYSQL.level : 0,
        progress: Game.MYSQL ? Game.MYSQL.progress : 0,
        progressTotal: Game.MYSQL ? Game.MYSQL.progressTotal : 0
      }
    },
    rooms: {},
    creeps: {
      count: Object.keys(Game.creeps).length,
      byRole: {}
    },
    structures: {
      count: Object.keys(Game.structures).length,
      byType: {}
    },
    spawns: {
      count: Object.keys(Game.spawns).length,
      active: []
    }
  };

  // Gather room information
  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    viewData.rooms[roomName] = {
      controller: room.controller ? {
        level: room.controller.level,
        progress: room.controller.progress,
        progressTotal: room.controller.progressTotal
      } : null,
      energy: {
        available: room.energyAvailable,
        capacity: room.energyCapacityAvailable
      },
      sources: room.find(FIND_SOURCES).length,
      mineral: room.find(FIND_MINERALS)[0] || null
    };
  }

  // Gather creep information by role
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    const role = creep.memory.role || 'unknown';
    if (!viewData.creeps.byRole[role]) {
      viewData.creeps.byRole[role] = 0;
    }
    viewData.creeps.byRole[role]++;
  }

  // Gather structure information by type
  for (const structId in Game.structures) {
    const struct = Game.structures[structId];
    const structType = struct.structureType;
    if (!viewData.structures.byType[structType]) {
      viewData.structures.byType[structType] = 0;
    }
    viewData.structures.byType[structType]++;
  }

  // Gather active spawns
  for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    viewData.spawns.active.push({
      name: spawnName,
      spawning: spawn.spawning !== null,
      room: spawn.room.name
    });
  }

  // Accessibility: Announce view update for screen readers
  a11yStore.announce(`Index view updated. ${viewData.creeps.count} creeps, ${Object.keys(viewData.rooms).length} rooms.`);

  return viewData;
}

// Main loop structure for Screeps
module.exports = {
  loop() {
    // Clear any non-persistent memory
    if (!Memory.initialized) {
      Memory.initialized = true;
      Memory.tickCount = 0;
    }
    Memory.tickCount++;

    // Render the index view each tick
    const indexView = renderIndexView();
    
    // Store in memory for external tools/dashboards
    Memory.stats = indexView.stats;

    // Log the index view data (can be viewed via console)
    console.log('=== Index View ===');
    console.log(`Time: ${indexView.gameTime}, CPU: ${indexView.stats.cpu.used.toFixed(2)}/${indexView.stats.cpu.limit}`);
    console.log(`GCL: ${indexView.stats.gcl.level} (${indexView.stats.gcl.progress}/${indexView.stats.gcl.progressTotal})`);
    console.log(`Creeps: ${indexView.creeps.count}, Rooms: ${Object.keys(indexView.rooms).length}`);
    
    // Role distribution
    console.log('Roles:', JSON.stringify(indexData.creeps.byRole));

    // Your existing game logic here...
  },
  
  // Export the renderIndexView function for testing
  renderIndexView,
  
  // Re-export other utilities
  a11yStore,
  checkLandmarks,
  addLandmarkRegions,
  countDependencies
};