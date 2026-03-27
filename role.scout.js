const roleScout = {
    run: function (creep) {
        if (!creep.memory.targetRoom) {
            // Fix: Game.map.describeExits() can return null
            const exits = Game.map.describeExits(creep.room.name);

            if (exits && Object.keys(exits).length > 0) {
                const exitValues = Object.values(exits);
                creep.memory.targetRoom = exitValues[Math.floor(Math.random() * exitValues.length)];
            } else {
                // No exits found, stay in current room
                creep.say('⚠️');
                return;
            }
        }

        if (creep.memory.targetRoom) {
            if (creep.room.name !== creep.memory.targetRoom) {
                // ⚡ PERFORMANCE: Direct moveTo to room name center is efficient and handles findExit internally.
                // Avoid redundant Game.map.findExit and creep.room.findExitTo calls which are O(N) or worse.
                const result = creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom), {
                    visualizePathStyle: { stroke: '#ffffff', opacity: 0.2 },
                });

                if (result === ERR_NO_PATH || result === ERR_INVALID_ARGS) {
                    // Path not found, reset target
                    creep.memory.targetRoom = undefined;
                    creep.say('🚫');
                }
            } else {
                // Arrived at target room
                creep.say('🔍');

                // ⚡ PERFORMANCE: Per-tick caching of room objects (consistent across roles).
                // This allows sharing expensive search results across all creeps in the room.
                if (creep.room._hostileCreepsTick !== Game.time) {
                    creep.room._hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
                    creep.room._hostileCreepsTick = Game.time;
                }
                const hostiles = creep.room._hostileCreeps;

                if (creep.room._droppedResourcesTick !== Game.time) {
                    creep.room._droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
                    creep.room._droppedResourcesTick = Game.time;
                }
                const resources = creep.room._droppedResources;

                if (creep.room._allStructuresTick !== Game.time) {
                    creep.room._allStructures = creep.room.find(FIND_STRUCTURES);
                    creep.room._allStructuresTick = Game.time;
                }
                const structures = creep.room._allStructures;

                // Initialize visited memory if needed
                if (!creep.memory.visited) {
                    creep.memory.visited = {};
                }

                // Record visit
                if (!creep.memory.visited[creep.room.name]) {
                    creep.memory.visited[creep.room.name] = {
                        time: Game.time,
                        hostiles: hostiles.length,
                        resources: resources.length,
                        structures: structures.length,
                    };

                    console.log(
                        `🗺️ Scout visited ${creep.room.name}: hostiles=${hostiles.length}, resources=${resources.length}, structures=${structures.length}`
                    );
                }

                // Reset target to find new room
                creep.memory.targetRoom = undefined;
            }
        }
    },
};

module.exports = roleScout;
