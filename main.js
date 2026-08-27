// Screeps Bot main.js
// Main loop for our Screeps bot

import { Game } from 'screeps';

// Main loop function called every game tick
export function loop() {
    // Log the current game tick for debugging
    console.log(`Game tick: ${Game.time}`);
    
    // Iterate over all creeps and assign tasks
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        
        // If creep is idle, find energy source
        if (!creep.memory.task) {
            const source = creep.pos.findClosestByRange(FIND_SOURCES);
            if (source) {
                creep.memory.task = 'harvest';
                creep.memory.targetId = source.id;
            }
        }
        
        // Execute assigned task
        if (creep.memory.task === 'harvest') {
            const target = Game.getObjectById(creep.memory.targetId);
            if (target && creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                // Task complete or target invalid
                creep.memory.task = null;
            }
        }
    }
    
    // Additional bot logic can be added here
}