def split_process_creeps(content):
    # Locate processCreeps function
    start_marker = "function processCreeps(rooms, creeps, sites, isLoggingEnabled, isEmotionsEnabled) {"
    if start_marker not in content:
        return content

    # Extraction of inner logic into helper functions
    cleanup_dead_creeps = """function _cleanDeadCreeps() {
    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) { delete Memory.creeps[name]; }
        }
        Memory.lastCleanup = Game.time;
    }
}
"""

    update_spawn_priority = """function _updateSpawnPriority() {
    if (!Memory.spawnPriority) {
        Memory.spawnPriority = ['harvester', 'upgrader', 'builder', 'repairer'];
    }
    if (Game.time % 500 === 0) {
        const counts = {};
        Object.values(Game.creeps).forEach(c => {
            counts[c.memory.role] = (counts[c.memory.role] || 0) + 1;
        });
        Memory.spawnPriority.sort((a, b) => (counts[a] || 0) - (counts[b] || 0));
    }
}
"""

    path_cache_cleanup = """function _cleanupPathCache() {
    if (!Memory.pathCache) Memory.pathCache = {};
    if (Game.time % 1000 === 0) {
        const oldPaths = Object.keys(Memory.pathCache).filter(
            (key) => Memory.pathCache[key].tick < Game.time - 1000
        );
        oldPaths.forEach((key) => delete Memory.pathCache[key]);
    }
}
"""

    # We also need to split categorization logic from categorizeRoomStructures

    return content # Placeholder for now

# Actually it's easier to just do it manually with a full file rewrite since I have the content
