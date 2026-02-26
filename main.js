// Screeps AI - EMERGENCY CPU RECOVERY MODE
// すべての非必須機能を無効化

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const utilsMemory = require('utils.memory');
const logger = require('utils.logging');

module.exports.loop = function () {
  try {
    // 最優先: メモリクリーンアップ
    utilsMemory.cleanMemory();
    
    // 1000ティックに1回だけ大規模クリーンアップ
    if (Game.time % 1000 === 0) {
      // 不要なMemory削除
      delete Memory.evolution;
      delete Memory.gamification;
      delete Memory.emotions;
      delete Memory.memorySnapshots;
      delete Memory.backup;
      console.log('🧹 Emergency memory cleanup completed');
    }
    
    // Auto-spawn configuration (最小限)
    const targetCreeps = {
      harvester: 2,
      upgrader: 1,
      builder: 1,
      repairer: 1
    };

    // Count creeps by role
    const creepCounts = {};
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      const role = creep.memory.role;
      
      if (!role) {
        creep.memory.role = 'harvester';
      }
      
      creepCounts[creep.memory.role] = (creepCounts[creep.memory.role] || 0) + 1;
    }

    // Auto-spawn logic (シンプル版)
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];
      
      if (spawn.spawning) {
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
              creepCounts[role] = current + 1;
              break;
            }
          }
          break;
        }
      }
    }

    // Run all creeps (最小限)
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      const role = creep.memory.role;
      
      if (!role) {
        creep.memory.role = 'harvester';
        continue;
      }

      try {
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
          default:
            creep.memory.role = 'harvester';
        }
      } catch (e) {
        console.log('Error in creep ' + name + ': ' + e.message);
      }
    }

    // Stats (500ティックに1回)
    if (Game.time % 500 === 0) {
      console.log('⚡ CPU: ' + Game.cpu.getUsed().toFixed(2) + '/' + Game.cpu.limit);
      console.log('📦 Bucket: ' + Game.cpu.bucket);
      console.log('👥 Creeps: ' + Object.keys(Game.creeps).length);
      console.log('💾 Memory: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB');
    }
    
  } catch (e) {
    console.log('❌ CRITICAL ERROR: ' + e.message);
  }
};

function getBodyForRole(role, energy) {
  // 最小限のボディ
  if (energy >= 300) {
    if (role === 'harvester') return [WORK, WORK, CARRY, MOVE];
    if (role === 'upgrader') return [WORK, WORK, CARRY, MOVE];
    if (role === 'builder') return [WORK, CARRY, CARRY, MOVE];
    if (role === 'repairer') return [WORK, CARRY, MOVE];
  }
  
  if (energy >= 200) {
    return [WORK, CARRY, MOVE];
  }
  
  return [MOVE, WORK, CARRY];
}

// 緊急コマンド
global.status = function() {
  console.log('\n⚡ === EMERGENCY STATUS === ⚡');
  console.log('CPU Used: ' + Game.cpu.getUsed().toFixed(2) + '/' + Game.cpu.limit);
  console.log('CPU Bucket: ' + Game.cpu.bucket + '/10000');
  console.log('Memory: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB / 2048 KB');
  console.log('Creeps: ' + Object.keys(Game.creeps).length);
  console.log('\nWaiting for CPU bucket to recover...');
  console.log('Type status() to check again.');
};

global.clean = function() {
  delete Memory.evolution;
  delete Memory.gamification;
  delete Memory.emotions;
  delete Memory.memorySnapshots;
  delete Memory.backup;
  delete Memory.diary;
  delete Memory.achievements;
  console.log('🧹 Manual cleanup completed!');
  console.log('Memory now: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB');
};

console.log('\n🚨 EMERGENCY MODE ACTIVE 🚨');
console.log('All non-essential features disabled.');
console.log('Commands: status() - check status, clean() - clean memory');
