// Memory Visualizer Module

const MemoryVisualizer = {
    // Visualize memory usage patterns
    visualize: function() {
        const memory = Memory;
        const usage = {
            creeps: Object.keys(memory.creeps || {}).length,
            rooms: Object.keys(memory.rooms || {}).length
        };
        return usage;
    },

    // Get memory statistics
    getStats: function() {
        const stats = {
            totalCreeps: 0,
            totalRooms: 0
        };
        
        if (Memory.creeps) {
            stats.totalCreeps = Object.keys(Memory.creeps).length;
        }
        if (Memory.rooms) {
            stats.totalRooms = Object.keys(Memory.rooms).length;
        }
        
        return stats;
    },

    // Clear old memory entries
    cleanup: function() {
        const threshold = 1000;
        let cleaned = 0;
        
        for (const roomName in Memory.rooms) {
            const roomMemory = Memory.rooms[roomName];
            if (roomMemory && roomMemory.lastAccessed) {
                const lastAccess = roomMemory.lastAccessed;
                if (Game.time - lastAccess > threshold) {
                    delete Memory.rooms[roomName];
                    cleaned++;
                }
            }
        }
        
        return cleaned;
    }
};

module.exports = MemoryVisualizer;