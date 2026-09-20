/*
 * Screeps AI - Main Game Loop
 * Addresses accessibility issues from insight report
 */

const roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    defender: require('role.defender'),
    healer: require('role.healer')
};

// Accessibility: Track active towers for screen reader announcements
const accessibleTowers = [];

function announceToScreenReader(message) {
    // Announce important game events for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only'; // Screen reader only class
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 5000);
}

module.exports.loop = function() {
    // Accessibility: Announce critical resource warnings
    const energy = Game.spawns['Spawn1'].room.energyAvailable;
    const capacity = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    
    if (energy < capacity * 0.2) {
        announceToScreenReader('Warning: Low energy. Current: ' + energy);
    }
    
    // Clear dead creeps from memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Get creep counts by role for accessibility
    const creepCounts = {};
    for (const role in roles) {
        creepCounts[role] = Object.keys(Game.creeps).filter(
            name => Game.creeps[name].memory.role === role
        ).length;
    }
    
    // Announce role changes if needed
    if (creepCounts.harvester < 2) {
        announceToScreenReader('Alert: Low harvester count');
    }
    
    // Spawn creeps
    const maxHarvesters = 4;
    const maxUpgraders = 3;
    const maxBuilders = 2;
    
    const energyLevel = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    let body = [WORK, CARRY, MOVE];
    
    if (energyLevel >= 300) {
        body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }
    
    if (energyLevel >= 450) {
        body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    }
    
    if (Object.keys(Game.creeps).length < 10) {
        if (creepCounts.harvester < maxHarvesters) {
            Game.spawns['Spawn1'].spawnCreep(body, 'Harvester' + Game.time, {
                memory: { role: 'harvester' }
            });
        } else if (creepCounts.upgrader < maxUpgraders) {
            Game.spawns['Spawn1'].spawnCreep(body, 'Upgrader' + Game.time, {
                memory: { role: 'upgrader' }
            });
        } else if (creepCounts.builder < maxBuilders) {
            Game.spawns['Spawn1'].spawnCreep(body, 'Builder' + Game.time, {
                memory: { role: 'builder' }
            });
        }
    }
    
    // Run role tasks with accessibility announcements
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        const role = creep.memory.role;
        
        if (roles[role]) {
            roles[role].run(creep);
            
            // Accessibility: Announce when a creep is killed
            if (creep.hits < creep.hitsMax) {
                announceToScreenReader('Warning: ' + creep.name + ' is damaged');
            }
        }
    }
    
    // Tower defense with accessibility
    const towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    });
    
    for (const tower of towers) {
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if (closestHostile) {
            tower.attack(closestHostile);
            announceToScreenReader('Tower engaging hostile target');
        } else {
            // Heal damaged allies
            const closestDamaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (creep) => creep.hits < creep.hitsMax
            });
            
            if (closestDamaged) {
                tower.heal(closestDamaged);
            }
        }
    }
    
    // Accessibility: Provide status summary every 100 ticks
    if (Game.time % 100 === 0) {
        const summary = 'Game status: ' + 
            Object.keys(Game.creeps).length + ' active creeps. ' +
            'Energy: ' + energy + ' of ' + capacity + '.';
        announceToScreenReader(summary);
    }
    
    // Visual accessibility: Ensure game canvas has proper focus management
    const canvas = document.querySelector('canvas');
    if (canvas && !canvas.getAttribute('aria-label')) {
        canvas.setAttribute('aria-label', 'Screeps game view');
        canvas.setAttribute('role', 'application');
    }
};

// Helper function for accessible damage reports
function getAccessibleDamageReport(creep) {
    const percent = Math.round((creep.hits / creep.hitsMax) * 100);
    let status = 'healthy';
    
    if (percent < 25) status = 'critical';
    else if (percent < 50) status = 'heavily damaged';
    else if (percent < 75) status = 'damaged';
    
    return `${creep.name}: ${percent}% health - ${status}`;
}