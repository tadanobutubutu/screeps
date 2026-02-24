// Screeps AI - Main Loop with Error Detection
// Auto-monitoring enabled: 15-minute intervals

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleExplorer = require('role.explorer');
const roleMedic = require('role.medic');
const roleTransporter = require('role.transporter');
const roleScout = require('role.scout');
const defenseManager = require('defense.manager');
const utilsMemory = require('utils.memory');
const logger = require('utils.logging');

module.exports.loop = function () {
  try {
    // Initialize logging
    logger.init();
    
    // Clean up memory
    utilsMemory.cleanMemory();

    // Auto-spawn configuration
    const targetCreeps = {
      harvester: 2,
      upgrader: 2,
      builder: 2,
      repairer: 1,
      transporter: 1,
      scout: 1,
      medic: 1,
      explorer: 1
    };

    // Count creeps by role
    const creepCounts = {};
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      const role = creep.memory.role;
      creepCounts[role] = (creepCounts[role] || 0) + 1;
    }

    // Auto-spawn logic
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];
      
      if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
          '🛠️' + spawningCreep.memory.role,
          spawn.pos.x + 1,
          spawn.pos.y,
          { align: 'left', opacity: 0.8 }
        );
        continue;
      }

      // Find role that needs spawning
      for (const role in targetCreeps) {
        const current = creepCounts[role] || 0;
        const target = targetCreeps[role];
        
        if (current < target) {
          const newName = role + '_' + Game.time;
          const body = getBodyForRole(role, spawn.room.energyAvailable);
          
          if (body.length > 0) {
            const result = spawn.spawnCreep(body, newName, { memory: { role: role } });
            
            if (result === OK) {
              logger.info('Spawning new ' + role + ': ' + newName);
              creepCounts[role] = current + 1;
              break;
            } else if (result !== ERR_NOT_ENOUGH_ENERGY) {
              logger.warn('Failed to spawn ' + role + ': ' + result);
            }
          }
          break;
        }
      }
    }

    // Run all creeps with error handling
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      const role = creep.memory.role;

      logger.tryCatch(() => {
        switch (role) {
          case 'harvester':
            roleHarvester.run(creep);
            break;
          case 'upgrader':
            roleUpgrader.run(creep);
            break;
          case 'builder':
            roleBuilder.run(creep);
            break;
          case 'repairer':
            roleRepairer.run(creep);
            break;
          case 'explorer':
            roleExplorer.run(creep);
            break;
          case 'medic':
            roleMedic.run(creep);
            break;
          case 'transporter':
            roleTransporter.run(creep);
            break;
          case 'scout':
            roleScout.run(creep);
            break;
          default:
            logger.warn('Unknown role: ' + role);
        }
      }, 'creep_' + name);
    }

    // Run defense manager for all owned rooms
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      if (room.controller && room.controller.my) {
        logger.tryCatch(() => {
          defenseManager.run(room);
        }, 'defense_' + roomName);
      }
    }

    // Display stats every 100 ticks
    if (Game.time % 100 === 0) {
      logger.info('Tick: ' + Game.time + ', Creeps: ' + Object.keys(Game.creeps).length);
      
      const logStats = logger.getStats();
      if (logStats.errors > 0) {
        logger.warn('Recent errors: ' + logStats.errors + ' (auto-fix system active)');
      }
    }
    
  } catch (e) {
    // Top-level error catch
    if (typeof logger !== 'undefined' && logger.error) {
      logger.error('CRITICAL: Main loop exception: ' + e.message + '\n' + e.stack);
    } else {
      console.log('❌ CRITICAL ERROR: ' + e.message);
    }
  }
};

function getBodyForRole(role, energy) {
  const bodies = {
    harvester: [[WORK, WORK, CARRY, MOVE], 300],
    upgrader: [[WORK, WORK, CARRY, MOVE], 300],
    builder: [[WORK, CARRY, CARRY, MOVE], 300],
    repairer: [[WORK, CARRY, MOVE], 200],
    transporter: [[CARRY, CARRY, MOVE, MOVE], 200],
    scout: [[MOVE], 50],
    medic: [[HEAL, MOVE], 300],
    explorer: [[MOVE], 50]
  };

  const [body, cost] = bodies[role] || [[MOVE, WORK, CARRY], 200];
  
  if (energy >= cost) {
    return body;
  }
  
  // Fallback to minimal body
  return [MOVE, WORK, CARRY];
}
