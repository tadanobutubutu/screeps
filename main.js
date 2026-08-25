const config = require('./config');

const dependencyGraphContent = `
dependencyGraph:
  - main.js
  - roles/harvester.js
  - roles/upgrader.js
  - roles/builder.js
`;

const indexContent = `
Index:
- main.js: Entry point for Screeps
- roles/: Unit roles
- utils/: Utility functions
`;

function init() {
    console.log('[Main] Initializing...');
    // Use dependencyGraphContent or indexContent where needed
    if (config.DEV_MODE) {
        console.log(dependencyGraphContent);
    }
}

function loop() {
    // Main game loop
    const startCpu = Game.cpu.getUsed();
    
    // Use indexContent for reference if needed
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        // TODO: Add a note or update relevant functions to use dependencyGraphContent/indexContent where needed
        // Update creep roles here
    }
    
    const usedCpu = Game.cpu.getUsed() - startCpu;
    if (config.SHOW_CPU_USAGE && usedCpu > config.CPU_WARNING_THRESHOLD) {
        console.log(`[Main] High CPU usage: ${usedCpu.toFixed(2)}`);
    }
}

// Export for Screeps
module.exports = {
    init,
    loop,
    dependencyGraphContent,
    indexContent
};