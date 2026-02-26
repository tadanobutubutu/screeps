const roleScout = {
    run: function (creep) {
        if (!creep.memory.targetRoom) {
            // Fix: Game.map.describeExits() can return null
            const exits = Game.map.describeExits(creep.room.name);

            if (exits && Object.keys(exits).length > 0) {
                const rooms = Object.keys(exits);
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
                const exitDir = Game.map.findExit(creep.room.name, creep.memory.targetRoom);
                const exit = creep.room.findExitTo(creep.memory.targetRoom);

                if (exitDir !== ERR_NO_PATH && exit !== ERR_NO_PATH) {
                    creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom));
                } else {
                    // Path not found, reset target
                    creep.memory.targetRoom = undefined;
                    creep.say('🚫');
                }
            } else {
                // Arrived at target room
                creep.say('🔍');

                // Scan room
                const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                const resources = creep.room.find(FIND_DROPPED_RESOURCES);
                const structures = creep.room.find(FIND_STRUCTURES);

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
