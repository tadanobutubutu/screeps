/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded objects can crash the AI.
 */
/* global ERR_NO_PATH, ERR_INVALID_ARGS, FIND_DROPPED_RESOURCES */
const MAX_VISITED_ROOMS = 100;

// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_SCOUT = { visualizePathStyle: { stroke: '#ffffff', opacity: 0.2 } };

const roleScout = {
    run: function (creep) {
        if (!creep.memory.targetRoom) {
            // Note: Game.map.describeExits() can return null
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
                const result = creep.moveTo(
                    new RoomPosition(25, 25, creep.memory.targetRoom),
                    PATH_STYLE_SCOUT
                );

                if (result === ERR_NO_PATH || result === ERR_INVALID_ARGS) {
                    // Path not found, reset target
                    creep.memory.targetRoom = undefined;
                    creep.say('🚫');
                }
            } else {
                // Arrived at target room
                creep.say('🔍');

                // ⚡ PERFORMANCE: Use pre-warmed room caches for hostiles and structures.
                // Note: dropped resources are still fetched per room visit if not already cached.
                const hostiles = creep.room._hostileCreeps || [];
                const structures = creep.room._allStructures || [];

                if (creep.room._droppedResourcesTick !== Game.time) {
                    creep.room._droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
                    creep.room._droppedResourcesTick = Game.time;
                }
                const resources = creep.room._droppedResources;

                // Initialize visited memory if needed
                if (!creep.memory.visited) {
                    creep.memory.visited = {};
                    creep.memory.visitedCount = 0;
                }

                // Record visit
                const roomName = creep.room.name;
                // Security: Enforce size limits on the visited object to prevent Memory DoS.
                // While room names are engine-provided, unbounded growth still poses a risk.
                if (!Object.prototype.hasOwnProperty.call(creep.memory.visited, roomName)) {
                    // PERFORMANCE: Using a counter to avoid O(N) Object.keys().length calls.
                    if ((creep.memory.visitedCount || 0) < MAX_VISITED_ROOMS) {
                        creep.memory.visited[roomName] = {
                            time: Game.time,
                            hostiles: hostiles.length,
                            resources: resources.length,
                            structures: structures.length,
                        };
                        creep.memory.visitedCount = (creep.memory.visitedCount || 0) + 1;

                        }
                }

                // Reset target to find new room
                creep.memory.targetRoom = undefined;
            }
        }
    },
};

module.exports = roleScout;
