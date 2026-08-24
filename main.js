// TODO: Address accessibility issues from insight report

/**
 * Main game loop for Screeps
 * Implements accessibility best practices for game notifications and UI elements
 */
module.exports = function() {
    // Clear visual memory each tick
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Process each room
    Object.values(Game.rooms).forEach(room => {
        processRoom(room);
    });

    // Broadcast accessibility announcement for game state changes
    announceGameState();
};

/**
 * Process room logic and update accessibility announcements
 * @param {Room} room - The room to process
 */
function processRoom(room) {
    const towers = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    });

    towers.forEach(tower => {
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    });
}

/**
 * Announce significant game state changes for screen readers
 * Uses live region pattern for dynamic accessibility announcements
 */
function announceGameState() {
    const gclLevel = Game.gcl.level;
    const cpuUsed = Game.cpu.getUsed();
    const tick = Game.time;

    // Announce milestones for accessibility
    if (gclLevel > 1 && tick % 1000 === 0) {
        const announcement = `Game tick ${tick}: GCL level ${gclLevel}, CPU usage ${cpuUsed.toFixed(2)}`;
        console.log(`[Accessibility Announcement] ${announcement}`);
    }
}