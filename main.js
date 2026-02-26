// Screeps AI - Z世代向けドーパミン爆発システム
// Adaptive Load Management - CPU/メモリに応じて機能を動的に制御

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
const EmotionSystem = require('utils.emotions');
const memVis = require('memory.visualizer');
const autoTutorial = require('tutorial.auto');
const gamification = require('gamification');
const vfx = require('visual.effects');
const autoEvolution = require('auto.evolution');
const adaptiveSystem = require('system.adaptive');

module.exports.loop = function () {
  try {
    // ⚡ ADAPTIVE SYSTEM - 現在の負荷を評価
    const systemMode = adaptiveSystem.evaluate();
    
    // 最優先: メモリクリーンアップ
    utilsMemory.cleanMemory();
    
    // EMERGENCYモード時は緊急クリーンアップ
    if (systemMode === adaptiveSystem.MODE.EMERGENCY) {
      if (Game.time % 100 === 0) {
        adaptiveSystem.emergencyCleanup();
      }
    }
    
    // 🎮 TUTORIAL MODE
    if (adaptiveSystem.isEnabled('tutorial') && autoTutorial.isTutorial()) {
      console.log('🤖 AUTO TUTORIAL MODE ACTIVE');
      autoTutorial.run();
      autoTutorial.showProgress();
      return;
    }
    
    // Initialize systems (機能有効時のみ)
    if (adaptiveSystem.isEnabled('logging')) {
      logger.init();
    }
    
    if (adaptiveSystem.isEnabled('gamification')) {
      gamification.init();
      gamification.updateStreak();
    }
    
    // 💾 Memory visualizer
    if (adaptiveSystem.isEnabled('memoryVisualizer')) {
      if (Game.time % 20 === 0) {
        memVis.recordSnapshot();
      }
      
      if (Game.time % 200 === 0) {
        memVis.cleanup();
      }
    }
    
    // 💾 Auto backup
    if (adaptiveSystem.isEnabled('memoryVisualizer')) {
      if (Game.time % 2000 === 0) {
        memVis.backup();
      }
    }
    
    // 🎮 Gamification
    if (adaptiveSystem.isEnabled('gamification')) {
      if (Game.time % 100 === 0) {
        gamification.checkMilestones();
      }
      
      if (Game.time % 10 === 0) {
        gamification.renderDashboard();
      }
    }
    
    // 🤖 AUTO EVOLUTION
    if (adaptiveSystem.isEnabled('autoEvolution')) {
      if (Game.time % 1000 === 0) {
        autoEvolution.run();
      }
    }

    // Auto-spawn configuration
    const targetCreeps = adaptiveSystem.isEnabled('advancedRoles') ? {
      harvester: 2,
      upgrader: 2,
      builder: 2,
      repairer: 1,
      transporter: 1,
      scout: 1,
      medic: 1,
      explorer: 1
    } : {
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
        if (adaptiveSystem.isEnabled('logging')) {
          logger.warn('Creep ' + name + ' had no role, set to harvester');
        }
      }
      
      creepCounts[creep.memory.role] = (creepCounts[creep.memory.role] || 0) + 1;
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
        
        // スポーンエフェクト (FULLモードのみ)
        if (adaptiveSystem.isEnabled('visualEffects') && Game.time % 5 === 0) {
          vfx.stars(spawn.pos, 5);
        }
        
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
              if (adaptiveSystem.isEnabled('logging')) {
                logger.info('Spawning new ' + role + ': ' + newName);
              }
              creepCounts[role] = current + 1;
              
              // スポーン成功エフェクト
              if (adaptiveSystem.isEnabled('visualEffects')) {
                vfx.successExplosion(spawn.pos);
              }
              if (adaptiveSystem.isEnabled('gamification')) {
                gamification.addXP(20, 'Spawned ' + role);
              }
              
              break;
            } else if (result !== ERR_NOT_ENOUGH_ENERGY) {
              if (adaptiveSystem.isEnabled('logging')) {
                logger.warn('Failed to spawn ' + role + ': ' + result);
              }
            }
          }
          break;
        }
      }
    }

    // Run all creeps
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      const role = creep.memory.role;
      
      if (!role) {
        creep.memory.role = 'harvester';
        continue;
      }

      const runCreepLogic = function() {
        // 😊 Emotions (NORMAL以上)
        if (adaptiveSystem.isEnabled('emotions')) {
          EmotionSystem.display(creep);
        }
        
        // Run role logic
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
            if (adaptiveSystem.isEnabled('advancedRoles')) {
              roleExplorer.run(creep);
            }
            break;
          case 'medic':
            if (adaptiveSystem.isEnabled('advancedRoles')) {
              roleMedic.run(creep);
            }
            break;
          case 'transporter':
            if (adaptiveSystem.isEnabled('advancedRoles')) {
              roleTransporter.run(creep);
            }
            break;
          case 'scout':
            if (adaptiveSystem.isEnabled('advancedRoles')) {
              roleScout.run(creep);
            }
            break;
          default:
            if (adaptiveSystem.isEnabled('logging')) {
              logger.warn('Unknown role: ' + role);
            }
            creep.memory.role = 'harvester';
        }
      };
      
      if (adaptiveSystem.isEnabled('logging')) {
        logger.tryCatch(runCreepLogic, 'creep_' + name);
      } else {
        try {
          runCreepLogic();
        } catch (e) {
          console.log('Error in creep ' + name + ': ' + e.message);
        }
      }
    }
    
    // 👥 Social interactions (FULLモードのみ)
    if (adaptiveSystem.isEnabled('socialInteractions') && Game.time % 100 === 0) {
      const creeps = Object.values(Game.creeps);
      for (let i = 0; i < creeps.length; i++) {
        for (let j = i + 1; j < creeps.length; j++) {
          if (Math.random() > 0.7) {
            EmotionSystem.interact(creeps[i], creeps[j]);
          }
        }
      }
    }

    // Defense manager (MINIMAL以上)
    if (adaptiveSystem.isEnabled('defense')) {
      for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room.controller && room.controller.my) {
          const runDefense = function() {
            defenseManager.run(room);
          };
          
          if (adaptiveSystem.isEnabled('logging')) {
            logger.tryCatch(runDefense, 'defense_' + roomName);
          } else {
            try {
              runDefense();
            } catch (e) {
              console.log('Error in defense ' + roomName + ': ' + e.message);
            }
          }
        }
      }
    }

    // Display stats
    if (Game.time % 100 === 0) {
      console.log('\n⚡ Tick: ' + Game.time + ', Mode: ' + adaptiveSystem.getModeName(systemMode).toUpperCase());
      console.log('👥 Creeps: ' + Object.keys(Game.creeps).length);
      console.log('💡 CPU: ' + Game.cpu.getUsed().toFixed(2) + '/' + Game.cpu.limit + 
                  ' (Bucket: ' + Game.cpu.bucket + ')');
      console.log('💾 Memory: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB');
      
      if (adaptiveSystem.isEnabled('logging')) {
        const logStats = logger.getStats();
        if (logStats.errors > 0) {
          logger.warn('Recent errors: ' + logStats.errors);
        }
      }
      
      if (adaptiveSystem.isEnabled('emotions')) {
        const emotionStats = EmotionSystem.getStats();
        console.log('😊 Happy: ' + (emotionStats.veryHappy + emotionStats.happy) + 
                    ', Neutral: ' + emotionStats.neutral);
      }
      
      if (adaptiveSystem.isEnabled('gamification')) {
        const gm = Memory.gamification;
        if (gm) {
          console.log('🎮 Level: ' + gm.level + ', XP: ' + gm.xp + '/' + gm.xpToNext);
        }
      }
    }
    
  } catch (e) {
    console.log('❌ CRITICAL ERROR: ' + e.message);
    if (e.stack) {
      console.log(e.stack);
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

  const body = bodies[role] || [[MOVE, WORK, CARRY], 200];
  const cost = body[1];
  const parts = body[0];
  
  if (energy >= cost) {
    return parts;
  }
  
  return [MOVE, WORK, CARRY];
}

// ==============================================
// ⌨️ CONSOLE COMMANDS
// ==============================================

// ⚡ Adaptive System
global.adaptive = adaptiveSystem.showDashboard.bind(adaptiveSystem);
global.mode = adaptiveSystem.setMode.bind(adaptiveSystem);

// 😊 Emotion commands
global.e = EmotionSystem.getStats.bind(EmotionSystem);
global.ec = EmotionSystem.checkCreep.bind(EmotionSystem);

// 💾 Memory commands  
global.m = memVis.showStats.bind(memVis);
global.mh = memVis.showHistory.bind(memVis);
global.ml = memVis.showLeaderboard.bind(memVis);
global.md = memVis.readDiary.bind(memVis);
global.mm = memVis.showMap.bind(memVis);
global.mc = memVis.cleanup.bind(memVis);
global.mb = memVis.backup.bind(memVis);
global.mr = memVis.restore.bind(memVis);

// 🎮 Tutorial commands
global.t = autoTutorial.showProgress.bind(autoTutorial);
global.ts = autoTutorial.skipIfPossible.bind(autoTutorial);

// ✨ Gamification commands
global.g = gamification.showDashboard.bind(gamification);
global.gr = gamification.reset.bind(gamification);

// 🤖 Auto Evolution commands
global.evo = autoEvolution.showDashboard.bind(autoEvolution);
global.evor = autoEvolution.reset.bind(autoEvolution);

// Helper function
global.help = function() {
  console.log('\n✨ === Quick Commands === ✨');
  console.log('\n⚡ Adaptive System:');
  console.log('  adaptive() - system dashboard');
  console.log('  mode(0-3)  - force mode (0=EMERGENCY, 1=MINIMAL, 2=NORMAL, 3=FULL)');
  console.log('\n😊 Emotions:');
  console.log('  e()        - emotion stats');
  console.log('  ec(name)   - check creep');
  console.log('\n💾 Memory:');
  console.log('  m()        - memory stats');
  console.log('  mh()       - history');
  console.log('  ml()       - leaderboard');
  console.log('  mc()       - cleanup');
  console.log('\n🎮 Gamification:');
  console.log('  g()        - dashboard');
  console.log('\n🤖 Auto Evolution:');
  console.log('  evo()      - dashboard');
};

if (!Memory.helpShown) {
  Memory.helpShown = true;
  global.help();
}
