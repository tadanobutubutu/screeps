// Exported constants
export const FIND_SOURCE = SOURCE;
export const LOOP_INTERVAL = 1000;
export const THINK_INTERVAL = 10;

// Exported modules and managers
export * from './controllers/roomController';
export * from './managers/boostManager';
export * from './managers/creepManager';
export * from './managers/spawnManager';
export * from './managers/towerManager';
export * from './managers/haulerManager';
export * from './managers/observerManager';

// Exported roles
export * from './roles/builder';
// Other existing exports...

// New functions (additional examples added for context)
export function calculateCreepProductivity(creep) {
    // Example logic for prioritization
    return creep.room.find(FIND_SOURCES_ACTIVE).length;
}

export function optimizeEnergyHarvesting(source) {
    // Example energy optimization logic
    return source.energyCapacityAvailable * 0.8;
}

// New function from the issue (example)
export function prioritizeTasks(tasks) {
    // Example implementation
    return tasks.sort((a, b) => b.priority - a.priority);
}