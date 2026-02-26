var roleExplorer = {
    run: function (creep) {
        // メモリにターゲットの部屋がなければ設定（例: 隣の部屋）
        if (!creep.memory.targetRoom) {
            const exits = Game.map.describeExits(creep.room.name);

            // Check if exits is valid
            if (!exits || Object.keys(exits).length === 0) {
                // No exits available, stay in current room
                creep.say('🤔 No exits');
                creep.moveTo(25, 25);
                return;
            }

            const exitDir = Object.keys(exits)[0];
            creep.memory.targetRoom = exits[exitDir];
        }

        if (creep.room.name !== creep.memory.targetRoom) {
            const exitDir = creep.room.findExitTo(creep.memory.targetRoom);

            // Check if exit direction is valid
            if (exitDir === ERR_NO_PATH || exitDir === ERR_INVALID_ARGS) {
                // Cannot find exit, reset target
                creep.say('❌ No path');
                delete creep.memory.targetRoom;
                return;
            }

            const exit = creep.pos.findClosestByRange(exitDir);

            if (exit) {
                creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffffff' } });
            } else {
                // No exit found, reset target
                delete creep.memory.targetRoom;
            }
        } else {
            // 部屋に着いたら適当に動いて視界を確保
            creep.moveTo(25, 25);
            creep.say('👀 scouting');

            // After exploring, find new target
            if (creep.pos.x === 25 && creep.pos.y === 25) {
                const exits = Game.map.describeExits(creep.room.name);
                if (exits && Object.keys(exits).length > 0) {
                    // Pick a random exit
                    const exitDirs = Object.keys(exits);
                    const randomDir = exitDirs[Math.floor(Math.random() * exitDirs.length)];
                    creep.memory.targetRoom = exits[randomDir];
                }
            }
        }
    },
};
module.exports = roleExplorer;
