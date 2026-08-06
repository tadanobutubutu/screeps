// Main entry point for Screeps
module.exports = loop;

function loop() {
    // Memory cleanup - run periodically or when cache is stale
    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) { 
                delete Memory.creeps[name]; 
            }
        }
        Memory.lastCleanup = Game.time;
    }

    // Main game loop
    // Add your game logic here
    
    // Example: Run each creep's mission
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        // Process creep logic based on role or memory
        if (creep.memory && creep.memory.role) {
            // Role-based behavior would go here
        }
    }
}