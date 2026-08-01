// Screeps Main Loop
module.exports.loop = function () {
    // Initialize memory structures if needed
    if (!Memory.creeps) Memory.creeps = {};
    if (!Memory.rooms) Memory.rooms = {};
    if (!Memory.flags) Memory.flags = {};

    // Clean up memory for dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Run each room's logic
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room.controller && room.controller.my) {
            runRoom(room);
        }
    }

    // Auto-spawn creeps if needed
    autoSpawn();
};

function runRoom(room) {
    // Room-level logic: spawn management, tower control, etc.
    const spawns = room.find(FIND_MY_SPAWNS);
    const towers = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER });

    // Run tower logic
    for (const tower of towers) {
        runTower(tower);
    }

    // Visual indicators for debugging
    room.visual.text(`🏠 ${room.name}`, 25, 25, { align: 'left', font: 18 });
}

function runTower(tower) {
    // Priority: heal injured creeps > attack hostile > repair damaged structures
    const injuredCreeps = tower.room.find(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
    if (injuredCreeps.length > 0) {
        tower.heal(injuredCreeps[0]);
        return;
    }

    const hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        tower.attack(hostiles[0]);
        return;
    }

    const damagedStructures = tower.room.find(FIND_STRUCTURES, {
        filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
    });
    if (damagedStructures.length > 0) {
        damagedStructures.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax);
        tower.repair(damagedStructures[0]);
    }
}

function autoSpawn() {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        if (spawn.spawning) continue;

        const room = spawn.room;
        const energyAvailable = room.energyAvailable;
        const energyCapacity = room.energyCapacityAvailable;

        // Count existing creeps by role
        const harvesters = _.filter(Game.creeps, c => c.memory.role === 'harvester' && c.memory.home === room.name).length;
        const upgraders = _.filter(Game.creeps, c => c.memory.role === 'upgrader' && c.memory.home === room.name).length;
        const builders = _.filter(Game.creeps, c => c.memory.role === 'builder' && c.memory.home === room.name).length;

        // Simple spawn priority logic
        let body = null;
        let role = null;

        if (harvesters < 2) {
            role = 'harvester';
            body = getWorkerBody(energyCapacity, [WORK, CARRY, MOVE]);
        } else if (upgraders < 1) {
            role = 'upgrader';
            body = getWorkerBody(energyCapacity, [WORK, CARRY, MOVE]);
        } else if (builders < 1 && room.find(FIND_CONSTRUCTION_SITES).length > 0) {
            role = 'builder';
            body = getWorkerBody(energyCapacity, [WORK, CARRY, MOVE]);
        }

        if (body && role) {
            const name = `${role}_${Game.time}`;
            const result = spawn.spawnCreep(body, name, {
                memory: { role, home: room.name, working: false }
            });
            if (result === OK) {
                console.log(`Spawning new ${role}: ${name} in ${room.name}`);
            }
        }
    }
}

function getWorkerBody(energyCapacity, pattern) {
    const body = [];
    let cost = 0;
    const partCosts = { [WORK]: 100, [CARRY]: 50, [MOVE]: 50 };

    while (true) {
        let added = false;
        for (const part of pattern) {
            const newCost = cost + partCosts[part];
            if (newCost <= energyCapacity && body.length < 50) {
                body.push(part);
                cost = newCost;
                added = true;
            }
        }
        if (!added) break;
    }
    return body;
}