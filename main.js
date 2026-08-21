// Screeps Main Loop
// This file manages the game logic for your Screeps AI

// Define your roles
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

// Main loop function
function loop() {
    // Display memory usage
    const memoryUsage = JSON.stringify(Memory).length;
    console.log(`Memory usage: ${memoryUsage} characters`);

    // Clean up dead creeps' memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Cleared non-existing creep memory: ${name}`);
        }
    }

    // Count available energy
    const availableEnergy = Game.spawns['Spawn1'].room.energyAvailable;
    console.log(`Available energy: ${availableEnergy}`);

    // Get spawn
    const spawn = Game.spawns['Spawn1'];

    // Determine how many creeps of each role we need
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

    console.log(`Harvesters: ${harvesters.length}`);
    console.log(`Upgraders: ${upgraders.length}`);
    console.log(`Builders: ${builders.length}`);

    // Spawn new creeps if needed
    const minHarvesters = 3;
    const minUpgraders = 2;
    const minBuilders = 2;

    if (harvesters.length < minHarvesters) {
        const newName = `Harvester${Game.time}`;
        const energyCapacity = spawn.room.energyCapacityAvailable;
        
        if (spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'harvester' }
        }) === OK) {
            console.log(`Spawning new harvester: ${newName}`);
        }
    } else if (upgraders.length < minUpgraders) {
        const newName = `Upgrader${Game.time}`;
        
        if (spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'upgrader' }
        }) === OK) {
            console.log(`Spawning new upgrader: ${newName}`);
        }
    } else if (builders.length < minBuilders) {
        const newName = `Builder${Game.time}`;
        
        if (spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'builder' }
        }) === OK) {
            console.log(`Spawning new builder: ${newName}`);
        }
    }

    // Display spawn status if currently spawning
    if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            `🛠️ ${spawningCreep.memory.role}`,
            spawn.pos.x + 1,
            spawn.pos.y,
            { align: 'left', opacity: 0.8 }
        );
    }

    // Run role logic for all creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
}

// Export the loop function for Screeps to use
module.exports = { loop };