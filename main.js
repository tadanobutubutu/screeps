const _ = require('lodash');
const roles = require('roles');

function loop() {
    // Clean up memory
    for(const name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Count creeps by role
    const creepCounts = {};
    for(const name in Game.creeps) {
        const creep = Game.creeps[name];
        const role = creep.memory.role;
        creepCounts[role] = creepCounts[role] || 0;
        creepCounts[role]++;
    }

    // Spawn creeps
    const energy = Game.spawns['Spawn1'].room.energyAvailable;
    const energyCapacity = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    
    if(energy >= 300 && (!creepCounts.worker || creepCounts.worker < 3)) {
        const name = 'Worker_' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], name, {
            memory: { role: 'worker' }
        });
    }

    // Assign and run roles
    for(const name in Game.creeps) {
        const creep = Game.creeps[name];
        if(roles[creep.memory.role]) {
            roles[creep.memory.role].run(creep);
        }
    }
}

function calculateRoomStats() {
    const rooms = Object.values(Game.rooms);
    const stats = {
        totalEnergy: 0,
        totalCreeps: 0,
        rooms: {}
    };
    
    for(const room of rooms) {
        const roomData = {
            energy: room.energyAvailable,
            energyCapacity: room.energyCapacityAvailable,
            controllerLevel: room.controller ? room.controller.level : 0,
            creeps: _.filter(Game.creeps, { room: room })
        };
        
        stats.rooms[room.name] = roomData;
        stats.totalEnergy += roomData.energy;
        stats.totalCreeps += roomData.creeps.length;
    }
    
    return stats;
}

function getBestSource() {
    const room = Game.spawns['Spawn1'].room;
    const sources = room.find(FIND_SOURCES);
    
    if(sources.length === 0) return null;
    
    let bestSource = sources[0];
    let maxEnergy = 0;
    
    for(const source of sources) {
        const energy = source.energy;
        if(energy > maxEnergy) {
            maxEnergy = energy;
            bestSource = source;
        }
    }
    
    return bestSource;
}

function assignCreepsToTasks() {
    const creeps = Object.values(Game.creeps);
    const tasks = [];
    
    // Gather tasks
    const structures = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
    });
    
    for(const struct of structures) {
        tasks.push({
            type: 'fill',
            target: struct,
            priority: 1
        });
    }
    
    // Assign creeps to tasks
    for(const creep of creeps) {
        if(creep.memory.task) continue;
        
        if(tasks.length > 0) {
            const task = tasks.shift();
            creep.memory.task = task;
            task.assigned = creep;
        }
    }
}

module.exports = {
    loop: loop,
    calculateRoomStats,
    getBestSource,
    assignCreepsToTasks
};